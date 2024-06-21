import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./Quiz.css";
import API from '../services/API';

const Quiz = (props) => {
  const [matchId, setMatchId] = useState(null);
  const [roundContent, setRoundContent] = useState(null);
  const [error, setError] = useState(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [isAnswerSelected, setIsAnswerSelected] = useState(false);
  const [timer, setTimer] = useState(30);
  const [showPopup, setShowPopup] = useState(false);
  const [summaryData, setSummaryData] = useState([]);
  const [intervalId, setIntervalId] = useState(null);
  let firstLoad=false;
  const navigate = useNavigate(); 


  useEffect(() => {
    if(firstLoad===false){
    loadRoundContent();
    resetTimer();
    firstLoad=true;
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }
  }, [currentRound]);

  useEffect(() => {
    if (timer === 0) {
      handleNextClick();
    }
  }, [timer]);

  const loadRoundContent = async () => {
    if (currentRound === 1 && props.logged) {
      const res = await API.create_game(props.user.id);
      setMatchId(res.game_id);
    }
    try {
      const data = await API.fetchRoundContent();
      if (data) {
        const { rightCaptions, rngCaptions } = data;
        const shuffledCaptions = [...rightCaptions, ...rngCaptions].sort(() => Math.random() - 0.5);
        setRoundContent({ ...data, captions: shuffledCaptions });
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const resetTimer = () => {
    if (intervalId) clearInterval(intervalId);
    setTimer(30);
    const id = setInterval(() => {
      setTimer(prevTimer => prevTimer - 1);
    }, 1000);
    setIntervalId(id);
  };

  const handleCaptionClick = async (event, caption) => {
    firstLoad=false;
    if (isAnswerSelected) return;
    if (intervalId) clearInterval(intervalId);
    const isCorrect = roundContent.rightCaptions.some(rc => rc.id === caption.id); //controllo se la risposta è giusta
    if (isCorrect) {
      event.target.classList.add('correct');
      setSummaryData(prevSummaryData => [   //buffer locale per salvare le risposte giuste e i meme
        ...prevSummaryData,
        {
          answer: caption.text,
          memeImg: roundContent.meme.filename
        }
      ]);
    }
    else{
      event.target.classList.add('wrong');
      setShowPopup(true); //se la risposta è errata devo mostrare il popup con le risposte giuste
    } 
    setIsAnswerSelected(true);
    await API.add_round(matchId, props.user.id, roundContent.meme.filename, caption.text, isCorrect);//aggiungere try/catch? 
  };

  const handleNextClick = () => {
    document.querySelectorAll('.risposte li').forEach(element => {
    element.classList.remove('correct', 'wrong');
    });  //resetto il css dalle risposte ogni fine round
    if (currentRound < 3) {
      setCurrentRound(currentRound + 1);
      setIsAnswerSelected(false);
    } else {
      console.log(summaryData);
      navigate('/summary', { state: { summaryData } });
      if (intervalId) clearInterval(intervalId);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!roundContent) {
    return <div>Loading...</div>;
  }

  const { meme, captions } = roundContent;

  return (
    <div className='container'>
      <h1>Gioco dei Memes</h1>
      <div className='container-wrapper'>
        <div className='container-domanda'>
          <div className='domanda'>
            <h2>Quale didascalia è più adatta al meme?</h2>
            <div className='memeImg'>
              <img src={`http://localhost:3001/resources/${meme.filename}`} alt="Meme" className="meme-image" />
            </div>
          </div>
          <div className='container-risposte'>
            <ul className='risposte'>
              {captions.map((caption, index) => (
                <li
                  key={index}
                  onClick={(event) => handleCaptionClick(event, caption)}
                >
                  {caption.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <button onClick={handleNextClick} disabled={!isAnswerSelected}>Avanti</button>
      <div className="index">{currentRound} di 3 domande</div>
      <div className="timer">Tempo rimasto: {timer}s</div>
      {showPopup && (
        <Popup
          correctAnswers={roundContent.rightCaptions}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
};

const Popup = ({ correctAnswers, onClose }) => (
  <div className="popup-overlay">
    <div className="popup">
      <h2>Risposte Corrette</h2>
      <ul>
        {correctAnswers.map((answer, index) => ( /*il popup è scalabile anche in caso di aggiunta di più di 2 risposte corrette*/
          <li key={index}>{answer.text}</li>
        ))}
      </ul>
      <button onClick={onClose}>Chiudi</button>
    </div>
  </div>
);

export default Quiz;
