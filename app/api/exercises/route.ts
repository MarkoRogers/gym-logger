import { NextRequest, NextResponse } from 'next/server';
import { addExercise } from '@/app/db';

export async function POST(request: NextRequest) {
  try {
    const { programId, name, sets, reps, rpe, notes } = await request.json();
    const exercise = await addExercise(programId, name, sets, reps, rpe, notes);
    return NextResponse.json(exercise);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create exercise' }, { status: 500 });
  }
}
