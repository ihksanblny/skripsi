import os
import json
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

# Import dependencies
from ..core.constants import GMAPS_LINKS
from ..core import models, database

router = APIRouter()

# ==========================================
# FITUR: DAFTAR KAFE (Direktori Publik & Image Linking)
# ==========================================
@router.get("/daftar-kafe")
def get_daftar_kafe(db: Session = Depends(database.get_db)):
    # 1. Gunakan fungsi Agregasi Database (Group By) untuk menghitung total ulasan 
    # dan rata-rata rating per nama kafe secara efisien.
    results = (
        db.query(
            models.Review.nama_tempat,
            func.count(models.Review.id).label("total_ulasan"),
            func.round(func.avg(models.Review.rating), 1).label("avg_rating")
        )
        .group_by(models.Review.nama_tempat)
        .order_by(models.Review.nama_tempat)
        .all()
    )

    # 2. Pengecekan file foto scraping JSON
    # File ini dihasilkan dari script Selenium secara terpisah
    foto_map: dict = {}
    
    # Mencari letak file `foto_kafe.json` relatif terhadap file ini
    # (backend/routers/kafe.py mundur dua langkah ke skripsi/scraping/foto_kafe.json)
    _current_dir = os.path.dirname(os.path.abspath(__file__))
    _project_root = os.path.dirname(os.path.dirname(_current_dir))
    foto_json_path = os.path.join(_project_root, "scraping", "foto_kafe.json")
    
    if os.path.exists(foto_json_path):
        try:
            with open(foto_json_path, "r", encoding="utf-8") as f:
                foto_map = json.load(f)
        except Exception:
            foto_map = {}

    # 3. Format hasil menjadi Array of Dictionary
    return [
        {
            "nama": r.nama_tempat,
            "total_ulasan": r.total_ulasan,
            "avg_rating": float(r.avg_rating) if r.avg_rating else 0.0,
            
            # Jika URL di konstan tidak ada, generate pencarian Gmaps otomatis
            "gmaps_url": GMAPS_LINKS.get(r.nama_tempat, f"https://www.google.com/maps/search/{r.nama_tempat.replace(' ', '+')}+Malang"),
            
            # Pasangkan foto jika ada di scraping JSON
            "foto_url": foto_map.get(r.nama_tempat, ""),
        }
        for r in results
    ]
