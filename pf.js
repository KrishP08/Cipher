function generateKeyMatrix(key) {
    key = key.replace(/j/g, 'i').toLowerCase();
    let seen = new Set();
    let matrix = [];

    for (let char of key) {
        if (!seen.has(char) && /[a-z]/.test(char)) {
            seen.add(char);
            matrix.push(char);
        }
    }

    const alphabet = "abcdefghiklmnopqrstuvwxyz";
    for (let char of alphabet) {
        if (!seen.has(char)) {
            matrix.push(char);
        }
    }

    return [matrix.slice(0, 5), matrix.slice(5, 10), matrix.slice(10, 15), matrix.slice(15, 20), matrix.slice(20)];
}

function findPosition(matrix, char) {
    for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 5; col++) {
            if (matrix[row][col] === char) {
                return [row, col];
            }
        }
    }
    return null;
}

function processText(plaintext) {
    let processedText = [];
    let i = 0;

    while (i < plaintext.length) {
        if (i + 1 < plaintext.length && plaintext[i] === plaintext[i + 1]) {
            processedText.push(plaintext[i], 'x');
            i++;
        } else {
            processedText.push(plaintext[i]);
            if (i + 1 < plaintext.length) {
                processedText.push(plaintext[i + 1]);
            } else {
                processedText.push('x');
            }
            i += 2;
        }
    }

    return processedText.join('').match(/.{1,2}/g);
}

function printMatrix(matrix, highlightPositions = []) {
    let result = "";
    for (let row = 0; row < 5; row++) {
        let rowDisplay = [];
        for (let col = 0; col < 5; col++) {
            let char = matrix[row][col];
            if (highlightPositions.some(pos => pos[0] === row && pos[1] === col)) {
                rowDisplay.push(`[${char}]`);
            } else {
                rowDisplay.push(` ${char} `);
            }
        }
        result += rowDisplay.join('') + "\n";
    }
    return result;
}

function encryptDigraph(digraph, matrix) {
    const [row1, col1] = findPosition(matrix, digraph[0]);
    const [row2, col2] = findPosition(matrix, digraph[1]);
    
    let result = `\nProcessing digraph: ${digraph}\n`;
    result += `Positions: ${digraph[0]} -> (${row1},${col1}), ${digraph[1]} -> (${row2},${col2})\n`;

    let encryptedDigraph = '';
    if (row1 === row2) {
        result += "Same row -> moving right\n";
        result += printMatrix(matrix, [[row1, col1], [row2, col2]]);
        encryptedDigraph = matrix[row1][(col1 + 1) % 5] + matrix[row2][(col2 + 1) % 5];
        result += `${digraph[0]} -> ${matrix[row1][(col1 + 1) % 5]}, ${digraph[1]} -> ${matrix[row2][(col2 + 1) % 5]}\n`;
    } else if (col1 === col2) {
        result += "Same column -> moving down\n";
        result += printMatrix(matrix, [[row1, col1], [row2, col2]]);
        encryptedDigraph = matrix[(row1 + 1) % 5][col1] + matrix[(row2 + 1) % 5][col2];
        result += `${digraph[0]} -> ${matrix[(row1 + 1) % 5][col1]}, ${digraph[1]} -> ${matrix[(row2 + 1) % 5][col2]}\n`;
    } else {
        result += "Rectangle -> swapping corners\n";
        result += printMatrix(matrix, [[row1, col1], [row2, col2]]);
        encryptedDigraph = matrix[row1][col2] + matrix[row2][col1];
        result += `${digraph[0]} -> ${matrix[row1][col2]}, ${digraph[1]} -> ${matrix[row2][col1]}\n`;
    }
    
    result += `cp:-${encryptedDigraph.toLowerCase()}\n`; // Add the cp output
    return encryptedDigraph + result;
}

function playfairEncrypt(plaintext, key) {
    const matrix = generateKeyMatrix(key);
    let result = `Plaintext: ${plaintext}\nKey: ${key}\n\nKey Matrix:\n${printMatrix(matrix)}`;
    
    plaintext = plaintext.toLowerCase().replace(/j/g, 'i').replace(/ /g, "");
    const digraphs = processText(plaintext);
    result += `Processed Digraphs: ${JSON.stringify(digraphs)}\n`;

    const ciphertext = [];
    digraphs.forEach(digraph => {
        const encryptedDigraphResult = encryptDigraph(digraph, matrix);
        result += encryptedDigraphResult;
        ciphertext.push(encryptedDigraphResult.slice(0, 2)); // Get only the encrypted digraph
    });
    
    const finalCipher = ciphertext.join('').toUpperCase();
    result += `\nCiphertext: ${finalCipher}\n`;
    result += `Ciphertext:\n${finalCipher}\n`;
    return { result, ciphertext: finalCipher };
}

document.getElementById('cipherForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const key = document.getElementById('key').value;
    const plaintext = document.getElementById('plaintext').value;

    const { result, ciphertext } = playfairEncrypt(plaintext, key);
    document.getElementById('result').textContent = result;
    document.getElementById('ciphertext').textContent = ciphertext;
    document.getElementById('resultBox').style.display = 'block';
});
/*
const menuBtn = document.querySelector('.menu-btn');
const navMenu = document.querySelector('nav ul');

menuBtn.addEventListener('click', function() {
    navMenu.classList.toggle('active');
});
*/
document.querySelector('.menu-btn').addEventListener('click', function() {
    document.querySelector('.sidebar').classList.toggle('open');
});