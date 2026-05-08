import { ProfilingAnswers, ArchetypeScores, Archetype, CarRecommendation } from './types'

interface CarOption {
  brand: string
  model: string
  priceMin: number
}

const RECOMMENDATIONS: Record<Archetype, { toyota: CarOption[]; daihatsu: CarOption[]; alt: CarOption[] }> = {
  URBAN: {
    toyota: [
      { brand: 'Toyota', model: 'Agya', priceMin: 175_000_000 },
      { brand: 'Toyota', model: 'Calya', priceMin: 178_000_000 },
      { brand: 'Toyota', model: 'Yaris', priceMin: 320_000_000 },
      { brand: 'Toyota', model: 'Raize', priceMin: 258_000_000 },
      { brand: 'Toyota', model: 'Corolla Cross', priceMin: 450_000_000 },
    ],
    daihatsu: [
      { brand: 'Daihatsu', model: 'Ayla', priceMin: 145_000_000 },
      { brand: 'Daihatsu', model: 'Sigra', priceMin: 165_000_000 },
      { brand: 'Daihatsu', model: 'Rocky', priceMin: 245_000_000 },
    ],
    alt: [
      { brand: 'Honda', model: 'Brio', priceMin: 168_000_000 },
      { brand: 'Honda', model: 'HR-V', priceMin: 368_000_000 },
      { brand: 'Suzuki', model: 'Baleno', priceMin: 245_000_000 },
      { brand: 'MG', model: 'ZS', priceMin: 315_800_000 },
      { brand: 'KIA', model: 'Sonet', priceMin: 210_000_000 },
      { brand: 'BYD', model: 'Dolphin', priceMin: 369_000_000 },
      { brand: 'VinFast', model: 'VF 5', priceMin: 323_170_000 },
    ],
  },
  FAMILY: {
    toyota: [
      { brand: 'Toyota', model: 'Avanza', priceMin: 238_000_000 },
      { brand: 'Toyota', model: 'Veloz', priceMin: 280_000_000 },
      { brand: 'Toyota', model: 'Rush', priceMin: 305_000_000 },
      { brand: 'Toyota', model: 'Kijang Innova', priceMin: 370_000_000 },
      { brand: 'Toyota', model: 'Kijang Innova Zenix', priceMin: 500_000_000 },
    ],
    daihatsu: [
      { brand: 'Daihatsu', model: 'Xenia', priceMin: 222_000_000 },
      { brand: 'Daihatsu', model: 'Terios', priceMin: 285_000_000 },
    ],
    alt: [
      { brand: 'Mitsubishi', model: 'Xpander', priceMin: 298_000_000 },
      { brand: 'Suzuki', model: 'Ertiga', priceMin: 258_000_000 },
      { brand: 'Wuling', model: 'Almaz', priceMin: 325_000_000 },
      { brand: 'KIA', model: 'Carnival', priceMin: 960_000_000 },
      { brand: 'BYD', model: 'M6', priceMin: 383_000_000 },
      { brand: 'Chery', model: 'Tiggo 8 Pro', priceMin: 498_000_000 },
      { brand: 'Xpeng', model: 'X9', priceMin: 1_059_000_000 },
    ],
  },
  ADVENTURE: {
    toyota: [
      { brand: 'Toyota', model: 'Rush', priceMin: 305_000_000 },
      { brand: 'Toyota', model: 'Fortuner', priceMin: 565_000_000 },
      { brand: 'Toyota', model: 'HILUX', priceMin: 395_000_000 },
    ],
    daihatsu: [
      { brand: 'Daihatsu', model: 'Terios', priceMin: 285_000_000 },
      { brand: 'Daihatsu', model: 'Rocky', priceMin: 245_000_000 },
    ],
    alt: [
      { brand: 'Mitsubishi', model: 'Pajero Sport', priceMin: 615_000_000 },
      { brand: 'Mitsubishi', model: 'Outlander Sport', priceMin: 378_000_000 },
      { brand: 'Isuzu', model: 'mu-X', priceMin: 599_000_000 },
      { brand: 'Isuzu', model: 'D-Max', priceMin: 413_000_000 },
      { brand: 'Ford', model: 'Everest', priceMin: 832_000_000 },
      { brand: 'Ford', model: 'Ranger', priceMin: 551_000_000 },
      { brand: 'BAIC', model: 'BJ40', priceMin: 665_000_000 },
      { brand: 'Subaru', model: 'Forester', priceMin: 688_000_000 },
    ],
  },
  PREMIUM: {
    toyota: [
      { brand: 'Toyota', model: 'Camry', priceMin: 850_000_000 },
      { brand: 'Toyota', model: 'Crown', priceMin: 1_100_000_000 },
      { brand: 'Toyota', model: 'Alphard', priceMin: 1_390_000_000 },
      { brand: 'Toyota', model: 'Vellfire', priceMin: 1_590_000_000 },
      { brand: 'Toyota', model: 'Land Cruiser', priceMin: 2_200_000_000 },
    ],
    daihatsu: [], // no premium Daihatsu
    alt: [
      { brand: 'Hyundai', model: 'Ioniq 5', priceMin: 800_000_000 },
      { brand: 'Hyundai', model: 'Tucson', priceMin: 598_000_000 },
      { brand: 'BMW', model: 'X1', priceMin: 880_000_000 },
      { brand: 'BMW', model: 'X3', priceMin: 1_369_000_000 },
      { brand: 'BMW', model: '3 Series', priceMin: 1_205_000_000 },
      { brand: 'Mercedes-Benz', model: 'GLA', priceMin: 1_010_000_000 },
      { brand: 'Mercedes-Benz', model: 'C-Class', priceMin: 1_250_000_000 },
      { brand: 'Lexus', model: 'UX', priceMin: 1_080_000_000 },
      { brand: 'Lexus', model: 'NX', priceMin: 1_471_000_000 },
      { brand: 'Volvo', model: 'XC40', priceMin: 990_000_000 },
      { brand: 'Volvo', model: 'XC60', priceMin: 1_410_000_000 },
      { brand: 'KIA', model: 'EV6', priceMin: 1_199_000_000 },
      { brand: 'BYD', model: 'Seal', priceMin: 639_000_000 },
      { brand: 'Xpeng', model: 'G6', priceMin: 599_000_000 },
    ],
  },
}

// Income-based max price filter in IDR
const INCOME_MAX_PRICE: Record<string, number> = {
  '< Rp 5 jt': 200_000_000,
  'Rp 5–10 jt': 280_000_000,
  'Rp 10–20 jt': 380_000_000,
  'Rp 20–50 jt': 650_000_000,
  '> Rp 50 jt': Infinity,
}

export function calcArchetypeScores(answers: ProfilingAnswers): ArchetypeScores {
  const scores: ArchetypeScores = { URBAN: 0, FAMILY: 0, ADVENTURE: 0, PREMIUM: 0 }

  // Q1 Pekerjaan
  const jobMap: Record<string, Partial<ArchetypeScores>> = {
    'Karyawan / Profesional': { URBAN: 2, FAMILY: 1 },
    'Pengusaha / Wiraswasta': { PREMIUM: 3, URBAN: 1 },
    'PNS / TNI / Polri': { FAMILY: 2, URBAN: 1 },
    'Freelancer': { URBAN: 2 },
    'Pelajar / Mahasiswa': { URBAN: 3 },
    'Pekerja Lapangan': { ADVENTURE: 3 },
  }
  applyWeights(scores, jobMap[answers.job])

  // Q2 Hobi (bonus, max 2 selections)
  const hobbyMap: Record<string, Partial<ArchetypeScores>> = {
    'Outdoor / Adventure': { ADVENTURE: 2 },
    'Olahraga / Golf': { PREMIUM: 1 },
    'Gaming / Kuliner': { URBAN: 1 },
    'Traveling': { FAMILY: 1, ADVENTURE: 1 },
    'Bisnis / Jualan': { URBAN: 1 },
    'Keluarga & Rumah': { FAMILY: 2 },
  }
  answers.hobbies.slice(0, 2).forEach((h) => applyWeights(scores, hobbyMap[h]))

  // Q3 Penghasilan
  const incomeMap: Record<string, Partial<ArchetypeScores>> = {
    '< Rp 5 jt': { URBAN: 3 },
    'Rp 5–10 jt': { URBAN: 2, FAMILY: 1 },
    'Rp 10–20 jt': { FAMILY: 2, URBAN: 1 },
    'Rp 20–50 jt': { PREMIUM: 1, FAMILY: 1, ADVENTURE: 1 },
    '> Rp 50 jt': { PREMIUM: 3 },
  }
  applyWeights(scores, incomeMap[answers.incomeRange])

  // Q4 Status keluarga
  const familyMap: Record<string, Partial<ArchetypeScores>> = {
    'Single': { URBAN: 2 },
    'Menikah, tanpa anak': { URBAN: 1, PREMIUM: 1 },
    'Menikah, anak masih kecil / sekolah': { FAMILY: 3 },
    'Menikah, anak sudah besar / mandiri': { URBAN: 1, PREMIUM: 1 },
  }
  applyWeights(scores, familyMap[answers.familyStatus])

  // Q5 Jumlah anak (conditional — only when kids are still young)
  if (answers.familyStatus === 'Menikah, anak masih kecil / sekolah') {
    const kidsMap: Record<string, Partial<ArchetypeScores>> = {
      '1 anak': { FAMILY: 1 },
      '2 anak': { FAMILY: 2 },
      '3 atau lebih': { FAMILY: 3 },
    }
    applyWeights(scores, kidsMap[answers.kidsCount])
  }

  // Q6 Penggunaan
  const usageMap: Record<string, Partial<ArchetypeScores>> = {
    'Dalam kota': { URBAN: 3 },
    'Komuter jauh': { URBAN: 1, FAMILY: 1 },
    'Sering keluar kota': { FAMILY: 2, ADVENTURE: 1 },
    'Medan berat / off-road': { ADVENTURE: 3 },
  }
  applyWeights(scores, usageMap[answers.carUsage])

  // Q7 Prioritas
  const priorityMap: Record<string, Partial<ArchetypeScores>> = {
    'Kenyamanan keluarga': { FAMILY: 3 },
    'Mobilitas kerja': { URBAN: 2 },
    'Gaya hidup': { PREMIUM: 2, URBAN: 1 },
    'Petualangan': { ADVENTURE: 3 },
  }
  applyWeights(scores, priorityMap[answers.carPriority])

  return scores
}

function applyWeights(scores: ArchetypeScores, weights?: Partial<ArchetypeScores>) {
  if (!weights) return
  for (const [k, v] of Object.entries(weights) as [Archetype, number][]) {
    scores[k] += v
  }
}

export function getDominantArchetype(scores: ArchetypeScores): Archetype {
  return (Object.entries(scores) as [Archetype, number][]).reduce(
    (max, cur) => (cur[1] > max[1] ? cur : max)
  )[0]
}

export function getRecommendation(
  archetype: Archetype,
  incomeRange: string
): CarRecommendation {
  const pool = RECOMMENDATIONS[archetype]
  const maxPrice = INCOME_MAX_PRICE[incomeRange] ?? Infinity

  const filterByIncome = (options: CarOption[]) =>
    options.filter((o) => o.priceMin <= maxPrice)

  // Primary: Toyota first; skip Daihatsu for PREMIUM
  const toyotaOptions = filterByIncome(pool.toyota)
  const daihatsuOptions = archetype === 'PREMIUM' ? [] : filterByIncome(pool.daihatsu)
  const primaryOptions = [...toyotaOptions, ...daihatsuOptions]

  const primary = primaryOptions[0] ?? pool.toyota[0] // fallback to cheapest Toyota

  // Alternative
  const altOptions = filterByIncome(pool.alt)
  const alternative = altOptions[0] ?? pool.alt[0]

  return { primary, alternative, dominantArchetype: archetype }
}
