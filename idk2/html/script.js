// --- HAMBURGER MENU ---
function toggleMainMenu() {
    const menu = document.getElementById("hamburger-menu");
    if (!menu) return;
    menu.classList.toggle("hidden");
}

// --- SIDEBAR DROPDOWN ---
function toggleSubMenu(id) {
    const submenu = document.getElementById(id);
    if (!submenu) return;
    submenu.classList.toggle("hidden");
}

// --- SLIDESHOW ---
let slideIndex = 0;
function plusSlides(n) {
    showSlides(slideIndex += n);
}

function showSlides(n) {
    const slides = document.getElementsByClassName("slide");
    if (slides.length === 0) return;
    if (n >= slides.length) slideIndex = 0;
    if (n < 0) slideIndex = slides.length - 1;

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    if (slides[slideIndex]) slides[slideIndex].style.display = "block";
}

// start slideshow (pokud jsou slidy)
showSlides(slideIndex);
if (document.getElementsByClassName("slide").length > 0) {
    setInterval(() => plusSlides(1), 5000);
}

// --- HEADER SCROLL (schová header při scroll dolů, ukáže při scroll nahoru) ---
const topBar = document.querySelector('.top-bar');
let lastScrollTop = 0;

if (topBar) {
    // Ujisti se, že v CSS máš: .top-bar { transition: top 0.3s ease-in-out; }
    window.addEventListener('scroll', function () {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        if (scrollTop > lastScrollTop) {
            // scroll dolů -> schovej header
            topBar.style.top = "-75px";
        } else {
            // scroll nahoru -> zobraz header
            topBar.style.top = "0";
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
}

// --- KOŠÍK ---
// jednoduchý in-memory košík (bez backendu)
let cart = [];

// elementy košíku (mohou chybět, proto kontrolujeme)
const cartDropdown = document.getElementById('cart-dropdown');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');

// Pokud máš v HTML ikonu košíku <img alt="Košík">, přidej listener.
// Pokud ikona v HTML není, nic se neháže — košík se stále aktualizuje a funguje (lze ho zobrazit jiným způsobem).
const cartIcon = document.querySelector('img[alt="Košík"]');
if (cartIcon && cartDropdown) {
    cartIcon.addEventListener('click', () => {
        cartDropdown.classList.toggle('hidden');
    });
}

// Pomocná funkce na parsování ceny z textu jako "35 Kč" nebo "1 234,50 Kč"
function parsePrice(text) {
    if (!text) return 0;
    // odstranit vše kromě číslic, čárky a tečky a minus (pro bezpečnost)
    let cleaned = String(text).replace(/[^\d.,-]/g, '');
    // nahradit čárku tečkou
    cleaned = cleaned.replace(',', '.');
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
}

// Přidání produktu do košíku (volá se z onclick v HTML)
function buyProduct(productName) {
    if (!productName) return;

    // Najdi element produktu podle názvu (robustní porovnání)
    const productElement = Array.from(document.querySelectorAll('.product')).find(p => {
        const nameEl = p.querySelector('.product-name');
        return nameEl && nameEl.textContent.trim() === productName.trim();
    });

    if (!productElement) {
        // Pokud produkt nenalezen, přidej s cenou 0 (nebo vypiš chybu) — zde přidáme s cenou 0 a upozorníme v konzoli
        console.warn(`Produkt nenalezen v DOM: "${productName}". Přidávám s cenou 0.`);
        cart.push({ name: productName, price: 0 });
        updateCart();
        // Pokud chceš, můžeš místo toho alertnout uživateli:
        // alert(`Produkt "${productName}" nebyl nalezen na stránce.`);
        return;
    }

    const priceTextEl = productElement.querySelector('.price .discount') || productElement.querySelector('.price');
    const priceText = priceTextEl ? priceTextEl.textContent : '';
    const price = parsePrice(priceText);

    cart.push({ name: productName, price: price });
    updateCart();

    // volitelně: zobrazit dropdown po přidání (pokud existuje)
    if (cartDropdown) {
        cartDropdown.classList.remove('hidden');
    }
}

// Aktualizace zobrazení košíku
function updateCart() {
    if (!cartItemsEl || !cartTotalEl) return;

    cartItemsEl.innerHTML = '';

    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        const li = document.createElement('li');

        // Bezpečné escapování názvu (jednoduché)
        const safeName = item.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");

        li.innerHTML = `
            <span>${safeName} - ${item.price} Kč</span>
            <button class="cart-remove-btn" data-index="${index}">❌</button>
        `;
        cartItemsEl.appendChild(li);
    });

    cartTotalEl.textContent = `Celkem: ${total} Kč`;

    // přidej listener na všechny remove tlačítka
    Array.from(document.getElementsByClassName('cart-remove-btn')).forEach(btn => {
        btn.removeEventListener('click', cartRemoveHandler);
        btn.addEventListener('click', cartRemoveHandler);
    });
}

// handler odstranění - oddělená funkce kvůli removeEventListener bezpečnosti
function cartRemoveHandler(e) {
    const idx = parseInt(e.currentTarget.getAttribute('data-index'));
    if (!isNaN(idx)) {
        removeFromCart(idx);
    }
}
function updateCart() {
    const cartItems = document.getElementById('cart-items');
    cartItems.innerHTML = '';

    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;
        const li = document.createElement('li');
        li.innerHTML = `${item.name} - ${item.price} Kč 
                        <button onclick="removeFromCart(${index})">❌</button>`;
        cartItems.appendChild(li);
    });

    document.getElementById('cart-total').textContent = `Celkem: ${total} Kč`;

    // uložit do localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
}
// načíst košík z localStorage, pokud existuje
const savedCart = localStorage.getItem('cart');
if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCart();
}

// Odebrání produktu z košíku
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

// Checkout tlačítko
if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Košík je prázdný!');
            return;
        }
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        alert(`Objednáno ${cart.length} produktů za celkem ${total} Kč`);
        cart = [];
        updateCart();
        // zavřít dropdown po objednávce (pokud existuje)
        if (cartDropdown) cartDropdown.classList.add('hidden');
    });
}

