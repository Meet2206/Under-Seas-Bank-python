from sqlalchemy import Column, Integer, Numeric, String, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base
from app.utils.encryption import EncryptedString


class Account(Base):

    __tablename__ = "accounts"

    id = Column(Integer, primary_key=True, index=True)

    account_number = Column(EncryptedString(512), nullable=False)
    account_number_hash = Column(String(64), unique=True, index=True, nullable=False)

    account_type = Column(String)
    ifsc_code = Column(String(11), default="UNBS0000101")
    status = Column(String(20), default="Active")

    user_id = Column(Integer, ForeignKey("users.id"))

    balance = Column(Numeric(14, 2), default=0)

    user = relationship("User")
