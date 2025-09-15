import { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import "./Snake.css";

const BOARD_SIZE = 15;
const INITIAL_SNAKE = [[7, 7]];
const MOVE_INTERVAL = 200;

// ✅ Safe food generation (never spawns inside snake)
function generateFood(snakeCells = []) {
  let newFood;
  let attempts = 0;
  do {
    newFood = [
      Math.floor(Math.random() * BOARD_SIZE),
      Math.floor(Math.random() * BOARD_SIZE)
    ];
    attempts++;
  } while (
    snakeCells.some(([x, y]) => x === newFood[0] && y === newFood[1]) &&
    attempts < 100
  );
  return newFood;
}

export default function Snake() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState(generateFood(INITIAL_SNAKE));
  const [dir, setDir] = useState("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const [timePlayed, setTimePlayed] = useState(0);

  // refs for reliable game loop
  const snakeRef = useRef(snake);
  const foodRef = useRef(food); // Added food ref
  const dirRef = useRef(dir);
  const intervalRef = useRef(null);
  const timerRef = useRef(null);

  // ✅ Fixed moveSnake - using foodRef instead of food state
  const moveSnake = () => {
    const currentSnake = snakeRef.current;
    const currentDir = dirRef.current;
    const head = currentSnake[currentSnake.length - 1];
    let newHead;

    switch (currentDir) {
      case "UP": newHead = [head[0], head[1] - 1]; break;
      case "DOWN": newHead = [head[0], head[1] + 1]; break;
      case "LEFT": newHead = [head[0] - 1, head[1]]; break;
      case "RIGHT": newHead = [head[0] + 1, head[1]]; break;
      default: newHead = head;
    }

    // collision detection
    if (
      newHead[0] < 0 || newHead[0] >= BOARD_SIZE ||
      newHead[1] < 0 || newHead[1] >= BOARD_SIZE ||
      currentSnake.some(([x, y]) => x === newHead[0] && y === newHead[1])
    ) {
      setGameOver(true);
      clearInterval(intervalRef.current);
      clearInterval(timerRef.current);
      return;
    }

    let newSnake = [...currentSnake, newHead];

    // ✅ Eat food using foodRef instead of food state
    if (newHead[0] === foodRef.current[0] && newHead[1] === foodRef.current[1]) {
      const freshFood = generateFood(newSnake);
      setFood(freshFood);
      foodRef.current = freshFood; // Update food ref
      if (newSnake.length > highScore) {
        setHighScore(newSnake.length);
      }
    } else {
      // normal move (remove tail)
      newSnake.shift();
    }

    setSnake(newSnake);
    snakeRef.current = newSnake;
  };

  const handleKey = (e) => {
    const newDir =
      e.key === "ArrowUp" ? "UP" :
      e.key === "ArrowDown" ? "DOWN" :
      e.key === "ArrowLeft" ? "LEFT" :
      e.key === "ArrowRight" ? "RIGHT" : dirRef.current;

    // prevent reverse direction
    if (
      (newDir === "UP" && dirRef.current !== "DOWN") ||
      (newDir === "DOWN" && dirRef.current !== "UP") ||
      (newDir === "LEFT" && dirRef.current !== "RIGHT") ||
      (newDir === "RIGHT" && dirRef.current !== "LEFT")
    ) {
      dirRef.current = newDir;
      setDir(newDir);
    }
  };

  const handleMobileControl = (newDir) => {
    if (
      (newDir === "UP" && dirRef.current !== "DOWN") ||
      (newDir === "DOWN" && dirRef.current !== "UP") ||
      (newDir === "LEFT" && dirRef.current !== "RIGHT") ||
      (newDir === "RIGHT" && dirRef.current !== "LEFT")
    ) {
      dirRef.current = newDir;
      setDir(newDir);
    }
  };

  const resetGame = () => {
    const initialSnake = [[Math.floor(BOARD_SIZE / 2), Math.floor(BOARD_SIZE / 2)]];
    const initialFood = generateFood(initialSnake);
    
    setSnake(initialSnake);
    snakeRef.current = initialSnake;
    
    setFood(initialFood);
    foodRef.current = initialFood;
    
    setDir("RIGHT");
    dirRef.current = "RIGHT";
    setGameOver(false);
    setTimePlayed(0);

    clearInterval(intervalRef.current);
    clearInterval(timerRef.current);

    timerRef.current = setInterval(() => setTimePlayed(prev => prev + 1), 1000);
    intervalRef.current = setInterval(moveSnake, MOVE_INTERVAL);
  };

  useEffect(() => {
    // Initialize food ref
    foodRef.current = food;
    
    document.addEventListener("keydown", handleKey);
    timerRef.current = setInterval(() => setTimePlayed(prev => prev + 1), 1000);
    intervalRef.current = setInterval(moveSnake, MOVE_INTERVAL);

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(timerRef.current);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  return (
    <div className="snake-page">
      <Navbar userName="Guest User" />
      <div className="snake-container">
        <h2>🐍 Snake Game</h2>

        <div className="scoreboard">
          <span>High Score: {highScore}</span>
          <span>Time Played: {timePlayed}s</span>
        </div>

        <div className="snake-board">
          {[...Array(BOARD_SIZE)].map((_, row) => (
            <div key={row} className="row">
              {[...Array(BOARD_SIZE)].map((_, col) => {
                const isSnake = snake.some(([x, y]) => x === col && y === row);
                const isFood = food[0] === col && food[1] === row;
                return (
                  <div
                    key={col}
                    className={`cell ${isSnake ? "snake" : ""} ${isFood ? "food" : ""}`}
                  ></div>
                );
              })}
            </div>
          ))}
        </div>

        {gameOver && <div className="gameover">Game Over!</div>}

        {/* ✅ Fixed Reset Button */}
        <div className="reset-btn-container">
          <button className="reset-btn" onClick={resetGame}>
            Reset Game
          </button>
        </div>

        {/* Mobile Controls */}
        <div className="mobile-controls">
          <button onClick={() => handleMobileControl("UP")}>⬆️</button>
          <div>
            <button onClick={() => handleMobileControl("LEFT")}>⬅️</button>
            <button onClick={() => handleMobileControl("DOWN")}>⬇️</button>
            <button onClick={() => handleMobileControl("RIGHT")}>➡️</button>
          </div>
        </div>
      </div>
    </div>
  );
}
