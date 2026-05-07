import { NextRequest, NextResponse } from 'next/server'
import { valuateCar } from '@/lib/valuationEngine'
import { ValuationInput } from '@/lib/types'

export async function POST(req: NextRequest) {
  const body: ValuationInput = await req.json()
  const result = valuateCar(body)
  if (!result) {
    return NextResponse.json({ error: 'Car not found in database' }, { status: 404 })
  }
  return NextResponse.json(result)
}
