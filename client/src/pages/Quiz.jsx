import React, { useState, useEffect } from "react";
import "./Quiz.css";
import API from '../services/API';

const Quiz = () => {
  const [roundContent, setRoundContent] = useState(null);
  const [selectedCaption, setSelectedCaption] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadRoundContent = async () => {
      try {
        const data = await API.fetchRoundContent();
        setRoundContent(data);
      } catch (error) {
        setError(error.message);
      }
    };

    loadRoundContent();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!roundContent) {
    return <div>Loading...</div>;
  }

  const { meme, rightCaptions, rngCaptions } = roundContent;

  // Combine right captions and random captions, then shuffle them
  const captions = [...rightCaptions, ...rngCaptions].sort(() => Math.random() - 0.5);

  const handleCaptionClick = (caption) => {
    setSelectedCaption(caption);
    if (rightCaptions.some(rc => rc.text === caption.text)) {
      alert("Correct!");
    } else {
      alert("Wrong!");
    }
  };

  return (
    <div className='container'>
      <h1>Quiz App</h1>
      <hr />
      <h2>Which caption matches this meme?</h2>
      <img src={`http://localhost:3001/resources/${meme.filename}`} alt="Meme" className="meme-image" />
      <ul>
        {captions.map((caption, index) => (
          <li key={index} onClick={() => handleCaptionClick(caption)}>{caption.text}</li>
        ))}
      </ul>
      <button>Next</button>
      <div className="index">1 of 5 questions</div>
    </div>
  );
};

export default Quiz;
