import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { cache } from "react";
import { prisma } from "@/lib/db";

const { handlers, auth: baseAuth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  session: { strategy: "jwt" },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token.id) session.user.id = token.id as string;
      return session;
    },
  },
  events: {
    async signIn({ user }) {
      if (!user.id) return;
      await prisma.recipe.updateMany({
        where: { userId: null },
        data: { userId: user.id },
      });
    },
  },
});

export const auth = cache(baseAuth);
export { handlers, signIn, signOut };
