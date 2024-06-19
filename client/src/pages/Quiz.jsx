import React, { useState, useEffect, useRef } from "react";
import "./Quiz.css";
import API from '../services/API';

const Quiz = () => {
  const [roundContent, setRoundContent] = useState(null);
  const [error, setError] = useState(null);
  const [currentRound, setCurrentRound] = useState(1);
  const [isAnswerSelected, setIsAnswerSelected] = useState(false);
  const [timer, setTimer] = useState(30);
  const lastClickedRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const loadRoundContent = async () => {
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

    loadRoundContent();
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

  const handleCaptionClick = (event, caption) => {
    if (isAnswerSelected) return;
    clearInterval(intervalRef.current);
    if (lastClickedRef.current) {
      lastClickedRef.current.classList.remove('correct', 'wrong');
    }
    
    if (roundContent.rightCaptions.some(rc => rc.id === caption.id)) {
      event.target.classList.add('correct');
    } else {
      event.target.classList.add('wrong');
    }

    lastClickedRef.current = event.target;
    setIsAnswerSelected(true);
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
      alert("Quiz Finished!");
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
      <h1>Quiz App</h1>
      <hr />
      <h2>Which caption matches this meme?</h2>
      <img src={`http://localhost:3001/resources/${meme.filename}`} alt="Meme" className="meme-image" />
      <ul>
        {captions.map((caption, index) => (
          <li
            key={index}
            onClick={(event) => handleCaptionClick(event, caption)}
          >
            {caption.text}
          </li>
        ))}
      </ul>
      <button onClick={handleNextClick} disabled={!isAnswerSelected}>Avanti</button>
      <div className="index">{currentRound} di 3 domande</div>
      <div className="timer">Tempo rimasto: {timer}s</div>
    </div>
  );
};

export default Quiz;
