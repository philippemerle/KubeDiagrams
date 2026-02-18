"""Flask Application for KubeDiagrams Web App."""
from flask import Flask, g, request, jsonify
from flask_cors import CORS
from werkzeug.middleware.proxy_fix import ProxyFix
from config import Config, setup_logging
from routes.manifest import manifest_bp
from routes.helm import helm_bp
from routes.helmfile import helmfile_bp
from routes.submit import submit_bp
from utils.access_logger import log_request, get_real_ip, get_all_ip_headers
from time import time


def create_app():
    app = Flask(__name__)

    # Health check endpoint
    @app.route('/api/health', methods=['GET'])
    def health_check():
        """Health check endpoint for monitoring and testing."""
        return jsonify({
            'status': 'healthy',
            'service': 'kubediagrams-backend',
            'version': '1.0.0'
        }), 200

    # Debug endpoint for IP testing
    @app.route('/api/debug/ip', methods=['GET'])
    def debug_ip():
        """
        Debug endpoint to check IP detection.
        Returns all IP-related information for debugging proxy configuration.
        """
        return jsonify({
            'detected_ip': get_real_ip(),
            'remote_addr': request.remote_addr,
            'headers': get_all_ip_headers(),
            'behind_proxy': Config.BEHIND_PROXY,
            'proxy_x_for': Config.PROXY_X_FOR
        }), 200

    # Proxy Configuration
    # When running behind a reverse proxy (nginx, Apache, HAProxy), the proxy
    # forwards requests to the application. By default, Flask sees the proxy's IP
    # instead of the real client IP. ProxyFix corrects this by reading the
    # X-Forwarded-* headers that the proxy sets.
    if Config.BEHIND_PROXY:
        app.wsgi_app = ProxyFix(
            app.wsgi_app,
            x_for=Config.PROXY_X_FOR,      # Number of proxies setting X-Forwarded-For
            x_proto=Config.PROXY_X_PROTO,  # Number of proxies setting X-Forwarded-Proto
            x_host=Config.PROXY_X_HOST,    # Number of proxies setting X-Forwarded-Host
            x_prefix=Config.PROXY_X_PREFIX # Number of proxies setting X-Forwarded-Prefix
        )

    # CORS Configuration
    if Config.CORS_ENABLED:
        CORS(app)

    # Logging Configuration
    setup_logging()

    # Middleware pour logger les requêtes
    @app.before_request
    def before_request():
        """Save request start time for performance logging."""
        g.request_start_time = time()

    @app.after_request
    def after_request(response):
        """Log request in Apache Combined Log Format."""
        # Skip logging for health checks to avoid log spam
        if request.path == '/api/health':
            return response

        # Get response size
        response_size = response.calculate_content_length() or 0

        # Log the request
        log_request(
            status_code=response.status_code,
            response_size=response_size
        )

        return response

    # Blueprints registration
    app.register_blueprint(manifest_bp)
    app.register_blueprint(helm_bp)
    app.register_blueprint(helmfile_bp)
    app.register_blueprint(submit_bp)

    return app


app = create_app()  # App Initialization

if __name__ == "__main__":
    print("=" * 50)
    print("Flask Application Configuration")
    print("=" * 50)
    print(f"BEHIND_PROXY: {Config.BEHIND_PROXY}")
    print(f"PROXY_X_FOR: {Config.PROXY_X_FOR}")
    print(f"PROXY_X_PROTO: {Config.PROXY_X_PROTO}")
    print(f"PROXY_X_HOST: {Config.PROXY_X_HOST}")
    print(f"PROXY_X_PREFIX: {Config.PROXY_X_PREFIX}")
    print(f"DEBUG: {Config.DEBUG}")
    print(f"PORT: {Config.PORT}")
    print(f"HOST: {Config.HOST}")
    print("=" * 50)
    print("")
    app.run(port=Config.PORT, debug=Config.DEBUG)
