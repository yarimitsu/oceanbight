// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
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

// Image Carousel
class Carousel {
    constructor(element) {
        this.carousel = element;
        this.inner = element.querySelector('.carousel-inner');
        this.items = element.querySelectorAll('.carousel-item');
        this.prev = element.querySelector('.prev');
        this.next = element.querySelector('.next');

        this.currentIndex = 0;
        this.itemWidth = this.items[0].offsetWidth;

        this.setupEventListeners();
        this.updateCarousel();
    }

    setupEventListeners() {
        this.prev.addEventListener('click', () => this.navigate('prev'));
        this.next.addEventListener('click', () => this.navigate('next'));

        // Touch events for mobile
        let startX = 0;
        let isDragging = false;

        this.carousel.addEventListener('touchstart', (e) => {
            isDragging = true;
            startX = e.touches[0].pageX;
        });

        this.carousel.addEventListener('touchmove', (e) => {
            if (!isDragging) return;

            const currentX = e.touches[0].pageX;
            const diff = startX - currentX;

            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    this.navigate('next');
                } else {
                    this.navigate('prev');
                }
                isDragging = false;
            }
        });

        this.carousel.addEventListener('touchend', () => {
            isDragging = false;
        });
    }

    navigate(direction) {
        if (direction === 'next') {
            this.currentIndex = (this.currentIndex + 1) % this.items.length;
        } else {
            this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
        }

        this.updateCarousel();
    }

    updateCarousel() {
        const offset = -this.currentIndex * 100;
        this.inner.style.transform = `translateX(${offset}%)`;
    }
}

// Initialize carousel
document.addEventListener('DOMContentLoaded', () => {
    const carouselElement = document.querySelector('.carousel');
    if (carouselElement) {
        new Carousel(carouselElement);
    }

    // Form submission
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Add your form submission logic here
            alert('Thank you for your message! We will get back to you soon.');
            form.reset();
        });
    }

    // Publication abstract toggles
    document.querySelectorAll('.abstract-toggle').forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const abstract = toggle.closest('.publication-card').querySelector('.publication-abstract');
            abstract.classList.toggle('show');
            toggle.textContent = abstract.classList.contains('show') ? 'Hide Abstract' : 'Abstract';
        });
    });
});
