from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
import hashlib

# Import database dan models dari parent directory (folder backend)
from ..core import models, database

# Membuat instance router khusus untuk fitur autentikasi
router = APIRouter()

# Schema validasi untuk Register (Memastikan data yang dikirim sesuai format)
class UserRegister(BaseModel):
    username: str
    email: str
    password: str

# Schema validasi untuk Login
class UserLogin(BaseModel):
    username_or_email: str
    password: str

# Fungsi bantuan (helper function) untuk melakukan enkripsi (hashing) password dengan SHA-256
def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

# Endpoint API untuk Register
@router.post("/register")
def register_user(user: UserRegister, db: Session = Depends(database.get_db)):
    # 1. Cek apakah username sudah ada di database
    exist_username = db.query(models.User).filter(models.User.username == user.username).first()
    if exist_username:
        return {"error": "Username sudah terdaftar!"}
        
    # 2. Cek apakah email sudah ada di database
    exist_email = db.query(models.User).filter(models.User.email == user.email).first()
    if exist_email:
        return {"error": "Email sudah terdaftar!"}
        
    # 3. Enkripsi password dan buat object User baru
    hashed = hash_password(user.password)
    new_user = models.User(
        username=user.username,
        email=user.email,
        password=hashed,
        role="user"
    )
    
    # 4. Simpan ke database
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {
        "message": "Registrasi berhasil!",
        "username": new_user.username,
        "email": new_user.email,
        "role": new_user.role
    }

# Endpoint API untuk Login
@router.post("/login")
def login_user(user: UserLogin, db: Session = Depends(database.get_db)):
    # 1. Cari user di database menggunakan filter username ATAU email
    db_user = db.query(models.User).filter(
        (models.User.username == user.username_or_email) | 
        (models.User.email == user.username_or_email)
    ).first()
    
    # Jika user tidak ditemukan
    if not db_user:
        return {"error": "Username atau Email tidak ditemukan!"}
        
    # 2. Cocokkan hash password dari database dengan hash dari input password
    hashed = hash_password(user.password)
    if db_user.password != hashed:
        return {"error": "Password salah!"}
        
    # Jika sukses, kembalikan data user
    return {
        "message": "Login sukses!",
        "username": db_user.username,
        "email": db_user.email,
        "role": db_user.role
    }
