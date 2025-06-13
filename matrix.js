// Matrix Animation Variables - keep them in a scope accessible by all functions here
let matrixIntervalId = null;
let matrixCanvas = null;
let matrixCtx = null;
let matrixWidth = 0;
let matrixHeight = 0;
let matrixChars = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
matrixChars = matrixChars.split('');
const matrixFontSize = 16;
let matrixColumns = 0;
let matrixDrops = [];
let matrixGradient = null;
let matrixPrimaryTextColor = '#00ff99'; // Default fallback

function initializeMatrixState() {
    matrixWidth = matrixCanvas.width = window.innerWidth;
    matrixHeight = matrixCanvas.height = window.innerHeight;
    matrixColumns = Math.floor(matrixWidth / matrixFontSize);
    matrixDrops = [];
    for (let i = 0; i < matrixColumns; i++) {
        matrixDrops[i] = 1 + Math.floor(Math.random() * (matrixHeight / matrixFontSize));
    }

    // Gradient for the background
    if (matrixCtx) { // Ensure context is available
        matrixGradient = matrixCtx.createLinearGradient(0, 0, 0, matrixHeight);
        matrixGradient.addColorStop(0, '#0f0f0f'); // --dark-bg-primary
        matrixGradient.addColorStop(1, '#1a1a1a'); // --dark-bg-secondary
    }

    // Primary text color from CSS variable
    try {
        const rootStyle = getComputedStyle(document.documentElement);
        const cssVarColor = rootStyle.getPropertyValue('--dark-text-primary').trim();
        if (cssVarColor) matrixPrimaryTextColor = cssVarColor;
    } catch (e) {
        console.warn('Could not read --dark-text-primary CSS variable for matrix animation.', e);
    }
}

function drawMatrix() {
    if (!matrixCtx || !matrixGradient) return;

    // Draw the gradient background first
    matrixCtx.fillStyle = matrixGradient;
    matrixCtx.fillRect(0, 0, matrixWidth, matrixHeight);

    // Then draw the semi-transparent layer for trails
    matrixCtx.fillStyle = 'rgba(15, 15, 15, 0.1)'; // #0f0f0f with alpha
    matrixCtx.fillRect(0, 0, matrixWidth, matrixHeight);

    matrixCtx.fillStyle = matrixPrimaryTextColor;
    matrixCtx.font = matrixFontSize + 'px "Fira Code", "Courier New", monospace';

    for (let i = 0; i < matrixDrops.length; i++) {
        const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        matrixCtx.fillText(text, i * matrixFontSize, matrixDrops[i] * matrixFontSize);

        if (matrixDrops[i] * matrixFontSize > matrixHeight && Math.random() > 0.975) {
            matrixDrops[i] = 0;
        }
        matrixDrops[i]++;
    }
}

function resizeMatrixCanvas() {
    // Re-initialize state which includes recalculating dimensions, columns, drops, gradient
    if (matrixCanvas && matrixCtx) { // Ensure canvas and context are still valid
       initializeMatrixState();
    }
}

function startMatrixAnimation() {
    if (matrixIntervalId) return; // Already running

    matrixCanvas = document.getElementById('matrix-canvas');
    if (!matrixCanvas) {
        console.error('Matrix Canvas not found. Animation cannot start.');
        return;
    }
    matrixCtx = matrixCanvas.getContext('2d');
    if (!matrixCtx) {
        console.error('Could not get 2D context from Matrix Canvas.');
        return;
    }

    matrixCanvas.style.display = 'block'; // Ensure canvas is visible

    initializeMatrixState(); // Set up initial dimensions, drops, gradient etc.

    matrixIntervalId = setInterval(drawMatrix, 45);
    window.addEventListener('resize', resizeMatrixCanvas);
    console.log("Matrix Animation Started");
}

function stopMatrixAnimation() {
    if (matrixIntervalId) {
        clearInterval(matrixIntervalId);
        matrixIntervalId = null;
        if (matrixCtx && matrixCanvas) {
            matrixCtx.clearRect(0, 0, matrixCanvas.width, matrixCanvas.height);
             matrixCanvas.style.display = 'none'; // Hide canvas
        }
        window.removeEventListener('resize', resizeMatrixCanvas);
        console.log("Matrix Animation Stopped");
    }
}

// The theme-switcher will call startMatrixAnimation() when the matrix theme is active.
// No automatic start on DOMContentLoaded here anymore.
// Example initial call if matrix theme is default (handled by theme-switcher.js now):
// document.addEventListener('DOMContentLoaded', () => {
//     if (!document.body.classList.contains('theme-glow')) { // Or check localStorage
//         startMatrixAnimation();
//     }
// });
