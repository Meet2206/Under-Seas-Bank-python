from cryptography.fernet import Fernet, InvalidToken
from sqlalchemy.types import String, TypeDecorator
from typing import Optional

from app.config import get_settings


class EncryptedString(TypeDecorator):
    """Encrypt/decrypt string values transparently at rest."""

    impl = String
    cache_ok = True

    def __init__(self, length: Optional[int] = None, **kwargs):
        super().__init__(length=length, **kwargs)
        settings = get_settings()
        key = settings.FIELD_ENCRYPTION_KEY
        
        # Valid Fernet key fallback
        default_fallback = "ZoGwr7tdSoF155NaBCjYvZgGtJ-gPhCqKkX3cpvgARw="
        
        if not key:
            print("WARNING: FIELD_ENCRYPTION_KEY is not configured! Using default fallback key.")
            key = default_fallback
            
        try:
            self._fernet = Fernet(key.encode())
        except Exception as e:
            print(f"WARNING: Invalid FIELD_ENCRYPTION_KEY configuration ({e}). Falling back to default key.")
            self._fernet = Fernet(default_fallback.encode())

    def process_bind_param(self, value, dialect):
        if value is None:
            return value
        return self._fernet.encrypt(value.encode()).decode()

    def process_result_value(self, value, dialect):
        if value is None:
            return value
        try:
            return self._fernet.decrypt(value.encode()).decode()
        except InvalidToken:
            # Backward compatibility while existing plaintext rows are migrated/reset.
            return value
