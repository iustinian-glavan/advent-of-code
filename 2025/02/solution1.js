const fs = require('fs');

function isInvalid(n) {
  const s = n.toString();
  if (s.length % 2 !== 0) {
    return false;
  }
  const half = s.length / 2;
  const first = s.substring(0, half);
  const second = s.substring(half);
  return first === second && first[0] !== '0';
}

fs.readFile('input.txt', 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const ranges = data.trim().split(',');
  let totalSum = 0;

  for (const range of ranges) {
    const [start, end] = range.split('-').map(Number);
    for (let i = start; i <= end; i++) {
      if (isInvalid(i)) {
        totalSum += i;
      }
    }
  }

  console.log(totalSum);
});
