import { NextResponse } from 'next/server';
import { initializeTables } from '@/app/db';

export async function POST() {
  try {
    await initializeTables();
    return NextResponse.json({ message: 'Database initialized successfully' });
  } catch (error) {
    console.error('Error initializing database:', error);
    return NextResponse.json({ 
      error: 'Failed to initialize database',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
