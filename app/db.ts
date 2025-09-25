import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

export async function checkDbConnection() {
  if (!process.env.DATABASE_URL) {
    return "No DATABASE_URL environment variable";
  }
  try {
    const result = await sql`SELECT version()`;
    console.log("Pg version:", result);
    return "Database connected";
  } catch (error) {
    console.error("Error connecting to the database:", error);
    return "Database not connected";
  }
}

export async function initializeTables() {
  if (!process.env.DATABASE_URL) {
    throw new Error("No DATABASE_URL");
  }
  
  const initSql = neon(process.env.DATABASE_URL);
  
  try {
    // Create workout_programs table
    await initSql`
      CREATE TABLE IF NOT EXISTS workout_programs (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // Create exercises table
    await initSql`
      CREATE TABLE IF NOT EXISTS exercises (
        id SERIAL PRIMARY KEY,
        program_id INTEGER REFERENCES workout_programs(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        sets INTEGER NOT NULL,
        reps VARCHAR(50) NOT NULL,
        rpe DECIMAL(3,1),
        notes TEXT,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    // Create indexes
    await initSql`
      CREATE INDEX IF NOT EXISTS idx_exercises_program_id ON exercises(program_id)
    `;
    
    await initSql`
      CREATE INDEX IF NOT EXISTS idx_exercises_order ON exercises(program_id, order_index)
    `;
    
    console.log("Tables initialized successfully");
    return true;
  } catch (error) {
    console.error("Error initializing tables:", error);
    throw error;
  }
}
export async function getWorkoutPrograms() {
  const programs = await sql`
    SELECT id, name, description, created_at, updated_at 
    FROM workout_programs 
    ORDER BY updated_at DESC
  `;
  return programs;
}

export async function createWorkoutProgram(name: string, description?: string) {
  const [program] = await sql`
    INSERT INTO workout_programs (name, description)
    VALUES (${name}, ${description || ''})
    RETURNING *
  `;
  return program;
}

export async function updateWorkoutProgram(id: number, name: string, description?: string) {
  const [program] = await sql`
    UPDATE workout_programs 
    SET name = ${name}, description = ${description || ''}, updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id}
    RETURNING *
  `;
  return program;
}

export async function deleteWorkoutProgram(id: number) {
  await sql`DELETE FROM workout_programs WHERE id = ${id}`;
}

export async function getWorkoutProgramWithExercises(id: number) {
  const [program] = await sql`
    SELECT * FROM workout_programs WHERE id = ${id}
  `;
  
  if (!program) return null;
  
  const exercises = await sql`
    SELECT * FROM exercises 
    WHERE program_id = ${id} 
    ORDER BY order_index, id
  `;
  
  return { ...program, exercises };
}

// Exercise functions
export async function addExercise(
  programId: number, 
  name: string, 
  sets: number, 
  reps: string, 
  rpe?: number, 
  notes?: string
) {
  const [exercise] = await sql`
    INSERT INTO exercises (program_id, name, sets, reps, rpe, notes)
    VALUES (${programId}, ${name}, ${sets}, ${reps}, ${rpe}, ${notes || ''})
    RETURNING *
  `;
  return exercise;
}

export async function updateExercise(
  id: number,
  name: string,
  sets: number,
  reps: string,
  rpe?: number,
  notes?: string
) {
  const [exercise] = await sql`
    UPDATE exercises 
    SET name = ${name}, sets = ${sets}, reps = ${reps}, rpe = ${rpe}, notes = ${notes || ''}
    WHERE id = ${id}
    RETURNING *
  `;
  return exercise;
}

export async function deleteExercise(id: number) {
  await sql`DELETE FROM exercises WHERE id = ${id}`;
}
