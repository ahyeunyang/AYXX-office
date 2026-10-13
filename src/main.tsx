import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/base/global.scss'
import App from './App.tsx'
import { loadSettings } from './data/settings'

document.documentElement.dataset.theme = loadSettings().theme

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

