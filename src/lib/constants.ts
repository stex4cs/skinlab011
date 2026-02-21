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

export const TIME_SLOTS = [
  "09:00", "10:00", "11:00", "12:00", "13:00",
  "14:00", "15:00", "16:00", "17:00", "18:00", "19:00",
];

export const WHATSAPP_URL = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "381611576793"}`;
