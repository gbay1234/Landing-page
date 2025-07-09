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
        
        // This array will now correctly store the entire conversation.
        let chatHistory = [];
        const converter = new showdown.Converter(); // Create the converter once.

        // A simplified function to just display a message.
        const displayMessage = (htmlContent, sender) => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('chat-message', sender);
            messageElement.innerHTML = htmlContent;
            chatMessages.appendChild(messageElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            return messageElement;
        };
        
        // A dedicated function for the "thinking" bubble.
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

            // 1. Add user's plain text message to history.
            chatHistory.push({ role: 'user', content: text });

            // 2. Display the user's message (as plain text).
            displayMessage(text, 'user');
            chatInput.value = '';

            // 3. Display the "thinking" bubble.
            const thinkingMessage = displayThinking();

            try {
                // 4. Send the complete and correct history to the server.
                const response = await fetch('/api/server.js', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ history: chatHistory }),
                });

                if (!response.ok) throw new Error('Network response was not ok');

                const data = await response.json();
                const aiResponseMarkdown = data.answer;

                // 5. THIS IS THE CRITICAL FIX: Add the AI's raw response to history.
                chatHistory.push({ role: 'assistant', content: aiResponseMarkdown });

                // 6. Convert the AI's markdown response to clean HTML.
                const aiResponseHtml = converter.makeHtml(aiResponseMarkdown);

                // 7. Remove the "thinking" bubble and display the final AI message.
                thinkingMessage.remove();
                displayMessage(aiResponseHtml, 'bot');

            } catch (error) {
                console.error('Error fetching AI response:', error);
                thinkingMessage.remove();
                displayMessage("Sorry, I'm having trouble connecting. Please try again.", 'bot');
                // If the API call fails, remove the user's last message from history to prevent errors.
                chatHistory.pop();
            }
        };

        // --- Event Listeners and Initial Message ---
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
        
        // Setup the initial bot message.
        const initialMessageMarkdown = "Hi there! I'm your virtual concierge for the villa. Ask me anything about your stay.";
        chatHistory.push({ role: 'assistant', content: initialMessageMarkdown });
        const initialMessageHtml = converter.makeHtml(initialMessageMarkdown);
        displayMessage(initialMessageHtml, 'bot');
    }
});