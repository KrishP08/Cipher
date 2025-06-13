function railFenceEncrypt(plaintext, rails) {
    // Clean the plaintext to only include alphabetic characters
    plaintext = plaintext.replace(/[^a-zA-Z]/g, '').toUpperCase();
    const length = plaintext.length;

    // Create a 2D array to hold the characters in the rails
    const fence = Array.from({ length: rails }, () => Array(length).fill(' '));

    let row = 0, direction = 1, charIndex = 0;

    // Fill the rails with characters in a zigzag pattern
    while (charIndex < length) {
        fence[row][charIndex] = plaintext[charIndex];

        // Move up or down the rails
        if (row === 0) {
            direction = 1; // Moving down
        } else if (row === rails - 1) {
            direction = -1; // Moving up
        }

        row += direction;
        charIndex++;
    }

    // Create the ciphertext by reading the rails
    let ciphertext = '';
    for (let r = 0; r < rails; r++) {
        for (let c = 0; c < length; c++) {
            if (fence[r][c] !== ' ') {
                ciphertext += fence[r][c];
            }
        }
    }

    return { ciphertext, fence };
}

document.getElementById('cipherForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission

    const plaintext = document.getElementById('plaintext').value;
    const rails = parseInt(document.getElementById('rails').value);

    const { ciphertext, fence } = railFenceEncrypt(plaintext, rails);

    // Display the results
    document.getElementById('ciphertext').innerText = `Ciphertext: ${ciphertext}`;
    const fenceContainer = document.getElementById('fenceContainer');
    fenceContainer.innerHTML = ''; // Clear previous results
    fence.forEach(rail => {
        fenceContainer.innerHTML += `<div class="rail">${rail.join(' ')}</div>`;
    });
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block'; // Show the result section
    resultDiv.classList.remove('fade-in');
    void resultDiv.offsetWidth;
    resultDiv.classList.add('fade-in');
});
/*
const menuBtn = document.querySelector('.menu-btn');
const navMenu = document.querySelector('nav ul');

menuBtn.addEventListener('click', function() {
    navMenu.classList.toggle('active');
});
*/