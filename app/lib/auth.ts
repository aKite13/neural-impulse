// app/lib/auth.ts
import CredentialsProvider from "next-auth/providers/credentials";
import { connect } from "../lib/db";
import UserModel from "../models/User";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";
import { Session, User } from "next-auth";

// Расширяем типы NextAuth
declare module "next-auth" {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    avatar?: { url: string; public_id: string } | null;
    designation?: string | null;
  }

  interface Session {
    user: {
      _id: string;
      name?: string | null;
      email?: string | null;
      avatar?: { url: string; public_id: string } | null;
      designation?: string | null;
      accessToken?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    avatar?: { url: string; public_id: string } | null;
    designation?: string | null;
    accessToken?: string;
  }
}

// Конфигурация NextAuth
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }

        try {
          await connect();
          const { email, password } = credentials;

          const user = await UserModel.findOne({ email });
          if (!user) {
            throw new Error("No user found with this email");
          }

          const passwordMatch = await bcrypt.compare(password, user.password);
          if (!passwordMatch) {
            throw new Error("Incorrect password");
          }

          return {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            designation: user.designation,
          };
        } catch (error) {
          console.error("Authorization error:", (error as Error).message);
          throw new Error("Authentication failed");
        }
      },
    }),
  ],
  session: {
    strategy: "jwt" as const,
    maxAge: 12 * 60 * 60, // 12 часов
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.avatar = user.avatar;
        token.designation = user.designation;
        token.accessToken = user.id;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      await connect();
      const user = await UserModel.findById(token.id);
      if (!user) {
        throw new Error("User not found in database. Please log in again.");
      }
      session.user = {
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        designation: user.designation,
        accessToken: token.accessToken,
      };
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};