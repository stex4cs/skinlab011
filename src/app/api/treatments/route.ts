import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = createAdminClient();

  const { data: categories, error: catErr } = await supabase
    .from("treatment_categories")
    .select("*")
    .order("sort_order");

  const { data: treatments, error: trErr } = await supabase
    .from("treatments")
    .select("*")
    .order("sort_order");

  if (catErr || trErr) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }

  const result = (categories || []).map((cat) => ({
    ...cat,
    treatments: (treatments || []).filter((t) => t.category_id === cat.id),
  }));

  return NextResponse.json(result);
}
