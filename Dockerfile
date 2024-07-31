# Stage 1: Base image
FROM node:20.12.2-alpine3.18 as base
WORKDIR /app
COPY package.json package-lock.json ./

# Stage 2: Install dependencies
FROM base as deps
RUN npm install

# Stage 3: Build the application
FROM base as build
COPY --from=deps /app/node_modules /app/node_modules
COPY . .
RUN npm run build

# Stage 4: Production image
FROM node:20.12.2-alpine3.18
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app /app
COPY --from=deps /app/node_modules /app/node_modules
EXPOSE 3333
CMD ["node", "build/server.js"]
