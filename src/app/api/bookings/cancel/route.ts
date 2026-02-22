import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { sendAdminCancellationNotification } from "@/lib/email";

const html = (title: string, message: string, isError = false) => `
<!DOCTYPE html>
<html lang="sr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} - SkinLab 011</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; background: #FAF8F5; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
    .card { background: white; border-radius: 16px; padding: 40px 32px; max-width: 460px; width: 100%; text-align: center; box-shadow: 0 8px 40px rgba(0,0,0,0.08); border: 1px solid rgba(212,175,120,0.15); }
    .icon { font-size: 52px; margin-bottom: 20px; }
    .brand { font-size: 13px; letter-spacing: 3px; color: #D4AF78; font-weight: 600; margin-bottom: 6px; }
    h1 { font-size: 22px; color: #2C2C2C; margin-bottom: 12px; font-weight: 600; }
    p { color: #888; font-size: 14px; line-height: 1.7; margin-bottom: 12px; }
    .contact { margin-top: 28px; padding-top: 20px; border-top: 1px solid rgba(0,0,0,0.07); }
    .contact p { font-size: 13px; color: #aaa; }
  </style>
</head>
<body>
  <div class="card">
    <p class="brand">SKINLAB 011</p>
    <div class="icon">${isError ? "⚠️" : "✓"}</div>
    <h1>${title}</h1>
    <p>${message}</p>
    <div class="contact">
      <p>Pitanja? Kontaktirajte nas:<br>📞 +382 67 487 497<br>✉️ skinlab011@gmail.com</p>
    </div>
  </div>
</body>
</html>
`;

export async function GET(req: NextRequest) {
  const bookingId = req.nextUrl.searchParams.get("id");

  if (!bookingId) {
    return new NextResponse(
      html("Nevažeći link", "Ovaj link za otkazivanje nije važeći.", true),
      { status: 400, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  const supabase = createAdminClient();

  const { data: booking } = await supabase
    .from("bookings")
    .select("*")
    .eq("booking_id", bookingId)
    .single();

  if (!booking) {
    return new NextResponse(
      html("Rezervacija nije pronađena", "Rezervacija sa ovim ID-em ne postoji ili je već obrisana.", true),
      { status: 404, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  if (booking.status === "cancelled") {
    return new NextResponse(
      html("Već otkazano", "Ova rezervacija je već prethodno otkazana."),
      { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  const { error } = await supabase
    .from("bookings")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("booking_id", bookingId);

  if (error) {
    console.error("[CANCEL] Supabase error:", error);
    return new NextResponse(
      html("Greška", "Došlo je do greške prilikom otkazivanja. Molimo kontaktirajte nas direktno.", true),
      { status: 500, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }

  // Notify admin
  sendAdminCancellationNotification(
    booking.client_name,
    booking.client_email,
    booking.treatment_name,
    booking.booking_date,
    booking.booking_time,
    bookingId
  ).catch((e) => console.error("[CANCEL] Admin notification error:", e));

  return new NextResponse(
    html(
      "Rezervacija otkazana",
      `Vaša rezervacija za <strong>${booking.treatment_name}</strong> dana ${booking.booking_date} u ${booking.booking_time?.slice(0, 5)} je uspješno otkazana.<br><br>Termin je oslobođen. Nadamo se da ćemo vas vidjeti uskoro!`
    ),
    { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } }
  );
}
