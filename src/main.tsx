import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { UpdatePrompt } from './components/layout/UpdatePrompt';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    {/* Mounted outside App, not inside its authenticated tree: whether a new
        version is waiting has nothing to do with whether you are signed in, and
        App returns early (loading splash, login page) before ever reaching its
        main tree. */}
    <UpdatePrompt />
  </StrictMode>,
);
