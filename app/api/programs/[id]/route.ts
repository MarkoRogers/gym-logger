import { NextRequest, NextResponse } from 'next/server';
import { getWorkoutProgramWithExercises, updateWorkoutProgram, deleteWorkoutProgram } from '@/app/db';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const program = await getWorkoutProgramWithExercises(parseInt(id));
    if (!program) {
      return NextResponse.json({ error: 'Program not found' }, { status: 404 });
    }
    return NextResponse.json(program);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch program' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const { name, description } = await request.json();
    const program = await updateWorkoutProgram(parseInt(id), name, description);
    return NextResponse.json(program);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update program' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    await deleteWorkoutProgram(parseInt(id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete program' }, { status: 500 });
  }
}
