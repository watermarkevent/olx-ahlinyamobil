export interface FormData {
  // Screen 1 — DataAwal
  nama: string
  whatsapp: string
  domisili: string
  // Screen 2 — PunyaMobil
  hasCar: boolean | null
  // Screen 3 — Tujuan (only if hasCar = true)
  tujuan: 'harga' | 'rekomendasi' | 'tradein' | ''
  // Screen 3 — DataKendaraan
  carBrand: string
  carModel: string
  carYear: string
  carTransmission: string
  carVariant: string
  carProvince: string
  carKilometer: string
  carCondition: string
  // Profiling
  job: string
  hobbies: string[]
  incomeRange: string
  familyStatus: string
  kidsCount: string
  carUsage: string
  carPriority: string
}

export const INITIAL_FORM: FormData = {
  nama: '',
  whatsapp: '',
  domisili: '',
  hasCar: null,
  tujuan: '',
  carBrand: '',
  carModel: '',
  carYear: '',
  carTransmission: '',
  carVariant: '',
  carProvince: '',
  carKilometer: '',
  carCondition: '',
  job: '',
  hobbies: [],
  incomeRange: '',
  familyStatus: '',
  kidsCount: '',
  carUsage: '',
  carPriority: '',
}
