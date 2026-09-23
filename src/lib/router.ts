import { os } from "@orpc/server";

export const whoAmI = os.handler(async () => {
  return "Paul";
});

export const router = {
  whoAmI,
};
