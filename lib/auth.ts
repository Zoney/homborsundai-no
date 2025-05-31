import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
  secret: process.env.NEXTAUTH_SECRET,
};
