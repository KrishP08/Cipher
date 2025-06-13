document.addEventListener('DOMContentLoaded', () => {
    const themeSwitcherBtn = document.getElementById('theme-switcher-btn');
    const body = document.body;
    const defaultTheme = 'theme-matrix'; // Matrix is the default
    const glowTheme = 'theme-glow';
    let currentTheme;

    function applyTheme(theme) {
        body.classList.remove(defaultTheme, glowTheme);
        body.classList.add(theme);
        localStorage.setItem('selectedTheme', theme);
        currentTheme = theme;
        updateButtonText();

        // Manage animations based on theme
        if (theme === glowTheme) {
            if (typeof stopMatrixAnimation === 'function') {
                stopMatrixAnimation();
            }
            if (typeof startGlowAnimations === 'function') {
                startGlowAnimations();
            }
        } else { // defaultTheme (theme-matrix)
            if (typeof stopGlowAnimations === 'function') {
                stopGlowAnimations();
            }
            if (typeof startMatrixAnimation === 'function') {
                startMatrixAnimation();
            }
        }
        // console.log(`Applied theme: ${theme}`); // For debugging
    }

    function updateButtonText() {
        if (!themeSwitcherBtn) return; // Guard against missing button
        if (currentTheme === glowTheme) {
            themeSwitcherBtn.textContent = 'Matrix Theme';
        } else {
            themeSwitcherBtn.textContent = 'Glow Theme';
        }
    }

    if (themeSwitcherBtn) {
        themeSwitcherBtn.addEventListener('click', () => {
            const newTheme = body.classList.contains(defaultTheme) ? glowTheme : defaultTheme;
            applyTheme(newTheme);
        });
    } else {
        // console.error("Theme switcher button not found."); // For debugging
    }

    // Load saved theme or apply default
    const savedTheme = localStorage.getItem('selectedTheme');
    // Ensure a valid theme class is always applied on load
    if (savedTheme === glowTheme || savedTheme === defaultTheme) {
        applyTheme(savedTheme);
    } else {
        applyTheme(defaultTheme);
    }

    // --- First Visit Popup Logic ---
    function showFirstVisitPopup() {
        if (document.getElementById('theme-popup-overlay')) return; // Already shown or present

        const overlay = document.createElement('div');
        overlay.id = 'theme-popup-overlay';

        const popup = document.createElement('div');
        popup.id = 'theme-popup';

        const heading = document.createElement('h3');
        heading.textContent = 'Theme Options!';

        const paragraph = document.createElement('p');
        paragraph.innerHTML = 'Did you know you can change the website theme? Find the "Change Theme" button in the navbar (top right) to switch between <strong>Matrix</strong> and <strong>Glow</strong> themes!';

        const closeButton = document.createElement('button');
        closeButton.id = 'theme-popup-close-btn';
        closeButton.textContent = 'Got it!';

        closeButton.addEventListener('click', () => {
            overlay.classList.remove('visible');
            localStorage.setItem('themeNotificationShown', 'true');
            setTimeout(() => {
                if (overlay.parentNode) {
                    overlay.parentNode.removeChild(overlay);
                }
            }, 300); // Match CSS transition time
        });

        popup.appendChild(heading);
        popup.appendChild(paragraph);
        popup.appendChild(closeButton);
        overlay.appendChild(popup);
        document.body.appendChild(overlay);

        setTimeout(() => {
            overlay.classList.add('visible');
        }, 50);
    }

    if (window.location.pathname.endsWith('/') || window.location.pathname.endsWith('index.html')) {
        if (localStorage.getItem('themeNotificationShown') !== 'true') {
            // Show popup after a slight delay to ensure page is settled
            setTimeout(showFirstVisitPopup, 1500);
        }
    }
});
