import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: { hd: process.env.WORKSPACE_DOMAIN },
      },
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      if (
        profile?.email &&
        process.env.WORKSPACE_DOMAIN &&
        profile.email.endsWith(`@${process.env.WORKSPACE_DOMAIN}`)
      ) {
        return true;
      }
      return false;
    },
  },
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
