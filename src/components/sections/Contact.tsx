"use client";

import { useTranslations } from "next-intl";
import { MapPin, Phone, Mail, Car, Bus } from "lucide-react";

export default function Contact() {
  const t = useTranslations("contact");

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container">
        <h2 className="section-title">{t("title")}</h2>
        <p className="section-subtitle">{t("subtitle")}</p>

        {/* Map */}
        <div>
          <h3
            className="font-heading text-xl font-semibold text-dark mb-6"
            style={{ letterSpacing: "1px" }}
          >
            {t("location")}
          </h3>
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2944.5!2d19.26!3d42.44!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDLCsDI2JzI0LjAiTiAxOcKwMTUnMzYuMCJF!5e0!3m2!1sen!2s!4v1"
              width="100%"
              height="420"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="SkinLab 011 Location"
            />
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: "var(--color-secondary)" }}>
              <MapPin style={{ color: "var(--color-primary)", flexShrink: 0, marginTop: "2px" }} size={18} />
              <span className="text-sm text-dark/70">{t("address")}</span>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: "var(--color-secondary)" }}>
              <Car style={{ color: "var(--color-primary)", flexShrink: 0, marginTop: "2px" }} size={18} />
              <span className="text-sm text-dark/70">{t("parking")}</span>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: "var(--color-secondary)" }}>
              <Bus style={{ color: "var(--color-primary)", flexShrink: 0, marginTop: "2px" }} size={18} />
              <span className="text-sm text-dark/70">{t("transport")}</span>
            </div>
          </div>
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
              href="tel:+38269811011"
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
              href="mailto:business@bif.events"
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
