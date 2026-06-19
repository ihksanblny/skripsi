import os
import re
import math
import statistics
import pymysql
import pandas as pd
import gensim
from gensim.models.phrases import Phraser
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory

num_topics = 6
model_path = os.path.join("saved_models", "model")
lda_model = gensim.models.ldamodel.LdaModel.load(os.path.join(model_path, "lda_model.gensim"))
id2word = gensim.corpora.Dictionary.load(os.path.join(model_path, "dictionary.gensim"))
bigram_model = Phraser.load(os.path.join(model_path, "bigram.gensim"))

lda_stopwords = set([
    "tidak", "juga", "sama", "semua", "mau", "mungkin", "selalu", "hanya",
    "masih", "sudah", "salah", "satu", "agak", "terlalu",
    "masuk", "sesuai", "sekali", "langsung", "waktu", "hari",
    "datang", "kesini", "disini", "kali", "kita", "lagi", "lain",
    "sayang", "pakai", "pokok", "leseh", "lupa", "liat",
    "habis", "ambil", "hehe", "ngerjain", "unjung",
    "bikin", "kasih", "kira", "minta", "udah", "belom",
    "yaa", "moga", "emang", "kotask", "ken", "dar", "asa", "langgan",
    "bingung", "ambiencenya", "keras", "working", "minus", "gede", "temu",
    "cafe", "kafe", "coffee", "kopi", "kedai", "tempat", "coffeeshop",
    "malang", "kota", "jalan", "lokasi",
    "amstirdam", "dialoogi", "kantja", "nakoa", "jokopi", "muraco",
    "roketto", "semusim", "labore", "suaco", "sarijan", "pesenkopi",
    "golden", "heritage", "koffie", "kophan", "calf", "hindia",
    "kalmcoffee", "grove", "tuku", "kaf", "aadk",
    "suhat", "soehat", "soekarno", "hatta", "tlogomas", "betek", "merjo",
    "and", "the", "for", "with", "you", "this", "that", "place", "space"
])

connection = pymysql.connect(host='localhost', user='root', password='', database='skripsi_db')
db_reviews = pd.read_sql("SELECT nama_tempat, clean_review FROM reviews WHERE clean_review != ''", connection)
connection.close()

shops_data = {}
for _, row in db_reviews.iterrows():
    shop = row['nama_tempat']
    if shop not in shops_data: shops_data[shop] = []
    shops_data[shop].append(row['clean_review'])

all_shop_vectors = {}
for shop, reviews in shops_data.items():
    all_text = " ".join(reviews)
    shop_tokens = [w for w in all_text.split() if w not in lda_stopwords and len(w) > 2]
    shop_ready = bigram_model[shop_tokens]
    shop_bow = id2word.doc2bow(shop_ready)
    shop_topic_probs = lda_model.get_document_topics(shop_bow, minimum_probability=0.0)
    shop_vector = [0.0] * num_topics
    for topic_id, prob in shop_topic_probs:
        if topic_id < num_topics:
            shop_vector[topic_id] = float(prob)
    all_shop_vectors[shop] = shop_vector

topic_weights = []
for t in range(num_topics):
    topic_vals = [sv[t] for sv in all_shop_vectors.values()]
    std_val = statistics.stdev(topic_vals) if len(topic_vals) > 1 else 0.0
    topic_weights.append(std_val)
total_w = sum(topic_weights)
topic_weights = [w / total_w * num_topics for w in topic_weights] if total_w > 0 else [1.0] * num_topics

shops_corpus = []
shop_names_ordered = []
for s_name, s_revs in shops_data.items():
    shops_corpus.append(" ".join(s_revs))
    shop_names_ordered.append(s_name)

tfidf_vectorizer = TfidfVectorizer(token_pattern=r"(?u)\b\w+\b")
tfidf_matrix = tfidf_vectorizer.fit_transform(shops_corpus)

factory = StemmerFactory()
stemmer = factory.create_stemmer()

def preprocess_query(text):
    text = text.lower()
    text = re.sub(r'[^a-z\s]', ' ', text)
    text = re.sub(r'\s+', ' ', text).strip()
    tokens = text.split()
    tokens = [stemmer.stem(w) for w in tokens]
    bigram_tokens = bigram_model[tokens]
    return [w for w in bigram_tokens if w not in lda_stopwords and len(w) > 2]

def idf_weighted_cosine(query_vec, shop_vec, weights):
    dot = sum(weights[t] * query_vec[t] * shop_vec[t] for t in range(len(query_vec)))
    norm_q = math.sqrt(sum((weights[t] * query_vec[t]) ** 2 for t in range(len(query_vec))))
    norm_s = math.sqrt(sum((weights[t] * shop_vec[t]) ** 2 for t in range(len(shop_vec))))
    if norm_q == 0 or norm_s == 0: return 0.0
    return dot / (norm_q * norm_s)

scenarios = [
    "cafe dengan konsep unik, tempat strategis, dan menu manis",
    "coffeeshop dengan menu makan berat dan snack yang variatif",
    "tempat nongkrong dengan ambience bagus dan suasana nyaman",
    "cafe dengan wifi kenceng dan fasilitas lengkap untuk keluarga",
    "coffeeshop nyaman untuk kerja dan mengerjakan tugas"
]

TOPIC_NAMES = {
    0: "T1: Suasana Kafe & Kualitas Penyajian",
    1: "T2: Konsep Keunikan & Menu Minuman",
    2: "T3: Fasilitas Kerja (WFC) & Kenyamanan Tempat",
    3: "T4: Fasilitas Pendukung & Area Berkumpul",
    4: "T5: Daya Tarik Ambience & Menu Dessert",
    5: "T6: Sistem Pemesanan & Menu Makanan Berat"
}

for i, query in enumerate(scenarios):
    print(f"Skenario {i+1}: {query}")
    query_ready = preprocess_query(query)
    query_vector = [0.0] * num_topics
    matched_terms = 0
    for token in query_ready:
        if token in id2word.token2id:
            term_id = id2word.token2id[token]
            term_topics = lda_model.get_term_topics(term_id, minimum_probability=0.0)
            raw_probs = [(tid, float(prob)) for tid, prob in term_topics if tid < num_topics]
            total_prob = sum(prob for _, prob in raw_probs)
            if total_prob > 0:
                for topic_id, prob in raw_probs:
                    query_vector[topic_id] += prob / total_prob
                matched_terms += 1
                
    if matched_terms > 0:
        total_qv = sum(query_vector)
        if total_qv > 0: query_vector = [v / total_qv for v in query_vector]
    else:
        query_bow = id2word.doc2bow(query_ready)
        query_topic_probs = lda_model.get_document_topics(query_bow, minimum_probability=0.0)
        for topic_id, prob in query_topic_probs:
            if topic_id < num_topics: query_vector[topic_id] = float(prob)
            
    dominant_topic_id = max(enumerate(query_vector), key=lambda x: x[1])[0]
    dominant_prob = query_vector[dominant_topic_id]
    
    query_text = " ".join(query_ready)
    query_tfidf = tfidf_vectorizer.transform([query_text])
    tfidf_similarities = cosine_similarity(query_tfidf, tfidf_matrix)[0]
    
    results = []
    for idx, s_name in enumerate(shop_names_ordered):
        shop_vector = all_shop_vectors[s_name]
        lda_score = idf_weighted_cosine(query_vector, shop_vector, topic_weights)
        keyword_boost = float(tfidf_similarities[idx]) * 0.35
        hybrid_score = lda_score + keyword_boost
        
        results.append({
            'name': s_name,
            'lda_score': lda_score,
            'keyword_boost': keyword_boost,
            'hybrid_score': hybrid_score
        })
    results = sorted(results, key=lambda x: x['hybrid_score'], reverse=True)
    
    print(f"Topik Dominan: {TOPIC_NAMES[dominant_topic_id]} ({dominant_prob*100:.2f}%)")
    for r in results[:5]:
        print(f"| {r['name']} | {r['lda_score']:.4f} | {r['keyword_boost']:.4f} | {r['hybrid_score']:.4f} |")
    print("-----")
