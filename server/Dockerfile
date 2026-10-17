FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN apk add --no-cache python3 make g++
RUN npm ci --include=dev
RUN npm_config_build_from_source=true npm_config_napi_build_version=8 npm rebuild argon2 --foreground-scripts

# Copy source code
COPY . .

# Generate Prisma client and build TypeScript
RUN npx prisma generate
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Copy built artifacts and necessary files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/start.cjs ./
COPY --from=builder /app/prisma ./prisma

# Expose port
EXPOSE 5000

# Start command is managed by docker-compose (migrate + seed + start)
CMD ["npm", "start"]
