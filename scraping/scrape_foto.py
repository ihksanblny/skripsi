"""
scrape_foto.py
==============
Ambil foto utama setiap kafe dari Google Maps menggunakan Selenium.
Hasil disimpan ke: scraping/foto_kafe.json

Cara pakai:
    cd d:/New Project/skripsi/scraping
    python scrape_foto.py

Output format foto_kafe.json:
    {
        "Nakoa": "https://lh5.googleusercontent.com/...",
        "JOKOPI - Malang": "https://lh5.googleusercontent.com/...",
        ...
    }
"""

import time
import json
import os
import re
from urllib.parse import unquote
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


# ── Konfigurasi ───────────────────────────────────────────────────────────────
URL_FILES = ["urls.txt", "new_urls.txt", "urls_kophan.txt", "urls_missing.txt"]
OUTPUT_FILE = "foto_kafe.json"
WAIT_TIMEOUT = 20
# ─────────────────────────────────────────────────────────────────────────────


def extract_name_from_url(url: str) -> str:
    """Ekstrak nama kafe dari URL Google Maps."""
    m = re.search(r'/maps/place/([^/]+)/', url)
    if m:
        return unquote(m.group(1)).replace('+', ' ')
    return ""


def load_existing(output_file: str) -> dict:
    """Load hasil scraping sebelumnya agar tidak mengulang."""
    if os.path.exists(output_file):
        with open(output_file, 'r', encoding='utf-8') as f:
            return json.load(f)
    return {}


def save_results(output_file: str, data: dict):
    """Simpan hasil ke JSON."""
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"💾 Tersimpan ke {output_file} ({len(data)} kafe)")


def get_photo_url(driver, wait) -> str:
    """
    Coba ambil URL foto utama dari halaman Google Maps.
    Mencoba beberapa strategi secara berurutan.
    """

    # Strategi 1: Cari elemen foto header (gambar besar di bagian atas kafe)
    # Biasanya class 'RZ66Rb' atau 'aoRNLd' atau elemen img di dalam section foto
    strategies = [
        # Tombol "Foto" lalu ambil gambar pertama di galeri
        ('XPATH', '//button[@aria-label and .//img[contains(@src, "googleusercontent")]]'),
        # img langsung dengan src googleusercontent yang besar
        ('XPATH', '//img[contains(@src, "googleusercontent.com") and contains(@src, "=w")]'),
        # img di dalam div foto header
        ('XPATH', '//div[@class="RZ66Rb"]//img'),
        ('XPATH', '//div[contains(@class,"aoRNLd")]//img'),
        # Fallback: semua img dengan src googleusercontent
        ('XPATH', '//img[contains(@src, "googleusercontent")]'),
    ]

    for method, selector in strategies:
        try:
            elements = driver.find_elements(By.XPATH, selector)
            for el in elements:
                src = el.get_attribute('src') or ''
                # Filter: hanya ambil URL foto yang benar (bukan ikon/avatar kecil)
                if 'googleusercontent.com' in src and ('=w' in src or 'photo' in src):
                    # Ubah ke resolusi yang lebih baik
                    # Format: ...=w100-h100-... → ganti jadi =w600-h400-...
                    src_hd = re.sub(r'=w\d+-h\d+', '=w600-h400', src)
                    print(f"   📸 Foto ditemukan via strategi [{selector[:40]}...]")
                    return src_hd
        except Exception:
            continue

    # Strategi terakhir: coba klik tombol foto lalu ambil gambar
    try:
        foto_btn = driver.find_element(By.XPATH, '//button[.//div[contains(@class,"RZ66Rb")]]')
        driver.execute_script("arguments[0].click();", foto_btn)
        time.sleep(2)
        img = wait.until(EC.presence_of_element_located(
            (By.XPATH, '//img[contains(@src, "googleusercontent.com")]')
        ))
        src = img.get_attribute('src') or ''
        if src:
            return re.sub(r'=w\d+-h\d+', '=w600-h400', src)
    except Exception:
        pass

    return ""


# ── Main ──────────────────────────────────────────────────────────────────────

# Kumpulkan semua URL unik dari semua file txt
all_urls: dict[str, str] = {}  # nama → url
for fname in URL_FILES:
    if not os.path.exists(fname):
        print(f"⚠️ File tidak ditemukan: {fname}, skip.")
        continue
    with open(fname, 'r', encoding='utf-8') as f:
        for line in f:
            url = line.strip()
            if not url:
                continue
            name = extract_name_from_url(url)
            if name and name not in all_urls:
                all_urls[name] = url

print(f"📋 Total kafe unik dari semua file: {len(all_urls)}")

# Load hasil sebelumnya (resume support)
results = load_existing(OUTPUT_FILE)
already_done = set(results.keys())
pending = {n: u for n, u in all_urls.items() if n not in already_done}

print(f"✅ Sudah selesai: {len(already_done)} | 🔄 Perlu diproses: {len(pending)}")

if not pending:
    print("🎉 Semua kafe sudah diproses! Cek foto_kafe.json")
    exit()

# Setup Chrome (pakai profil yang sama dengan scraping ulasan)
options = webdriver.ChromeOptions()
options.add_argument("--user-data-dir=C:/chrome-selenium-clean")
options.add_argument("--start-maximized")
options.add_argument("--window-size=1920,1080")
options.add_argument("user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36")

driver = webdriver.Chrome(options=options)
wait = WebDriverWait(driver, WAIT_TIMEOUT)

total = len(pending)
for idx, (name, url) in enumerate(pending.items(), 1):
    print(f"\n🚀 [{idx}/{total}] {name}")

    try:
        driver.get(url)
        time.sleep(3)

        # Tutup modal "Buka di app" jika muncul
        try:
            tetap_web = wait.until(EC.element_to_be_clickable(
                (By.XPATH, '//*[contains(text(), "Tetap gunakan web")]')
            ))
            tetap_web.click()
            time.sleep(1)
            print("   ✅ Modal 'Tetap gunakan web' ditutup")
        except Exception:
            pass

        # Tunggu halaman kafe termuat (h1 nama kafe)
        try:
            wait.until(EC.presence_of_element_located((By.TAG_NAME, "h1")))
            time.sleep(2)
        except Exception:
            print("   ⚠️ h1 tidak ditemukan, coba lanjut...")

        # Ambil foto
        photo_url = get_photo_url(driver, wait)

        if photo_url:
            print(f"   ✅ Foto: {photo_url[:80]}...")
            results[name] = photo_url
        else:
            print(f"   ❌ Tidak berhasil menemukan foto untuk: {name}")
            results[name] = ""  # kosongkan agar tahu sudah dicoba

        # Simpan setiap kafe (agar tidak kehilangan data jika crash)
        save_results(OUTPUT_FILE, results)
        time.sleep(2)

    except Exception as e:
        print(f"   ❌ Error: {e}")
        results[name] = ""
        save_results(OUTPUT_FILE, results)

driver.quit()
print(f"\n🎉 Selesai! {len([v for v in results.values() if v])} foto berhasil dari {len(results)} kafe.")
print(f"📁 Cek hasilnya di: {OUTPUT_FILE}")
