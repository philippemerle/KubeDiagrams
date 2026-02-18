# =============================================================================
# KubeDiagrams - Frontend - Dockerfile
# =============================================================================
# Multi-stage build:
# 1. Build React app with Node.js
# 2. Serve static files with Apache2
# =============================================================================

# --- First: Build the React application ---
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code, we copy all the frontend dire
COPY . .

# Build for production
RUN npm run build

# --- Second : Serve with Apache ---
FROM httpd:2.4-alpine

# Install envsubst for environment variable substitution and curl for healthcheck
RUN apk add --no-cache gettext curl

# Copy built files from builder stage
COPY --from=builder /app/dist/ /usr/local/apache2/htdocs/

# Copy Apache configuration
COPY apache.conf /usr/local/apache2/conf/extra/httpd-vhost.conf

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
