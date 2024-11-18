import gsap from "gsap";
import { debounce } from "lodash";
import barba from "@barba/core";

function initScrollAnimation() {
  gsap.set(".task1-scroll", { opacity: 0 }); // Reset initial state
  gsap.to(".task1-scroll", {
    opacity: 1,
    y: 20,
    duration: 1.5,
    ease: "power2.inOut",
    repeat: -1,
    yoyo: true,
  });
}

function initTask1() {
  const section = document.querySelector(".feature-block");
  const image = section.querySelector(".feature-block__media");
  const title = section.querySelector(".feature-block__heading");
  const text = section.querySelector(".feature-block__description");
  const button = section.querySelector(".feature-block__cta");
  const content = section.querySelector(".feature-block__content");

  // Initialize scroll animation
  initScrollAnimation();

  // Array of content to cycle through
  const contents = [
    {
      title: "Handcrafted and Responsibly Sourced",
      text: "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain.",
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
  let isFirstToggle = true;

  // Function to calculate padding based on viewport
  function getContentPadding() {
    const viewportWidth = window.innerWidth;
    if (viewportWidth >= 1024) {
      return 6.5 * 2 * 16;
    } else if (viewportWidth >= 768) {
      return 3.906 * 2 * 16;
    } else {
      return 3.906 * 2 * 16;
    }
  }

  // Function to set container height (only used after first toggle)
  function setHeight() {
    if (!isFirstToggle) {
      const padding = getContentPadding();
      const titleMarginBottom = 16; // 1rem in pixels
      const buttonMarginTop = 24; // 1.5rem in pixels

      const contentHeight =
        title.offsetHeight +
        titleMarginBottom +
        text.offsetHeight +
        buttonMarginTop +
        button.offsetHeight;

      const newHeight = contentHeight + padding;

      gsap.to(content, {
        height: newHeight,
        duration: 0.5,
        ease: "power2.inOut",
      });
    }
  }

  document
    .querySelector(".feature-block__cta")
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

          if (isFirstToggle) {
            // On first toggle, set initial height without animation
            const padding = getContentPadding();
            const contentHeight =
              title.offsetHeight + text.offsetHeight + button.offsetHeight;
            const newHeight = contentHeight + padding;
            gsap.set(content, { height: newHeight });
            isFirstToggle = false;
          } else {
            // For subsequent toggles, animate
            setHeight();
          }

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

  // Handle resize events with debounce
  window.addEventListener("resize", debounce(setHeight, 100));

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

// For initial page load
window.addEventListener("load", () => {
  if (document.querySelector('[data-barba-namespace="task1"]')) {
    initTask1();
  }
});

// Add Barba hook instead
barba.hooks.afterEnter((data) => {
  if (data.next.namespace === "task1") {
    initTask1();
  }
});
