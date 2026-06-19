# ==========================================
# FILE: constants.py
# FUNGSI: Menyimpan variabel statis (teks panjang, daftar stopword)
# agar tidak memenuhi logika utama di file lain.
# ==========================================

# Kumpulan kata yang akan diabaikan (dibuang) saat proses LDA Topic Modeling
# Kita definisikan di sini SATU KALI SAJA agar mudah di-maintenance jika ingin mengubah/menambah kata.
LDA_STOPWORDS = set([
    # Partikel & kata fungsional
    "tidak", "juga", "sama", "semua", "mau", "mungkin", "selalu", "hanya",
    "masih", "sudah", "salah", "satu", "agak", "terlalu",
    "masuk", "sesuai", "sekali", "langsung", "waktu", "hari",
    "datang", "kesini", "disini", "kali", "kita", "lagi", "lain",

    # Seru & noise murni (tidak ada makna aspek coffeeshop)
    "sayang", "pakai", "pokok", "leseh", "lupa", "liat",
    "habis", "ambil", "hehe", "ngerjain", "unjung",
    "bikin", "kasih", "kira", "minta", "udah", "belom",
    "yaa", "moga", "emang", "kotask", "ken", "dar", "asa", "langgan",
    # Noise dari screenshot terbaru (confirmed):
    "bingung", "ambiencenya", "keras", "working", "minus", "gede", "temu",

    # Kata kafe/lokasi (domain tag, bukan aspek)
    "cafe", "kafe", "coffee", "kopi", "kedai", "tempat", "coffeeshop",
    "malang", "kota", "jalan", "lokasi",

    # Nama kafe spesifik
    "amstirdam", "dialoogi", "kantja", "nakoa", "jokopi", "muraco",
    "roketto", "semusim", "labore", "suaco", "sarijan", "pesenkopi",
    "golden", "heritage", "koffie", "kophan", "calf", "hindia",
    "kalmcoffee", "grove", "tuku", "kaf", "aadk",
    "suhat", "soehat", "soekarno", "hatta", "tlogomas", "betek", "merjo",

    # Bahasa Inggris non-bermakna
    "and", "the", "for", "with", "you", "this", "that", "place", "space",
    "very", "its", "but", "not", "wfc", "wfh", "food", "drink", "non",
])

# Mapping nama kafe → URL Google Maps asli
# Disimpan di sini agar router tidak penuh dengan teks URL yang panjang.
GMAPS_LINKS = {
    "Ada Apa Dengan Kopi (AADK) Bandung Malang - Coffee & Eatery": "https://www.google.com/maps/place/Ada+Apa+Dengan+Kopi+(AADK)+Bandung+Malang+-+Coffee+%26+Eatery/@-7.9527524,112.6139418,16z/data=!4m11!1m3!2m2!1scoffee+shop+kota+malang!6e5!3m6!1s0x2dd62993cedd5b2f:0xe1d5daba3d95eb22!8m2!3d-7.9607197!4d112.6231072!15sChdjb2ZmZWUgc2hvcCBrb3RhIG1hbGFuZ1oZIhdjb2ZmZWUgc2hvcCBrb3RhIG1hbGFuZ5IBC2NvZmZlZV9zaG9wmgEgQ2hSRFNVaE5NRzluUzBWSlEwRm5TVVJLYjNaT1h4QULgAQD6AQQIABBE!16s%2Fg%2F11p105m89z?entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D",
    "Amstirdam Coffee & Roastery": "https://www.google.com/maps/place/Amstirdam+Coffee+%26+Roastery/@-7.9529022,112.6068131,14.5z/data=!4m11!1m3!2m2!1scoffee+shop+kota+malang!6e5!3m6!1s0x2dd629e80eb1c24f:0xc1217bb2209e35fd!8m2!3d-7.9401773!4d112.6321863!15sChdjb2ZmZWUgc2hvcCBrb3RhIG1hbGFuZ1oZIhdjb2ZmZWUgc2hvcCBrb3RhIG1hbGFuZ5IBC2NvZmZlZV9zaG9wmgEkQ2hkRFNVaE5NRzluUzBWSlEwRm5TVVJhYVhKaVRuWm5SUkFC4AEA-gEECGcQNg!16s%2Fg%2F1hc1y25sq?entry=ttu&g_ep=EgoyMDI2MDUwNi4wIKXMDSoASAFQAw%3D%3D",
    "Bento Kopi UIN Malang": "https://www.google.com/maps/place/Bento+Kopi+UIN+Malang/@-7.9471786,112.6039111,16z/data=!4m13!1m3!2m2!1scoffee+shop+kota+malang!6e5!3m8!1s0x2e78832bd07825a9:0x2a1e52733afbce42!8m2!3d-7.9506244!4d112.6060431!9m1!1b1!16s%2Fg%2F11kpdckywj?entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D",
    "Dialoogi Space & Coffee": "https://www.google.com/maps/place/Dialoogi+Space+%26+Coffee/@-7.9529022,112.6068131,14.5z/data=!4m11!1m3!2m2!1scoffee+shop+kota+malang!6e5!3m6!1s0x2dd629f4b7c67245:0xd79adcc3a9cc5b45!8m2!3d-7.9402221!4d112.6237769!16s%2Fg%2F11j0287rvv?entry=ttu&g_ep=EgoyMDI2MDUwNi4wIKXMDSoASAFQAw%3D%3D",
    "JOKOPI - Malang": "https://www.google.com/maps/place/JOKOPI+-+Malang/@-7.9610134,112.5896334,15z/data=!4m12!1m2!2m1!1scafe+wfc+malang!3m8!1s0x2dd62951c55de7c5:0x1d511a16d26bb497!8m2!3d-7.9629648!4d112.6226969!9m1!1b1!16s%2Fg%2F11rfc5q_lc?entry=ttu&g_ep=EgoyMDI2MDEyNi4wIKXMDSoASAFQAw%3D%3D",
    "KAF Cafe": "https://www.google.com/maps/place/KAF+Cafe/@-7.9610134,112.5896334,15z/data=!4m12!1m2!2m1!1scafe+wfc+malang!3m8!1s0x2e788333398f3db3:0x282645ad24fa3992!8m2!3d-7.9450156!4d112.6115516!9m1!1b1!16s%2Fg%2F11s3_4lp5q?entry=ttu&g_ep=EgoyMDI2MDEyNi4wIKXMDSoASAFQAw%3D%3D",
    "Kopi Handall": "https://www.google.com/maps/place/Kopi+Handall/@-7.9527524,112.6139418,16z/data=!4m11!1m3!2m2!1scoffee+shop+kota+malang!6e5!3m6!1s0x2dd629cff00708d5:0x57cc45fc2db478ca!8m2!3d-7.947581!4d112.6203695!16s%2Fg%2F11rr5jjkzz?entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D",
    "Kotäsk Kaffe Co.": "https://www.google.com/maps/place/Kot%C3%A4sk+Kaffe+Co./@-7.9529022,112.6068131,14.5z/data=!4m11!1m3!2m2!1scoffee+shop+kota+malang!6e5!3m6!1s0x2e7883a92ea4de29:0x2224f16bea48af84!8m2!3d-7.9755473!4d112.612293!16s%2Fg%2F11lhb8jv4h?entry=ttu&g_ep=EgoyMDI2MDUwNi4wIKXMDSoASAFQAw%3D%3D",
    "Labore coffee eatery": "https://www.google.com/maps/place/Labore+coffee+eatery/@-7.9392489,112.6115599,15z/data=!4m12!1m2!2m1!1scafe+wfc+malang!3m8!1s0x2dd629e7c8cc9aa1:0x8d98cf1f12623312!8m2!3d-7.9392489!4d112.6306143!9m1!1b1!16s%2Fg%2F11bwf7gt84?entry=ttu&g_ep=EgoyMDI2MDEyNi4wIKXMDSoASAFQAw%3D%3D",
    "Muraco Headquarter": "https://www.google.com/maps/place/Muraco+Headquarter/@-7.9392489,112.6115599,15z/data=!4m12!1m2!2m1!1scafe+wfc+malang!3m8!1s0x2dd6295d534b2775:0x95856aa0b27b4fd0!8m2!3d-7.9323925!4d112.6293727!9m1!1b1!16s%2Fg%2F11tnl3cjp_?entry=ttu&g_ep=EgoyMDI2MDEyNi4wIKXMDSoASAFQAw%3D%3D",
    "Nakoa": "https://www.google.com/maps/place/Nakoa/@-7.9362506,112.6222933,17z/data=!4m8!3m7!1s0x2dd6294067419899:0xab27db9d9fc2ef99!8m2!3d-7.9362559!4d112.6248736!9m1!1b1!16s%2Fg%2F11sff3vhll?entry=ttu&g_ep=EgoyMDI2MDEyNi4wIKXMDSoASAFQAw%3D%3D",
    "Pesenkopi Plus Betek": "https://www.google.com/maps/place/Pesenkopi+Plus+Betek/@-7.9530355,112.6164731,17z/data=!3m1!4b1!4m6!3m5!1s0x2e7883dc9aea0bcd:0x4009033ff74751cd!8m2!3d-7.9530408!4d112.6190534!16s%2Fg%2F11nnsc416d?entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D",
    "Roketto Coffee & Co": "https://www.google.com/maps/place/Roketto+Coffee+%26+Co/@-7.9527524,112.6139418,16z/data=!4m11!1m3!2m2!1scoffee+shop+kota+malang!6e5!3m6!1s0x2dd6291d88fbf8ef:0x9148d7afe2213bad!8m2!3d-7.9465495!4d112.6258067!16s%2Fg%2F11fhvdz10n?entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D",
    "SUACO": "https://www.google.com/maps/place/SUACO/@-7.9471786,112.6039111,16z/data=!4m11!1m3!2m2!1scoffee+shop+kota+malang!6e5!3m6!1s0x2e78827f4b6ebd61:0x22a1b6fe98ea6a9b!8m2!3d-7.9460959!4d112.6064474!16s%2Fg%2F11b6_wnk6g?entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D",
    "Sarijan Coffee Merjo": "https://www.google.com/maps/place/Sarijan+Coffee+Merjo/@-7.9471786,112.6039111,16z/data=!4m11!1m3!2m2!1scoffee+shop+kota+malang!6e5!3m6!1s0x2e78826dc4e83efd:0x697aebcbd8e017ef!8m2!3d-7.9470471!4d112.6059415!16s%2Fg%2F11b6dfxprf?entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D",
    "Semusim Cafe": "https://www.google.com/maps/place/Semusim+Cafe/@-7.9471786,112.6039111,16z/data=!4m11!1m3!2m2!1scoffee+shop+kota+malang!6e5!3m6!1s0x2e789d6c034f40bf:0xea6f83c59e54b7c7!8m2!3d-7.9471786!4d112.6134383!16s%2Fg%2F11j34gjxct?entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D",
    "Tenthirty coffee and eatery": "https://www.google.com/maps/place/Tenthirty+coffee+and+eatery/@-7.9360855,112.6221389,17z/data=!4m8!3m7!1s0x2dd629feba20ef73:0xc6a56d37003481f2!8m2!3d-7.9360908!4d112.6247192!9m1!1b1!16s%2Fg%2F11jrq568t4?entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D",
    "Toko Kopi Jaya": "https://www.google.com/maps/place/Toko+Kopi+Jaya/@-7.9353125,112.6212466,17z/data=!3m1!4b1!4m6!3m5!1s0x2dd629004eb8483b:0xfa13b01465ec9bc6!8m2!3d-7.9353178!4d112.6238269!16s%2Fg%2F11vwylccwl?entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D",
    "Toko Kopi TUKU - Malang": "https://www.google.com/maps/place/Toko+Kopi+TUKU+-+Malang/@-7.9672646,112.6107493,17z/data=!4m8!3m7!1s0x2e7883e5723bb84b:0xec39d8fc419cfca2!8m2!3d-7.9672699!4d112.6156149!9m1!1b1!16s%2Fg%2F11k3rn6gt1?entry=ttu&g_ep=EgoyMDI2MDEyNi4wIKXMDSoASAFQAw%3D%3D",
    "nowhere coffee": "https://www.google.com/maps/place/nowhere+coffee/@-7.9610134,112.5896334,15z/data=!4m12!1m2!2m1!1scafe+wfc+malang!3m8!1s0x2e7883a01625106b:0xb830284e9bab90ae!8m2!3d-7.9572232!4d112.617358!9m1!1b1!16s%2Fg%2F11wjpn8g9g?entry=ttu&g_ep=EgoyMDI2MDEyNi4wIKXMDSoASAFQAw%3D%3D",
    "The Grove Cafe Malang": "https://www.google.com/maps/place/The+Grove+Cafe+Malang/@-7.9725496,112.6158744,17z/data=!3m1!4b1!4m6!3m5!1s0x2e78832adbd09c81:0xf5e470bca6f565a7!8m2!3d-7.9725549!4d112.6184547!16s%2Fg%2F11v02vnm1w?entry=ttu&g_ep=EgoyMDI2MDUyMC4wIKXMDSoASAFQAw%3D%3D",
    "ADA APA DENGAN KOPI - AADK TLOGOMAS": "https://www.google.com/maps/place/ADA+APA+DENGAN+KOPI+-+AADK+TLOGOMAS/@-7.9325621,112.6006676,17z/data=!3m1!4b1!4m6!3m5!1s0x2e788331110444d7:0xf33e415d5a80ea51!8m2!3d-7.9325674!4d112.6032479!16s%2Fg%2F11y1mv330m?entry=ttu&g_ep=EgoyMDI2MDUyMC4wIKXMDSoASAFQAw%3D%3D",
    "Dekker Koffie": "https://www.google.com/maps/place/Dekker+Koffie/@-7.9627504,112.6176652,17z/data=!3m1!4b1!4m6!3m5!1s0x2dd629aa3c0b6209:0xc181dcf3e3a48866!8m2!3d-7.9627557!4d112.6202455!16s%2Fg%2F11t6qz7f12?entry=ttu&g_ep=EgoyMDI2MDUyMC4wIKXMDSoASAFQAw%3D%3D",
    "Hindia Koffie En Eaten": "https://www.google.com/maps/place/Hindia+Koffie+En+Eaten/@-7.9639041,112.6194795,17z/data=!3m1!4b1!4m6!3m5!1s0x2dd629b0e727ce43:0x679c16be04cb2e0e!8m2!3d-7.9639094!4d112.6220598!16s%2Fg%2F11sh6_s47p?entry=ttu&g_ep=EgoyMDI2MDUyMC4wIKXMDSoASAFQAw%3D%3D",
    "KOPI STUDIO 24 SARANGAN": "https://www.google.com/maps/place/KOPI+STUDIO+24+SARANGAN/@-7.9601533,112.6303392,17z/data=!3m1!4b1!4m6!3m5!1s0x2dd62900134ff42f:0x91bcc0b090f114a2!8m2!3d-7.9601586!4d112.6329195!16s%2Fg%2F11wvqtvzw3?entry=ttu&g_ep=EgoyMDI2MDUyMC4wIKXMDSoASAFQAw%3D%3D",
    "Kalmcoffeedaily": "https://www.google.com/maps/place/Kalmcoffeedaily/@-7.969413,112.6286951,17z/data=!3m1!4b1!4m6!3m5!1s0x2dd629004e8582fb:0x110938b2d6b9dc9!8m2!3d-7.9694183!4d112.6312754!16s%2Fg%2F11x7snqjtw?entry=ttu&g_ep=EgoyMDI2MDUyMC4wIKXMDSoASAFQAw%3D%3D",
    "Kopi Calf Signature Soehat Malang": "https://www.google.com/maps/place/Kopi+Calf+Signature+Soehat+Malang/@-7.9377803,112.6257949,17z/data=!3m1!4b1!4m6!3m5!1s0x2e7883e3a7ae66d9:0xa0313d9b010b23be!8m2!3d-7.9377856!4d112.6283752!16s%2Fg%2F11wms4c0r6?entry=ttu&g_ep=EgoyMDI2MDUyMC4wIKXMDSoASAFQAw%3D%3D",
    "Roemah Kantja": "https://www.google.com/maps/place/Roemah+Kantja/@-7.9633312,112.6081083,17z/data=!3m1!4b1!4m6!3m5!1s0x2e78828784a633a9:0xac9125c6b4d339fc!8m2!3d-7.9633365!4d112.6106886!16s%2Fg%2F11f03qq47b?entry=ttu&g_ep=EgoyMDI2MDUyMC4wIKXMDSoASAFQAw%3D%3D",
    "11:12 sebelasduabelaskopi": "https://www.google.com/maps/place/11:12+sebelasduabelaskopi/@-7.9374171,112.6225084,17z/data=!3m1!4b1!4m6!3m5!1s0x2e789de1845bb1bd:0x28df5b6c22fff68f!8m2!3d-7.9374224!4d112.6250887!16s%2Fg%2F11fwpbgp3z?entry=ttu&g_ep=EgoyMDI2MDUyMC4wIKXMDSoASAFQAw%3D%3D",
}
