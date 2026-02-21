import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

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
  const confirmUrl = `${process.env.NEXTAUTH_URL}/api/bookings/${data.bookingId}`;

  await resend.emails.send({
    from: "SkinLab 011 <noreply@skinlab011.com>",
    to: process.env.ADMIN_EMAIL!,
    subject: `Nova rezervacija - ${data.clientName}`,
    html: `
      <div style="font-family: 'Montserrat', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #D4AF78, #C9A666); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-family: 'Cormorant Garamond', serif;">SKINLAB 011</h1>
          <p style="color: white; margin: 5px 0 0;">Nova rezervacija</p>
        </div>
        <div style="padding: 30px; background: #FAF8F5;">
          <h2 style="color: #2C2C2C;">Detalji rezervacije</h2>
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 8px 0; color: #666;">Ime:</td><td style="padding: 8px 0; font-weight: bold;">${data.clientName}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Email:</td><td style="padding: 8px 0;">${data.clientEmail}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Telefon:</td><td style="padding: 8px 0;">${data.clientPhone}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Tretman:</td><td style="padding: 8px 0; font-weight: bold;">${data.treatmentName}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Datum:</td><td style="padding: 8px 0;">${data.date}</td></tr>
            <tr><td style="padding: 8px 0; color: #666;">Vrijeme:</td><td style="padding: 8px 0;">${data.time}</td></tr>
            ${data.message ? `<tr><td style="padding: 8px 0; color: #666;">Napomena:</td><td style="padding: 8px 0;">${data.message}</td></tr>` : ""}
          </table>
          <div style="margin-top: 20px; text-align: center;">
            <p style="color: #666;">Upravljajte rezervacijom iz admin panela.</p>
          </div>
        </div>
      </div>
    `,
  });
}

export async function sendClientConfirmation(data: BookingEmailData) {
  await resend.emails.send({
    from: "SkinLab 011 <noreply@skinlab011.com>",
    to: data.clientEmail,
    subject: "Vaša rezervacija - SkinLab 011",
    html: `
      <div style="font-family: 'Montserrat', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #D4AF78, #C9A666); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-family: 'Cormorant Garamond', serif;">SKINLAB 011</h1>
          <p style="color: white; margin: 5px 0 0;">Potvrda rezervacije</p>
        </div>
        <div style="padding: 30px; background: #FAF8F5;">
          <p>Poštovani/a ${data.clientName},</p>
          <p>Vaš zahtjev za rezervaciju je primljen. Odgovorićemo vam u roku od 24 sata.</p>
          <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #D4AF78; margin-top: 0;">Detalji</h3>
            <p><strong>Tretman:</strong> ${data.treatmentName}</p>
            <p><strong>Datum:</strong> ${data.date}</p>
            <p><strong>Vrijeme:</strong> ${data.time}</p>
            <p><strong>ID rezervacije:</strong> ${data.bookingId}</p>
          </div>
          <p style="color: #666; font-size: 14px;">Ako imate pitanja, kontaktirajte nas putem WhatsApp-a ili emaila.</p>
        </div>
      </div>
    `,
  });
}

export async function sendBookingStatusEmail(
  clientEmail: string,
  clientName: string,
  treatmentName: string,
  date: string,
  time: string,
  status: "confirmed" | "rejected"
) {
  const isConfirmed = status === "confirmed";

  await resend.emails.send({
    from: "SkinLab 011 <noreply@skinlab011.com>",
    to: clientEmail,
    subject: isConfirmed
      ? "Rezervacija potvrđena - SkinLab 011"
      : "Rezervacija odbijena - SkinLab 011",
    html: `
      <div style="font-family: 'Montserrat', Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: ${isConfirmed ? "#4CAF50" : "#f44336"}; padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 48px;">${isConfirmed ? "✓" : "✕"}</h1>
          <p style="color: white; margin: 10px 0 0; font-size: 18px;">
            Rezervacija ${isConfirmed ? "potvrđena" : "odbijena"}
          </p>
        </div>
        <div style="padding: 30px; background: #FAF8F5;">
          <p>Poštovani/a ${clientName},</p>
          ${
            isConfirmed
              ? `<p>Vaša rezervacija je <strong>potvrđena</strong>!</p>
                 <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
                   <p><strong>Tretman:</strong> ${treatmentName}</p>
                   <p><strong>Datum:</strong> ${date}</p>
                   <p><strong>Vrijeme:</strong> ${time}</p>
                   <p><strong>Adresa:</strong> Bulevar Svetog Petra Cetinjskog, Podgorica</p>
                 </div>
                 <p>Molimo vas da dođete 10 minuta ranije.</p>`
              : `<p>Nažalost, traženi termin nije dostupan.</p>
                 <p>Molimo vas da nas kontaktirate za alternativni termin.</p>`
          }
        </div>
      </div>
    `,
  });
}
