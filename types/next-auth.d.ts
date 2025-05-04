// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    avatar?: { url: string; public_id: string } | null;
    designation?: string | null; // Добавляем designation
  }

  interface Session {
    user: {
      _id: string;
      name?: string | null;
      email?: string | null;
      avatar?: { url: string; public_id: string } | null;
      designation?: string | null; // Добавляем designation
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
    designation?: string | null; // Добавляем designation
    accessToken?: string;
  }
}