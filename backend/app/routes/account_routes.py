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
