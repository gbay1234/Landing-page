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
    // (This section remains unchanged)
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

    // --- AI CHAT WITH CONVERSATIONAL MEMORY ---
    const chatMessages = document.getElementById('chat-messages');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatSuggestionsContainer = document.getElementById('chat-suggestions');
    if (chatMessages && chatForm && chatInput && chatSuggestionsContainer) {
        
        // --- THE BIG CHANGE IS HERE: We now store the conversation history ---
        let chatHistory = [];

        const suggestions = ["What's the wifi password?", "Can I get a late checkout?", "Recommend a good restaurant"];

        const displayMessage = (text, sender, isThinking = false) => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('chat-message', sender);
            if(isThinking) {
                messageElement.classList.add('thinking');
                messageElement.innerHTML = `<span class="dot"></span><span class="dot"></span><span class="dot"></span>`;
            } else {
                 const converter = new showdown.Converter();
                 messageElement.innerHTML = converter.makeHtml(text);
            }
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            return messageElement;
        };

        const handleUserInput = async (text) => {
            if (!text.trim()) return;
            
            // Add user message to history and display it
            chatHistory.push({ role: 'user', content: text });
            displayMessage(text, 'user');
            chatInput.value = '';
            
            const thinkingMessage = displayMessage('', 'bot', true);

            try {
                // Send the ENTIRE chat history to the server
                const response = await fetch('/api/server.js', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ history: chatHistory }), // We now send the history array
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                const aiResponse = data.answer;
                
                // Add the AI's response to our history
                chatHistory.push({ role: 'assistant', content: aiResponse });

                thinkingMessage.classList.remove('thinking');
                // Use innerText to set the raw markdown, then let displayMessage convert it
                thinkingMessage.innerText = aiResponse;
                // Re-run displayMessage's conversion logic on the final message
                const converter = new showdown.Converter();
                thinkingMessage.innerHTML = converter.makeHtml(aiResponse);

            } catch (error) {
                console.error('Error fetching AI response:', error);
                thinkingMessage.classList.remove('thinking');
                thinkingMessage.innerHTML = "Sorry, I'm having a little trouble connecting right now. Please try again in a moment.";
                // Remove the last user message from history if the API call failed
                chatHistory.pop();
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
        
        // Add the initial message to history and display it
        const initialMessage = "Hi there! I'm your virtual concierge for the villa. Ask me anything about your stay.";
        chatHistory.push({ role: 'assistant', content: initialMessage });
        displayMessage(initialMessage, 'bot');
    }
});