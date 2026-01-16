// Minimal interactions only
document.addEventListener('DOMContentLoaded', () => {
    // iOS Button Logic (Optional extra safety)
    const iosButtons = document.querySelectorAll('.btn-secondary');

    iosButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // No alert needed per spec ("Disabled"), but strictly preventing default
        });
    });
});
