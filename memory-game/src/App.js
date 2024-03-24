import React, { useEffect, useState } from 'react';
import './App.css';
import SingleCard from './components/SingleCard';

const cardImages = [
  { "src": "/img/helmet-1.png", matched: false },
  { "src": "/img/potion-1.png", matched: false },
  { "src": "/img/ring-1.png", matched: false },
  { "src": "/img/scroll-1.png", matched: false },
  { "src": "/img/shield-1.png", matched: false },
  { "src": "/img/sword-1.png", matched: false },
  { "src": "/img/wizard-1.png", matched: false }
];

const difficulties = {
  easy: { time: 25, cards: 8 },
  medium: { time: 35, cards: 12 },
  hard: { time: 45, cards: 14 }
};

function App() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [difficulty, setDifficulty] = useState('easy');
  const [score, setScore] = useState(0);
  const [showVictory, setShowVictory] = useState(false);

  const shuffleCards = () => {
    const { cards: numCards } = difficulties[difficulty];
    const shuffleCards = [...cardImages.slice(0, numCards / 2), ...cardImages.slice(0, numCards / 2)]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setChoiceOne(null);
    setChoiceTwo(null);
    setCards(shuffleCards);
    setTurns(0);
    setTimeLeft(difficulties[difficulty].time); 
    setScore(0);
    setShowVictory(false);
  };

  const handleChoice = (card) => {
    if (!disabled && !card.matched) {
      if (choiceOne) {
        setChoiceTwo(card);
      } else {
        setChoiceOne(card);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1); 
      } else {
        shuffleCards();
      }
    }, 1000); 

    return () => clearTimeout(timer); 
  }, [timeLeft]);

  useEffect(() => {
    shuffleCards();
  }, [difficulty]);

  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);

      if (choiceOne.src === choiceTwo.src) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        resetTurn();
        setScore(score + 3);
      } else {
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);

  useEffect(() => {
    const allMatched = cards.every((card) => card.matched);
    if (allMatched && cards.length > 0) {
      setShowVictory(true);
    }
  }, [cards]);

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prevTurns) => prevTurns + 1);
    setDisabled(false);
  };

  const changeDifficulty = (level) => {
    setDifficulty(level);
  };

  useEffect(() => {
    const allMatched = cards.every((card) => card.matched);
    if (allMatched && cards.length > 0) { 
      restartGame();
    }
  }, [cards]);
  
  const restartGame = () => {
    setTimeout(() => {
      shuffleCards();
      setScore(0);
    }, 3000); 
  };

  return (
    <div className="App">
      <h1>Magic Match</h1>
      <div>
        <button onClick={() => changeDifficulty('easy')}>Easy</button>
        <button onClick={() => changeDifficulty('medium')}>Medium</button>
        <button onClick={() => changeDifficulty('hard')}>Hard</button>
      </div>
      <button onClick={shuffleCards}>New Game</button>

      <div className="card-grid">
        {cards.map((card) => (
          <SingleCard
            key={card.id}
            card={card}
            handleChoice={handleChoice}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            disabled={disabled}
          />
        ))}
      </div>
      <p>Turns: {turns}</p>
      <p>Time left: {timeLeft} seconds</p>
      <p>Score: {score}</p>
      {showVictory && (
        <div className="victory-animation">
          <h2>Congratulations!</h2>
          <p>You have won the game!</p>
        </div>
      )}
    </div>
  );
}

export default App;
