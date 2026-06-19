from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Karena pakai Laragon/XAMPP bawaan, passwordnya dikosongin
# Format: mysql+pymysql://<username>:<password>@<host>:<port>/<nama_database>
DATABASE_URL = "mysql+pymysql://root:@localhost/skripsi_db"

engine = create_engine(
    DATABASE_URL,
    pool_recycle=3600,   # Segarkan koneksi setiap 1 jam
    pool_pre_ping=True   # Cek apakah koneksi masih hidup sebelum dipakai
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Dependensi untuk membuka dan menutup database setiap kali di-request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()