import NextAuth from "next-auth";
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    // ----------------------------
    // GOOGLE PROVIDER
    // ----------------------------
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // ----------------------------
    // GITHUB PROVIDER
    // ----------------------------
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: { params: { scope: "read:user user:email" } },
    }),

    // ----------------------------
    // CREDENTIALS PROVIDER
    // ----------------------------
    CredentialsProvider({
      name: "Credentials",
      // Add labels/types to avoid type warnings in TS
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials: any) {
        if (!credentials?.email || !credentials?.password) return null;

        // Buscar usuario por email
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          return null;
        }

        // Comparar password
        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) return null;

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
  ],

  // -----------------------------------
  // CALLBACKS PARA JWT Y SESSION
  // -----------------------------------
  callbacks: {
    // Use `any` for the callback params to avoid strict TS issues with extended token/user
    async jwt({ token, user }: any) {
      if (user) {
        // Ensure id is a string (Prisma may return number)
        token.id = user.id ? String(user.id) : undefined;
        token.name = user.name;
        token.email = user.email;
        token.picture = user.image;
      }
      return token;
    },

    async session({ session, token }: any) {
      if (token) {
        // Ensure `session.user` exists before assigning extended props
        session.user = session.user || {};
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }
      return session;
    },
  },

  // Página de Login personalizada
  pages: {
    signIn: "/signin",
  },

  // Debug opcional
  debug: process.env.NODE_ENV === "development",

  // Estrategia JWT
  session: {
    strategy: "jwt",
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
