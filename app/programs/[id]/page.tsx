'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps: string;
  rpe?: number;
  notes?: string;
}

interface WorkoutProgram {
  id: number;
  name: string;
  description: string;
  exercises: Exercise[];
}

export default function ProgramPage() {
  const params = useParams();
  const router = useRouter();
  const [program, setProgram] = useState<WorkoutProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [newExercise, setNewExercise] = useState({
    name: '',
    sets: 3,
    reps: '',
    rpe: undefined as number | undefined,
    notes: ''
  });

  useEffect(() => {
    fetchProgram();
  }, [params.id]);

  const fetchProgram = async () => {
    try {
      const response = await fetch(`/api/programs/${params.id}`);
      const data = await response.json();
      setProgram(data);
    } catch (error) {
      console.error('Error fetching program:', error);
    } finally {
      setLoading(false);
    }
  };

  const addExercise = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExercise.name || !newExercise.reps) return;

    try {
      const response = await fetch('/api/exercises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          programId: parseInt(params.id as string),
          ...newExercise
        }),
      });

      if (response.ok) {
        setNewExercise({ name: '', sets: 3, reps: '', rpe: undefined, notes: '' });
        setShowExerciseForm(false);
        fetchProgram();
      }
    } catch (error) {
      console.error('Error adding exercise:', error);
    }
  };

  const updateExercise = async (exercise: Exercise) => {
    try {
      const response = await fetch(`/api/exercises/${exercise.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exercise),
      });

      if (response.ok) {
        setEditingExercise(null);
        fetchProgram();
      }
    } catch (error) {
      console.error('Error updating exercise:', error);
    }
  };

  const deleteExercise = async (id: number) => {
    if (!confirm('Are you sure you want to delete this exercise?')) return;

    try {
      const response = await fetch(`/api/exercises/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchProgram();
      }
    } catch (error) {
      console.error('Error deleting exercise:', error);
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  if (!program) {
    return <div className="flex min-h-screen items-center justify-center">Program not found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8">
          <Link href="/" className="mb-4 inline-block text-blue-600 hover:underline">
            ← Back to Programs
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{program.name}</h1>
              {program.description && (
                <p className="mt-2 text-gray-600">{program.description}</p>
              )}
            </div>
            <button
              onClick={() => setShowExerciseForm(true)}
              className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
            >
              Add Exercise
            </button>
          </div>
        </div>

        {showExerciseForm && (
          <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Add New Exercise</h2>
            <form onSubmit={addExercise}>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Exercise Name
                  </label>
                  <input
                    type="text"
                    value={newExercise.name}
                    onChange={(e) => setNewExercise({ ...newExercise, name: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">Sets</label>
                  <input
                    type="number"
                    min="1"
                    value={newExercise.sets}
                    onChange={(e) => setNewExercise({ ...newExercise, sets: parseInt(e.target.value) })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Reps (e.g., "8-10" or "12")
                  </label>
                  <input
                    type="text"
                    value={newExercise.reps}
                    onChange={(e) => setNewExercise({ ...newExercise, reps: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    RPE (1-10, optional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    step="0.5"
                    value={newExercise.rpe || ''}
                    onChange={(e) => setNewExercise({ 
                      ...newExercise, 
                      rpe: e.target.value ? parseFloat(e.target.value) : undefined 
                    })}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Notes (optional)
                </label>
                <textarea
                  value={newExercise.notes}
                  onChange={(e) => setNewExercise({ ...newExercise, notes: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                  rows={3}
                />
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  type="submit"
                  className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                >
                  Add Exercise
                </button>
                <button
                  type="button"
                  onClick={() => setShowExerciseForm(false)}
                  className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          {program.exercises.map((exercise) => (
            <div key={exercise.id} className="rounded-lg bg-white p-6 shadow-md">
              {editingExercise?.id === exercise.id ? (
                <div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <input
                      type="text"
                      value={editingExercise.name}
                      onChange={(e) => setEditingExercise({ ...editingExercise, name: e.target.value })}
                      className="rounded border border-gray-300 px-3 py-2 text-gray-900"
                    />
                    <input
                      type="number"
                      min="1"
                      value={editingExercise.sets}
                      onChange={(e) => setEditingExercise({ ...editingExercise, sets: parseInt(e.target.value) })}
                      className="rounded border border-gray-300 px-3 py-2 text-gray-900"
                    />
                    <input
                      type="text"
                      value={editingExercise.reps}
                      onChange={(e) => setEditingExercise({ ...editingExercise, reps: e.target.value })}
                      className="rounded border border-gray-300 px-3 py-2 text-gray-900"
                    />
                    <input
                      type="number"
                      min="1"
                      max="10"
                      step="0.5"
                      value={editingExercise.rpe || ''}
                      onChange={(e) => setEditingExercise({ 
                        ...editingExercise, 
                        rpe: e.target.value ? parseFloat(e.target.value) : undefined 
                      })}
                      className="rounded border border-gray-300 px-3 py-2 text-gray-900"
                      placeholder="RPE (optional)"
                    />
                  </div>
                  <textarea
                    value={editingExercise.notes || ''}
                    onChange={(e) => setEditingExercise({ ...editingExercise, notes: e.target.value })}
                    className="mt-2 w-full rounded border border-gray-300 px-3 py-2 text-gray-900"
                    rows={2}
                    placeholder="Notes (optional)"
                  />
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => updateExercise(editingExercise)}
                      className="rounded bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingExercise(null)}
                      className="rounded bg-gray-500 px-3 py-1 text-sm text-white hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{exercise.name}</h3>
                      <p className="text-gray-600">
                        {exercise.sets} sets × {exercise.reps} reps
                        {exercise.rpe && ` @ RPE ${exercise.rpe}`}
                      </p>
                      {exercise.notes && (
                        <p className="mt-2 text-sm text-gray-500">{exercise.notes}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingExercise(exercise)}
                        className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteExercise(exercise.id)}
                        className="rounded bg-red-600 px-3
