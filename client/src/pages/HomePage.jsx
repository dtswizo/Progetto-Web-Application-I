import React from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; // Import the CSS file
import photoBg from '../resources/bg2.jpg';

const HomePage = ({ user,logout,loggedIn }) => {
  const navigate = useNavigate();

  const startGame = () => {
    navigate('/game');
  };

  const login = () => {
    navigate('/login');
  };



  return (
    <div className="homepage-container">
      <img src={photoBg} alt="Background" />
      {loggedIn ? (
        <div className="button-group">
          <Button variant="primary" size="lg" onClick={startGame} className="custom-button">
            Play
          </Button>
          <Button variant="secondary" size="lg" onClick={logout} className="custom-button">
            Logout
          </Button>
        </div>
      ) : (
        <div className="button-group">
          <Button variant="primary" size="lg" onClick={startGame} className="custom-button">
            Play as a Guest
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
