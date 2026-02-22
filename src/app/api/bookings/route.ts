import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendAdminNotification, sendClientConfirmation } from "@/lib/email";
import { timeToMinutes } from "@/lib/constants";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, phone, treatmentId, date, time, message, locale } = body;

    // Basic validation
    if (!name || !email || !phone || !treatmentId || !date || !time) {
      return NextResponse.json({ success: false, message: "Sva obavezna polja moraju biti popunjena." }, { status: 400 });
    }

    const supabase = createAdminClient();

    // Get treatment info (including duration)
    const { data: treatment } = await supabase
      .from("treatments")
      .select("*, treatment_categories(*)")
      .eq("id", treatmentId)
      .single();

    if (!treatment) {
      return NextResponse.json({ success: false, message: "Tretman nije pronađen." }, { status: 404 });
    }

    const treatmentDuration = treatment.duration_minutes || 60;

    // Check availability using overlap detection
    const { data: existingBookings } = await supabase
      .from("bookings")
      .select("booking_time, duration_minutes")
      .eq("booking_date", date)
      .in("status", ["pending", "confirmed"]);

    const newStart = timeToMinutes(time);
    const newEnd = newStart + treatmentDuration;

    const hasConflict = existingBookings?.some((b) => {
      const bStart = timeToMinutes(b.booking_time.slice(0, 5));
      const bDuration = b.duration_minutes || 60;
      const bEnd = bStart + bDuration;
      return newStart < bEnd && newEnd > bStart;
    }) ?? false;

    if (hasConflict) {
      return NextResponse.json({ success: false, message: "Izabrani termin nije dostupan. Molimo izaberite drugi." }, { status: 409 });
    }

    // Generate booking ID
    const bookingId = `BOOK-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

    // Determine treatment name by locale
    const treatmentName = locale === "en" ? treatment.name_en
      : locale === "ru" ? treatment.name_ru
      : treatment.name_me;

    // Save to database (including duration for future overlap checks)
    const { error } = await supabase.from("bookings").insert({
      booking_id: bookingId,
      client_name: name,
      client_email: email,
      client_phone: phone,
      treatment_id: treatmentId,
      treatment_name: treatmentName,
      category_id: treatment.category_id,
      booking_date: date,
      booking_time: time,
      duration_minutes: treatmentDuration,
      message: message || null,
      status: "pending",
      locale: locale || "me",
    });

    if (error) {
      console.error("DB insert error:", error);
      return NextResponse.json({ success: false, message: "Greška pri čuvanju rezervacije." }, { status: 500 });
    }

    const emailData = {
      bookingId,
      clientName: name,
      clientEmail: email,
      clientPhone: phone,
      treatmentName,
      date,
      time,
      message,
    };

    // Send emails (don't fail if email fails)
    try {
      await Promise.all([
        sendAdminNotification(emailData),
        sendClientConfirmation(emailData),
      ]);
    } catch (emailErr) {
      console.error("Email error (non-fatal):", emailErr);
    }

    return NextResponse.json({ success: true, bookingId });
  } catch (err) {
    console.error("Booking error:", err);
    return NextResponse.json({ success: false, message: "Greška servera. Molimo pokušajte ponovo." }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const date = searchParams.get("date");
  const limit = parseInt(searchParams.get("limit") || "50");

  const supabase = createAdminClient();

  let query = supabase
    .from("bookings")
    .select("*, treatment_categories(color, name_me, name_en, name_ru)")
    .order("booking_date", { ascending: false })
    .order("booking_time", { ascending: true })
    .limit(limit);

  if (status) query = query.eq("status", status);
  if (date) query = query.eq("booking_date", date);

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
