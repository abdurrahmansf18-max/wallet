from sqlmodel import create_engine, text, Session
from app.core.config import settings
engine = create_engine(settings.DATABASE_URL)
alter_statements = [
    "CREATE TABLE IF NOT EXISTS paymentmethod (id UUID PRIMARY KEY, created_at TIMESTAMP NOT NULL, updated_at TIMESTAMP NOT NULL, type VARCHAR NOT NULL, name VARCHAR NOT NULL, last_four VARCHAR NOT NULL, specific_type VARCHAR NOT NULL, expiry_date VARCHAR, user_id UUID NOT NULL REFERENCES \"user\"(id));"
]
with Session(engine) as session:
    for stmt in alter_statements:
        session.exec(text(stmt))
    session.commit()
    print("PaymentMethod Migration completed!")
