"use client";

import { X } from "lucide-react";
import LangSwitcher from "./LangSwitcher";

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  links: { href: string; label: string }[];
}

export default function MobileMenu({ open, onClose, links }: MobileMenuProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] md:hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-[280px] bg-white shadow-xl p-8 flex flex-col">
        <button
          onClick={onClose}
          className="self-end bg-transparent border-none cursor-pointer text-dark mb-8"
          aria-label="Close menu"
        >
          <X size={28} />
        </button>

        <div className="flex flex-col gap-4">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="text-dark no-underline text-base font-medium py-2 border-b border-secondary hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="mt-8">
          <LangSwitcher />
        </div>
      </div>
    </div>
  );
}
