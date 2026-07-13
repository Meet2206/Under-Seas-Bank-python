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
    with engine.connect() as conn:
        # Add columns to users table
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN customer_id VARCHAR(12) UNIQUE"))
            conn.commit()
        except Exception:
            pass
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN account_creation_notification_shown BOOLEAN DEFAULT FALSE"))
            conn.commit()
        except Exception:
            pass
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN welcome_reward_notification_shown BOOLEAN DEFAULT FALSE"))
            conn.commit()
        except Exception:
            pass

        # Add columns to accounts table
        try:
            conn.execute(text("ALTER TABLE accounts ADD COLUMN ifsc_code VARCHAR(11) DEFAULT 'UNBS0000101'"))
            conn.commit()
        except Exception:
            pass
        try:
            conn.execute(text("ALTER TABLE accounts ADD COLUMN status VARCHAR(20) DEFAULT 'Active'"))
            conn.commit()
        except Exception:
            pass

        # Add columns to transactions table
        try:
            conn.execute(text("ALTER TABLE transactions ADD COLUMN description VARCHAR(255)"))
            conn.commit()
        except Exception:
            pass
        try:
            conn.execute(text("ALTER TABLE transactions ADD COLUMN status VARCHAR(50) DEFAULT 'Successful'"))
            conn.commit()
        except Exception:
            pass