const fs = require('fs');

function isInvalid(n) {
  const s = n.toString();
  const len = s.length;

  for (let l = 1; l <= len / 2; l++) {
    if (len % l === 0) {
      const pattern = s.substring(0, l);
      if (pattern[0] === '0') continue;
      const repetitions = len / l;
      if (pattern.repeat(repetitions) === s) {
        return true;
      }
    }
  }

  return false;
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
