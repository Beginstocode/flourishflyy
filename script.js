document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Menu Toggle ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.main-nav ul li a');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active'); // Toggles the mobile menu display
            // Toggles the hamburger/close icon
            const icon = menuToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });

        // Close mobile menu when a navigation link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    // Reset icon to bars
                    const icon = menuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // --- Section Scroll Animations (Fade In) ---
    // This uses the Intersection Observer API for smooth animations as sections come into view.
    const sectionsToAnimate = document.querySelectorAll(
        '#about .about-content, ' + // Selects content specifically for #about
        '.service-item, ' +        // Selects individual service boxes
        '.price-plan, ' +         // Selects individual pricing plans
        '.contact-form, ' +       // Selects the contact form
        '.contact-info'           // Selects the contact info box
    );

    const observerOptions = {
        root: null, // viewport is the root
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in'); // Add a class to trigger CSS animation
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    sectionsToAnimate.forEach(element => {
        observer.observe(element);
    });


    // --- Contact Form Submission (using Formspree.io) ---
    const contactForm = document.getElementById('contactForm');
    const formMessages = document.getElementById('form-messages');

    if (contactForm && formMessages) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault(); // Stop the browser from its default form submission

            const formData = new FormData(contactForm); // Collect all form data
            const formUrl = contactForm.action; // Get the Formspree URL from the form's action attribute

            // Display a loading message
            formMessages.textContent = 'Sending your message...';
            formMessages.className = 'form-messages'; // Reset class for loading state

            try {
                // Send the form data to Formspree
                const response = await fetch(formUrl, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json' // Essential for Formspree to return JSON responses
                    }
                });

                if (response.ok) {
                    // Success!
                    formMessages.textContent = 'Thank you for your message! We will get back to you shortly.';
                    formMessages.className = 'form-messages success'; // Apply success styling
                    contactForm.reset(); // Clear the form fields
                } else {
                    // Something went wrong on Formspree's side or due to invalid input
                    const data = await response.json();
                    if (data.errors) {
                        // Display specific error messages from Formspree
                        formMessages.textContent = data.errors.map(error => error.message).join(', ') || 'An unexpected error occurred.';
                    } else {
                        // General error message
                        formMessages.textContent = 'Oops! There was a problem sending your message. Please try again.';
                    }
                    formMessages.className = 'form-messages error'; // Apply error styling
                }
            } catch (error) {
                // Network error (e.g., no internet connection)
                console.error('Form submission failed:', error);
                formMessages.textContent = 'Network error. Please check your internet connection and try again.';
                formMessages.className = 'form-messages error'; // Apply error styling
            }
        });
    }
});