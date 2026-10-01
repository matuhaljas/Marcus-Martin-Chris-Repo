import { useEffect, useState } from 'react';
import "./App.css";
import { addWorkout, deleteWorkout, getWorkouts } from './service/workoutApi';
import WorkoutForm from "./workouts/workoutForm";
import WorkoutList from "./workouts/workoutList";

function App() {
  const [workout, setWorkout] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // laeme kirjed serverist (+ otsing)
  useEffect(() => {
    async function loadWorkout() {
      setLoading(true);
      try {
        const loaded = await getWorkouts(search.trim());
        setWorkout(loaded);
        setError('');
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadWorkout();
  }, [search]);

  async function handleAdd(newWorkout) {
    try {
      const saved = await addWorkout(newWorkout);
      setWorkout(prev => [saved, ...prev]);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteWorkout(id);
      setWorkout(prev => prev.filter(item => item.id !== id));
      setError('');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div>
      <h1>Training Log</h1>
      {error && <p>{error}</p>}
      <WorkoutForm onAdd={handleAdd} />

      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search exercise"
      />

      {loading ? (
        <p>Loading workouts...</p>
      ) : (
        <WorkoutList workout={workout} onDelete={handleDelete} />
      )}
    </div>
  );
}

export default App;
