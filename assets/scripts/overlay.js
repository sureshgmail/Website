window.onload = function () {
  var loader = document.getElementById("page-loader");
  var content = document.querySelector("main");

  setTimeout(() => {
    if (loader) {
      loader.style.display = "none"; // Hide the loader
    }
    if (content) {
      content.style.display = "block"; // Show the main content
    }
  }, 5000);
};

document.addEventListener("DOMContentLoaded", (event) => {
  gsap.registerPlugin(ScrollTrigger);
  gsap.to("#overlay", {
    scrollTrigger: {
      trigger: "#overlay",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
    scale: 1.9,
    opacity: 0,

    ease: "none",
    // onUpdate: (self) => {
    //   // pointerEvents toggle for overlay when fully hidden or shown
    //   if (self.progress === 0) {
    //     gsap.set("#overlay", { pointerEvents: "auto" });
    //   } else {
    //     gsap.set("#overlay", { pointerEvents: "none" });
    //   }
    // },
  });

  // Initially hide scroll for content behind overlay
});
