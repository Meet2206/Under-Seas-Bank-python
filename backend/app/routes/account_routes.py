from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.account_schema import CreateAccountRequest
from app.services.account_service import create_account, get_user_accounts
from app.middleware.auth_middleware import get_current_user
from app.services.account_service import get_account_statement
from app.services.account_service import get_passbook
from app.models.account_model import Account
from app.utils.lookup_hash import build_lookup_hash


router = APIRouter(prefix="/accounts")


@router.post("/create")
def create_bank_account(
    data: CreateAccountRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    account = create_account(current_user.id, data.account_type, db)

    return account


@router.get("/my-accounts")
def my_accounts(
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):

    return get_user_accounts(current_user.id, db)


@router.get("/lookup")
def lookup_account_by_number(
    account_number: str = Query(..., description="Account number to look up"),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    """Resolve an account number to its account ID for transfers."""
    h = build_lookup_hash(account_number)
    account = db.query(Account).filter(Account.account_number_hash == h).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")
    return {
        "id": account.id,
        "account_type": account.account_type,
        "account_number": account.account_number,
    }


@router.get("/statement/{account_id}")
def account_statement(
    account_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    account = next(
        (item for item in get_user_accounts(current_user.id, db) if item.id == account_id),
        None,
    )
    if not account:
        raise HTTPException(status_code=403, detail="Unauthorized account access")

    return get_account_statement(account_id, db)    

@router.get("/passbook/{account_id}")
def passbook(
    account_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user),
):
    account = next(
        (item for item in get_user_accounts(current_user.id, db) if item.id == account_id),
        None,
    )
    if not account:
        raise HTTPException(status_code=403, detail="Unauthorized account access")

    return get_passbook(account_id, db)    


from pydantic import BaseModel
from app.models.fixeddeposit_model import FixedDeposit
from app.models.loan_model import Loan
from app.models.creditcard_model import CreditCard
from app.models.transaction_model import Transaction

class CloseAccountRequest(BaseModel):
    reason: str


@router.post("/{account_id}/validate-closure")
def validate_closure(
    account_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    # Verify ownership
    account = db.query(Account).filter(Account.id == account_id, Account.user_id == current_user.id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    reasons = []

    # 1. Available Balance = 0.00
    if account.balance != 0:
        reasons.append(f"Account balance is not zero (Current balance: ₹{account.balance:,.2f}).")

    # 2. No Active Fixed Deposits
    active_fds = db.query(FixedDeposit).filter(FixedDeposit.account_id == account_id, FixedDeposit.status == "active").count()
    if active_fds > 0:
        reasons.append(f"{active_fds} Active Fixed Deposit(s) found.")

    # 3. No Active Loans
    active_loans = db.query(Loan).filter(Loan.account_id == account_id, Loan.status == "active").count()
    if active_loans > 0:
        reasons.append(f"{active_loans} Active Loan(s) found.")

    # 4. No Pending Transactions
    pending_txn = db.query(Transaction).filter(
        ((Transaction.from_account_id == account_id) | (Transaction.to_account_id == account_id)),
        Transaction.status == "Pending"
    ).count()
    if pending_txn > 0:
        reasons.append(f"{pending_txn} Pending transaction(s) found.")

    # 5. No Outstanding Credit Card dues (if applicable)
    outstanding_cc = db.query(CreditCard).filter(
        CreditCard.account_id == account_id,
        CreditCard.status == "active",
        CreditCard.used_credit > 0
    ).count()
    if outstanding_cc > 0:
        reasons.append("Outstanding Credit Card dues found linked to this account.")

    # 6. Status must be Active
    if account.status == "Closed":
        reasons.append("Account is already closed.")

    can_close = len(reasons) == 0

    return {
        "canClose": can_close,
        "reasons": reasons
    }


@router.post("/{account_id}/close")
def close_account(
    account_id: int,
    data: CloseAccountRequest,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    # Verify ownership
    account = db.query(Account).filter(Account.id == account_id, Account.user_id == current_user.id).first()
    if not account:
        raise HTTPException(status_code=404, detail="Account not found")

    # Run validation checks
    validation = validate_closure(account_id, db, current_user)
    if not validation["canClose"]:
        raise HTTPException(
            status_code=400,
            detail="Account is not eligible for closure: " + "; ".join(validation["reasons"])
        )

    # Soft close
    import datetime
    account.status = "Closed"
    account.closed_at = datetime.datetime.now(datetime.timezone.utc)
    account.closed_by = current_user.email
    account.closure_reason = data.reason

    db.commit()
    db.refresh(account)

    return {"message": "Account closed successfully", "status": account.status}
