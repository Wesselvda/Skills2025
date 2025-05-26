import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './css/style.css';
import Layout from './Pages/Layout';
import Home from './Pages/Home';
import Login from './Pages/Login';
import GameInfo from './Pages/GameInfo';
import { AppProvider } from './contexts/AppContext';
import Register from './Pages/Register';
import Admin from './Pages/Admin';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='login' element={<Login />} />
            <Route path='register' element={<Register />} />
            <Route path='admin' element={<Admin />} />
            <Route path='game/:gameId' element={<GameInfo />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App;