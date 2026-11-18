const menuToggle = document.querySelector('.menu-toggle');
const navigationMenu = document.querySelector('.navigation-menu');
const navigationLinks = document.querySelectorAll('.navigation-menu a');
const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
const currentYear = document.querySelector('#current-year');

function closeMenu() {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
    navigationMenu.classList.remove('is-open');
}

menuToggle.addEventListener('click', () => {
    const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isExpanded));
    menuToggle.setAttribute('aria-label', isExpanded ? 'Open navigation menu' : 'Close navigation menu');
    navigationMenu.classList.toggle('is-open', !isExpanded);
});

navigationLinks.forEach((link) => {
    link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
        closeMenu();
        menuToggle.focus();
    }
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 680) {
        closeMenu();
    }
});

const fieldRules = {
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

Object.values(fieldRules).forEach((field) => {
    field.input.addEventListener('blur', () => validateField(field));
    field.input.addEventListener('input', () => {
        if (field.input.hasAttribute('aria-invalid')) {
            validateField(field);
        }
        formStatus.textContent = '';
    });
});

contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    formStatus.textContent = '';

    const isValid = Object.values(fieldRules).map(validateField).every(Boolean);
    if (!isValid) {
        contactForm.querySelector('[aria-invalid="true"]')?.focus();
        return;
    }

    formStatus.textContent = 'Thanks. This sample form does not send messages, but your details have passed validation.';
    contactForm.reset();
    Object.values(fieldRules).forEach((field) => {
        field.error.textContent = '';
        field.input.removeAttribute('aria-invalid');
    });
});

currentYear.textContent = new Date().getFullYear();
