from sqlalchemy import Column, Integer, String, Text
from .database import Base

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    nama_tempat = Column(String(100), nullable=True) 
    
    # === DATA CSV ===
    nama_user = Column(String(100), nullable=True)
    rating = Column(Integer, nullable=True) # Nilai bintang 1-5
    tanggal = Column(String(50), nullable=True)
    review_text = Column(Text, nullable=False)
    clean_review = Column(Text, nullable=True)


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password = Column(String(200), nullable=False) # SHA-256 Hashed password
    role = Column(String(50), default="user", nullable=False) # 'admin' atau 'user'
