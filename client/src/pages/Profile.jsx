import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../services/API';
import './Profile.css';

const Profile = () => {
  const location = useLocation();
  const { user } = location.state || {}; 
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    return <div>Caricamento in corso...</div>;
  }

  if (error) {
    return <div>Errore: {error}</div>;
  }

  if (!user) {
    return <div>Non sono disponibili dati per l'utente</div>;
  }

  const groupByGameId = (data) => { //serve a raggruppare i round per ID partita
    const games = [];
    const gameMap = {};

    data.forEach((round) => {
      if (!gameMap[round.game_id]) {
        gameMap[round.game_id] = [];
        games.push({ game_id: round.game_id, rounds: gameMap[round.game_id] });
      }
      gameMap[round.game_id].push(round); //aggiunta round all'array dei round per questo GAME_ID
    });

    return games;
  };

  const historyByGame = groupByGameId(history);

  return (
    <div className="profile-container">
      <h2>Cronologia Utente</h2>
      <div className="games-container"> 
        {historyByGame.map((game, index) => (
          <div key={game.game_id} className="game-row"> 
            <h3>Partita {index + 1}</h3>
            <p>Punteggio totale: {game.rounds[0].total_score}</p>
            <div className="rounds">
              {game.rounds.map((round) => (
                <div key={round.id} className="round">
                  <img src={`http://localhost:3001/resources/${round.meme_img}`} alt="Meme" />
                  <p>Punteggio: {round.round_score}</p> 
                  <p>{round.is_correct ? 'Corretto' : 'Errato'}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button className="home-button" onClick={() => navigate("/")}>Torna alla Home</button>
    </div>
    
  );
};

export default Profile;
