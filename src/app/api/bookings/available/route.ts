import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { BUSINESS_HOURS, generateTimeSlots, timeToMinutes } from "@/lib/constants";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const date = searchParams.get("date");
  const durationParam = searchParams.get("duration");
  const duration = durationParam ? parseInt(durationParam) : 60;

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

  // Fetch existing bookings WITH their durations for proper overlap detection
  const { data: bookings } = await supabase
    .from("bookings")
    .select("booking_time, duration_minutes")
    .eq("booking_date", date)
    .in("status", ["pending", "confirmed"]);

  const openMinutes = timeToMinutes(hours.open);
  const closeMinutes = timeToMinutes(hours.close);

  // Generate all valid start slots for this treatment duration
  const allSlots = generateTimeSlots(openMinutes, closeMinutes, duration);

  // For each slot, check if it overlaps with any existing booking
  // Overlap: [slotStart, slotStart+duration) overlaps [bStart, bStart+bDuration)
  // True when: slotStart < bEnd AND slotEnd > bStart
  const bookedSlots: string[] = [];

  for (const slot of allSlots) {
    const slotStart = timeToMinutes(slot);
    const slotEnd = slotStart + duration;

    const hasConflict = bookings?.some((b) => {
      const bStart = timeToMinutes(b.booking_time.slice(0, 5));
      const bDuration = b.duration_minutes || 60; // default 60 if not stored
      const bEnd = bStart + bDuration;
      return slotStart < bEnd && slotEnd > bStart;
    }) ?? false;

    if (hasConflict) {
      bookedSlots.push(slot);
    }
  }

  return NextResponse.json({
    slots: allSlots,
    bookedSlots,
    closed: false,
    hours,
  });
}
