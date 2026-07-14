from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from app.config import get_settings

settings = get_settings()

# SQLAlchemy engine with connection pooling
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20,
    echo=settings.DEBUG,
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
)

Base = declarative_base()


def get_db():
    """Provide a database session per request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def run_migrations():
    from sqlalchemy import text
    
    migrations = [
        ("users", "customer_id", "VARCHAR(12) UNIQUE"),
        ("users", "account_creation_notification_shown", "BOOLEAN DEFAULT FALSE"),
        ("users", "welcome_reward_notification_shown", "BOOLEAN DEFAULT FALSE"),
        ("users", "profile_image", "VARCHAR(255)"),
        
        ("accounts", "ifsc_code", "VARCHAR(11) DEFAULT 'UNBS0000101'"),
        ("accounts", "status", "VARCHAR(20) DEFAULT 'Active'"),
        ("accounts", "closed_at", "TIMESTAMP WITH TIME ZONE"),
        ("accounts", "closed_by", "VARCHAR(50)"),
        ("accounts", "closure_reason", "VARCHAR(255)"),
        
        ("transactions", "description", "VARCHAR(255)"),
        ("transactions", "status", "VARCHAR(50) DEFAULT 'Successful'"),
    ]
    
    for table, column, definition in migrations:
        try:
            with engine.connect() as conn:
                conn.execute(text(f"ALTER TABLE {table} ADD COLUMN {column} {definition}"))
                conn.commit()
                print(f"Successfully added column {column} to table {table}")
        except Exception:
            # Column already exists or error occurred, skip to next
            pass