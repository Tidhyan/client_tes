document.addEventListener('DOMContentLoaded', () => {

    const canvas = document.getElementById('lightning-canvas');
    const ctx = canvas.getContext('2d');

    // Ajuster la taille du canvas à la taille de la section
    function resizeCanvas() {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
    }

    // L'appeler une première fois et à chaque redimensionnement de la fenêtre
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Fonction pour créer un éclair
    function createLightning() {
        // Point de départ (aléatoire en haut de l'écran)
        const x1 = Math.random() * canvas.width;
        const y1 = 0;
        // Point d'arrivée (aléatoire en bas de l'écran)
        const x2 = Math.random() * canvas.width;
        const y2 = canvas.height;

        // Efface le canvas précédent
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dessine l'éclair
        drawLightning(x1, y1, x2, y2, 20); // 20 est le niveau de "chaos"
        
        // Fait disparaître l'éclair après un court instant pour un effet de flash
        setTimeout(() => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }, 150); // L'éclair reste visible 150ms
    }

    // Algorithme récursif pour dessiner le tracé de l'éclair
    function drawLightning(x1, y1, x2, y2, displacement) {
        if (displacement < 5) { // Condition d'arrêt
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            // MODIFICATION 1 : Couleur de l'éclair en jaune
            ctx.strokeStyle = `rgba(255, 215, 0, ${Math.random() * 0.7 + 0.3})`; 
            ctx.lineWidth = Math.random() * 2 + 1;
            
            // Effet de lueur (néon)
            // MODIFICATION 2 : Couleur de la lueur en jaune
            ctx.shadowColor = 'rgba(255, 215, 0, 1)';
            ctx.shadowBlur = Math.random() * 15 + 5;
            
            ctx.stroke();
        } else {
            const mid_x = (x1 + x2) / 2 + (Math.random() - 0.5) * displacement;
            const mid_y = (y1 + y2) / 2 + (Math.random() - 0.5) * displacement;

            // Appel récursif pour les deux moitiés du segment
            drawLightning(x1, y1, mid_x, mid_y, displacement / 2);
            drawLightning(mid_x, mid_y, x2, y2, displacement / 2);
        }
    }

    // Lance un éclair toutes les 3 à 7 secondes pour un effet naturel
    function lightningInterval() {
        createLightning();
        const randomDelay = Math.random() * 4000 + 3000;
        setTimeout(lightningInterval, randomDelay);
    }
    
    // Démarre le cycle
    lightningInterval();


    // ======== MOTEUR DU SLIDER CINÉMATIQUE ========
    const slides = document.querySelectorAll('.slide');
    const heroSection = document.getElementById('hero');
    let currentSlideIndex = 0;
    const slideInterval = 8000; // Chaque slide dure 8 secondes

    function showSlide(index) {
        slides.forEach(slide => {
            slide.classList.remove('active-slide');
        });
        const activeSlide = slides[index];
        activeSlide.classList.add('active-slide');
        const newBackground = activeSlide.getAttribute('data-background');
        heroSection.style.background = newBackground;
    }

    function nextSlide() {
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        showSlide(currentSlideIndex);
    }

    showSlide(currentSlideIndex);
    setInterval(nextSlide, slideInterval);

    // ======== SLIDERS DE COMPARAISON "AVANT/APRÈS" ========
    function initComparisonSliders() {
        const sliders = document.querySelectorAll('.comparison-slider');
        sliders.forEach(slider => {
            const imageAfter = slider.querySelector('.image-after');
            const handle = slider.querySelector('.slider-handle');
            let isDragging = false;
            const moveSlider = (x_pos) => {
                const rect = slider.getBoundingClientRect();
                let position = ((x_pos - rect.left) / rect.width) * 100;
                if (position < 0) position = 0;
                if (position > 100) position = 100;
                imageAfter.style.width = position + '%';
                handle.style.left = position + '%';
            };
            slider.addEventListener('mousedown', (e) => { isDragging = true; e.preventDefault(); });
            slider.addEventListener('touchstart', (e) => { isDragging = true; e.preventDefault(); });
            window.addEventListener('mouseup', () => { isDragging = false; });
            window.addEventListener('touchend', () => { isDragging = false; });
            window.addEventListener('mousemove', (e) => { if (isDragging) moveSlider(e.clientX); });
            window.addEventListener('touchmove', (e) => { if (isDragging) moveSlider(e.touches[0].clientX); });
        });
    }
    initComparisonSliders();

    // ======== ANIMATION DE LA TIMELINE AU SCROLL ========
    function initTimelineAnimation() {
        const timelineItems = document.querySelectorAll('#a-propos .timeline-container li');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, {
            threshold: 0.5
        });
        timelineItems.forEach(item => {
            observer.observe(item);
        });
    }
    initTimelineAnimation();


    // ======== GESTION DU MENU HAMBURGER ========
    const hamburger = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        // Active/désactive le menu
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });
});