"use client";

import { useTranslations } from "next-intl";
import { Phone, Mail, MapPin, Clock, Instagram } from "lucide-react";

export default function Footer() {
  const t = useTranslations("footer");
  const nav = useTranslations("nav");

  const links = [
    { href: "#home", label: nav("home") },
    { href: "#services", label: nav("services") },
    { href: "#pricing", label: nav("pricing") },
    { href: "#gallery", label: nav("gallery") },
    { href: "#faq", label: nav("faq") },
    { href: "#contact", label: nav("contact") },
    { href: "#booking", label: nav("booking") },
  ];

  return (
    <footer style={{ background: "var(--color-dark)", color: "white" }}>
      <div className="container" style={{ paddingTop: "5rem", paddingBottom: "3rem" }}>
        <div className="grid md:grid-cols-3 gap-12 mb-16">

          {/* Brand column */}
          <div>
            <div
              className="font-heading font-bold mb-4"
              style={{
                fontSize: "1.4rem",
                letterSpacing: "3px",
                color: "var(--color-primary)",
              }}
            >
              SKINLAB 011
            </div>
            <p
              className="text-sm leading-relaxed mb-6"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              {t("tagline")}
            </p>
            <a
              href="https://www.instagram.com/skinlab011"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 no-underline text-sm font-medium"
              style={{ color: "var(--color-primary)", letterSpacing: "0.5px" }}
            >
              <Instagram size={16} />
              @skinlab011
            </a>
          </div>

          {/* Navigation column */}
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-widest mb-6"
              style={{ color: "var(--color-primary)", letterSpacing: "2px" }}
            >
              {t("navTitle")}
            </h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {links.map((link) => (
                <li key={link.href} style={{ marginBottom: "0.65rem" }}>
                  <a
                    href={link.href}
                    className="no-underline text-sm transition-colors"
                    style={{ color: "rgba(255,255,255,0.65)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--color-primary)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "rgba(255,255,255,0.65)")
                    }
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h4
              className="text-xs font-semibold uppercase tracking-widest mb-6"
              style={{ color: "var(--color-primary)", letterSpacing: "2px" }}
            >
              {t("contactTitle")}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
              <div className="flex items-start gap-3">
                <MapPin
                  size={15}
                  style={{
                    color: "var(--color-primary)",
                    flexShrink: 0,
                    marginTop: "3px",
                  }}
                />
                <span className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                  Ul Baku 9A, Podgorica
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone
                  size={15}
                  style={{ color: "var(--color-primary)", flexShrink: 0 }}
                />
                <a
                  href="tel:+38267487497"
                  className="text-sm no-underline"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                >
                  +382 67 487 497
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail
                  size={15}
                  style={{ color: "var(--color-primary)", flexShrink: 0 }}
                />
                <a
                  href="mailto:skinlab011@gmail.com"
                  className="text-sm no-underline"
                  style={{ color: "rgba(255,255,255,0.65)" }}
                >
                  skinlab011@gmail.com
                </a>
              </div>
              <div className="flex items-start gap-3">
                <Clock
                  size={15}
                  style={{
                    color: "var(--color-primary)",
                    flexShrink: 0,
                    marginTop: "3px",
                  }}
                />
                <div className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                  <div>{t("hoursWeekdays")}</div>
                  <div>{t("hoursSaturday")}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row justify-between items-center gap-3 pt-8 text-xs"
          style={{
            borderTop: "1px solid rgba(255,255,255,0.1)",
            color: "rgba(255,255,255,0.35)",
          }}
        >
          <span>
            &copy; {new Date().getFullYear()} SkinLab 011. {t("rights")}
          </span>
          <span>
            {t("poweredBy")}{" "}
            <a
              href="https://popzify.com"
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline"
              style={{ color: "var(--color-primary)" }}
            >
              Popzify
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
