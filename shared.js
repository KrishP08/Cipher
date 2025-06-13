// This is the shared JavaScript file.
// It will contain common functionality used across multiple pages.

document.querySelector('.menu-btn').addEventListener('click', function() {
    document.querySelector('.sidebar').classList.toggle('open');
});
