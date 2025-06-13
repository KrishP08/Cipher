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
        // Create background elements only if they don't exist
        if (!document.querySelector('.animated-background')) {
            this.animatedBg = document.createElement('div');
            this.animatedBg.classList.add('animated-background');
            // Add shapes for the background if needed by the CSS
            for (let i = 0; i < 10; i++) {
                const shape = document.createElement('div');
                shape.classList.add('shape', `shape-${i % 3 + 1}`);
                shape.style.setProperty('--x', Math.random());
                shape.style.setProperty('--y', Math.random());
                shape.style.setProperty('--s', Math.random() * 0.6 + 0.4);
                this.animatedBg.appendChild(shape);
            }
            document.body.appendChild(this.animatedBg);
        } else {
            // If it exists, just grab a reference
            this.animatedBg = document.querySelector('.animated-background');
        }
        // enhanceExistingElements is not strictly needed if CSS handles targeting existing classes
        // this.enhanceExistingElements();
    }

    // enhanceExistingElements() { ... } // Remains empty or for future use

    activateAnimations() {
        if (this.isGlowInitialized) return;
        // console.log("Activating Glow Animations (dynamic parts)");

        if (this.animatedBg) this.animatedBg.style.display = 'block';

        document.querySelectorAll('body.theme-glow .container, body.theme-glow .hill-section').forEach(card => {
            card.style.animation = 'float 3s ease-in-out infinite alternate';
            this.glowingElements.push(card);
        });

        this.isGlowInitialized = true;
    }

    deactivateAnimations() {
        // console.log("Deactivating Glow Animations (dynamic parts)");
        this.glowingElements.forEach(el => {
            el.style.animation = '';
        });
        this.glowingElements = [];

        if (this.animatedBg) this.animatedBg.style.display = 'none';

        this.isGlowInitialized = false;
    }

    // destroy() is called when stopping the glow theme to clean up fully
    destroy() {
        // console.log("Destroying CipherAnimations instance and elements");
        this.deactivateAnimations(); // Stop animations and clear listeners/styles
        if (this.animatedBg) {
            this.animatedBg.remove(); // Remove the background div from DOM
            this.animatedBg = null;
        }
        // Any other specific cleanup for this class instance
    }
}

let glowAnimationsInstance = null;

function startGlowAnimations() {
    if (!glowAnimationsInstance) {
        glowAnimationsInstance = new CipherAnimations();
    }
    glowAnimationsInstance.activateAnimations();
    console.log("Glow Animations System Started/Activated");
}

function stopGlowAnimations() {
    if (glowAnimationsInstance) {
        glowAnimationsInstance.destroy(); // Call destroy to fully clean up
        glowAnimationsInstance = null;    // Nullify the instance so it's recreated next time
        console.log("Glow Animations System Stopped/Destroyed");
    }
}

// No automatic start on DOMContentLoaded here.
// Theme switcher will call startGlowAnimations() or stopGlowAnimations().
