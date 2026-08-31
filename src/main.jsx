import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Reshaped } from 'reshaped'
import './themes/noirab/theme.css'
import './styles/glow.css'
import './styles/ambient-glow.css'
import './styles/assignment.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Reshaped theme="noirab" colorMode="dark">
      <App />
    </Reshaped>
  </StrictMode>,
)
