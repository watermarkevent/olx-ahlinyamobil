export interface ProfilingQuestion {
  id: string
  question: string
  type: 'single' | 'multi'
  max?: number
  optional?: boolean
  options: { label: string }[]
}

export const PROFILING_QUESTIONS: ProfilingQuestion[] = [
  {
    id: 'job',
    question: 'Apa pekerjaan kamu saat ini?',
    type: 'single',
    options: [
      { label: 'Karyawan / Profesional' },
      { label: 'Pengusaha / Wiraswasta' },
      { label: 'PNS / TNI / Polri' },
      { label: 'Freelancer' },
      { label: 'Pelajar / Mahasiswa' },
      { label: 'Pekerja Lapangan' },
    ],
  },
  {
    id: 'hobbies',
    question: 'Apa hobi kamu? (pilih maks. 2)',
    type: 'multi',
    max: 2,
    optional: true,
    options: [
      { label: 'Outdoor / Adventure' },
      { label: 'Olahraga / Golf' },
      { label: 'Gaming / Kuliner' },
      { label: 'Traveling' },
      { label: 'Bisnis / Jualan' },
      { label: 'Keluarga & Rumah' },
    ],
  },
  {
    id: 'incomeRange',
    question: 'Berapa penghasilan bulanan kamu?',
    type: 'single',
    options: [
      { label: '< Rp 5 jt' },
      { label: 'Rp 5–10 jt' },
      { label: 'Rp 10–20 jt' },
      { label: 'Rp 20–50 jt' },
      { label: '> Rp 50 jt' },
    ],
  },
  {
    id: 'familyStatus',
    question: 'Bagaimana status keluarga kamu?',
    type: 'single',
    options: [
      { label: 'Single' },
      { label: 'Menikah, tanpa anak' },
      { label: 'Menikah, anak masih kecil / sekolah' },
      { label: 'Menikah, anak sudah besar / mandiri' },
    ],
  },
  {
    id: 'kidsCount',
    question: 'Berapa anak masih kecil / sekolah?',
    type: 'single',
    options: [
      { label: '1 anak' },
      { label: '2 anak' },
      { label: '3 atau lebih' },
    ],
  },
  {
    id: 'carUsage',
    question: 'Bagaimana penggunaan mobil sehari-hari?',
    type: 'single',
    options: [
      { label: 'Dalam kota' },
      { label: 'Komuter jauh' },
      { label: 'Sering keluar kota' },
      { label: 'Medan berat / off-road' },
    ],
  },
  {
    id: 'carPriority',
    question: 'Apa prioritas utama mobilmu?',
    type: 'single',
    options: [
      { label: 'Kenyamanan keluarga' },
      { label: 'Mobilitas kerja' },
      { label: 'Gaya hidup' },
      { label: 'Petualangan' },
    ],
  },
]

export const DOMISILI_OPTIONS = [
  'Jakarta Pusat', 'Jakarta Selatan', 'Jakarta Barat', 'Jakarta Timur', 'Jakarta Utara',
  'Bogor', 'Depok', 'Tangerang', 'Tangerang Selatan', 'Bekasi',
  'Bandung', 'Surabaya', 'Medan', 'Semarang', 'Makassar',
  'Palembang', 'Batam', 'Pekanbaru', 'Bandar Lampung', 'Malang',
  'Yogyakarta', 'Denpasar', 'Balikpapan', 'Samarinda', 'Manado',
  'Lainnya',
]
