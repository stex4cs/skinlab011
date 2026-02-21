"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Calendar, Clock, CheckCircle, AlertCircle } from "lucide-react";
import type { Booking } from "@/types/database";
import { STATUS_COLORS } from "@/lib/constants";

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
    { label: t("todayBookings"), value: todayCount, icon: Calendar, color: "#D4AF78" },
    { label: t("pendingBookings"), value: pendingCount, icon: AlertCircle, color: "#FFA726" },
    { label: t("totalBookings"), value: bookings.length, icon: CheckCircle, color: "#66BB6A" },
    { label: t("bookings"), value: confirmedCount, icon: Clock, color: "#42A5F5" },
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
      <h1 className="font-heading text-3xl text-dark mb-8">{t("dashboard")}</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <Icon size={24} style={{ color }} />
              <span className="text-3xl font-bold text-dark font-heading">{value}</span>
            </div>
            <p className="text-dark/60 text-sm">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-heading text-xl text-dark">{t("recentBookings")}</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-dark/40">Učitavanje...</div>
        ) : bookings.length === 0 ? (
          <div className="p-8 text-center text-dark/40">Nema rezervacija.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-light">
                <tr>
                  {["ID", "Klijent", "Tretman", "Datum", "Vrijeme", "Status", "Akcije"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-dark/60 uppercase">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-light/50 transition-colors">
                    <td className="px-4 py-3 text-xs text-dark/40 font-mono">{b.booking_id}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-sm text-dark">{b.client_name}</div>
                      <div className="text-xs text-dark/40">{b.client_email}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-dark/80">{b.treatment_name}</td>
                    <td className="px-4 py-3 text-sm text-dark/80">{b.booking_date}</td>
                    <td className="px-4 py-3 text-sm text-dark/80">{b.booking_time?.slice(0, 5)}</td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-1 rounded-full text-white text-xs font-medium"
                        style={{ backgroundColor: STATUS_COLORS[b.status] || "#999" }}
                      >
                        {t(`status.${b.status}`)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {b.status === "pending" && (
                          <>
                            <button
                              onClick={() => updateStatus(b.booking_id, "confirmed")}
                              className="px-3 py-1 bg-green-500 text-white text-xs rounded-lg border-none cursor-pointer hover:bg-green-600"
                            >
                              {t("actions.confirm")}
                            </button>
                            <button
                              onClick={() => updateStatus(b.booking_id, "rejected")}
                              className="px-3 py-1 bg-red-500 text-white text-xs rounded-lg border-none cursor-pointer hover:bg-red-600"
                            >
                              {t("actions.reject")}
                            </button>
                          </>
                        )}
                        {b.status === "confirmed" && (
                          <button
                            onClick={() => updateStatus(b.booking_id, "cancelled")}
                            className="px-3 py-1 bg-gray-400 text-white text-xs rounded-lg border-none cursor-pointer hover:bg-gray-500"
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
