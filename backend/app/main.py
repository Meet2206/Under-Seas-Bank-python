from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import traceback
import logging
from fastapi import Request
from fastapi.responses import JSONResponse

from app.config import get_settings
from app.database import engine, Base
from app.routes.auth_routes import router as auth_router
from app.routes.account_routes import router as account_router
from app.routes.transaction_routes import router as transaction_router
from app.routes.loan_routes import router as loan_router
from app.routes.fd_routes import router as fd_router
from app.routes.creditcard_routes import router as credit_router
from app.routes.analytics_routes import router as analytics_router
from app.routes.beneficiary_routes import router as beneficiary_router

logger = logging.getLogger(__name__)
settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup and shutdown lifecycle."""
    import time
    from sqlalchemy.exc import OperationalError
    
    # Try connecting to the database with retries to prevent startup crash if database is booting
    retries = 5
    while retries > 0:
        try:
            Base.metadata.create_all(bind=engine)
            from app.database import run_migrations
            run_migrations()
            print("Database tables verified/created successfully!")
            break
        except OperationalError as e:
            retries -= 1
            print(f"Database not ready yet ({e}). Retrying in 2 seconds... ({retries} retries left)")
            time.sleep(2)
    else:
        print("WARNING: Could not connect to database on startup. Proceeding anyway.")

    print(f"{settings.APP_NAME} v{settings.APP_VERSION} running")
    print("Docs available at /docs")

    yield

    print(f"{settings.APP_NAME} shutting down")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="Banking System Backend API",
    lifespan=lifespan,
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
)

# FastAPI CORSMiddleware raises RuntimeError if "*" is in allow_origins while allow_credentials is True
origins = settings.cors_origins_list
allow_credentials = True
if "*" in origins or not origins:
    allow_credentials = False

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if origins else ["*"],
    allow_credentials=allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Global exception handler ──────────────────────────────────────────────────
# FastAPI's CORSMiddleware does NOT attach CORS headers to unhandled 500
# responses. This handler ensures every error response includes the correct
# Access-Control-Allow-Origin header so the browser sees the real status code
# instead of a misleading CORS block.
# ─────────────────────────────────────────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Catch-all handler: logs the traceback and returns a proper 500 with CORS headers."""

    logger.error("Unhandled exception: %s", traceback.format_exc())

    origin = request.headers.get("origin", "")
    allowed = settings.cors_origins_list

    # Mirror back the origin if it is in the allow-list; otherwise omit header.
    cors_origin = origin if origin.rstrip("/") in [o.rstrip("/") for o in allowed] else ""

    headers = {}
    if cors_origin:
        headers["Access-Control-Allow-Origin"] = cors_origin
        headers["Access-Control-Allow-Credentials"] = "true"
        headers["Access-Control-Allow-Methods"] = "*"
        headers["Access-Control-Allow-Headers"] = "*"

    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error. Please try again later."},
        headers=headers,
    )


@app.get("/", tags=["Health"])
async def root():
    """Basic API status check."""
    return {
        "status": "online",
        "app": settings.APP_NAME,
        "version": settings.APP_VERSION,
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """Health endpoint for monitoring."""
    return {"status": "healthy"}

app.include_router(auth_router, tags=["Auth"])

app.include_router(account_router, tags=["Accounts"])

app.include_router(transaction_router, tags=["Transactions"])

app.include_router(loan_router, tags=["Loans"])

app.include_router(fd_router, tags=["Fixed Deposit"])

app.include_router(credit_router, tags=["Credit Card"])

app.include_router(analytics_router, tags=["Analytics"])

app.include_router(beneficiary_router, tags=["Beneficiaries"])

# Routers will be registered as modules are implemented
# from app.routes import auth, user, account, transaction
# app.include_router(auth.router, prefix="/auth", tags=["Authentication"])
