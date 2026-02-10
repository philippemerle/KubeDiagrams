"""Route for submitting user feedback."""
from flask import request, Blueprint
import logging

from config import Config
from utils import ResponseBuilder, logger
from .utils import log_to_csv

submit_bp = Blueprint('submit', __name__)

@submit_bp.route('/api/submit-feedback', methods=['POST'])
def submit_feedback():
    """Submit user feedback."""
    data = request.get_json()
    note = data.get("note", "")
    comment = data.get("comment", "")
    diagram_type = data.get("diagramType", "unknown")

    # Log to CSV only
    client_ip = request.remote_addr
    log_to_csv(client_ip, "Feedback", f"type={diagram_type};note={note}")

    if note or comment:
        try:
            with open(Config.FEEDBACK_FILE, "a", encoding="utf-8") as f:
                f.write(f"[{diagram_type.upper()}]\nNote: {note}\nCommentaire: {comment}\n\n")

            return ResponseBuilder.success(
                message="Feedback submitted successfully. Thank you!"
            )
        except Exception as e:
            # Log l'erreur dans le CSV
            csv_logger = logging.getLogger(Config.LOGGER_NAME)
            csv_logger.error(f"Error writing feedback: {e}")
            return ResponseBuilder.error(
                "Failed to save feedback. Please try again.",
                status_code=500
            )

    return ResponseBuilder.validation_error(
        "feedback",
        "Feedback must contain at least a note or a comment."
    )
