/**Hamburger */
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
      list.removeEventListener("click", navLinkClick);
    }
  }
  list.addEventListener("click", navLinkClick);

  /**On Click Nav End */

  if (target.classList.contains("active")) {
    list.classList.remove("active");
    list.removeEventListener("click", navLinkClick);
  } else {
    list.classList.add("active");
  }
  target.classList.toggle("active");
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
    form.appendChild(successMsg);
    form.reset();
    genCaptcha();

    // Remove success message after 5 seconds
    setTimeout(() => {
      successMsg.remove();
    }, 5000);

    // contactUsApi(form);
  });
}

// mail functionality
async function contactUsApi(form) {
  const formData = new FormData(form);
  form.querySelector("button").disabled = true;
  try {
    const response = await fetch("mail.php", {
      method: "POST",
      body: formData,
    });
    form.querySelector("button").disabled = true;
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (data.status == "success") {
      console.log("success data", data);
      const successMsg = createSuccess(
        "Message sent successfully. We'll contact you soon."
      );
      form.appendChild(successMsg);

      // Remove success message after 5 seconds
      setTimeout(() => {
        successMsg.remove();
        clearErrors(form);
        form.querySelector("button").disabled = false;
        form.reset();
      }, 5000);
    } else {
      form.appendChild(createError("Something Went Wrong! Please try again"));
      setTimeout(() => {
        form.querySelector("button").disabled = false;
        clearErrors(form);
      }, 3000);
    }
    genCaptcha();
  } catch (error) {
    console.log("errror", error);
    form.appendChild(createError("Something Went Wrong! Please try again"));
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

// --- Scroll-spy: mark sidebar nav links active for the section in view ---
(function () {
  var navLinks = Array.from(
    document.querySelectorAll(".aside__list--item__link")
  );
  if (!navLinks.length) return;

  // map href -> element
  var linkMap = new Map();
  navLinks.forEach(function (a) {
    var href = a.getAttribute("href");
    if (href && href.startsWith("#")) linkMap.set(href.slice(1), a);
    // on click, mark link active immediately
    a.addEventListener("click", function () {
      navLinks.forEach((n) => n.classList.remove("active"));
      a.classList.add("active");
    });
  });

  var sections = Array.from(linkMap.keys())
    .map(function (id) {
      return document.getElementById(id);
    })
    .filter(Boolean);
  if (!sections.length) return;

  var obsOptions = {
    root: null,
    rootMargin: "-40% 0px -40% 0px", // focus on center 20% of viewport
    threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
  };

  // map of id -> last intersectionRatio
  var sectionStates = {};

  var observer = new IntersectionObserver(function (entries) {
    // update state for all entries we got
    entries.forEach(function (entry) {
      sectionStates[entry.target.id] = entry.intersectionRatio;
    });

    // choose the section with the highest intersection ratio
    var maxId = null;
    var maxRatio = 0;
    Object.keys(sectionStates).forEach(function (id) {
      var r = sectionStates[id] || 0;
      if (r > maxRatio) {
        maxRatio = r;
        maxId = id;
      }
    });

    if (maxId && maxRatio > 0) {
      var link = linkMap.get(maxId);
      if (link) {
        navLinks.forEach(function (n) {
          n.classList.remove("active");
        });
        link.classList.add("active");
      }
    }
  }, obsOptions);

  sections.forEach(function (s) {
    // initialize state
    sectionStates[s.id] = 0;
    observer.observe(s);
  });
})();

// scroll to top
function scrollToTop() {
  window.scrollTo({ top: 0 });
}
let scrollTopBtn = document.getElementById("scroll-top");
scrollTopBtn.addEventListener("click", () => {
  scrollToTop();
});

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
