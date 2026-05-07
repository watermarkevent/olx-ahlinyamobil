import { ValuationInput, ValuationResult } from './types'
import { getOtrPrice } from './carDatabase'

const CURRENT_YEAR = 2026

function calcDepreciation(age: number): number {
  if (age <= 0) return 0
  let dep = 0
  for (let y = 1; y <= age; y++) {
    if (y === 1) dep += 0.20
    else if (y === 2) dep += 0.15
    else if (y === 3) dep += 0.12
    else dep += 0.10
  }
  return Math.min(dep, 0.70) // max 70% depreciation
}

const CONDITION_MULTIPLIER: Record<string, number> = {
  'Sangat Baik': 1.05,
  'Baik': 1.00,
  'Cukup': 0.88,
  'Perlu Perbaikan': 0.75,
}

const TRANSMISSION_MULTIPLIER: Record<string, number> = {
  'Otomatis': 1.05,
  'Manual': 1.00,
}

export function valuateCar(input: ValuationInput): ValuationResult | null {
  const basePrice = getOtrPrice(input.brand, input.model, input.year)
  if (!basePrice) return null

  const age = CURRENT_YEAR - input.year
  const depreciation = calcDepreciation(age)
  const conditionMult = CONDITION_MULTIPLIER[input.condition] ?? 1.00
  const transMult = TRANSMISSION_MULTIPLIER[input.transmission] ?? 1.00

  const calculated = Math.round(basePrice * (1 - depreciation) * conditionMult * transMult)
  const min = Math.round(calculated * 0.90)
  const max = Math.round(calculated * 1.10)

  return { calculated, min, max }
}

export function formatRupiah(amount: number): string {
  const jt = amount / 1_000_000
  return `Rp ${jt % 1 === 0 ? jt.toFixed(0) : jt.toFixed(0)} jt`
}
