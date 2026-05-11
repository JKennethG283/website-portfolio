"use client";

import { useCallback, useEffect, useState } from "react";

const SECTION_IDS = [
  "home",
  "about",
  "skills",
  "projects",
  "experience",
  "contact",
] as const;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string>("home");

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
      let current = "home";
      for (const id of SECTION_IDS) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 140) current = id;
        }
      }
      setActiveId(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 860) closeMenu();
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [closeMenu]);

  useEffect(() => {
    document.body.classList.toggle("nav-open", menuOpen);
    return () => document.body.classList.remove("nav-open");
  }, [menuOpen]);

  const toggleMenu = () => {
    setMenuOpen((o) => !o);
  };

  const navLink = (id: string, label: string) => (
    <li key={id}>
      <a
        href={`#${id}`}
        className={activeId === id ? "active" : undefined}
        onClick={closeMenu}
      >
        {label}
      </a>
    </li>
  );

  return (
    <header
      className={`site-header${scrolled ? " scrolled" : ""}`}
      data-header
    >
      <nav className="nav container" aria-label="Primary navigation">
        <a className="logo" href="#home" aria-label="Go to homepage">
          JK
        </a>
        <button
          className="nav-toggle"
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          data-nav-toggle
          onClick={toggleMenu}
        >
          <span />
          <span />
          <span />
        </button>
        <ul
          className={`nav-links${menuOpen ? " open" : ""}`}
          data-nav-menu
        >
          {navLink("about", "About")}
          {navLink("skills", "Skills")}
          {navLink("projects", "Projects")}
          {navLink("experience", "Experience")}
          {navLink("contact", "Contact")}
        </ul>
      </nav>
    </header>
  );
}
