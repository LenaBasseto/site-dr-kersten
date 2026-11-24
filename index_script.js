class MobileNavbar {
  constructor(mobileMenu, navList, navLinks) {
    this.mobileMenu = document.querySelector(mobileMenu);
    this.navList = document.querySelector(navList);
    this.navLinks = document.querySelectorAll(navLinks);
    this.activeClass = "active";

    this.handleClick = this.handleClick.bind(this);
  }

  animateLinks() {
    this.navLinks.forEach((link, index) => {
      if (link.style.animation) {
        link.style.animation = "";
      } else {
        link.style.animation = `navLinkFade 0.4s ease forwards ${index / 7 + 0.2}s`;
      }
    });
  }

  handleClick() {
    const isActive = this.navList.classList.toggle(this.activeClass);
    this.mobileMenu.classList.toggle(this.activeClass);
    
    this.mobileMenu.setAttribute("aria-expanded", isActive);
    
    this.animateLinks();
  }

  addClickEvent() {
    this.mobileMenu.addEventListener("click", this.handleClick);
  }

  init() {
    if (this.mobileMenu) {
      this.addClickEvent();
    }
    return this;
  }
}

const mobileNavbar = new MobileNavbar(
  ".mobile-menu",
  ".nav-list",
  ".nav-list li"
);
mobileNavbar.init();

// CARROSSEL
document.addEventListener('DOMContentLoaded', () => {
  const track = document.querySelector('.carousel-track');
  
  if (!track) return;

  const slides = Array.from(track.children);
  const nextButton = document.querySelector('.next-btn');
  const prevButton = document.querySelector('.prev-btn');
  const currentSlideText = document.getElementById('current-slide');
  const totalSlidesText = document.getElementById('total-slides');

  let currentIndex = 0;

  if (totalSlidesText) {
    totalSlidesText.textContent = String(slides.length).padStart(2, '0');
  }

  const updateCarousel = (index) => {
    const slideWidth = slides[0].getBoundingClientRect().width;
    track.style.transform = `translateX(-${slideWidth * index}px)`;
    
    if (currentSlideText) {
      currentSlideText.textContent = String(index + 1).padStart(2, '0');
    }
  };

  if (nextButton && prevButton) {
    nextButton.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % slides.length;
      updateCarousel(currentIndex);
    });

    prevButton.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      updateCarousel(currentIndex);
    });

    window.addEventListener('resize', () => updateCarousel(currentIndex));
  }
});
// BOTAO VOLTAR AO TOPO
const backToTopButton = document.getElementById('back-to-top');

if (backToTopButton) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backToTopButton.classList.add('show');
    } else {
      backToTopButton.classList.remove('show');
    }
  });

  backToTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}