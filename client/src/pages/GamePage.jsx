import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import CaptionsList from '../components/CaptionList';
import './GamePage.css'; // Import the CSS file
import API from '../services/API';

const SERVER_URL = "http://localhost:3001";

const GamePage = ({ user }) => {
  const [meme, setMeme] = useState(null);
  const [error, setError] = useState(null);
  const [round, setRound] = useState(1);
  const [usedMemes, setUsedMemes] = useState([]);

  
  const handleNextRound = () => {
    setRound(round + 1);
    fetchMeme();
  };

  return (
    <Container className="game-page">
      <h1 className="mb-4 title">What do you meme?</h1>
      {user && <p>Welcome back, {user.name}!</p>}
      <Row className="mt-4">
        <Col>
          <h2 className="text-center">Round {round}</h2>
          <Alert variant="info" className="text-center">
            Seleziona la didascalia che meglio si adatta al meme.
          </Alert>
        </Col>
      </Row>
      {error && <Alert variant="danger">{error}</Alert>}
      {meme && (
        <>
          <Row className="mt-4">
            <Col className="text-center">
             
            </Col>
          </Row>
          <Row className="mt-4">
            <Col>
              <CaptionsList/>
            </Col>
          </Row>
        </>
      )}
      <Row className="mt-4 text-center">
        <Col>
        </Col>
      </Row>
      <Row className="mt-4 text-center">
        <Col>
          <Button variant="primary" onClick={handleNextRound}>Next Round</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default GamePage;
