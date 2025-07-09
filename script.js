document.addEventListener('DOMContentLoaded', () => {

    // --- NON-CHAT RELATED CODE (No changes here) ---
    const header = document.querySelector('.main-header');
    const handleScroll = () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

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

    // --- UPSELL BUILDER LOGIC FOR PHONE MOCKUP ---
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
                const card = document.createElement('div');
                card.classList.add('upsell-item-card');

                // Correct HTML structure for the items WITHIN the phone mockup
                card.innerHTML = `<img src="${img}" alt="${name}" class="item-image"><div class="item-details"><div class="item-tags">${tagsHTML}</div><h4>${name}</h4><p>${desc}</p><span class="item-price">${price}</span></div><button class="item-add-btn"><i data-feather="plus"></i></button>`;
                
                liveUpsellContainer.appendChild(card);
                feather.replace();
            });
        });
    }

    // --- AI CHAT WITH CORRECTED MEMORY LOGIC ---
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatSuggestionsContainer = document.getElementById('chat-suggestions');

    if (chatMessages && chatForm && chatInput && chatSuggestionsContainer) {
        
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
            const thinkingMessage = displayThinking();
            try {
                const response = await fetch('/api/server.js', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ history: chatHistory }),
                });
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                const aiResponseMarkdown = data.answer;
                chatHistory.push({ role: 'assistant', content: aiResponseMarkdown });
                const aiResponseHtml = converter.makeHtml(aiResponseMarkdown);
                thinkingMessage.remove();
                displayMessage(aiResponseHtml, 'bot');
            } catch (error) {
                console.error('Error fetching AI response:', error);
                thinkingMessage.remove();
                displayMessage("Sorry, I'm having trouble connecting. Please try again.", 'bot');
                chatHistory.pop();
            }
        };

        chatForm.addEventListener('submit', (e) => { 
            e.preventDefault(); 
            handleUserInput(chatInput.value); 
        });

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

    // --- MODAL LOGIC ---
    const pricingButtons = document.querySelectorAll('.pricing-card .btn[data-plan]');
    const modalOverlay = document.getElementById('founding-member-modal');

    if (modalOverlay && pricingButtons.length > 0) {
        const modalContentWrapper = document.getElementById('modal-content-wrapper');

        const hideModal = () => {
            modalOverlay.classList.remove('is-visible');
            modalOverlay.setAttribute('aria-hidden', 'true');
        };

        const showModal = (planName) => {
            const formHTML = `
                <button class="modal-close" aria-label="Close modal">×</button>
                <div class="modal-icon">
                    <i data-feather="key"></i>
                </div>
                <h2 class="modal-title">Welcome, Founding Member!</h2>
                <p class="modal-text">
                    Thank you for choosing the <strong>${planName}</strong> plan! Our Founding Member program is now full, but because you showed interest early, we've reserved a spot just for you with a <strong>50% lifetime discount</strong>.
                </p>
                <form class="modal-form" id="modal-claim-form">
                    <input type="email" id="modal-email-input" placeholder="Enter your email to claim" required>
                    <button type="submit" class="btn btn-primary">Claim My 50% Discount</button>
                </form>
            `;
            modalContentWrapper.innerHTML = formHTML;
            modalOverlay.classList.add('is-visible');
            modalOverlay.setAttribute('aria-hidden', 'false');
            feather.replace();
            const emailInput = document.getElementById('modal-email-input');
            if (emailInput) {
                emailInput.focus();
            }
            modalContentWrapper.querySelector('.modal-close').addEventListener('click', hideModal);
            modalContentWrapper.querySelector('#modal-claim-form').addEventListener('submit', (e) => {
                e.preventDefault();
                const submittedEmail = emailInput.value;
                if (submittedEmail) {
                    handleFormSuccess(planName, submittedEmail);
                }
            });
        };
        
        const handleFormSuccess = (planName, email) => {
             console.log(`Email submitted for ${planName} plan discount: ${email}`);
             const confirmationHTML = `
                <button class="modal-close" aria-label="Close modal">×</button>
                <div class="modal-icon">
                    <i data-feather="key"></i>
                </div>
                <h2 class="modal-title">Awesome!</h2>
                <p class="modal-text">Your 50% discount for the <strong>${planName}</strong> plan is secured. We've sent a confirmation to your inbox.</p>
                <div class="email-confirmation-box">
                    We'll notify you at: <strong>${email}</strong>
                </div>
                <button class="btn btn-primary" id="final-close-btn">I'll Watch My Inbox</button>
             `;
             modalContentWrapper.innerHTML = confirmationHTML;
             feather.replace();
             modalContentWrapper.querySelector('.modal-close').addEventListener('click', hideModal);
             modalContentWrapper.querySelector('#final-close-btn').addEventListener('click', hideModal);
        };

        pricingButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const plan = button.dataset.plan;
                if (plan) {
                    showModal(plan);
                }
            });
        });

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                hideModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modalOverlay.classList.contains('is-visible')) {
                hideModal();
            }
        });
    }
});