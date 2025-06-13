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
    return null; // In case the character is not found
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

    return encryptedDigraph + result;
}
document.getElementById('cipherForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const operation = document.getElementById('operation').value;
    const key = document.getElementById('key').value;
    const text = document.getElementById('plaintext').value;

    if (operation === 'encrypt') {
        const { result: encResult, ciphertext } = playfairEncrypt(text, key);
        const resultBox = document.getElementById('resultBox');
        document.getElementById('result').textContent = encResult;
        document.getElementById('ciphertext').textContent = ciphertext;
        resultBox.style.display = 'block';
        resultBox.classList.remove('fade-in');
        void resultBox.offsetWidth;
        resultBox.classList.add('fade-in');
        document.getElementById('decryptionResult').style.display = 'none'; // Hide decryption results
    } else if (operation === 'decrypt') {
        const { result: decResult, plaintext } = playfairDecrypt(text, key);
        const decryptionResultBox = document.getElementById('decryptionResult');
        document.getElementById('decryptionResultContent').textContent = decResult;
        decryptionResultBox.style.display = 'block'; // Show decryption results
        decryptionResultBox.classList.remove('fade-in');
        void decryptionResultBox.offsetWidth;
        decryptionResultBox.classList.add('fade-in');
        document.getElementById('resultBox').style.display = 'none'; // Hide encryption results
    }
});


document.getElementById('generateKey').addEventListener('click', function() {
    const randomKey = autoGenerateKey();
    document.getElementById('key').value = randomKey;
});

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
        ciphertext.push(encryptedDigraphResult.slice(0, 2));
    });

    const finalCipher = ciphertext.join('').toUpperCase();
    result += `\nCiphertext: ${finalCipher}\n`;
    return { result, ciphertext: finalCipher };
}

function decryptDigraph(digraph, matrix) {
    const [row1, col1] = findPosition(matrix, digraph[0]);
    const [row2, col2] = findPosition(matrix, digraph[1]);

    let result = `\nProcessing digraph: ${digraph}\n`;
    result += `Positions: ${digraph[0]} -> (${row1},${col1}), ${digraph[1]} -> (${row2},${col2})\n`;

    let decryptedDigraph = '';
    if (row1 === row2) {
        // Same row
        result += "Same row -> moving left\n";
        decryptedDigraph = matrix[row1][(col1 + 4) % 5] + matrix[row2][(col2 + 4) % 5]; // Move left
        result += `${digraph[0]} -> ${matrix[row1][(col1 + 4) % 5]}, ${digraph[1]} -> ${matrix[row2][(col2 + 4) % 5]}\n`;
    } else if (col1 === col2) {
        // Same column
        result += "Same column -> moving up\n";
        decryptedDigraph = matrix[(row1 + 4) % 5][col1] + matrix[(row2 + 4) % 5][col2]; // Move up
        result += `${digraph[0]} -> ${matrix[(row1 + 4) % 5][col1]}, ${digraph[1]} -> ${matrix[(row2 + 4) % 5][col2]}\n`;
    } else {
        // Rectangle swap
        result += "Rectangle -> swapping corners\n";
        decryptedDigraph = matrix[row1][col2] + matrix[row2][col1];
        result += `${digraph[0]} -> ${matrix[row1][col2]}, ${digraph[1]} -> ${matrix[row2][col1]}\n`;
    }
    
    return { result, decrypted: decryptedDigraph };
}

function playfairDecrypt(ciphertext, key) {
    const matrix = generateKeyMatrix(key);
    let result = `Ciphertext: ${ciphertext}\nKey: ${key}\n\nKey Matrix:\n${printMatrix(matrix)}`;

    // Process the ciphertext into digraphs
    const digraphs = processText(ciphertext.toLowerCase().replace(/j/g, 'i'));
    result += `Processed Digraphs: ${JSON.stringify(digraphs)}\n`;

    const decryptedText = [];
    digraphs.forEach(digraph => {
        const { result: digraphResult, decrypted } = decryptDigraph(digraph, matrix);
        result += digraphResult; // Append detailed processing of each digraph
        decryptedText.push(decrypted); // Collect the decrypted characters
    });

    const finalPlaintext = decryptedText.join('');
    result += `\nPlaintext: ${finalPlaintext}\n`;
    return { result, plaintext: finalPlaintext };
}


// Auto-generate random key with a random size between 8 and 17 characters
function autoGenerateKey() {
    const alphabet = "abcdefghiklmnopqrstuvwxyz";
    const randomSize = Math.floor(Math.random() * 10) + 8; // 8 to 17 characters

    let key = '';
    for (let i = 0; i < randomSize; i++) {
        key += alphabet[Math.floor(Math.random() * alphabet.length)];
    }

    return key.toUpperCase(); // Convert to uppercase
}

/*
const menuBtn = document.querySelector('.menu-btn');
const navMenu = document.querySelector('nav ul');

menuBtn.addEventListener('click', function() {
    navMenu.classList.toggle('active');
});
*/