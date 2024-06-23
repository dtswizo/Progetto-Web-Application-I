import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import API from '../services/API';
import './Profile.css';

const Profile = () => {
  const location = useLocation();
  const { user } = location.state || {}; // Extract user from location.state
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchHistory = async () => {
      try {
        const data = await API.fetchHistory(user.id);
        setHistory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>No user data available</div>;
  }

  const groupByGameId = (data) => {
    return data.reduce((acc, curr) => {
      if (!acc[curr.game_id]) {
        acc[curr.game_id] = [];
      }
      acc[curr.game_id].push(curr);
      return acc;
    }, {});
  };

  const historyByGame = groupByGameId(history);

  return (
    <div>
      <h2>User Game History</h2>
      {Object.keys(historyByGame).map((gameId) => (
        <div key={gameId} className="game-history">
          <h3>Game ID: {gameId}</h3>
          <p>Total Score: {historyByGame[gameId][0].total_score}</p>
          <div className="rounds">
            {historyByGame[gameId].map((round) => (
              <div key={round.id} className="round">
                <img src={`http://localhost:3001/resources/${round.meme_img}`} alt="Meme" />
                <p>Answer: {round.answer}</p>
                <p>Score: {round.round_score}</p>
                <p>{round.is_correct ? 'Correct' : 'Incorrect'}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Profile;
