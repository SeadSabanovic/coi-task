import Swiper from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";
import barba from "@barba/core";
import { debounce } from "lodash";

class GalleryCarousel extends HTMLElement {
  constructor() {
    super();
    this.swiper = null;
    this.images = [
      "../assets/task3/gallery-1.png",
      "../assets/task3/gallery-2.png",
      "../assets/task3/gallery-3.png",
      "../assets/task3/gallery-4.png",
    ];
    this.isActive = true;
    this.handleResize = debounce(this.handleResize.bind(this), 200);
  }

  connectedCallback() {
    this.innerHTML = this.createGalleryStructure();
    this.initializeSwiper();
    this.addToggleButton();
    window.addEventListener("pageshow", this.handlePageShow.bind(this));
    window.addEventListener("resize", this.handleResize);
  }

  disconnectedCallback() {
    if (this.swiper) {
      this.swiper.destroy(true, true);
    }
    window.removeEventListener("pageshow", this.handlePageShow);
    window.removeEventListener("resize", this.handleResize);
  }

  handlePageShow(event) {
    if (event.persisted) {
      this.initializeSwiper();
    }
  }

  initializeSwiper() {
    if (this.swiper) {
      this.swiper.destroy(true, true);
    }

    const isMobile = window.innerWidth < 768;

    this.swiper = new Swiper(this.querySelector(".gallery__slider"), {
      modules: [Navigation],
      slidesPerView: 1,
      spaceBetween: 8,
      rewind: !isMobile,
      grabCursor: true,
      navigation: {
        nextEl: ".gallery__button--next",
        prevEl: ".gallery__button--prev",
        disabledClass: "gallery__button--disabled",
      },
    });

    this.swiper.on("slideChange", () => {
      console.log("Active slide index:", this.swiper.activeIndex);
    });
  }

  createGalleryStructure() {
    return `
      <div class="gallery__container">
        <div class="gallery__inner">
          <div class="gallery__main">
            <div class="gallery__slider">
              <div class="gallery__button gallery__button--prev">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_1245_33)">
                    <path d="M13.3334 7.33333H5.22002L8.94669 3.60667L8.00002 2.66667L2.66669 8L8.00002 13.3333L8.94002 12.3933L5.22002 8.66667H13.3334V7.33333Z" fill="white"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_1245_33">
                      <rect width="16" height="16" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div class="gallery__button gallery__button--next">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_1245_37)">
                    <path d="M8.00002 2.66667L7.06002 3.60667L10.78 7.33333H2.66669V8.66667H10.78L7.06002 12.3933L8.00002 13.3333L13.3334 8L8.00002 2.66667Z" fill="white"/>
                  </g>
                  <defs>
                    <clipPath id="clip0_1245_37">
                      <rect width="16" height="16" fill="white"/>
                    </clipPath>
                  </defs>
                </svg>
              </div>
              <div class="swiper-wrapper">
                ${this.images
                  .map(
                    (src) => `
                  <div class="swiper-slide gallery__item">
                    <img src="${src}" alt="" class="gallery__image"/>
                  </div>
                `
                  )
                  .join("")}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  addToggleButton() {
    const button = document.createElement("button");
    button.className = "gallery__toggle";
    button.textContent = "Disable Swiper";
    button.addEventListener("click", () => this.toggleSwiper());
    this.appendChild(button);
  }

  toggleSwiper() {
    if (this.isActive) {
      if (this.swiper) {
        this.swiper.destroy(true, true);
        this.swiper = null;
      }
      this.querySelector(".gallery__toggle").textContent = "Enable Swiper";
    } else {
      this.initializeSwiper();
      this.querySelector(".gallery__toggle").textContent = "Disable Swiper";
    }
    this.isActive = !this.isActive;
  }

  handleResize() {
    if (this.isActive) {
      this.initializeSwiper();
    }
  }
}

// Register the custom element
customElements.define("gallery-carousel", GalleryCarousel);

// Barba.js hook to initialize Swiper on page transitions
barba.hooks.afterEnter((data) => {
  if (data.next.namespace === "task3") {
    const gallery = document.querySelector(".gallery");
    if (gallery && !(gallery instanceof GalleryCarousel)) {
      const galleryCarousel = document.createElement("gallery-carousel");
      galleryCarousel.className = gallery.className;
      gallery.replaceWith(galleryCarousel);
    }
  }
});
