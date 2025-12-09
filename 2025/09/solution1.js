const fs = require('fs');
const path = require('path');

// Read the input file
const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');

// Parse the coordinates
const coords = input.trim().split('\n').map(line => {
    const [x, y] = line.split(',').map(Number);
    return { x, y };
});

let maxArea = 0;

// Iterate over all pairs of coordinates
for (let i = 0; i < coords.length; i++) {
    for (let j = i + 1; j < coords.length; j++) {
        const p1 = coords[i];
        const p2 = coords[j];

        const area = (Math.abs(p1.x - p2.x) + 1) * (Math.abs(p1.y - p2.y) + 1);

        if (area > maxArea) {
            maxArea = area;
        }
    }
}

console.log(maxArea);
