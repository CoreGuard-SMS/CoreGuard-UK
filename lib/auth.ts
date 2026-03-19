import { betterAuth } from "better-auth";
import { dash } from "@better-auth/infra";

export const auth = betterAuth({
  database: {
    provider: "postgres",
    url: process.env.NEXT_PUBLIC_SUPABASE_URL + "/pgrest",
  },
  emailAndPassword: {
    enabled: true,
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
  },
  account: {
    accountLinking: {
      enabled: true,
    },
  },
  plugins: [
    dash()
  ],
});

export type Session = typeof auth.$Infer.Session;
