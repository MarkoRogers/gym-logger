'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface WorkoutProgram {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export default function Home() {
  const [programs, setPrograms] = useState<WorkoutProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [newProgram, setNewProgram] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    try {
      const response = await fetch('/api/programs');
      const data = await response.json();
      setPrograms(data);
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProgram.name) return;

    try {
      const response = await fetch('/api/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProgram),
      });

      if (response.ok) {
        setNewProgram({ name: '', description: '' });
        setShowForm(false);
        fetchPrograms();
      }
    } catch (error) {
      console.error('Error creating program:', error);
    }
  };

  const deleteProgram = async (id: number) => {
    if (!confirm('Are you sure you want to delete this program?')) return;

    try {
      const response = await fetch(`/api/programs/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchPrograms();
      }
    } catch (error) {
      console.error('Error deleting program:', error);
    }
  };

  if (loading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Workout Programs</h1>
          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            New Program
          </button>
        </div>

        {showForm && (
          <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Create New Program</h2>
            <form onSubmit={createProgram}>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Program Name
                </label>
                <input
                  type="text"
                  value={newProgram.name}
                  onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description (optional)
                </label>
                <textarea
                  value={newProgram.description}
                  onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900"
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                >
                  Create Program
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg bg-gray-500 px-4 py-2 text-white hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {programs.map((program) => (
            <div key={program.id} className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">{program.name}</h3>
              {program.description && (
                <p className="mb-4 text-gray-600">{program.description}</p>
              )}
              <div className="flex gap-2">
                <Link
                  href={`/programs/${program.id}`}
                  className="rounded bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                >
                  View
                </Link>
                <button
                  onClick={() => deleteProgram(program.id)}
                  className="rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {programs.length === 0 && (
          <div className="rounded-lg bg-white p-8 text-center shadow-md">
            <p className="text-gray-600">No workout programs yet. Create your first one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
