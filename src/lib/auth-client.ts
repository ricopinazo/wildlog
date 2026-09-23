import { createAuthClient } from "better-auth/react";
import { expoClient } from "@better-auth/expo/client";
import * as SecureStore from "expo-secure-store";

export const authClient = createAuthClient({
  // baseURL: "http://localhost:8081", // this is recommended to be set, but in theory it should work with this out
  plugins: [
    expoClient({
      scheme: "wildlog",
      storagePrefix: "wildlog",
      storage: SecureStore,
    }),
  ],
});
