/* --- START OF FILE builder-script.js --- */

document.addEventListener("DOMContentLoaded", () => {
  // A helper function to create unique IDs for new items.
  const newId = () => `id_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // --- START: MAIN APPLICATION OBJECT ---
  // The App object holds all the data, state, and functions for the entire guest portal.
  const App = {
    // --- START: App Data (The "Database" of the App) ---
    // This section contains all the default content for the villa.
    // Think of it as the starting point or the "saved state" of your portal.
    data: {
      villaName: "Villa Oasis",
      headerSubtitle: "Your private concierge, just a tap away.",
      headerImage: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&q=80&w=1925",
      brandColor: "#3B82F6",
      essentials: {
        wifi: { id: 'wifi', type: 'pre-made', title: 'WiFi Access', icon: 'fa-solid fa-wifi', active: true, modal: 'wifi-modal', data: { name: 'VillaOasis_Guest', pass: 'welcome2024' } },
        contact: { id: 'contact', type: 'pre-made', title: 'Contact Host', icon: 'fa-solid fa-comment-dots', active: true, modal: 'contact-modal', data: { name: 'Villa Manager', phone: '+6281234567890', whatsapp: '+6281234567890' } },
        checkout: { id: 'checkout', type: 'pre-made', title: 'Check-in / Out', icon: 'fa-solid fa-clock', active: true, dynamicSubtitle: true, data: { in: '14:00', out: '11:00' } },
        directions: { id: 'directions', type: 'pre-made', title: 'How To Get Here', icon: 'fa-solid fa-map-pin', active: true, modal: 'directions-modal', data: {} },
        keys: { id: 'keys', type: 'pre-made', title: 'Key & Access', icon: 'fa-solid fa-key', active: false, modal: 'key-modal', data: { instructions: 'The main key is in the lockbox next to the door. The code is 1-2-3-4.' } },
        housekeeping: { id: 'housekeeping', type: 'pre-made', title: 'Housekeeping', icon: 'fa-solid fa-broom', active: false, modal: 'housekeeping-modal', data: { info: 'Daily light cleaning is provided between 10 AM and 12 PM. Full linen change every 3 days.' } }
      },
      directions: {
        image: "https://i.imgur.com/GXBf12a.jpeg",
        gmapsLink: "https://maps.app.goo.gl/m3fQPf2U4b9BvxmN9",
        title1: "From The Airport",
        content1: "We recommend using our trusted airport transfer service for a seamless arrival. A driver will be waiting for you with a sign bearing your name. The journey takes approximately 45 minutes depending on traffic.",
        title2: "Driving Yourself?",
        content2: "Search for \"Villa Oasis, Seminyak\" on Google Maps or Waze for the most accurate route. We have private parking available for one car and several scooters."
      },
      homeNavCards: [
        {
          target: "extras-screen",
          icon: "fa-bell-concierge",
          title: "Extras & Services",
          subtitle: "Browse dining, book a massage, or rent a scooter.",
        },
        {
          target: "explore-screen",
          icon: "fa-map",
          title: "Explore the Island",
          subtitle: "Our curated map of restaurants, beaches, and sights.",
        },
        {
          target: "guide-screen",
          icon: "fa-book",
          title: "The Villa Guide",
          subtitle:
            "All the details: house rules, how-to's, and emergency info.",
        },
      ],
      guideSections: [
        {
          id: newId(),
          title: "Arrival & Check-in",
          content:
            "<p><b>Check-In Time:</b> After 2:00 PM</p><p><b>Check-Out Time:</b> Before 11:00 AM</p><p><br></p><p><b>Directions:</b> Please see the 'How to Get Here' card on the Home screen for detailed directions and map access.</p>",
        },
        {
          id: newId(),
          title: "How-To Guides",
          content:
            "<p><b>Jacuzzi:</b> Press the 'Jets' button. It takes 15 mins to heat.</p><p><b>Air Conditioning:</b> Use the remote control. We recommend 24°C for comfort and energy saving.</p>",
        },
        {
          id: newId(),
          title: "House Rules & Policies",
          content:
            "<ul><li>Please, no smoking inside the villa.</li><li>No unregistered guests are permitted overnight.</li><li>Keep noise to a minimum after 10 PM.</li></ul><p><br></p><p>Enjoy your stay!</p>",
        },
      ],
      menuCategories: [
        { id: "cat1", name: "In-Villa Dining" },
        { id: "cat2", name: "Experiences" },
      ],
      menuItems: [
        {
          id: newId(),
          categoryId: "cat1",
          name: "Nasi Goreng Special",
          description: "<p>Classic Indonesian fried rice with chicken satay & fried egg.</p>",
          price: 85000,
          image: "https://images.pexels.com/photos/2347311/pexels-photo-2347311.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          tags: ['Top Seller', 'Spicy 🌶️'],
          extraInfo: 'Can be made vegetarian upon request. Please allow **30 minutes** for preparation.'
        },
        {
          id: newId(),
          categoryId: "cat1",
          name: "Fresh Coconut Water",
          description: "<p>Straight from the tree. The perfect poolside refreshment.</p>",
          price: 35000,
          image: "https://images.pexels.com/photos/2233348/pexels-photo-2233348.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          tags: ['Healthy', 'Vegan'],
          extraInfo: ''
        },
        {
          id: newId(),
          categoryId: "cat2",
          name: "Private Yoga Session",
          description: "<p>A 60-minute private yoga class with a certified instructor, right here at the villa.</p>",
          price: 450000,
          image: "https://images.pexels.com/photos/3822623/pexels-photo-3822623.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          tags: ['Romantic', 'Wellness'],
          extraInfo: 'Requires booking **12 hours** in advance. Please inform staff of any injuries.'
        },
      ],
      exploreLocations: [
        {
          id: newId(),
          category: "Restaurant",
          name: "Seaside Grill",
          description: "<p>The absolute best spot for fresh seafood with your feet in the sand. A guest favorite!</p>",
          image: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          gmapsUrl: "https://maps.app.goo.gl/m3fQPf2U4b9BvxmN9",
          distance: "5 min drive",
        },
        {
          id: newId(),
          category: "Beach",
          name: "Hidden Gem Beach",
          description: "<p>A quiet, pristine beach perfect for relaxing away from the crowds. A short scooter ride away.</p>",
          image: "https://images.pexels.com/photos/1430677/pexels-photo-1430677.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          gmapsUrl: "https://maps.app.goo.gl/m3fQPf2U4b9BvxmN9",
          distance: "10 min scooter",
        },
        {
          id: newId(),
          category: "Sight",
          name: "Sunrise Temple",
          description: "<p>A beautiful historic temple with breathtaking views, especially at sunrise. Respectful attire required.</p>",
          image: "https://images.pexels.com/photos/2618991/pexels-photo-2618991.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
          gmapsUrl: "https://maps.app.goo.gl/m3fQPf2U4b9BvxmN9",
          distance: "20 min drive",
        },
      ],
    },
    // --- END: App Data (The "Database" of the App) ---

    // --- START: App State (Dynamic User Data) ---
    state: {
      cart: {},
      activeMenuCategoryId: "cat1",
      isEditing: false,
      activeExploreCategory: "All",
      chatHistory: [],
      emailGatePassed: false,
      editorEverOpened: false,
      proTipsShown: {
        personalization: false,
        menuItem: false,
        guideSection: false,
      },
      toastTimerId: null,
    },
    // --- END: App State (Dynamic User Data) ---

    // --- START: Core App Initialization ---
    init() {
      this.converter = new showdown.Converter();
      this.cacheDOMElements();
      this.renderAll();
      this.registerEventListeners();
      this.Editor.init(this);
    },

    cacheDOMElements() {
      this.dom = {
        app: document.getElementById("app"),
        screens: document.querySelectorAll(".screen"),
        bottomNav: document.getElementById("bottom-nav"),
        villaName: document.querySelector('[data-editor-target="villaName"]'),
        headerSubtitle: document.querySelector('[data-editor-target="headerSubtitle"]'),
        heroHeaders: document.querySelectorAll(".hero-header"),
        essentialsGrid: document.querySelector('.essentials-grid'),
        homeNavContainer: document.querySelector(".navigation-section"),
        accordionContainer: document.querySelector(".accordion-container"),
        menuTabsContainer: document.getElementById("menu-tabs-container"),
        menuItemsContainer: document.getElementById("menu-items-container"),
        viewOrderBar: document.getElementById("view-order-bar"),
        orderCountBadge: document.getElementById("order-count-badge"),
        orderModal: document.getElementById("order-modal"),
        orderItemsList: document.getElementById("order-items-list"),
        orderSubtotal: document.getElementById("order-subtotal"),
        orderService: document.getElementById("order-service"),
        orderTotal: document.getElementById("order-total"),
        wifiModal: document.getElementById("wifi-modal"),
        contactModal: document.getElementById('contact-modal'),
        keyModal: document.getElementById('key-modal'),
        housekeepingModal: document.getElementById('housekeeping-modal'),
        directionsModal: document.getElementById("directions-modal"),
        customEssentialModal: document.getElementById('custom-essential-modal'),
        directionsImage: document.querySelector('[data-editor-target="directionsImage"]'),
        directionsGmapsLink: document.querySelector('[data-editor-target="directionsGmapsLink"]'),
        directionsTitle1: document.querySelector('[data-editor-target="directionsTitle1"]'),
        directionsContent1: document.querySelector('[data-editor-target="directionsContent1"]'),
        directionsTitle2: document.querySelector('[data-editor-target="directionsTitle2"]'),
        directionsContent2: document.querySelector('[data-editor-target="directionsContent2"]'),
        itemDetailModal: document.getElementById("item-detail-modal"),
        detailItemImage: document.getElementById("detail-item-image"),
        detailItemTags: document.getElementById("detail-item-tags"),
        detailItemName: document.getElementById("detail-item-name"),
        detailItemDescription: document.getElementById("detail-item-description"),
        detailItemExtraInfoContainer: document.getElementById("detail-item-extra-info-container"),
        detailItemExtraInfo: document.getElementById("detail-item-extra-info"),
        detailItemPrice: document.getElementById("detail-item-price"),
        detailAddToOrderBtn: document.getElementById("detail-add-to-order-btn"),
        copyPassBtn: document.getElementById("copy-pass-btn"),
        editorPanel: document.getElementById("live-editor-panel"),
        editToggleBtn: document.getElementById("edit-toggle-btn"),
        exploreFiltersContainer: document.querySelector(".explore-filters-container"),
        exploreListContainer: document.getElementById("explore-list-container"),
        chatModal: document.getElementById("chat-modal"),
        chatMessageList: document.getElementById("chat-message-list"),
        chatWelcomeMessage: document.getElementById("chat-welcome-message"),
        chatForm: document.getElementById("chat-form"),
        chatInput: document.getElementById("chat-input"),
        chatLoadingIndicator: document.getElementById("chat-loading"),
        emailGateModal: document.getElementById("email-gate-modal"),
        emailGateForm: document.getElementById("email-gate-form"),
        emailGateInput: document.getElementById("email-gate-input"),
        successToast: document.getElementById("success-toast"),
        publishNowBtn: document.getElementById("publish-now-btn"),
      };
    },
    // --- END: Core App Initialization ---

    // --- START: Render Functions (Drawing content on the screen) ---
    updateSharedImages() {
        const imageUrl = `url('${this.data.headerImage}')`;
        // Set the background for the entire page body
        document.body.style.backgroundImage = imageUrl;
        // Set the background for the hero headers inside the app
        this.dom.heroHeaders.forEach(h => h.style.backgroundImage = imageUrl);
    },

    renderAll() {
      document.documentElement.style.setProperty("--brand-color", this.data.brandColor);
      this.dom.villaName.textContent = this.data.villaName;
      this.dom.headerSubtitle.textContent = this.data.headerSubtitle;
      this.updateSharedImages();
      this.renderHomeNav();
      this.renderEssentials();
      this.renderGuide();
      this.renderDirections();
      this.renderMenu();
      this.renderExplorePage();
    },

    renderEssentials() {
        this.dom.essentialsGrid.innerHTML = '';
        const activeEssentials = Object.values(this.data.essentials).filter(e => e.active);
        
        activeEssentials.forEach(essential => {
            const card = document.createElement('button');
            card.className = 'info-card';
            card.dataset.id = essential.id;
            
            if (essential.type === 'pre-made') {
                card.dataset.modalTarget = essential.modal;
            } else if (essential.type === 'custom') {
                card.dataset.modalTarget = 'custom-essential-modal';
            }

            let subtitle = '';
            if (essential.dynamicSubtitle) {
                const formatTime = (timeStr) => {
                    if (!timeStr) return "";
                    const [h, m] = timeStr.split(":");
                    const hours = parseInt(h, 10);
                    const suffix = hours >= 12 ? "PM" : "AM";
                    const h12 = ((hours + 11) % 12) + 1;
                    return `${h12}:${m} ${suffix}`;
                };
                subtitle = `<span>${formatTime(essential.data.in)} / ${formatTime(essential.data.out)}</span>`;
            }

            card.innerHTML = `
                <i class="${essential.icon}"></i>
                <div class="info-card-content">
                    <h3>${essential.title}</h3>
                    ${subtitle}
                </div>
            `;
            this.dom.essentialsGrid.appendChild(card);
        });
    },

    renderHomeNav() {
      const h2 = this.dom.homeNavContainer.querySelector("h2");
      this.dom.homeNavContainer.innerHTML = "";
      if (h2) this.dom.homeNavContainer.appendChild(h2);
      this.data.homeNavCards.forEach((card) => {
        const cardEl = document.createElement("button");
        cardEl.className = "nav-guide-card";
        cardEl.dataset.target = card.target;
        cardEl.innerHTML = `<div class="icon-bg"><i class="fas ${card.icon}"></i></div><div class="nav-guide-card-text"><h3>${card.title}</h3><p>${card.subtitle}</p></div><i class="fa-solid fa-chevron-right chevron"></i>`;
        this.dom.homeNavContainer.appendChild(cardEl);
      });
    },
    
    renderDirections() {
        const { image, gmapsLink, title1, content1, title2, content2 } = this.data.directions;
        this.dom.directionsImage.src = image;
        this.dom.directionsGmapsLink.href = gmapsLink;
        this.dom.directionsTitle1.textContent = title1;
        this.dom.directionsContent1.textContent = content1;
        this.dom.directionsTitle2.textContent = title2;
        this.dom.directionsContent2.textContent = content2;
    },

    renderGuide() {
      this.dom.accordionContainer.innerHTML = "";
      this.data.guideSections.forEach((section) => {
        const item = document.createElement("div");
        item.className = "accordion-item";
        item.innerHTML = `<button class="accordion-header"><span><i class="fa-solid fa-book-open"></i> ${section.title}</span><i class="fa-solid fa-chevron-down"></i></button><div class="accordion-content">${section.content}</div>`;
        item.querySelector(".accordion-header").addEventListener("click", () => item.classList.toggle("active"));
        this.dom.accordionContainer.appendChild(item);
      });
    },

    renderMenu() {
      this.dom.menuTabsContainer.innerHTML = "";
      this.data.menuCategories.forEach((cat) => {
        const tab = document.createElement("a");
        tab.href = "#";
        tab.textContent = cat.name;
        tab.dataset.categoryId = cat.id;
        if (cat.id === this.state.activeMenuCategoryId) tab.classList.add("active");
        this.dom.menuTabsContainer.appendChild(tab);
      });
      this.renderMenuItems();
    },

    renderMenuItems() {
      this.dom.menuItemsContainer.innerHTML = "";
      this.data.menuItems
        .filter((item) => item.categoryId === this.state.activeMenuCategoryId)
        .forEach((item) => {
          const itemEl = document.createElement("div");
          itemEl.className = "menu-item";
          itemEl.dataset.id = item.id;
          const tagsHtml = item.tags.map((tag, index) => `<span class="item-tag tag-style-${(index % 4) + 1}">${tag}</span>`).join('');
          
          itemEl.innerHTML = `
            <img class="item-image" src="${item.image}" alt="${item.name}">
            <div class="item-details">
                <div class="item-tags-container">${tagsHtml}</div>
                <h3 class="item-name">${item.name}</h3>
                <div class="item-description">${item.description}</div>
                <p class="item-price">IDR ${item.price.toLocaleString("id-ID")}</p>
            </div>
            <button class="add-button" data-item-id="${item.id}">+</button>`;

            itemEl.addEventListener('click', (e) => {
                if (!e.target.closest('.add-button')) {
                    this.showItemDetail(item.id);
                }
            });
          this.dom.menuItemsContainer.appendChild(itemEl);
        });
    },

    renderExplorePage() {
      this.renderExploreFilters();
      this.renderExploreLocations();
    },

    renderExploreFilters() {
      this.dom.exploreFiltersContainer.innerHTML = "";
      const categories = ["All", ...new Set(this.data.exploreLocations.map((loc) => loc.category))];
      categories.forEach((cat) => {
        const btn = document.createElement("button");
        btn.className = "filter-btn";
        btn.textContent = cat;
        btn.dataset.category = cat;
        if (cat === this.state.activeExploreCategory) btn.classList.add("active");
        this.dom.exploreFiltersContainer.appendChild(btn);
      });
    },

    renderExploreLocations() {
      this.dom.exploreListContainer.innerHTML = "";
      const filteredLocations = this.data.exploreLocations.filter((loc) => this.state.activeExploreCategory === "All" || loc.category === this.state.activeExploreCategory);
      if (filteredLocations.length === 0) {
        this.dom.exploreListContainer.innerHTML = `<p style="text-align:center; color: #777;">No locations found for this category.</p>`;
        return;
      }
      filteredLocations.forEach((loc) => {
        const card = document.createElement("div");
        card.className = "location-card";
        card.innerHTML = `
                  <img src="${loc.image}" alt="${loc.name}" class="location-card-image">
                  <div class="location-card-content">
                      <div class="location-card-meta">
                          <span class="location-tag distance-tag"><i class="fa-solid fa-route"></i> ${loc.distance}</span>
                      </div>
                      <h3>${loc.name}</h3>
                      <div class="location-description">${loc.description}</div>
                      <div class="location-card-actions">
                          <a href="${loc.gmapsUrl}" target="_blank" class="location-action-btn">
                              <i class="fa-solid fa-diamond-turn-right"></i> Directions
                          </a>
                      </div>
                  </div>`;
        this.dom.exploreListContainer.appendChild(card);
      });
    },
    // --- END: Render Functions ---

    // --- START: UI Interaction Functions (Shopping Cart, Modals, etc.) ---
    showItemDetail(itemId) {
        const item = this.data.menuItems.find(i => i.id === itemId);
        if (!item) return;
        this.dom.detailItemImage.src = item.image;
        this.dom.detailItemImage.alt = item.name;
        this.dom.detailItemName.textContent = item.name;
        this.dom.detailItemDescription.innerHTML = item.description; 
        this.dom.detailItemPrice.textContent = `IDR ${item.price.toLocaleString("id-ID")}`;
        this.dom.detailItemTags.innerHTML = item.tags.map((tag, index) => `<span class="item-tag tag-style-${(index % 4) + 1}">${tag}</span>`).join('');
        if (item.extraInfo && item.extraInfo.trim() !== '') {
            this.dom.detailItemExtraInfo.innerHTML = this.converter.makeHtml(item.extraInfo);
            this.dom.detailItemExtraInfoContainer.classList.remove('hidden');
        } else {
            this.dom.detailItemExtraInfoContainer.classList.add('hidden');
        }
        this.dom.detailAddToOrderBtn.dataset.itemId = item.id;
        this.dom.itemDetailModal.classList.remove('hidden');
    },
    
    showModal(modalId, essentialId = null) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        // Populate modal content before showing
        switch(modalId) {
            case 'wifi-modal':
                modal.querySelector('#wifi-name').textContent = this.data.essentials.wifi.data.name;
                modal.querySelector('#wifi-pass').textContent = this.data.essentials.wifi.data.pass;
                break;
            case 'contact-modal':
                const contact = this.data.essentials.contact.data;
                const container = modal.querySelector('#contact-info-container');
                container.innerHTML = `
                    <p class="contact-intro">For any questions or immediate assistance, feel free to reach out to <strong>${contact.name}</strong>.</p>
                    <div class="contact-actions">
                        <a href="https://wa.me/${contact.whatsapp.replace(/\+/g, '')}" target="_blank" class="contact-action-btn whatsapp">
                            <i class="fab fa-whatsapp"></i>
                            <span>Message on WhatsApp</span>
                        </a>
                        <a href="tel:${contact.phone}" class="contact-action-btn phone">
                            <i class="fa-solid fa-phone"></i>
                            <span>Call Now</span>
                        </a>
                    </div>
                `;
                break;
            case 'key-modal':
                modal.querySelector('#key-instructions').textContent = this.data.essentials.keys.data.instructions;
                break;
            case 'housekeeping-modal':
                modal.querySelector('#housekeeping-info').textContent = this.data.essentials.housekeeping.data.info;
                break;
            case 'directions-modal':
                this.renderDirections(); // Ensure directions data is fresh
                break;
            case 'custom-essential-modal':
                const essential = this.data.essentials[essentialId];
                if(essential) {
                    const imgEl = modal.querySelector('#custom-essential-image');
                    const titleEl = modal.querySelector('#custom-essential-title');
                    const descEl = modal.querySelector('#custom-essential-description');
                    
                    if (essential.data.image && !essential.data.image.includes('via.placeholder.com')) {
                        imgEl.src = essential.data.image;
                        imgEl.alt = essential.title;
                        imgEl.style.display = 'block';
                    } else {
                        imgEl.style.display = 'none';
                    }
                    titleEl.textContent = essential.title;
                    descEl.innerHTML = essential.data.description;
                }
                break;
        }

        modal.classList.remove('hidden');
    },

    addToCart(itemId) {
      this.state.cart[itemId] = (this.state.cart[itemId] || 0) + 1;
      this.renderCart();
    },

    removeFromCart(itemId) {
        if (this.state.cart[itemId] > 1) this.state.cart[itemId]--;
        else delete this.state.cart[itemId];
        this.renderCart();
    },

    renderCart() {
      const itemCount = Object.values(this.state.cart).reduce((sum, qty) => sum + qty, 0);
      if (itemCount === 0) {
        this.dom.viewOrderBar.classList.add("hidden");
        if (!this.dom.orderModal.classList.contains('hidden')) this.dom.orderModal.classList.add('hidden');
        return;
      }
      this.dom.viewOrderBar.classList.remove("hidden");
      this.dom.orderCountBadge.textContent = itemCount;
      let subtotal = 0;
      this.dom.orderItemsList.innerHTML = "";
      for (const itemId in this.state.cart) {
        const item = this.data.menuItems.find((i) => i.id === itemId);
        if (item) {
          const quantity = this.state.cart[itemId];
          const itemTotal = item.price * quantity;
          subtotal += itemTotal;
          const li = document.createElement("div");
          li.className = "order-item";
          li.innerHTML = `
            <div class="order-item-details">
              <span>${item.name}</span>
              <span>IDR ${item.price.toLocaleString("id-ID")}</span>
            </div>
            <div class="order-item-controls">
              <button data-item-id="${itemId}" class="cart-remove-btn">-</button>
              <span>${quantity}</span>
              <button data-item-id="${itemId}" class="cart-add-btn">+</button>
            </div>
            <span class="order-item-total">Rp ${itemTotal.toLocaleString("id-ID")}</span>`;
          this.dom.orderItemsList.appendChild(li);
        }
      }
      const service = subtotal * 0.1;
      const total = subtotal + service;
      this.dom.orderSubtotal.textContent = `Rp ${subtotal.toLocaleString("id-ID")}`;
      this.dom.orderService.textContent = `Rp ${service.toLocaleString("id-ID")}`;
      this.dom.orderTotal.textContent = `Rp ${total.toLocaleString("id-ID")}`;
    },
    // --- END: UI Interaction Functions ---
    
    // --- START: AI Chat Functions ---
    displayChatMessage(htmlContent, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-bubble', sender);
        
        const finalHtml = this.converter.makeHtml(htmlContent);
        messageElement.innerHTML = finalHtml;
        
        this.dom.chatMessageList.appendChild(messageElement);
        this.dom.chatMessageList.scrollTop = this.dom.chatMessageList.scrollHeight;
        return messageElement;
    },

    displayThinkingIndicator() {
      this.dom.chatLoadingIndicator.classList.remove('hidden');
      this.dom.chatMessageList.scrollTop = this.dom.chatMessageList.scrollHeight;
    },

    hideThinkingIndicator() {
      this.dom.chatLoadingIndicator.classList.add('hidden');
    },

    async handleSendMessage(event) {
      event.preventDefault();
      const userInput = this.dom.chatInput.value.trim();
      if (!userInput) return;

      this.state.chatHistory.push({ role: 'user', content: userInput });
      this.displayChatMessage(userInput, 'user');
      this.dom.chatInput.value = '';
      
      this.displayThinkingIndicator();

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ history: this.state.chatHistory })
        });

        this.hideThinkingIndicator();

        if (!response.ok) throw new Error(`API error: ${response.statusText}`);
        
        const data = await response.json();
        const aiResponseMarkdown = data.answer;

        this.state.chatHistory.push({ role: 'assistant', content: aiResponseMarkdown });
        this.displayChatMessage(aiResponseMarkdown, 'model');

      } catch (error) {
        console.error("Error fetching AI response:", error);
        this.hideThinkingIndicator();
        this.displayChatMessage("Sorry, I'm having trouble connecting right now. Please try again in a moment.", 'model');
      }
    },
    // --- END: AI Chat Functions ---
    
    // --- START: App Logic and Handlers ---
    handleEmailGateSubmit(event) {
      event.preventDefault();
      const email = this.dom.emailGateInput.value.trim();
      if (email) {
        console.log(`Email captured for analytics: ${email}`);
        this.state.emailGatePassed = true;
        this.dom.emailGateModal.classList.add("hidden");
        this.Editor.open();
      }
    },

    showToast(message) {
      clearTimeout(this.state.toastTimerId);
      this.dom.successToast.textContent = message;
      this.dom.successToast.classList.add("visible");
      this.state.toastTimerId = setTimeout(() => {
        this.dom.successToast.classList.remove("visible");
      }, 3000);
    },

    triggerEducationalToast(type) {
      if (this.state.proTipsShown[type]) return;
      const proTips = {
        personalization: "Pro-Tip: First impressions matter. Personalize your portal to create a premium welcome experience for guests.",
        menuItem: "Pro-Tip: Unlock new revenue. Offer experiences and services your guests will love to book directly.",
        guideSection: "Pro-Tip: Fewer questions, happier guests. A detailed guide prevents confusion and late-night calls."
      };
      const message = proTips[type];
      if (!message) return;
      clearTimeout(this.state.toastTimerId);
      this.dom.successToast.textContent = message;
      this.dom.successToast.classList.add("visible");
      this.state.toastTimerId = setTimeout(() => {
        this.dom.successToast.classList.remove("visible");
      }, 6000);
      this.state.proTipsShown[type] = true;
    },

    /*    handlePublish() {
      this.Editor.close();
      // Redirect the user to the specified URL
      window.location.href = 'https://staxy.com/builder';
      console.log("--- PUBLISH ACTION TRIGGERED, REDIRECTING ---");
    },*/
    // --- END: App Logic and Handlers ---
    
    // --- START: Event Listeners (Making things clickable) ---
    registerEventListeners() {
      // --- BOTTOM NAVIGATION ---
      this.dom.bottomNav.addEventListener("click", e => {
        const navBtn = e.target.closest(".nav-btn");
        if (!navBtn) return;
        
        const targetId = navBtn.dataset.target;

        if (targetId === 'chat-modal') {
          this.dom.chatModal.classList.remove("hidden");
        } else if (document.getElementById(targetId)) {
          this.dom.screens.forEach(s => s.classList.remove("active"));
          document.getElementById(targetId).classList.add("active");
          this.dom.bottomNav.querySelectorAll('.nav-btn').forEach(b => {
            b.classList.toggle('active', b.dataset.target === targetId);
          });
        }
      });
        
      // --- DELEGATED BODY CLICKS (for dynamic elements) ---
      document.body.addEventListener("click", (e) => {
        // --- Home Screen Navigation Cards ---
        const homeNavCard = e.target.closest(".nav-guide-card");
        if (homeNavCard) {
          const targetId = homeNavCard.dataset.target;
          const correspondingNavBtn = this.dom.bottomNav.querySelector(`.nav-btn[data-target="${targetId}"]`);
          if (correspondingNavBtn) {
            correspondingNavBtn.click();
          }
          return;
        }
        
        // --- Home Screen Essential Cards ---
        const essentialCard = e.target.closest(".info-card[data-modal-target]");
        if (essentialCard) {
          this.showModal(essentialCard.dataset.modalTarget, essentialCard.dataset.id);
          return;
        }
        
        // --- Modal Close Buttons ---
        if (e.target.closest(".modal-close-btn")) {
          e.target.closest(".modal-overlay").classList.add("hidden");
          return;
        }

        // --- View Order Floating Bar ---
        if (e.target.closest("#view-order-button")) {
          this.showModal('order-modal');
          return;
        }

        // --- Add to Order button (in menu list) ---
        const addButton = e.target.closest(".add-button");
        if (addButton) {
          this.addToCart(addButton.dataset.itemId);
          return;
        }
        
        // --- Add to Order button (in item detail modal) ---
        const detailAddButton = e.target.closest("#detail-add-to-order-btn");
        if (detailAddButton) {
            const item = this.data.menuItems.find(i => i.id === detailAddButton.dataset.itemId);
            this.addToCart(item.id);
            this.showToast(`${item.name} added to order!`);
            this.dom.itemDetailModal.classList.add('hidden');
            return;
        }
        
        // --- Close icon picker if clicking outside ---
        if (!e.target.closest('.icon-picker-container')) {
            document.querySelectorAll('.icon-picker-panel.active').forEach(panel => {
                panel.classList.remove('active');
            });
        }
      });
      
      // --- SPECIFIC ELEMENT LISTENERS ---
      
      // --- Publish Button ---
      // this.dom.publishNowBtn.addEventListener("click", () => this.handlePublish());

      // --- WiFi Modal Copy Button ---
      this.dom.copyPassBtn.addEventListener('click', () => {
        const pass = this.dom.wifiModal.querySelector('#wifi-pass').textContent;
        navigator.clipboard.writeText(pass).then(() => {
            this.showToast('Password copied to clipboard!');
        }).catch(err => {
            console.error('Failed to copy password: ', err);
            alert('Could not copy password.');
        });
      });

      // --- Order Modal Controls (+/- buttons) ---
      this.dom.orderItemsList.addEventListener('click', e => {
          if (e.target.classList.contains('cart-add-btn')) {
              this.addToCart(e.target.dataset.itemId);
          }
          if (e.target.classList.contains('cart-remove-btn')) {
              this.removeFromCart(e.target.dataset.itemId);
          }
      });

      // --- Menu and Explore Screen Filters/Tabs ---
      this.dom.menuTabsContainer.addEventListener("click", (e) => {
        e.preventDefault();
        const tab = e.target.closest("a");
        if (tab && tab.dataset.categoryId) {
          this.state.activeMenuCategoryId = tab.dataset.categoryId;
          this.renderMenu();
        }
      });
      this.dom.exploreFiltersContainer.addEventListener("click", (e) => {
        const filterBtn = e.target.closest(".filter-btn");
        if (filterBtn) {
          this.state.activeExploreCategory = filterBtn.dataset.category;
          this.renderExplorePage();
        }
      });
      
      // --- AI Chat ---
      this.dom.chatForm.addEventListener("submit", (e) => this.handleSendMessage(e));
      
      this.dom.chatMessageList.addEventListener('click', e => {
          const actionBtn = e.target.closest('.ai-action-btn');
          if (!actionBtn) return;

          const action = actionBtn.dataset.action;
          switch (action) {
              case 'navigate-extras':
                  this.dom.bottomNav.querySelector('[data-target="extras-screen"]').click();
                  this.dom.chatModal.classList.add('hidden');
                  break;
              case 'navigate-explore':
                  this.dom.bottomNav.querySelector('[data-target="explore-screen"]').click();
                  this.dom.chatModal.classList.add('hidden');
                  break;
              case 'check-dates':
                  actionBtn.disabled = true;
                  actionBtn.textContent = 'Coming Soon!';
                  this.showToast('This is a demo. In a real app, this would open a booking calendar!');
                  break;
          }
      });

      // --- Email Gate for Editor ---
      this.dom.emailGateForm.addEventListener("submit", (e) => this.handleEmailGateSubmit(e));
    },
    // --- END: Event Listeners ---
    
    // --- START: LIVE EDITOR OBJECT ---
    Editor: {
      init(appInstance) {
        this.App = appInstance;
        this.cacheEditorDOMElements();
        this.registerEditorEventListeners();
        this.icons = {
            'fa-solid fa-star': 'Star', 'fa-solid fa-utensils': 'Restaurant', 'fa-solid fa-cocktail': 'Bar', 'fa-solid fa-store': 'Shopping',
            'fa-solid fa-spa': 'Spa', 'fa-solid fa-person-swimming': 'Pool / Beach', 'fa-solid fa-car': 'Transport', 'fa-solid fa-info-circle': 'Information',
            'fa-solid fa-briefcase-medical': 'Medical', 'fa-solid fa-plane-departure': 'Airport', 'fa-solid fa-bicycle': 'Activities', 'fa-solid fa-camera-retro': 'Sightseeing'
        };
      },
      cacheEditorDOMElements() {
        this.dom = {
          panel: document.getElementById("live-editor-panel"),
          closeBtn: document.getElementById("close-editor-btn"),
          tabs: document.getElementById("editor-tabs"),
          tabBtns: document.querySelectorAll(".editor-tab-btn"),
          tabPanes: document.querySelectorAll(".editor-tab-pane"),
          villaNameInput: document.getElementById("villa-name-input"),
          headerImageUpload: document.getElementById("header-image-upload"),
          brandColorInput: document.getElementById("brand-color-input"),
          homeSubtitleInput: document.getElementById("home-subtitle-input"),
          editorEssentialsList: document.getElementById('editor-essentials-list'),
          addCustomEssentialBtn: document.getElementById('add-custom-essential-btn'),
          exploreLocationsList: document.getElementById("editor-explore-locations-list"),
          addExploreLocationBtn: document.getElementById("add-explore-location-btn"),
          categoriesList: document.getElementById("editor-categories-list"),
          addCategoryBtn: document.getElementById("add-category-btn"),
          itemsList: document.getElementById("editor-items-list"),
          addMenuItemBtn: document.getElementById("add-menu-item-btn"),
          guideList: document.getElementById("editor-guide-list"),
          addGuideBtn: document.getElementById("add-guide-btn"),
        };
      },
      open() {
        this.dom.panel.classList.add("visible");
        this.populateAllTabs();
        if (!this.App.state.editorEverOpened) {
            this.App.state.editorEverOpened = true;
            this.App.dom.app.classList.add('editor-was-opened');
        }
      },
      close() {
        this.dom.panel.classList.remove("visible");
      },

      populateAllTabs() {
        this.dom.villaNameInput.value = this.App.data.villaName;
        this.dom.homeSubtitleInput.value = this.App.data.headerSubtitle;
        this.dom.brandColorInput.value = this.App.data.brandColor;
        this.populateHomeTab();
        this.populateMenuTab();
        this.populateGuideTab();
        this.populateExploreTab();
      },
      
      populateHomeTab() {
          this.dom.editorEssentialsList.innerHTML = '';
          Object.values(this.App.data.essentials).forEach(essential => {
              if (essential.type === 'pre-made') {
                  this.addEssentialEditorCard(essential);
              } else if (essential.type === 'custom') {
                  this.addCustomEssentialEditorCard(essential);
              }
          });
      },
      
      addEssentialEditorCard(essential) {
        const card = document.createElement('div');
        card.className = 'editor-accordion-card';
        card.dataset.essentialId = essential.id;
        card.dataset.type = 'pre-made';

        let formContent = '';
        switch(essential.id) {
            case 'wifi':
                formContent = `
                    <div class="form-group"><label>Network Name</label><input type="text" data-key="name" value="${essential.data.name}"></div>
                    <div class="form-group"><label>Password</label><input type="text" data-key="pass" value="${essential.data.pass}"></div>
                `;
                break;
            case 'contact':
                formContent = `
                    <div class="form-group"><label>Contact Person Name</label><input type="text" data-key="name" value="${essential.data.name}"></div>
                    <div class="form-group">
                        <label>WhatsApp Number</label>
                        <div class="input-with-icon"><span class="icon-prefix"><i class="fab fa-whatsapp"></i></span><input type="tel" data-key="whatsapp" value="${essential.data.whatsapp}"></div>
                    </div>
                    <div class="form-group">
                        <label>Phone Number</label>
                        <div class="input-with-icon"><span class="icon-prefix"><i class="fa-solid fa-phone"></i></span><input type="tel" data-key="phone" value="${essential.data.phone}"></div>
                    </div>
                `;
                break;
            case 'checkout':
                 formContent = `<div class="form-group"><label>Check-in / Check-out Times</label><div class="time-inputs"><input type="time" data-key="in" value="${essential.data.in}"><input type="time" data-key="out" value="${essential.data.out}"></div></div>`;
                break;
            case 'directions':
                const d = this.App.data.directions;
                formContent = `
                    <div class="form-group">
                        <label>Preview Image</label>
                        <input type="file" class="file-input" data-key="image" accept="image/*" id="dir-img-upload" />
                        <label class="file-input-label" for="dir-img-upload">Choose a file...</label>
                    </div>
                    <div class="form-group"><label>Google Maps Link</label><input type="text" data-key="gmapsLink" value="${d.gmapsLink}"></div>
                    <div class="form-group"><label>Title 1</label><input type="text" data-key="title1" value="${d.title1}"></div>
                    <div class="form-group"><label>Content 1</label><textarea rows="4" data-key="content1">${d.content1}</textarea></div>
                    <div class="form-group"><label>Title 2</label><input type="text" data-key="title2" value="${d.title2}"></div>
                    <div class="form-group"><label>Content 2</label><textarea rows="4" data-key="content2">${d.content2}</textarea></div>
                `;
                break;
            case 'keys':
                formContent = `<div class="form-group"><label>Instructions</label><textarea rows="4" data-key="instructions">${essential.data.instructions}</textarea></div>`;
                break;
            case 'housekeeping':
                formContent = `<div class="form-group"><label>Service Details</label><textarea rows="4" data-key="info">${essential.data.info}</textarea></div>`;
                break;
        }

        card.innerHTML = `
            <div class="editor-accordion-header">
                <div class="form-group-row" style="flex-grow: 1; padding-right: 15px;">
                    <label for="toggle-${essential.id}" style="font-weight: 700;">${essential.title}</label>
                    <input type="checkbox" id="toggle-${essential.id}" class="editor-toggle" ${essential.active ? 'checked' : ''}>
                </div>
                ${formContent ? '<i class="fa-solid fa-chevron-down"></i>' : ''}
            </div>
            ${formContent ? `<div class="editor-accordion-content">${formContent}</div>` : ''}
        `;
        this.dom.editorEssentialsList.appendChild(card);
      },

      createIconPicker(essential) {
        const container = document.createElement('div');
        container.className = 'icon-picker-container';

        const displayBtn = document.createElement('button');
        displayBtn.className = 'icon-picker-btn';

        const panel = document.createElement('div');
        panel.className = 'icon-picker-panel';
        
        const updateDisplay = (iconClass, iconName) => {
            displayBtn.innerHTML = `
                <span><i class="${iconClass}"></i> ${iconName}</span>
                <i class="fa-solid fa-chevron-down"></i>
            `;
        };

        for (const [iconClass, iconName] of Object.entries(this.icons)) {
            const optionBtn = document.createElement('button');
            optionBtn.className = 'icon-option-btn';
            optionBtn.dataset.iconClass = iconClass;
            optionBtn.innerHTML = `<i class="${iconClass}"></i><span>${iconName}</span>`;
            if (essential.icon === iconClass) {
                optionBtn.classList.add('selected');
            }

            optionBtn.addEventListener('click', () => {
                essential.icon = iconClass;
                updateDisplay(iconClass, iconName);
                panel.classList.remove('active');
                
                panel.querySelector('.selected')?.classList.remove('selected');
                optionBtn.classList.add('selected');

                this.App.renderEssentials();
            });
            panel.appendChild(optionBtn);
        }

        displayBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            panel.classList.toggle('active');
        });

        updateDisplay(essential.icon, this.icons[essential.icon] || 'Select Icon');
        container.append(displayBtn, panel);
        return container;
      },
      
      createRichTextEditor(container, initialContent, onUpdateCallback) {
        const quill = new Quill(container, {
            modules: {
                toolbar: [
                    ['bold', 'italic'],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }]
                ]
            },
            placeholder: 'Type your description here...',
            theme: 'snow'
        });

        quill.pasteHTML(initialContent || '');
        quill.on('text-change', () => {
            onUpdateCallback(quill.root.innerHTML);
        });
      },

      addCustomEssentialEditorCard(essential) {
          const template = document.getElementById("editor-custom-essential-template");
          const card = template.content.cloneNode(true).firstElementChild;
          card.dataset.essentialId = essential.id;

          card.querySelector('.essential-item-title').value = essential.title;
          
          const iconFormGroup = card.querySelector('.form-group:nth-child(2)');
          iconFormGroup.appendChild(this.createIconPicker(essential));

          const editorContainer = card.querySelector('.quill-editor-container');
          this.createRichTextEditor(editorContainer, essential.data.description, (newContent) => {
              essential.data.description = newContent;
          });

          const titleLabel = card.querySelector('.editor-accordion-title');
          titleLabel.textContent = essential.title;

          const toggle = card.querySelector('.editor-accordion-header .editor-toggle');
          if (toggle) {
              toggle.checked = essential.active;
              const newIdVal = `toggle-${essential.id}`;
              toggle.id = newIdVal;
              const label = card.querySelector('.editor-accordion-header label');
              if (label) label.htmlFor = newIdVal;
          }
          
          card.querySelector('.essential-item-title').addEventListener('input', (e) => {
              titleLabel.textContent = e.target.value;
              essential.title = e.target.value;
              this.App.renderEssentials();
          });

          this.dom.editorEssentialsList.appendChild(card);
      },

      populateMenuTab() {
        this.dom.itemsList.innerHTML = "";
        this.dom.categoriesList.innerHTML = "";
        this.App.data.menuCategories.forEach((cat) => this.addCategoryCard(cat));
        this.updateCategoryButtonStates();
        this.App.data.menuItems.forEach((item) => this.addMenuItemCard(item));
      },
      addCategoryCard(category) {
        const card = document.createElement("div");
        card.className = "editor-category-card";
        card.dataset.id = category.id;
        card.innerHTML = `<input type="text" value="${category.name}"><button class="editor-remove-btn" title="Remove Category"><i class="fa-solid fa-trash"></i></button>`;
        this.dom.categoriesList.appendChild(card);
      },
      updateCategoryButtonStates() {
        const count = this.App.data.menuCategories.length;
        this.dom.addCategoryBtn.disabled = count >= 3;
        this.dom.categoriesList.querySelectorAll(".editor-remove-btn").forEach((btn) => (btn.disabled = count <= 1));
      },
      addMenuItemCard(item) {
        const template = document.getElementById("editor-menu-item-template");
        const cardHtml = template.innerHTML.replace(/\{\{id\}\}/g, item.id);
        const cardWrapper = document.createElement("div");
        cardWrapper.innerHTML = cardHtml;
        const card = cardWrapper.firstElementChild;
        card.dataset.id = item.id;
        
        card.querySelector(".editor-accordion-title").textContent = item.name;
        card.querySelector(".menu-item-name").value = item.name;
        card.querySelector(".menu-item-price").value = item.price;
        card.querySelector(".menu-item-tags").value = item.tags.join(', ');
        card.querySelector(".menu-item-extra").value = item.extraInfo;

        const select = card.querySelector(".menu-item-category-select");
        this.updateAllCategorySelectors(select, item.categoryId);
        this.dom.itemsList.appendChild(card);
        
        const editorContainer = card.querySelector('.quill-editor-container');
        this.createRichTextEditor(editorContainer, item.description, (newContent) => {
            item.description = newContent;
            this.App.renderMenuItems();
        });
      },
      updateAllCategorySelectors(singleSelect = null, selectedId = null) {
        const categoryOptions = this.App.data.menuCategories.map((cat) => `<option value="${cat.id}">${cat.name}</option>`).join("");
        const selectsToUpdate = singleSelect ? [singleSelect] : this.dom.itemsList.querySelectorAll(".menu-item-category-select");
        selectsToUpdate.forEach((select) => {
          const currentVal = selectedId || select.value;
          select.innerHTML = categoryOptions;
          select.value = currentVal;
        });
      },
      populateGuideTab() {
        this.dom.guideList.innerHTML = "";
        this.App.data.guideSections.forEach((section) => this.addGuideCard(section));
      },
      addGuideCard(section) {
        const template = document.getElementById("editor-guide-item-template");
        const card = template.content.cloneNode(true).firstElementChild;
        card.dataset.id = section.id;
        card.querySelector(".editor-accordion-title").textContent = section.title;
        card.querySelector(".guide-item-title").value = section.title;
        
        const editorContainer = card.querySelector('.quill-editor-container');
        this.createRichTextEditor(editorContainer, section.content, (newContent) => {
            section.content = newContent;
            this.App.renderGuide();
        });

        this.dom.guideList.appendChild(card);
      },
      populateExploreTab() {
          this.dom.exploreLocationsList.innerHTML = "";
          this.App.data.exploreLocations.forEach(loc => this.addExploreLocationCard(loc));
      },
      addExploreLocationCard(location) {
        const template = document.getElementById("editor-explore-location-template");
        const cardHtml = template.innerHTML.replace(/\{\{id\}\}/g, location.id);
        const cardWrapper = document.createElement("div");
        cardWrapper.innerHTML = cardHtml;
        const card = cardWrapper.firstElementChild;
        card.dataset.id = location.id;
        card.querySelector(".editor-accordion-title").textContent = location.name;
        card.querySelector(".location-item-name").value = location.name;
        card.querySelector(".location-item-category").value = location.category;
        card.querySelector(".location-item-distance").value = location.distance;
        card.querySelector(".location-item-gmaps").value = location.gmapsUrl;
        
        const editorContainer = card.querySelector('.quill-editor-container');
        this.createRichTextEditor(editorContainer, location.description, (newContent) => {
            location.description = newContent;
            this.App.renderExplorePage();
        });

        this.dom.exploreLocationsList.appendChild(card);
      },
      
      registerEditorEventListeners() {
        this.App.dom.editToggleBtn.addEventListener("click", () => {
          if (this.App.state.emailGatePassed) this.open();
          else this.App.dom.emailGateModal.classList.remove("hidden");
        });

        this.dom.closeBtn.addEventListener("click", () => this.close());
        this.dom.tabs.addEventListener("click", (e) => {
            const tabBtn = e.target.closest(".editor-tab-btn");
            if (!tabBtn) return;
            this.dom.tabBtns.forEach((b) => b.classList.remove("active"));
            this.dom.tabPanes.forEach((p) => p.classList.remove("active"));
            tabBtn.classList.add("active");
            document.getElementById(`${tabBtn.dataset.tab}-tab-content`).classList.add("active");
        });

        // --- GLOBAL EDITOR INPUTS ---
        this.dom.villaNameInput.addEventListener("input", (e) => { this.App.data.villaName = e.target.value; this.App.renderAll(); });
        this.dom.villaNameInput.addEventListener("focus", () => this.App.triggerEducationalToast('personalization'));
        this.dom.headerImageUpload.addEventListener("change", (e) => { if(e.target.files[0]) {this.App.data.headerImage = URL.createObjectURL(e.target.files[0]); this.App.renderAll();} });
        this.dom.brandColorInput.addEventListener("input", (e) => { this.App.data.brandColor = e.target.value; this.App.renderAll(); });
        this.dom.homeSubtitleInput.addEventListener("input", (e) => { this.App.data.headerSubtitle = e.target.value; this.App.renderAll(); });
        
        // --- HOME TAB LISTENERS ---
        this.dom.addCustomEssentialBtn.addEventListener('click', () => {
            const activeCount = Object.values(this.App.data.essentials).filter(es => es.active).length;
            if (activeCount >= 6) {
                this.App.showToast('You can have a maximum of 6 active essentials.');
                return;
            }
            const newIdVal = newId();
            const newEssential = {
                id: newIdVal,
                type: 'custom',
                title: 'New Link',
                icon: 'fa-solid fa-star',
                active: true,
                data: {
                    description: '<p>This is the content for your new essential link.</p>',
                    image: 'https://via.placeholder.com/400x220'
                }
            };
            this.App.data.essentials[newIdVal] = newEssential;
            this.addCustomEssentialEditorCard(newEssential);
            this.App.renderEssentials();
        });

        this.dom.panel.addEventListener("click", (e) => {
            const header = e.target.closest(".editor-accordion-header");
            if (header && !e.target.closest('.form-group-row') && !e.target.closest('.icon-picker-btn')) {
              header.parentElement.classList.toggle("active");
            }
        });

        this.dom.editorEssentialsList.addEventListener('change', e => {
            const card = e.target.closest('.editor-accordion-card');
            if (!card) return;
            const essentialId = card.dataset.essentialId;
            const essential = this.App.data.essentials[essentialId];
            
            if (e.target.classList.contains('editor-toggle')) {
                const activeCount = Object.values(this.App.data.essentials).filter(es => es.active).length;
                const isChecked = e.target.checked;

                if (isChecked && activeCount >= 6) {
                    this.App.showToast('Maximum of 6 essentials allowed.');
                    e.target.checked = false;
                    return;
                }
                if (!isChecked && activeCount <= 4 && card.dataset.type === 'pre-made') {
                    this.App.showToast('Minimum of 4 pre-made essentials required.');
                    e.target.checked = true;
                    return;
                }
                essential.active = isChecked;
                this.App.renderEssentials();
            } else if (e.target.classList.contains('essential-item-img-upload')) {
                if (essential && e.target.files[0]) {
                    essential.data.image = URL.createObjectURL(e.target.files[0]);
                }
            } else if (e.target.dataset.key === 'image' && e.target.id === 'dir-img-upload') {
                if(e.target.files[0]) {
                    this.App.data.directions.image = URL.createObjectURL(e.target.files[0]);
                    this.App.renderDirections();
                }
            }
        });
        
        this.dom.editorEssentialsList.addEventListener('input', e => {
            const card = e.target.closest('.editor-accordion-card');
            if (!card) return;
            const essentialId = card.dataset.essentialId;
            const essential = this.App.data.essentials[essentialId];

            if (card.dataset.type === 'pre-made') {
                const key = e.target.dataset.key;
                if(essentialId === 'directions') {
                    if (key && this.App.data.directions.hasOwnProperty(key)) {
                        this.App.data.directions[key] = e.target.value;
                        this.App.renderDirections();
                    }
                } else if (essential && essential.data && key) {
                  essential.data[key] = e.target.value;
                  this.App.renderEssentials();
                }
            }
        });
        
        this.dom.editorEssentialsList.addEventListener('click', e => {
            const removeBtn = e.target.closest('.editor-remove-btn');
            if (removeBtn) {
                const card = removeBtn.closest('.editor-accordion-card');
                const essentialId = card.dataset.essentialId;
                delete this.App.data.essentials[essentialId];
                card.remove();
                this.App.renderEssentials();
            }
        });
        
        // --- EXTRAS TAB LISTENERS ---
        this.dom.addMenuItemBtn.addEventListener("click", () => {
            const newItem = { id: newId(), categoryId: this.App.data.menuCategories[0]?.id || "", name: "New Item", description: "<p></p>", price: 0, image: "https://via.placeholder.com/80", tags: [], extraInfo: '' };
            this.App.data.menuItems.push(newItem);
            this.addMenuItemCard(newItem);
            this.App.renderMenu();
            this.App.triggerEducationalToast('menuItem');
        });
        this.dom.addCategoryBtn.addEventListener("click", () => {
          if (this.App.data.menuCategories.length < 3) {
            const newCat = { id: newId(), name: "New Category" };
            this.App.data.menuCategories.push(newCat);
            this.addCategoryCard(newCat);
            this.updateCategoryButtonStates();
          }
        });
        this.dom.categoriesList.addEventListener("click", (e) => {
          const removeBtn = e.target.closest(".editor-remove-btn");
          if (removeBtn && !removeBtn.disabled) {
            const card = removeBtn.closest(".editor-category-card");
            this.App.data.menuCategories = this.App.data.menuCategories.filter((c) => c.id !== card.dataset.id);
            card.remove(); this.updateCategoryButtonStates(); this.updateAllCategorySelectors(); this.App.renderMenu();
          }
        });
        this.dom.categoriesList.addEventListener("input", (e) => {
          const input = e.target.closest("input");
          if (input) {
            const cat = this.App.data.menuCategories.find((c) => c.id === input.parentElement.dataset.id);
            cat.name = input.value;
            this.updateAllCategorySelectors(); this.App.renderMenu();
          }
        });
        this.dom.itemsList.addEventListener("click", (e) => {
          const card = e.target.closest(".editor-accordion-card");
          if (!card) return;
          if (e.target.closest(".editor-remove-btn")) {
            this.App.data.menuItems = this.App.data.menuItems.filter((i) => i.id !== card.dataset.id);
            card.remove(); this.App.renderMenu();
          }
          const reorderBtn = e.target.closest(".reorder-btn");
          if (reorderBtn) {
              const direction = reorderBtn.dataset.direction;
              const items = this.App.data.menuItems;
              const index = items.findIndex(item => item.id === card.dataset.id);
              if (direction === 'up' && index > 0) [items[index], items[index - 1]] = [items[index - 1], items[index]];
              else if (direction === 'down' && index < items.length - 1) [items[index], items[index + 1]] = [items[index + 1], items[index]];
              this.populateMenuTab(); this.App.renderMenu();
          }
        });
        this.dom.itemsList.addEventListener("input", (e) => {
          const card = e.target.closest(".editor-accordion-card"); if (!card) return;
          const item = this.App.data.menuItems.find((i) => i.id == card.dataset.id); if (!item) return;
          const propMap = { "menu-item-name": "name", "menu-item-price": "price", "menu-item-category-select": "categoryId", "menu-item-extra": "extraInfo" };
          for (const [cls, prop] of Object.entries(propMap)) if (e.target.classList.contains(cls)) item[prop] = prop === "price" ? Number(e.target.value) : e.target.value;
          if (e.target.classList.contains("menu-item-tags")) item.tags = e.target.value.split(',').map(tag => tag.trim()).filter(Boolean);
          card.querySelector(".editor-accordion-title").textContent = item.name;
          this.App.renderMenu();
        });
        this.dom.itemsList.addEventListener("change", (e) => {
          if (e.target.classList.contains("menu-item-img-upload")) {
            const card = e.target.closest(".editor-accordion-card");
            const item = this.App.data.menuItems.find((i) => i.id == card.dataset.id);
            if (item && e.target.files[0]) item.image = URL.createObjectURL(e.target.files[0]);
            this.App.renderMenu();
          }
        });

        // --- EXPLORE TAB LISTENERS ---
        this.dom.addExploreLocationBtn.addEventListener("click", () => {
          const newLoc = { id: newId(), category: 'Restaurant', name: 'New Location', description: '<p></p>', image: 'https://via.placeholder.com/400x200', gmapsUrl: 'https://maps.google.com', distance: '15 min drive' };
          this.App.data.exploreLocations.push(newLoc);
          this.addExploreLocationCard(newLoc);
          this.App.renderExplorePage();
        });
        this.dom.exploreLocationsList.addEventListener('input', e => {
            const card = e.target.closest('.editor-accordion-card');
            if(!card) return;
            const loc = this.App.data.exploreLocations.find(l => l.id === card.dataset.id);
            if(!loc) return;
            const propMap = { 'location-item-name': 'name', 'location-item-category': 'category', 'location-item-gmaps': 'gmapsUrl', 'location-item-distance': 'distance' };
            for (const [cls, prop] of Object.entries(propMap)) {
                if (e.target.classList.contains(cls)) loc[prop] = e.target.value;
            }
            card.querySelector('.editor-accordion-title').textContent = loc.name;
            this.App.renderExplorePage();
        });
        this.dom.exploreLocationsList.addEventListener('change', e => {
            if (e.target.classList.contains('location-item-img-upload')) {
                const card = e.target.closest('.editor-accordion-card');
                const loc = this.App.data.exploreLocations.find(l => l.id === card.dataset.id);
                if (loc && e.target.files[0]) {
                    loc.image = URL.createObjectURL(e.target.files[0]);
                    this.App.renderExplorePage();
                }
            }
        });
        this.dom.exploreLocationsList.addEventListener('click', e => {
            const card = e.target.closest('.editor-accordion-card');
            if (!card) return;
            if (e.target.closest('.editor-remove-btn')) {
                this.App.data.exploreLocations = this.App.data.exploreLocations.filter(l => l.id !== card.dataset.id);
                card.remove();
                this.App.renderExplorePage();
            }
            const reorderBtn = e.target.closest('.reorder-btn');
            if (reorderBtn) {
                const direction = reorderBtn.dataset.direction;
                const items = this.App.data.exploreLocations;
                const index = items.findIndex(item => item.id === card.dataset.id);
                if (direction === 'up' && index > 0) [items[index], items[index - 1]] = [items[index - 1], items[index]];
                else if (direction === 'down' && index < items.length - 1) [items[index], items[index + 1]] = [items[index + 1], items[index]];
                this.populateExploreTab();
                this.App.renderExplorePage();
            }
        });

        // --- GUIDE TAB LISTENERS ---
        this.dom.addGuideBtn.addEventListener("click", () => {
            const newSection = { id: newId(), title: "New Section", content: "<p></p>" };
            this.App.data.guideSections.push(newSection);
            this.addGuideCard(newSection);
            this.App.renderGuide();
            this.App.triggerEducationalToast('guideSection');
        });
        this.dom.guideList.addEventListener("click", (e) => {
            if (e.target.closest(".editor-remove-btn")) {
              const card = e.target.closest(".editor-accordion-card");
              this.App.data.guideSections = this.App.data.guideSections.filter((s) => s.id !== card.dataset.id);
              card.remove(); this.App.renderGuide();
            }
        });
        this.dom.guideList.addEventListener("input", (e) => {
            const card = e.target.closest(".editor-accordion-card");
            if (!card) return;
            const section = this.App.data.guideSections.find((s) => s.id === card.dataset.id);
            if (!section) return;
            if (e.target.classList.contains("guide-item-title")) {
                section.title = e.target.value;
                card.querySelector(".editor-accordion-title").textContent = section.title;
                this.App.renderGuide();
            }
        });
      },
    },
  };

  App.init();
});