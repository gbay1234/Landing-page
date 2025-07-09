document.addEventListener('DOMContentLoaded', () => {

    // --- NON-FORM-RELATED CODE (HEADER SCROLL, REVEAL, UPSELL BUILDER, AI CHAT) ---
    // This code remains the same.
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
                card.innerHTML = `<img src="${img}" alt="${name}" class="item-image"><div class="item-details"><div class="item-header"><div class="item-title-wrapper"><div class="item-tags">${tagsHTML}</div><h4>${name}</h4></div><button class="item-add-btn"><i data-feather="plus"></i></button></div><p>${desc}</p><span class="item-price">${price}</span></div>`;
                liveUpsellContainer.appendChild(card);
                feather.replace();
            });
        });
    }

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
        
        // --- UPDATED AI CHAT LOGIC ---
        const handleUserInput = async (text) => {
            if (!text.trim()) return;
            chatHistory.push({ role: 'user', content: text });
            displayMessage(text, 'user');
            chatInput.value = '';
            const thinkingMessage = displayThinking();

            // Simulated AI Response Logic
            setTimeout(() => {
                thinkingMessage.remove();
                let aiResponseMarkdown;
                const lowerCaseText = text.toLowerCase();

                if (lowerCaseText.includes('wifi') || lowerCaseText.includes('password')) {
                    aiResponseMarkdown = "The WiFi network is **VillaOasis_5G** and the password is **Paradise2025**. Enjoy your streaming!";
                } else if (lowerCaseText.includes('late checkout') || lowerCaseText.includes('check out') || lowerCaseText.includes('checkout')) {
                    aiResponseMarkdown = "Standard checkout is at **11:00 AM**. A late checkout might be possible depending on availability. Please contact the villa manager to confirm. A small fee may apply.";
                } else if (lowerCaseText.includes('restaurant') || lowerCaseText.includes('food') || lowerCaseText.includes('eat')) {
                    aiResponseMarkdown = "You're in for a treat! For a stunning sunset dinner, I recommend **La Brisa** on Echo Beach. For authentic Indonesian cuisine, **Warung Ganesha** is a local favorite. Let me know if you'd like me to make a reservation!";
                } else if (lowerCaseText.includes('pool') || lowerCaseText.includes('towel')) {
                    aiResponseMarkdown = "You can find fresh, fluffy pool towels in the large white cabinet next to the living room's main sliding door. Help yourself!";
                } else if (lowerCaseText.includes('breakfast')) {
                    aiResponseMarkdown = "Breakfast is served from **8:00 AM to 10:30 AM**. You can explore the menu and place an order directly from the 'In-Villa Dining' section of this app.";
                } else if (lowerCaseText.includes('hello') || lowerCaseText.includes('hi') || lowerCaseText.includes('hey')) {
                     aiResponseMarkdown = "Hello there! How can I make your stay at Villa Oasis even better today?";
                } else {
                    aiResponseMarkdown = "That's a great question. For the most accurate information, I'd recommend checking the digital Guest Booklet or contacting the villa manager directly. Can I help with anything else, like the wifi password or local recommendations?";
                }
                
                chatHistory.push({ role: 'assistant', content: aiResponseMarkdown });
                const aiResponseHtml = converter.makeHtml(aiResponseMarkdown);
                displayMessage(aiResponseHtml, 'bot');
            }, 1200); // A snappier response time
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

    // --- MODAL FORM LOGIC (WIRED TO FORMSPREE) ---
    const modalOverlay = document.getElementById('founding-member-modal');
    if (modalOverlay) {
        const modalContentWrapper = document.getElementById('modal-content-wrapper');

        const hideModal = () => {
            modalOverlay.classList.remove('is-visible');
            modalOverlay.setAttribute('aria-hidden', 'true');
        };

        const showModalSuccess = (planName, email) => {
            const confirmationHTML = `
                <button class="modal-close" aria-label="Close modal">×</button>
                <div class="modal-icon" style="background-color: #22c55e;"><i data-feather="check-circle"></i></div>
                <h2 class="modal-title">You're on the list!</h2>
                <p class="modal-text">Awesome! Your offer for the <strong>${planName}</strong> plan is secured. We'll notify you at:</p>
                <div class="email-confirmation-box"><strong>${email}</strong></div>
                <button class="btn btn-primary" id="final-close-btn">Sounds Good</button>
            `;
            modalContentWrapper.innerHTML = confirmationHTML;
            feather.replace();
            modalContentWrapper.querySelector('.modal-close').addEventListener('click', hideModal);
            modalContentWrapper.querySelector('#final-close-btn').addEventListener('click', hideModal);
        };
        
        const showModalForm = (planName) => {
            // This HTML block now contains your specific Formspree endpoint
            const formHTML = `
                <button class="modal-close" aria-label="Close modal">×</button>
                <div class="modal-icon"><i data-feather="key"></i></div>
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
                    <!-- This hidden input is crucial for categorizing your leads! -->
                    <input type="hidden" name="plan" value="${planName}">
                    <input type="email" name="email" id="modal-email-input" placeholder="Enter your email to claim" required>
                    <button type="submit" class="btn btn-primary">Claim My Founding Offer</button>
                </form>
            `;
            modalContentWrapper.innerHTML = formHTML;
            modalOverlay.classList.add('is-visible');
            modalOverlay.setAttribute('aria-hidden', 'false');
            feather.replace();
            
            const emailInput = document.getElementById('modal-email-input');
            if (emailInput) emailInput.focus();
            
            modalContentWrapper.querySelector('.modal-close').addEventListener('click', hideModal);

            // This handler sends the data to Formspree
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
                        console.log("Modal form submitted successfully to Formspree");
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
});