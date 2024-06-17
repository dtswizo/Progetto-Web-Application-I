// src/pages/HomePage.js
import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './HomePage.css'; // Importiamo il file CSS

const HomePage = ({ logout }) => {
  const navigate = useNavigate();

  const startGame = () => {
    navigate('/game');
  };

  const login = () => {
    navigate('/login');
  };

  return (
    <div className="homepage-container">
      <h1 className="mb-4 title">What do you meme?</h1>
      <Row>
        <Col className="d-flex justify-content-around">
          <Button variant="primary" size="lg" onClick={startGame} className="custom-button">Start Game</Button>
          <Button variant="secondary" size="lg" onClick={login} className="custom-button">Login</Button>
          <Button variant="secondary" size="lg" onClick={logout} className="custom-button">Logout</Button>
        </Col>
      </Row>
    </div>
  );
};

export default HomePage;
