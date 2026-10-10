# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/

# Install dependencies
RUN npm install
WORKDIR /app/server
RUN npm install
WORKDIR /app

# Copy source code
COPY . .

# Generate Prisma client for backend (needed if types are shared, or just to be safe)
WORKDIR /app/server
RUN npx prisma generate

# Build the Vite frontend
WORKDIR /app
RUN npm run build

# Production stage (Nginx)
FROM nginx:alpine

# Copy built static files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
