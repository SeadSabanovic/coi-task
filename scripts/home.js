import gsap from "gsap";
import barba from "@barba/core";

function initImageReveal() {
  const taskImages = document.querySelectorAll(".home-tasks__task-image");
  const imageElements = document.querySelectorAll(
    ".home-tasks__task-image img"
  );
  let loadedImages = 0;

  // Set initial states for all containers and images
  taskImages.forEach((container) => {
    const img = container.querySelector("img");
    const overlay = container.querySelector(".home-tasks__task-overlay");

    if (img && overlay) {
      gsap.set(container, { visibility: "hidden" });
      gsap.set(img, { scale: 1.4 });
    }
  });

  // Create the staggered reveal animation
  function revealAll() {
    taskImages.forEach((container, index) => {
      const img = container.querySelector("img");
      const overlay = container.querySelector(".home-tasks__task-overlay");

      if (img && overlay) {
        const tl = gsap.timeline({
          defaults: {
            ease: "power2.inOut",
          },
          delay: index * 0.2,
        });

        tl.to(container, { duration: 0, visibility: "visible" })
          .to(overlay, {
            width: "0%",
            duration: 1.5,
          })
          .to(
            img,
            {
              duration: 1.6,
              scale: 1,
            },
            "-=1.5"
          );
      }
    });
  }

  // Check when all images are loaded
  function handleImageLoad() {
    loadedImages++;
    if (loadedImages === imageElements.length) {
      revealAll();
    }
  }

  // Add load event listeners to all images
  imageElements.forEach((img) => {
    if (img.complete) {
      handleImageLoad();
    } else {
      img.addEventListener("load", handleImageLoad);
    }
  });
}

function initTaskHover() {
  const tasks = document.querySelectorAll(".home-tasks__task");

  tasks.forEach((task) => {
    const image = task.querySelector("img");
    let bounds;

    const mouseleaveHandler = () => {
      gsap.to(image, {
        duration: 0.6,
        x: 0,
        y: 0,
        ease: "power3.out",
      });
    };

    const mousemoveHandler = (e) => {
      bounds = task.getBoundingClientRect();
      const mouseX = (e.clientX - bounds.left) / bounds.width - 0.5;
      const mouseY = (e.clientY - bounds.top) / bounds.height - 0.5;

      gsap.to(image, {
        duration: 0.6,
        x: mouseX * 30,
        y: mouseY * 30,
        ease: "power3.out",
      });
    };

    task.addEventListener("mouseleave", mouseleaveHandler);
    task.addEventListener("mousemove", mousemoveHandler);
  });
}

// Initialize all home page functionality
function initHome() {
  // Small timeout to ensure DOM is fully ready
  setTimeout(() => {
    initImageReveal();
    initTaskHover();
  }, 100);
}

// For initial page load
window.addEventListener("load", () => {
  if (document.querySelector('[data-barba-namespace="home"]')) {
    initHome();
  }
});

// For Barba page transitions
barba.hooks.afterEnter((data) => {
  if (data.next.namespace === "home") {
    initHome();
  }
});
