"use client";

import { X } from "lucide-react";
import LangSwitcher from "./LangSwitcher";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
}

export default function MobileMenu({ open, onClose, links }: MobileMenuProps) {
  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99,
          background: "rgba(0,0,0,0.6)",
          backdropFilter: "blur(4px)",
          opacity: open ? 1 : 0,
          pointerEvents: open ? "auto" : "none",
          transition: "opacity 0.35s ease",
        }}
      />

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          height: "100%",
          width: "300px",
          zIndex: 100,
          background: "var(--color-dark)",
          display: "flex",
          flexDirection: "column",
          padding: "2rem",
          transform: open ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          boxShadow: "-20px 0 60px rgba(0,0,0,0.4)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "2.5rem",
          }}
        >
          <div>
            <div
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "1.2rem",
                fontWeight: 700,
                letterSpacing: "3px",
                color: "var(--color-primary)",
              }}
            >
              SKINLAB 011
            </div>
            <div
              style={{
                fontSize: "0.7rem",
                letterSpacing: "2px",
                color: "rgba(255,255,255,0.35)",
                marginTop: "2px",
                textTransform: "uppercase",
              }}
            >
              Kozmetički salon
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close menu"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "none",
              borderRadius: "50%",
              width: "38px",
              height: "38px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "rgba(255,255,255,0.7)",
              transition: "background 0.2s ease",
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Gold divider */}
        <div
          style={{
            height: "1px",
            background: "linear-gradient(to right, var(--color-primary), transparent)",
            marginBottom: "2.5rem",
            opacity: 0.5,
          }}
        />

        {/* Navigation links */}
        <nav style={{ flex: 1 }}>
          {links.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={onClose}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.85rem 0",
                textDecoration: "none",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                transition: "all 0.2s ease",
                color: "rgba(255,255,255,0.75)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "var(--color-primary)";
                (e.currentTarget as HTMLAnchorElement).style.paddingLeft = "0.5rem";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.75)";
                (e.currentTarget as HTMLAnchorElement).style.paddingLeft = "0";
              }}
            >
              <span
                style={{
                  fontSize: "0.65rem",
                  color: "var(--color-primary)",
                  fontWeight: 600,
                  letterSpacing: "1px",
                  minWidth: "20px",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span
                style={{
                  fontSize: "0.82rem",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  fontWeight: 500,
                }}
              >
                {link.label}
              </span>
            </a>
          ))}
        </nav>

        {/* Bottom: lang switcher */}
        <div
          style={{
            paddingTop: "2rem",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <p
            style={{
              fontSize: "0.65rem",
              letterSpacing: "2px",
              color: "rgba(255,255,255,0.3)",
              textTransform: "uppercase",
              marginBottom: "0.75rem",
            }}
          >
            Jezik
          </p>
          <div className="mobile-menu-lang">
            <LangSwitcher />
          </div>
        </div>
      </div>
    </>
  );
}
