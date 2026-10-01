import { createClient } from '@supabase/supabase-js';

// klient tokeni kontrollimiseks
const authClient = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

// kontrollime, et päringul on kehtiv token
export async function requireGuest(req, res, next) {
  const match = req.get('authorization')?.match(/^Bearer\s+(\S+)$/i);

  if (!match) {
    return res.status(401).json({ error: 'Token puudub' });
  }

  const token = match[1];

  try {
    // küsime Supabase'ilt, kas token on päris
    const { data, error } = await authClient.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({ error: 'Vale token' });
    }

    req.user = data.user;

    // andmebaasi klient selle kasutaja nimel
    req.db = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_PUBLISHABLE_KEY,
      {
        global: {
          headers: { Authorization: `Bearer ${token}` },
        },
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      }
    );

    next();
  } catch (error) {
    next(error);
  }
}
