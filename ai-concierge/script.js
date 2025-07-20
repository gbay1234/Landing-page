document.addEventListener('DOMContentLoaded', () => {

    // --- SHARED LOGIC (RUNS ON ALL PAGES) ---
    
    // Header scroll effect
    const header = document.querySelector('.main-header');
    if (header) {
        const handleScroll = () => {
            if (window.scrollY > 20) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        // Initialize on load
        handleScroll();
    }

    // Fade-in elements on scroll
    if ('IntersectionObserver' in window) {
        const revealElements = document.querySelectorAll('[data-reveal]');
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-revealed');
                    observer.unobserve(entry.target);
                }
            });
        }, { root: null, threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
        revealElements.forEach(el => { revealObserver.observe(el); });
    }
    
    // --- ARTICLE PAGE SPECIFIC LOGIC ---

    // Reading Progress Bar
    const progressBar = document.getElementById('progressBar');
    if (progressBar && document.body.classList.contains('article-page')) {
        const updateProgressBar = () => {
            const { scrollTop, scrollHeight } = document.documentElement;
            // Subtract window.innerHeight to get the actual scrollable distance
            const scrollableHeight = scrollHeight - window.innerHeight;
            if (scrollableHeight > 0) {
                const scrollPercent = (scrollTop / scrollableHeight) * 100;
                progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
            } else {
                progressBar.style.width = '0%';
            }
        };
        window.addEventListener('scroll', updateProgressBar, { passive: true });
        // Initialize on load
        updateProgressBar();
    }

    // --- HOMEPAGE SPECIFIC LOGIC (WILL NOT RUN ON ARTICLE PAGES) ---

    // Upsell Builder Demo
    const upsellBuilderItems = document.querySelectorAll('#upsell-builder .builder-item');
    const liveUpsellContainer = document.getElementById('live-upsell-items');
    if (upsellBuilderItems.length > 0 && liveUpsellContainer) {
        upsellBuilderItems.forEach(item => {
            item.addEventListener('click', () => {
                if (item.classList.contains('is-added')) return;
                item.classList.add('is-added');
                const emptyState = liveUpsellContainer.querySelector('.empty-state');
                if (emptyState) emptyState.remove();
                const name = item.dataset.itemName;
                const price = item.dataset.itemPrice;
                const desc = item.dataset.itemDesc;
                const img = item.dataset.itemImg;
                const tags = item.dataset.itemTags.split(',');
                let tagsHTML = tags.map(tag => `<span class="item-tag tag-${tag.toLowerCase().trim()}">${tag}</span>`).join('');
                
                const plusIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;

                const card = document.createElement('div');
                card.classList.add('upsell-item-card');
                card.innerHTML = `<img src="${img}" alt="${name}" class="item-image"><div class="item-details"><div class="item-header"><div class="item-title-wrapper"><div class="item-tags">${tagsHTML}</div><h4>${name}</h4></div><button class="item-add-btn">${plusIconSVG}</button></div><p>${desc}</p><span class="item-price">${price}</span></div>`;
                liveUpsellContainer.appendChild(card);
            });
        });
    }

    // AI Chat Demo
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatSuggestionsContainer = document.getElementById('chat-suggestions');
    if (chatMessages && chatForm && chatInput && chatSuggestionsContainer) {
        if (typeof showdown === 'undefined') {
            console.error("Showdown library not loaded.");
            return;
        }
        let chatHistory = [];
        const converter = new showdown.Converter(); 
        const displayMessage = (htmlContent, sender) => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('chat-message', sender);
            messageElement.innerHTML = htmlContent;
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            return messageElement;
        };
        const displayThinking = () => {
            const thinkingElement = document.createElement('div');
            thinkingElement.classList.add('chat-message', 'bot', 'thinking');
            thinkingElement.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span>`;
            chatMessages.appendChild(thinkingElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            return thinkingElement;
        };
        
        const handleUserInput = async (text) => {
            if (!text.trim()) return;
            chatHistory.push({ role: 'user', content: text });
            displayMessage(text, 'user');
            chatInput.value = '';
            if (chatSuggestionsContainer) {
                chatSuggestionsContainer.style.display = 'none';
            }
            const thinkingMessage = displayThinking();
            try {
                const response = await fetch('/api/server', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ history: chatHistory }),
                });
                thinkingMessage.remove();
                if (!response.ok) {
                    const errorData = await response.json().catch(() => null);
                    const errorMessage = errorData?.error || `An error occurred (Status: ${response.status}).`;
                    throw new Error(errorMessage);
                }
                const data = await response.json();
                const aiResponseMarkdown = data.answer;
                chatHistory.push({ role: 'assistant', content: aiResponseMarkdown });
                const aiResponseHtml = converter.makeHtml(aiResponseMarkdown);
                displayMessage(aiResponseHtml, 'bot');
            } catch (error) {
                console.error("Error fetching from AI backend:", error);
                if (thinkingMessage && thinkingMessage.parentElement) {
                    thinkingMessage.remove();
                }
                const errorHtml = converter.makeHtml("I'm sorry, but I'm having trouble connecting right now. This is a demo; please check your connection or try again in a moment.");
                displayMessage(errorHtml, 'bot');
            }
        };
        
        chatForm.addEventListener('submit', (e) => { e.preventDefault(); handleUserInput(chatInput.value); });
        const suggestions = ["What's the wifi password?", "Can I get a late checkout?", "Recommend a good restaurant"];
        suggestions.forEach(suggestion => {
            const chip = document.createElement('div');
            chip.classList.add('chat-suggestion-chip');
            chip.textContent = suggestion;
            chip.addEventListener('click', () => handleUserInput(suggestion));
            chatSuggestionsContainer.appendChild(chip);
        });
        const initialMessageMarkdown = "Hi there! I'm your virtual concierge for the villa. Ask me anything about your stay.";
        chatHistory.push({ role: 'assistant', content: initialMessageMarkdown });
        const initialMessageHtml = converter.makeHtml(initialMessageMarkdown);
        displayMessage(initialMessageHtml, 'bot');
    }

    // Modal Form Logic
    const modalOverlay = document.getElementById('founding-member-modal');
    if (modalOverlay) {
        const modalContentWrapper = document.getElementById('modal-content-wrapper');

        const hideModal = () => {
            modalOverlay.classList.remove('is-visible');
            modalOverlay.setAttribute('aria-hidden', 'true');
        };

        const showModalSuccess = (planName, email) => {
            const checkCircleSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
            const confirmationHTML = `
                <button class="modal-close" aria-label="Close modal">×</button>
                <div class="modal-icon" style="background-color: #22c55e;">${checkCircleSVG}</div>
                <h2 class="modal-title">You're on the list!</h2>
                <p class="modal-text">Awesome! Your offer for the <strong>${planName}</strong> plan is secured. We'll notify you at:</p>
                <div class="email-confirmation-box"><strong>${email}</strong></div>
                <button class="btn btn-primary" id="final-close-btn">Sounds Good</button>
            `;
            modalContentWrapper.innerHTML = confirmationHTML;
            modalContentWrapper.querySelector('.modal-close').addEventListener('click', hideModal);
            modalContentWrapper.querySelector('#final-close-btn').addEventListener('click', hideModal);
        };
        
        const showModalForm = (planName) => {
            const keyIconSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>`;
            const formHTML = `
                <button class="modal-close" aria-label="Close modal">×</button>
                <div class="modal-icon">${keyIconSVG}</div>
                <h2 class="modal-title">Claim Your Founding Offer</h2>
                <p class="modal-text">
                    You've selected the <strong>${planName}</strong> plan. Enter your email to lock in your spot and a special founding member discount.
                </p>
                <form 
                    class="modal-form" 
                    id="modal-claim-form" 
                    action="https://formspree.io/f/mgvyjbdb" 
                    method="POST"
                >
                    <input type="hidden" name="plan" value="${planName}">
                    <input type="email" name="email" id="modal-email-input" placeholder="Enter your email to claim" required>
                    <button type="submit" class="btn btn-primary">Claim My Founding Offer</button>
                </form>
            `;
            modalContentWrapper.innerHTML = formHTML;
            modalOverlay.classList.add('is-visible');
            modalOverlay.setAttribute('aria-hidden', 'false');
            
            const emailInput = document.getElementById('modal-email-input');
            if (emailInput) emailInput.focus();
            
            modalContentWrapper.querySelector('.modal-close').addEventListener('click', hideModal);
            modalContentWrapper.querySelector('#modal-claim-form').addEventListener('submit', (e) => {
                e.preventDefault();
                const form = e.target;
                const formData = new FormData(form);
                const submittedEmail = formData.get('email');
                fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                }).then(response => {
                    if (response.ok) {
                        showModalSuccess(planName, submittedEmail);
                    } else {
                        throw new Error('Form submission failed');
                    }
                }).catch(error => {
                    console.error(error);
                    alert('Oops! There was a problem submitting the form. Please try again.');
                });
            });
        };

        const pricingButtons = document.querySelectorAll('.pricing-card .btn[data-plan]');
        pricingButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const plan = button.dataset.plan;
                if (plan) showModalForm(plan);
            });
        });

        modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) hideModal(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modalOverlay.classList.contains('is-visible')) hideModal(); });
    }

    // FAQ Accordion Logic
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');

            question.addEventListener('click', () => {
                const isOpen = item.classList.contains('is-open');

                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('is-open');
                        otherItem.querySelector('.faq-answer').style.maxHeight = '0';
                    }
                });

                // Toggle the clicked item
                if (isOpen) {
                    item.classList.remove('is-open');
                    answer.style.maxHeight = '0';
                } else {
                    item.classList.add('is-open');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                }
            });
        });
    }
    // --- ADDED: FOOTER CONTACT FORM LOGIC ---
    const footerForm = document.getElementById('footer-contact-form');
    if (footerForm) {
        footerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const form = e.target;
            const formData = new FormData(form);
            const statusDiv = document.getElementById('footer-form-status');
            const submitButton = form.querySelector('button[type="submit"]');

            // Show a "sending" state
            if (statusDiv) statusDiv.innerHTML = '';
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.textContent = 'Sending...';
            }

            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    if (statusDiv) {
                         statusDiv.innerHTML = `<p style="color: #22c55e;">Thank you! Your message has been sent.</p>`;
                    }
                    if (submitButton) submitButton.textContent = 'Message Sent!';
                    form.reset();
                } else {
                    // This handles server-side validation errors from Formspree
                    response.json().then(data => {
                        if (Object.hasOwn(data, 'errors')) {
                             if (statusDiv) statusDiv.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                        } else {
                            if (statusDiv) statusDiv.innerHTML = `<p style="color: #ef4444;">Oops! There was a problem. Please try again.</p>`;
                        }
                    }).catch(() => { // Catch JSON parsing errors
                         if (statusDiv) statusDiv.innerHTML = `<p style="color: #ef4444;">Oops! There was a problem. Please try again.</p>`;
                    });
                    // Re-enable button on error
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.textContent = 'Send Message';
                    }
                }
            }).catch(error => {
                // This handles network errors
                if (statusDiv) statusDiv.innerHTML = `<p style="color: #ef4444;">Oops! A network error occurred. Please try again.</p>`;
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.textContent = 'Send Message';
                }
            });
        });
    }
});