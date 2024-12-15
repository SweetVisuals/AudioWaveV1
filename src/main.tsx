import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Import Buffer from buffer package
import { Buffer as BufferPolyfill } from 'buffer';

// Global polyfills
window.global = window;
window.Buffer = BufferPolyfill;
window.process = { env: {} };

// Initialize root element
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);