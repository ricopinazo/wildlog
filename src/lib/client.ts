import type { RouterClient } from "@orpc/server";
import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import { router } from "./router";

const link = new RPCLink({
  origin: process.env.EXPO_PUBLIC_SERVER_URL,
  url: "/rpc",
  headers: async ({ context }) => ({
    "x-api-key": context?.something ?? "",
  }),
});

const client: RouterClient<typeof router> = createORPCClient(link);
export const orpc = createTanstackQueryUtils(client);
