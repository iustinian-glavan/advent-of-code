const fs = require('fs');

function solve(inputFile) {
    const input = fs.readFileSync(inputFile, 'utf-8');
    const lines = input.split('\n');
    const emptyLineIndex = lines.findIndex(line => line.trim() === '');
    const rangesStr = lines.slice(0, emptyLineIndex).join('\n');
    const availableStr = lines.slice(emptyLineIndex + 1).join('\n');

    const ranges = rangesStr.split('\n').filter(Boolean).map(line => {
        const [start, end] = line.split('-').map(Number);
        return { start, end };
    });

    // Sort ranges by start
    ranges.sort((a, b) => a.start - b.start);

    // Merge overlapping ranges
    const mergedRanges = [];
    if (ranges.length > 0) {
        mergedRanges.push({ ...ranges[0] });
        for (let i = 1; i < ranges.length; i++) {
            const lastRange = mergedRanges[mergedRanges.length - 1];
            const currentRange = ranges[i];
            if (currentRange.start <= lastRange.end) {
                lastRange.end = Math.max(lastRange.end, currentRange.end);
            } else {
                mergedRanges.push({ ...currentRange });
            }
        }
    }

    const availableIds = availableStr.split('\n').filter(Boolean).map(Number);

    let freshCount = 0;
    for (const id of availableIds) {
        // Binary search for the id in mergedRanges
        let low = 0;
        let high = mergedRanges.length - 1;
        let isFresh = false;
        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            const range = mergedRanges[mid];
            if (id >= range.start && id <= range.end) {
                isFresh = true;
                break;
            } else if (id < range.start) {
                high = mid - 1;
            } else {
                low = mid + 1;
            }
        }

        if (isFresh) {
            freshCount++;
        }
    }

    console.log(freshCount);
}

solve('input.txt');