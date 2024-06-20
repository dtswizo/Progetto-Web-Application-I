import React, { useState, useEffect, useRef } from "react";
import "./Quiz.css";
import API from '../services/API';

const Quiz = (props) => {
  const [matchId,setMatchId]=useState(null);
  const [roundContent, setRoundContent] = useState(null);
  const [error, setError] = useState(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [isAnswerSelected, setIsAnswerSelected] = useState(false);
  const [timer, setTimer] = useState(30);
  const [showPopup, setShowPopup] = useState(false);
  const [summaryData,setSummaryData] = useState([]);
  const lastClickedRef = useRef(null);
  const intervalRef = useRef(null);
  const isFirstRender = useRef(true); //Serve per risolvere il double render dell'useEffect che carica i valori del round


  useEffect(() => {
                                      //
    const loadRoundContent = async () => {
      if (currentRound === 1 && props.logged === true) {
        const res=await API.create_game(props.user.id);
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

    if (isFirstRender.current) {
      isFirstRender.current = false;
    } else {
      loadRoundContent();
    }
    resetTimer();  //faccio ripartire il timer ogni cambio round
  }, [currentRound]);

  useEffect(() => {
    if (timer === 0) {
      handleNextClick(); //se il timer si azzera è come se l'utente cliccasse avanti
    }
  }, [timer]);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  const resetTimer = () => {
    clearInterval(intervalRef.current);
    setTimer(30);
    intervalRef.current = setInterval(() => {
      setTimer(prevTimer => prevTimer - 1);
    }, 1000);
  };

  const handleCaptionClick = async (event, caption) => {
    if (isAnswerSelected) return;
    clearInterval(intervalRef.current);
    if (lastClickedRef.current) {
      lastClickedRef.current.classList.remove('correct', 'wrong');
    }
    const isCorrect = roundContent.rightCaptions.some(rc => rc.id === caption.id);
    if (isCorrect) {
      setSummaryData(prevSummaryData => [
        ...prevSummaryData,
        {
          answer: caption.text,
          memeImg: roundContent.meme.filename
        }
      ]);
      event.target.classList.add('correct');     
    } else {
      event.target.classList.add('wrong');
      setShowPopup(true);
    }

    lastClickedRef.current = event.target;
    setIsAnswerSelected(true);
    await API.add_round(matchId, props.user.id, roundContent.meme.filename, caption.text, isCorrect);
  };

  const handleNextClick = () => {
    if (currentRound < 3) {
      setCurrentRound(currentRound + 1);
      setIsAnswerSelected(false);
      if (lastClickedRef.current) {
        lastClickedRef.current.classList.remove('correct', 'wrong');
      }
      resetTimer();
    } else {
      console.log(summaryData);
      alert("quiz finished");
      clearInterval(intervalRef.current);
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
