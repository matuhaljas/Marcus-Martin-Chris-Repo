import WorkoutCard from './workoutCard';

export default function WorkoutList({ workout, onDelete }) {
  if (workout.length === 0) {
    return <p>No workout found</p>;
  }

  return (
    <ul>
      {workout.map(task => (
        <WorkoutCard key={task.id} task={task} onDelete={onDelete} />
      ))}
    </ul>
  );
}