document.addEventListener('DOMContentLoaded', () => {

    const header = document.querySelector('.main-header');
    
    // --- HEADER SCROLL BEHAVIOR ---
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
                feather.replace();
            });
        });
    }

    // --- NEW & IMPROVED AI CHAT ---
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatSuggestionsContainer = document.getElementById('chat-suggestions');
    if (chatMessages && chatForm && chatInput && chatSuggestionsContainer) {
        const suggestions = ["What's the wifi password?", "Can I get a late checkout?", "Recommend a good restaurant"];

        const displayMessage = (text, sender, isThinking = false) => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('chat-message', sender);
            if(isThinking) {
                messageElement.classList.add('thinking');
                messageElement.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span>`;
            } else {
                 messageElement.innerHTML = text;
            }
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            return messageElement;
        };

        const handleUserInput = async (text) => {
            if (!text.trim()) return;
            
            displayMessage(text, 'user');
            chatInput.value = '';
            
            const thinkingMessage = displayMessage('', 'bot', true);

            try {
                const response = await fetch('/api/server.js', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ question: text }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                // UPDATED LOGIC
                const data = await response.json();
                const markdownResponse = data.answer;
                
                // Create a showdown converter and translate the markdown to HTML
                const converter = new showdown.Converter();
                const htmlResponse = converter.makeHtml(markdownResponse);

                thinkingMessage.classList.remove('thinking');
                thinkingMessage.innerHTML = htmlResponse; // Display the clean HTML

            } catch (error) {
                console.error('Error fetching AI response:', error);
                thinkingMessage.classList.remove('thinking');
                thinkingMessage.innerHTML = "Sorry, I'm having a little trouble connecting right now. Please try again in a moment.";
            }
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
        
        displayMessage("Hi there! I'm your virtual concierge for the villa. Ask me anything about your stay.", 'bot');
    }
});