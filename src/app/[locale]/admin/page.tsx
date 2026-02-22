"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";
import type { Booking } from "@/types/database";
import { STATUS_COLORS } from "@/lib/constants";

const CARD = "#1C1C28";
const CARD_BORDER = "rgba(255,255,255,0.06)";
const TEXT = "rgba(255,255,255,0.85)";
const TEXT_MUTED = "rgba(255,255,255,0.4)";
const GOLD = "#D4AF78";

export default function AdminDashboard() {
  const t = useTranslations("admin");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/bookings?limit=20")
      .then((r) => r.json())
      .then((data) => {
        setBookings(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

  const today = new Date().toISOString().split("T")[0];
  const todayCount = bookings.filter((b) => b.booking_date === today).length;
  const pendingCount = bookings.filter((b) => b.status === "pending").length;
  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length;

  const stats = [
    { label: t("todayBookings"), value: todayCount, icon: Calendar, color: GOLD, glow: "rgba(212,175,120,0.15)" },
    { label: t("pendingBookings"), value: pendingCount, icon: AlertCircle, color: "#FFA726", glow: "rgba(255,167,38,0.12)" },
    { label: t("totalBookings"), value: bookings.length, icon: CheckCircle, color: "#66BB6A", glow: "rgba(102,187,106,0.12)" },
    { label: t("bookings"), value: confirmedCount, icon: Clock, color: "#42A5F5", glow: "rgba(66,165,245,0.12)" },
  ];

  async function updateStatus(bookingId: string, status: string) {
    await fetch(`/api/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    setBookings((prev) =>
      prev.map((b) =>
        b.booking_id === bookingId ? { ...b, status: status as Booking["status"] } : b
      )
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl mb-1" style={{ color: TEXT }}>
          {t("dashboard")}
        </h1>
        <div
          style={{
            height: "2px",
            width: "48px",
            background: `linear-gradient(to right, ${GOLD}, transparent)`,
            marginTop: "8px",
          }}
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color, glow }) => (
          <div
            key={label}
            className="rounded-2xl p-6"
            style={{
              background: CARD,
              border: `1px solid ${CARD_BORDER}`,
              boxShadow: `0 0 20px ${glow}`,
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: `${glow}`, border: `1px solid ${color}30` }}
              >
                <Icon size={20} style={{ color }} />
              </div>
              <span
                className="text-3xl font-bold font-heading"
                style={{ color }}
              >
                {value}
              </span>
            </div>
            <p className="text-xs" style={{ color: TEXT_MUTED, letterSpacing: "0.5px" }}>
              {label}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ background: CARD, border: `1px solid ${CARD_BORDER}` }}
      >
        <div
          className="p-6"
          style={{ borderBottom: `1px solid ${CARD_BORDER}` }}
        >
          <h2 className="font-heading text-lg" style={{ color: TEXT }}>
            {t("recentBookings")}
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center" style={{ color: TEXT_MUTED }}>
            Učitavanje...
          </div>
        ) : bookings.length === 0 ? (
          <div className="p-12 text-center" style={{ color: TEXT_MUTED }}>
            Nema rezervacija.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ background: "rgba(255,255,255,0.03)" }}>
                  {["ID", "Klijent", "Tretman", "Datum", "Vrijeme", "Status", "Akcije"].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-3 text-left text-xs font-semibold uppercase"
                      style={{ color: TEXT_MUTED, letterSpacing: "0.5px" }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((b, i) => (
                  <tr
                    key={b.id}
                    style={{
                      borderTop: `1px solid ${CARD_BORDER}`,
                      background: i % 2 === 0 ? "transparent" : "rgba(255,255,255,0.015)",
                    }}
                  >
                    <td className="px-5 py-3 text-xs font-mono" style={{ color: "rgba(255,255,255,0.25)" }}>
                      {b.booking_id}
                    </td>
                    <td className="px-5 py-3">
                      <div className="font-medium text-sm" style={{ color: TEXT }}>
                        {b.client_name}
                      </div>
                      <div className="text-xs" style={{ color: TEXT_MUTED }}>
                        {b.client_email}
                      </div>
                    </td>
                    <td className="px-5 py-3 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                      {b.treatment_name}
                    </td>
                    <td className="px-5 py-3 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                      {b.booking_date}
                    </td>
                    <td className="px-5 py-3 text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>
                      {b.booking_time?.slice(0, 5)}
                    </td>
                    <td className="px-5 py-3">
                      <span
                        className="px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: `${STATUS_COLORS[b.status]}22`,
                          color: STATUS_COLORS[b.status],
                          border: `1px solid ${STATUS_COLORS[b.status]}44`,
                        }}
                      >
                        {t(`status.${b.status}`)}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex gap-2">
                        {b.status === "pending" && (
                          <>
                            <button
                              onClick={() => updateStatus(b.booking_id, "confirmed")}
                              className="px-3 py-1 text-xs rounded-lg border-none cursor-pointer font-medium transition-all"
                              style={{ background: "rgba(102,187,106,0.15)", color: "#66BB6A", border: "1px solid rgba(102,187,106,0.3)" }}
                            >
                              {t("actions.confirm")}
                            </button>
                            <button
                              onClick={() => updateStatus(b.booking_id, "rejected")}
                              className="px-3 py-1 text-xs rounded-lg border-none cursor-pointer font-medium transition-all"
                              style={{ background: "rgba(239,83,80,0.15)", color: "#EF5350", border: "1px solid rgba(239,83,80,0.3)" }}
                            >
                              {t("actions.reject")}
                            </button>
                          </>
                        )}
                        {b.status === "confirmed" && (
                          <button
                            onClick={() => updateStatus(b.booking_id, "cancelled")}
                            className="px-3 py-1 text-xs rounded-lg border-none cursor-pointer font-medium transition-all"
                            style={{ background: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.5)", border: "1px solid rgba(255,255,255,0.15)" }}
                          >
                            {t("actions.cancel")}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
