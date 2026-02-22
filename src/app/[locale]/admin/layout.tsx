"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { SessionProvider } from "next-auth/react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  CalendarDays,
  DollarSign,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const ADMIN_BG = "#111118";
const SIDEBAR_BG = "#1A1A26";
const SIDEBAR_BORDER = "rgba(255,255,255,0.06)";
const GOLD = "#D4AF78";

function AdminContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const t = useTranslations("admin");
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (status === "loading") {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: ADMIN_BG }}
      >
        <div className="font-heading text-lg" style={{ color: GOLD }}>
          Učitavanje...
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{ background: "linear-gradient(135deg, #1A1A26, #111118)" }}
      >
        <div
          className="rounded-2xl p-8 text-center max-w-sm w-full"
          style={{
            background: "#1C1C28",
            border: "1px solid rgba(212,175,120,0.2)",
            boxShadow: "0 25px 60px rgba(0,0,0,0.5)",
          }}
        >
          <div
            className="font-heading text-2xl mb-1"
            style={{ color: GOLD, letterSpacing: "3px" }}
          >
            SKINLAB 011
          </div>
          <p className="text-xs mb-6" style={{ color: "rgba(255,255,255,0.3)", letterSpacing: "2px" }}>
            ADMIN PANEL
          </p>
          <div
            style={{
              height: "1px",
              background: "linear-gradient(to right, transparent, rgba(212,175,120,0.4), transparent)",
              marginBottom: "2rem",
            }}
          />
          <h1 className="font-heading text-xl mb-2" style={{ color: "rgba(255,255,255,0.85)" }}>
            {t("loginTitle")}
          </h1>
          <p className="text-sm mb-8" style={{ color: "rgba(255,255,255,0.4)" }}>
            {t("loginSubtitle")}
          </p>
          <button
            onClick={() => signIn("google")}
            className="w-full py-3 px-6 rounded-xl font-semibold flex items-center justify-center gap-3 transition-all hover:opacity-90 border-none cursor-pointer"
            style={{ background: "linear-gradient(135deg, #D4AF78, #C9A666)", color: "#111118" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
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

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-6 flex items-center justify-between" style={{ borderBottom: `1px solid ${SIDEBAR_BORDER}` }}>
        <div>
          <div className="font-heading text-xl" style={{ color: GOLD, letterSpacing: "3px" }}>
            SKINLAB 011
          </div>
          <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.25)", letterSpacing: "2px" }}>
            ADMIN PANEL
          </p>
        </div>
        {/* Close button - mobile only */}
        <button
          className="md:hidden flex items-center justify-center w-8 h-8 rounded-lg border-none cursor-pointer"
          style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.5)" }}
          onClick={() => setSidebarOpen(false)}
        >
          <X size={16} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 flex flex-col gap-1 mt-2">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium no-underline transition-all"
              style={
                isActive
                  ? {
                      background: "linear-gradient(135deg, rgba(212,175,120,0.2), rgba(212,175,120,0.1))",
                      color: GOLD,
                      border: "1px solid rgba(212,175,120,0.25)",
                    }
                  : {
                      color: "rgba(255,255,255,0.5)",
                      border: "1px solid transparent",
                    }
              }
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.85)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = "transparent";
                  (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.5)";
                }
              }}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4" style={{ borderTop: `1px solid ${SIDEBAR_BORDER}` }}>
        <p className="text-xs mb-3 px-2 truncate" style={{ color: "rgba(255,255,255,0.3)" }}>
          {session.user?.email}
        </p>
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all bg-transparent border-none cursor-pointer"
          style={{ color: "rgba(255,255,255,0.4)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.05)";
            (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.7)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.4)";
          }}
        >
          <LogOut size={17} />
          {t("logout")}
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen flex" style={{ background: ADMIN_BG }}>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 md:hidden"
          style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(2px)" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - desktop: static, mobile: fixed drawer */}
      <aside
        className="fixed md:static inset-y-0 left-0 z-40 w-64 flex flex-col min-h-screen overflow-y-auto"
        style={{
          background: SIDEBAR_BG,
          borderRight: `1px solid ${SIDEBAR_BORDER}`,
          boxShadow: sidebarOpen ? "8px 0 32px rgba(0,0,0,0.5)" : "4px 0 24px rgba(0,0,0,0.3)",
          transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <SidebarContent />
      </aside>

      {/* Desktop sidebar spacer */}
      <div className="hidden md:block w-64 flex-shrink-0" />

      {/* Main */}
      <main className="flex-1 overflow-auto min-w-0">

        {/* Mobile top bar */}
        <div
          className="md:hidden sticky top-0 z-20 flex items-center gap-3 px-4 py-3"
          style={{
            background: SIDEBAR_BG,
            borderBottom: `1px solid ${SIDEBAR_BORDER}`,
            boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center justify-center w-9 h-9 rounded-xl border-none cursor-pointer"
            style={{ background: "rgba(255,255,255,0.07)", color: "rgba(255,255,255,0.7)" }}
          >
            <Menu size={18} />
          </button>
          <span className="font-heading text-base" style={{ color: GOLD, letterSpacing: "2px" }}>
            SKINLAB 011
          </span>
        </div>

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
