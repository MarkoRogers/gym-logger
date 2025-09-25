import { NextRequest, NextResponse } from 'next/server';
import { updateExercise, deleteExercise } from '@/app/db';

export async function PUT(request: NextRequest, { params }: any) {
  try {
    const { name, sets, reps, rpe, notes } = await request.json();
    const exercise = await updateExercise(
      parseInt(params.id),
      name,
      sets,
      reps,
      rpe,
      notes
    );
    return NextResponse.json(exercise);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update exercise' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: any) {
  try {
    await deleteExercise(parseInt(params.id));
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete exercise' }, { status: 500 });
  }
}
