import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendBookingStatusEmail } from "@/lib/email";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const { status, reason } = await req.json();

  if (!["confirmed", "rejected", "cancelled", "pending"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Get booking first for email
  const { data: booking } = await supabase
    .from("bookings")
    .select("*")
    .eq("booking_id", id)
    .single();

  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }

  const { error } = await supabase
    .from("bookings")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("booking_id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Send email notification for confirmed/rejected/cancelled
  if (status === "confirmed" || status === "rejected" || status === "cancelled") {
    try {
      await sendBookingStatusEmail(
        booking.client_email,
        booking.client_name,
        booking.treatment_name,
        booking.booking_date,
        booking.booking_time,
        status,
        id,
        reason || undefined
      );
    } catch (e) {
      console.error("Email error:", e);
    }
  }

  return NextResponse.json({ success: true });
}
