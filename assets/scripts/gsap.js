document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger);

  // Set up a matchMedia instance
  let mm = gsap.matchMedia();

  // Helper: compute offsets (difference between target and source centers)
  const computeOffset = (fromSelector, toSelector) => {
    const fromEl = document.querySelector(fromSelector);
    const toEl = document.querySelector(toSelector);
    if (!fromEl || !toEl) return { x: 0, y: 0 };
    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();
    // Use difference in viewport coordinates (gsap x/y are transform offsets)
    return {
      x: Math.round(fromRect.left - toRect.left),
      y: Math.round(fromRect.top - toRect.top),
    };
  };

  function animations() {
    // Create animations when viewport is >= 1025px
    mm.add("(min-width: 1025px)", () => {
      // compute offsets fresh when this media query becomes active
      const offset = computeOffset(
        ".about-us__wrapper__mission-section__about-logo-container",
        ".home-section__wrapper__about-logo-container"
      );

      // create tweens and capture references so we can kill them on cleanup
      const tweenLogo = gsap.to(
        ".home-section__wrapper__about-logo-container",
        {
          scrollTrigger: {
            trigger: "#capabilities-button",
            start: "50% center",
            end: "500% bottom",
            scrub: 1.5,
          },
          y: offset.y,
          x: offset.x,
        }
      );

      const tweenButton = gsap.to("#capabilities-button", {
        scrollTrigger: {
          trigger: "#capabilities-button",
          start: "bottom center",
          scrub: 1,
        },
        y: "-6vw",
      });

      return () => {
        try {
          // kill tweens
          tweenLogo && tweenLogo.kill && tweenLogo.kill();
          tweenButton && tweenButton.kill && tweenButton.kill();
          // Only kill ScrollTriggers for specific elements (not overlay)
          ScrollTrigger.getAll().forEach((t) => {
            if (
              t.trigger &&
              (t.trigger.matches("#capabilities-button") ||
                t.trigger.matches(
                  ".home-section__wrapper__about-logo-container"
                ))
            ) {
              t.kill();
            }
          });
          // clear inline transforms/styles applied to specific elements
          gsap.set(
            ".home-section__wrapper__about-logo-container, #capabilities-button",
            { clearProps: "all" }
          );
        } catch (e) {
          // safety: ignore errors during cleanup
        }
      };
    });
  }
  animations();
  // Ensure animations are removed when viewport is <= 1024px. This callback
  // will run (and its cleanup when leaving) automatically via matchMedia.
  mm.add("(max-width: 1024px)", () => {
    // Only kill ScrollTriggers for specific elements (not overlay)
    ScrollTrigger.getAll().forEach((t) => {
      // Only kill triggers for logo and button animations, keep overlay intact
      if (
        t.trigger &&
        (t.trigger.matches("#capabilities-button") ||
          t.trigger.matches(".home-section__wrapper__about-logo-container"))
      ) {
        t.kill();
      }
    });

    // Only kill specific tweens (not overlay)
    gsap.killTweensOf(".home-section__wrapper__about-logo-container");
    gsap.killTweensOf("#capabilities-button");
    gsap.set(
      ".home-section__wrapper__about-logo-container, #capabilities-button",
      { clearProps: "all" }
    );

    // Return cleanup to be safe when leaving this query
    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
      gsap.set(
        ".home-section__wrapper__about-logo-container, #capabilities-button",
        { clearProps: "all" }
      );
    };
  });

  // Cleanup function
  return () => {
    // Kill all ScrollTriggers when matching media query changes
    ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
  };
});

function isDesktop() {
  return window.innerWidth >= 1025;
}

if (isDesktop()) {
  widthResize();
}

window.addEventListener("resize", function () {
  if (window.innerWidth >= 1025) {
    // window.location.reload();
    widthResize();
  }
});

function widthResize() {
  // Store the initial window width
  let previousWidth = window.innerWidth;

  // Add a resize event listener to the window
  window.addEventListener("resize", function () {
    const currentWidth = window.innerWidth;

    // Check if the current width is different from the previous width
    if (currentWidth !== previousWidth) {
      // Only X-axis (horizontal) resize occurred.
      // Place your specific code or function calls here
      // executeMyDesiredCode();
      window.location.reload();
      // Update the previous width for the next comparison
      previousWidth = currentWidth;
    }
  });
}
