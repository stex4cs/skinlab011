import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const results: Record<string, unknown> = {};

  // Check env vars (only presence, not values)
  results.env = {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "MISSING",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "SET" : "MISSING",
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID
      ? `SET (${process.env.GOOGLE_CLIENT_ID.slice(0, 10)}...)`
      : "MISSING",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ? "SET" : "MISSING",
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || "MISSING",
    SUPABASE_SERVICE_ROLE: process.env.SUPABASE_SERVICE_ROLE_KEY
      ? "SET"
      : "MISSING",
  };

  // Check Supabase admin_users table
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from("admin_users")
      .select("email, name");

    results.supabase = {
      connected: !error,
      error: error?.message || null,
      admin_users: data || [],
    };
  } catch (err) {
    results.supabase = {
      connected: false,
      error: String(err),
      admin_users: [],
    };
  }

  return NextResponse.json(results);
}
