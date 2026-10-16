// ==================== STORE DATA CORE ====================
const storeProductsDatabase = [
    { id: "W-LX-01", title: "Onyx Cosmograph", category: "Luxury", price: 1250, description: "Premium automatic movement calibrated with ceramic bezel accents." },
    { id: "W-LX-02", title: "Royal Chrono Gold", category: "Luxury", price: 2400, description: "18k gold plated executive frame boasting precise state calibrations." },
    { id: "W-MN-03", title: "Nordic Minimalist Slate", category: "Minimalist", price: 450, description: "Ultra-thin matte profile featuring surgical grade stainless steel backings." },
    { id: "W-MN-04", title: "Classic Ivory Dress", category: "Minimalist", price: 380, description: "Genuine calfskin leather strap running highly responsive timing intervals." },
    { id: "W-SP-05", title: "Apex Smart Tracker v4", category: "Sports", price: 650, description: "Biometric analysis mesh housing featuring localized data monitoring." },
    { id: "W-SP-06", title: "Deep Dive Professional", category: "Sports", price: 890, description: "Waterproof up to 200m depth nodes with persistent tactical dials." },
    { id: "W-SP-07", title: "Movie Style Professional", category: "Luxury", price: 890, description: "Waterproof up to 200m depth nodes with persistent tactical dials." },
    { id: "W-SP-08", title: "Aura Dive Professional", category: "Sports", price: 890, description: "Waterproof up to 200m depth nodes with persistent tactical dials." },
    { id: "W-SP-09", title: "Vlog Brand Professional", category: "Luxury", price: 890, description: "Waterproof up to 200m depth nodes with persistent tactical dials." },
    { id: "W-SP-10", title: "SGO Bike Professional", category: "Sports", price: 890, description: "Waterproof up to 200m depth nodes with persistent tactical dials." }



];

// Application Core Active Storage State memory structures
const applicationStateStore = {
    products: [...storeProductsDatabase],
    filters: { querySearch: "", selectedCategory: "all" },
    cartRecordsList: []
};

// ==================== WORKSPACE RENDER VISUAL ARCHITECTURE ====================
function renderResponsiveStorefrontView() {
    const streamTargetNode = document.getElementById("watch-cards-grid");
    if (!streamTargetNode) return;

    const computedFilteredDatasets = applicationStateStore.products.filter(nodeItem => {
        const checkQueryMatch = nodeItem.title.toLowerCase().includes(applicationStateStore.filters.querySearch.toLowerCase());
        const checkCategoryMatch = applicationStateStore.filters.selectedCategory === "all" || nodeItem.category === applicationStateStore.filters.selectedCategory;
        return checkQueryMatch && checkCategoryMatch;
    });

    if (computedFilteredDatasets.length === 0) {
        streamTargetNode.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:var(--text-grey-muted); padding:2rem 0;">No watch models found matching selection filters.</p>`;
        return;
    }

    streamTargetNode.innerHTML = computedFilteredDatasets.map(modelItem => `
        <article class="touch-card-node">
            <div>
                <h3>${modelItem.title}</h3>
                <p>${modelItem.description}</p>
            </div>
            <div class="card-action-row">
                <span class="currency-tag">$${modelItem.price.toLocaleString()}</span>
                <button class="touch-purchase-btn" onclick="addWatchModelToCart('${modelItem.id}')">Add +</button>
            </div>
        </article>
    `).join("");
}

function handleStorefrontStateChange() {
    applicationStateStore.filters.querySearch = document.getElementById("watch-search-input").value;
    applicationStateStore.filters.selectedCategory = document.getElementById("watch-category-select").value;
    renderResponsiveStorefrontView();
}

// ==================== CART ACTIONS STATE WORKFLOW CONTROLS ====================
function addWatchModelToCart(targetProductKeyId) {
    const existingCartRecord = applicationStateStore.cartRecordsList.find(node => node.id === targetProductKeyId);

    if (existingCartRecord) {
        existingCartRecord.qtyCount += 1;
    } else {
        const rootDatabaseObject = storeProductsDatabase.find(p => p.id === targetProductKeyId);
        applicationStateStore.cartRecordsList.push({
            ...rootDatabaseObject,
            qtyCount: 1
        });
    }

    commitCartStateAndTriggerRender();
}

function removeWatchModelFromCart(targetProductKeyId) {
    applicationStateStore.cartRecordsList = applicationStateStore.cartRecordsList.filter(node => node.id !== targetProductKeyId);
    commitCartStateAndTriggerRender();
}

function commitCartStateAndTriggerRender() {
    // Save state context array objects inside browser storage space cache streams
    localStorage.setItem("saas-mobile-cart-cache", JSON.stringify(applicationStateStore.cartRecordsList));
    rehydrateMobileDrawerComponents();
}

function rehydrateMobileDrawerComponents() {
    const navbarBadgeNode = document.getElementById("mobile-cart-badge");
    const drawerBillTotalNode = document.getElementById("sheet-bill-total");
    const drawerScrollFrameNode = document.getElementById("sheet-items-scroll");

    const totalCalculatedItemsCount = applicationStateStore.cartRecordsList.reduce((sum, item) => sum + item.qtyCount, 0);
    const totalCalculatedBillValue = applicationStateStore.cartRecordsList.reduce((sum, item) => sum + (item.price * item.qtyCount), 0);

    if (navbarBadgeNode) navbarBadgeNode.textContent = totalCalculatedItemsCount;
    if (drawerBillTotalNode) drawerBillTotalNode.textContent = `$${totalCalculatedBillValue.toLocaleString()}.00`;

    if (!drawerScrollFrameNode) return;

    if (applicationStateStore.cartRecordsList.length === 0) {
        drawerScrollFrameNode.innerHTML = `<p style="text-align:center; color:var(--text-grey-muted); margin-top:3rem; font-size:0.95rem;">Shopping cart is completely empty.</p>`;
        return;
    }

    drawerScrollFrameNode.innerHTML = applicationStateStore.cartRecordsList.map(recordNode => `
        <div class="sheet-item-node">
            <div class="item-meta">
                <h4>${recordNode.title}</h4>
                <p>$${recordNode.price.toLocaleString()} × ${recordNode.qtyCount}</p>
            </div>
            <button class="item-delete-btn" onclick="removeWatchModelFromCart('${recordNode.id}')">Remove</button>
        </div>
    `).join("");
}

// Mobile Slide-up overlay view animation triggers controllers
function toggleMobileCartDrawer() {
    const sheetOverlayComponent = document.getElementById("cart-bottom-sheet-overlay");
    if (sheetOverlayComponent) sheetOverlayComponent.classList.toggle("sheet-active");
}

function closeCartOnOverlayClick(event) {
    if (event.target.id === "cart-bottom-sheet-overlay") {
        toggleMobileCartDrawer();
    }
}

function processSecureCheckout() {
    if (applicationStateStore.cartRecordsList.length === 0) {
        alert("Cart is empty. Add premium items first.");
        return;
    }
    alert("Order registered successfully! Synchronizing system pipelines.");
    applicationStateStore.cartRecordsList = [];
    commitCartStateAndTriggerRender();
    toggleMobileCartDrawer();
}

// ==================== ROOT STARTUP INITIALIZATION HOOK CONFIGS ====================
document.addEventListener("DOMContentLoaded", () => {
    const extractedCacheString = localStorage.getItem("saas-mobile-cart-cache");
    if (extractedCacheString) {
        try {
            applicationStateStore.cartRecordsList = JSON.parse(extractedCacheString);
        } catch (exceptionFault) {
            console.error("Failed to rehydrate local memory states fields: ", exceptionFault);
        }
    }
    
    renderResponsiveStorefrontView();
    rehydrateMobileDrawerComponents();
});
