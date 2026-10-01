import express from 'express';
import cors from 'cors';
import { requireGuest } from './auth.js';

const app = express();

// lubame ainult meie frontendi
app.use(cors({ origin: 'http://localhost:5173' }));

// loeme JSON keha, max 10kb
app.use(express.json({ limit: '10kb' }));

// kõik /api/items päringud vajavad tokenit
app.use('/api/items', requireGuest);

// kasutaja kirjed (+ otsing nime järgi)
app.get('/api/items', async (req, res) => {
  let query = req.db
    .from('exercises')
    .select('*')
    .eq('owner_id', req.user.id)
    .order('created_at', { ascending: false });

  const search = req.query.search;
  if (typeof search === 'string' && search.trim() !== '') {
    query = query.ilike('exercise', `%${search.trim()}%`);
  }

  const { data, error } = await query;
  if (error) throw error;

  res.status(200).json(data);
});

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
