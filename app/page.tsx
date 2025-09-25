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
  const [dbStatus, setDbStatus] = useState('Checking...');

  useEffect(() => {
    checkDatabase();
    fetchPrograms();
  }, []);

  const checkDatabase = async () => {
    try {
      const response = await fetch('/api/db-check');
      const data = await response.json();
      setDbStatus(data.status || 'Unknown');
    } catch (error) {
      console.error('Error checking database:', error);
      setDbStatus('Error checking database');
    }
  };

  const fetchPrograms = async () => {
    try {
      const response = await fetch('/api/programs');
      if (response.ok) {
        const data = await response.json();
        setPrograms(data);
      } else {
        console.error('Failed to fetch programs:', response.status);
        // If programs fail to load, try to initialize database
        if (response.status === 500) {
          await initializeDatabase();
        }
      }
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeDatabase = async () => {
    try {
      console.log('Attempting to initialize database...');
      const response = await fetch('/api/init', {
        method: 'POST',
      });
      const data = await response.json();
      console.log('Database init result:', data);
      if (response.ok) {
        // Retry fetching programs
        setTimeout(() => fetchPrograms(), 1000);
      }
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  };

  const createProgram = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProgram.name.trim()) return;

    try {
      console.log('Creating program:', newProgram);
      const response = await fetch('/api/programs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProgram),
      });

      const data = await response.json();
      console.log('Create program response:', data);

      if (response.ok) {
        setNewProgram({ name: '', description: '' });
        setShowForm(false);
        fetchPrograms();
      } else {
        alert(`Failed to create program: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating program:', error);
      alert('Failed to create program. Check console for details.');
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
      } else {
        const data = await response.json();
        alert(`Failed to delete program: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting program:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mb-4 text-lg">Loading...</div>
          <div className="text-sm text-gray-600">Database Status: {dbStatus}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-4xl px-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Gym Logger</h1>
            <p className="text-sm text-gray-600">Workout Programs</p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            New Program
          </button>
        </div>

        {/* Database Status */}
        <div className="mb-4">
          <span
            className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${
              dbStatus === 'Database connected'
                ? 'bg-green-100 text-green-800'
                : dbStatus.includes('missing')
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {dbStatus}
          </span>
          {dbStatus.includes('missing') && (
            <button
              onClick={initializeDatabase}
              className="ml-2 rounded bg-blue-600 px-2 py-1 text-xs text-white hover:bg-blue-700"
            >
              Initialize Database
            </button>
          )}
        </div>

        {showForm && (
          <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
            <h2 className="mb-4 text-xl font-semibold">Create New Program</h2>
            <form onSubmit={createProgram}>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Program Name *
                </label>
                <input
                  type="text"
                  value={newProgram.name}
                  onChange={(e) => setNewProgram({ ...newProgram, name: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none"
                  required
                  placeholder="e.g., Push Pull Legs"
                />
              </div>
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description (optional)
                </label>
                <textarea
                  value={newProgram.description}
                  onChange={(e) => setNewProgram({ ...newProgram, description: e.target.value })}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none"
                  rows={3}
                  placeholder="Brief description of your program..."
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
                  onClick={() => {
                    setShowForm(false);
                    setNewProgram({ name: '', description: '' });
                  }}
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
                <p className="mb-4 text-gray-600 text-sm">{program.description}</p>
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
            <p className="mb-4 text-gray-600">No workout programs yet. Create your first one!</p>
            <button
              onClick={() => setShowForm(true)}
              className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Create First Program
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
