export async function getWorkout() {
  const response = await fetch('/tasks.json');

  if (!response.ok) {
    throw new Error('Something went wrong while loading tasks.');
  }

  return response.json();
}