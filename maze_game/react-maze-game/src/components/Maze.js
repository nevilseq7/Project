
import React, { useState, useEffect } from 'react';
import { generateMaze } from '../utils/mazeGenerator';
import './Maze.css';

const Maze = () => {

  const [maze, setMaze] = useState([]);
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
  const [message, setMessage] = useState('');
  const [time, setTime] = useState(0);
  const [timerActive, setTimerActive] = useState(false);

  useEffect(() => {
    const width = 21;  
    const height = 21; 

    const generatedMaze = generateMaze(width, height);
    setMaze(generatedMaze);
    setPlayerPos(findStartPosition(generatedMaze));
    setTime(0);
    setTimerActive(true);
  }, []);

  useEffect(() => {
    let timer;
    if (timerActive && !message) {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [timerActive, message]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (message) return; // Disable movement after winning

      const { key } = event;
      let newPos = { ...playerPos };

      if (key === 'ArrowUp') newPos = { x: playerPos.x, y: playerPos.y - 1 };
      if (key === 'ArrowDown') newPos = { x: playerPos.x, y: playerPos.y + 1 };
      if (key === 'ArrowLeft') newPos = { x: playerPos.x - 1, y: playerPos.y };
      if (key === 'ArrowRight') newPos = { x: playerPos.x + 1, y: playerPos.y };

      if (
        newPos.y < 0 ||
        newPos.y >= maze.length ||
        newPos.x < 0 ||
        newPos.x >= maze[0].length
      ) {
        return;
      }

      const cell = maze[newPos.y][newPos.x];

      if (cell === 1) {
        return;
      } else if (cell === 3) {
        setPlayerPos(newPos);
        setMessage(`🎉 Congratulations! You reached the goal in ${time} seconds! 🎉`);
        setTimerActive(false);
        return;
      } else {
        setPlayerPos(newPos);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [playerPos, maze, message, time]);

  return (
    <div className="maze-container">
      <h1> React Maze Game</h1>
      <div className="stats">
        <span>Time: {time} s</span>
      </div>
      <div
        className="maze"
        style={{
          gridTemplateColumns: `repeat(${maze[0]?.length || 0}, 30px)`,
          gridTemplateRows: `repeat(${maze.length || 0}, 30px)`,
        }}
      >
        {maze.map((row, rowIndex) =>
          row.map((cell, cellIndex) => {
            let className = 'cell';
            if (cell === 1) className += ' wall';
            if (cell === 0) className += ' path';
            if (cell === 2) className += ' start';
            if (cell === 3) className += ' goal';
            if (playerPos.x === cellIndex && playerPos.y === rowIndex) className += ' player';
            return <div key={`${rowIndex}-${cellIndex}`} className={className}></div>;
          })
        )}
      </div>
      {message && <div className="message">{message}</div>}
    </div>
  );
};

/**
 * Finds the starting position in the maze.
 * @param {number[][]} maze - The generated maze.
 * @returns {{x: number, y: number}} - Starting coordinates.
 */
const findStartPosition = (maze) => {
  for (let y = 0; y < maze.length; y++) {
    for (let x = 0; x < maze[y].length; x++) {
      if (maze[y][x] === 2) {
        return { x, y };
      }
    }
  }
  return { x: 1, y: 1 }; // Default position
};

export default Maze;
