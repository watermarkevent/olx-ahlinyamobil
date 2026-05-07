# BLUEPRINT — OLX AhlinyaMobil
**Version:** 1.0  
**Last Updated:** May 2026  
**Project Owner:** David Setyawan — Watermark Indonesia  
**Context:** Aktivasi booth OLX Mobbi × GIIAS 2026

---

## 🎯 WHAT WE'RE BUILDING

A mobile-first web app ("microsite") that acts as an **AI-powered personal car advisor** for visitors at the GIIAS 2026 auto show booth.

Visitors fill in a short form, answer profiling questions, and receive:
1. An **estimated trade-in value** of their current car
2. A **personalized car recommendation** (Toyota/Daihatsu first, then alternatives from GIIAS 2026 brands)
3. A **gap analysis** (how much top-up they need to upgrade)
4. All results **sent automatically to their WhatsApp**

---

## 🔄 FULL USER FLOW

```
SCREEN 1 — Landing / Stopping Power
  ↓ Tap "Mulai"

SCREEN 2 — Data Awal (3 fields)
  - Nama lengkap
  - Nomor WhatsApp aktif
  - Domisili (dropdown kota)
  ↓

SCREEN 3 — Punya Mobil?
  - Ya, ingin tahu nilai trade-in → lanjut ke Screen 4
  - Belum punya mobil → skip ke Screen 5

SCREEN 4 — Data Kendaraan (conditional)
  - Merek (dropdown)
  - Model (dropdown, cascading dari merek)
  - Tahun (dropdown 2010–2024)
  - Transmisi (Manual / Otomatis)
  - Kondisi (Sangat Baik / Baik / Cukup / Perlu Perbaikan)
  ↓

SCREEN 5–12 — Profiling (8 questions, one per screen)
  Q1 - Pekerjaan
  Q2 - Hobi (opsional, max 2)
  Q3 - Penghasilan bulanan
  Q4 - Status keluarga
  Q5 - Jumlah anak kecil/masih sekolah (conditional, muncul jika Q4 = punya anak)
  Q6 - Penggunaan mobil sehari-hari
  Q7 - Prioritas utama mobil
  ↓

SCREEN 13 — Loading / "AI sedang menganalisa..."
  ↓

SCREEN 14 — HASIL
  - Estimasi trade-in (jika punya mobil)
  - Rekomendasi utama: Toyota / Daihatsu + cashback badge
  - Rekomendasi alternatif: brand GIIAS lain
  - Gap analysis: selisih harga
  - CTA: "Temui Tim OLX Mobbi di Booth"
  - Button: "Kirim ke WhatsApp Saya"
```

---

## 🧠 AI & RECOMMENDATION LOGIC

### Profiling → Weighted Score
Each answer adds points to 4 archetype categories:

| Archetype | Description |
|-----------|-------------|
| URBAN | City car, compact, fuel efficient |
| FAMILY | MPV, SUV besar, safety priority |
| ADVENTURE | 4WD, high ground clearance, rugged |
| PREMIUM | Luxury, prestige, comfort |

### Score Mapping (sample weights)
```
Q1 Pekerjaan:
  Karyawan/Profesional    → URBAN+2, FAMILY+1
  Pengusaha/Wiraswasta    → PREMIUM+3, URBAN+1
  PNS/TNI/Polri           → FAMILY+2, URBAN+1
  Freelancer              → URBAN+2
  Pelajar/Mahasiswa       → URBAN+3
  Pekerja Lapangan        → ADVENTURE+3

Q3 Penghasilan:
  < 5jt                   → URBAN+3 (LCGC segment)
  5–10jt                  → URBAN+2, FAMILY+1
  10–20jt                 → FAMILY+2, URBAN+1
  20–50jt                 → PREMIUM+1, FAMILY+1, ADVENTURE+1
  > 50jt                  → PREMIUM+3

Q4 Status Keluarga:
  Single                  → URBAN+2
  Menikah tanpa anak      → URBAN+1, PREMIUM+1
  Menikah punya anak      → FAMILY+3

Q5 Anak kecil:
  1 anak                  → FAMILY+1
  2 anak                  → FAMILY+2
  3+                      → FAMILY+3

Q6 Penggunaan:
  Dalam kota              → URBAN+3
  Komuter jauh            → URBAN+1, FAMILY+1
  Sering keluar kota      → FAMILY+2, ADVENTURE+1
  Medan berat             → ADVENTURE+3

Q7 Prioritas:
  Kenyamanan keluarga     → FAMILY+3
  Mobilitas kerja         → URBAN+2
  Gaya hidup              → PREMIUM+2, URBAN+1
  Petualangan             → ADVENTURE+3

Q2 Hobi (bonus):
  Outdoor/Adventure       → ADVENTURE+2
  Olahraga/Golf           → PREMIUM+1
  Gaming/Kuliner          → URBAN+1
  Traveling               → FAMILY+1, ADVENTURE+1
  Bisnis/Jualan           → URBAN+1
  Keluarga & Rumah        → FAMILY+2
```

### Archetype → Car Recommendation
```
URBAN dominant:
  Toyota:    Agya, Calya, Yaris, Corolla Cross
  Daihatsu:  Ayla, Sigra, Rocky
  Alt:       Honda Brio, Honda HR-V, Suzuki Baleno

FAMILY dominant:
  Toyota:    Avanza, Veloz, Rush, Kijang Innova, Kijang Innova Zenix
  Daihatsu:  Xenia, Terios
  Alt:       Mitsubishi Xpander, Suzuki Ertiga, Wuling Almaz

ADVENTURE dominant:
  Toyota:    Rush, Fortuner, Hilux
  Daihatsu:  Terios, Rocky AWD
  Alt:       Mitsubishi Pajero Sport, GWM Tank 300, Jeep Wrangler

PREMIUM dominant:
  Toyota:    Camry, Crown, Alphard, Vellfire, Land Cruiser
  Daihatsu:  (no premium lineup → Toyota only)
  Alt:       BMW X3, Mercedes-Benz GLC, Volvo XC60, Lexus RX

Income filter (overrides archetype if conflict):
  < 5jt     → max LCGC (Agya, Ayla, Brio)
  5–10jt    → max Low MPV (Avanza, Xenia, Ertiga)
  10–20jt   → max Mid SUV (Rush, Terios, HR-V)
  20–50jt   → max Mid-Premium (Fortuner, Corolla Cross, Xpander)
  > 50jt    → all segments available
```

### Daihatsu Fallback Rule
If dominant archetype = PREMIUM → show Toyota only in primary slot. No forced Daihatsu.

---

## 💰 CAR VALUATION ALGORITHM

### Depreciation Formula
```
Base Price = OTR price at launch year (from database)
Age = Current Year - Car Year
Mileage Assumption = Age × 15,000 km/year (standard)

Depreciation Rate by Age:
  Year 1   → 20% depreciation
  Year 2   → 15%
  Year 3   → 12%
  Year 4+  → 10% per year
  Max depreciation cap: 70% (car retains min 30% of original value)

Condition Multiplier:
  Sangat Baik    → 1.05
  Baik           → 1.00
  Cukup          → 0.88
  Perlu Perbaikan → 0.75

Transmission Multiplier:
  Otomatis       → 1.05
  Manual         → 1.00

Estimated Value = Base Price × (1 - Total Depreciation) × Condition × Transmission

Output: range ± 10% of calculated value
Example: if calculated = 150,000,000 → show "Rp 135 jt – Rp 165 jt"
```

### Car Database (Key Models)
Store in `/lib/carDatabase.ts` — merek → model → tahun → OTR price at launch.
Start with Toyota, Daihatsu, Honda, Suzuki, Mitsubishi, Hyundai, Wuling as minimum.

---

## 📊 DATA MODEL (Supabase)

### Table: `leads`
```sql
id              uuid primary key default gen_random_uuid()
created_at      timestamp default now()
nama            text not null
whatsapp        text not null
domisili        text not null
has_car         boolean
-- Car data (nullable)
car_brand       text
car_model       text
car_year        integer
car_transmission text
car_condition   text
estimated_value_min bigint
estimated_value_max bigint
-- Profiling answers
job             text
hobbies         text[]
income_range    text
family_status   text
kids_count      text
car_usage       text
car_priority    text
-- Results
dominant_archetype  text
recommended_primary text
recommended_alt     text
gap_amount          bigint
wa_sent             boolean default false
wa_sent_at          timestamp
```

### Table: `sessions`
```sql
id              uuid primary key default gen_random_uuid()
lead_id         uuid references leads(id)
started_at      timestamp default now()
completed_at    timestamp
current_screen  integer
is_complete     boolean default false
```

---

## 🏗️ TECH STACK

```
Framework:    Next.js 14 (App Router) + TypeScript
Styling:      Tailwind CSS
Database:     Supabase (PostgreSQL)
AI:           Anthropic Claude API (claude-sonnet-4-20250514)
WA Delivery:  Fonnte API (or Qontak — configurable via env)
Deploy:       Vercel
```

---

## 📁 FOLDER STRUCTURE

```
olx-ahlinyamobil/
├── app/
│   ├── page.tsx                 # Landing screen
│   ├── form/
│   │   └── page.tsx             # Multi-step form (all screens)
│   ├── hasil/
│   │   └── page.tsx             # Results screen
│   └── api/
│       ├── recommend/route.ts   # AI recommendation endpoint
│       ├── valuate/route.ts     # Car valuation endpoint
│       ├── save-lead/route.ts   # Save to Supabase
│       └── send-wa/route.ts     # WhatsApp blast
├── components/
│   ├── screens/                 # One component per screen
│   │   ├── Landing.tsx
│   │   ├── DataAwal.tsx
│   │   ├── PunyaMobil.tsx
│   │   ├── DataKendaraan.tsx
│   │   ├── ProfilingStep.tsx    # Reusable for all Q1-Q7
│   │   ├── Loading.tsx
│   │   └── Hasil.tsx
│   └── ui/                      # Shared UI components
│       ├── ProgressBar.tsx
│       ├── OptionButton.tsx
│       ├── MultiSelect.tsx
│       └── ResultCard.tsx
├── lib/
│   ├── carDatabase.ts           # All car data + OTR prices
│   ├── valuationEngine.ts       # Depreciation algorithm
│   ├── recommendationEngine.ts  # Weighted scoring logic
│   ├── supabase.ts              # Supabase client
│   └── types.ts                 # All TypeScript types
├── styles/
│   └── globals.css
├── .env.local                   # API keys (never commit)
└── BLUEPRINT.md                 # This file
```

---

## 🎨 DESIGN SYSTEM

### Brand Colors (OLX Mobbi)
```css
--trusted-blue:     #17376D   /* dominant dark navy */
--confidence-blue:  #3A77FF   /* bright blue - primary actions */
--certified-orange: #F05C2A   /* accent - CTA, highlights */
--white:            #FFFFFF
--light-blue:       #E8EFFF   /* card backgrounds */
--light-gray:       #F5F7FA   /* page backgrounds */
--mid-gray:         #6B7280   /* body text */
```

### Design Principles
- Mobile-first (primary use: tablet kiosk at event)
- One question per screen — large tap targets
- Progress bar always visible
- Minimum 48px touch targets for all buttons
- Bold typography — readable from kiosk distance

---

## 🔑 ENVIRONMENT VARIABLES

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
FONNTE_API_KEY=
NEXT_PUBLIC_APP_URL=
```

---

## 📱 WHATSAPP MESSAGE TEMPLATE

```
Halo [Nama]! 👋

Ini hasil *OLX AhlinyaMobil* kamu di GIIAS 2026:

🚗 *Mobilmu sekarang*
[Merek] [Model] [Tahun]
💰 Estimasi trade-in: *Rp [min] jt – Rp [max] jt*

⭐ *Rekomendasi Utama*
[Toyota/Daihatsu Model]
Harga mulai *Rp [harga] jt*
✅ Cashback Eksklusif tersedia di GIIAS 2026!

💡 *Alternatif*
[Brand Model] – mulai Rp [harga] jt

📊 *Estimasi top-up kamu: ± Rp [gap] jt*

Temui tim OLX Mobbi di *Booth Hall [X]*
untuk penawaran trade-in terbaik! 🙌

_OLX Mobbi × GIIAS 2026_
```

---

## 🚀 BUILD ORDER (Sprint Plan)

### Sprint 1 — Foundation
1. Init Next.js project + Tailwind + TypeScript
2. Setup Supabase — create tables
3. Build `carDatabase.ts` — Toyota, Daihatsu, Honda, Suzuki, Mitsubishi
4. Build `valuationEngine.ts` — depreciation algorithm
5. Build `recommendationEngine.ts` — weighted scoring

### Sprint 2 — UI Screens
6. Landing screen (stopping power)
7. Data Awal screen (Nama, WA, Domisili)
8. Punya Mobil screen
9. Data Kendaraan screen (cascading dropdowns)
10. Profiling screens Q1–Q7 (reusable component)

### Sprint 3 — AI & API
11. `/api/recommend` — scoring + Claude API for narrative
12. `/api/valuate` — run depreciation formula
13. `/api/save-lead` — save to Supabase
14. `/api/send-wa` — Fonnte/Qontak integration

### Sprint 4 — Results & Polish
15. Loading screen + animation
16. Hasil screen — 2 recommendation cards + gap analysis
17. WhatsApp send button
18. Progress bar + mobile polish
19. Deploy to Vercel

---

## ⚠️ IMPORTANT NOTES FOR CLAUDE CODE

- Always use `const` not `var`
- All API keys via environment variables — never hardcode
- Car valuation output = range (min/max), never single number
- Daihatsu fallback: if archetype = PREMIUM, skip Daihatsu in primary slot
- Hobi question: optional (can be skipped), multi-select max 2
- Q5 (anak kecil): only render if Q4 answer = "Menikah, punya anak"
- WA number format: strip leading 0, add 62 prefix before sending
- All currency in IDR, display in "jt" format (divide by 1,000,000)
- Supabase RLS: enable on `leads` table, only service_role can read all

