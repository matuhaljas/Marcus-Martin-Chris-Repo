import express from 'express';
import cors from 'cors';

const app = express();

// lubame ainult meie frontendi
app.use(cors({ origin: 'http://localhost:5173' }));

// loeme JSON keha, max 10kb
app.use(express.json({ limit: '10kb' }));

// tundmatu aadress
app.use((req, res) => {
  res.status(404).json({ error: 'Ei leitud' });
});

// kui midagi läheb katki
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Serveri viga' });
});

export default app;
