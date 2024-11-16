import "../styles/app.scss";
import barba from "@barba/core";
import gsap from "gsap";

barba.init({
  transitions: [
    {
      name: "default-transition",
      sync: false,
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
        loadPageScript(namespace);

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
            done();
          },
        });
      },
    },
  ],
});

// Function to load page-specific scripts
function loadPageScript(namespace) {
  // Remove any existing page-specific scripts
  const existingScript = document.querySelector(
    `script[data-page="${namespace}"]`
  );
  if (existingScript) {
    existingScript.remove();
  }

  // Create and append new script
  const script = document.createElement("script");
  script.type = "module";
  script.setAttribute("data-page", namespace);
  script.src = `../scripts/${namespace}.js`;
  document.body.appendChild(script);
}

// Load initial page script
const initialNamespace = document.querySelector('[data-barba="container"]')
  .dataset.barbaNamespace;
loadPageScript(initialNamespace);
