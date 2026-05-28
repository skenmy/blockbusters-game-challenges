FROM node:22-slim AS build

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY tsconfig*.json vite.config.ts ./
COPY index.html ./
COPY public ./public
COPY src ./src
COPY server ./server

# Vite client build → ./dist
RUN npm run build

# Runtime image: keep tsx + production deps for the Express server.
FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci --omit=dev && npm install tsx@4 && npm cache clean --force

COPY --from=build /app/dist ./dist
COPY tsconfig*.json ./
COPY server ./server
COPY src/types ./src/types

ENV NODE_ENV=production
ENV PORT=5001

EXPOSE 5001

CMD ["node", "--no-warnings=ExperimentalWarning", "--import", "tsx", "server/index.ts"]
