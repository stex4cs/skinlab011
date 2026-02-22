import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  const now = new Date();
  const today = now.toISOString().split("T")[0];

  // Start of current month
  const startOfMonth = `${today.slice(0, 8)}01`;

  // Start of current week (Monday)
  const d = new Date(now);
  const dayOfWeek = d.getDay() === 0 ? 7 : d.getDay(); // treat Sunday as 7
  d.setDate(d.getDate() - dayOfWeek + 1);
  const startOfWeek = d.toISOString().split("T")[0];

  // Fetch confirmed bookings up to today (already happened), joined with treatment price
  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("booking_date, treatment_id, treatments(price_value)")
    .eq("status", "confirmed")
    .lte("booking_date", today);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const all = bookings || [];

  function sum(items: typeof all) {
    return items.reduce((acc, b) => {
      const price = (b.treatments as { price_value?: number } | null)?.price_value || 0;
      return acc + price;
    }, 0);
  }

  const todayItems = all.filter((b) => b.booking_date === today);
  const weekItems = all.filter((b) => b.booking_date >= startOfWeek);
  const monthItems = all.filter((b) => b.booking_date >= startOfMonth);

  return NextResponse.json({
    today: { amount: sum(todayItems), count: todayItems.length },
    week: { amount: sum(weekItems), count: weekItems.length },
    month: { amount: sum(monthItems), count: monthItems.length },
    total: { amount: sum(all), count: all.length },
  });
}
