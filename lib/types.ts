export type CarCondition = 'Sangat Baik' | 'Baik' | 'Cukup' | 'Perlu Perbaikan'
export type Transmission = 'Otomatis' | 'Manual'
export type Archetype = 'URBAN' | 'FAMILY' | 'ADVENTURE' | 'PREMIUM'

export interface CarEntry {
  brand: string
  model: string
  year: number
  otrPrice: number
}

export interface ValuationInput {
  brand: string
  model: string
  year: number
  transmission: Transmission
  condition: CarCondition
}

export interface ValuationResult {
  min: number
  max: number
  calculated: number
}

export interface ProfilingAnswers {
  job: string
  hobbies: string[]
  incomeRange: string
  familyStatus: string
  kidsCount: string
  carUsage: string
  carPriority: string
}

export interface ArchetypeScores {
  URBAN: number
  FAMILY: number
  ADVENTURE: number
  PREMIUM: number
}

export interface CarRecommendation {
  primary: {
    brand: string
    model: string
    priceMin: number
  }
  alternative: {
    brand: string
    model: string
    priceMin: number
  }
  dominantArchetype: Archetype
}

export interface Lead {
  id?: string
  created_at?: string
  nama: string
  whatsapp: string
  domisili: string
  has_car: boolean
  car_brand?: string
  car_model?: string
  car_year?: number
  car_transmission?: string
  car_condition?: string
  estimated_value_min?: number
  estimated_value_max?: number
  job?: string
  hobbies?: string[]
  income_range?: string
  family_status?: string
  kids_count?: string
  car_usage?: string
  car_priority?: string
  dominant_archetype?: string
  recommended_primary?: string
  recommended_alt?: string
  gap_amount?: number
  wa_sent?: boolean
  wa_sent_at?: string
}
