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

    const rotations = data.trim().split('\n');
    let position = 50;
    let password = 0;

    for (const rotation of rotations) {
      const direction = rotation[0];
      const distance = parseInt(rotation.substring(1), 10);

      if (direction === 'R') {
        position = (position + distance) % 100;
      } else if (direction === 'L') {
        position = (position - distance) % 100;
        if (position < 0) {
          position += 100;
        }
      }

      if (position === 0) {
        password++;
      }
    }

    console.log(password);
  });
}

solve();
