"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import LangSwitcher from "./LangSwitcher";
import MobileMenu from "./MobileMenu";
import { Menu } from "lucide-react";

export default function Navbar() {
  const t = useTranslations("nav");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#home", label: t("home") },
    { href: "#services", label: t("services") },
    { href: "#pricing", label: t("pricing") },
    { href: "#gallery", label: t("gallery") },
    { href: "#faq", label: t("faq") },
    { href: "#contact", label: t("contact") },
    { href: "#about", label: t("about") },
    { href: "#booking", label: t("booking") },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 animate-slide-down ${
          scrolled
            ? "bg-white/95 shadow-md backdrop-blur-sm"
            : "bg-white/80 backdrop-blur-sm"
        }`}
      >
        <div className="container flex justify-between items-center h-[70px]">
          <Link href="/" className="text-2xl font-bold font-heading tracking-wider no-underline" style={{ color: "var(--color-primary)", letterSpacing: "3px" }}>
            SKINLAB 011
          </Link>

          <div className="hidden md:flex items-center gap-8">
            <div className="flex gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="nav-link"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <LangSwitcher />
          </div>

          <button
            className="md:hidden bg-transparent border-none text-dark cursor-pointer"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={28} />
          </button>
        </div>
      </nav>

      <MobileMenu
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        links={navLinks}
      />
    </>
  );
}
