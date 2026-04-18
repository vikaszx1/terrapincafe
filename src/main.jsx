import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { SiteDataProvider } from './context/SiteDataContext.jsx'
import App from './App.jsx'
import AdminApp from './admin/AdminApp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SiteDataProvider>
      <HashRouter>
        <Routes>
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="*"        element={<App />} />
        </Routes>
      </HashRouter>
    </SiteDataProvider>
  </StrictMode>
)
