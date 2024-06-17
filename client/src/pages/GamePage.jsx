import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Alert } from 'react-bootstrap';
import CaptionsList from '../components/CaptionList';
import './GamePage.css'; // Import the CSS file
import API from '../services/API';

const GamePage = ({ user }) => {
  const [meme, setMeme] = useState(null);
  const [rightCaptions, setRightCaptions] = useState([]);
  const [rngCaptions, setRngCaptions] = useState([]);
  const [error, setError] = useState(null);
  const [round, setRound] = useState(1);

  const fetchRoundContent = async () => {
    try {
      const data = await API.fetchRoundContent();
      setMeme(data.meme);
      setRightCaptions(data.rightCaptions);
      setRngCaptions(data.rngCaptions);
      setError(null); // Clear any previous error
    } catch (error) {
      setError('An error occurred while fetching the meme and captions');
    }
  };

  useEffect(() => {
    fetchRoundContent();
  }, []); // Fetch round content on component mount

  const handleNextRound = () => {
    setRound(round + 1);
    fetchRoundContent();
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
              <img src={`http://localhost:3001/resources/${meme.filename}`} alt="Meme" className="meme-image" />
            </Col>
          </Row>
          <Row className="mt-4">
            <Col>
              <CaptionsList rightCaptions={rightCaptions} rngCaptions={rngCaptions} />
            </Col>
          </Row>
        </>
      )}
      <Row className="mt-4 text-center">
        <Col>
          <Button variant="primary" onClick={handleNextRound}>Next Round</Button>
        </Col>
      </Row>
    </Container>
  );
};

export default GamePage;
