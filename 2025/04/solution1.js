const fs = require('fs');

function solve(input) {
    const grid = input.split('\n').map(line => line.split(''));
    let accessibleRolls = 0;

    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            if (grid[r][c] === '@') {
                let adjacentRolls = 0;
                for (let dr = -1; dr <= 1; dr++) {
                    for (let dc = -1; dc <= 1; dc++) {
                        if (dr === 0 && dc === 0) {
                            continue;
                        }

                        const nr = r + dr;
                        const nc = c + dc;

                        if (nr >= 0 && nr < grid.length && nc >= 0 && nc < grid[r].length && grid[nr][nc] === '@') {
                            adjacentRolls++;
                        }
                    }
                }

                if (adjacentRolls < 4) {
                    accessibleRolls++;
                }
            }
        }
    }

    return accessibleRolls;
}

const filePath = process.argv[2];
if (!filePath) {
    console.error('Please provide a file path as an argument.');
    process.exit(1);
}

fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.error(`Error reading file: ${err}`);
        process.exit(1);
    }

    const result = solve(data);
    console.log(`Number of accessible rolls of paper: ${result}`);
});
