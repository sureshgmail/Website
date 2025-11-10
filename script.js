/**Hamburger */
const overlay = document.getElementById("overlay-custom");
const hamburgerBtn = document.getElementById("hamburger");

document.getElementById("hamburger").addEventListener("click", (e) => {
  const target = e.currentTarget;
  const list = target.closest(".aside").querySelector("ul");

  /**On Click Nav */

  function navLinkClick(e) {
    const ctarget = e.target;

    const isCtarget = ctarget.classList.contains("aside__list--item__link");
    const parentCtarget = ctarget.closest(".aside__list--item__link");
    const isParentCtarget =
      parentCtarget !== null && parentCtarget !== undefined;
    if (isCtarget || isParentCtarget) {
      list.classList.remove("active");
      target.classList.remove("active");
      overlay.style.display = "none";
      list.removeEventListener("click", navLinkClick);
    }
  }
  list.addEventListener("click", navLinkClick);

  /**On Click Nav End */

  if (target.classList.contains("active")) {
    list.classList.remove("active");
    overlay.style.display = "none";
    list.removeEventListener("click", navLinkClick);
  } else {
    list.classList.add("active");
    overlay.style.display = "block";
  }
  target.classList.toggle("active");
});

overlay.addEventListener("click", () => {
  const list = document.querySelector(".aside__list");
  list.classList.remove("active");
  overlay.style.display = "none";
  hamburgerBtn.classList.remove("active");
});

// Contact form validation + simple captcha (reusable for multiple forms)
function setupContactValidation(form) {
  if (!form) return;

  // create elements for inline errors and success
  const createError = (msg) => {
    const el = document.createElement("p");
    el.className = "form-error";
    el.style.color = "#d9534f";
    el.style.margin = "0.4rem 0 0";
    el.textContent = msg;
    return el;
  };

  const createSuccess = (msg) => {
    const el = document.createElement("p");
    el.className = "form-success";
    el.style.color = "#28a745";
    el.style.margin = "0.4rem 0 0";
    el.textContent = msg;
    return el;
  };

  // find captcha display (try common containers first, fall back to image-based search)
  let captchaEl = form.querySelector(".captcha-container h1");
  let resetBtn = form.querySelector(".reset-wrapper img");
  if (!captchaEl) {
    const resetImg = form.querySelector('img[src*="reset.png"]');
    if (resetImg) {
      const parent = resetImg.closest("div");
      if (parent && parent.parentNode)
        captchaEl = parent.parentNode.querySelector("h1");
      resetBtn = resetImg;
    }
  }

  // find where to show captcha validation messages inside this form
  let captchaPlaceholder =
    form.querySelector(".captch-error") ||
    form.querySelector(".field-error.captch-error") ||
    null;

  // simple captcha generator (per form)
  let currentCaptcha = "";
  function genCaptcha() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let s = "";
    for (let i = 0; i < 6; i++)
      s += chars.charAt(Math.floor(Math.random() * chars.length));
    currentCaptcha = s.split("").join(" ");
    if (captchaEl) captchaEl.textContent = currentCaptcha;
  }

  // ensure an input for captcha answer exists inside this form
  let captchaInput = form.querySelector('input[name="captcha_answer"]');
  if (!captchaInput) {
    captchaInput = document.createElement("input");
    captchaInput.type = "text";
    captchaInput.name = "captcha_answer";
    captchaInput.placeholder = "Enter Captcha";
    captchaInput.style.display = "block";
    captchaInput.style.marginTop = "0.4rem";

    // insert before the placeholder if possible, otherwise append to the form
    if (captchaPlaceholder) {
      captchaPlaceholder.parentNode.insertBefore(
        captchaInput,
        captchaPlaceholder
      );
    } else {
      // attempt to append near the captcha element
      if (captchaEl && captchaEl.parentNode) {
        captchaEl.parentNode.appendChild(captchaInput);
      } else {
        form.appendChild(captchaInput);
      }
    }
  }

  // wire reset button for this form if found
  if (resetBtn) {
    resetBtn.addEventListener("click", (e) => {
      genCaptcha();
    });
  }

  genCaptcha();

  function clearErrors(f) {
    f.querySelectorAll(".form-success").forEach((n) => n.remove());
    f.querySelectorAll(".field-error").forEach((p) => (p.textContent = ""));
    form.querySelectorAll(".form-error").forEach((n) => n.remove());
  }

  function validateEmail(email) {
    return /^\S+@\S+\.\S+$/.test(email);
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    clearErrors(form);

    const name = form.querySelector('input[placeholder="Your Name"]');
    const email = form.querySelector('input[placeholder="Email Address"]');
    const org = form.querySelector('input[placeholder="Organization"]');
    const message = form.querySelector('textarea[placeholder="Your Message"]');

    const fields = [
      { el: name, name: "Name" },
      { el: email, name: "Email" },
      { el: org, name: "Organization" },
    ];

    let firstInvalid = null;
    let valid = true;

    fields.forEach((f) => {
      if (!f.el) return;
      const v = f.el.value && f.el.value.trim();
      // find the next .field-error placeholder after the element
      const placeholder = (function () {
        let node = f.el.nextElementSibling;
        while (node) {
          if (node.classList && node.classList.contains("field-error"))
            return node;
          node = node.nextElementSibling;
        }
        return null;
      })();

      if (!v) {
        valid = false;
        if (placeholder) {
          placeholder.textContent = f.name + " is required";
        } else {
          f.el.insertAdjacentElement(
            "afterend",
            createError(f.name + " is required")
          );
        }
        if (!firstInvalid) firstInvalid = f.el;
      }
    });

    if (email && email.value && !validateEmail(email.value.trim())) {
      valid = false;
      const placeholder = (function () {
        let node = email.nextElementSibling;
        while (node) {
          if (node.classList && node.classList.contains("field-error"))
            return node;
          node = node.nextElementSibling;
        }
        return null;
      })();
      if (placeholder) {
        placeholder.textContent = "Please enter a valid email";
      } else {
        email.insertAdjacentElement(
          "afterend",
          createError("Please enter a valid email")
        );
      }
      if (!firstInvalid) firstInvalid = email;
    }

    // captcha required
    if (captchaInput && captchaPlaceholder) {
      const userVal = (captchaInput.value || "").trim();
      if (!userVal) {
        valid = false;
        captchaPlaceholder.textContent = "Captcha is required";
        if (!firstInvalid) firstInvalid = captchaInput;
      } else {
        // Compare user input with current captcha (ignoring spaces)
        const inputCleaned = userVal.replace(/\s+/g, "");
        const captchaCleaned = currentCaptcha.replace(/\s+/g, "");
        if (inputCleaned.toUpperCase() !== captchaCleaned) {
          valid = false;
          captchaPlaceholder.textContent = "Invalid captcha. Please try again";
          if (!firstInvalid) firstInvalid = captchaInput;
          // Generate new captcha on incorrect attempt
          genCaptcha();
        }
      }
    }

    if (!valid) {
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const successMsg = createSuccess(
      "Message sent successfully. We'll contact you soon."
    );

    contactUsApi(form, createSuccess, createError, genCaptcha, clearErrors);
  });
}

// mail functionality
async function contactUsApi(
  form,
  createSuccess,
  createError,
  genCaptcha,
  clearErrors
) {
  const formData = new FormData(form);
  form.querySelector("#getintouch-submit-button").disabled = true;
  form.querySelector("#getintouch-submit-button").textContent =
    "Please Wait...";
  try {
    const response = await fetch("mail.php", {
      method: "POST",
      body: formData,
    });
    form.querySelector("#getintouch-submit-button").disabled = true;
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (data.status == "success") {
      const successMsg = createSuccess(
        "Message sent successfully. We'll contact you soon."
      );
      form.appendChild(successMsg);

      // Remove success message after 5 seconds
      setTimeout(() => {
        successMsg.remove();
        clearErrors(form);
        form.querySelector("#getintouch-submit-button").disabled = false;

        form.reset();
      }, 5000);
    } else {
      form.appendChild(createError("Something Went Wrong! Please try again"));

      setTimeout(() => {
        form.querySelector("#getintouch-submit-button").disabled = false;
        clearErrors(form);
      }, 3000);
    }
    form.querySelector("#getintouch-submit-button").textContent = "Submit";
    form.reset();
    genCaptcha();
  } catch (error) {
    form.appendChild(createError("Something Went Wrong! Please try again"));
    // BUTTON ACTIVATION FOR FAILED MESSAGE
    form.querySelector("#getintouch-submit-button").textContent = "Submit";
    form.querySelector("#getintouch-submit-button").disabled = false;
    setTimeout(() => {
      clearErrors(form);
    }, 3000);
  }
}
// Initialize validation for the footer form and the dialog form
try {
  const footerForm = document.querySelector(
    ".footer-section__get-in-touch__form-container form"
  );
  if (footerForm) setupContactValidation(footerForm);
  const dialogForm = document.querySelector("dialog form");
  if (dialogForm) setupContactValidation(dialogForm);
} catch (err) {
  console.error("Error initializing contact form validation:", err);
}
function openCity(evt, cityName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}

// about us tab
document.addEventListener("DOMContentLoaded", function () {
  try {
    var firstTabBtn =
      document.querySelector(".tablinks.active") ||
      document.querySelector(".tablinks");
    if (firstTabBtn && typeof openCity === "function") {
      // call openCity with a fake event object whose currentTarget is the button
      openCity({ currentTarget: firstTabBtn }, "London");
    } else {
      // fallback: just show the London content
      var london = document.getElementById("London");
      if (london) london.style.display = "block";
    }
  } catch (err) {
    // silent fail -- don't break other scripts
    console.error("Error initializing tabs:", err);
  }
});

// scroll to top
function scrollToTop() {
  // Disable scroll spy during scroll to top
  isAutoScrolling = true;

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}
let scrollLogo = document.querySelectorAll(".logo-spy");
scrollLogo.forEach((logo) => {
  logo.addEventListener("click", () => {
    document
      .querySelector(".aside__list--item__link.active")
      .classList.remove("active");
    document.querySelector("#nav-home-button").classList.add("active");
  });
});
let scrollTopBtn = document.getElementById("scroll-top");
scrollTopBtn.addEventListener("click", (e) => {
  e.preventDefault();
  scrollToTop();
});

let scrollBottom = document.querySelector(
  ".home-section__wrapper__scroll-down"
);
let capabilities = document.getElementById("capabilities-button");

const hamburger = document.getElementById("hamburger");
let navlist = document.querySelector(".aside__list");
let callToActions = [
  "scroll-top",
  "footer-logo-button",
  "header-logo-button",
  "service-button1",
  "service-button2",
  "service-button3",
  "service-button4",
  "service-button5",
];

// navbar movement
function navbarMovement() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      const fixedNavbarHeight = 60; // Adjust this to your navbar's height

      if (targetElement) {
        const targetPosition =
          targetElement.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({
          top: targetPosition - fixedNavbarHeight,
          behavior: "auto",
        });
      }
    });
  });
}
navbarMovement();

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".aside__list--item__link");
let isAutoScrolling = false;

// Click handler: smooth scroll + scroll spy
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    let form = document.querySelector("form");
    let formErrors = form.querySelectorAll(".field-error");
    formErrors.forEach((errorMsg) => {
      errorMsg.textContent = "";
    });

    const targetId = link.getAttribute("data-nav");
    const target = document.querySelector(targetId);

    if (!target) return;

    // Clear any existing timeout
    if (window.scrollTimeout) {
      clearTimeout(window.scrollTimeout);
    }

    // Mark scrolling in progress
    isAutoScrolling = true;

    // Instantly highlight the clicked menu
    navLinks.forEach((lnk) => lnk.classList.remove("active"));
    link.classList.add("active");

    // Get the scroll destination
    const targetPosition = target.offsetTop - 60;

    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;

    // Calculate scroll duration based on distance
    const duration = Math.min(Math.abs(distance), 1000); // Max 1 second

    // Smooth scroll to section
    window.scrollTo({
      top: targetPosition,
      behavior: "smooth",
    });

    // Set a timeout to re-enable scroll spy after animation
    window.scrollTimeout = setTimeout(() => {
      isAutoScrolling = false;

      // Double-check the active section after scroll completes
      const currentSection = Array.from(sections).find((section) => {
        const rect = section.getBoundingClientRect();
        return rect.top <= 100 && rect.bottom >= 100;
      });

      if (currentSection) {
        const currentId = `#${currentSection.id}`;
        navLinks.forEach((navLink) => {
          navLink.classList.toggle(
            "active",
            navLink.getAttribute("data-nav") === currentId
          );
        });
      }
    }, duration + 100); // Add small buffer to duration
  });
});

// Scroll listener with Intersection Observer
const observerOptions = {
  root: null,
  rootMargin: "-10% 0px",
  threshold: [0.3],
};

const observerCallback = (entries) => {
  if (isAutoScrolling) return;

  const visibleSections = entries.filter((entry) => entry.isIntersecting);

  if (visibleSections.length) {
    // Find the section closest to the center of the viewport
    const closest = visibleSections.reduce(
      (acc, curr) => {
        const rect = curr.target.getBoundingClientRect();
        const center = Math.abs(
          window.innerHeight / 2 - (rect.top + rect.height / 2)
        );
        return center < acc.center ? { section: curr.target, center } : acc;
      },
      { section: null, center: Infinity }
    );

    if (closest.section) {
      const currentId = `#${closest.section.id}`;
      navLinks.forEach((link) => {
        if (link.getAttribute("data-nav") === currentId) {
          if (!link.classList.contains("active")) {
            link.classList.add("active");
          }
        } else {
          link.classList.remove("active");
        }
      });
      // Try to ensure autoplay works on restrictive mobile browsers (Edge/Chrome/Safari)
      // Force muted + programmatic play on DOMContentLoaded for any autoplay videos.
      // document.addEventListener("DOMContentLoaded", function () {
      //   try {
      //     const autoplayVideos = document.querySelectorAll("video[autoplay]");
      //     console.log(autoplayVideos);

      //     autoplayVideos.forEach((v) => {
      //       // Ensure muted attribute is present
      //       v.muted = true;
      //       // Some browsers require playsinline to be set as property as well
      //       v.playsInline = true;
      //       // Try to play programmatically; if blocked, browsers will ignore the error
      //       const p = v.play();
      //       if (p && p.catch) p.catch(() => {});
      //     });
      //   } catch (err) {
      //     // swallow errors - non-critical
      //     console.warn("Autoplay helper failed:", err);
      //   }
      // });
    }
  }
};

const observer = new IntersectionObserver(observerCallback, observerOptions);
sections.forEach((section) => observer.observe(section));

// Backup scroll listener for extreme scroll speeds
let scrollTimeout = null;
window.addEventListener("scroll", () => {
  if (isAutoScrolling) return;

  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }

  scrollTimeout = setTimeout(() => {
    const viewportMiddle = window.innerHeight / 2;
    let closestSection = null;
    let minDistance = Infinity;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const sectionMiddle = rect.top + rect.height / 2;
      const distance = Math.abs(viewportMiddle - sectionMiddle);

      if (distance < minDistance) {
        minDistance = distance;
        closestSection = section;
      }
    });

    if (closestSection) {
      const currentId = `#${closestSection.id}`;
      navLinks.forEach((link) => {
        if (link.getAttribute("data-nav") === currentId) {
          if (!link.classList.contains("active")) {
            link.classList.add("active");
          }
        } else {
          link.classList.remove("active");
        }
      });
    }
  }, 150); // Slightly longer debounce
});
// let video = document.querySelectorAll("video");
// console.log(video);

// video.forEach((vid) => {
//   vid.play();
// });
