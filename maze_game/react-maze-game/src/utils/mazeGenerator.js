// src/utils/mazeGenerator.js

export const generateMaze = (width, height) => {
    // Initialize maze with walls
    const maze = Array(height)
      .fill(null)
      .map(() => Array(width).fill(1));
  
    // Directions: [dx, dy]
    const directions = [
      [0, -1], // Up
      [1, 0],  // Right
      [0, 1],  // Down
      [-1, 0], // Left
    ];
  
    // Helper function to shuffle directions
    const shuffle = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };
  
    /**
     * Carves paths in the maze recursively.
     * @param {number} x - Current x position.
     * @param {number} y - Current y position.
     */
    const carvePath = (x, y) => {
      maze[y][x] = 0; // Mark current cell as path
      const shuffledDirections = shuffle([...directions]);
  
      for (const [dx, dy] of shuffledDirections) {
        const nx = x + dx * 2;
        const ny = y + dy * 2;
  
        // Check if the new position is within bounds and is a wall
        if (
          ny > 0 &&
          ny < height - 1 &&
          nx > 0 &&
          nx < width - 1 &&
          maze[ny][nx] === 1
        ) {
          maze[y + dy][x + dx] = 0; // Remove wall between
          carvePath(nx, ny);        // Recursively carve from the new cell
        }
      }
    };
  
    // Start carving from (1,1)
    carvePath(1, 1);
  
    // Define start and goal positions
    maze[1][1] = 2;                   // Start
    maze[height - 2][width - 2] = 3; // Goal
  
    return maze;
  };
  