class ScrollAnimations {
    constructor() {
        this.elements = document.querySelectorAll('.reveal');
        this.init();
    }

    init() {
        this.checkScroll();
        window.addEventListener('scroll', () => this.checkScroll());
        window.addEventListener('resize', () => this.checkScroll());
    }

    checkScroll() {
        const triggerBottom = window.innerHeight * 0.8;
        
        this.elements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            
            if (elementTop < triggerBottom) {
                element.classList.add('active');
            }
        });
    }
}

class TypeWriter {
    constructor(element, texts, speed = 100) {
        this.element = element;
        this.texts = texts;
        this.speed = speed;
        this.textIndex = 0;
        this.charIndex = 0;
        this.currentText = '';
        this.isDeleting = false;
        this.type();
    }

    type() {
        const current = this.textIndex % this.texts.length;
        const fullText = this.texts[current];

        if (this.isDeleting) {
            this.currentText = fullText.substring(0, this.charIndex - 1);
            this.charIndex--;
        } else {
            this.currentText = fullText.substring(0, this.charIndex + 1);
            this.charIndex++;
        }

        this.element.textContent = this.currentText;

        let typeSpeed = this.speed;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.charIndex === fullText.length) {
            typeSpeed = 2000;
            this.isDeleting = true;
        } else if (this.isDeleting && this.charIndex === 0) {
            this.isDeleting = false;
            this.textIndex++;
            typeSpeed = 500;
        }

        setTimeout(() => this.type(), typeSpeed);
    }
}

// Initialize animations
document.addEventListener('DOMContentLoaded', () => {
    new ScrollAnimations();
    
    // Add reveal class to elements
    document.querySelectorAll('.project-card, .about-content, .contact-info').forEach(el => {
        el.classList.add('reveal');
    });
});
