"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { DayPicker } from "react-day-picker";
import { createClient } from "@/lib/supabase/client";
import type { CategoryWithTreatments, Locale } from "@/types/database";
import { getLocalizedName } from "@/types/database";
import { Loader2, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import toast from "react-hot-toast";
import "react-day-picker/style.css";

interface AvailabilityData {
  slots: string[];
  bookedSlots: string[];
  closed: boolean;
  hours?: { open: string; close: string };
}

const DAYS_ME = ["Ned", "Pon", "Uto", "Sri", "Čet", "Pet", "Sub"];
const MONTHS_ME = ["Januar", "Februar", "Mart", "April", "Maj", "Jun", "Jul", "Avgust", "Septembar", "Oktobar", "Novembar", "Decembar"];
const DAYS_EN = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS_RU = ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"];
const MONTHS_RU = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

function getLocaleNames(locale: string) {
  if (locale === "en") return { days: DAYS_EN, months: MONTHS_EN };
  if (locale === "ru") return { days: DAYS_RU, months: MONTHS_RU };
  return { days: DAYS_ME, months: MONTHS_ME };
}

function formatDate(date: Date, locale: string): string {
  const { days, months } = getLocaleNames(locale);
  return `${days[date.getDay()]}, ${date.getDate()}. ${months[date.getMonth()]} ${date.getFullYear()}`;
}

function back(locale: string) {
  return locale === "ru" ? "Назад" : locale === "en" ? "Back" : "Nazad";
}

export default function BookingCalendar() {
  const t = useTranslations("booking");
  const locale = useLocale() as Locale;
  const { months } = getLocaleNames(locale);

  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState<CategoryWithTreatments[]>([]);
  const [selectedTreatment, setSelectedTreatment] = useState<{ id: string; name: string; price: string; categoryColor: string } | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [availability, setAvailability] = useState<AvailabilityData | null>(null);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null); // none open by default
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
        setCategories(cats.map((cat) => ({
          ...cat,
          treatments: treatments.filter((tr) => tr.category_id === cat.id),
        })));
        // no default open category
      }
    });
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    const dateStr = selectedDate.toLocaleDateString("sv");
    setLoadingSlots(true);
    setSelectedTime(null);
    fetch(`/api/bookings/available?date=${dateStr}`)
      .then((r) => r.json())
      .then((data) => { setAvailability(data); setLoadingSlots(false); });
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
          name: form.name, email: form.email, phone: form.phone,
          treatmentId: selectedTreatment.id,
          date: selectedDate.toLocaleDateString("sv"),
          time: selectedTime, message: form.message, locale,
        }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success(t("form.success"));
        setStep(1); setSelectedTreatment(null); setSelectedDate(undefined);
        setSelectedTime(null); setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        toast.error(result.message || t("form.error"));
        if (res.status === 409) {
          setStep(3); setSelectedTime(null);
          if (selectedDate) {
            fetch(`/api/bookings/available?date=${selectedDate.toLocaleDateString("sv")}`)
              .then((r) => r.json()).then(setAvailability);
          }
        }
      }
    } catch { toast.error(t("form.error")); }
    finally { setSubmitting(false); }
  }

  const isSunday = (date: Date) => date.getDay() === 0;

  const stepLabels = locale === "ru"
    ? ["Процедура", "Дата", "Время", "Данные"]
    : locale === "en"
    ? ["Treatment", "Date", "Time", "Details"]
    : ["Tretman", "Datum", "Termin", "Podaci"];

  const inputCls = "w-full rounded-xl px-4 py-3 text-sm outline-none transition-all";
  const inputStyle: React.CSSProperties = {
    border: "1px solid rgba(212,175,120,0.25)",
    background: "#FDFAF7",
    color: "var(--color-dark)",
    fontFamily: "var(--font-body)",
  };

  return (
    <section id="booking" className="pt-24 pb-36" style={{ background: "var(--color-secondary)" }}>
      <div className="container">
        <h2 className="section-title">{t("title")}</h2>
        <p className="section-subtitle">{t("subtitle")}</p>

        {/* ── Step indicator ── */}
        <div className="flex items-start justify-center gap-0 mb-14">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-start">
              <div className="flex flex-col items-center" style={{ minWidth: "64px" }}>
                <button
                  onClick={() => { if (s < step) setStep(s); }}
                  disabled={s >= step}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold border-none transition-all mb-2"
                  style={
                    s === step
                      ? { background: "var(--color-primary)", color: "white", boxShadow: "0 4px 16px rgba(212,175,120,0.45)" }
                      : s < step
                      ? { background: "rgba(212,175,120,0.15)", color: "var(--color-primary)", border: "1.5px solid rgba(212,175,120,0.5)", cursor: "pointer" }
                      : { background: "rgba(44,44,44,0.06)", color: "rgba(44,44,44,0.25)", cursor: "default" }
                  }
                >
                  {s < step ? "✓" : s}
                </button>
                <span
                  className="text-xs text-center"
                  style={{
                    color: s === step ? "var(--color-primary)" : s < step ? "rgba(44,44,44,0.5)" : "rgba(44,44,44,0.25)",
                    letterSpacing: "0.3px",
                    fontWeight: s === step ? 600 : 400,
                  }}
                >
                  {stepLabels[s - 1]}
                </span>
              </div>
              {s < 4 && (
                <div
                  className="mt-5 mx-1 md:mx-3"
                  style={{
                    height: "1.5px",
                    width: "40px",
                    background: s < step
                      ? "linear-gradient(to right, rgba(212,175,120,0.6), rgba(212,175,120,0.3))"
                      : "rgba(44,44,44,0.1)",
                    flexShrink: 0,
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* ── STEP 1: Select treatment ── */}
        {step === 1 && (
          <div style={{ maxWidth: "42rem", margin: "0 auto", width: "100%" }}>
            <p className="text-center text-sm mb-8" style={{ color: "rgba(44,44,44,0.5)", letterSpacing: "0.3px" }}>
              {t("calendar.selectTreatment")}
            </p>
            <div className="space-y-2">
              {categories.map((cat) => {
                const isOpen = openCategory === cat.id;
                return (
                  <div
                    key={cat.id}
                    className="rounded-2xl overflow-hidden"
                    style={{
                      background: "white",
                      border: isOpen ? `1px solid ${cat.color}` : "1px solid rgba(212,175,120,0.12)",
                      boxShadow: isOpen ? `0 4px 24px ${cat.color}30` : "0 1px 8px rgba(212,175,120,0.06)",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {/* Category header */}
                    <button
                      onClick={() => setOpenCategory(isOpen ? null : cat.id)}
                      className="w-full flex items-center justify-between px-5 py-4 bg-transparent border-none cursor-pointer text-left"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: cat.color,
                            boxShadow: `0 0 0 3px ${cat.color}30`,
                          }}
                        />
                        <span
                          className="font-heading font-semibold"
                          style={{ color: "var(--color-dark)", fontSize: "0.92rem", letterSpacing: "0.3px" }}
                        >
                          {getLocalizedName(cat, locale)}
                        </span>
                        <span style={{ fontSize: "0.72rem", color: "rgba(44,44,44,0.35)", background: "rgba(44,44,44,0.05)", padding: "2px 8px", borderRadius: "999px" }}>
                          {cat.treatments.length}
                        </span>
                      </div>
                      <ChevronDown
                        size={16}
                        style={{
                          color: isOpen ? "var(--color-primary)" : "rgba(44,44,44,0.3)",
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s ease",
                        }}
                      />
                    </button>

                    {/* Treatment list */}
                    {isOpen && (
                      <div style={{ borderTop: `1px solid ${cat.color}30` }}>
                        {cat.treatments.map((tr, i) => (
                          <button
                            key={tr.id}
                            onClick={() => {
                              setSelectedTreatment({ id: tr.id, name: getLocalizedName(tr, locale), price: tr.price, categoryColor: cat.color });
                              setStep(2);
                            }}
                            className="w-full flex items-center justify-between px-5 py-3.5 bg-transparent border-none cursor-pointer text-left group"
                            style={{
                              borderTop: i > 0 ? `1px solid rgba(44,44,44,0.04)` : "none",
                              transition: "background 0.15s ease",
                            }}
                            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = `${cat.color}20`; }}
                            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color, opacity: 0.6 }} />
                              <span style={{ fontSize: "0.87rem", color: "var(--color-dark)", lineHeight: 1.4 }}>
                                {getLocalizedName(tr, locale)}
                              </span>
                            </div>
                            <span className="flex-shrink-0 ml-4 font-semibold" style={{ fontSize: "0.87rem", color: "var(--color-primary)" }}>
                              {tr.price}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── STEP 2: Select date ── */}
        {step === 2 && selectedTreatment && (
          <div style={{ maxWidth: "28rem", margin: "0 auto", width: "100%" }}>
            {/* Selected treatment pill */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div className="flex items-center gap-2 px-4 py-2 rounded-full" style={{ background: `${selectedTreatment.categoryColor}30`, border: `1px solid ${selectedTreatment.categoryColor}` }}>
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: selectedTreatment.categoryColor }} />
                <span className="text-sm font-medium" style={{ color: "var(--color-dark)" }}>{selectedTreatment.name}</span>
                <span className="text-sm font-semibold" style={{ color: "var(--color-primary)" }}>{selectedTreatment.price}</span>
              </div>
            </div>

            <p className="text-center text-sm mb-6" style={{ color: "rgba(44,44,44,0.5)" }}>
              {t("calendar.selectDate")}
            </p>

            <div
              className="rounded-2xl p-5 md:p-8"
              style={{ background: "white", boxShadow: "0 8px 40px rgba(212,175,120,0.1)", border: "1px solid rgba(212,175,120,0.12)" }}
            >
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={(date) => { setSelectedDate(date); if (date) setStep(3); }}
                disabled={[{ before: today }, isSunday]}
                formatters={{
                  formatCaption: (date) => `${months[date.getMonth()]} ${date.getFullYear()}`,
                  formatWeekdayName: (date) => getLocaleNames(locale).days[date.getDay()],
                }}
                components={{
                  PreviousMonthButton: (props) => (
                    <button {...props} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-primary)", padding: "4px", display: "flex" }}>
                      <ChevronLeft size={18} />
                    </button>
                  ),
                  NextMonthButton: (props) => (
                    <button {...props} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--color-primary)", padding: "4px", display: "flex" }}>
                      <ChevronRight size={18} />
                    </button>
                  ),
                }}
              />
              <p className="text-center text-xs mt-3" style={{ color: "rgba(44,44,44,0.35)" }}>
                {locale === "ru" ? "Воскресенье — выходной" : locale === "en" ? "Sundays — closed" : "Nedjelja — zatvoreno"}
              </p>
            </div>

            <button onClick={() => setStep(1)} className="flex items-center gap-1.5 mx-auto mt-5 bg-transparent border-none cursor-pointer text-sm" style={{ color: "rgba(44,44,44,0.45)" }}>
              <ChevronLeft size={13} /> {back(locale)}
            </button>
          </div>
        )}

        {/* ── STEP 3: Select time slot ── */}
        {step === 3 && selectedTreatment && selectedDate && (
          <div style={{ maxWidth: "28rem", margin: "0 auto", width: "100%" }}>
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 mb-6 flex-wrap">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full" style={{ background: `${selectedTreatment.categoryColor}20`, border: `1px solid ${selectedTreatment.categoryColor}50` }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: selectedTreatment.categoryColor }} />
                <span className="text-xs font-medium" style={{ color: "var(--color-dark)" }}>{selectedTreatment.name}</span>
              </div>
              <span style={{ color: "rgba(44,44,44,0.25)", fontSize: "0.75rem" }}>·</span>
              <span className="text-xs font-medium" style={{ color: "var(--color-primary)" }}>{formatDate(selectedDate, locale)}</span>
            </div>

            <p className="text-center text-sm mb-6" style={{ color: "rgba(44,44,44,0.5)" }}>
              {t("calendar.selectTime")}
            </p>

            <div
              className="rounded-2xl p-6 md:p-8"
              style={{ background: "white", boxShadow: "0 8px 40px rgba(212,175,120,0.1)", border: "1px solid rgba(212,175,120,0.12)" }}
            >
              {loadingSlots ? (
                <div className="flex justify-center py-10">
                  <Loader2 size={26} className="animate-spin" style={{ color: "var(--color-primary)" }} />
                </div>
              ) : availability?.closed ? (
                <div className="text-center py-10" style={{ color: "rgba(44,44,44,0.4)" }}>
                  <div className="text-4xl mb-3">🔒</div>
                  <p className="text-sm">{t("calendar.closed")}</p>
                </div>
              ) : (
                <>
                  {/* Legend */}
                  <div className="flex items-center justify-center gap-5 mb-5 text-xs" style={{ color: "rgba(44,44,44,0.45)" }}>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(212,175,120,0.15)", border: "1.5px solid rgba(212,175,120,0.5)" }} />
                      {t("calendar.available")}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: "rgba(239,83,80,0.08)", border: "1.5px solid rgba(239,83,80,0.3)" }} />
                      {t("calendar.booked")}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2.5">
                    {availability?.slots.map((slot) => {
                      const isBooked = availability.bookedSlots.includes(slot);
                      const isSelected = selectedTime === slot;
                      return (
                        <button
                          key={slot}
                          disabled={isBooked}
                          onClick={() => { setSelectedTime(slot); setStep(4); }}
                          className="py-3 rounded-xl text-sm font-semibold border-none transition-all"
                          style={
                            isBooked
                              ? { background: "rgba(239,83,80,0.05)", color: "rgba(239,83,80,0.4)", border: "1px solid rgba(239,83,80,0.15)", cursor: "not-allowed", textDecoration: "line-through" }
                              : isSelected
                              ? { background: "var(--color-primary)", color: "white", border: "1px solid var(--color-primary)", boxShadow: "0 4px 14px rgba(212,175,120,0.4)", cursor: "pointer" }
                              : { background: "rgba(212,175,120,0.07)", color: "var(--color-dark)", border: "1px solid rgba(212,175,120,0.2)", cursor: "pointer" }
                          }
                          onMouseEnter={(e) => { if (!isBooked && !isSelected) { (e.currentTarget as HTMLElement).style.background = "rgba(212,175,120,0.16)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,175,120,0.5)"; } }}
                          onMouseLeave={(e) => { if (!isBooked && !isSelected) { (e.currentTarget as HTMLElement).style.background = "rgba(212,175,120,0.07)"; (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,175,120,0.2)"; } }}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <button onClick={() => setStep(2)} className="flex items-center gap-1.5 mx-auto mt-5 bg-transparent border-none cursor-pointer text-sm" style={{ color: "rgba(44,44,44,0.45)" }}>
              <ChevronLeft size={13} /> {back(locale)}
            </button>
          </div>
        )}

        {/* ── STEP 4: Contact form ── */}
        {step === 4 && selectedTreatment && selectedDate && selectedTime && (
          <div style={{ maxWidth: "34rem", margin: "0 auto", width: "100%" }}>
            <p className="text-center text-sm mb-6" style={{ color: "rgba(44,44,44,0.5)" }}>
              {t("calendar.confirm")}
            </p>

            {/* Summary card */}
            <div
              className="rounded-2xl p-4 mb-5 flex items-center justify-between gap-4"
              style={{
                background: `${selectedTreatment.categoryColor}25`,
                border: `1px solid ${selectedTreatment.categoryColor}60`,
              }}
            >
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: selectedTreatment.categoryColor, boxShadow: `0 0 0 3px ${selectedTreatment.categoryColor}30` }} />
                <div>
                  <div className="font-semibold text-sm" style={{ color: "var(--color-dark)" }}>{selectedTreatment.name}</div>
                  <div className="text-xs mt-0.5" style={{ color: "rgba(44,44,44,0.55)" }}>
                    {formatDate(selectedDate, locale)} · {selectedTime}
                    <span className="ml-2 font-semibold" style={{ color: "var(--color-primary)" }}>{selectedTreatment.price}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setStep(3)}
                className="text-xs bg-transparent border-none cursor-pointer flex-shrink-0"
                style={{ color: "var(--color-primary)", textDecoration: "underline", textUnderlineOffset: "3px" }}
              >
                {locale === "ru" ? "Изменить" : locale === "en" ? "Change" : "Izmijeni"}
              </button>
            </div>

            {/* Form */}
            <div
              className="rounded-2xl p-6 md:p-8"
              style={{ background: "white", boxShadow: "0 8px 40px rgba(212,175,120,0.1)", border: "1px solid rgba(212,175,120,0.12)" }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {[
                  { key: "name", type: "text", label: t("form.name") + " *", value: form.name },
                  { key: "email", type: "email", label: t("form.email") + " *", value: form.email },
                ].map(({ key, type, label, value }) => (
                  <div key={key}>
                    <label className="block text-xs font-semibold uppercase mb-1.5" style={{ color: "rgba(44,44,44,0.5)", letterSpacing: "0.7px" }}>{label}</label>
                    <input
                      type={type}
                      value={value}
                      onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                      required
                      className={inputCls}
                      style={inputStyle}
                      onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(212,175,120,0.1)"; }}
                      onBlur={(e) => { e.target.style.borderColor = "rgba(212,175,120,0.25)"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>
                ))}
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold uppercase mb-1.5" style={{ color: "rgba(44,44,44,0.5)", letterSpacing: "0.7px" }}>{t("form.phone")} *</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                  required
                  className={inputCls}
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(212,175,120,0.1)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(212,175,120,0.25)"; e.target.style.boxShadow = "none"; }}
                />
              </div>
              <div className="mb-7">
                <label className="block text-xs font-semibold uppercase mb-1.5" style={{ color: "rgba(44,44,44,0.5)", letterSpacing: "0.7px" }}>{t("form.message")}</label>
                <textarea
                  rows={3}
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  className={inputCls}
                  style={{ ...inputStyle, resize: "none" }}
                  onFocus={(e) => { e.target.style.borderColor = "var(--color-primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(212,175,120,0.1)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "rgba(212,175,120,0.25)"; e.target.style.boxShadow = "none"; }}
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="cta-button w-full border-none flex items-center justify-center gap-2"
                style={{ cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.75 : 1 }}
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                {submitting ? t("form.submitting") : t("form.submit")}
              </button>
            </div>

            <button onClick={() => setStep(3)} className="flex items-center gap-1.5 mx-auto mt-5 bg-transparent border-none cursor-pointer text-sm" style={{ color: "rgba(44,44,44,0.45)" }}>
              <ChevronLeft size={13} /> {back(locale)}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
