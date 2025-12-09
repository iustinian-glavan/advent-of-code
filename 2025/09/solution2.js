const fs = require('fs');
const path = require('path');

// Read the input file
const input = fs.readFileSync(path.join(__dirname, 'input.txt'), 'utf8');

// Parse the coordinates
const redTiles = input.trim().split('\n').map(line => {
    const [x, y] = line.split(',').map(Number);
    return { x, y };
});

const n = redTiles.length;
let maxArea = 0;

function isPointInside(point, polygon) {
    let intersections = 0;
    const px = point.x;
    const py = point.y;

    for (let i = 0; i < polygon.length; i++) {
        const p1 = polygon[i];
        const p2 = polygon[(i + 1) % polygon.length];

        if (p1.y === p2.y) continue; // Horizontal segments are not crossed by horizontal ray

        if (py < Math.min(p1.y, p2.y) || py >= Math.max(p1.y, p2.y)) {
            continue;
        }

        // x-coordinate of intersection
        const x_intersection = (py - p1.y) * (p2.x - p1.x) / (p2.y - p1.y) + p1.x;

        if (x_intersection > px) {
            intersections++;
        }
    }

    return intersections % 2 === 1;
}

for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
        const p1 = redTiles[i];
        const p2 = redTiles[j];

        const startX = Math.min(p1.x, p2.x);
        const endX = Math.max(p1.x, p2.x);
        const startY = Math.min(p1.y, p2.y);
        const endY = Math.max(p1.y, p2.y);

        let boundaryCrosses = false;
        for (let k = 0; k < n; k++) {
            const q1 = redTiles[k];
            const q2 = redTiles[(k + 1) % n];

            if (q1.y === q2.y) { // Horizontal segment
                if (q1.y > startY && q1.y < endY) {
                    if (Math.max(startX, Math.min(q1.x, q2.x)) < Math.min(endX, Math.max(q1.x, q2.x))) {
                        boundaryCrosses = true;
                        break;
                    }
                }
            } else { // Vertical segment
                if (q1.x > startX && q1.x < endX) {
                    if (Math.max(startY, Math.min(q1.y, q2.y)) < Math.min(endY, Math.max(q1.y, q2.y))) {
                        boundaryCrosses = true;
                        break;
                    }
                }
            }
        }

        if (boundaryCrosses) {
            continue;
        }
        
        // Use a test point just inside one of the corners.
        // Need to find a corner that is not on an edge to select a test point.
        let testPoint = {x: startX + 1, y: startY + 1};

        if (isPointInside(testPoint, redTiles)) {
            const area = (endX - startX + 1) * (endY - startY + 1);
            if (area > maxArea) {
                maxArea = area;
            }
        }
    }
}

console.log(maxArea);
