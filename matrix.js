document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('matrix-canvas');
    if (!canvas) {
        console.error('Matrix Canvas not found. Animation cannot start.');
        return;
    }
    const ctx = canvas.getContext('2d');

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Characters: Katakana subset, or mix with letters/numbers
    let chars = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    chars = chars.split('');

    const fontSize = 16;
    let columns = Math.floor(width / fontSize);
    let drops = [];
    for (let i = 0; i < columns; i++) {
        drops[i] = 1 + Math.floor(Math.random() * (height / fontSize));
    }

    // Gradient for the background
    let gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#0f0f0f'); // --dark-bg-primary
    gradient.addColorStop(1, '#1a1a1a'); // --dark-bg-secondary (or a slightly different dark shade)

    // Primary text color from CSS variable (fallback if not available)
    let primaryTextColor = '#00ff99'; // Default fallback
    try {
        const rootStyle = getComputedStyle(document.documentElement);
        const cssVarColor = rootStyle.getPropertyValue('--dark-text-primary').trim();
        if (cssVarColor) primaryTextColor = cssVarColor;
    } catch (e) {
        console.warn('Could not read --dark-text-primary CSS variable for matrix animation.', e);
    }


    function draw() {
        // Draw the gradient background first
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Then draw the semi-transparent layer for trails (on top of gradient)
        // This makes previous characters fade out gradually.
        // The alpha value (0.1 here) controls the length of the trails.
        ctx.fillStyle = 'rgba(15, 15, 15, 0.1)'; // #0f0f0f with alpha
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = primaryTextColor;
        ctx.font = fontSize + 'px "Fira Code", "Courier New", monospace'; // Ensure Fira Code is used

        for (let i = 0; i < drops.length; i++) {
            const text = chars[Math.floor(Math.random() * chars.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            // Sending the drop back to the top randomly after it has crossed the screen
            // adding a random factor to make the rain lines appear at different times
            if (drops[i] * fontSize > height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    let intervalId = setInterval(draw, 45); // Adjusted for potentially better performance (around 22fps)

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        columns = Math.floor(width / fontSize);
        drops = [];
        for (let i = 0; i < columns; i++) {
            drops[i] = 1 + Math.floor(Math.random() * (height / fontSize));
        }
        // Re-create gradient on resize as its height dependent
        gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#0f0f0f');
        gradient.addColorStop(1, '#1a1a1a');

        // Re-fetch text color in case theme changed dynamically (though not implemented here)
        try {
            const rootStyle = getComputedStyle(document.documentElement);
            const cssVarColor = rootStyle.getPropertyValue('--dark-text-primary').trim();
            if (cssVarColor) primaryTextColor = cssVarColor;
        } catch (e) {
            // console.warn('Could not re-read --dark-text-primary on resize.', e);
        }
    });
});
