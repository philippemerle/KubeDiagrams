"""Http response builder."""
from typing import Any, Dict, Optional
from flask import jsonify, Response


class ResponseBuilder:
    """Http response builder."""

    @staticmethod
    def success(
        data: Any = None,
        message: str = "Success",
        status_code: int = 200
    ) -> tuple[Response, int]:
        """
        Create a standardized success response.

        Args:
            data: Data to be returned
            message: Success message
            status_code: HTTP status code

        Returns:
            tuple[Response, int]: Flask response and status code
        """
        response = {
            "success": True,
            "message": message
        }

        if data is not None:
            if isinstance(data, dict):
                response.update(data)
            else:
                response["data"] = data

        return jsonify(response), status_code

    @staticmethod
    def error(
        error: str,
        details: Optional[Dict[str, Any]] = None,
        status_code: int = 400
    ) -> tuple[Response, int]:
        """
        Creates a standard error response.

        Args:
            error: Error message
            details: Additional details
            status_code: HTTP status code

        Returns:
            tuple[Response, int]: Flask response and status code
        """
        response = {
            "success": False,
            "error": error
        }

        if details:
            response.update(details)

        return jsonify(response), status_code

    @staticmethod
    def validation_error(
        field: str,
        message: str,
        status_code: int = 400
    ) -> tuple[Response, int]:
        """
        Creates a validation error response.

        Args:
            field: Field in error
            message: Error message
            status_code: HTTP status code

        Returns:
            tuple[Response, int]: Flask response and status code
        """
        return ResponseBuilder.error(
            error=message,
            details={"field": field, "type": "validation_error"},
            status_code=status_code
        )

    @staticmethod
    def diagram_success(
        diagram: str,
        mime_type: str,
        filename: str,
        message: str = "Diagram successfully generated.",
        command: str = None,
        stdout: str = "",
        stderr: str = ""
    ) -> tuple[Response, int]:
        """
        Creates a success response for the diagram generation.

        Args:
            diagram: Content of the diagram (encoded)
            mime_type: MIME type of the diagram
            filename: File name
            message: Success message
            command: Command executed
            stdout: Standard output
            stderr: Error output

        Returns:
            tuple[Response, int]: Flask response and status code
        """
        response_data = {
            "diagram": diagram,
            "mimeType": mime_type,
            "filename": filename,
            "message": message,
            "command": command,
            "stdout": stdout or "",
            "stderr": stderr or ""
        }

        return ResponseBuilder.success(data=response_data, message=message, status_code=200)

    @staticmethod
    def diagram_error(
        error: str,
        command: str = None,
        stdout: str = "",
        stderr: str = "",
        status_code: int = 400
    ) -> tuple[Response, int]:
        """
        Creates an error response for diagram generation.

        Args:
            error: Error message
            command: Command executed
            stdout: Standard output
            stderr: Error output
            status_code: HTTP status code

        Returns:
            tuple[Response, int]: Flask response and status code
        """
        details = {
            "command": command,
            "stdout": stdout or "",
            "stderr": stderr or ""
        }

        return ResponseBuilder.error(
            error=error,
            details=details,
            status_code=status_code
        )

    @staticmethod
    def from_diagram_result(result) -> tuple[Response, int]:
        """
        Create a response from a DiagramResult.

        Args:
            result: Instance of DiagramResult

        Returns:
            tuple[Response, int]: Flask response and status code
        """
        status_code = 200 if result.success else 400
        return jsonify(result.to_dict()), status_code

