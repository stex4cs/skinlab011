export interface TreatmentCategory {
  id: string;
  slug: string;
  name_me: string;
  name_en: string;
  name_ru: string;
  icon: string;
  color: string;
  sort_order: number;
  created_at: string;
}

export interface Treatment {
  id: string;
  category_id: string;
  name_me: string;
  name_en: string;
  name_ru: string;
  price: string;
  price_value: number | null;
  duration_minutes: number | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  booking_id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  treatment_id: string | null;
  treatment_name: string;
  category_id: string | null;
  booking_date: string;
  booking_time: string;
  end_time: string | null;
  message: string | null;
  status: "pending" | "confirmed" | "rejected" | "cancelled";
  locale: string;
  created_at: string;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: string;
  created_at: string;
}

export interface BusinessSetting {
  key: string;
  value: Record<string, unknown>;
}

export interface CategoryWithTreatments extends TreatmentCategory {
  treatments: Treatment[];
}

export type Locale = "me" | "en" | "ru";

export function getLocalizedName(
  item: { name_me: string; name_en: string; name_ru: string },
  locale: Locale
): string {
  return item[`name_${locale}`];
}
