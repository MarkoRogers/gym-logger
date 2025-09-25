import { NextRequest, NextResponse } from 'next/server'
import * as db from '@/app/db'

function extractIdFromRequest(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const parts = url.pathname.split('/').filter(Boolean)
    const last = parts[parts.length - 1]
    return last ? decodeURIComponent(last) : null
  } catch {
    return null
  }
}

// PUT /api/exercises/[id]
export async function PUT(request: NextRequest) {
  try {
    const idStr = extractIdFromRequest(request)
    if (!idStr) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const id = parseInt(idStr, 10)
    if (Number.isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

    if (typeof db.updateExercise !== 'function') {
      return NextResponse.json({ error: 'DB function updateExercise not available' }, { status: 500 })
    }

    const body = await request.json().catch(() => null)
    if (!body) return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })

    const exercise = await db.updateExercise(
      id,
      body.name,
      body.sets,
      body.reps,
      body.rpe,
      body.notes
    )

    return NextResponse.json(exercise)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update exercise' }, { status: 500 })
  }
}

// DELETE /api/exercises/[id]
export async function DELETE(request: NextRequest) {
  try {
    const idStr = extractIdFromRequest(request)
    if (!idStr) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const id = parseInt(idStr, 10)
    if (Number.isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

    if (typeof db.deleteExercise !== 'function') {
      return NextResponse.json({ error: 'DB function deleteExercise not available' }, { status: 500 })
    }

    await db.deleteExercise(id)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete exercise' }, { status: 500 })
  }
}
