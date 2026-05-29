from sqlalchemy import create_engine, text
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL)

try:
    with engine.connect() as conn:
        conn.execute(text('ALTER TABLE "user" ADD COLUMN date_of_birth VARCHAR;'))
        conn.execute(text('ALTER TABLE "user" ADD COLUMN full_legal_name VARCHAR;'))
        conn.execute(text('ALTER TABLE "user" ADD COLUMN identity_verification_status VARCHAR DEFAULT \'unverified\';'))
        conn.execute(text('ALTER TABLE "user" ADD COLUMN ssn_last_four VARCHAR(4);'))
        conn.commit()
    print('Migration successful')
except Exception as e:
    print('Error:', e)
