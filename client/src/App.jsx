import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import NotFound from './pages/NotFound';
import API from './services/API';
import './App.css'; 
import Quiz from './pages/Quiz';
import Profile from './pages/Profile';
import Summary from './pages/Summary';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false); 
  const [message, setMessage] = useState(''); 

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
      setLoggedIn(true);
      setMessage({msg: `Welcome, ${user.name}!`, type: 'success'});
      setUser(user);
    } catch(err) {
      setMessage({msg: "Username o password errati", type: 'danger'});
    }
  };

  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser(null);
    setMessage({msg: 'Logged out successfully', type: 'success'}); 
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<HomePage loggedIn={loggedIn} user={user} logout={handleLogout} />} />
      <Route path="/game" element={<Quiz user={user} logged={loggedIn}/>} />
      <Route path='/login' element={
        loggedIn ? <Navigate replace to='/' /> : <LoginPage login={handleLogin} message={message} setMessage={setMessage} />
      } />
       <Route path="/summary" element={<Summary/>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
