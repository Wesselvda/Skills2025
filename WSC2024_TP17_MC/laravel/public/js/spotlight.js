document.addEventListener('DOMContentLoaded', () => {
    const cover = document.querySelector('.cover');

    document.body.addEventListener('mousemove', (e) => {
        const rect = cover.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const pos = `${x - 5000}px ${y - 5000}px`;

        cover.style.maskPosition = pos;
        cover.style.webkitMaskPosition = pos;
    });

    // cover.addEventListener('mouseleave', () => {
    //     cover.style.maskPosition = 'center';
    //     cover.style.webkitMaskPosition = 'center';
    // });
});