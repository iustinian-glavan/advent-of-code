const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
const lines = input.split('\n').filter(line => line.length > 0);

let totalJoltage = 0;

for (const line of lines) {
  let maxJoltageForBank = 0;
  for (let i = 0; i < line.length; i++) {
    for (let j = i + 1; j < line.length; j++) {
      const joltage = parseInt(line[i] + line[j], 10);
      if (joltage > maxJoltageForBank) {
        maxJoltageForBank = joltage;
      }
    }
  }
  totalJoltage += maxJoltageForBank;
}

console.log(totalJoltage);
