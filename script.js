// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach((element) => {
    observer.observe(element);
});

//DOMContentLoaded listener
document.addEventListener('DOMContentLoaded', () => {
    // Carousel functionality
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        const items = carousel.querySelectorAll('.carousel-item');
        const prevBtn = carousel.querySelector('.carousel-prev');
        const nextBtn = carousel.querySelector('.carousel-next');
        let currentIndex = 0;

        function showSlide(index) {
            if (items.length === 0) return;
            items.forEach(item => item.classList.remove('active'));
            if (index >= items.length) {
                currentIndex = 0;
            } else if (index < 0) {
                currentIndex = items.length - 1;
            } else {
                currentIndex = index;
            }
            items[currentIndex].classList.add('active');
        }

        if (prevBtn && nextBtn) {
            prevBtn.addEventListener('click', () => showSlide(currentIndex - 1));
            nextBtn.addEventListener('click', () => showSlide(currentIndex + 1));
            setInterval(() => showSlide(currentIndex + 1), 5000);
            showSlide(currentIndex);
        }
    }

    // Form submission
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message! We will get back to you soon.');
            form.reset();
        });
    }

    // Publication abstract toggle functionality
    document.querySelectorAll('.abstract-toggle').forEach(button => {
        button.addEventListener('click', function () {
            const abstract = this.nextElementSibling;
            if (abstract && abstract.classList.contains('publication-abstract')) {
                abstract.classList.toggle('show');
                this.classList.toggle('active');
            }
        });
    });
});
