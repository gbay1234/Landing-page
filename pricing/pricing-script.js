document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Smooth Scroll-in Animations for Sections
    const revealElements = document.querySelectorAll('[data-reveal]');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null,
        threshold: 0.1,
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
    
    // 2. Initialize Feather Icons
    // The actual call is in the HTML body.

    // 3. FAQ Accordion Accessibility & Animation (Handled by <details> element)
    // No JS is needed.

    // 4. "Fake Door" Pricing Plan Logic (Revised for "Founding Member" Flow)
    const planButtons = document.querySelectorAll('.pricing-card .btn');
    const revealModal = document.getElementById('reveal-modal');
    const closeModalBtn = revealModal.querySelector('.modal-close-btn');
    const confirmModalBtn = document.getElementById('modal-confirm-btn');
    const revealModalText = document.getElementById('reveal-modal-text');
    const userEmailDisplay = document.getElementById('user-email-display');

    const openRevealModal = (planName) => {
        // 1. Get the email we saved from the previous step
        const userEmail = localStorage.getItem('staxyPioneerEmail') || 'the email you provided';

        // 2. Customize the text
        revealModalText.innerHTML = `Thank you for choosing the <strong>${planName}</strong> plan! Our Founding Member program is now full, but because you showed interest early, we've reserved a spot just for you with a <strong>50% lifetime discount.</strong>`;
        userEmailDisplay.textContent = userEmail;
        
        // 3. Show the modal
        revealModal.classList.remove('hidden');
        feather.replace(); // Re-initialize icons for the new 'award' icon
    };

    const closeRevealModal = () => {
        revealModal.classList.add('hidden');
    };

    planButtons.forEach(button => {
        if (button.href.includes('your-app.com') || button.href.includes('mailto:')) {
            button.addEventListener('click', (e) => {
                e.preventDefault();

                const card = button.closest('.pricing-card');
                const planName = card.querySelector('h3').textContent;

                console.log(`--- PLAN CLICKED (VALIDATION) ---`);
                console.log(`User selected the "${planName}" plan.`);
                
                openRevealModal(planName);
            });
        }
    });

    // Event listeners for closing the modal
    closeModalBtn.addEventListener('click', closeRevealModal);
    confirmModalBtn.addEventListener('click', closeRevealModal);
});