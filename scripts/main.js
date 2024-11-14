import "../styles/app.scss";
import barba from "@barba/core";
import gsap from "gsap";

// Initialize Barba with GSAP transitions
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

        gsap.set(data.next.container, {
          opacity: 0,
          x: 100,
        });

        gsap.to(data.next.container, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          ease: "power2.inOut",
          onComplete: done,
        });
      },
    },
  ],
});
