import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import { useState } from 'react';
import NavBar from './NavBar';
import LoginPage from './pages/LoginPage';
import Articles from './pages/Articles';
import Profile from './pages/Profile';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <AppContent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    </Router>
  );
};

function AppContent({ isLoggedIn, setIsLoggedIn }) {
  return (
    <div className="App">
      <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <Routes>
        <Route exact path="/" element={<Articles />} />
        <Route exact path="/login" element={<LoginPage setIsLoggedIn={setIsLoggedIn} />} />
        <Route exact path="/profile" element={<Profile />} />
      </Routes>
    </div>
  );
}

export default App;
