import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { HashRouter } from 'react-router-dom'  // Change to HashRouter
import { AiCallResponseProvider } from './AiCallResponseContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>  {/* Change to HashRouter */}
      <AiCallResponseProvider>
        <App />
      </AiCallResponseProvider>
    </HashRouter>
  </StrictMode>,
)
