import pandas as pd
import re
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

try:
    nltk.data.find('corpora/stopwords')
    nltk.data.find('tokenizers/punkt_tab')
except LookupError:
    nltk.download('stopwords')
    nltk.download('punkt')
    nltk.download('punkt_tab')

stemmer = StemmerFactory().create_stemmer()

# ==============================================================
# DAFTAR STOPWORD CUSTOM — BERBASIS ANALISIS CORPUS 6000 ULASAN
# ==============================================================
custom_stopwords = [
    # --- Kata penghubung & partikel Indonesia ---
    'yg', 'nya', 'aja', 'sih', 'yang', 'dan', 'di', 'ke', 'dari', 'ini', 'itu',
    'buat', 'kalo', 'kalau', 'untuk', 'dengan', 'ada', 'pada', 'juga', 'dalam',
    'bisa', 'ya', 'ga', 'gak', 'nggak', 'ngga', 'udah', 'sudah', 'banget', 'sangat',
    'sini', 'sana', 'deh', 'dong', 'kan', 'lah', 'kok', 'pun', 'baru',
    'mah', 'overall', 'ok', 'oke', 'pas', 'kayak', 'karena',
    'cuma', 'cuman', 'tapi', 'biar', 'atau', 'jadi', 'belum', 'lagi',
    'juga', 'sama', 'semua', 'mau', 'mungkin', 'selalu', 'hanya', 'apalagi',
    'masih', 'sudah', 'salah', 'satu', 'banyak', 'agak', 'terlalu', 'bikin',
    'minta', 'masuk', 'sesuai', 'sekali', 'langsung', 'waktu', 'hari',
    'pagi', 'siang', 'malam', 'buka', 'tutup', 'datang', 'dateng', 'kesini',
    'disini', 'kali', 'kita', 'saya', 'aku',

    # --- Kata identitas kafe/kedai (agar LDA fokus ke aspek, bukan nama) ---
    'cafe', 'kafe', 'coffee', 'shop', 'kopi', 'ngopi', 'kedai',
    'tempat', 'tempatnya',

    # --- Nama kafe & lokasi spesifik dari dataset ---
    'malang', 'kota', 'jalan', 'lokasi', 'soehat', 'suhat', 'soekarno', 'hatta',
    'amstirdam', 'dialoogi', 'kantja', 'nakoa', 'jokopi', 'muraco', 'roketto',
    'semusim', 'labore', 'kalmcoffee', 'suaco', 'sarijan', 'pesenkopi',
    'tlogomas', 'betek', 'merjo', 'aadk', 'kaf', 'tuku', 'grove',
    'golden', 'heritage', 'koffie', 'kophan', 'calf', 'hindia',
    'sebelasdua', 'belasdua', 'belas', 'duabelas',

    # --- Kata bahasa Inggris non-bermakna yang sering lolos ---
    'and', 'the', 'for', 'with', 'you', 'this', 'that', 'place', 'space',
    'very', 'its', 'but', 'not', 'was', 'are', 'from', 'non', 'wfc', 'wfh',
    'it', 'good', 'best', 'nice', 'cool', 'food', 'drink',

    # --- Kata netral/umum yang tidak diskriminatif untuk topik ---
    'foto', 'review', 'ulasan', 'rating', 'bintang', 'pesen',
    'tersedia', 'lain', 'biasa', 'saja', 'baik', 'coba',

    # --- Kata abbreviasi yang sudah dinormalisasi ke stopword ---
    'tp', 'jg', 'utk', 'bgt', 'sm', 'gt',
]

list_stopwords = stopwords.words('indonesian') + stopwords.words('english')
list_stopwords.extend(custom_stopwords)
list_stopwords = list(set(list_stopwords))  # Hapus duplikat


# ==============================================================
# KAMUS NORMALISASI — BERBASIS KATA GAUL & TYPO DALAM CORPUS
# ==============================================================
normalization_dict = {
    # --- Intensifier (dibuang ke stopword lewat normalisasi) ---
    'bgt': 'banget', 'bgtt': 'banget', 'bangett': 'banget',
    'pol': 'banget', 'poll': 'banget', 'pwol': 'banget', 'sgt': 'sangat',

    # --- Singkatan umum → kata lengkap (agar stemmer bisa kerja) ---
    'klo': 'kalau', 'kalo': 'kalau', 'kl': 'kalau', 'klow': 'kalau',
    'tp': 'tapi', 'tpi': 'tapi',
    'dgn': 'dengan', 'dg': 'dengan',
    'dr': 'dari', 'dri': 'dari',
    'krn': 'karena', 'karna': 'karena', 'krna': 'karena',
    'sm': 'sama',
    'sampe': 'sampai', 'sampek': 'sampai', 'smp': 'sampai',
    'trs': 'terus', 'trus': 'terus',
    'bkn': 'bukan',
    'bs': 'bisa', 'bisaa': 'bisa',
    'jg': 'juga', 'jga': 'juga',
    'utk': 'untuk',
    'bnyk': 'banyak', 'byk': 'banyak',
    'lmyn': 'lumayan', 'luamayan': 'lumayan',
    'pake': 'pakai', 'pakek': 'pakai',
    'krg': 'kurang',
    'cmn': 'cuma', 'cuman': 'cuma', 'cm': 'cuma',
    'dtg': 'datang', 'dateng': 'datang',
    'bbrp': 'beberapa',
    'gt': 'begitu', 'gitu': 'begitu', 'gmn': 'bagaimana',
    'pdhl': 'padahal',
    'blm': 'belum', 'belom': 'belum',
    'kuy': 'ayo', 'hayuk': 'ayo',
    'yg': 'yang',

    # --- Negasi → standar ---
    'gak': 'tidak', 'nggak': 'tidak', 'ga': 'tidak', 'ndak': 'tidak', 'ngga': 'tidak',
    'engga': 'tidak', 'enggak': 'tidak',

    # --- Kata sifat gaul → kata baku (agar tercluster dengan benar) ---
    'enak': 'nikmat', 'enakk': 'nikmat', 'uenak': 'nikmat', 'enakny': 'nikmat',
    'cozy': 'nyaman', 'comfy': 'nyaman', 'pw': 'nyaman', 'pewe': 'nyaman',
    'asik': 'nyaman', 'asikk': 'nyaman', 'asyik': 'nyaman',
    'worth': 'layak', 'worthit': 'layak', 'worth_it': 'layak',
    'gpp': 'oke', 'gapapa': 'oke',
    'estetik': 'indah', 'aesthetic': 'indah', 'asthetic': 'indah', 'instagramable': 'indah',
    'recommended': 'rekomendasi', 'rekomen': 'rekomendasi', 'rekomendid': 'rekomendasi', 'recomend': 'rekomendasi',
    'pricey': 'mahal', 'pricy': 'mahal',
    'cpt': 'cepat', 'cepet': 'cepat',
    'lbh': 'lebih',
    'mantap': 'bagus', 'mantul': 'bagus', 'good': 'bagus', 'best': 'terbaik', 'nice': 'bagus',
    'terbaik': 'bagus',
    'buruk': 'jelek', 'parah': 'jelek',
    'seger': 'segar', 'segeer': 'segar',
    'mahal': 'mahal',
    'terjangkau': 'murah',
    'hemat': 'murah',

    # --- Aktivitas anak muda → kata baku domain ---
    'wfc': 'kerja', 'wfh': 'kerja', 'wfa': 'kerja',
    'nugas': 'tugas', 'skripsi': 'tugas', 'skripsian': 'tugas', 'ngegas': 'kerja',
    'nongki': 'nongkrong', 'ngumpul': 'nongkrong',
    'ngobrol': 'ngobrol',
    'meeting': 'kerja',

    # --- Kata varian dengan sufiks umum ---
    'wifinya': 'wifi', 'colokannya': 'colokan',
    'kopinya': 'kopi', 'makanannya': 'makanan', 'minumannya': 'minuman',
    'harganya': 'harga', 'rasanya': 'rasa', 'suasananya': 'suasana',
    'pelayanannya': 'pelayanan', 'menunya': 'menu',
    'parkiran': 'parkir', 'parkirnya': 'parkir',
    'tempatnya': 'tempat',

    # --- Kata khas yang muncul di dataset & perlu distandarisasi ---
    'temen': 'teman', 'kawan': 'teman',
    'pesen': 'pesan',
    'rame': 'ramai', 'ramee': 'ramai',
    'sepi': 'sepi',
    'bersih': 'bersih',
    'nyaman': 'nyaman',
    'luas': 'luas',
    'sempit': 'sempit',

    # --- Singkatan fasilitas pendek agar aman dari filter panjang karakter ---
    'ac': 'pendingin_ruangan',
    'berac': 'pendingin_ruangan',
}

import json
import os

CACHE_FILE = "stem_cache.json"

def load_stem_cache():
    if os.path.exists(CACHE_FILE):
        try:
            with open(CACHE_FILE, 'r', encoding='utf-8') as f:
                return json.load(f)
        except Exception:
            return {}
    return {}

def save_stem_cache():
    try:
        with open(CACHE_FILE, 'w', encoding='utf-8') as f:
            json.dump(stem_cache, f, ensure_ascii=False, indent=4)
    except Exception as e:
        print("Gagal menyimpan cache:", e)

# Isi cache di awal saat server nyala
stem_cache = load_stem_cache()

def bersihkan_teks(text):
    if not isinstance(text, str):
        return ""

    text = text.lower()
    # Hapus URL
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    # Hapus emoji dan karakter non-ASCII
    text = re.sub(r'[^\x00-\x7F]+', ' ', text)
    # Hapus karakter selain huruf dan spasi
    text = re.sub(r'[^a-z\s]', ' ', text)
    # Hapus multiple spasi
    text = re.sub(r'\s+', ' ', text).strip()

    tokens = word_tokenize(text)

    # Pass 1: Normalisasi kata gaul → baku
    normalized_tokens = [normalization_dict.get(t, t) for t in tokens]

    # Pass 2: Buang stopword SEBELUM stemming (filter awal)
    filtered_tokens = [t for t in normalized_tokens if t not in list_stopwords and len(t) > 2]

    # Pass 3: Stemming dengan cache (Memoization)
    stemmed_tokens = []
    for t in filtered_tokens:
        if t not in stem_cache:
            stem_cache[t] = stemmer.stem(t)
        stemmed_word = stem_cache[t]
        # Pass 4 (KRITIS): Filter ulang setelah stemming
        # Menangkap kata seperti 'tempatnya' yang di-stem jadi 'tempat' (masih stopword)
        if stemmed_word not in list_stopwords and len(stemmed_word) > 2:
            stemmed_tokens.append(stemmed_word)

    return " ".join(stemmed_tokens)