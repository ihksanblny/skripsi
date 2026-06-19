import pandas as pd
import gensim
import gensim.corpora as corpora
from gensim.models import Phrases
from pprint import pprint
from gensim.models.coherencemodel import CoherenceModel
import warnings

# Mengabaikan peringatan Deprecation dari library pihak ketiga
warnings.filterwarnings("ignore", category=DeprecationWarning)

def main():
    print("1. Membaca data reviews_cleaned.csv...")
    try:
        df = pd.read_csv('reviews_cleaned.csv', sep=';')
    except FileNotFoundError:
        print("File reviews_cleaned.csv tidak ditemukan. Tolong jalankan pre-process.py terlebih dahulu.")
        return

    # Buang label teks yang kosong pasca cleaning (jika ada)
    df = df.dropna(subset=['clean_review'])
    
    # Text kita di CSV masih berbentuk string utuh (contoh: "tempat nyaman kerja bagus")
    # Kita harus memecahnya menjadi format Array/List of Words (Token) per baris ulasan untuk diinput ke Gensim
    print("2. Melakukan Tokenisasi (Memecah string ke List)...")
    data_words = [str(review).split() for review in df['clean_review']]

    # ------------------------------
    # PENERAPAN BIGRAMS
    # ------------------------------
    print("3. Mendeteksi dan Menerapkan Bigram...")
    # min_count = Abaikan kata yang berdampingan jika muncul kurang dari x kali di seluruh dataset
    # threshold = Standar tingkat skor kedekatan kata penggabung (semakin kecil, semakin banyak tergabung)
    bigram = Phrases(data_words, min_count=5, threshold=10)
    bigram_mod = gensim.models.phrases.Phraser(bigram)
    
    # Mengaplikasikan deteksi bigram ke dataset
    data_words_bigrams = [bigram_mod[doc] for doc in data_words]

    # ------------------------------
    # PEMBUATAN KAMUS KATA & BAG-OF-WORDS (BoW)
    # ------------------------------
    print("4. Membangun Dictionary dan Bag-of-Words (BoW)...")
    # Dictionary merekap keseluruhan kata valid yang ada
    id2word = corpora.Dictionary(data_words_bigrams)

    # (Opsional) Filter kata-kata ekstrim: 
    # no_below=3 (buang kata yang muncul cuma di < 3 ulasan)
    # no_above=0.8 (buang kata yang muncul di > 80% ulasan karena tidak spesifik membedakan topik)
    id2word.filter_extremes(no_below=3, no_above=0.8)

    # Proses utama pemidahan ke karung (Bag-of-Words) berwujud [ID Kata, Frekuensi]
    corpus = [id2word.doc2bow(text) for text in data_words_bigrams]

    # ------------------------------
    # PEMODELAN LDA
    # ------------------------------
    print("5. Memulai Prosesing Training Model LDA Engine (High Quality Mode)...")
    jumlah_topik = 6 
    
    lda_model = gensim.models.ldamodel.LdaModel(
        corpus=corpus,
        id2word=id2word,
        num_topics=jumlah_topik,
        random_state=100,
        update_every=1,
        chunksize=100,
        passes=50,          # Ditingkatkan agar mesin belajar lebih mendalam (Akurasi lebih tinggi)
        iterations=100,     # Memastikan konvergensi yang lebih stabil
        alpha='auto',
        per_word_topics=True
    )

    # MENGHITUNG SKOR KEAKURATAN (COHERENCE SCORE)
    coherence_model_lda = CoherenceModel(model=lda_model, texts=data_words_bigrams, dictionary=id2word, coherence='c_v')
    coherence_lda = coherence_model_lda.get_coherence()

    print("\n===============================")
    print(f"HASIL PEMODELAN LDA (Optimal K={jumlah_topik}):")
    print(f"Final Coherence Score: {coherence_lda:.4f} (Makin mendekati 1.0 makin akurat)")
    print("===============================\n")

    # ------------------------------
    # ANALISIS TOPIK DOMINAN PER ULASAN
    # ------------------------------
    print("6. Menganalisis Topik Dominan pada setiap ulasan...")

    def get_dominant_topic(ldamodel, corpus, texts):
        # Init dataframe
        topics_df = pd.DataFrame()

        # Dapatkan topik utama di setiap dokumen ulasan
        for i, row in enumerate(ldamodel[corpus]):
            # Penanganan struktur output ldamodel[corpus]
            # lda_model[corpus] mengembalikan list [(topic_id, prob), ...]
            row = row[0] if ldamodel.per_word_topics else row            
            row = sorted(row, key=lambda x: (x[1]), reverse=True)
            
            # Ambil Topik Dominan, Persentase Kontribusi, dan Kata Kunci
            for j, (topic_num, prop_topic) in enumerate(row):
                if j == 0:  # Dominant topic
                    wp = ldamodel.show_topic(topic_num)
                    topic_keywords = ", ".join([word for word, prop in wp])
                    # Gunakan pd.concat untuk efisiensi
                    new_row = pd.DataFrame([[int(topic_num), round(prop_topic,4), topic_keywords]], 
                                            columns=['Topik_Dominan', 'Persentase_Kontribusi', 'Kata_Kunci_Topik'])
                    topics_df = pd.concat([topics_df, new_row], ignore_index=True)
                else:
                    break
        
        # Gabungkan hasil dengan teks asli (data_words_bigrams) yang sudah berbentuk string
        texts_joined = [" ".join(doc) for doc in texts]
        res = pd.concat([topics_df, pd.Series(texts_joined, name='Teks_Pembersihan')], axis=1)
        return res

    # Jalankan Fungsi Analisis
    df_dominant_topic = get_dominant_topic(ldamodel=lda_model, corpus=corpus, texts=data_words_bigrams)

    # Tambahkan Nama Kafe dan ulasan asli dari dataframe awal
    df_dominant_topic['Nama_Kafe'] = df['shop_name'].values
    
    # Simpan ke CSV untuk bahan lampiran Skripsi (Gunakan pemisah titik koma agar rapi di Excel)
    df_dominant_topic.to_csv('ulasan_dengan_topik.csv', index=False, sep=';')
    print("-> Analisis ulasan per-topik berhasil disimpan ke 'ulasan_dengan_topik.csv'")

    # TAMPILKAN RINGKASAN STATISTIK GLOBAL (Untuk di-copy ke Bab 4)
    print("\n===============================")
    print("STATISTIK DISTRIBUSI TOPIK (Untuk Bab 4):")
    print("===============================")
    topic_counts = df_dominant_topic['Topik_Dominan'].value_counts().sort_index()
    topic_pcts = (topic_counts / len(df_dominant_topic) * 100).round(2)
    
    for i in range(jumlah_topik):
        count = topic_counts.get(i, 0)
        pct = topic_pcts.get(i, 0)
        print(f"Topik {i}: {count} ulasan ({pct}%)")
    print("===============================\n")
    
    # Save the output cleanly to a txt file
    with open("hasil_topik.txt", "w", encoding="utf-8") as f:
        f.write(f"Final Coherence Score: {coherence_lda:.4f}\n\n")
        topics = lda_model.print_topics(num_words=10)
        for topic in topics:
            f.write(f"Topik {topic[0]}:\n{topic[1]}\n\n")

    # MENYIMPAN MODEL ("OTAK") UNTUK SISTEM REKOMENDASI NANTI
    id2word.save("model_lda/dictionary.gensim")
    bigram_mod.save("model_lda/bigram_model.gensim")
    lda_model.save("model_lda/lda_model.gensim")

    print("\nProses Modeling LDA Selesai! Statistik tersimpan di ulasan_dengan_topik.csv")
    print("Model telah berhasil disave di folder 'model_lda/'")

if __name__ == '__main__':
    main()
