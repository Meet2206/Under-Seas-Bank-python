from fastapi import HTTPException
from decimal import Decimal

from sqlalchemy.orm import Session

from app.models.account_model import Account
from app.models.fixeddeposit_model import FixedDeposit
from app.models.transaction_model import Transaction


def calculate_maturity(principal, rate, months):

    years = Decimal(months) / Decimal("12")

    maturity = principal * (Decimal("1") + (rate / Decimal("100")) * years)

    return maturity.quantize(Decimal("0.01"))


def create_fd(data, user_id: int, db: Session):
    account = db.query(Account).filter(
        Account.id == data.account_id,
        Account.user_id == user_id,
    ).first()
    if not account:
        raise HTTPException(status_code=403, detail="Unauthorized account access")

    if account.balance < data.principal_amount:
        raise HTTPException(status_code=400, detail="Insufficient balance in account to create Fixed Deposit")

    maturity = calculate_maturity(
        data.principal_amount,
        data.interest_rate,
        data.duration_months
    )

    try:
        # Deduct balance from the account
        account.balance -= data.principal_amount

        # Create Fixed Deposit
        fd = FixedDeposit(
            user_id=user_id,
            account_id=data.account_id,
            principal_amount=data.principal_amount,
            interest_rate=data.interest_rate,
            duration_months=data.duration_months,
            maturity_amount=maturity
        )
        db.add(fd)

        # Record debit transaction
        transaction = Transaction(
            from_account_id=account.id,
            amount=data.principal_amount,
            transaction_type="fixed_deposit"
        )
        db.add(transaction)

        db.commit()
        db.refresh(fd)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Fixed Deposit creation failed: {str(e)}")

    return fd


def get_user_fds(user_id: int, db: Session):

    return db.query(FixedDeposit).filter(
        FixedDeposit.user_id == user_id
    ).all()


def close_fd(fd_id: int, user_id: int, db: Session):

    fd = db.query(FixedDeposit).filter(
        FixedDeposit.id == fd_id,
        FixedDeposit.user_id == user_id,
    ).first()

    if not fd:
        raise HTTPException(status_code=404, detail="FD not found")

    if fd.status == "closed":
        raise HTTPException(status_code=400, detail="Fixed Deposit is already closed")

    account = db.query(Account).filter(
        Account.id == fd.account_id,
        Account.user_id == user_id,
    ).first()

    if not account:
        raise HTTPException(status_code=404, detail="Associated account not found")

    try:
        fd.status = "closed"

        # Credit the maturity amount back to the account
        account.balance += fd.maturity_amount

        # Record credit transaction
        transaction = Transaction(
            to_account_id=account.id,
            amount=fd.maturity_amount,
            transaction_type="fixed_deposit_close"
        )
        db.add(transaction)

        db.commit()
        db.refresh(fd)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Fixed Deposit closure failed: {str(e)}")

    return fd
