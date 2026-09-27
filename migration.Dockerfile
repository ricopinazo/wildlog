FROM node:22-bookworm-slim AS builder

WORKDIR /app
RUN npm install --global pnpm@10.33.4
COPY migration/ ./
RUN pnpm install --frozen-lockfile
RUN pnpm build

FROM node:22.22.3-alpine3.24
WORKDIR /app
COPY --from=builder /app/dist/migrate.js /app/migrate.js
COPY drizzle/ ./drizzle/
CMD ["node", "migrate.js"]
