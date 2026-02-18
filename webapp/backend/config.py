"""Configuration Flask application."""
import os
import logging
from logging.handlers import TimedRotatingFileHandler
from datetime import datetime, time as dt_time

class Config:
    """Config App and Logger."""
    
    # Flask
    DEBUG = True
    PORT = 5000
    HOST = 'localhost'
    
    # CORS
    CORS_ENABLED = True
    
    # Proxy Configuration
    # Set to True when running behind a reverse proxy (nginx, Apache, etc.)
    # This enables proper forwarding of client IP addresses
    BEHIND_PROXY = os.environ.get('BEHIND_PROXY', 'false').lower() == 'true'
    # Number of trusted proxies in front of the application
    # X-Forwarded-For: client, proxy1, proxy2 -> set to 2 if you have 2 proxies
    PROXY_X_FOR = int(os.environ.get('PROXY_X_FOR', '1'))
    PROXY_X_PROTO = int(os.environ.get('PROXY_X_PROTO', '1'))
    PROXY_X_HOST = int(os.environ.get('PROXY_X_HOST', '1'))
    PROXY_X_PREFIX = int(os.environ.get('PROXY_X_PREFIX', '1'))

    LOG_DIR = "logs"
    LOG_FILE = "access.log"
    LOG_FORMAT = '%(message)s'
    LOG_LEVEL = logging.INFO
    LOG_ROTATION = "midnight"
    LOG_INTERVAL = 1
    LOG_BACKUP_COUNT = 30
    LOG_ENCODING = 'utf-8'
    LOG_SUFFIX = "%Y-%m-%d"
    LOGGER_NAME = "access_logger"
    # Disable automatic rotation based on file modification time
    # This prevents creating files with old dates
    LOG_USE_UTC = False
    # Fichiers
    FEEDBACK_FILE = "feedback.txt"
    
    @classmethod
    def get_log_path(cls):
        """Return path of the logFile."""
        return os.path.join(cls.LOG_DIR, cls.LOG_FILE)


def setup_logging():
    """Config log system with proper rotation handling."""
    # Create a logs directory if it doesn't exist
    os.makedirs(Config.LOG_DIR, exist_ok=True)
    
    # Create a formatter
    log_formatter = logging.Formatter(Config.LOG_FORMAT)
    
    log_path = Config.get_log_path()

    # Create a handler with rotation
    log_handler = TimedRotatingFileHandler(
        log_path,
        when=Config.LOG_ROTATION,
        interval=Config.LOG_INTERVAL,
        backupCount=Config.LOG_BACKUP_COUNT,
        encoding=Config.LOG_ENCODING,
        utc=Config.LOG_USE_UTC
    )
    log_handler.setFormatter(log_formatter)
    log_handler.suffix = Config.LOG_SUFFIX

    current_time = datetime.now()
    # Calculate next midnight
    next_midnight = datetime.combine(
        current_time.date(),
        dt_time(0, 0, 0)
    )
    if current_time >= next_midnight:
        # If we're past midnight today, rollover at next midnight
        from datetime import timedelta
        next_midnight = next_midnight + timedelta(days=1)

    # Set the rollover time (in seconds since epoch)
    log_handler.rolloverAt = next_midnight.timestamp()

    # Config logger
    logger = logging.getLogger(Config.LOGGER_NAME)
    logger.setLevel(Config.LOG_LEVEL)

    # Remove existing handlers to avoid duplicates
    logger.handlers.clear()
    logger.addHandler(log_handler)
    
    return logger