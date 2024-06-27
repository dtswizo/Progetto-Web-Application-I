import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; 
import photoBg from '../resources/bg2.jpg';

const HomePage = ({ user,logout,loggedIn }) => {
  const navigate = useNavigate();

  const startGame = () => {
    navigate('/game');
  };

  const login = () => {
    navigate('/login');
  };

  const goToProfile = () => {
    navigate('/profile', { state: { user } });
  };



  return (
    <div className="homepage-container">
      <img src={photoBg} alt="Background" />
      {loggedIn ? (
        <div className="button-group">
          <Button variant="primary" size="lg" onClick={startGame} className="custom-button">
            Gioca
          </Button>
          <Button variant="secondary" size="lg" onClick={logout} className="custom-button">
            Logout
          </Button>
          <Button variant="primary" size="lg" onClick={goToProfile} className="custom-button">
            Profilo
          </Button>
        </div>
      ) : (
        <div className="button-group">
          <Button variant="primary" size="lg" onClick={startGame} className="custom-button">
            Gioca come ospite
          </Button>
          <Button variant="secondary" size="lg" onClick={login} className="custom-button">
            Login
          </Button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
