import os
import json
import math
import statistics
import gensim
from gensim.models import Phrases
from gensim.models.coherencemodel import CoherenceModel
from gensim.models.phrases import Phraser
import gensim.corpora as corpora
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from ..core.constants import LDA_STOPWORDS
from ..services.nlp_service import bersihkan_teks

# ==========================================
# FUNGSI HELPER: Mendapatkan path lokasi model
# ==========================================
def get_model_path():
    # Mencari tahu folder tempat file ini berada, lalu mundur 1 folder ke belakang,
    # dan mencari folder 'saved_models'. Ini untuk tempat menyimpan model LDA secara fisik.
    _current_dir = os.path.dirname(os.path.abspath(__file__))
    _project_dir = os.path.dirname(os.path.dirname(_current_dir))
    save_dir = os.path.join(_project_dir, "saved_models")
    return os.path.join(save_dir, "model")

def train_lda_model(db_reviews, num_topics: int, iterations: int):
    """Fungsi ini dipanggil oleh Admin untuk melatih ulang (training) model Machine Learning LDA"""
    
    # 1. Tokenisasi (Memecah kalimat jadi kata) dan Filter Stopwords
    data_words = []
    for r in db_reviews:
        # Menghapus kata yang kurang dari 2 huruf (seperti 'yg', 'di') atau kata stopwords khusus LDA
        tokens = [
            w for w in str(r.clean_review).split()
            if w not in LDA_STOPWORDS and len(w) > 2
        ]
        data_words.append(tokens)

    # 2. Proses Bigram (Menyatukan kata yang sering berdampingan)
    # Contoh: 'nasi' dan 'goreng' sering muncul bareng, disatukan jadi 'nasi_goreng'
    bigram = Phrases(data_words, min_count=3, threshold=8)
    bigram_mod = Phraser(bigram)
    data_ready = [bigram_mod[doc] for doc in data_words]

    # 3. Bangun Kamus (Dictionary) dan Korpus (BoW)
    id2word = corpora.Dictionary(data_ready) # Mendaftar semua kata unik ke dalam kamus (ID = Kata)
    
    # Membuang kata yang jarang muncul (< 3 dokumen) atau terlalu sering muncul (> 85% dokumen)
    # Kata yang muncul di lebih dari 85% dokumen biasanya tidak unik untuk menentukan topik.
    id2word.filter_extremes(no_below=3, no_above=0.85)
    
    # PROSES BAG-OF-WORDS (BoW) - Menerjemahkan kalimat teks menjadi array [ID Kata, Frekuensi]
    corpus = [id2word.doc2bow(text) for text in data_ready]

    if not corpus:
        return {"error": "Corpus kosong. Coba tambahkan data."}

    # 4. Training Model LDA Menggunakan Gensim
    lda_model = gensim.models.ldamodel.LdaModel(
        corpus=corpus,
        id2word=id2word,
        num_topics=num_topics, # Jumlah topik yang ingin dicari (K)
        random_state=42,       # Seed agar hasilnya konsisten saat dilatih ulang
        update_every=1,
        chunksize=100,
        passes=100,            # Epoch / jumlah putaran mesin membaca data ulang
        iterations=iterations, # Jumlah iterasi maksimal di setiap dokumen
        alpha='auto',         
        eta='auto',
        per_word_topics=True
    )

    # 5. Menghitung Evaluasi Kualitas Model dengan Coherence Score (C_V)
    # Semakin tinggi nilainya (mendekati 1), semakin baik dan logis kelompok topik tersebut.
    coherence_model = CoherenceModel(model=lda_model, texts=data_ready, dictionary=id2word, coherence='c_v')
    coherence_val = round(coherence_model.get_coherence(), 4)

    # 6. Pemberian Label (Nama) Topik Secara Otomatis Berdasarkan Keyword Terkuat
    kategori_pool = [
        {"label": "Kualitas Rasa & Produk", "words": ["nikmat", "rasa", "enak", "pahit", "kopi"]},
        {"label": "Fasilitas & Kenyamanan", "words": ["wifi", "colok", "colokan", "ac", "nyaman", "toilet"]},
        {"label": "Pelayanan & Akses", "words": ["ramah", "layan", "cepat", "barista", "kasir", "parkir"]},
        {"label": "Harga & Nilai", "words": ["murah", "mahal", "harga", "terjangkau", "promo"]},
        {"label": "Suasana & Konsep", "words": ["suasana", "estetik", "ambience", "tenang", "nugas", "nongkrong"]},
    ]

    hasil_topik = []
    # Mencari tau setiap topik yang ditemukan mesin itu cocoknya dikasih nama apa
    for i in range(num_topics):
        wp = lda_model.show_topic(i, topn=20) # Ambil 20 kata paling berpengaruh di topik ini
        top_words = [word for word, prop in wp]
        
        matched_label = "Topik General"
        max_score = 0
        for cat in kategori_pool:
            score = 0
            for idx, w in enumerate(top_words):
                if w in cat["words"]:
                    # Kata di urutan awal (top 10) punya poin penentu nama label lebih besar
                    weight = 25 - idx if idx < 10 else 5
                    score += weight
            
            if score > max_score:
                max_score = score
                matched_label = cat["label"]

        hasil_topik.append({
            "id": i + 1,
            "label": matched_label,
            "words": ", ".join(top_words[:10])
        })

    # 7. Simpan file model (.gensim) agar nanti saat user cari kafe, kita tidak perlu melatih ulang
    model_path = get_model_path()
    os.makedirs(model_path, exist_ok=True)

    lda_model.save(os.path.join(model_path, "lda_model.gensim"))
    id2word.save(os.path.join(model_path, "dictionary.gensim"))
    bigram_mod.save(os.path.join(model_path, "bigram.gensim"))
    
    with open(os.path.join(model_path, "model_info.json"), "w") as f:
        json.dump({
            "num_topics": num_topics,
            "coherence_score": coherence_val,
            "status": "ready",
            "hasil_topik": hasil_topik
        }, f)

    return {
        "status": "Selesai",
        "jumlah_topik": num_topics,
        "coherence_score": coherence_val,
        "hasil_topik": hasil_topik,
        "saved": True
    }


def get_lda_distribution_data(db_reviews):
    """Mengambil dan memetakan persebaran topik di tiap kafe (digunakan oleh diagram dashboard)"""
    model_path = get_model_path()
    model_info_path = os.path.join(model_path, "model_info.json")
    
    if not os.path.exists(model_info_path):
        return {"error": "Model LDA belum dilatih! Silakan masuk ke menu Pemodelan Topik terlebih dahulu."}
        
    try:
        with open(model_info_path, "r") as f:
            info = json.load(f)
    except Exception as e:
        return {"error": f"Gagal membaca info model: {str(e)}"}
        
    # MUAT KEMBALI MODEL YANG SUDAH DILATIH OLEH ADMIN
    lda_model_file = os.path.join(model_path, "lda_model.gensim")
    dictionary_file = os.path.join(model_path, "dictionary.gensim")
    bigram_file = os.path.join(model_path, "bigram.gensim")
    
    try:
        lda_model = gensim.models.ldamodel.LdaModel.load(lda_model_file)
        id2word = gensim.corpora.Dictionary.load(dictionary_file)
        bigram_mod = Phraser.load(bigram_file)
    except Exception as e:
        return {"error": f"Gagal memuat model LDA: {str(e)}"}
        
    actual_num_topics = info.get("num_topics", 5)
    hasil_topik = info.get("hasil_topik", [])
        
    # Mengumpulkan semua ulasan per masing-masing nama kafe
    shops_data = {}
    for r in db_reviews:
        if r.nama_tempat not in shops_data:
            shops_data[r.nama_tempat] = []
        shops_data[r.nama_tempat].append(r.clean_review)
        
    distribution_list = []
    shop_id_counter = 1
    
    for shop, reviews in shops_data.items():
        all_text = " ".join(reviews)
        tokens = [w for w in all_text.split() if w not in LDA_STOPWORDS and len(w) > 2]
        doc_ready = bigram_mod[tokens]
        
        # PROSES BAG OF WORDS UNTUK MENGETAHUI PROPORSINYA
        doc_bow = id2word.doc2bow(doc_ready)
        
        # Minta mesin menebak kafe ini mengandung topik nomor berapa saja dan berapa besar peluangnya
        topic_probs = lda_model.get_document_topics(doc_bow, minimum_probability=0.0)
        
        scores = {}
        for topic_id, prob in topic_probs:
            # Contoh hasil: T1 = 0.4000 (Berarti 40% membahas Topik 1)
            scores[f"T{topic_id + 1}"] = round(float(prob), 4)
            
        distribution_list.append({
            "id": shop_id_counter,
            "shop": shop,
            "scores": scores
        })
        shop_id_counter += 1
        
    return {
        "num_topics": actual_num_topics,
        "hasil_topik": hasil_topik,
        "distribution": distribution_list
    }


def get_hybrid_recommendation_data(db_reviews, query: str, top_n: int):
    """Ini adalah jantung utama sistem pencarian / rekomendasi kafe (Hybrid System)"""
    model_path = get_model_path()
    model_info_path = os.path.join(model_path, "model_info.json")
    
    if not os.path.exists(model_info_path):
        return {"error": "Model LDA belum dilatih!"}
        
    with open(model_info_path, "r") as f:
        info = json.load(f)
        
    try:
        lda_model = gensim.models.ldamodel.LdaModel.load(os.path.join(model_path, "lda_model.gensim"))
        id2word = gensim.corpora.Dictionary.load(os.path.join(model_path, "dictionary.gensim"))
        bigram_mod = Phraser.load(os.path.join(model_path, "bigram.gensim"))
    except Exception as e:
        return {"error": f"Gagal memuat model: {str(e)}"}
        
    num_topics = info.get("num_topics", 5)
    hasil_topik = info.get("hasil_topik", [])
    
    # 1. BERSAMAAN: Membersihkan dan mengubah Kalimat User (Query) jadi vektor Bag of Words
    clean_q = bersihkan_teks(query)
    query_tokens = [w for w in clean_q.split() if w not in LDA_STOPWORDS and len(w) > 2]
    
    query_ready = bigram_mod[query_tokens]
    query_bow = id2word.doc2bow(query_ready)
    
    # 2. EKSTRAKSI MAKNANNYA (Mencari tahu User ini maksudnya nyari topik nomor berapa)
    query_vector = [0.0] * num_topics
    matched_terms = 0
    
    for token in query_ready:
        if token in id2word.token2id:
            term_id = id2word.token2id[token]
            # Mengetahui kata ini (misal: "wifi") condong ke topik nomor berapa di dalam model LDA
            term_topics = lda_model.get_term_topics(term_id, minimum_probability=0.0)
            
            raw_probs = [(tid, float(prob)) for tid, prob in term_topics if tid < num_topics]
            total_prob = sum(prob for _, prob in raw_probs)
            
            # Mendistribusikan poin topik tersebut berdasarkan bobot katanya
            if total_prob > 0:
                for topic_id, prob in raw_probs:
                    query_vector[topic_id] += prob / total_prob 
                matched_terms += 1
    
    if matched_terms > 0:
        total_qv = sum(query_vector)
        if total_qv > 0:
            query_vector = [v / total_qv for v in query_vector]
    else:
        # Cadangan kalau cara pembobotan kata per kata gagal
        query_topic_probs = lda_model.get_document_topics(query_bow, minimum_probability=0.0)
        for topic_id, prob in query_topic_probs:
            if topic_id < num_topics:
                query_vector[topic_id] = float(prob)
            
    # 3. Kumpulkan data kafe
    shops_data = {}
    for r in db_reviews:
        if r.nama_tempat not in shops_data:
            shops_data[r.nama_tempat] = []
        shops_data[r.nama_tempat].append(r.clean_review)

    # 4. MENGUBAH SETIAP KAFE MENJADI VEKTOR TOPIK
    all_shop_vectors = {}
    for shop, reviews in shops_data.items():
        all_text = " ".join(reviews)
        shop_tokens = [w for w in all_text.split() if w not in LDA_STOPWORDS and len(w) > 2]
        shop_ready = bigram_mod[shop_tokens]
        shop_bow = id2word.doc2bow(shop_ready)
        
        # Minta model LDA untuk mengeluarkan angka kecenderungan topik kafe ini
        shop_topic_probs = lda_model.get_document_topics(shop_bow, minimum_probability=0.0)
        
        shop_vector = [0.0] * num_topics
        for topic_id, prob in shop_topic_probs:
            if topic_id < num_topics:
                shop_vector[topic_id] = float(prob)
        all_shop_vectors[shop] = shop_vector

    # 5. MENGHITUNG PENALTY (IDF WEIGHTING UNTUK TOPIK)
    # Konsep: Topik yang sering dipunyai oleh semua kafe (misal topik rasa kopi), nilainya akan diturunkan.
    # Topik yang langka (misal khusus colokan/wifi), nilainya akan dilipatgandakan (dihargai tinggi)
    topic_weights = []
    for t in range(num_topics):
        topic_vals = [sv[t] for sv in all_shop_vectors.values()]
        # Menggunakan Standard Deviation (stddev) sebagai proksi/pengganti IDF
        std_val = statistics.stdev(topic_vals) if len(topic_vals) > 1 else 0.0
        topic_weights.append(std_val)

    # Normalisasi nilai pembobotannya
    total_w = sum(topic_weights)
    if total_w > 0:
        topic_weights = [w / total_w * num_topics for w in topic_weights]
    else:
        topic_weights = [1.0] * num_topics

    # 6. TF-IDF BOOST (Menutupi kelemahan LDA)
    # LDA itu pintar menebak MAKNA. Tapi LDA payah mencari KATA SPESIFIK (Misal user ngetik "matcha").
    # TF-IDF adalah algoritma murni pencarian kemiripan string/kata eksak.
    shops_corpus = []
    shop_names_ordered = []
    for s_name, s_revs in shops_data.items():
        shops_corpus.append(" ".join(s_revs))
        shop_names_ordered.append(s_name)

    # Scikit-Learn mengubah kalimat menjadi kumpulan Matrix Angka TF-IDF
    tfidf_vectorizer = TfidfVectorizer(token_pattern=r"(?u)\b\w+\b")
    tfidf_matrix = tfidf_vectorizer.fit_transform(shops_corpus)

    query_text = " ".join(query_ready)
    query_tfidf = tfidf_vectorizer.transform([query_text])

    # Mencocokkan kemiripan tulisan menggunakan Cosine Similarity dari library sklearn
    tfidf_similarities = cosine_similarity(query_tfidf, tfidf_matrix)[0]
    
    shop_tfidf_scores = {}
    for idx, s_name in enumerate(shop_names_ordered):
        # Kita hanya pakai 35% hasil kemiripan kata TF-IDF, agar LDA tetap lebih dominan (Makna Kontekstual)
        shop_tfidf_scores[s_name] = float(tfidf_similarities[idx]) * 0.35

    # 7. RUMUS UTAMA: IDF-WEIGHTED COSINE SIMILARITY (Skripsi Inti)
    # Rumus matematika untuk mengukur kemiripan antara Kebutuhan User (Query) dan Penawaran Kafe
    # menggunakan Cosine Similarity yang dimodifikasi dengan mengalikan bobot IDF tadi.
    def idf_weighted_cosine(query_vec, shop_vec, weights):
        # A_i * B_i * W_i
        dot = sum(weights[t] * query_vec[t] * shop_vec[t] for t in range(len(query_vec)))
        # Panjang Vektor A
        norm_q = math.sqrt(sum((weights[t] * query_vec[t]) ** 2 for t in range(len(query_vec))))
        # Panjang Vektor B
        norm_s = math.sqrt(sum((weights[t] * shop_vec[t]) ** 2 for t in range(len(shop_vec))))
        
        if norm_q == 0 or norm_s == 0:
            return 0.0
        return dot / (norm_q * norm_s)

    # 8. PENGGABUNGAN AKHIR (HYBRID) = Makna LDA + Pencocokan Eksak TF-IDF
    recommendations_list = []
    for shop, shop_vector in all_shop_vectors.items():
        lda_score = idf_weighted_cosine(query_vector, shop_vector, topic_weights)
        keyword_boost = shop_tfidf_scores.get(shop, 0.0)
        
        hybrid_score = lda_score + keyword_boost
        
        recommendations_list.append({
            "shop": shop,
            "_raw_score": hybrid_score,
            "similarity": hybrid_score,
            "scores": {f"T{i+1}": val for i, val in enumerate(shop_vector)}
        })

    # Urutkan pemenang dari nilai / akurasi tertinggi ke terendah
    recommendations_list.sort(key=lambda x: x["_raw_score"], reverse=True)

    for r in recommendations_list:
        r["similarity"] = round(r["_raw_score"], 4)
        del r["_raw_score"]

    return {
        "query": query,
        "clean_query": " ".join(query_ready),
        "query_distribution": {f"T{i+1}": val for i, val in enumerate(query_vector)},
        "hasil_topik": hasil_topik,
        "recommendations": recommendations_list[:top_n]
    }
