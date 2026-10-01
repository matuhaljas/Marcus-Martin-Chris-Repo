import { useEffect, useRef, useState, ReactDOM } from 'react';
import { HashRouter, Link, Route, Routes } from 'react-router-dom';
import "./App.css";
import { getWorkout } from './service/workoutApi';
import WorkoutForm from "./workouts/workoutForm";
import WorkoutList from "./workouts/workoutList";
import { ensureGuestSession } from './supabaseClient';

function App() {
  const [workout, setWorkout] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const nextId = useRef(1);
  
  ensureGuestSession()
  .catch((err) => console.error('Guest session failed:', err))
  .finally(() => {
    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  });
  
  useEffect(() => {
    async function loadWorkout() {
      try {
        const loadedTasks = await getWorkout();
        setWorkout(loadedTasks);
        nextId.current = loadedTasks.reduce((maxId, task) => Math.max(maxId, task.id), 0) + 1;
      } catch {
        setError('Failed to load tasks.');
      } finally {
        setLoading(false);
      }
    }

    loadWorkout();
  }, []);

  function handleAdd(text) {
    const newTask = { id: nextId.current++, text};
    setWorkout(prev => [...prev, newTask]);
  }

  function handleDelete(id) {
    setWorkout(prev => prev.filter(task => task.id !== id));
  }

  const filteredWorkout = workout.filter(task => {
    if (filter === 'pullup') return task.pullup;
    if (filter === 'pushup') return !task.pushup;
    return true;
  });


  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <h1>Workouts</h1>
              {error && <p>{error}</p>}
              <WorkoutForm onAdd={handleAdd} />

              <div>
                <button
                  onClick={() => setFilter("all")}
                  disabled={filter === "all"}
                >
                  All
                </button>
                <button
                  onClick={() => setFilter("pullup")}
                  disabled={filter === "pullup"}
                >
                  Pull-up
                </button>
                <button
                  onClick={() => setFilter("pushup")}
                  disabled={filter === "pushup"}
                >
                  Push-up
                </button>
              </div>

              {loading ? (
                <p>Loading workouts...</p>
              ) : (
                <WorkoutList
                  workouts={filteredWorkout}
                  onDelete={handleDelete}
                />
              )}
            </div>
          }
        />

        <Route
          path="*"
          element={
            <div>
              <h1>Page not found</h1>
              <Link to="/">Back to tasks</Link>
            </div>
          }
        />
      </Routes>
    </HashRouter>
  );
}

export default App;
