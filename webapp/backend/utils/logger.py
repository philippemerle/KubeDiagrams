"""Configuration for application logging."""
import logging
import sys
from logging.handlers import RotatingFileHandler
from pathlib import Path


class AppLogger:
    """Logging manager for the application."""

    _loggers = {}

    @classmethod
    def setup_logger(
        cls,
        name: str,
        log_file: str = None,
        level: int = logging.INFO,
        max_bytes: int = 10 * 1024 * 1024,  # 10MB
        backup_count: int = 5
    ) -> logging.Logger:
        """
        Configure and return a logger.

        Args:
            name: Name of the logger
            log_file: Log File Path (optional)
            level: Logging level
            max_bytes: Maximum log file size before rotation
            backup_count: Number of backup files to keep

        Returns:
            logging.Logger: Logger configured
        """
        # To not recreate logger if already exist
        if name in cls._loggers:
            return cls._loggers[name]

        logger = logging.getLogger(name)
        logger.setLevel(level)

        # Avoid adding multiple handlers to the same logger
        if logger.handlers:
            return logger

        formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
            datefmt='%Y-%m-%d %H:%M:%S'
        )

        # Console handler
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(level)
        console_handler.setFormatter(formatter)
        logger.addHandler(console_handler)

        # Handler file if needed
        if log_file:
            # Create directory if needed
            log_path = Path(log_file)
            log_path.parent.mkdir(parents=True, exist_ok=True)

            file_handler = RotatingFileHandler(
                log_file,
                maxBytes=max_bytes,
                backupCount=backup_count,
                encoding='utf-8'
            )
            file_handler.setLevel(level)
            file_handler.setFormatter(formatter)
            logger.addHandler(file_handler)

        cls._loggers[name] = logger
        return logger

    @classmethod
    def get_logger(cls, name: str) -> logging.Logger:
        """
        Retrieve an existing logger or create a new one.

        Args:
            name: Name of the logger

        Returns:
            logging.Logger: Logger
        """
        if name in cls._loggers:
            return cls._loggers[name]
        return cls.setup_logger(name)


def get_app_logger(name: str = None) -> logging.Logger:
    """
    Helper function to obtain a logger.

    Args:
        name: Name of the logger (uses the name of the calling module by default)

    Returns:
        logging.Logger: Logger configured
    """
    if name is None:
        import inspect
        frame = inspect.currentframe().f_back
        name = frame.f_globals.get('__name__', 'app')

    return AppLogger.get_logger(name)

