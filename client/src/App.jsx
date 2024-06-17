import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './pages/HomePage';
import GamePage from './pages/GamePage';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';
import API from './services/API';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await API.getUserInfo();
        setUser(currentUser);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setUser(user);
      console.log(user);
    } catch (err) {
      console.error(err);
      // Gestire l'errore di login
    }
  };

  const handleLogout = async () => {
    console.log("l'utente");
    console.log(user);
    console.log("era loggato");
    await API.logOut();
    console.log("Adesso è sloggato");
    setUser(null);
    console.log(user);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
      <Routes>
        <Route path="/" element={<HomePage user={user} logout={handleLogout}/>} />
        <Route path="/game" element={<GamePage user={user}/>} />
        <Route path="/login" element={<LoginPage login={handleLogin} />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
}

export default App;
