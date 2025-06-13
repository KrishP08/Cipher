// Manages the animations for different themes (e.g., Glow Theme)

class CipherAnimations {
    constructor() {
        this.glowingElements = [];
        this.isGlowInitialized = false;
        this.animatedBg = null; // To keep track of the animated background div
        // console.log("CipherAnimations class constructor called");
        this.init(); // Call init to set up persistent elements or one-time setups
    }

    init() {
        // console.log("CipherAnimations init called");
        // This was part of the original provided JS, creates background elements
        // These elements will be styled by cipher-animations.css when body.theme-glow is active
        if (!document.querySelector('.animated-background')) {
            this.animatedBg = document.createElement('div');
            this.animatedBg.classList.add('animated-background');
            for (let i = 0; i < 10; i++) { // Create some shapes for the background
                const shape = document.createElement('div');
                shape.classList.add('shape', `shape-${i % 3 + 1}`);
                shape.style.setProperty('--x', Math.random());
                shape.style.setProperty('--y', Math.random());
                shape.style.setProperty('--s', Math.random() * 0.6 + 0.4);
                this.animatedBg.appendChild(shape);
            }
            document.body.appendChild(this.animatedBg);
        }
        this.enhanceExistingElements();
    }

    enhanceExistingElements() {
        // console.log("Enhancing existing elements for Glow Theme");
        // This function adds classes that will be styled by cipher-animations.css
        // when body.theme-glow is active.
        // document.querySelectorAll('h1, h2, .title, .main-title').forEach(el => el.classList.add('glow-text'));
        // document.querySelectorAll('.container, .card, .hill-section').forEach(el => el.classList.add('cipher-card')); // Already handled by direct CSS overrides
        // document.querySelectorAll('button, input[type="button"], input[type="submit"]').forEach(el => el.classList.add('cipher-button')); // Already handled
        // document.querySelectorAll('input[type="text"], input[type="number"], textarea, select').forEach(el => el.classList.add('cipher-input')); // Already handled
    }


    // This method will be called when the glow theme is activated
    activateAnimations() {
        if (this.isGlowInitialized) return;
        // console.log("Starting Glow Animations (dynamic parts)");

        // Example: Add dynamic "float" animation to cards or specific elements
        document.querySelectorAll('body.theme-glow .container, body.theme-glow .hill-section').forEach(card => {
            card.style.animation = 'float 3s ease-in-out infinite alternate';
            this.glowingElements.push(card);
        });

        if (this.animatedBg) this.animatedBg.style.display = 'block'; // Ensure background is visible

        this.isGlowInitialized = true;
    }

    // This method will be called when the glow theme is deactivated
    deactivateAnimations() {
        // console.log("Stopping Glow Animations (dynamic parts)");
        this.glowingElements.forEach(el => {
            el.style.animation = ''; // Remove the float animation
        });
        this.glowingElements = [];

        if (this.animatedBg) this.animatedBg.style.display = 'none'; // Hide animated background

        this.isGlowInitialized = false;
    }

    destroy() { // If we need to fully remove elements created by this class
        if (this.animatedBg) {
            this.animatedBg.remove();
            this.animatedBg = null;
        }
        this.stopGlowAnimations(); // Ensure any running animations are cleared
        // console.log("CipherAnimations instance destroyed");
    }
}

let glowAnimationsInstance = null;

function startGlowAnimations() {
    if (!glowAnimationsInstance) {
        glowAnimationsInstance = new CipherAnimations(); // Creates .animated-background via constructor's init()
    }
    glowAnimationsInstance.activateAnimations(); // Starts float animations etc.
    console.log("Glow Animations System Started/Activated");
}

function stopGlowAnimations() {
    if (glowAnimationsInstance) {
        glowAnimationsInstance.deactivateAnimations();
        // Optional: fully destroy and remove elements if they shouldn't persist in DOM when theme is off
        // glowAnimationsInstance.destroy();
        // glowAnimationsInstance = null;
        console.log("Glow Animations System Stopped/Deactivated");
    }
}

// No automatic start on DOMContentLoaded here.
// Theme switcher will call startGlowAnimations() or stopGlowAnimations().
