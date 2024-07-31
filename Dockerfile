# Stage 1: Base image
FROM node:20.12.2-alpine3.18 as base
WORKDIR /app
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./

# Stage 2: Install dependencies
FROM base as deps
RUN npm install

# Stage 3: Install production dependencies
FROM base as production-deps
RUN npm ci --omit=dev

# Stage 4: Build the application
FROM base as build
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
RUN npm run build

# Stage 5: Production image
FROM node:20.12.2-alpine3.18
WORKDIR /app
ENV NODE_ENV=production
COPY --from=production-deps /app/node_modules /app/node_modules
COPY --from=build /app /app
EXPOSE 3333
CMD ["node", "build/server.js"]
