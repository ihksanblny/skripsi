from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core import models, database

# Import semua router yang sudah dipisah
from .routers import auth, reviews, nlp, kafe, dashboard, lda

# 1. INISIALISASI DATABASE
# Baris ini memerintahkan SQLAlchemy untuk membuat semua tabel di database 
# berdasarkan struktur yang ada di file models.py.
models.Base.metadata.create_all(bind=database.engine)

# 2. INISIALISASI APLIKASI FASTAPI
app = FastAPI(title="Backend Skripsi NLP")

# 3. KONFIGURASI CORS (Cross-Origin Resource Sharing)
# Middleware ini wajib ada agar frontend Vite (React) bisa mengakses API ini.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174"], 
    allow_origin_regex=r"https?://.*", 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"],
)

# 4. REGISTRASI ROUTER
# Menghubungkan semua file terpisah di folder `routers` ke dalam aplikasi utama.
# `prefix="/api"` memastikan bahwa semua endpoint otomatis diawali dengan "/api".
app.include_router(auth.router, prefix="/api", tags=["Authentication"])
app.include_router(reviews.router, prefix="/api", tags=["Reviews & CSV Processing"])
app.include_router(nlp.router, prefix="/api", tags=["NLP Statistics & BoW"])
app.include_router(kafe.router, prefix="/api", tags=["Daftar Kafe"])
app.include_router(dashboard.router, prefix="/api", tags=["Dashboard Summary"])
app.include_router(lda.router, prefix="/api", tags=["Topic Modeling & Hybrid Recommendation"])

# 5. ENDPOINT ROOT
@app.get("/")
def read_root():
    # Respons dasar saat mengakses root backend (localhost:8000)
    return {"status": "Server berjalan dengan baik!", "message": "Selamat datang di API NLP"}