import { betterAuth } from "better-auth";
import { drizzleAdapter } from "@better-auth/drizzle-adapter";
import { expo } from "@better-auth/expo";
import { db } from "@/db";
import * as schema from "@/db/schema";

export const auth = betterAuth({
  plugins: [expo()],
  trustedOrigins: [
    "wildlog://",
    // Development mode - Expo's exp:// scheme with local IP ranges
    ...(process.env.NODE_ENV === "development"
      ? [
          "exp://", // Trust any host of the exp:// scheme
          "exp://**", // Trust all Expo URLs (wildcard matching)
          "exp://192.168.*.*:*/**", // Trust 192.168.x.x IP range with any port and path
        ]
      : []),
  ],
  emailAndPassword: {
    enabled: true, // Enable authentication using email and password.
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
});
