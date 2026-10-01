// laeme .env faili
import 'dotenv/config';
import app from './app.js';

const PORT = process.env.PORT || 3000;

// paneme serveri käima
app.listen(PORT, () => {
  console.log(`Server töötab: http://localhost:${PORT}`);
});
