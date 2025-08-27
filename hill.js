function generateMatrixInputs() {
    const matrixSizeInput = document.getElementById('matrix-size');
    const matrixSize = parseInt(matrixSizeInput.value);
    const matrixInputsContainer = document.getElementById('matrix-inputs');

    // Error Handling/Validation
    if (isNaN(matrixSize) || matrixSize < parseInt(matrixSizeInput.min) || matrixSize > parseInt(matrixSizeInput.max)) {
        console.error("Invalid matrix size entered.");
        matrixInputsContainer.innerHTML = `<p style="color: var(--dark-output-strong-color, #ff6b6b);">Invalid matrix size. Please enter a number between ${matrixSizeInput.min} and ${matrixSizeInput.max}.</p>`;
        return;
    }

    // Clear Existing Inputs
    matrixInputsContainer.innerHTML = '';

    // Set CSS Grid properties on the container
    matrixInputsContainer.style.setProperty('--matrix-size', matrixSize); // Pass size to CSS

    // Nested Loops to Create Cells
    for (let i = 0; i < matrixSize; i++) {
        for (let j = 0; j < matrixSize; j++) {
            const cell = document.createElement('input');
            cell.type = 'number';
            cell.classList.add('matrix-cell');
            cell.id = `key-${i}-${j}`; // Kept original ID format for getKeyMatrix
            // cell.placeholder = "0"; // Optional: if needed
            matrixInputsContainer.appendChild(cell);
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    generateMatrixInputs();  // Initialize the matrix
});

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
    outputDiv.classList.remove('result-fade-in'); // Remove class if already present
    void outputDiv.offsetWidth; // Trigger reflow

    // Validate key matrix
    for (let row of keyMatrix) {
        for (let cell of row) {
            if (isNaN(cell)) {
                alert("Please fill in the entire key matrix.");
                return;
            }
        }
    }

    if (mode === 'encrypt') {
        // Encryption logic
        let plaintext = document.getElementById("plaintext").value.toUpperCase().replace(/\s+/g, '');
        if (!plaintext) {
            alert("Please enter plaintext.");
            return;
        }
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
        if (!ciphertext) {
            alert("Please enter ciphertext.");
            return;
        }
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
    outputDiv.classList.add('result-fade-in'); // Add animation class after content is set
}
/*
const menuBtn = document.querySelector('.menu-btn');
const navMenu = document.querySelector('nav ul');

menuBtn.addEventListener('click', function() {
    navMenu.classList.toggle('active');
});
*/
function generateRandomKeyMatrix() {
    const matrixSize = parseInt(document.getElementById("matrix-size").value);
    
    // Generate random key values and fill them into the matrix
    for (let row = 0; row < matrixSize; row++) {
        for (let col = 0; col < matrixSize; col++) {
            let randomValue = Math.floor(Math.random() * 26); // Random number between 0 and 25
            document.getElementById(`key-${row}-${col}`).value = randomValue;
        }
    }
}
function generateRandomPlaintext() {
    const matrixSize = parseInt(document.getElementById("matrix-size").value);
    const randomLength = matrixSize * Math.floor(Math.random() * 5 + 1); // Random length multiple of matrix size
    let randomPlaintext = '';

    for (let i = 0; i < randomLength; i++) {
        const randomChar = String.fromCharCode(Math.floor(Math.random() * 26) + 'A'.charCodeAt(0)); // Random letter from A-Z
        randomPlaintext += randomChar;
    }

    document.getElementById("plaintext").value = randomPlaintext; // Set the generated random plaintext
}

// Function to toggle the "How to Use" section
function toggleHowToUse() {
    const howToUseContent = document.getElementById("howToUseContent");
    const button = document.querySelector(".how-to-use-section .expand-btn");

    if (howToUseContent.style.display === "block") {
        howToUseContent.style.display = "none";
        button.textContent = "How to Use";
    } else {
        howToUseContent.style.display = "block";
        button.textContent = "Hide";
    }
}
