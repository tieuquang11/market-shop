# Base stage
FROM node:20.12.2-alpine3.18 as base

# All deps stage
FROM base as deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install

# Build stage
FROM base as build
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
RUN npm run build

# Production stage
FROM base
ENV NODE_ENV=production
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=build /app/build /app
COPY package.json ./
EXPOSE 3333
CMD ["node", "bin/server.js"]