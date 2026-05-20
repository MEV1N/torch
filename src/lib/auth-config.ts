/**
 * NextAuth.js Configuration
 * Authentication for Torch using Neon + NextAuth
 */

import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { query } from "@/lib/db";
import bcrypt from "bcrypt";
import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

interface CustomToken extends JWT {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

interface CustomSession extends Session {
  user: {
    id: string;
    email: string;
    name?: string;
    image?: string;
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    // Credentials Provider (Email/Password)
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        try {
          // Get user from database
          const users = await query<any>(
            "SELECT * FROM users WHERE email = $1",
            [credentials.email]
          );

          if (users.length === 0) {
            throw new Error("User not found");
          }

          const user = users[0];

          // Password would be stored in a separate table in production
          // For now, using a simple approach
          const passwordMatch = await bcrypt.compare(
            credentials.password,
            user.password_hash || ""
          );

          if (!passwordMatch) {
            throw new Error("Invalid password");
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image_url,
          };
        } catch (error) {
          console.error("Auth error:", error);
          throw new Error("Authentication failed");
        }
      },
    }),
  ],

  callbacks: {
    /**
     * JWT callback - runs when JWT is created/updated
     */
    async jwt({ token, user, account }: { token: JWT; user?: any; account?: any }) {
      if (user) {
        const customToken = token as CustomToken;
        customToken.id = user.id;
        customToken.email = user.email;
        customToken.name = user.name;
        customToken.image = user.image;
      }

      // Handle OAuth sign-in
      if (account?.provider === "google") {
        try {
          // Check if user exists
          const users = await query<any>(
            "SELECT id FROM users WHERE email = $1",
            [token.email]
          );

          if (users.length === 0) {
            // Create new user
            const result = await query<any>(
              "INSERT INTO users (email, name, image_url) VALUES ($1, $2, $3) RETURNING id",
              [token.email, token.name, token.picture]
            );

            const customToken = token as CustomToken;
            customToken.id = result[0].id;
          } else {
            const customToken = token as CustomToken;
            customToken.id = users[0].id;
          }
        } catch (error) {
          console.error("OAuth user creation error:", error);
        }
      }

      return token;
    },

    /**
     * Session callback - runs when session is accessed
     */
    async session({ session, token }: { session: Session; token: JWT }) {
      const customToken = token as CustomToken;
      if (session.user) {
        session.user.id = customToken.id;
        session.user.email = customToken.email;
      }
      return session as CustomSession;
    },
  },

  pages: {
    signIn: "/auth",
    error: "/auth",
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },

  secret: process.env.NEXTAUTH_SECRET,
};
