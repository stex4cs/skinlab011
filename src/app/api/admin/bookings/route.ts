import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { name, email, phone, treatmentId, date, time, message } = body;

  if (!name || !treatmentId || !date || !time) {
    return NextResponse.json(
      { error: "Obavezna polja: ime klijenta, tretman, datum i vrijeme." },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();

  const { data: treatment } = await supabase
    .from("treatments")
    .select("*, treatment_categories(*)")
    .eq("id", treatmentId)
    .single();

  if (!treatment) {
    return NextResponse.json({ error: "Tretman nije pronađen." }, { status: 404 });
  }

  const bookingId = `BOOK-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const { error } = await supabase.from("bookings").insert({
    booking_id: bookingId,
    client_name: name,
    client_email: email || null,
    client_phone: phone || null,
    treatment_id: treatmentId,
    treatment_name: treatment.name_me,
    category_id: treatment.category_id,
    booking_date: date,
    booking_time: time,
    duration_minutes: treatment.duration_minutes || 60,
    message: message || null,
    status: "confirmed",
    locale: "me",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, bookingId });
}
