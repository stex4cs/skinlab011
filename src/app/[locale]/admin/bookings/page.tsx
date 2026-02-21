"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { Booking } from "@/types/database";
import { STATUS_COLORS } from "@/lib/constants";

interface BookingWithCategory extends Booking {
  treatment_categories?: { color: string; name_me: string };
}

export default function BookingsCalendarPage() {
  const t = useTranslations("admin");
  const [bookings, setBookings] = useState<BookingWithCategory[]>([]);
  const [selected, setSelected] = useState<BookingWithCategory | null>(null);
  const [loading, setLoading] = useState(true);

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
    borderColor: b.treatment_categories?.color || "#D4AF78",
    textColor: "#2C2C2C",
    extendedProps: { booking: b },
  }));

  // Category legend
  const categoryColors = [...new Set(bookings.map((b) => ({
    color: b.treatment_categories?.color || "#D4AF78",
    name: b.treatment_categories?.name_me || "Tretman",
  })))];
  const uniqueLegend = categoryColors.filter(
    (v, i, a) => a.findIndex((t) => t.color === v.color) === i
  );

  return (
    <div className="p-8">
      <h1 className="font-heading text-3xl text-dark mb-6">{t("bookings")}</h1>

      {/* Legend */}
      {uniqueLegend.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-6">
          {uniqueLegend.map(({ color, name }) => (
            <div key={color} className="flex items-center gap-2 text-sm text-dark/70">
              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
              {name}
            </div>
          ))}
          <div className="ml-4 flex items-center gap-3 text-sm">
            {Object.entries(STATUS_COLORS).map(([status, color]) => (
              <div key={status} className="flex items-center gap-1 text-dark/60">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                {t(`status.${status}`)}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm p-4">
        {loading ? (
          <div className="h-96 flex items-center justify-center text-dark/40">Učitavanje...</div>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
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
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-2xl p-8 max-w-md w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-heading text-2xl text-dark mb-1">{selected.client_name}</h2>
            <p className="text-primary text-sm mb-4">{selected.treatment_name}</p>

            <div className="space-y-2 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-dark/50">Email:</span>
                <span>{selected.client_email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark/50">Telefon:</span>
                <span>{selected.client_phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark/50">Datum:</span>
                <span>{selected.booking_date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark/50">Vrijeme:</span>
                <span>{selected.booking_time?.slice(0, 5)}</span>
              </div>
              {selected.message && (
                <div className="flex justify-between">
                  <span className="text-dark/50">Napomena:</span>
                  <span className="text-right max-w-[200px]">{selected.message}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-dark/50">Status:</span>
                <span
                  className="px-2 py-0.5 rounded-full text-white text-xs"
                  style={{ backgroundColor: STATUS_COLORS[selected.status] }}
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
                    className="flex-1 py-2 bg-green-500 text-white rounded-xl border-none cursor-pointer hover:bg-green-600 font-medium text-sm"
                  >
                    {t("actions.confirm")}
                  </button>
                  <button
                    onClick={() => updateStatus(selected.booking_id, "rejected")}
                    className="flex-1 py-2 bg-red-500 text-white rounded-xl border-none cursor-pointer hover:bg-red-600 font-medium text-sm"
                  >
                    {t("actions.reject")}
                  </button>
                </>
              )}
              {selected.status === "confirmed" && (
                <button
                  onClick={() => updateStatus(selected.booking_id, "cancelled")}
                  className="flex-1 py-2 bg-gray-400 text-white rounded-xl border-none cursor-pointer hover:bg-gray-500 font-medium text-sm"
                >
                  {t("actions.cancel")}
                </button>
              )}
              <button
                onClick={() => setSelected(null)}
                className="flex-1 py-2 bg-light text-dark rounded-xl border-none cursor-pointer hover:bg-secondary font-medium text-sm"
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
