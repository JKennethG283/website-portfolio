const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("[data-nav-menu]");
const navLinks = [...document.querySelectorAll(".nav-links a")];
const sections = [...document.querySelectorAll("main section[id]")];
const year = document.querySelector("[data-year]");

if (year) {
  year.textContent = new Date().getFullYear();
}

const closeMenu = () => {
  document.body.classList.remove("nav-open");
  navMenu?.classList.remove("open");
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "Open navigation menu");
};

navToggle?.addEventListener("click", () => {
  const isOpen = navToggle.getAttribute("aria-expanded") === "true";
  document.body.classList.toggle("nav-open", !isOpen);
  navMenu?.classList.toggle("open", !isOpen);
  navToggle.setAttribute("aria-expanded", String(!isOpen));
  navToggle.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
});

navLinks.forEach((link) => {
  link.addEventListener("click", closeMenu);
});

const updateHeader = () => {
  header?.classList.toggle("scrolled", window.scrollY > 10);
};

const updateActiveLink = () => {
  let currentSection = sections[0];

  sections.forEach((section) => {
    const rect = section.getBoundingClientRect();

    if (rect.top <= 140) {
      currentSection = section;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${currentSection.id}`);
  });
};

updateHeader();
updateActiveLink();

window.addEventListener("scroll", () => {
  updateHeader();
  updateActiveLink();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 860) {
    closeMenu();
  }
});
