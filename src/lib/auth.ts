import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { createAdminClient } from "./supabase/admin";

export const authOptions: NextAuthOptions = {
  debug: true,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      console.log("[AUTH] signIn callback triggered");
      console.log("[AUTH] user.email:", user.email);
      console.log("[AUTH] account.provider:", account?.provider);

      if (!user.email) {
        console.log("[AUTH] DENIED - no email");
        return false;
      }

      try {
        const supabase = createAdminClient();
        console.log("[AUTH] Querying admin_users for:", user.email);

        const { data, error } = await supabase
          .from("admin_users")
          .select("email")
          .eq("email", user.email)
          .single();

        console.log("[AUTH] Supabase data:", data);
        console.log("[AUTH] Supabase error:", error);

        const allowed = !!data;
        console.log("[AUTH] Access allowed:", allowed);
        return allowed;
      } catch (err) {
        console.error("[AUTH] Exception in signIn callback:", err);
        return false;
      }
    },
    async session({ session }) {
      return session;
    },
  },
  pages: {
    signIn: "/me/admin",
    error: "/me/admin",
  },
  events: {
    async signIn(message) {
      console.log("[AUTH EVENT] signIn:", JSON.stringify(message));
    },
    async signOut(message) {
      console.log("[AUTH EVENT] signOut:", JSON.stringify(message));
    },
  },
};
