import React from "react";
import { useLocation, Link } from 'react-router-dom';
import "./Summary.css"; 

const Summary = () => {
  const location = useLocation();
  const { state } = location;

  if (!state || !state.summaryData) {
    // Gestione del caso in cui non ci siano dati di riepilogo
    return <div className="summary-container">Nessun dato di riepilogo disponibile.</div>;
  }

  const { summaryData } = state;

  return (
    <div className='summary-container'>
      <h1 className='summary-title'>Riepilogo della partita</h1>
      {summaryData.map((item, index) => (
        <div className='summary-item' key={index}>
          <div className='summary-memeImg'>
            <img src={`http://localhost:3001/resources/${item.memeImg}`} alt='Meme' />
          </div>
          <div className='summary-answer'>Risposta: {item.answer}</div>
        </div>
      ))}
      <div className='summary-btn-container'>
        <Link to='/' className='summary-link'>Torna alla homepage</Link>
      </div>
    </div>
  );
};

export default Summary;
