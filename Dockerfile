# Stage 1: Base image
FROM node:20.12.2-alpine3.18 as base

# Stage 2: Dependencies
FROM base as deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Stage 3: Build
FROM deps as build
WORKDIR /app
COPY . .
RUN node ace build --production

# Stage 4: Production
FROM base
ENV NODE_ENV=production
ENV PORT=3333
ENV HOST=0.0.0.0
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app
COPY .env /app/.env
EXPOSE 3333
CMD ["node", "server.js"]
