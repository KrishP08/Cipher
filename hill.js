function generateMatrixInputs() {
    const matrixSize = parseInt(document.getElementById("matrix-size").value);
    const matrixInputs = document.getElementById("matrix-inputs");
    matrixInputs.innerHTML = '';

    // Dynamically generate matrix inputs based on the matrix size
    for (let row = 0; row < matrixSize; row++) {
        for (let col = 0; col < matrixSize; col++) {
            matrixInputs.innerHTML += `<input class="matrix-cell" type="number" id="key-${row}-${col}" placeholder="[${row + 1}, ${col + 1}]"> `;
        }
        matrixInputs.innerHTML += '<br>';
    }
}

generateMatrixInputs();  // Initialize the default 3x3 matrix

function getKeyMatrix(matrixSize) {
    let keyMatrix = [];
    for (let row = 0; row < matrixSize; row++) {
        let rowArray = [];
        for (let col = 0; col < matrixSize; col++) {
            let value = parseInt(document.getElementById(`key-${row}-${col}`).value);
            rowArray.push(value);
        }
        keyMatrix.push(rowArray);
    }
    return keyMatrix;
}

function padPlaintext(plaintext, matrixSize) {
    while (plaintext.length % matrixSize !== 0) {
        plaintext += 'X';  // Padding plaintext with 'X' to match matrix size
    }
    return plaintext;
}

function divideString(inputString, chunkSize) {
    let parts = [];
    for (let i = 0; i < inputString.length; i += chunkSize) {
        parts.push(inputString.slice(i, i + chunkSize));
    }
    return parts;
}

function textToNumbers(text) {
    return text.split('').map(char => char.charCodeAt(0) - 'A'.charCodeAt(0));
}

function numbersToText(nums) {
    return nums.map(num => String.fromCharCode((num % 26) + 'A'.charCodeAt(0))).join('');
}

function multiplyMatrixVector(keyMatrix, plaintextVector, partIndex) {
    let result = [];
    let explanation = `<strong>Step 3 - Matrix Multiplication for Part ${partIndex + 1}:</strong><br>`;
    explanation += `Matrix = [ <br>`;

    let intermediateSums = [];
    let calcSteps = [];
    for (let row = 0; row < keyMatrix.length; row++) {
        let sum = 0;
        let rowExplanations = [];
        let rowCalc = [];
        for (let col = 0; col < plaintextVector.length; col++) {
            sum += keyMatrix[row][col] * plaintextVector[col];
            rowExplanations.push(`(${keyMatrix[row][col]} * ${plaintextVector[col]})`);
            rowCalc.push(`${keyMatrix[row][col] * plaintextVector[col]}`);
        }
        result.push(sum);
        intermediateSums.push(`[ ${rowExplanations.join(" + ")} ]`);
        calcSteps.push(`[ ${rowCalc.join(" + ")} ]`);
    }

    explanation += intermediateSums.join("<br>") + "<br>";
    explanation += `<br>Intermediate Result: [<br>${calcSteps.join("<br>")}]<br>`;
    explanation += `<br>Raw Matrix Result: [ [${result.join("],<br>  [")}] ]<br>`;

    return { result, explanation };
}

function inverseMatrix(matrix) {
    // Implement your matrix inversion logic here
    // Placeholder for inverse logic
    return matrix; // Return the matrix as-is for now
}

function runHillCipher(mode) {
    const matrixSize = parseInt(document.getElementById("matrix-size").value);
    const keyMatrix = getKeyMatrix(matrixSize);
    let outputDiv = document.getElementById('output');
    outputDiv.innerHTML = '';  // Clear previous output

    if (mode === 'encrypt') {
        // Encryption logic
        let plaintext = document.getElementById("plaintext").value.toUpperCase().replace(/\s+/g, '');
        plaintext = padPlaintext(plaintext, matrixSize);
        const parts = divideString(plaintext, matrixSize);
        let ciphertext = '';

        for (let i = 0; i < parts.length; i++) {
            outputDiv.innerHTML += `<strong>Hill Cipher For Part ${i + 1}: ${parts[i]}</strong><br>`;
            
            let plaintextNums = textToNumbers(parts[i]);
            outputDiv.innerHTML += `Step 1 - Plaintext to Numbers: [${plaintextNums}]<br>`;

            let plaintextVector = plaintextNums.map(num => [num]);
            outputDiv.innerHTML += `Step 2 - Reshaped Plaintext Matrix:<br>`;
            outputDiv.innerHTML += `[[${plaintextVector.join('],<br> [')}]]<br><br>`;

            let { result, explanation } = multiplyMatrixVector(keyMatrix, plaintextNums, i);
            outputDiv.innerHTML += explanation;

            let cipherVector = result.map(num => num % 26);
            outputDiv.innerHTML += `Step 4 - Matrix After Modulo 26:<br>`;
            outputDiv.innerHTML += `[[${cipherVector.join('],<br> [')}]]<br><br>`;

            let cipherPart = numbersToText(cipherVector);
            outputDiv.innerHTML += `Step 5 - Ciphertext: ${cipherPart}<br><br>`;
            
            ciphertext += cipherPart;
        }

        outputDiv.innerHTML += `<strong>Final Ciphertext: ${ciphertext}</strong>`;
    } else if (mode === 'decrypt') {
        // Decryption logic
        let ciphertext = document.getElementById("ciphertext").value.toUpperCase().replace(/\s+/g, '');
        const inverseKeyMatrix = inverseMatrix(keyMatrix);  // Calculate inverse key matrix
        const parts = divideString(ciphertext, matrixSize);
        let decryptedText = '';

        for (let i = 0; i < parts.length; i++) {
            outputDiv.innerHTML += `<strong>Decryption For Part ${i + 1}: ${parts[i]}</strong><br>`;
            let cipherNums = textToNumbers(parts[i]);
            outputDiv.innerHTML += `Step 1 - Ciphertext to Numbers: [${cipherNums}]<br>`;

            let { result, explanation } = multiplyMatrixVector(inverseKeyMatrix, cipherNums, i);
            outputDiv.innerHTML += explanation;

            let decryptedVector = result.map(num => num % 26);
            outputDiv.innerHTML += `Step 4 - Matrix After Modulo 26:<br>`;
            outputDiv.innerHTML += `[[${decryptedVector.join('],<br> [')}]]<br><br>`;

            let decryptedPart = numbersToText(decryptedVector);
            outputDiv.innerHTML += `Step 5 - Decrypted Text: ${decryptedPart}<br><br>`;
            decryptedText += decryptedPart;
        }

        outputDiv.innerHTML += `<strong>Final Decrypted Text: ${decryptedText}</strong>`;
    }
}
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