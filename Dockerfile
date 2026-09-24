FROM node:22-bookworm-slim

RUN npm install --global pnpm@10.33.4
# refer to: https://docs.expo.dev/router/web/api-routes/#express
COPY . .
RUN pnpm add --save-dev --allow-build=esbuild express compression morgan
RUN pnpm expo install expo-server # suggested by codex
RUN pnpm expo export -p web

CMD ["node", "server.ts"]
