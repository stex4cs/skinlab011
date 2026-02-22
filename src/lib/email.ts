import { Resend } from "resend";

function getResend() {
  if (!process.env.RESEND_API_KEY || process.env.RESEND_API_KEY === "your_resend_api_key") {
    console.warn("[EMAIL] RESEND_API_KEY not configured - emails will not be sent");
    return null;
  }
  return new Resend(process.env.RESEND_API_KEY);
}

const FROM = "SkinLab 011 <onboarding@resend.dev>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "skinlab011@gmail.com";
const ADDRESS = "Ul Baku 9A, Podgorica";

interface BookingEmailData {
  bookingId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  treatmentName: string;
  date: string;
  time: string;
  message?: string;
}

export async function sendAdminNotification(data: BookingEmailData) {
  const resend = getResend();
  if (!resend) return;

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      subject: `Nova rezervacija - ${data.clientName}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #D4AF78, #C9A666); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: #111; margin: 0; font-size: 24px; letter-spacing: 3px;">SKINLAB 011</h1>
            <p style="color: #111; margin: 6px 0 0; font-size: 13px; opacity: 0.7;">Nova rezervacija</p>
          </div>
          <div style="padding: 30px; background: #FAF8F5; border-radius: 0 0 8px 8px;">
            <h2 style="color: #2C2C2C; margin-top: 0;">Detalji rezervacije</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid rgba(212,175,120,0.2);">
                <td style="padding: 10px 0; color: #888; width: 120px;">Ime:</td>
                <td style="padding: 10px 0; font-weight: bold; color: #2C2C2C;">${data.clientName}</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(212,175,120,0.2);">
                <td style="padding: 10px 0; color: #888;">Email:</td>
                <td style="padding: 10px 0; color: #2C2C2C;">${data.clientEmail}</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(212,175,120,0.2);">
                <td style="padding: 10px 0; color: #888;">Telefon:</td>
                <td style="padding: 10px 0; color: #2C2C2C;">${data.clientPhone}</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(212,175,120,0.2);">
                <td style="padding: 10px 0; color: #888;">Tretman:</td>
                <td style="padding: 10px 0; font-weight: bold; color: #D4AF78;">${data.treatmentName}</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(212,175,120,0.2);">
                <td style="padding: 10px 0; color: #888;">Datum:</td>
                <td style="padding: 10px 0; color: #2C2C2C;">${data.date}</td>
              </tr>
              <tr style="border-bottom: 1px solid rgba(212,175,120,0.2);">
                <td style="padding: 10px 0; color: #888;">Vrijeme:</td>
                <td style="padding: 10px 0; color: #2C2C2C;">${data.time}</td>
              </tr>
              ${data.message ? `
              <tr>
                <td style="padding: 10px 0; color: #888; vertical-align: top;">Napomena:</td>
                <td style="padding: 10px 0; color: #2C2C2C;">${data.message}</td>
              </tr>` : ""}
            </table>
            <div style="margin-top: 24px; padding: 16px; background: rgba(212,175,120,0.1); border-left: 3px solid #D4AF78; border-radius: 4px;">
              <p style="margin: 0; color: #666; font-size: 13px;">Prijavite se u <strong>admin panel</strong> da potvrdite ili odbijete rezervaciju.</p>
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("[EMAIL] Admin notification error:", error);
    } else {
      console.log("[EMAIL] Admin notification sent to", ADMIN_EMAIL);
    }
  } catch (err) {
    console.error("[EMAIL] sendAdminNotification exception:", err);
  }
}

export async function sendClientConfirmation(data: BookingEmailData) {
  const resend = getResend();
  if (!resend) return;

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: data.clientEmail,
      subject: "Vaša rezervacija primljena - SkinLab 011",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #D4AF78, #C9A666); padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <h1 style="color: #111; margin: 0; font-size: 24px; letter-spacing: 3px;">SKINLAB 011</h1>
            <p style="color: #111; margin: 6px 0 0; font-size: 13px; opacity: 0.7;">Potvrda prijema rezervacije</p>
          </div>
          <div style="padding: 30px; background: #FAF8F5; border-radius: 0 0 8px 8px;">
            <p style="color: #2C2C2C;">Poštovani/a <strong>${data.clientName}</strong>,</p>
            <p style="color: #666;">Vaš zahtjev za rezervaciju je uspješno primljen. Potvrda termina stiže u najkraćem roku.</p>
            <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid rgba(212,175,120,0.2);">
              <h3 style="color: #D4AF78; margin-top: 0; font-size: 14px; text-transform: uppercase; letter-spacing: 1px;">Detalji rezervacije</h3>
              <p style="margin: 6px 0; color: #2C2C2C;"><strong>Tretman:</strong> ${data.treatmentName}</p>
              <p style="margin: 6px 0; color: #2C2C2C;"><strong>Datum:</strong> ${data.date}</p>
              <p style="margin: 6px 0; color: #2C2C2C;"><strong>Vrijeme:</strong> ${data.time}</p>
              <p style="margin: 6px 0; color: #2C2C2C;"><strong>ID rezervacije:</strong> <span style="font-family: monospace; color: #888;">${data.bookingId}</span></p>
            </div>
            <p style="color: #666; font-size: 13px;">Imate pitanja? Kontaktirajte nas:</p>
            <p style="color: #666; font-size: 13px;">📍 ${ADDRESS}<br>📞 +382 67 487 497<br>✉️ skinlab011@gmail.com</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("[EMAIL] Client confirmation error:", error);
    } else {
      console.log("[EMAIL] Client confirmation sent to", data.clientEmail);
    }
  } catch (err) {
    console.error("[EMAIL] sendClientConfirmation exception:", err);
  }
}

export async function sendBookingStatusEmail(
  clientEmail: string,
  clientName: string,
  treatmentName: string,
  date: string,
  time: string,
  status: "confirmed" | "rejected"
) {
  const resend = getResend();
  if (!resend) return;

  const isConfirmed = status === "confirmed";

  try {
    const { error } = await resend.emails.send({
      from: FROM,
      to: clientEmail,
      subject: isConfirmed
        ? "Rezervacija potvrđena ✓ - SkinLab 011"
        : "Rezervacija odbijena - SkinLab 011",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: ${isConfirmed ? "linear-gradient(135deg, #4CAF50, #388E3C)" : "linear-gradient(135deg, #EF5350, #c62828)"}; padding: 30px; text-align: center; border-radius: 8px 8px 0 0;">
            <div style="font-size: 40px; margin-bottom: 8px;">${isConfirmed ? "✓" : "✕"}</div>
            <h2 style="color: white; margin: 0; font-size: 20px;">
              Rezervacija ${isConfirmed ? "potvrđena" : "odbijena"}
            </h2>
          </div>
          <div style="padding: 30px; background: #FAF8F5; border-radius: 0 0 8px 8px;">
            <p style="color: #2C2C2C;">Poštovani/a <strong>${clientName}</strong>,</p>
            ${isConfirmed
              ? `<p style="color: #666;">Vaša rezervacija je <strong style="color: #4CAF50;">potvrđena</strong>! Radujemo se vašem dolasku.</p>
                 <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0; border: 1px solid rgba(76,175,80,0.2);">
                   <p style="margin: 6px 0; color: #2C2C2C;"><strong>Tretman:</strong> ${treatmentName}</p>
                   <p style="margin: 6px 0; color: #2C2C2C;"><strong>Datum:</strong> ${date}</p>
                   <p style="margin: 6px 0; color: #2C2C2C;"><strong>Vrijeme:</strong> ${time}</p>
                   <p style="margin: 6px 0; color: #2C2C2C;"><strong>Adresa:</strong> ${ADDRESS}</p>
                 </div>
                 <p style="color: #666; font-size: 13px;">Molimo dođite 5-10 minuta ranije. Vidimo se!</p>`
              : `<p style="color: #666;">Nažalost, traženi termin nije dostupan.</p>
                 <p style="color: #666;">Molimo kontaktirajte nas za alternativni termin:</p>
                 <p style="color: #666; font-size: 13px;">📞 +382 67 487 497<br>✉️ skinlab011@gmail.com</p>`
            }
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("[EMAIL] Status email error:", error);
    } else {
      console.log("[EMAIL] Status email sent:", status, "→", clientEmail);
    }
  } catch (err) {
    console.error("[EMAIL] sendBookingStatusEmail exception:", err);
  }
}
