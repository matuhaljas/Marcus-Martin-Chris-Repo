import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ensureGuestSession } from './supabaseClient';

const root = createRoot(document.getElementById('root'));

// enne rakendust teeme guest sessiooni
ensureGuestSession()
  .then(() => {
    root.render(
      <StrictMode>
        <App />
      </StrictMode>,
    );
  })
  .catch((err) => {
    console.error('Guest session failed:', err);
    root.render(<p>Guest session failed. Please refresh the page.</p>);
  });
