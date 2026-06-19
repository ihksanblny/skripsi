from collections import Counter
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

# Import dari parent directory
from ..core import models, database

router = APIRouter()

# ==========================================
# FITUR 5: STATISTIK NLP (DINAMIS)
# ==========================================
@router.get("/nlp-stats")
def get_nlp_stats(db: Session = Depends(database.get_db)):
    # 1. Ambil data ulasan yang statusnya sudah melewati proses pre-processing
    data = db.query(models.Review).filter(models.Review.clean_review != "").all()
    
    # 2. Hitung jumlah kafe unik yang memiliki ulasan bersih
    unique_shops = set([r.nama_tempat for r in data])
    
    # 3. Hitung Total Token (semua kata) & Vocabulary (kata unik)
    all_words = []
    for r in data:
        if r.clean_review:
            all_words.extend(r.clean_review.split())
        
    vocab = set(all_words)
    
    # 4. Hitung persentase seluruh data di DB
    total_reviews_count = db.query(models.Review).count()
    
    return {
        "jumlah_dokumen": len(unique_shops),
        "total_token": len(all_words),
        "vocabulary": len(vocab),
        "is_ready": len(data) > 0,
        "total_reviews": total_reviews_count
    }


# ==========================================
# FITUR 6: BAG-OF-WORDS & BIGRAM (Eksplorasi Kata)
# ==========================================
@router.get("/bow")
def generate_bow(db: Session = Depends(database.get_db)):
    # 1. Hanya gunakan data ulasan yang sudah bersih
    data = db.query(models.Review).filter(models.Review.clean_review != "").all()
    if not data:
        return {"error": "Belum ada dataset yang di-preprocess!"}

    # 2. Gabungkan seluruh teks per kafe (menjadi 1 dokumen per kafe)
    corpus = {}
    for r in data:
        if r.nama_tempat not in corpus:
            corpus[r.nama_tempat] = ""
        corpus[r.nama_tempat] += " " + r.clean_review

    # 3. Kumpulkan kata untuk mencari Top 10 term paling sering muncul
    all_words = []
    for text in corpus.values():
        all_words.extend(text.split())
    
    top_words = [word for word, count in Counter(all_words).most_common(10)]
    
    # 4. Bangun Matriks sederhana (Preview Tabel Frekuensi untuk UI Frontend)
    matrix = []
    # Ambil 5 kafe pertama saja agar response JSON tidak terlalu berat
    for shop, text in list(corpus.items())[:5]: 
        row = {"shop": shop}
        words_in_text = text.split()
        for w in top_words:
            row[w] = words_in_text.count(w)
        matrix.append(row)

    return {
        "headers": top_words,
        "data": matrix
    }


@router.get("/bigrams")
def get_bigrams(db: Session = Depends(database.get_db)):
    # 1. Gabungkan seluruh teks bersih di database jadi satu string raksasa
    data = db.query(models.Review).filter(models.Review.clean_review != "").all()
    all_text = " ".join([r.clean_review for r in data])
    words = all_text.split()
    
    # 2. Iterasi manual pembuatan pasangan kata (Bigram)
    bigram_list = []
    for i in range(len(words)-1):
        bigram_list.append(f"{words[i]} {words[i+1]}")
    
    # 3. Hitung frekuensi dan ambil Top 15 terbanyak
    top_bigrams = Counter(bigram_list).most_common(15)
    
    # 4. Format ke JSON array
    return [{"word": pair, "count": freq} for pair, freq in top_bigrams]
