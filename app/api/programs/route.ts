import { NextRequest, NextResponse } from 'next/server'
import * as db from '@/app/db'

/**
 * Helper: read the id from the request URL.
 * Works around Next 15 typing changes by parsing the path (last segment).
 */
function extractIdFromRequest(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const parts = url.pathname.split('/').filter(Boolean)
    // last segment should be the dynamic [id]
    const last = parts[parts.length - 1]
    return last ? decodeURIComponent(last) : null
  } catch {
    return null
  }
}

// GET /api/programs/[id]
export async function GET(request: NextRequest) {
  try {
    const idStr = extractIdFromRequest(request)
    if (!idStr) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const id = parseInt(idStr, 10)
    if (Number.isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

    if (typeof db.getProgramById !== 'function') {
      return NextResponse.json({ error: 'DB function getProgramById not available' }, { status: 500 })
    }

    const program = await db.getProgramById(id)
    if (!program) return NextResponse.json({ error: 'Program not found' }, { status: 404 })

    return NextResponse.json(program)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch program' }, { status: 500 })
  }
}

// PUT /api/programs/[id]
export async function PUT(request: NextRequest) {
  try {
    const idStr = extractIdFromRequest(request)
    if (!idStr) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const id = parseInt(idStr, 10)
    if (Number.isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

    if (typeof db.updateProgram !== 'function') {
      return NextResponse.json({ error: 'DB function updateProgram not available' }, { status: 500 })
    }

    const body = await request.json().catch(() => null)
    if (!body) return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })

    // adjust fields according to your db/updateProgram signature
    const updated = await db.updateProgram(id, body.name, body.description)

    return NextResponse.json(updated)
  } catch (err) {
    return NextResponse.json({ error: 'Failed to update program' }, { status: 500 })
  }
}

// DELETE /api/programs/[id]
export async function DELETE(request: NextRequest) {
  try {
    const idStr = extractIdFromRequest(request)
    if (!idStr) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const id = parseInt(idStr, 10)
    if (Number.isNaN(id)) return NextResponse.json({ error: 'Invalid id' }, { status: 400 })

    if (typeof db.deleteProgram !== 'function') {
      return NextResponse.json({ error: 'DB function deleteProgram not available' }, { status: 500 })
    }

    await db.deleteProgram(id)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to delete program' }, { status: 500 })
  }
}
