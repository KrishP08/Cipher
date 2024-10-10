function letterToNum(letter) {
    return letter.charCodeAt(0) - 'a'.charCodeAt(0);
}

function numToLetter(num) {
    return String.fromCharCode(num + 'a'.charCodeAt(0));
}

function extendKey(plaintext, key) {
    if (key.length >= plaintext.length) {
        return key.slice(0, plaintext.length);
    } else {
        return (key.repeat(Math.ceil(plaintext.length / key.length))).slice(0, plaintext.length);
    }
}

function otpEncrypt(plaintext, key) {
    key = extendKey(plaintext, key);
    const plaintextNums = Array.from(plaintext).map(letterToNum);
    const keyNums = Array.from(key).map(letterToNum);
    const initialSums = plaintextNums.map((p, i) => p + keyNums[i]);
    const cipherNums = [];
    const calculationSteps = [];

    for (let i = 0; i < plaintextNums.length; i++) {
        let s = initialSums[i];
        if (s > 25) {
            cipherNums.push(s - 26);
            calculationSteps.push(`Sum: ${s} > 25, so ${s} - 26 = ${s - 26}`);
        } else {
            cipherNums.push(s);
            calculationSteps.push(`Sum: ${s}`);
        }
    }

    const cipherText = cipherNums.map(numToLetter).join('');

    return {
        plaintext: plaintext.split('').join('   '),
        plaintext_nums: plaintextNums.map(n => n.toString().padStart(2)).join('   '),
        key: key.split('').join('   '),
        key_nums: keyNums.map(n => n.toString().padStart(2)).join('   '),
        initial_sums: initialSums.map(s => s.toString().padStart(2)).join('   '),
        cipher_nums: cipherNums.map(n => n.toString().padStart(2)).join('   '),
        cipher_text: cipherText,
        steps: calculationSteps
    };
}

document.getElementById('cipherForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const plaintext = document.getElementById('plaintext').value.toLowerCase();
    const key = document.getElementById('key').value.toLowerCase();
    const result = otpEncrypt(plaintext, key);

    let outputHtml = `
        <p>${result.plaintext}   #plaintext</p>
        <p>${result.plaintext_nums}</p>
        <p>+  </p>
        <p>${result.key}   #key</p>
        <p>${result.key_nums}</p>
        <p>-----------------------------------</p>
        <p>${result.initial_sums}</p>
        <p>${result.cipher_nums}  #If you want happen here check detailed Steps</p>
        <p>cp-${result.cipher_text}</p>
        <button class="collapsible">Show Detailed Steps</button>
        <div class="content">
            <ul>
                ${result.steps.map(step => `<li>${step}</li>`).join('')}
            </ul>
        </div>
    `;

    const outputDiv = document.getElementById('output');
    outputDiv.innerHTML = outputHtml;
    outputDiv.style.display = 'block';

    const collapsibles = document.getElementsByClassName("collapsible");
    for (let i = 0; i < collapsibles.length; i++) {
        collapsibles[i].addEventListener("click", function() {
            this.classList.toggle("active");
            const content = this.nextElementSibling;
            content.style.display = (content.style.display === "block") ? "none" : "block";
            this.textContent = (content.style.display === "block") ? "Hide Detailed Steps" : "Show Detailed Steps";
        });
    }
});