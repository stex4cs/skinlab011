import { NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET() {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL || "skinlab011@gmail.com";

  const fromAddress = process.env.RESEND_FROM || "SkinLab 011 <onboarding@resend.dev>";

  // Check env vars
  const envStatus = {
    RESEND_API_KEY: apiKey ? `✓ Set (starts with: ${apiKey.slice(0, 6)}...)` : "✗ NOT SET",
    RESEND_FROM: fromAddress,
    ADMIN_EMAIL: adminEmail,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "not set",
  };

  if (!apiKey || apiKey === "your_resend_api_key") {
    return NextResponse.json({
      success: false,
      error: "RESEND_API_KEY is not configured in Vercel environment variables",
      envStatus,
      fix: "Go to Vercel Dashboard → Project → Settings → Environment Variables → Add RESEND_API_KEY",
    });
  }

  // Try sending test email
  const resend = new Resend(apiKey);
  try {
    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to: adminEmail,
      subject: "✓ Test email - SkinLab 011 email radi!",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px;">
          <h2 style="color: #D4AF78;">Email konfiguracija radi ✓</h2>
          <p>Ovo je test email sa SkinLab 011 booking sistema.</p>
          <p style="color: #888; font-size: 13px;">Poslano na: ${adminEmail}<br>API Key: ${apiKey.slice(0, 6)}...</p>
        </div>
      `,
    });

    if (error) {
      return NextResponse.json({
        success: false,
        error: error.message,
        envStatus,
        resendError: error,
      });
    }

    return NextResponse.json({
      success: true,
      message: `Test email uspješno poslan na ${adminEmail}`,
      emailId: data?.id,
      envStatus,
    });
  } catch (err) {
    return NextResponse.json({
      success: false,
      error: String(err),
      envStatus,
    });
  }
}
