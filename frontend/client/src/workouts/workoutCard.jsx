
function WorkoutCard({ workout, onDelete }) {
  return (
    <li>
      <span>
        {workout.exercise}
      </span>
      <span>
        {workout.reps}
      </span>
      <button onClick={() => onDelete(workout.id)}>Delete</button>
    </li>
  );
}

export default WorkoutCard;
