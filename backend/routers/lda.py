from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel

from ..core import models, database
from ..services.lda_service import (
    train_lda_model,
    get_lda_distribution_data,
    get_hybrid_recommendation_data
)

router = APIRouter()

# Schema Input untuk Training
class LDARequest(BaseModel):
    num_topics: int
    iterations: int

# ==========================================
# FITUR 8: TRAINING TOPIC MODELING (LDA)
# ==========================================
@router.post("/lda-run")
def run_topic_modeling(request: LDARequest, db: Session = Depends(database.get_db)):
    # 1. Ambil data yang sudah bersih dari database
    db_reviews = db.query(models.Review).filter(models.Review.clean_review != "").all()
    if not db_reviews:
        return {"error": "Dataset belum di-preprocess!"}

    # 2. Serahkan proses komputasi yang berat ke layer Service
    hasil = train_lda_model(db_reviews, request.num_topics, request.iterations)
    return hasil


# ==========================================
# FITUR 9: AMBIL DISTRIBUSI TOPIK KAFE
# ==========================================
@router.get("/lda-distribution")
def get_lda_distribution(num_topics: int = None, db: Session = Depends(database.get_db)):
    # 1. Ambil data yang sudah bersih dari database
    db_reviews = db.query(models.Review).filter(models.Review.clean_review != "").all()
    if not db_reviews:
        return {"error": "Belum ada data review yang dipreproses!"}

    # 2. Serahkan kalkulasi ke layer Service
    hasil = get_lda_distribution_data(db_reviews)
    return hasil


# ==========================================
# FITUR 10: SISTEM REKOMENDASI HYBRID (LDA + TF-IDF)
# ==========================================
@router.get("/recommend")
def recommend_coffeeshops(query: str, top_n: int = 5, db: Session = Depends(database.get_db)):
    if not query.strip():
        return {"error": "Query tidak boleh kosong!"}

    # 1. Ambil data dari database
    db_reviews = db.query(models.Review).filter(models.Review.clean_review != "").all()
    
    # 2. Serahkan proses TF-IDF dan kalkulasi Cosine Similarity ke layer Service
    hasil = get_hybrid_recommendation_data(db_reviews, query, top_n)
    return hasil
