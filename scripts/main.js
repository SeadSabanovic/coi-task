import "../styles/app.scss";
import barba from "@barba/core";
import gsap from "gsap";

// Function to animate the button--back-home element
function animateBackHomeButton(action) {
  const backHomeButton = document.querySelector(".button--back-home");
  if (backHomeButton) {
    const animationProps = {
      opacity: action === "in" ? 1 : 0,
      y: action === "in" ? 0 : -20,
      duration: 0.5,
      ease: "power2.inOut",
    };

    if (action === "out") {
      return new Promise((resolve) => {
        gsap.to(backHomeButton, {
          ...animationProps,
          onComplete: () => {
            backHomeButton.remove();
            resolve();
          },
        });
      });
    } else {
      gsap.fromTo(backHomeButton, { opacity: 0, y: -20 }, animationProps);
    }
  }
  return Promise.resolve();
}

barba.init({
  transitions: [
    {
      name: "default-transition",
      sync: false,
      beforeLeave(data) {
        return animateBackHomeButton("out");
      },
      leave(data) {
        const done = this.async();

        gsap.to(data.current.container, {
          opacity: 0,
          x: -100,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => {
            data.current.container.remove();
            done();
          },
        });
      },
      enter(data) {
        const done = this.async();

        // Load page-specific scripts based on namespace
        const namespace = data.next.namespace;
        if (namespace !== "task2") {
          loadPageScript(namespace);
        }

        gsap.set(data.next.container, {
          opacity: 0,
          x: 100,
        });

        gsap.to(data.next.container, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: () => {
            gsap.set(data.next.container, {
              clearProps: "transform",
            });

            animateBackHomeButton("in");
            done();
          },
        });
      },
    },
  ],
});

// Function to load page-specific scripts
function loadPageScript(namespace) {
  // Check for existing script
  const existingScript = document.querySelector(`script[data-page="${namespace}"]`);
  
  // Only create and append new script if it doesn't exist
  if (!existingScript) {
    const script = document.createElement("script");
    script.type = "module";
    script.setAttribute("data-page", namespace);
    script.src = `../scripts/${namespace}.js`;
    document.body.appendChild(script);
  }
}

// Load initial page script
const initialNamespace = document.querySelector('[data-barba="container"]')
  .dataset.barbaNamespace;
loadPageScript(initialNamespace);

// Animate the button--back-home element on initial load
animateBackHomeButton("in");
