const fs = require('fs');
const path = require('path');

const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');
const lines = input.split('\n').map(line => line.trim()).filter(line => line.length > 0);

let totalJoltage = 0n;

for (const line of lines) {
  const k = 12;
  const s = line;
  const n = s.length;
  let removals = n - k;
  const stack = [];

  for (const digit of s) {
    while (stack.length > 0 && stack[stack.length - 1] < digit && removals > 0) {
      stack.pop();
      removals--;
    }
    stack.push(digit);
  }

  while (stack.length > k) {
    stack.pop();
  }

  const numberString = stack.join('');
  if (numberString.length === k) {
    totalJoltage += BigInt(numberString);
  }
}

console.log(totalJoltage.toString());
