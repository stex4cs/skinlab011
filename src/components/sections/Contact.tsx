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

        {/* Contact Info */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div
            className="rounded-2xl p-10 text-center shadow-sm"
            style={{ background: "var(--color-light)" }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: "var(--color-secondary)" }}
            >
              <MapPin style={{ color: "var(--color-primary)" }} size={26} />
            </div>
            <h4 className="font-heading text-xl font-semibold mb-3">
              {t("info.addressTitle")}
            </h4>
            <p className="text-dark/60 text-sm leading-relaxed">{t("address")}</p>
          </div>

          <div
            className="rounded-2xl p-10 text-center shadow-sm"
            style={{ background: "var(--color-light)" }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: "var(--color-secondary)" }}
            >
              <Phone style={{ color: "var(--color-primary)" }} size={26} />
            </div>
            <h4 className="font-heading text-xl font-semibold mb-3">
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

          <div
            className="rounded-2xl p-10 text-center shadow-sm"
            style={{ background: "var(--color-light)" }}
          >
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-5"
              style={{ background: "var(--color-secondary)" }}
            >
              <Mail style={{ color: "var(--color-primary)" }} size={26} />
            </div>
            <h4 className="font-heading text-xl font-semibold mb-3">
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
        </div>
      </div>
    </section>
  );
}
