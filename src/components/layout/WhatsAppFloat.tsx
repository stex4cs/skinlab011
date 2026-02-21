"use client";

import { MessageCircle } from "lucide-react";

export default function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/38267487497"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 z-50 w-[60px] h-[60px] rounded-full flex items-center justify-center text-white no-underline shadow-lg animate-pulse-green group"
      style={{
        background: "linear-gradient(135deg, #25D366, #128C7E)",
      }}
      aria-label="WhatsApp"
    >
      <MessageCircle size={28} fill="white" stroke="white" />
      <span className="absolute right-[70px] bg-white text-dark px-3 py-2 rounded-lg text-sm font-medium shadow-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Pošaljite nam poruku
      </span>
    </a>
  );
}
