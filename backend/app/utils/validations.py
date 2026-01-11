import re


class Validations:
    def __init__(self):
        self.session_validation = r"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}&&[0-9]{10,13}$"
        self.mime_types = [
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/pdf",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/markdown",
            "text/plain",
        ]

    def validate_file_size(self, value: int) -> bool:
        return value > 5242880

    def validate_session(self, value: str) -> bool:
        return re.match(self.session_validation, value)

    def validate_mimetype(self, value: str) -> bool:
        if self.mime_types.count(value) == 0:
            return False

        return True

validations = Validations()
