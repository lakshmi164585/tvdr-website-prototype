const menuToggle = document.querySelector('.menu-toggle');
const navigationMenu = document.querySelector('.navigation-menu');
const navigationLinks = navigationMenu.querySelectorAll('a');
const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
const currentYear = document.querySelector('#current-year');

function closeMenu() {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
    navigationMenu.classList.remove('is-open');
}

// Keep the narrow-screen menu keyboard-accessible and dismissible.
menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isExpanded));
    menuToggle.setAttribute('aria-label', isExpanded ? 'Open navigation menu' : 'Close navigation menu');
    navigationMenu.classList.toggle('is-open', !isExpanded);
});

navigationLinks.forEach((link) => link.addEventListener('click', closeMenu));

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        menuToggle.focus();
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 1100) {
        closeMenu();
    }
});

const fields = {
    name: {
        input: document.querySelector('#name'),
        error: document.querySelector('#name-error'),
        validate(value) {
            return value.trim().length >= 2 ? '' : 'Please enter your name (at least 2 characters).';
        }
    },
    email: {
        input: document.querySelector('#email'),
        error: document.querySelector('#email-error'),
        validate(value) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()) ? '' : 'Enter a valid email address, such as you@example.com.';
        }
    },
    phone: {
        input: document.querySelector('#phone'),
        error: document.querySelector('#phone-error'),
        validate(value) {
            const digits = value.replace(/\D/g, '');
            return digits.length >= 7 && digits.length <= 15 ? '' : 'Enter a phone number with 7 to 15 digits.';
        }
    },
    message: {
        input: document.querySelector('#message'),
        error: document.querySelector('#message-error'),
        validate(value) {
            return value.trim().length >= 10 ? '' : 'Please add a message of at least 10 characters.';
        }
    }
};

function validateField(field) {
    const message = field.validate(field.input.value);
    field.error.textContent = message;
    field.input.setAttribute('aria-invalid', String(Boolean(message)));
    return !message;
}

Object.values(fields).forEach((field) => {
    field.input.addEventListener('blur', () => validateField(field));
    field.input.addEventListener('input', () => {
        if (field.input.hasAttribute('aria-invalid')) {
            validateField(field);
        }
        formStatus.textContent = '';
    });
});

// This prototype validates locally; it does not transmit form data.
contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    formStatus.textContent = '';

    const isValid = Object.values(fields).map(validateField).every(Boolean);
    if (!isValid) {
        contactForm.querySelector('[aria-invalid="true"]')?.focus();
        return;
    }

    formStatus.textContent = 'Thank you. Your details passed validation; this prototype does not send messages.';
    contactForm.reset();
    Object.values(fields).forEach((field) => {
        field.error.textContent = '';
        field.input.removeAttribute('aria-invalid');
    });
});

// Reveal content as it enters view, while leaving it visible if unsupported.
if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    document.querySelectorAll('.section-heading, .value-item, .service-card, .why-card, .way-item, .timeline-step, .office-card, .contact-form, .contact-details').forEach((item) => {
        item.classList.add('reveal');
        revealObserver.observe(item);
    });
}

currentYear.textContent = new Date().getFullYear();
