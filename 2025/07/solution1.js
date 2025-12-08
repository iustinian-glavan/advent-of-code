const fs = require('fs');
const path = require('path');

function solve() {
    const filePath = path.join(__dirname, 'input.txt');
    const input = fs.readFileSync(filePath, 'utf8').trim().split('\n');

    const grid = input.map(line => line.split(''));
    const startCol = grid[0].indexOf('S');

    let beams = new Set([startCol]);
    let splitCount = 0;

    for (let r = 1; r < grid.length; r++) {
        const nextBeams = new Set();
        for (const c of beams) {
            if (r < grid.length) {
                const char = grid[r][c];
                if (char === '^') {
                    splitCount++;
                    if (c > 0) {
                        nextBeams.add(c - 1);
                    }
                    if (c < grid[r].length - 1) {
                        nextBeams.add(c + 1);
                    }
                } else if (char === '.') {
                    nextBeams.add(c);
                }
            }
        }
        beams = nextBeams;
    }

    console.log(splitCount);
}

solve();
