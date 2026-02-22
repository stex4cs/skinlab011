"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { DayPicker } from "react-day-picker";
import { createClient } from "@/lib/supabase/client";
import type { CategoryWithTreatments, Locale } from "@/types/database";
import { getLocalizedName } from "@/types/database";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import "react-day-picker/style.css";

interface AvailabilityData {
  slots: string[];
  bookedSlots: string[];
  closed: boolean;
  hours?: { open: string; close: string };
}

const DAYS_ME = ["Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"];
const MONTHS_ME = [
  "Januar", "Februar", "Mart", "April", "Maj", "Jun",
  "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"
];
const DAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const DAYS_RU = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const MONTHS_RU = [
  "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
  "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"
];

function getLocaleNames(locale: string) {
  if (locale === "en") return { days: DAYS_EN, months: MONTHS_EN };
  if (locale === "ru") return { days: DAYS_RU, months: MONTHS_RU };
  return { days: DAYS_ME, months: MONTHS_ME };
}

function formatDate(date: Date, locale: string): string {
  const { days, months } = getLocaleNames(locale);
  return `${days[date.getDay()]}, ${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`;
}

export default function BookingCalendar() {
  const t = useTranslations("booking");
  const locale = useLocale() as Locale;
  const { months } = getLocaleNames(locale);

  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<CategoryWithTreatments[]>([]);

  // Selections
  const [selectedTreatment, setSelectedTreatment] = useState<{ id: string; name: string; price: string; categoryColor: string } | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availability, setAvailability] = useState<AvailabilityData | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  // Form
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    const supabase = createClient();
    Promise.all([
      supabase.from("treatment_categories").select("*").order("sort_order"),
      supabase.from("treatments").select("*").eq("is_active", true).order("sort_order"),
    ]).then(([{ data: cats }, { data: treatments }]) => {
      if (cats && treatments) {
        const withTreatments = cats.map((cat) => ({
          ...cat,
          treatments: treatments.filter((tr) => tr.category_id === cat.id),
        }));
        setCategories(withTreatments);
        if (withTreatments.length > 0) setOpenCategory(withTreatments[0].id);
      }
    });
  }, []);

  // Fetch slots when date changes
  useEffect(() => {
    if (!selectedDate) return;
    const dateStr = selectedDate.toLocaleDateString("sv"); // YYYY-MM-DD
    setLoadingSlots(true);
    setSelectedTime(null);
    fetch(`/api/bookings/available?date=${dateStr}`)
      .then((r) => r.json())
      .then((data) => {
        setAvailability(data);
        setLoadingSlots(false);
      });
  }, [selectedDate]);

  async function handleSubmit() {
    if (!selectedTreatment || !selectedDate || !selectedTime) return;
    if (!form.name || !form.email || !form.phone) {
      toast.error("Molimo popunite sva obavezna polja.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          treatmentId: selectedTreatment.id,
          date: selectedDate.toLocaleDateString("sv"),
          time: selectedTime,
          message: form.message,
          locale,
        }),
      });

      const result = await res.json();
      if (result.success) {
        toast.success(t("form.success"));
        // Reset
        setStep(1);
        setSelectedTreatment(null);
        setSelectedDate(undefined);
        setSelectedTime(null);
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        toast.error(result.message || t("form.error"));
        if (res.status === 409) {
          // Slot taken - go back to slot selection
          setStep(3);
          setSelectedTime(null);
          if (selectedDate) {
            const dateStr = selectedDate.toLocaleDateString("sv");
            fetch(`/api/bookings/available?date=${dateStr}`)
              .then((r) => r.json())
              .then(setAvailability);
          }
        }
      }
    } catch {
      toast.error(t("form.error"));
    } finally {
      setSubmitting(false);
    }
  }

  const isSunday = (date: Date) => date.getDay() === 0;

  return (
    <section id="booking" className="pt-24 pb-36" style={{ background: "var(--color-secondary)" }}>
      <div className="container">
        <h2 className="section-title">{t("title")}</h2>
        <p className="section-subtitle">{t("subtitle")}</p>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (s < step) setStep(s);
                }}
                disabled={s >= step}
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold border-none transition-all"
                style={
                  s === step
                    ? { background: "var(--color-primary)", color: "white", boxShadow: "0 4px 12px rgba(212,175,120,0.4)" }
                    : s < step
                    ? { background: "rgba(212,175,120,0.2)", color: "var(--color-primary)", cursor: "pointer" }
                    : { background: "rgba(44,44,44,0.08)", color: "rgba(44,44,44,0.3)", cursor: "default" }
                }
              >
                {s < step ? "✓" : s}
              </button>
              {s < 4 && (
                <div
                  className="h-px w-8 md:w-16"
                  style={{ background: s < step ? "var(--color-primary)" : "rgba(44,44,44,0.12)" }}
                />
              )}
            </div>
          ))}
        </div>

        {/* ── STEP 1: Select treatment ── */}
        {step === 1 && (
          <div className="max-w-3xl mx-auto">
            <h3 className="font-heading text-xl text-center mb-8" style={{ color: "var(--color-dark)" }}>
              {t("calendar.selectTreatment")}
            </h3>
            <div className="space-y-3">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className="rounded-2xl overflow-hidden"
                  style={{
                    background: "white",
                    boxShadow: "0 2px 16px rgba(212,175,120,0.08)",
                    border: openCategory === cat.id ? `1px solid ${cat.color}` : "1px solid rgba(212,175,120,0.15)",
                  }}
                >
                  <button
                    onClick={() => setOpenCategory(openCategory === cat.id ? null : cat.id)}
                    className="w-full flex items-center justify-between p-4 bg-transparent border-none cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: cat.color }}
                      />
                      <span className="font-heading font-semibold" style={{ color: "var(--color-dark)", fontSize: "0.95rem" }}>
                        {getLocalizedName(cat, locale)}
                      </span>
                      <span style={{ fontSize: "0.75rem", color: "rgba(44,44,44,0.4)" }}>
                        ({cat.treatments.length})
                      </span>
                    </div>
                    <span style={{ color: "var(--color-primary)", fontSize: "1.2rem" }}>
                      {openCategory === cat.id ? "−" : "+"}
                    </span>
                  </button>

                  {openCategory === cat.id && (
                    <div style={{ borderTop: `1px solid rgba(212,175,120,0.1)` }}>
                      {cat.treatments.map((tr) => (
                        <button
                          key={tr.id}
                          onClick={() => {
                            setSelectedTreatment({
                              id: tr.id,
                              name: getLocalizedName(tr, locale),
                              price: tr.price,
                              categoryColor: cat.color,
                            });
                            setStep(2);
                          }}
                          className="w-full flex items-center justify-between px-5 py-3 bg-transparent border-none cursor-pointer text-left transition-all"
                          style={{ borderTop: "1px solid rgba(212,175,120,0.06)" }}
                          onMouseEnter={(e) => {
                            (e.currentTarget as HTMLElement).style.background = `${cat.color}30`;
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background = "transparent";
                          }}
                        >
                          <span style={{ fontSize: "0.88rem", color: "var(--color-dark)" }}>
                            {getLocalizedName(tr, locale)}
                          </span>
                          <span
                            className="font-semibold flex-shrink-0 ml-4"
                            style={{ fontSize: "0.88rem", color: "var(--color-primary)" }}
                          >
                            {tr.price}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── STEP 2: Select date ── */}
        {step === 2 && selectedTreatment && (
          <div className="max-w-xl mx-auto">
            <div className="flex items-center gap-3 mb-6 justify-center">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedTreatment.categoryColor }} />
              <span className="font-semibold" style={{ color: "var(--color-dark)" }}>{selectedTreatment.name}</span>
              <span style={{ color: "var(--color-primary)" }}>{selectedTreatment.price}</span>
            </div>
            <h3 className="font-heading text-xl text-center mb-6" style={{ color: "var(--color-dark)" }}>
              {t("calendar.selectDate")}
            </h3>
            <div
              className="rounded-2xl p-4 md:p-8"
              style={{ background: "white", boxShadow: "0 8px 40px rgba(212,175,120,0.12)" }}
            >
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={(date) => {
                  setSelectedDate(date);
                  if (date) setStep(3);
                }}
                disabled={[
                  { before: today },
                  isSunday,
                ]}
                formatters={{
                  formatCaption: (date) => `${months[date.getMonth()]} ${date.getFullYear()}`,
                  formatWeekdayName: (date) => {
                    const { days } = getLocaleNames(locale);
                    return days[date.getDay()];
                  },
                }}
                components={{
                  PreviousMonthButton: (props) => (
                    <button {...props} className="rdp-nav-button" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-primary)", padding: "4px" }}>
                      <ChevronLeft size={20} />
                    </button>
                  ),
                  NextMonthButton: (props) => (
                    <button {...props} className="rdp-nav-button" style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-primary)", padding: "4px" }}>
                      <ChevronRight size={20} />
                    </button>
                  ),
                }}
              />
              <p className="text-center text-xs mt-4" style={{ color: "rgba(44,44,44,0.4)" }}>
                {locale === "ru" ? "Воскресенье — выходной" : locale === "en" ? "Sundays — closed" : "Nedjelja — zatvoreno"}
              </p>
            </div>
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 mx-auto mt-4 bg-transparent border-none cursor-pointer text-sm"
              style={{ color: "rgba(44,44,44,0.5)" }}
            >
              <ChevronLeft size={14} />
              {locale === "ru" ? "Назад" : locale === "en" ? "Back" : "Nazad"}
            </button>
          </div>
        )}

        {/* ── STEP 3: Select time slot ── */}
        {step === 3 && selectedTreatment && selectedDate && (
          <div className="max-w-xl mx-auto">
            <div className="flex items-center gap-3 mb-6 justify-center flex-wrap">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedTreatment.categoryColor }} />
              <span className="font-semibold" style={{ color: "var(--color-dark)" }}>{selectedTreatment.name}</span>
              <span style={{ color: "rgba(44,44,44,0.3)" }}>·</span>
              <span style={{ color: "var(--color-primary)" }}>{formatDate(selectedDate, locale)}</span>
            </div>
            <h3 className="font-heading text-xl text-center mb-6" style={{ color: "var(--color-dark)" }}>
              {t("calendar.selectTime")}
            </h3>
            <div
              className="rounded-2xl p-6 md:p-8"
              style={{ background: "white", boxShadow: "0 8px 40px rgba(212,175,120,0.12)" }}
            >
              {loadingSlots ? (
                <div className="flex justify-center py-8">
                  <Loader2 size={28} className="animate-spin" style={{ color: "var(--color-primary)" }} />
                </div>
              ) : availability?.closed ? (
                <div className="text-center py-8" style={{ color: "rgba(44,44,44,0.5)" }}>
                  <div className="text-4xl mb-3">🔒</div>
                  <p>{t("calendar.closed")}</p>
                </div>
              ) : (
                <>
                  {/* Legend */}
                  <div className="flex items-center gap-4 mb-5 justify-center text-xs" style={{ color: "rgba(44,44,44,0.5)" }}>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full" style={{ background: "rgba(212,175,120,0.2)", border: "1px solid #D4AF78" }} />
                      {t("calendar.available")}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full" style={{ background: "rgba(239,83,80,0.12)", border: "1px solid #EF5350" }} />
                      {t("calendar.booked")}
                    </div>
                  </div>

                  {/* Time grid */}
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {availability?.slots.map((slot) => {
                      const isBooked = availability.bookedSlots.includes(slot);
                      const isSelected = selectedTime === slot;
                      return (
                        <button
                          key={slot}
                          disabled={isBooked}
                          onClick={() => {
                            setSelectedTime(slot);
                            setStep(4);
                          }}
                          className="py-3 rounded-xl text-sm font-semibold border-none transition-all"
                          style={
                            isBooked
                              ? {
                                  background: "rgba(239,83,80,0.08)",
                                  color: "rgba(239,83,80,0.5)",
                                  border: "1px solid rgba(239,83,80,0.2)",
                                  cursor: "not-allowed",
                                  textDecoration: "line-through",
                                }
                              : isSelected
                              ? {
                                  background: "var(--color-primary)",
                                  color: "white",
                                  border: "1px solid var(--color-primary)",
                                  boxShadow: "0 4px 12px rgba(212,175,120,0.4)",
                                  cursor: "pointer",
                                }
                              : {
                                  background: "rgba(212,175,120,0.08)",
                                  color: "var(--color-dark)",
                                  border: "1px solid rgba(212,175,120,0.25)",
                                  cursor: "pointer",
                                }
                          }
                          onMouseEnter={(e) => {
                            if (!isBooked && !isSelected) {
                              (e.currentTarget as HTMLElement).style.background = "rgba(212,175,120,0.18)";
                              (e.currentTarget as HTMLElement).style.borderColor = "var(--color-primary)";
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (!isBooked && !isSelected) {
                              (e.currentTarget as HTMLElement).style.background = "rgba(212,175,120,0.08)";
                              (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,175,120,0.25)";
                            }
                          }}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-2 mx-auto mt-4 bg-transparent border-none cursor-pointer text-sm"
              style={{ color: "rgba(44,44,44,0.5)" }}
            >
              <ChevronLeft size={14} />
              {locale === "ru" ? "Назад" : locale === "en" ? "Back" : "Nazad"}
            </button>
          </div>
        )}

        {/* ── STEP 4: Contact form ── */}
        {step === 4 && selectedTreatment && selectedDate && selectedTime && (
          <div className="max-w-xl mx-auto">
            <h3 className="font-heading text-xl text-center mb-6" style={{ color: "var(--color-dark)" }}>
              {t("calendar.confirm")}
            </h3>

            {/* Summary */}
            <div
              className="rounded-2xl p-5 mb-6"
              style={{
                background: `${selectedTreatment.categoryColor}40`,
                border: `1px solid ${selectedTreatment.categoryColor}`,
              }}
            >
              <div className="flex items-start gap-3">
                <div className="w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: selectedTreatment.categoryColor }} />
                <div>
                  <div className="font-semibold mb-0.5" style={{ color: "var(--color-dark)", fontSize: "0.95rem" }}>
                    {selectedTreatment.name}
                  </div>
                  <div style={{ color: "var(--color-primary)", fontSize: "0.88rem", fontWeight: 600 }}>
                    {selectedTreatment.price}
                  </div>
                  <div className="mt-1" style={{ color: "rgba(44,44,44,0.6)", fontSize: "0.85rem" }}>
                    📅 {formatDate(selectedDate, locale)} · ⏰ {selectedTime}
                  </div>
                </div>
                <button
                  onClick={() => setStep(3)}
                  className="ml-auto bg-transparent border-none cursor-pointer text-xs"
                  style={{ color: "var(--color-primary)" }}
                >
                  {locale === "ru" ? "Изменить" : locale === "en" ? "Change" : "Izmijeni"}
                </button>
              </div>
            </div>

            {/* Form */}
            <div
              className="rounded-2xl p-6 md:p-8"
              style={{ background: "white", boxShadow: "0 8px 40px rgba(212,175,120,0.12)" }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1.5" style={{ color: "rgba(44,44,44,0.55)", letterSpacing: "0.8px" }}>
                    {t("form.name")} *
                  </label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    required
                    className="w-full rounded-xl px-4 py-3 text-sm border outline-none"
                    style={{ border: "1px solid rgba(212,175,120,0.3)", background: "var(--color-light)", color: "var(--color-dark)", fontFamily: "var(--font-body)" }}
                    onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(212,175,120,0.3)"; }}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase mb-1.5" style={{ color: "rgba(44,44,44,0.55)", letterSpacing: "0.8px" }}>
                    {t("form.email")} *
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    required
                    className="w-full rounded-xl px-4 py-3 text-sm border outline-none"
                    style={{ border: "1px solid rgba(212,175,120,0.3)", background: "var(--color-light)", color: "var(--color-dark)", fontFamily: "var(--font-body)" }}
                    onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; }}
                    onBlur={(e) => { e.target.style.borderColor = "rgba(212,175,120,0.3)"; }}
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold uppercase mb-1.5" style={{ color: "rgba(44,44,44,0.55)", letterSpacing: "0.8px" }}>
                  {t("form.phone")} *
                </label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  required
                  className="w-full rounded-xl px-4 py-3 text-sm border outline-none"
                  style={{ border: "1px solid rgba(212,175,120,0.3)", background: "var(--color-light)", color: "var(--color-dark)", fontFamily: "var(--font-body)" }}
                  onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(212,175,120,0.3)"; }}
                />
              </div>
              <div className="mb-6">
                <label className="block text-xs font-semibold uppercase mb-1.5" style={{ color: "rgba(44,44,44,0.55)", letterSpacing: "0.8px" }}>
                  {t("form.message")}
                </label>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  className="w-full rounded-xl px-4 py-3 text-sm border outline-none"
                  style={{ border: "1px solid rgba(212,175,120,0.3)", background: "var(--color-light)", color: "var(--color-dark)", fontFamily: "var(--font-body)", resize: "none" }}
                  onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(212,175,120,0.3)"; }}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="cta-button w-full border-none cursor-pointer flex items-center justify-center gap-2"
                style={{ opacity: submitting ? 0.7 : 1, cursor: submitting ? "not-allowed" : "pointer" }}
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                {submitting ? t("form.submitting") : t("form.submit")}
              </button>
            </div>

            <button
              onClick={() => setStep(3)}
              className="flex items-center gap-2 mx-auto mt-4 bg-transparent border-none cursor-pointer text-sm"
              style={{ color: "rgba(44,44,44,0.5)" }}
            >
              <ChevronLeft size={14} />
              {locale === "ru" ? "Назад" : locale === "en" ? "Back" : "Nazad"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
