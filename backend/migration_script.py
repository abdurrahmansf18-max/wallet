from sqlmodel import create_engine, text, Session
from app.core.config import settings

engine = create_engine(settings.DATABASE_URL)

alter_statements = [
    "ALTER TABLE \"user\" ADD COLUMN IF NOT EXISTS theme VARCHAR DEFAULT 'system';",
    "ALTER TABLE \"user\" ADD COLUMN IF NOT EXISTS ui_animations BOOLEAN DEFAULT true;",
    "ALTER TABLE \"user\" ADD COLUMN IF NOT EXISTS compact_mode BOOLEAN DEFAULT false;",
    "ALTER TABLE \"user\" ADD COLUMN IF NOT EXISTS large_text BOOLEAN DEFAULT false;",
    "ALTER TABLE \"user\" ADD COLUMN IF NOT EXISTS ui_layout VARCHAR DEFAULT 'default';"
]

with Session(engine) as session:
    for stmt in alter_statements:
        session.exec(text(stmt))
    session.commit()
    print("Migration completed!")
