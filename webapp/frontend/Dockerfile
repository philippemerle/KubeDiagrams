# =============================================================================
# KubeDiagrams - Frontend - Dockerfile
# =============================================================================
# Multi-stage build:
# 1. Build React app with Node.js
# 2. Serve static files with Apache2
# Build context is the repo root (see docker-compose.yml: context: ..), so
# the canonical interactive_viewer/ (shared with the CLI) can be copied in.
# =============================================================================

# --- First: Build the React application ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY webapp/frontend/package*.json ./

# Install dependencies
RUN npm install

# Copy frontend source
COPY webapp/frontend/ ./

# Copy the canonical interactive viewer (single source of truth, shared with the CLI)
COPY interactive_viewer/ ./public/interactive_viewer/

# Build for production
RUN npm run build

# --- Second : Serve with Apache ---
FROM httpd:2.4-alpine

# Install envsubst for environment variable substitution and curl for healthcheck
RUN apk add --no-cache gettext curl

# Copy built files from builder stage
COPY --from=builder /app/dist/ /usr/local/apache2/htdocs/

# Copy Apache configuration
COPY webapp/frontend/apache.conf /usr/local/apache2/conf/extra/httpd-vhost.conf

# Enable required Apache modules and include vhost config
RUN sed -i \
    -e 's/^#\(LoadModule proxy_module\)/\1/' \
    -e 's/^#\(LoadModule proxy_http_module\)/\1/' \
    -e 's/^#\(LoadModule rewrite_module\)/\1/' \
    -e 's/^#\(LoadModule headers_module\)/\1/' \
    -e 's/^#\(LoadModule remoteip_module\)/\1/' \
    /usr/local/apache2/conf/httpd.conf && \
    echo "Include conf/extra/httpd-vhost.conf" >> /usr/local/apache2/conf/httpd.conf

# Environment variable for backend URL
ENV BACKEND_URL=http://backend:5000

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD curl --fail --silent http://localhost/ || exit 1

# Start Apache
CMD ["httpd-foreground"]
