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

//DOMContentLoaded listener
document.addEventListener('DOMContentLoaded', () => {
    // Carousel functionality (simple version)
    const carousel = document.querySelector('.carousel');
    if (carousel) {
        const items = carousel.querySelectorAll('.carousel-item');
        const prevBtn = carousel.querySelector('.carousel-prev');
        const nextBtn = carousel.querySelector('.carousel-next');
        let currentIndex = 0;

        function showSlide(index) {
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

        if (prevBtn && nextBtn && items.length > 0) { // Check if buttons and items exist
            prevBtn.addEventListener('click', () => {
                showSlide(currentIndex - 1);
            });

            nextBtn.addEventListener('click', () => {
                showSlide(currentIndex + 1);
            });

            // Auto-advance slides every 5 seconds
            setInterval(() => {
                showSlide(currentIndex + 1);
            }, 5000);

            // Show the initial slide
            showSlide(currentIndex);
        }
    }

    // Form submission
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Add your form submission logic here (e.g., using Fetch API or FormSubmit)
            alert('Thank you for your message! We will get back to you soon.');
            form.reset();
        });
    }

    // Publication abstract hover functionality
    document.querySelectorAll('.publication-card').forEach(card => {
        const abstract = card.querySelector('.publication-abstract');
        const toggleButton = card.querySelector('.abstract-toggle');

        if (abstract && toggleButton) { // Ensure elements exist
            card.addEventListener('mouseenter', () => {
                abstract.classList.add('show');
                toggleButton.classList.add('active');
            });

            card.addEventListener('mouseleave', () => {
                abstract.classList.remove('show');
                toggleButton.classList.remove('active');
            });
        }
    });
});
