const fs = require('fs');

function solve(inputPath) {
    const lines = fs.readFileSync(inputPath, 'utf8').split('\n');

    const linesWithoutEmpty = lines.filter(line => line.trim().length > 0);
    if (linesWithoutEmpty.length === 0) {
        return 0;
    }

    const operatorLine = linesWithoutEmpty[linesWithoutEmpty.length - 1];
    const numberLines = linesWithoutEmpty.slice(0, -1);

    const problems = [];
    let currentProblem = null;
    let problemStartIndex = -1;

    for (let i = 0; i < operatorLine.length; i++) {
        const char = operatorLine[i];

        if (char === '*' || char === '+') {
            if (currentProblem === null) {
                // Start of a new problem
                currentProblem = { operator: char, numbers: [] };
                problemStartIndex = i;
            } else {
                // This shouldn't happen if problems are separated by spaces, but just in case
                // We'll treat this as a new problem starting immediately after the previous one
                problems.push(currentProblem);
                currentProblem = { operator: char, numbers: [] };
                problemStartIndex = i;
            }
        } else if (char === ' ' && currentProblem !== null) {
            // Found a space after an operator, means the problem block ended.
            // But need to ensure it's a *full column* of spaces.
            // This is the tricky part. We need to find the end of the current problem.
            // A problem ends when a sequence of non-space characters (including the operator) 
            // is followed by a sequence of only spaces.

            // To find the actual end of the current problem, we need to scan forward
            // until we find another operator or the end of the line.
            // The problem "block" effectively extends until the next operator or line end.

            // This suggests my initial column-by-column accumulation was more correct for defining problem blocks.
            // Let's re-evaluate how to define problem blocks based on the "full column of spaces" rule.
            
            // The logic should be:
            // 1. Iterate column by column.
            // 2. Identify if a column is *completely empty* (all spaces across all lines).
            // 3. These completely empty columns define boundaries between problems.
            // 4. Any columns between two empty columns (or beginning/end of input) form a problem block.

            // Let's revert to the previous column-by-column structure but fix number extraction.
            // The issue was in `problemString.match(/\d+/g)`. It was flattening everything.
            // We need to extract numbers from each line *individually* within the problem block.
        }
    }
    
    // Reset problems array and rebuild with a different parsing strategy
    problems.length = 0; // Clear existing problems

    const problemBlocks = [];
    let currentBlock = [];
    let inProblemBlock = false;

    // Iterate column by column to identify problem blocks
    for (let col = 0; col < operatorLine.length; col++) {
        let isColumnTrulyEmpty = true;
        for (const line of linesWithoutEmpty) {
            if (col < line.length && line[col] !== ' ') {
                isColumnTrulyEmpty = false;
                break;
            }
        }

        if (!isColumnTrulyEmpty) {
            // Column has content, part of a problem block
            let columnContent = '';
            for (const line of linesWithoutEmpty) {
                columnContent += (col < line.length ? line[col] : ' ');
            }
            currentBlock.push({ index: col, content: columnContent });
            inProblemBlock = true;
        } else {
            // Column is empty, potential separator
            if (inProblemBlock) {
                // End of a problem block
                problemBlocks.push(currentBlock);
                currentBlock = [];
                inProblemBlock = false;
            }
        }
    }

    // Add the last block if it exists
    if (currentBlock.length > 0) {
        problemBlocks.push(currentBlock);
    }

    // Now process each problem block
    for (const block of problemBlocks) {
        const problemNumbers = [];
        let problemOperator = null;
        
        // Extract operator from the last line (operatorLine) of the block
        const lastLineContentInBlock = block.map(col => col.content[linesWithoutEmpty.length - 1]).join('');
        const opMatch = lastLineContentInBlock.match(/[\*|\+]/);
        if (opMatch) {
            problemOperator = opMatch[0];
        }

        // Extract numbers from each number line within the block's columns
        for (let rowIdx = 0; rowIdx < numberLines.length; rowIdx++) {
            const line = numberLines[rowIdx];
            // Get the substring of the line that falls within this problem block's columns
            const firstColIndex = block[0].index;
            const lastColIndex = block[block.length - 1].index;
            const subLine = line.substring(firstColIndex, lastColIndex + 1);
            
            const numbersInSubLine = (subLine.match(/\d+/g) || []).map(Number);
            problemNumbers.push(...numbersInSubLine);
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
