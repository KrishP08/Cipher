[![UI & Animation Enhanced by Google Jules](https://img.shields.io/badge/UI%20%26%20Animation%20Enhanced%20by-Google%20Jules-blue.svg)](https://github.com/krishp08/Cipher/)

# Cipher Collection Website

Welcome to the **Cipher Collection**, a web-based platform to explore five classical encryption techniques, now with an enhanced user interface and dynamic theming! This project demonstrates the implementation of these algorithms using JavaScript and HTML, allowing you to interact with each cipher through a dynamic and visually engaging interface.

### Live Demo
Visit the website at [krishp08.github.io/Cipher/](https://krishp08.github.io/Cipher/).

## Features

*   **Five Classical Ciphers:**
    1.  **Hill Cipher**: A polygraphic substitution cipher using linear algebra.
        *   Features dynamic N x N key matrix generation based on user input.
        *   Matrix cells are square-shaped for visual clarity.
        *   Includes `[row,col]` placeholders in matrix cells for easier input.
    2.  **One-Time Pad (OTP)**: An unbreakable cipher when used with a truly random key as long as the message.
    3.  **Playfair Cipher**: A digraph substitution cipher that encrypts pairs of letters.
    4.  **Railfence Cipher**: A transposition cipher using a zig-zag pattern to encrypt text.
    5.  **Caesar Cipher**: A simple substitution cipher where each letter is shifted by a fixed number.

*   **Dual-Theme System:**
    *   **Theme Switcher:** Easily toggle between two distinct visual themes using a button in the navigation bar.
    *   **Theme Persistence:** Your selected theme is saved locally and applied on subsequent visits.
    *   **First-Visit Notification:** New users visiting the main page are greeted with a popup informing them about the theme options.

*   **Themes:**
    1.  **Matrix Theme (Default):**
        *   A "hacker-style" aesthetic with a dark background (`#0f0f0f`).
        *   Primary text in bright green (`#00ff99`) using 'Fira Code' and 'Courier New' monospace fonts.
        *   Dynamic Matrix digital rain effect as the animated background.
    2.  **Glow Theme:**
        *   An "Enhanced Cipher Site" look with 'Arial' and 'Courier New' fonts.
        *   Features a distinct color palette (using bright cyan and yellow as primary/secondary accents) and gradient backgrounds.
        *   Includes complex background animations (e.g., floating shapes, particles, orbs - specific implementation in `cipher-animations.js`).
        *   Elements styled with card-based UI, backdrop-filter effects (if implemented), and glowing text.

*   **User Interface & Experience:**
    *   Responsive design for usability across various devices.
    *   Animated transitions and effects for a more engaging experience.
    *   Clear, intuitive layout for each cipher tool, with the Hill Cipher page featuring a new section-based layout.
    *   Cipher titles are now integrated into the navigation bar for a consistent look.

## Technologies Used

*   **HTML5:** For structuring the web pages.
*   **CSS3:** For all styling, including:
    *   CSS Custom Properties (Variables) for theming.
    *   CSS Grid and Flexbox for layout.
    *   CSS Animations and Transitions.
*   **JavaScript (ES6+):**
    *   Core cipher logic.
    *   DOM manipulation for dynamic content and UI updates.
    *   Theme switching and persistence (`localStorage`).
    *   Custom Matrix digital rain animation (Canvas API).
    *   "Glow Theme" animations and element enhancements.

<a href="https://www.w3.org/html/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/html5/html5-original-wordmark.svg" alt="html5" width="40" height="40"/> </a> 
<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" alt="javascript" width="40" height="40"/> </a>
<a href="https://www.w3.org/css/" target="_blank" rel="noreferrer"> <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/css3/css3-original-wordmark.svg" alt="css3" width="40" height="40"/> </a>

## Project Structure Overview

*   **HTML Files:**
    *   `index.html`: Main page (features Hill Cipher by default) and site entry point.
    *   `CaesarCipher.html`, `Playfair.html`, `Railfence.html`, `otp.html`: Individual pages for each cipher.
*   **CSS Files:**
    *   `Hii.css`: Base styles, common UI component styles, and Matrix Theme specific styles.
    *   `nav.css`: Styling for the navigation bar and responsive sidebar.
    *   `cipher-animations.css`: Glow Theme specific styles (scoped with `body.theme-glow`).
*   **JavaScript Files:**
    *   `theme-switcher.js`: Handles theme toggling, persistence, and calls to theme-specific animation controllers.
    *   `matrix.js`: Implements the Matrix digital rain background for the Matrix Theme.
    *   `cipher-animations.js`: Implements the background effects and element enhancements for the Glow Theme.
    *   `hill.js`, `CaesarCipher.js`, `pf.js` (Playfair), `Railfence.js`, `otp.js`: Individual JavaScript logic for each cipher.
    *   `shared.js`: Manages the mobile sidebar navigation toggle.

## How to Use

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/krishp08/Cipher.git
    ```
2.  **Navigate to the directory:**
    ```bash
    cd Cipher
    ```
3.  **Open `index.html` in your favorite modern web browser.**
4.  Explore the different ciphers and use the "Change Theme" button in the navbar to switch between the "Matrix Theme" and the "Glow Theme"!

## Customization

*   **Glow Theme:** Colors and some animation parameters for the Glow Theme can be customized by editing the CSS variables (e.g., `--cipher-primary`, `--cipher-secondary`) found at the top of `cipher-animations.css` within the `body.theme-glow` scope.
*   **Matrix Theme:** Colors and parameters for the Matrix Theme can be adjusted via CSS variables in `Hii.css` (e.g., `--dark-bg-primary`, `--dark-text-primary`). Matrix rain animation parameters are in `matrix.js`.
