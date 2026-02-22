export const CATEGORY_COLORS: Record<string, string> = {
  facial: "#E8D5B7",
  body: "#D4E8D5",
  "body-packages": "#C5D8E8",
  massage: "#E8D5E8",
  "wax-cold": "#F5E6D3",
  "wax-cold-packages": "#E8E0C5",
  "wax-sugar": "#F0E0D0",
  "wax-sugar-packages": "#D5D0C5",
};

export const STATUS_COLORS: Record<string, string> = {
  pending: "#FFA726",
  confirmed: "#66BB6A",
  rejected: "#EF5350",
  cancelled: "#BDBDBD",
};

export const BUSINESS_HOURS = {
  mon: { open: "09:00", close: "20:00" },
  tue: { open: "09:00", close: "20:00" },
  wed: { open: "09:00", close: "20:00" },
  thu: { open: "09:00", close: "20:00" },
  fri: { open: "09:00", close: "20:00" },
  sat: { open: "09:00", close: "15:00" },
  sun: null,
};

// Slot grid interval in minutes (15 = fine-grained, works for all treatment durations)
export const SLOT_INTERVAL_MINUTES = 15;

// Generate all possible start slots within [openMinutes, closeMinutes)
// where the treatment fits (slotStart + duration <= closeMinutes)
export function generateTimeSlots(
  openMinutes: number,
  closeMinutes: number,
  durationMinutes: number
): string[] {
  const slots: string[] = [];
  for (let m = openMinutes; m + durationMinutes <= closeMinutes; m += SLOT_INTERVAL_MINUTES) {
    const h = Math.floor(m / 60);
    const min = m % 60;
    slots.push(`${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`);
  }
  return slots;
}

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export const WHATSAPP_URL = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "381611576793"}`;
