import io
import pandas as pd
import concurrent.futures
from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session

# Import dependencies dari level root (backend)
from ..core import models, database
from ..services.nlp_service import bersihkan_teks, save_stem_cache

# Membuat instance router khusus untuk urusan Data Reviews
router = APIRouter()

# ==========================================
# FITUR 1: BROWSE & UPLOAD CSV
# ==========================================
@router.post("/import-csv")
async def import_csv_to_db(file: UploadFile = File(...), db: Session = Depends(database.get_db)):
    # 1. Validasi ekstensi file harus CSV
    if not file.filename.endswith(".csv"):
        return {"error": "Format file yang diupload wajib CSV!"}
        
    # 2. Baca isi file dari memori secara asynchronous
    contents = await file.read()
    
    try:
        # Coba parse data menggunakan delimiter koma (Standar)
        try:
            df = pd.read_csv(io.BytesIO(contents), sep=',')
            # Jika semua kolom tergabung (artinya salah delimiter), gunakan titik-koma
            if 'review_text' not in df.columns:
                 df = pd.read_csv(io.BytesIO(contents), sep=';')
        except Exception:
            # Jika langsung error (tokenizing), gunakan delimiter titik-koma (Excel Indonesia)
            df = pd.read_csv(io.BytesIO(contents), sep=';')
            
    except Exception as e:
        return {"error": f"Gagal membaca isi tabel bersusun: {str(e)}"}

    # 3. Validasi keberadaan kolom 'review_text'
    if 'review_text' not in df.columns:
        return {"error": "Gagal! File CSV ini tidak memiliki header bernama 'review_text'. Format nama kolom Anda mungkin berbeda."}

    row_terhubung = 0
    
    # 4. Iterasi seluruh baris untuk dimasukkan ke Database
    for _, baris in df.iterrows():
        # Lewati jika review kosong atau "nan"
        if pd.isna(baris.get('review_text')) or str(baris.get('review_text')).strip() == "" or str(baris.get('review_text')).lower() == "nan":
            continue

        teks_review = str(baris['review_text'])
        # Cek duplikasi di database berdasarkan teks yang sama persis
        cek_data = db.query(models.Review).filter(models.Review.review_text == teks_review).first()
        
        if not cek_data:
            # Amankan nilai rating (jika kosong, jadikan 0)
            try:
                nilai_rating = int(baris.get('rating', 0)) if pd.notna(baris.get('rating')) else 0
            except:
                nilai_rating = 0
                
            # Siapkan entri baru
            data_baru = models.Review(
                nama_tempat  = str(baris.get('shop_name')) if pd.notna(baris.get('shop_name')) else 'Kafe Malang', 
                nama_user    = str(baris.get('review_name')) if pd.notna(baris.get('review_name')) else 'Anonim',
                rating       = nilai_rating,
                tanggal      = str(baris.get('review_date')) if pd.notna(baris.get('review_date')) else '-',
                review_text  = teks_review,
                clean_review = str(baris['clean_review']) if pd.notna(baris.get('clean_review')) else ""
            )
            
            db.add(data_baru)
            row_terhubung += 1
            
    # Eksekusi (Simpan) semua tambahan ke database secara permanen
    db.commit()
    return {"message": f"Upload {file.filename} Sukses!", "total_row_di_insert": row_terhubung}


# ==========================================
# FITUR 2: JALANKAN PRE-PROCESSING (TEXT CLEANING & STEMMING)
# ==========================================
@router.post("/run-preprocess")
def jalankan_preprocessing(db: Session = Depends(database.get_db), mode: str = "fast"):
    # 1. Cari ulasan yang kolom `clean_review` nya masih kosong
    query = db.query(models.Review).filter(models.Review.clean_review == "")
    
    # 2. Tentukan batasan data (Mode Kilat max 50, Full-Mode semuanya)
    if mode == "fast":
        data_mentah = query.limit(50).all()
        pesan_sukses = "Mode Kilat Selesai!"
    else:
        data_mentah = query.all()
        pesan_sukses = "Sastrawi Full-Mode Selesai!"
        
    if len(data_mentah) == 0:
         return {"message": "Semua data sudah bersih! Sastrawi tidak perlu dijalankan."}
         
    # 3. Eksekusi menggunakan Multithreading agar proses cepat tidak menyendat CPU
    with concurrent.futures.ThreadPoolExecutor(max_workers=8) as executor:
        teks_array = [raw.review_text for raw in data_mentah]
        hasil_bersih = list(executor.map(bersihkan_teks, teks_array))
        
    # 4. Simpan hasil bersih kembali ke object Database
    for i, raw in enumerate(data_mentah):
        raw.clean_review = hasil_bersih[i]
        
    db.commit()
    
    # 5. Simpan Cache Sastrawi ke file JSON agar proses selanjutnya lebih cepat
    save_stem_cache()
    
    return {"message": pesan_sukses, "jumlah_data_dibersihkan": len(data_mentah)}


# ==========================================
# FITUR 3: TARIK DATA UNTUK TABEL FRONTEND
# ==========================================
@router.get("/reviews")
def ambil_semua_review(db: Session = Depends(database.get_db), limit: int = 100):
    # Urutkan berdasarkan ID ASC (terlama ke terbaru) dan batasi jumlah pengembalian
    data = db.query(models.Review).order_by(models.Review.id.asc()).limit(limit).all()
    return data


# ==========================================
# FITUR 4: RESET DATABASE
# ==========================================
@router.delete("/reviews")
def hapus_semua_data(db: Session = Depends(database.get_db)):
    try:
        # Menghapus secara instan seluruh isi di tabel Review
        jumlah_dihapus = db.query(models.Review).delete()
        db.commit()
        return {"message": "Database berhasil dikosongkan!", "jumlah_dihapus": jumlah_dihapus}
    except Exception as e:
        # Jika gagal (misal koneksi terputus), batalkan aksi penghapusan
        db.rollback()
        return {"error": f"Gagal menghapus database: {str(e)}"}
