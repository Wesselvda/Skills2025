import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './assets/css/style.css'
import Layout from './layouts/Layout'
import Carparks from './pages/Carparks'
import CarparkDetail from './Pages/CarparkDetail'
import Events from './Pages/Events'
import Weather from './Pages/Weather'
import Settings from './Pages/Settings'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='*' element={<Layout />}>
          <Route index element={<Weather />} />
          <Route path="carparks" element={<Carparks />} />
          <Route path="carparks/:name" element={<CarparkDetail />} />
          <Route path="events" element={<Events />} />
          <Route path="weather" element={<Weather />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
