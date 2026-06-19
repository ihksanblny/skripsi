import hashlib
from sqlalchemy import text
from backend.database import SessionLocal, engine
from backend import models

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def seed_admin_user():
    print("====================================================")
    print("MEMULAI SEEDER USER ADMIN UNTUK SKRIPSI NLP")
    print("====================================================")
    
    # 1. Pastikan kolom 'role' ada di tabel 'users'
    # SQLAlchemy Base.metadata.create_all tidak otomatis menambah kolom baru jika tabel sudah ada.
    # Oleh karena itu, kita jalankan ALTER TABLE secara manual jika kolom 'role' belum ada.
    db = SessionLocal()
    try:
        print("Memeriksa struktur tabel 'users'...")
        # Jalankan query untuk mengecek apakah kolom role sudah ada di tabel users
        result = db.execute(text("SHOW COLUMNS FROM users LIKE 'role'")).fetchone()
        
        if not result:
            print("Kolom 'role' tidak ditemukan. Melakukan migrasi database (ALTER TABLE)...")
            db.execute(text("ALTER TABLE users ADD COLUMN role VARCHAR(50) NOT NULL DEFAULT 'user'"))
            db.commit()
            print("Berhasil menambahkan kolom 'role' ke dalam tabel 'users' di MySQL!")
        else:
            print("Kolom 'role' sudah tersedia di database.")
            
    except Exception as e:
        print(f"Gagal memvalidasi/migrasi kolom 'role': {e}")
        print("Mencoba melanjutkan...")
    
    # 2. Periksa apakah sudah ada user admin
    try:
        admin_user = db.query(models.User).filter(models.User.role == "admin").first()
        
        if admin_user:
            print("\nUser Admin sudah terdaftar sebelumnya di database Anda!")
            print(f"   * Username : {admin_user.username}")
            print(f"   * Email    : {admin_user.email}")
            print(f"   * Role     : {admin_user.role}")
            print("\nAnda bisa langsung login menggunakan akun tersebut.")
        else:
            print("\nAdmin belum terdaftar. Membuat akun admin default...")
            
            # Konfigurasi Admin Default
            admin_username = "admin"
            admin_email = "admin@example.com"
            admin_plain_pass = "admin123"
            
            # Pastikan username ini belum dipakai
            existing_user = db.query(models.User).filter(models.User.username == admin_username).first()
            if existing_user:
                print(f"Username '{admin_username}' sudah dipakai oleh user biasa.")
                print("Meningkatkan hak akses user tersebut menjadi 'admin'...")
                existing_user.role = "admin"
                db.commit()
                print(f"User '{admin_username}' sekarang memiliki akses ADMIN!")
            else:
                hashed_pass = hash_password(admin_plain_pass)
                new_admin = models.User(
                    username=admin_username,
                    email=admin_email,
                    password=hashed_pass,
                    role="admin"
                )
                db.add(new_admin)
                db.commit()
                
                print("\nAKUN ADMIN BERHASIL DIBUAT!")
                print("----------------------------------------------------")
                print(f"   * Username : {admin_username}")
                print(f"   * Email    : {admin_email}")
                print(f"   * Password : {admin_plain_pass}")
                print(f"   * Role     : admin")
                print("----------------------------------------------------")
                print("Silakan gunakan akun di atas untuk login ke Dashboard Admin!")
                
    except Exception as e:
        db.rollback()
        print(f"Gagal melakukan seeding admin: {e}")
    finally:
        db.close()
        print("====================================================")

if __name__ == "__main__":
    seed_admin_user()
