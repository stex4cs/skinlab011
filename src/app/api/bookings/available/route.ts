import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { TIME_SLOTS, BUSINESS_HOURS } from "@/lib/constants";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");

  if (!date) {
    return NextResponse.json({ error: "Date is required" }, { status: 400 });
  }

  // Check if the day is a working day
  const dayOfWeek = new Date(date).toLocaleDateString("en", { weekday: "short" }).toLowerCase() as keyof typeof BUSINESS_HOURS;
  const hours = BUSINESS_HOURS[dayOfWeek];

  if (!hours) {
    return NextResponse.json({ slots: [], bookedSlots: [], closed: true });
  }

  const supabase = createAdminClient();

  const { data: bookings } = await supabase
    .from("bookings")
    .select("booking_time")
    .eq("booking_date", date)
    .in("status", ["pending", "confirmed"]);

  const bookedSlots = bookings?.map((b) => b.booking_time.slice(0, 5)) || [];

  // Filter slots within business hours
  const [openH, openM] = hours.open.split(":").map(Number);
  const [closeH, closeM] = hours.close.split(":").map(Number);
  const openMinutes = openH * 60 + openM;
  const closeMinutes = closeH * 60 + closeM;

  const availableSlots = TIME_SLOTS.filter((slot) => {
    const [h, m] = slot.split(":").map(Number);
    const slotMinutes = h * 60 + m;
    return slotMinutes >= openMinutes && slotMinutes < closeMinutes;
  });

  return NextResponse.json({
    slots: availableSlots,
    bookedSlots,
    closed: false,
    hours,
  });
}
