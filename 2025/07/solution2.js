const fs = require('fs');

const solve = (inputFile) => {
  const input = fs.readFileSync(inputFile, 'utf-8');
  const grid = input.split('\n').map(line => line.split(''));

  const startCol = grid[0].indexOf('S');
  const startRow = 0;

  const memo = new Map();

  const countTimelines = (row, col) => {
    if (row >= grid.length) {
      return 1n;
    }

    const key = `${row},${col}`;
    if (memo.has(key)) {
      return memo.get(key);
    }

    if (col < 0 || col >= grid[0].length) {
      // The particle has gone off the sides of the manifold.
      // Based on the problem, this shouldn't happen if we only move left/right from a splitter
      // but as a safeguard, we can say this timeline terminates and doesn't reach the end.
      return 0n;
    }

    const char = grid[row][col];

    let timelines = 0n;
    if (char === '^') {
      timelines = countTimelines(row + 1, col - 1) + countTimelines(row + 1, col + 1);
    } else {
      timelines = countTimelines(row + 1, col);
    }
    
    memo.set(key, timelines);
    return timelines;
  };

  const totalTimelines = countTimelines(startRow + 1, startCol);
  console.log(totalTimelines);
}

solve('input.txt');
