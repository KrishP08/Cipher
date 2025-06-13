 // Caesar Cipher logic for encryption and decryption
 function caesarCipher(text, shift) {
    let result = "";

    for (let i = 0; i < text.length; i++) {
        let char = text[i];

        if (char.match(/[a-z]/i)) {
            let code = text.charCodeAt(i);

            // Uppercase letters
            if (code >= 65 && code <= 90) {
                result += String.fromCharCode(((code - 65 + shift) % 26 + 26) % 26 + 65);
            }
            // Lowercase letters
            else if (code >= 97 && code <= 122) {
                result += String.fromCharCode(((code - 97 + shift) % 26 + 26) % 26 + 97);
            }
        } else {
            result += char;
        }
    }
    return result;
}

// Function to encrypt and show results
function performEncrypt() {
    const message = document.getElementById("message").value;
    const shift = parseInt(document.getElementById("shift").value);
    const encryptedMessage = caesarCipher(message, shift);
    const resultBox = document.getElementById("resultBox");

    resultBox.style.display = "block";
    resultBox.classList.remove('fade-in'); // Remove class if already present
    void resultBox.offsetWidth; // Trigger reflow
    resultBox.classList.add('fade-in'); // Add animation class
    document.getElementById("result").textContent = encryptedMessage;

    populateAlphabetTables(shift);
}

// Function to decrypt and show results
function performDecrypt() {
    const message = document.getElementById("message").value;
    const shift = parseInt(document.getElementById("shift").value);
    const decryptedMessage = caesarCipher(message, -shift);
    const resultBox = document.getElementById("resultBox");

    resultBox.style.display = "block";
    resultBox.classList.remove('fade-in'); // Remove class if already present
    void resultBox.offsetWidth; // Trigger reflow
    resultBox.classList.add('fade-in'); // Add animation class
    document.getElementById("result").textContent = decryptedMessage;

    populateAlphabetTables(-shift);
}

// Function to populate A-Z and shifted alphabet tables
function populateAlphabetTables(shift) {
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const alphabetTableBody = document.querySelector("#alphabetTable tbody");
    const shiftedTableBody = document.querySelector("#shiftedTable tbody");

    alphabetTableBody.innerHTML = "";
    shiftedTableBody.innerHTML = "";

    for (let i = 0; i < alphabet.length; i++) {
        // Plain alphabet row
        let alphabetRow = document.createElement("tr");
        let alphabetCharCell = document.createElement("td");
        alphabetCharCell.textContent = alphabet[i];
        let alphabetPosCell = document.createElement("td");
        alphabetPosCell.textContent = i;

        alphabetRow.appendChild(alphabetCharCell);
        alphabetRow.appendChild(alphabetPosCell);
        alphabetTableBody.appendChild(alphabetRow);

        // Shifted alphabet row
        let shiftedRow = document.createElement("tr");
        let shiftedCharCell = document.createElement("td");
        let shiftedChar = alphabet[(i + shift + 26) % 26];
        shiftedCharCell.textContent = shiftedChar;
        let shiftedPosCell = document.createElement("td");
        shiftedPosCell.textContent = i;

        shiftedRow.appendChild(shiftedCharCell);
        shiftedRow.appendChild(shiftedPosCell);
        shiftedTableBody.appendChild(shiftedRow);
    }
}

// Function to toggle the collapse section
function toggleCollapse() {
    const collapseContent = document.getElementById("collapseContent");
    collapseContent.style.display = (collapseContent.style.display === "block") ? "none" : "block";
}