const fs = require('fs');

function solve(inputPath) {
    const lines = fs.readFileSync(inputPath, 'utf8').split('\n');

    const linesWithoutEmpty = lines.filter(line => line.trim().length > 0);
    if (linesWithoutEmpty.length === 0) {
        return 0;
    }

    const operatorLine = linesWithoutEmpty[linesWithoutEmpty.length - 1];
    const numberLines = linesWithoutEmpty.slice(0, -1);

    // Determine the maximum column length from all lines
    const maxColLength = linesWithoutEmpty.reduce((max, line) => Math.max(max, line.length), 0);

    const problemBlocks = [];
    let currentBlock = []; // This will hold columns for the current problem block

    // Iterate through columns from right to left
    for (let col = maxColLength - 1; col >= 0; col--) {
        let isColumnTrulyEmpty = true;
        for (const line of linesWithoutEmpty) {
            if (col < line.length && line[col] !== ' ') {
                isColumnTrulyEmpty = false;
                break;
            }
        }

        if (!isColumnTrulyEmpty) {
            // Column has content, part of a problem block. Prepend to currentBlock.
            let columnContent = '';
            for (const line of linesWithoutEmpty) {
                columnContent += (col < line.length ? line[col] : ' ');
            }
            currentBlock.unshift({ index: col, content: columnContent });
        } else {
            // Column is empty, potential separator
            if (currentBlock.length > 0) {
                // End of a problem block, push it to problemBlocks and clear currentBlock
                problemBlocks.unshift(currentBlock); // unshift to maintain correct order of problems
                currentBlock = [];
            }
        }
    }

    // Add the last block if it exists
    if (currentBlock.length > 0) {
        problemBlocks.unshift(currentBlock);
    }

    // Now process each problem block
    const problems = [];
    for (const block of problemBlocks) {
        const problemNumbers = [];
        let problemOperator = null;
        
        // Extract operator from the last line (operatorLine) of the block
        // The operator line is the last line in linesWithoutEmpty
        // block contains columns, each column is an object { index: col, content: columnContent }
        // columnContent has all lines characters stacked up.
        // So to get the char from the operator line, we need content[linesWithoutEmpty.length - 1]
        
        // We need to reconstruct the operatorLine segment for this block to find the operator
        let operatorLineSegment = '';
        for(const colData of block) {
            operatorLineSegment += colData.content[linesWithoutEmpty.length - 1];
        }

        const opMatch = operatorLineSegment.match(/[\*|\+]/);
        if (opMatch) {
            problemOperator = opMatch[0];
        }

        // Extract numbers from each column within the block
        for (const colData of block) {
            let currentNumberString = "";
            // Iterate through the content of this single column, excluding the operator line
            for (let rowIdx = 0; rowIdx < numberLines.length; rowIdx++) {
                const char = colData.content[rowIdx];
                if (/\d/.test(char)) { // Check if character is a digit
                    currentNumberString += char;
                }
            }
            if (currentNumberString.length > 0) {
                problemNumbers.push(Number(currentNumberString));
            }
        }
        
        if (problemOperator && problemNumbers.length > 0) {
            problems.push({ operator: problemOperator, numbers: problemNumbers });
        }
    }
    
    let grandTotal = 0;
    for (const problem of problems) {
        let result = 0;
        if (problem.operator === '+') {
            result = problem.numbers.reduce((a, b) => a + b, 0);
        } else if (problem.operator === '*') {
            result = problem.numbers.reduce((a, b) => a * b, 1);
        }
        grandTotal += result;
    }

    return grandTotal;
}

const total = solve('input.txt');
console.log(total);
