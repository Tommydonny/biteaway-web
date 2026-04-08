// ---- Clean unified script for search + suggestions + cart + UI ----

// --- HAMBURGER MENU ---

// --- SLIDESHOW (unchanged) ---
let slideIndex = 0;
function plusSlides(n) { showSlides(slideIndex += n); }
function showSlides(n) {
  const slides = document.getElementsByClassName("slide");
  if (slides.length === 0) return;
  if (n >= slides.length) slideIndex = 0;
  if (n < 0) slideIndex = slides.length - 1;
  for (let i = 0; i < slides.length; i++) slides[i].style.display = "none";
  if (slides[slideIndex]) slides[slideIndex].style.display = "block";
}
showSlides(slideIndex);
if (document.getElementsByClassName("slide").length > 0) {
  setInterval(() => plusSlides(1), 5000);
}

// --- HEADER SCROLL ---
const topBar = document.querySelector('.top-bar');
let lastScrollTop = 0;
if (topBar) {
  window.addEventListener('scroll', function () {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    topBar.style.top = (scrollTop > lastScrollTop) ? "-75px" : "0";
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
  });
}

// --- KOŠÍK (cart) ---
let cart = [];
const cartDropdown = document.getElementById('cart-dropdown');
const cartItemsEl = document.getElementById('cart-items');
const cartTotalEl = document.getElementById('cart-total');
const checkoutBtn = document.getElementById('checkout-btn');
const cartIcon = document.querySelector('img[alt="Košík"]');

if (cartIcon && cartDropdown) {
  cartIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    cartDropdown.classList.toggle('hidden');
  });
}

function parsePrice(text) {
  if (!text) return 0;
  let cleaned = String(text).replace(/[^\d.,-]/g, '');
  cleaned = cleaned.replace(',', '.');
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

function buyProduct(productName) {
  if (!productName) return;
  const productElement = Array.from(document.querySelectorAll('.product')).find(p => {
    const nameEl = p.querySelector('.product-name');
    return nameEl && nameEl.textContent.trim() === productName.trim();
  });

  if (!productElement) {
    console.warn(`Produkt nenalezen v DOM: "${productName}". Přidávám s cenou 0.`);
    cart.push({ name: productName, price: 0 });
    updateCart();
    if (cartDropdown) cartDropdown.classList.remove('hidden');
    return;
  }

  const priceTextEl = productElement.querySelector('.price .discount') || productElement.querySelector('.price');
  const priceText = priceTextEl ? priceTextEl.textContent : '';
  const price = parsePrice(priceText);
  cart.push({ name: productName, price: price });
  updateCart();
  if (cartDropdown) cartDropdown.classList.remove('hidden');
}

function updateCart() {
  if (!cartItemsEl || !cartTotalEl) return;
  cartItemsEl.innerHTML = '';
  let total = 0;
  cart.forEach((item, index) => {
    total += item.price;
    const li = document.createElement('li');
    const safeName = item.name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    li.innerHTML = `<span>${safeName} - ${item.price} Kč</span>
                    <button class="cart-remove-btn" data-index="${index}">❌</button>`;
    cartItemsEl.appendChild(li);
  });
  cartTotalEl.textContent = `Celkem: ${total} Kč`;
  // save to localStorage
  try { localStorage.setItem('cart', JSON.stringify(cart)); } catch (err) { /* ignore */ }

  Array.from(document.getElementsByClassName('cart-remove-btn')).forEach(btn => {
    btn.removeEventListener('click', cartRemoveHandler);
    btn.addEventListener('click', cartRemoveHandler);
  });
}
function cartRemoveHandler(e) {
  const idx = parseInt(e.currentTarget.getAttribute('data-index'));
  if (!isNaN(idx)) removeFromCart(idx);
}

const savedCart = localStorage.getItem('cart');
if (savedCart) {
  try { cart = JSON.parse(savedCart); } catch (err) { cart = []; }
  updateCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

if (checkoutBtn) {
  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) { alert('Košík je prázdný!'); return; }
    const total = cart.reduce((s, it) => s + it.price, 0);
    alert(`Objednáno ${cart.length} produktů za celkem ${total} Kč`);
    cart = [];
    updateCart();
    if (cartDropdown) cartDropdown.classList.add('hidden');
  });
}
// --- PRODUCTS list used by suggestions (your list) ---
const products = [
  {
    name: "Oreo Dessert Treats Neapolitan Limited Edition 131g IDN",
    href: "html/Neapolitan_Oreo.html",
    subtitle: "Oreo • 131g",
    keywords: ["oreo","neapolitan","dessert","limited","edition"]
  },
    {
    name: "Meiji Hello Panda Cookies and Cream 10g IDN",
    href: "html/meiji_hello_panda_cookie.html",
    subtitle: "Meiji • 10g",
    keywords: ["meiji","hello","panda","cookie"]
  },
     {
    name: "BT21 Honey Mini Yakgwa 110g KOR",
    href: "html/honey_butter_BT21.html",
    subtitle: "Yakgwa • 110g",
    keywords: ["BT21","honey","mini","yakgwa"]
  },
{
  name: "Gumisan One Piece Strawberry Laces Candies Luffy 75g EU",
  href: "html/one_piece_strawberry.html",
  subtitle: "Gumisan • 75g",
  keywords: ["gumisan","one","piece","strawberry","laces"]
},
{
  name: "Twizzlers Jahodové Pendreky 70g USA",
  href: "html/twizzlers.html",
  subtitle: "Twizzlers • 70g",
  keywords: ["twizzlers","jahodové","pendreky"]
},
{
  name: "Fini Žvýkačky Nuclear Gum Balení (50x14g) 700g ESP",
  href: "html/Nuclear_gum.html",
  subtitle: "Fini • 70g",
  keywords: ["fini","nuclear","žvýkačky"]
},
{
  name: "Binqi & Disney Lotso Mixed Fruits Lollipop 12g CHN",
  href: "html/binqi_lizatka.html",
  subtitle: "Bingqi • 12g",
  keywords: ["bingqi","disney","lollipop"]
},
{
  name: "Brain Blasterz Super Sour Cool Candy Level 4 Sour 48g CHN",
  href: "html/Brain_Blasterz.html",
  subtitle: "Blasterz • 48g",
  keywords: ["brain","blasterz","candy", "sour", "cool"]
},
{
  name: "BT21 Wasabi Almond 30g KOR",
  href: "html/Wasabi_Almod_BT21.html",
  subtitle: "BT21 • 30g",
  keywords: ["BT21","wasabi","almond", "kor"]
},
{
  name: "BT21 Honey Butter Almond 30g KOR",
  href: "html/honey_butter_BT21.html",
  subtitle: "BT21 • 30g",
  keywords: ["BT21","honey","butter","almond","kor"]
},
{
  name: "Candy Pop Popcorn Chips Ahoy 28g USA",
  href: "html/Chips_ahoy_popcorn.html",
  subtitle: "POP • 28g",
  keywords: ["candy","pop","popcorn","chips","ahoy","USA"]
},
{
  name: "Candy Pop Peanut Butter and Strawberry Popcorn 149g USA",
  href: "html/Smucker_popcorn.html",
  subtitle: "POP • 149g",
  keywords: ["candy","pop","popcorn","peanut","butter","strawberry","USA"]
},
{
  name: "Tao Kae Noi Crispy Sour Cream & Onion Seaweed 32g THA",
  href: "html/tao_kae_noi.html",
  subtitle: "Tao Kae Noi • 32g",
  keywords: ["tao","kae","noi","crispy","sour","cream","seaweed","onion","tha"]
},
{
  name: "Fanta Sarsi 320ml VNM",
  href: "html/fanta_sarsi.html",
  subtitle: "Fanta • 320ml",
  keywords: ["fanta","sarsi","VNM"]
},
{
  name: "Arizona Cucumber With Citrus 650ml USA",
  href: "html/arizona_citrus.html",
  subtitle: "Arizona • 650ml",
  keywords: ["arizona","cucumber","citrus", "USA"]
},
{
  name: "OKF Lemon Ginger Juice With Aloe 500ml KOR",
  href: "html/OKF_aloe_lemonginger.html",
  subtitle: "OFK • 500ml",
  keywords: ["ofk","lemon","ginger","juice","aloe", "KOR"]
},
{
  name: "OKF Farmers Aloe Original Drink 1,5l KOR",
  href: "html/aloe_vera.html",
  subtitle: "OFK • 1,5l",
  keywords: ["ofk","farmers","aloe","original", "KOR"]
},
{
  name: "Hy Iced BTS Sweet Black Hazelnut Drink 230ml KOR",
  href: "html/HY_BTS_coffee.html",
  subtitle: "Hy • 230ml",
  keywords: ["hy","iced","bts","sweet", "KOR", "black", "hazelnut","drink","coffee"]
},
{
  name: "OKF Morning Rice Drink 1,5l KOR",
  href: "html/OKF_milk.html",
  subtitle: "OKF • 1,5l",
  keywords: ["okf","morning","rice","drink", "KOR"]
},
{
  name: "Line Friends Yogurt Sparkling Drink 380ml KOR",
  href: "html/Line_friends.html",
  subtitle: "Line • 380ml",
  keywords: ["line","friends","yogurt","sparkling", "KOR", "drink"]
},
{
  name: "Boba Cat Milk Taro Tapioca Bubble Tea 315ml TWN",
  href: "html/boba_cat.html",
  subtitle: "Boba Cat • 315ml",
  keywords: ["boba","cat","milk","taro", "twn", "tapioca", "bubble", "tea"]
},
{
  name: "Bobbasan Dragon Ball Super Pear & Melon Bubble Tea Goku 320ml EU",
  href: "html/goku_dragon_bubble_tea.html",
  subtitle: "Bobbasan • 320ml",
  keywords: ["bobbasan","dragon","ball","super", "pear", "melon", "bubble", "tea", "goku", "eu"]
},
{
  name: "Gangfu Matcha Popping Candy Macarons 50g CHN",
  href: "html/gangfu_matcha.html",
  subtitle: "GangFu • 50g",
  keywords: ["gangfu","matcha","popping","candy", "CHN", "macarons"]
},
{
  name: "Oreo Crisp Roll Matcha 50g CHN",
  href: "html/oreo_crisp_matcha.html",
  subtitle: "Oreo • 50g",
  keywords: ["oreo","crisp","roll","matcha", "CHN"]
},
{
  name: "M&M's Mléčný Nápoj Čokoládový 350ml EU",
  href: "html/M&M_milk.html",
  subtitle: "M&M • 350ml",
  keywords: ["m&m","mléčný","nápoj","čokoládový", "EU"]
},
{
  name: "Tan Hiep Phat Green Tea Zero 455ml VNM",
  href: "html/zero_degree_tea.html",
  subtitle: "Tan Hiep Phat • 455ml",
  keywords: ["tan","hiep","phat","green", "tea", "zero", "VNM"]
},
{
  name: "Hy Fresh Coffee BTS Tiramisu Latte Drink 250ml IDN",
  href: "html/BTS_fresh.html",
  subtitle: "Hy • 250ml",
  keywords: ["hy","fresh","bts","coffee", "IDN", "tiramisu", "latte","drink"]
},
{
  name: "Arizona Blueberry White Tea 650ml USA",
  href: "html/arizona_blueberry.html",
  subtitle: "Arizona • 650ml",
  keywords: ["arizona","blueberry","white","tea", "USA"]
},
{
  name: "Sting Gold Rush Energy Drink 320ml VNM",
  href: "html/sting_gold.html",
  subtitle: "Sting • 320ml",
  keywords: ["sting","gold","rush", "energy", "drink", "VNM"]
},
{
  name: "Coca Cola Vanilla 355ml USA",
  href: "html/coca_cola_vanilla.html",
  subtitle: "Coca Cola • 355ml",
  keywords: ["coca","cola","vanilla","USA"]
},
{
  name: "Lay's Salt & Black Pepper Taro Chips 60g CHN",
  href: "html/lays_black_pepper.html",
  subtitle: "Lays • 60g",
  keywords: ["lays","salt","black","pepper","taro","chips","chn"]
},
{
  name: "Sweet Monster Mocha Chips 60g KOR",
  href: "html/KOR_sweet_monster.html",
  subtitle: "Sweet monster • 60g",
  keywords: ["sweet","monster","mocha","chips","kor"]
},
{
  name: "Tao Kae Noi Hi Tempura Hot Spicy Seaweed 40g THA",
  href: "html/tao_kae_noi_spicy.html",
  subtitle: "Tao Kae Noi • 40g",
  keywords: ["tao","kae","noi","tempura","hot","spicy","seaweed","tha"]
},
{
  name: "Komesan Naruto Shippuden Rice Chips Cheese Naruto 60g EU",
  href: "html/Komesan_Rice_Chips.html",
  subtitle: "Komesan • 60g",
  keywords: ["komesan","naruto","shippuden", "cheese"]
},
{
  name: "Cheetos Japanese Steak 90g CHN",
  href: "html/Cheetos_Japanese.html",
  subtitle: "Cheetos • 120g",
  keywords: ["cheetos","japanese","steak"]
},
{
  name: "Mr. Twister Jelly Beans Challenge 120g EU",
  href: "html/twister_jelly.html",
  subtitle: "Twister • 120g",
  keywords: ["mr.","twister","beans", "challenge"]
},
  {
    name: "Reese's 2 Big Cup King Size 79g USA",
    href: "html/Reese_Big_Cup.html",
    subtitle: "Reese's • 79g",
    keywords: ["reese","big cup","king size"]
  },
  {
    name: "Glico Pocky Matcha Green Tea 33g IDN",
    href: "html/Glico_Matcha_Green.html",
    subtitle: "Pocky • 33g",
    keywords: ["glico","pocky","matcha","green","tyčinky","tycinky"]
  },
  {
    name: "Oreo Crisp Roll Vanilla 50g CHN",
    href: "html/Oreo_Crisp_Roll.html",
    subtitle: "Oreo • 50g",
    keywords: ["oreo","crisp","roll","vanilla"]
  },
  {
    name: "Lotte Jellycious Fruit Sour Gummy 51g KOR",
    href: "html/Lotte_Fruit_Sour_Gummy.html",
    subtitle: "Lotte • 51g",
    keywords: ["lotte","jellycious","fruit","sour","gummy"]
  },
  {
    name: "Oreo Wafer Bar White Chocolate 5ks (5x11,6g) CHN",
    href: "html/Oreo_Wafer_White.html",
    subtitle: "Oreo • 5ks",
    keywords: ["oreo","wafer","white","chocolate"]
  }
];

// --- SEARCH & SUGGESTIONS (clean and safe) ---
const searchIcon = document.getElementById('search-icon');
const searchBox = document.getElementById('search-box');           // this ID exists in your HTML
const input = document.getElementById('search-input');
const suggestions = document.getElementById('search-suggestions');
const searchContainer = document.querySelector('.search-container');
let currentIndex = -1;

function normalize(s){ return (s||'').trim().toLowerCase(); }

if (searchIcon && searchBox && input) {
  searchIcon.addEventListener('click', (e) => {
    e.stopPropagation();                   // prevent document click from hiding immediately
    searchBox.classList.toggle('active');  // show/hide the input box
    if (searchBox.classList.contains('active')) input.focus();
    else hideSuggestions();
  });

  // input events
  input.addEventListener('input', (e) => buildSuggestions(e.target.value));
  input.addEventListener('keydown', (e) => {
    const items = suggestions ? Array.from(suggestions.querySelectorAll('li')) : [];
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (items.length === 0) return;
      currentIndex = Math.min(currentIndex + 1, items.length - 1);
      updateSelection(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (items.length === 0) return;
      currentIndex = Math.max(currentIndex - 1, 0);
      updateSelection(items);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (items.length === 0) return;
      const target = items[currentIndex >= 0 ? currentIndex : 0];
    if (target) goToProduct(target.dataset.href);
    } else if (e.key === 'Escape') {
      hideSuggestions();
    }
  });

  // click on suggestion
  if (suggestions) {
    suggestions.addEventListener('click', (e) => {
      const li = e.target.closest('li');
      if (!li) return;
      goToProduct(li.dataset.href);
    });
  }

  // click outside: hide search box & suggestions
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
      searchBox.classList.remove('active');
      hideSuggestions();
    }
  });
}

function buildSuggestions(query) {
  if (!suggestions) return;
  const q = normalize(query);
  if (!q) { hideSuggestions(); return; }

  const results = products.filter(p => {
    if (normalize(p.name).includes(q)) return true;
    return (p.keywords || []).some(k => normalize(k).includes(q));
  }).slice(0, 8);

  if (results.length === 0) { hideSuggestions(); return; }

  suggestions.innerHTML = results.map((p, i) =>
    `<li role="option" id="sugg-${i}" data-href="${p.href}" tabindex="-1" aria-selected="false">
      <strong>${escapeHtml(p.name)}</strong>
      <span class="suggestion-sub">${escapeHtml(p.subtitle || '')}</span>
    </li>`).join('');

  suggestions.classList.remove('hidden');
  currentIndex = -1;
}

function updateSelection(items) {
  items.forEach((it, idx) => {
    const sel = idx === currentIndex;
    it.setAttribute('aria-selected', sel ? 'true' : 'false');
    if (sel) it.scrollIntoView({ block: 'nearest' });
  });
}

function hideSuggestions() {
  if (!suggestions) return;
  suggestions.classList.add('hidden');
  suggestions.innerHTML = '';
  currentIndex = -1;
}

function escapeHtml(text) {
  return String(text).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[m]);
  
}
function toggleMainMenu() {
  const menu = document.getElementById('hamburger-menu');
  if (!menu) return;
  menu.classList.toggle('hidden');
}

function toggleSubMenu(id) {
  const submenu = document.getElementById(id);
  if (!submenu) return;
  submenu.classList.toggle('hidden');
}

// Řazení produktů (volá se z index.html tlačítek)
function sortProducts(type) {
  const grid = document.querySelector('.products-grid');
  if (!grid) return;
  const items = Array.from(grid.querySelectorAll('.product'));

  items.sort((a, b) => {
    const priceA = parseFloat(a.dataset.price || 0);
    const priceB = parseFloat(b.dataset.price || 0);
    const popA = parseFloat(a.dataset.popular || 0);
    const popB = parseFloat(b.dataset.popular || 0);

    if (type === 'cheap') return priceA - priceB;
    if (type === 'expensive') return priceB - priceA;
    if (type === 'popular') return popB - popA;
    // recommended: leave as-is (neřadíme) nebo můžete implementovat vlastní logiku
    return 0;
  });

  items.forEach(it => grid.appendChild(it)); // reorder DOM
}

// Bezpečné přesměrování na produkt (řeší root vs /html/)
function goToProduct(path) {
  // path = hodnota z products[].href (může být "html/NAME.html" nebo "NAME.html")
  let target = String(path || '');
  const inHtmlFolder = window.location.pathname.includes('/html/');

  if (inHtmlFolder && target.startsWith('html/')) {
    target = target.replace(/^html\//, ''); // z /html/ chceme jen NAME.html
  } else if (!inHtmlFolder && !target.startsWith('html/')) {
    target = 'html/' + target; // z rootu chceme html/NAME.html
  }
  window.location.href = target;
}
