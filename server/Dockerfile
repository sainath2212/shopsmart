# ============================================================
# Stage 1: Builder — install ALL dependencies
# ============================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package manifests first (Docker layer caching)
COPY package*.json ./

# Install all dependencies (including devDependencies for any build steps)
RUN npm ci

# Copy source code
COPY . .

# ============================================================
# Stage 2: Production — lean runtime image
# ============================================================
FROM node:20-alpine AS production

# Install curl for healthcheck
RUN apk add --no-cache curl

# Create non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser -u 1001 -S appuser -G appgroup

WORKDIR /app

# Copy package manifests
COPY package*.json ./

# Install production-only dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Copy application source from builder
COPY --from=builder /app/src ./src
COPY --from=builder /app/openapi.json ./openapi.json

# Change ownership to non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose application port
EXPOSE 5001

# Healthcheck: verify the service is responding
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD curl -f http://localhost:5001/api/health || exit 1

# Start the application
CMD ["node", "src/index.js"]
