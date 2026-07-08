from typing import Annotated, Optional

from pydantic import BaseModel, EmailStr, StringConstraints


MPIN = Annotated[str, StringConstraints(pattern=r"^\d{4}$")]
PHONE = Annotated[str, StringConstraints(pattern=r"^\d{10}$")]
OTP = Annotated[str, StringConstraints(pattern=r"^\d{6}$")]


class RegisterRequest(BaseModel):
    name: str
    email: EmailStr
    phone_number: PHONE
    mpin: MPIN


class LoginRequest(BaseModel):
    phone_number: PHONE
    mpin: MPIN


class AuthResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    verification_required: Optional[bool] = None
    verification_channel: Optional[str] = None
    verification_target: Optional[EmailStr] = None


class SendPhoneOTPRequest(BaseModel):
    phone_number: PHONE


class VerifyPhoneOTPRequest(BaseModel):
    phone_number: PHONE
    otp: OTP


class SendEmailOTPRequest(BaseModel):
    email: EmailStr


class VerifyEmailOTPRequest(BaseModel):
    email: EmailStr
    otp: OTP
