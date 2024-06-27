import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./Quiz.css";
import API from '../services/API';

const Quiz = (props) => {
  const [matchId, setMatchId] = useState(-1); //ID partita, di default è -1, ciò mi permette di gestire anche l'ospite
  const [roundContent, setRoundContent] = useState(null); //contenuto del round (memes e didascalie)
  const [error, setError] = useState(null); //errore chiamate API
  const [currentRound, setCurrentRound] = useState(1); //Contatore round
  const [isAnswerSelected, setIsAnswerSelected] = useState(false); //Permette di capire se una risposta è stata selezionata o meno 
  const [timer, setTimer] = useState(30); //Timer del round
  const [showPopup, setShowPopup] = useState(false); //popup in grado di mostrare le risposte corrette (se l'utente seleziona la risposta sbagliata)
  const [summaryData, setSummaryData] = useState([]); //buffer locale che salva solo le risposte corrette (serve per il riepilogo) 
  const [intervalId, setIntervalId] = useState(null);//serve per la gestione del timer e garantire che ci sia solo un timer attivo contemporaneamente
  const [isTimerExpired, setIsTimerExpired] = useState(false);
  let firstLoad = false; //variabile utilizzata per gestire per il double rendering
  const navigate = useNavigate();


  useEffect(() => {
    if (firstLoad === false) {  //risolvo il problema del doppio rendering che si verifica al montaggio del componente
      loadRoundContent();
      resetTimer();
      firstLoad = true;
      return () => {
        if (intervalId) clearInterval(intervalId);
      };
    }
    firstLoad = false;
  }, [currentRound]); //rendering ogni volta che viene cambiamento il round

  useEffect(() => {
    if (timer === 0) {
      setShowPopup(true);
      setIsTimerExpired(true);
      if (intervalId) clearInterval(intervalId);
    }
  }, [timer]);

  const loadRoundContent = async () => {
    if (currentRound === 1 && props.logged) { //gestione utente registrati
      const res = await API.create_game(props.user.id);
      setMatchId(res.game_id);
    }
    try {
      const data = await API.fetchRoundContent(matchId);
      if (data) {
        const { meme,rightCaptions, rngCaptions } = data;
        const shuffledCaptions = [...rightCaptions, ...rngCaptions].sort(() => Math.random() - 0.5); //mescolo per non avere le risposte giuste sempre allo stesso posto
        setRoundContent({ ...data, captions: shuffledCaptions });  
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const resetTimer = () => {
    if (intervalId) clearInterval(intervalId);
    setTimer(30);
    const id = setInterval(() => {  //ID univoco timer
      setTimer(prevTimer => prevTimer - 1);  //ogni secondo il timer viene diminuito di 1 secondo
    }, 1000);
    setIntervalId(id);
  };

  const handleCaptionClick = async (event, caption) => { //Gestione selezione risposta
    firstLoad = false;
    if (isAnswerSelected) return; //se è già stata cliccata una risposta non fare nulla
    if (intervalId) clearInterval(intervalId);
    const isCorrect = roundContent.rightCaptions.some(rc => rc.id === caption.id); //controllo se la risposta è giusta
    if (isCorrect) {
      event.target.classList.add('correct'); //aggiungo il css "verde"
      setSummaryData(prevSummaryData => [   //buffer locale per salvare le risposte giuste e i meme
        ...prevSummaryData,
        {
          answer: caption.text,
          memeImg: roundContent.meme.filename
        }
      ]);
    }
    else {
      event.target.classList.add('wrong'); //aggiungo il css "rosso"
      setShowPopup(true); //se la risposta è errata devo mostrare il popup con le risposte giuste
    }
    setIsAnswerSelected(true);
    await API.add_round(matchId, props.user.id, roundContent.meme.filename, caption.text, isCorrect);
  };

  const handleNextClick = async () => { //gestisce il click successivo a quello della selezione della risposta
    if(props.logged===false)
      navigate("/"); //se sta giocando un ospite dopo il primo round viene mandato alla home
    document.querySelectorAll('.risposte li').forEach(element => {
      element.classList.remove('correct', 'wrong');
    });  //resetto il css dalle risposte ogni fine round
    if (currentRound < 3) {
      setCurrentRound(currentRound + 1);
      setIsAnswerSelected(false);
    } else {
      await API.updateScore(summaryData.length*5,matchId); //se la partità è finita aggiorno il punteggio e indirizzo l'utente al riepilogo partita
      navigate('/summary', { state: { summaryData } });
      if (intervalId) clearInterval(intervalId);  //stop del timer
    }
  };

  if (error) {
    return <div>Errore</div>;  //se non è ancora stato caricato il contenuto del round mostra la scritta
  }

  if (!roundContent) {
    return <div>Caricamento in corso...</div>;  //se non è ancora stato caricato il contenuto del round mostra la scritta
  }

  const { meme, captions } = roundContent;

  return (
    <div className='container'>
      <h1>Gioco dei Meme</h1>
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
      <button onClick={handleNextClick} disabled={!isAnswerSelected && !isTimerExpired}>{props.logged ? 'Avanti' : 'Fine'}</button> 
      <div className="index">
      {props.logged ? `${currentRound} di 3 domande` : '1 di 1 domanda'}
      </div>
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
