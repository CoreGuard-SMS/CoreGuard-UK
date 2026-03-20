import { betterAuth } from "better-auth";

export const auth = betterAuth({
  database: process.env.DATABASE_URL ? {
    provider: "postgres",
    url: process.env.DATABASE_URL,
  } : undefined,
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
});

export type Session = typeof auth.$Infer.Session;
