FROM node:22-bookworm-slim AS builder

WORKDIR /app
RUN npm install --global pnpm@10.33.4
COPY . .
RUN pnpm install --frozen-lockfile
