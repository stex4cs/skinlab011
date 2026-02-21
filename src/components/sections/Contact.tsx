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
        <div className="mb-12">
          <h3 className="font-heading text-xl font-semibold text-dark mb-4">
            {t("location")}
          </h3>
          <div className="rounded-2xl overflow-hidden shadow-lg mb-6">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2944.5!2d19.26!3d42.44!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDLCsDI2JzI0LjAiTiAxOcKwMTUnMzYuMCJF!5e0!3m2!1sen!2s!4v1"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="SkinLab 011 Location"
            />
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3 p-4 bg-light rounded-xl">
              <MapPin className="text-primary flex-shrink-0 mt-1" size={20} />
              <span className="text-sm text-dark/70">{t("address")}</span>
            </div>
            <div className="flex items-start gap-3 p-4 bg-light rounded-xl">
              <Car className="text-primary flex-shrink-0 mt-1" size={20} />
              <span className="text-sm text-dark/70">{t("parking")}</span>
            </div>
            <div className="flex items-start gap-3 p-4 bg-light rounded-xl">
              <Bus className="text-primary flex-shrink-0 mt-1" size={20} />
              <span className="text-sm text-dark/70">{t("transport")}</span>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-light rounded-2xl p-6 text-center">
            <MapPin className="text-primary mx-auto mb-3" size={28} />
            <h4 className="font-heading text-lg font-semibold mb-2">
              {t("info.addressTitle")}
            </h4>
            <p className="text-dark/60 text-sm">{t("address")}</p>
          </div>
          <div className="bg-light rounded-2xl p-6 text-center">
            <Phone className="text-primary mx-auto mb-3" size={28} />
            <h4 className="font-heading text-lg font-semibold mb-2">
              {t("info.phoneTitle")}
            </h4>
            <p className="text-dark/60 text-sm">{t("info.phone")}</p>
            <p className="text-dark/40 text-xs mt-1">{t("info.hours")}</p>
          </div>
          <div className="bg-light rounded-2xl p-6 text-center">
            <Mail className="text-primary mx-auto mb-3" size={28} />
            <h4 className="font-heading text-lg font-semibold mb-2">
              {t("info.emailTitle")}
            </h4>
            <p className="text-dark/60 text-sm">{t("info.email")}</p>
            <p className="text-dark/40 text-xs mt-1">{t("info.response")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
