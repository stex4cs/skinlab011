"use client";

import { useTranslations } from "next-intl";
import { MapPin, Phone, Mail } from "lucide-react";

export default function Contact() {
  const t = useTranslations("contact");

  return (
    <section id="contact" className="pt-20 pb-32 bg-white">
      <div className="container">
        <h2 className="section-title">{t("title")}</h2>
        <p className="section-subtitle">{t("subtitle")}</p>

        {/* Map */}
        <div className="rounded-2xl overflow-hidden shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d357.4866198632401!2d19.237268905288104!3d42.444069436222655!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x134deb003f53f151%3A0x8ac8c530ffb6c658!2sInfinity%20reformer%20pilates!5e1!3m2!1ssr!2srs!4v1771694984084!5m2!1ssr!2srs"
            width="100%"
            height="420"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="SkinLab 011 Location"
          />
        </div>

        {/* Contact Info – 4 cards in 2×2 grid */}
        <div className="grid md:grid-cols-4 gap-6 mt-28">

          {/* Address */}
          <div
            className="rounded-2xl p-8 text-center shadow-sm"
            style={{ background: "var(--color-light)" }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "var(--color-secondary)" }}
            >
              <MapPin style={{ color: "var(--color-primary)" }} size={22} />
            </div>
            <h4 className="font-heading text-lg font-semibold mb-2">
              {t("info.addressTitle")}
            </h4>
            <p className="text-dark/60 text-sm leading-relaxed">{t("address")}</p>
          </div>

          {/* Phone */}
          <div
            className="rounded-2xl p-8 text-center shadow-sm"
            style={{ background: "var(--color-light)" }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "var(--color-secondary)" }}
            >
              <Phone style={{ color: "var(--color-primary)" }} size={22} />
            </div>
            <h4 className="font-heading text-lg font-semibold mb-2">
              {t("info.phoneTitle")}
            </h4>
            <a
              href="tel:+38267487497"
              className="text-dark/70 text-sm no-underline block mb-1"
            >
              {t("info.phone")}
            </a>
            <p className="text-dark/40 text-xs">{t("info.hours")}</p>
          </div>

          {/* Email */}
          <div
            className="rounded-2xl p-8 text-center shadow-sm"
            style={{ background: "var(--color-light)" }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "var(--color-secondary)" }}
            >
              <Mail style={{ color: "var(--color-primary)" }} size={22} />
            </div>
            <h4 className="font-heading text-lg font-semibold mb-2">
              {t("info.emailTitle")}
            </h4>
            <a
              href="mailto:skinlab011@gmail.com"
              className="text-dark/70 text-sm no-underline block mb-1"
            >
              {t("info.email")}
            </a>
            <p className="text-dark/40 text-xs">{t("info.response")}</p>
          </div>

          {/* Instagram */}
          <a
            href="https://www.instagram.com/skinlab011"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-2xl p-8 text-center no-underline block group"
            style={{
              background: "linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
            }}
          >
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "rgba(255,255,255,0.2)" }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="white" stroke="none"/>
              </svg>
            </div>
            <h4
              className="font-heading text-lg font-semibold mb-2"
              style={{ color: "white" }}
            >
              {t("info.instagramTitle")}
            </h4>
            <p
              className="text-sm font-medium"
              style={{ color: "rgba(255,255,255,0.85)", letterSpacing: "0.5px" }}
            >
              @skinlab011
            </p>
          </a>

        </div>
      </div>
    </section>
  );
}
