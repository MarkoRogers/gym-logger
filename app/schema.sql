-- Create tables for workout programs
CREATE TABLE IF NOT EXISTS workout_programs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS exercises (
    id SERIAL PRIMARY KEY,
    program_id INTEGER REFERENCES workout_programs(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    sets INTEGER NOT NULL,
    reps VARCHAR(50) NOT NULL, -- Can be "8-10" or "12"
    rpe DECIMAL(3,1), -- Rate of Perceived Exertion (1.0-10.0)
    notes TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_exercises_program_id ON exercises(program_id);
CREATE INDEX IF NOT EXISTS idx_exercises_order ON exercises(program_id, order_index);
