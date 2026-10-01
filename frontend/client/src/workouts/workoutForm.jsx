import { useState } from 'react';

export default function WorkoutForm({ onAdd }) {
  const [exercise, setExercise] = useState('');
  const [reps, setReps] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const name = exercise.trim();
    const count = Number(reps);

    // kontrollime enne saatmist
    if (name.length < 1 || name.length > 60) {
      setError('Exercise must be 1-60 characters');
      return;
    }
    if (!Number.isInteger(count) || count < 1 || count > 500) {
      setError('Reps must be a whole number 1-500');
      return;
    }

    setError('');
    onAdd({ exercise: name, reps: count });
    setExercise('');
    setReps('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={exercise} onChange={e => setExercise(e.target.value)} placeholder="Exercise" />
      <input type="number" value={reps} onChange={e => setReps(e.target.value)} placeholder="Reps" />
      <button type="submit">Add</button>
      {error && <p>{error}</p>}
    </form>
  );
}
