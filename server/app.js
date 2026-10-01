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

// uus kirje
app.post('/api/items', async (req, res) => {
  const { exercise, reps } = req.body || {};

  // kontrollime andmeid
  if (typeof exercise !== 'string' || exercise.trim().length < 1 || exercise.trim().length > 60) {
    return res.status(400).json({ error: 'Harjutus peab olema 1-60 märki' });
  }
  if (!Number.isInteger(reps) || reps < 1 || reps > 500) {
    return res.status(400).json({ error: 'Kordused peavad olema täisarv 1-500' });
  }

  // owner_id tuleb tokenist, mitte brauserist
  const { data, error } = await req.db
    .from('exercises')
    .insert({ exercise: exercise.trim(), reps, owner_id: req.user.id })
    .select()
    .single();
  if (error) throw error;

  res.status(201).json(data);
});

// kirje kustutamine
app.delete('/api/items/:id', async (req, res) => {
  const id = Number(req.params.id);

  // id peab olema positiivne täisarv
  if (!Number.isInteger(id) || id < 1) {
    return res.status(404).json({ error: 'Kirjet ei leitud' });
  }

  // kustutame ainult oma kirje
  const { data, error } = await req.db
    .from('exercises')
    .delete()
    .eq('id', id)
    .eq('owner_id', req.user.id)
    .select();
  if (error) throw error;

  // midagi ei kustunud
  if (data.length === 0) {
    return res.status(404).json({ error: 'Kirjet ei leitud' });
  }

  res.status(204).end();
});

// tundmatu aadress
app.use((req, res) => {
  res.status(404).json({ error: 'Ei leitud' });
});

// kui midagi läheb katki
app.use((err, req, res, next) => {
  // katkine JSON brauserist
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Vigane JSON' });
  }
  console.error(err);
  res.status(500).json({ error: 'Serveri viga' });
});

export default app;
