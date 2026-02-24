import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import NavBar from './components/NavBar';
import Rankings from './pages/Rankings';
import Players from './pages/Players';
import LogMatch from './pages/LogMatch';
import History from './pages/History';
import './App.css';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div className="app">
          <NavBar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Rankings />} />
              <Route path="/players" element={<Players />} />
              <Route path="/log-match" element={<LogMatch />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
