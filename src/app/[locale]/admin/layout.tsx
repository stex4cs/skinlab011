"use client";

import { useSession, signIn } from "next-auth/react";
import { SessionProvider } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  DollarSign,
  LogOut,
} from "lucide-react";

function AdminContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const t = useTranslations("admin");
  const pathname = usePathname();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light">
        <div className="text-primary text-lg font-heading">Učitavanje...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "linear-gradient(135deg, #F5E6D3, #FAF8F5)" }}
      >
        <div className="bg-white rounded-2xl p-10 shadow-xl text-center max-w-sm w-full mx-4">
          <h1 className="font-heading text-3xl text-dark mb-2">{t("loginTitle")}</h1>
          <p className="text-dark/60 mb-8 text-sm">{t("loginSubtitle")}</p>
          <button
            onClick={() => signIn("google")}
            className="w-full py-3 px-6 rounded-xl text-white font-semibold flex items-center justify-center gap-3 transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #D4AF78, #C9A666)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {t("login")}
          </button>
        </div>
      </div>
    );
  }

  const locale = pathname.split("/")[1];
  const navItems = [
    { href: `/${locale}/admin`, icon: LayoutDashboard, label: t("dashboard") },
    { href: `/${locale}/admin/bookings`, icon: CalendarDays, label: t("bookings") },
    { href: `/${locale}/admin/prices`, icon: DollarSign, label: t("prices") },
  ];

  return (
    <div className="min-h-screen flex bg-light">
      {/* Sidebar */}
      <aside className="w-64 bg-dark text-white flex flex-col shadow-xl min-h-screen">
        <div className="p-6 border-b border-white/10">
          <h1 className="font-heading text-2xl text-primary">SKINLAB 011</h1>
          <p className="text-white/40 text-xs mt-1">Admin Panel</p>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1">
          {navItems.map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium no-underline transition-all ${
                  isActive
                    ? "bg-primary text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <p className="text-white/40 text-xs mb-3 px-2">
            {session.user?.email}
          </p>
          <button
            onClick={() => signIn()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/70 hover:bg-white/10 hover:text-white transition-all bg-transparent border-none cursor-pointer"
          >
            <LogOut size={18} />
            {t("logout")}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SessionProvider>
      <AdminContent>{children}</AdminContent>
    </SessionProvider>
  );
}
