import { NextRequest, NextResponse } from 'next/server';
import { getWorkoutPrograms, createWorkoutProgram } from '@/app/db';

export async function GET() {
  try {
    const programs = await getWorkoutPrograms();
    return NextResponse.json(programs);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch programs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name, description } = await request.json();
    const program = await createWorkoutProgram(name, description);
    return NextResponse.json(program);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create program' }, { status: 500 });
  }
}
