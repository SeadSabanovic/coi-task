import gsap from "gsap";

function initImageReveal() {
  const taskImages = document.querySelectorAll(".home-tasks__task-image");
  const imageElements = document.querySelectorAll(".home-tasks__task-image img");
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
          delay: index * 0.2, // Add stagger delay between each animation
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
  const tasks = document.querySelectorAll('.home-tasks__task');

  tasks.forEach(task => {
    const image = task.querySelector('img');
    let bounds;

    // Reset image position on mouse leave
    task.addEventListener('mouseleave', () => {
      gsap.to(image, {
        duration: 0.6,
        x: 0,
        y: 0,
        ease: 'power3.out'
      });
    });

    // Track mouse movement and animate image
    task.addEventListener('mousemove', (e) => {
      bounds = task.getBoundingClientRect();
      
      // Calculate mouse position relative to task center (in percentage)
      const mouseX = (e.clientX - bounds.left) / bounds.width - 0.5;
      const mouseY = (e.clientY - bounds.top) / bounds.height - 0.5;

      // Animate image position based on mouse movement
      gsap.to(image, {
        duration: 0.6,
        x: mouseX * 30, // Multiply by desired movement amount
        y: mouseY * 30,
        ease: 'power3.out'
      });
    });
  });
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initImageReveal();
  initTaskHover();
});
