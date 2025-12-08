const fs = require('fs');

function solve() {
  const inputFile = process.argv[2];
  if (!inputFile) {
    console.error('Please provide an input file path.');
    process.exit(1);
  }

  fs.readFile(inputFile, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file: ${err}`);
      process.exit(1);
    }

    const rotations = data.trim().split('\n').filter(line => line.length > 0);
    let pos = 50;
    let total_zeros = 0;

    for (const rotation of rotations) {
      const direction = rotation[0];
      const value = parseInt(rotation.substring(1), 10);
      const start = pos;

      if (direction === 'R') {
        pos = (start + value) % 100;
        total_zeros += Math.floor((start + value) / 100);
      } else if (direction === 'L') {
        let zeros_for_step = Math.floor(value / 100);
        const rem = value % 100;
        if (rem > 0 && start > 0 && rem >= start) {
            zeros_for_step++;
        }
        total_zeros += zeros_for_step;
        pos = ((start - value) % 100 + 100) % 100;
      }
    }

    console.log(total_zeros);
  });
}

solve();
