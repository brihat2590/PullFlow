import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken?: string; // add your custom property
  }

  interface User {
    // optional: add extra properties if needed
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken?: string;
  }
}
