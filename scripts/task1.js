import gsap from "gsap";

function initTask1() {
  const section = document.querySelector(".task1-section");
  const image = section.querySelector(".task1-section__image");
  const title = section.querySelector(".task1-section__title");
  const text = section.querySelector(".task1-section__text");
  const button = section.querySelector(".task1-section__btn");
  const content = section.querySelector(".task1-section__content");

  // Array of content to cycle through
  const contents = [
    {
      title: "Handcrafted and Responsibly Sourced",
      text: "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue.",
    },
    {
      title: "Sustainably Made with Care",
      text: "We take pride in our commitment to sustainable practices and ethical sourcing. Each piece is carefully crafted with attention to detail and respect for our environment.",
    },
    {
      title: "Quality That Speaks for Itself",
      text: "Our dedication to excellence shows in every product we create. Using only the finest materials and time-honored techniques to ensure lasting quality.",
    },
  ];

  let currentIndex = 0;

  // Function to calculate padding based on viewport
  function getContentPadding() {
    const viewportWidth = window.innerWidth;
    if (viewportWidth >= 1024) {
      // desktop
      return 6.5 * 2 * 16; 
      // 6.5rem * 2 (top/bottom) * 16px
    } else if (viewportWidth >= 768) {
      // tablet
      return 3.906 * 2 * 16;
      // 3.906rem * 2 (top/bottom) * 16px
    } else {
      // mobile
      return 3.906 * 2 * 16;
      // 3.906rem * 2 (top/bottom) * 16px
    }
  }

  // Function to set container height
  function setHeight() {
    const padding = getContentPadding();
    const contentHeight =
      title.offsetHeight + text.offsetHeight + button.offsetHeight;
    const newHeight = contentHeight + padding;

    gsap.to(content, {
      height: newHeight,
      duration: 0.5,
      ease: "power2.inOut",
    });
  }

  document
    .querySelector(".task1-section__btn")
    .addEventListener("click", () => {
      const tl = gsap.timeline();

      // Animate out
      tl.to([title, text, button], {
        opacity: 0,
        y: -20,
        duration: 0.3,
        stagger: 0.1,
        onComplete: () => {
          // Update content
          currentIndex = (currentIndex + 1) % contents.length;
          title.textContent = contents[currentIndex].title;
          text.textContent = contents[currentIndex].text;

          // After content update, set the new height
          setHeight();

          // Animate in
          gsap.to([title, text, button], {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.1,
            ease: "back.out(1.7)",
          });
        },
      });
    });

  // Set initial height after elements are loaded
  window.addEventListener("load", setHeight);

  // Handle resize events with debounce
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(setHeight, 100);
  });

  // Initial states
  gsap.set(image, {
    opacity: 0,
    x: -50,
  });

  gsap.set([title, text, button], {
    opacity: 0,
    y: 20,
  });

  // Timeline for animation
  const tl = gsap.timeline({ paused: true });

  tl.to(image, {
    opacity: 1,
    x: 0,
    duration: 1,
    ease: "power3.out",
  })
    .to(
      title,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "back.out(1.7)",
      },
      "-=0.4"
    )
    .to(
      text,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "back.out(1.7)",
      },
      "-=0.4"
    )
    .to(
      button,
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "back.out(1.7)",
      },
      "-=0.4"
    );

  // Intersection observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          tl.play();
        } else {
          tl.reverse();
        }
      });
    },
    {
      threshold: 0.2,
      rootMargin: "-10%",
    }
  );

  observer.observe(section);
}

initTask1();
