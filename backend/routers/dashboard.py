import os
import json
from collections import Counter
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from ..core import models, database

router = APIRouter()

# ==========================================
# FITUR 7: Dashboard Summary (Statistik Ringkasan)
# ==========================================
@router.get("/dashboard-summary")
def get_dashboard_summary(db: Session = Depends(database.get_db)):
    # 1. Menghitung Distribusi Rating (Bar/Pie Chart Frontend)
    ratings = db.query(models.Review.rating, func.count(models.Review.id)).group_by(models.Review.rating).all()
    rating_data = [{"name": f"Star {r[0]}", "value": r[1]} for r in ratings]

    # 2. Menghitung Top 10 Kata Terbanyak (Word Frequency Chart)
    data = db.query(models.Review.clean_review).filter(models.Review.clean_review != "").all()
    all_text = " ".join([r[0] for r in data if r[0]])
    words = all_text.split()
    
    top_words = Counter(words).most_common(10)
    word_data = [{"name": w, "count": c} for w, c in top_words]

    # 3. Menghitung Bigram Terbanyak (Ringkasan Singkat)
    bigram_list = []
    for i in range(len(words)-1):
        bigram_list.append(f"{words[i]} {words[i+1]}")
    top_bigrams = Counter(bigram_list).most_common(5)
    bigram_data = [{"pair": p, "count": c} for p, c in top_bigrams]

    # 4. Mengecek Status Model LDA (Apakah sudah dilatih atau belum?)
    lda_stats = {"num_topics": 0, "coherence_score": 0, "status": "Belum Dilatih"}
    
    # Mencari lokasi penyimpanan model di folder `saved_models/model/model_info.json`
    _current_dir = os.path.dirname(os.path.abspath(__file__))
    _project_dir = os.path.dirname(os.path.dirname(_current_dir))
    model_info_path = os.path.join(_project_dir, "saved_models", "model", "model_info.json")
    
    if os.path.exists(model_info_path):
        try:
            with open(model_info_path, "r") as f:
                lda_stats = json.load(f)
                lda_stats["status"] = "Model Siap"
        except:
            pass

    return {
        "ratings": rating_data,
        "top_words": word_data,
        "top_bigrams": bigram_data,
        "lda_stats": lda_stats
    }
