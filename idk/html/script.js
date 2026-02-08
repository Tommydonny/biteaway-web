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

    if (scrollTop === 0) {
        // At the very top -> show top bar normally
        topBar.style.top = "0";
    } else if (scrollTop > lastScrollTop) {
        // Scrolling down -> show top bar
        topBar.style.top = "0";
    } else {
        // Scrolling up -> hide top bar
        topBar.style.top = "-75px"; // same as header height
    }

    lastScrollTop = scrollTop;
});
