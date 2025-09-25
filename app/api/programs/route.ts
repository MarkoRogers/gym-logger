import { NextRequest, NextResponse } from 'next/server'
import type { RouteContext } from 'next/server'
import { getProgramById, updateProgram, deleteProgram } from '@/app/db'

// GET /api/programs/[id]
export async function GET(
  request: NextRequest,
  context: RouteContext<'/api/programs/[id]'>
) {
  try {
    const { id } = await context.params
    const program = await getProgramById(parseInt(id, 10))

    if (!program) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 })
    }

    return NextResponse.json(program)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch program' }, { status: 500 })
  }
}

// PUT /api/programs/[id]
export async function PUT(
  request: NextRequest,
  context: RouteContext<'/api/programs/[id]'>
) {
  try {
    const { id } = await context.params
    const { name, description } = await request.json()

    const program = await updateProgram(parseInt(id, 10), name, description)

    return NextResponse.json(program)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update program' }, { status: 500 })
  }
}

// DELETE /api/programs/[id]
export async function DELETE(
  request: NextRequest,
  context: RouteContext<'/api/programs/[id]'>
) {
  try {
    const { id } = await context.params

    await deleteProgram(parseInt(id, 10))

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete program' }, { status: 500 })
  }
}
