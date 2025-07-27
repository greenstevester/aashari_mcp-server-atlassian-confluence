# Multi-stage Dockerfile for MCP Atlassian Confluence Server
# Optimized for security, performance, and minimal image size

# Stage 1: Build environment
FROM node:lts-alpine AS builder

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create app directory with specific user
WORKDIR /usr/src/app

# Copy package files first for better layer caching
COPY package*.json ./
COPY tsconfig.json ./

# Copy source code before installing dependencies to avoid prepare script issues
COPY src/ ./src/

# Install all dependencies (including devDependencies for build)
# The prepare script will automatically build the TypeScript application
RUN npm ci --include=dev && npm cache clean --force

# Remove devDependencies to reduce size for next stage
RUN npm prune --omit=dev

# Stage 2: Production runtime
FROM node:lts-alpine AS runtime

# Install dumb-init for proper signal handling in production
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S mcp -u 1001

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Copy production dependencies from builder stage
COPY --from=builder /usr/src/app/node_modules ./node_modules

# Copy built application
COPY --from=builder /usr/src/app/dist ./dist

# Ensure the entrypoint is executable
RUN chmod +x dist/index.js

# Change ownership to non-root user
RUN chown -R mcp:nodejs /usr/src/app

# Switch to non-root user
USER mcp

# Health check (optional - only if HTTP endpoint exists)
# HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
#   CMD node -e "process.exit(0)" || exit 1

# Use dumb-init to handle signals properly and run the MCP server
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/index.js"]
