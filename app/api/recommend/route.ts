import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { calcArchetypeScores, getDominantArchetype, getRecommendation } from '@/lib/recommendationEngine'
import { ProfilingAnswers } from '@/lib/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  const answers: ProfilingAnswers = await req.json()

  const scores = calcArchetypeScores(answers)
  const archetype = getDominantArchetype(scores)
  const recommendation = getRecommendation(archetype, answers.incomeRange)

  // Generate narrative with Claude
  let narrative = ''
  try {
    const msg = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 200,
      system:
        'Kamu adalah advisor mobil OLX Mobbi yang friendly dan singkat. ' +
        'Tulis 2 kalimat pendek dalam Bahasa Indonesia yang menjelaskan kenapa rekomendasi ini cocok untuk user berdasarkan profilnya. ' +
        'Gunakan tone positif dan personal. Jangan sebut nama brand lain selain yang direkomendasikan.',
      messages: [
        {
          role: 'user',
          content:
            `Profil: pekerjaan=${answers.job}, penghasilan=${answers.incomeRange}, ` +
            `status keluarga=${answers.familyStatus}, penggunaan mobil=${answers.carUsage}, prioritas=${answers.carPriority}. ` +
            `Archetype: ${archetype}. Rekomendasi: ${recommendation.primary.brand} ${recommendation.primary.model}.`,
        },
      ],
    })
    narrative = (msg.content[0] as { type: string; text: string }).text ?? ''
  } catch (err) {
    console.error('Claude API error:', err)
  }

  const gapAmount = recommendation.primary.priceMin

  return NextResponse.json({
    dominantArchetype: archetype,
    scores,
    primary: recommendation.primary,
    alternative: recommendation.alternative,
    gapAmount,
    narrative,
  })
}
