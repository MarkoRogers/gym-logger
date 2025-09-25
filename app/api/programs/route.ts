import { NextRequest, NextResponse } from 'next/server';
import { getWorkoutPrograms, createWorkoutProgram } from '@/app/db';

export async function GET() {
  try {
    console.log('GET /api/programs called');
    const programs = await getWorkoutPrograms();
    console.log('Programs fetched:', programs.length);
    return NextResponse.json(programs);
  } catch (error) {
    console.error('Error in GET /api/programs:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch programs', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/programs called');
    
    // Check if DATABASE_URL exists
    if (!process.env.DATABASE_URL) {
      console.error('DATABASE_URL not found');
      return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
    }
    
    const body = await request.json();
    console.log('Request body:', body);
    
    const { name, description } = body;
    
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    
    const program = await createWorkoutProgram(name, description);
    console.log('Program created:', program);
    
    return NextResponse.json(program);
  } catch (error) {
    console.error('Error in POST /api/programs:', error);
    return NextResponse.json({ 
      error: 'Failed to create program', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}
