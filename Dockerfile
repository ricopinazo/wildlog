FROM node:22-bookworm-slim AS builder

WORKDIR /app
RUN npm install --global pnpm@10.33.4
# refer to: https://docs.expo.dev/router/web/api-routes/#express
COPY . .
RUN pnpm add --save-dev --allow-build=esbuild express compression morgan
RUN pnpm expo install expo-server # suggested by codex
RUN pnpm expo export -p web

CMD ["node", "server.ts"]


FROM node:22-bookworm-slim
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nodejs
RUN npm install express compression morgan @expo/server
COPY --from=builder --chown=nodejs:nodejs /app/dist /app/dist
COPY --from=builder --chown=nodejs:nodejs /app/server.ts /app/server.ts
USER nodejs
EXPOSE 80
CMD ["node", "/app/server.ts"]
