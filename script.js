document.addEventListener('DOMContentLoaded', () => {

    const header = document.querySelector('.main-header');
    
    // --- HEADER SCROLL BEHAVIOR ---
    // Add/remove a class to the header for a subtle style change on scroll
    const handleScroll = () => {
        if (window.scrollY > 20) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // --- SCROLL-IN ANIMATIONS FOR SECTIONS ---
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

    // --- UPSELL BUILDER INTERACTIVITY ---
    const upsellBuilderItems = document.querySelectorAll('#upsell-builder .builder-item');
    const liveUpsellContainer = document.getElementById('live-upsell-items');
    if (upsellBuilderItems.length > 0 && liveUpsellContainer) {
        upsellBuilderItems.forEach(item => {
            item.addEventListener('click', () => {
                if (item.classList.contains('is-added')) return;
                
                // Mark the builder item as added
                item.classList.add('is-added');

                // Remove empty state if it exists
                const emptyState = liveUpsellContainer.querySelector('.empty-state');
                if (emptyState) emptyState.remove();

                // Get data from the clicked item
                const name = item.dataset.itemName;
                const price = item.dataset.itemPrice;
                const desc = item.dataset.itemDesc;
                const img = item.dataset.itemImg;
                const tags = item.dataset.itemTags.split(',');
                let tagsHTML = tags.map(tag => `<span class="item-tag tag-${tag.toLowerCase().trim()}">${tag}</span>`).join('');

                // Create the new card element
                const card = document.createElement('div');
                card.classList.add('upsell-item-card');
                card.innerHTML = `
                    <img src="${img}" alt="${name}" class="item-image">
                    <div class="item-details">
                        <div class="item-tags">${tagsHTML}</div>
                        <h4>${name}</h4>
                        <p>${desc}</p>
                        <span class="item-price">${price}</span>
                    </div>
                    <button class="item-add-btn"><i data-feather="plus"></i></button>`;
                
                liveUpsellContainer.appendChild(card);
                feather.replace(); // Re-render icons for the new element
            });
        });
    }

    // --- INTERACTIVE AI CHAT MOCKUP ---
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatSuggestionsContainer = document.getElementById('chat-suggestions');
    if (chatMessages && chatForm && chatInput && chatSuggestionsContainer) {
        const suggestions = ["What's the wifi password?", "Can I get a late checkout?", "Recommend a good restaurant"];
        const cannedResponses = {
            "default": "I'm not sure I understand. I can help with questions about your stay, like wifi, pool hours, or local recommendations. How can I assist?",
            "wifi": "Of course! The wifi network is <strong>VillaGuest-5G</strong> and the password is <strong>Paradise2025</strong>.",
            "checkout": "Late checkout may be possible depending on availability. Standard checkout is at 11 AM. I've notified the host of your request, and they will get back to you shortly.",
            "restaurant": "For a great local experience, I recommend <strong>Seafood House</strong> by the beach. It's a 5-minute walk and has amazing fresh fish. I can even help you make a reservation!"
        };

        const displayMessage = (text, sender, delay = 0) => {
            setTimeout(() => {
                const messageElement = document.createElement('div');
                messageElement.classList.add('chat-message', sender);
                messageElement.innerHTML = text;
                chatMessages.appendChild(messageElement);
                chatMessages.scrollTop = chatMessages.scrollHeight;
            }, delay);
        };

        const handleUserInput = (text) => {
            if (!text.trim()) return;
            
            displayMessage(text, 'user');
            chatInput.value = '';
            
            let response = cannedResponses.default;
            const lowerCaseText = text.toLowerCase();
            
            if (lowerCaseText.includes('wifi')) { response = cannedResponses.wifi; } 
            else if (lowerCaseText.includes('checkout')) { response = cannedResponses.checkout; } 
            else if (lowerCaseText.includes('restaurant') || lowerCaseText.includes('food')) { response = cannedResponses.restaurant; }
            
            // Simulate bot thinking
            setTimeout(() => { displayMessage(response, 'bot'); }, 800);
        };

        chatForm.addEventListener('submit', (e) => { 
            e.preventDefault(); 
            handleUserInput(chatInput.value); 
        });

        suggestions.forEach(suggestion => {
            const chip = document.createElement('div');
            chip.classList.add('chat-suggestion-chip');
            chip.textContent = suggestion;
            chip.addEventListener('click', () => handleUserInput(suggestion));
            chatSuggestionsContainer.appendChild(chip);
        });
        
        // Initial bot message
        displayMessage("Hi there! I'm your virtual concierge for the villa. Ask me anything about your stay.", 'bot', 500);
    }
});