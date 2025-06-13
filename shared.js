// This is the shared JavaScript file.
// It will contain common functionality used across multiple pages.

document.querySelector('.menu-btn').addEventListener('click', function() {
    document.querySelector('.sidebar').classList.toggle('open');
});

document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('particles-js')) {
        particlesJS("particles-js", {
            "particles": {
                "number": { "value": 60, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#555555" }, // Dark theme particle color - should be subtle
                "shape": { "type": "circle" },
                "opacity": { "value": 0.2, "random": false }, // Low opacity
                "size": { "value": 2, "random": true }, // Small size
                "line_linked": { "enable": true, "distance": 150, "color": "#444444", "opacity": 0.15, "width": 1 }, // Subtle lines
                "move": { "enable": true, "speed": 1.5, "direction": "none", "random": false, "straight": false, "out_mode": "out", "bounce": false }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": { "onhover": { "enable": false }, "onclick": { "enable": false }, "resize": true } // Interactivity disabled for subtlety
            },
            "retina_detect": true
        });
    }
});
