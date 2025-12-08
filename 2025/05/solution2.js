const fs = require('fs');

function solve(inputFile) {
    const input = fs.readFileSync(inputFile, 'utf-8');
    const lines = input.split('\n');
    const emptyLineIndex = lines.findIndex(line => line.trim() === '');
    const rangesStr = lines.slice(0, emptyLineIndex).join('\n');

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

    // Calculate the total number of fresh IDs
    let totalFreshIds = 0;
    for (const range of mergedRanges) {
        totalFreshIds += range.end - range.start + 1;
    }

    console.log(totalFreshIds);
}

solve('input.txt');
