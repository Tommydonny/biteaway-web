// --- HAMBURGER MENU ---
function toggleMainMenu() {
    const menu = document.getElementById("hamburger-menu");
    menu.classList.toggle("hidden");
}

// --- SIDEBAR DROPDOWN ---
function toggleSubMenu(id) {
    const submenu = document.getElementById(id);
    submenu.classList.toggle("hidden");
}

// --- SLIDESHOW ---
let slideIndex = 0;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function showSlides(n) {
    let slides = document.getElementsByClassName("slide");
    if (n >= slides.length) { slideIndex = 0; }
    if (n < 0) { slideIndex = slides.length - 1; }

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    slides[slideIndex].style.display = "block";
}

// Automatické přepínání každých 5 sekund
setInterval(function() { plusSlides(1); }, 5000);

const topBar = document.querySelector('.top-bar');
let lastScrollTop = 0;

window.addEventListener('scroll', function () {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
        // Scrolling down -> hide top bar
        topBar.style.top = "-75px"; // schovat
    } else {
        // Scrolling up -> show top bar
        topBar.style.top = "0";
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // zabrání negativním hodnotám
});
function buyProduct(productName) {
    alert(`Produkt "${productName}" byl přidán do košíku!`);
    // později sem můžeš přidat logiku pro košík
}
function sortProducts(type) {
    const grid = document.querySelector('.products-grid');
    const products = Array.from(grid.children);

    let sorted;

    if (type === 'cheap') {
        sorted = products.sort((a, b) =>
            a.dataset.price - b.dataset.price
        );
    }

    if (type === 'expensive') {
        sorted = products.sort((a, b) =>
            b.dataset.price - a.dataset.price
        );
    }

    if (type === 'popular') {
        sorted = products.sort((a, b) =>
            b.dataset.popular - a.dataset.popular
        );
    }

    if (type === 'recommended') {
        sorted = products; // původní pořadí
    }

    grid.innerHTML = '';
    sorted.forEach(p => grid.appendChild(p));
}

