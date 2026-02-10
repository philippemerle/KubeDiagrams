# =============================================================================
# KubeDiagrams Backend - Dockerfile
# =============================================================================
# Base image from KubeDiagrams project (Philippe Merle)
# Includes: Helm, Graphviz, Python, PyYAML, diagrams
# =============================================================================

# --- Stage 1: Get Helm binary ---
FROM docker.io/alpine/helm:3 AS helm

# --- Stage 2: Build backend ---
FROM docker.io/python:3.13-alpine AS base

# Install system dependencies
RUN apk update && apk add --no-cache \
    graphviz \
    bash \
    ttf-freefont \
    curl \
    && rm -rf /var/cache/apk/*

# Copy Helm from first stage
COPY --from=helm /usr/bin/helm /usr/local/bin/helm

# Install Helmfile from GitHub releases (Alpine/musl version)
ARG HELMFILE_VERSION=1.2.3
RUN curl -fsSL -o /tmp/helmfile.tar.gz \
    "https://github.com/helmfile/helmfile/releases/download/v${HELMFILE_VERSION}/helmfile_${HELMFILE_VERSION}_linux_386.tar.gz" && \
    tar -xzf /tmp/helmfile.tar.gz -C /usr/local/bin helmfile && \
    chmod +x /usr/local/bin/helmfile && \
    rm /tmp/helmfile.tar.gz

# Set working directory
WORKDIR /app

# Copy requirements first (for Docker layer caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy backend application code
COPY . .

# Create logs directory
RUN mkdir -p logs && chmod 755 logs

# Environment variables
ENV FLASK_APP=app.py
ENV FLASK_ENV=production
ENV PYTHONUNBUFFERED=1
ENV BEHIND_PROXY=true
ENV PROXY_X_FOR=1

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl --fail --silent http://localhost:5000/api/health || exit 1

CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "4", "--timeout", "120", "--access-logfile", "-", "--error-logfile", "-", "app:app"]
