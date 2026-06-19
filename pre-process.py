import pandas as pd
import re
from Sastrawi.Stemmer.StemmerFactory import StemmerFactory
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize

# Download NLTK resources
try:
    nltk.data.find('corpora/stopwords')
    nltk.data.find('tokenizers/punkt_tab')
except LookupError:
    nltk.download('stopwords')
    nltk.download('punkt')
    nltk.download('punkt_tab') # Punkt-tab perlu didownload untuk NLTK v3.8+

# Inisialisasi Stemmer & Stopwords Indonesia
stemmer = StemmerFactory().create_stemmer()
# Daftar kata negasi yang HARUS dijaga (jangan dihapus)
negation_words = ['tidak', 'kurang', 'belum', 'bukan', 'jangan', 'gak', 'ga', 'nggak', 'ndak', 'tdk']

list_stopwords = stopwords.words('indonesian')
# Filter stopword bawaan NLTK agar tidak menghapus kata negasi
list_stopwords = [word for word in list_stopwords if word not in negation_words]

# Tambahkan stopword kustom (kata yang tidak penting untuk LDA di kasus restoran/kopi)
custom_stopwords = [
    'yg', 'nya', 'aja', 'sih', 'yang', 'dan', 'di', 'ke', 'dari', 'ini', 'itu',
    'buat', 'kalo', 'kalau', 'untuk', 'dengan', 'ada', 'pada', 'juga', 'dalam',
    'bisa', 'ya', 'udah', 'sudah', 'banget', 'sangat',
    'tempat', 'cafe', 'kafe', 'coffee', 'shop', 'kopi', 'malang', 'kota', 'sini',
    'sana', 'itu', 'deh', 'dong', 'kan', 'lah', 'kok', 'pun', 'paling', 'baru',
    'sana', 'mah', 'overall', 'ok', 'oke', 'pas', 'kayak', 'karena', 'kalau',
    'cuma', 'cuman', 'tapi', 'biar', 'atau', 'jadi', 'kalau'
]

list_stopwords.extend([word for word in custom_stopwords if word not in negation_words])

# Dictionary untuk Normalization (Kata Alay/Singkatan -> Baku)
# Analisis langsung dari reviews_new.csv:
normalization_dict = {
    # Variasi Sangat/Banget
    'bgt': 'banget', 'bgtt': 'banget', 'bangett': 'banget', 'pol': 'banget', 'poll': 'banget', 'pwol': 'banget',
    # Variasi Singkatan Umum
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
    'sgt': 'sangat',
    'pdhl': 'padahal',
    'blm': 'belum', 'belom': 'belum',
    'kuy': 'ayo',
    # Variasi Negasi
    'gak': 'tidak', 'nggak': 'tidak', 'ga': 'tidak', 'g': 'tidak', 'ndak': 'tidak', 'ngga': 'tidak',
    # Variasi Kata Sifat & Serapan
    'enak': 'nikmat', 'enakk': 'nikmat', 'uenak': 'nikmat', 'enakny': 'nikmat',
    'cozy': 'nyaman', 'comfy': 'nyaman', 'pw': 'nyaman', 'pewe': 'nyaman',
    'worth it': 'layak', 'worthit': 'layak', 'worth': 'layak',
    'gpp': 'tidak apa', 'gapapa': 'tidak apa', 
    'estetik': 'indah', 'aesthetic': 'indah', 'asthetic': 'indah',
    'recommended': 'rekomendasi', 'rekomen': 'rekomendasi', 'rekomendid': 'rekomendasi', 'recomend': 'rekomendasi',
    'pricey': 'mahal', 'pricy': 'mahal',
    'cpt': 'cepat', 'cepet': 'cepat',
    'lbh': 'lebih',
    'good': 'bagus', 'best': 'terbaik', 'nice': 'bagus',
    # Istilah Anak Muda / Kafe
    'wfc': 'kerja', 'wfh': 'kerja', 'wfa': 'kerja',
    'nugas': 'tugas', 'skripsi': 'tugas', 'skripsian': 'tugas',
    'nongki': 'nongkrong', 'nongkrong': 'kumpul',
    'wifinya': 'wifi', 'colokannya': 'colokan'
}

def clean_text(text):
    if not isinstance(text, str):
        return ""
    
    # 1. Case Folding
    text = text.lower()
    
    # 2. Text Cleaning (Hapus angka, simbol, URL, dsb)
    # Hapus URL
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    # Hapus karakter non-alfabet (simbol & angka)
    text = re.sub(r'[^a-zA-Z\s]', ' ', text)
    # Hapus whitespace berlebih
    text = re.sub(r'\s+', ' ', text).strip()
    
    # 3. Tokenization
    tokens = word_tokenize(text)
    
    # 4. Normalization
    normalized_tokens = [normalization_dict.get(t, t) for t in tokens]
    
    # 5. Stopword Removal
    clean_tokens = [t for t in normalized_tokens if t not in list_stopwords and len(t) > 2]
    
    # 6. Stemming (Sastrawi)
    # Digabung dengan spasi dulu karena Sastrawi butuh bentuk kalimat utuh
    text_to_stem = " ".join(clean_tokens)
    stemmed_text = stemmer.stem(text_to_stem)
    
    return stemmed_text

if __name__ == "__main__":
    print("Membaca data reviews_new.csv...")
    # csv kita menggunakan titik koma (;) sebagai pemisah, bukan koma
    df = pd.read_csv('./scraping/reviews_new.csv', sep=';')
    
    print(f"Data awal: {len(df)} baris")
    # Buang data yg kopong/None
    df.dropna(subset=['review_text'], inplace=True)
    
    print("Memulai proses cleaning (Proses Sastrawi Stemming mungkin akan memakan waktu cukup lama)...")
    # Apply fungsi
    df['clean_review'] = df['review_text'].apply(clean_text)
    
    # Buang data yang setelah dicombine dan cleaning malah jadi kosong
    df = df[df['clean_review'].str.strip() != ""]
    
    # Output file
    output_name = 'reviews_cleaned.csv'
    df.to_csv(output_name, index=False)
    print(f"Selesai! Data bersih berjumlah {len(df)} baris disimpan ke {output_name}")