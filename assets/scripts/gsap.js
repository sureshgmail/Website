document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger);

  // Set up a matchMedia instance
  let mm = gsap.matchMedia();

  // Disable animations below 1024px
  const animationsEnabled = window.matchMedia("(min-width: 1025px)").matches;
  if (!animationsEnabled) {
    return;
  }

  // 1920px and above
  mm.add("(min-width: 1920px)", () => {
    gsap.to(".home-section__wrapper__about-logo-container", {
      scrollTrigger: {
        trigger: "#capabilities-button",
        start: "50% center",
        end: "500% bottom",
        scrub: 1.5,
      },
      y: 591,
      x: 604,
    });

    gsap.to("#capabilities-button", {
      scrollTrigger: {
        trigger: "#capabilities-button",
        start: "bottom center",
        scrub: 1,
      },
      y: "-6vw",
    });
  });

  // 1600px to 1919px
  mm.add("(min-width: 1600px) and (max-width: 1919px)", () => {
    gsap.to(".home-section__wrapper__about-logo-container", {
      scrollTrigger: {
        trigger: "#capabilities-button",
        start: "50% center",
        end: "480% bottom",
        scrub: 1.5,
      },
      y: 604,
      x: 594,
    });

    gsap.to("#capabilities-button", {
      scrollTrigger: {
        trigger: "#capabilities-button",
        start: "bottom center",
        scrub: 1,
      },
      y: "-6.5vw",
    });
  });

  // 1536px to 1599px
  mm.add("(min-width: 1536px) and (max-width: 1599px)", () => {
    gsap.to(".home-section__wrapper__about-logo-container", {
      scrollTrigger: {
        trigger: "#capabilities-button",
        start: "50% center",
        end: "460% bottom",
        scrub: 1.5,
      },
      y: 604,
      x: 544,
    });

    gsap.to("#capabilities-button", {
      scrollTrigger: {
        trigger: "#capabilities-button",
        start: "bottom center",
        scrub: 1,
      },
      y: "-7vw",
    });
  });

  // 1400px to 1535px
  mm.add("(min-width: 1400px) and (max-width: 1535px)", () => {
    gsap.to(".home-section__wrapper__about-logo-container", {
      scrollTrigger: {
        trigger: "#capabilities-button",
        start: "50% center",
        end: "440% bottom",
        scrub: 1.5,
      },
      y: 604,
      x: 510,
    });

    gsap.to("#capabilities-button", {
      scrollTrigger: {
        trigger: "#capabilities-button",
        start: "bottom center",
        scrub: 1,
      },
      y: "-7.5vw",
    });
  });

  // 1366px to 1399px
  mm.add("(min-width: 1366px) and (max-width: 1399px)", () => {
    gsap.to(".home-section__wrapper__about-logo-container", {
      scrollTrigger: {
        trigger: "#capabilities-button",
        start: "50% center",
        end: "420% bottom",
        scrub: 1.5,
      },
      y: 604,
      x: 471,
    });

    gsap.to("#capabilities-button", {
      scrollTrigger: {
        trigger: "#capabilities-button",
        start: "bottom center",
        scrub: 1,
      },
      y: "-8vw",
    });
  });

  // 1280px to 1365px
  mm.add("(min-width: 1280px) and (max-width: 1365px)", () => {
    gsap.to(".home-section__wrapper__about-logo-container", {
      scrollTrigger: {
        trigger: "#capabilities-button",
        start: "50% center",
        end: "400% bottom",
        scrub: 1.5,
      },
      y: 604,
      x: 471,
    });

    gsap.to("#capabilities-button", {
      scrollTrigger: {
        trigger: "#capabilities-button",
        start: "bottom center",
        scrub: 1,
      },
      y: "-8.5vw",
    });
  });

  // Below 1280px but above 1024px
  mm.add("(min-width: 1025px) and (max-width: 1279px)", () => {
    gsap.to(".home-section__wrapper__about-logo-container", {
      scrollTrigger: {
        trigger: "#capabilities-button",
        start: "50% center",
        end: "380% bottom",
        scrub: 1.5,
      },
      y: "52vw",
      x: "38vh",
    });

    gsap.to("#capabilities-button", {
      scrollTrigger: {
        trigger: "#capabilities-button",
        start: "bottom center",
        scrub: 1,
      },
      y: "-9vw",
    });
  });

  // Cleanup function
  return () => {
    // Kill all ScrollTriggers when matching media query changes
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  };
});
