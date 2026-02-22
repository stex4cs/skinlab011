"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import type { Booking } from "@/types/database";
import { STATUS_COLORS } from "@/lib/constants";

const CARD = "#1C1C28";
const CARD_BORDER = "rgba(255,255,255,0.06)";
const TEXT = "rgba(255,255,255,0.85)";
const TEXT_MUTED = "rgba(255,255,255,0.4)";
const GOLD = "#D4AF78";

interface BookingWithCategory extends Booking {
  treatment_categories?: { color: string; name_me: string };
}

export default function BookingsCalendarPage() {
  const t = useTranslations("admin");
  const [bookings, setBookings] = useState<BookingWithCategory[]>([]);
  const [selected, setSelected] = useState<BookingWithCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    fetch("/api/bookings?limit=200")
      .then((r) => r.json())
      .then((data) => {
        setBookings(Array.isArray(data) ? data : []);
        setLoading(false);
      });
  }, []);

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
    if (selected?.booking_id === bookingId) {
      setSelected((s) => s ? { ...s, status: status as Booking["status"] } : null);
    }
  }

  const events = bookings.map((b) => ({
    id: b.booking_id,
    title: `${b.client_name} - ${b.treatment_name}`,
    start: `${b.booking_date}T${b.booking_time}`,
    backgroundColor: b.treatment_categories?.color || "#D4AF78",
    borderColor: "transparent",
    textColor: "#111118",
    extendedProps: { booking: b },
  }));

  const categoryColors = bookings.map((b) => ({
    color: b.treatment_categories?.color || "#D4AF78",
    name: b.treatment_categories?.name_me || "Tretman",
  }));
  const uniqueLegend = categoryColors.filter(
    (v, i, a) => a.findIndex((t) => t.color === v.color) === i
  );

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="mb-4 md:mb-6">
        <h1 className="font-heading text-2xl md:text-3xl mb-1" style={{ color: TEXT }}>
          {t("bookings")}
        </h1>
        <div style={{ height: "2px", width: "48px", background: `linear-gradient(to right, ${GOLD}, transparent)`, marginTop: "8px" }} />
      </div>

      {/* Legend - scrollable on mobile */}
      {uniqueLegend.length > 0 && (
        <div
          className="flex gap-3 mb-4 p-3 md:p-4 rounded-xl overflow-x-auto"
          style={{ background: CARD, border: `1px solid ${CARD_BORDER}` }}
        >
          <div className="flex gap-3 flex-shrink-0">
            {uniqueLegend.map(({ color, name }) => (
              <div key={color} className="flex items-center gap-1.5 text-xs whitespace-nowrap" style={{ color: TEXT_MUTED }}>
                <div
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: color, boxShadow: `0 0 6px ${color}80` }}
                />
                {name}
              </div>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-4 text-xs ml-auto">
            {Object.entries(STATUS_COLORS).map(([status, color]) => (
              <div key={status} className="flex items-center gap-1" style={{ color: TEXT_MUTED }}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                {t(`status.${status}`)}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calendar */}
      <div
        className="rounded-xl md:rounded-2xl overflow-hidden p-3 md:p-5"
        style={{ background: CARD, border: `1px solid ${CARD_BORDER}` }}
      >
        {loading ? (
          <div className="h-64 md:h-96 flex items-center justify-center" style={{ color: TEXT_MUTED }}>
            Učitavanje...
          </div>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
            initialView={isMobile ? "listWeek" : "dayGridMonth"}
            headerToolbar={
              isMobile
                ? {
                    left: "prev,next",
                    center: "title",
                    right: "listWeek,listMonth",
                  }
                : {
                    left: "prev,next today",
                    center: "title",
                    right: "dayGridMonth,timeGridWeek,timeGridDay",
                  }
            }
            views={{
              listWeek: { buttonText: "Sedmica" },
              listMonth: { buttonText: "Mjesec" },
            }}
            events={events}
            eventClick={(info) => {
              setSelected(info.event.extendedProps.booking);
            }}
            height="auto"
            locale="sr"
          />
        )}
      </div>

      {/* Detail Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
          onClick={() => setSelected(null)}
        >
          <div
            className="w-full md:max-w-md rounded-t-2xl md:rounded-2xl p-6 md:p-8"
            style={{
              background: "#1E1E2E",
              border: "1px solid rgba(212,175,120,0.2)",
              boxShadow: "0 -20px 60px rgba(0,0,0,0.5)",
              maxHeight: "85vh",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag handle (mobile) */}
            <div className="md:hidden flex justify-center mb-4">
              <div
                className="w-10 h-1 rounded-full"
                style={{ background: "rgba(255,255,255,0.2)" }}
              />
            </div>

            <h2 className="font-heading text-xl md:text-2xl mb-1" style={{ color: TEXT }}>
              {selected.client_name}
            </h2>
            <p className="text-sm font-medium mb-5" style={{ color: GOLD }}>
              {selected.treatment_name}
            </p>

            <div style={{ height: "1px", background: "rgba(255,255,255,0.06)", marginBottom: "1.25rem" }} />

            <div className="space-y-3 text-sm mb-6">
              {[
                { label: "Email", value: selected.client_email },
                { label: "Telefon", value: selected.client_phone },
                { label: "Datum", value: selected.booking_date },
                { label: "Vrijeme", value: selected.booking_time?.slice(0, 5) },
                ...(selected.message ? [{ label: "Napomena", value: selected.message }] : []),
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between gap-4">
                  <span style={{ color: TEXT_MUTED, flexShrink: 0 }}>{label}</span>
                  <span style={{ color: TEXT, textAlign: "right" }}>{value}</span>
                </div>
              ))}
              <div className="flex justify-between gap-4">
                <span style={{ color: TEXT_MUTED }}>Status</span>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{
                    background: `${STATUS_COLORS[selected.status]}22`,
                    color: STATUS_COLORS[selected.status],
                    border: `1px solid ${STATUS_COLORS[selected.status]}44`,
                  }}
                >
                  {t(`status.${selected.status}`)}
                </span>
              </div>
            </div>

            <div className="flex gap-3">
              {selected.status === "pending" && (
                <>
                  <button
                    onClick={() => updateStatus(selected.booking_id, "confirmed")}
                    className="flex-1 py-3 rounded-xl border-none cursor-pointer font-medium text-sm"
                    style={{ background: "rgba(102,187,106,0.15)", color: "#66BB6A", border: "1px solid rgba(102,187,106,0.3)" }}
                  >
                    {t("actions.confirm")}
                  </button>
                  <button
                    onClick={() => updateStatus(selected.booking_id, "rejected")}
                    className="flex-1 py-3 rounded-xl border-none cursor-pointer font-medium text-sm"
                    style={{ background: "rgba(239,83,80,0.15)", color: "#EF5350", border: "1px solid rgba(239,83,80,0.3)" }}
                  >
                    {t("actions.reject")}
                  </button>
                </>
              )}
              {selected.status === "confirmed" && (
                <button
                  onClick={() => updateStatus(selected.booking_id, "cancelled")}
                  className="flex-1 py-3 rounded-xl border-none cursor-pointer font-medium text-sm"
                  style={{ background: "rgba(255,255,255,0.07)", color: TEXT_MUTED, border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  {t("actions.cancel")}
                </button>
              )}
              <button
                onClick={() => setSelected(null)}
                className="flex-1 py-3 rounded-xl border-none cursor-pointer font-medium text-sm"
                style={{ background: "rgba(255,255,255,0.05)", color: TEXT_MUTED, border: "1px solid rgba(255,255,255,0.08)" }}
              >
                Zatvori
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
