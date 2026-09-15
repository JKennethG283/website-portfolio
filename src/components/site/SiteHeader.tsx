"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const SECTION_IDS = [
  "home",
  "experience",
  "projects",
  "about",
  "skills",
  "playground",
  "contact",
] as const;

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string>("home");
  const toggleRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);

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
      if (
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 4
      ) {
        current = "contact";
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
    const onKeyDown = (event: KeyboardEvent) => {
      if (!menuOpen) return;
      if (event.key === "Escape") {
        closeMenu();
        toggleRef.current?.focus();
      }
      if (event.key === "Tab") {
        const links = menuRef.current?.querySelectorAll<HTMLAnchorElement>("a");
        const last = links?.[links.length - 1];
        if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          toggleRef.current?.focus();
        } else if (
          event.shiftKey &&
          document.activeElement === toggleRef.current
        ) {
          event.preventDefault();
          last?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("nav-open");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen, closeMenu]);

  const toggleMenu = () => {
    setMenuOpen((o) => !o);
  };

  const navLink = (id: string, label: string) => (
    <li key={id}>
      <a
        href={`#${id}`}
        className={activeId === id ? "active" : undefined}
        aria-current={activeId === id ? "location" : undefined}
        onClick={closeMenu}
      >
        {label}
      </a>
    </li>
  );

  return (
    <header className={`site-header${scrolled ? " scrolled" : ""}`} data-header>
      <nav className="nav wide-container" aria-label="Primary navigation">
        <a
          className="wordmark"
          href="#home"
          aria-label="Jonathan Kenneth — home"
          onClick={closeMenu}
        >
          <span className="brand-symbol" aria-hidden="true">
            ✳
          </span>{" "}
          Jonathan Kenneth<span className="wordmark-dot">.</span>
        </a>
        <button
          className="nav-toggle"
          ref={toggleRef}
          type="button"
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          aria-controls="primary-menu"
          data-nav-toggle
          onClick={toggleMenu}
        >
          <span />
          <span />
          <span />
        </button>
        <ul
          className={`nav-links${menuOpen ? " open" : ""}`}
          id="primary-menu"
          ref={menuRef}
          data-nav-menu
        >
          {navLink("experience", "Experience")}
          {navLink("projects", "Work")}
          {navLink("about", "About")}
          {navLink("playground", "Playground")}
          <li>
            <a
              className={`nav-contact${activeId === "contact" ? " active" : ""}`}
              aria-current={activeId === "contact" ? "location" : undefined}
              href="#contact"
              onClick={closeMenu}
            >
              Let’s talk <span aria-hidden="true">↗</span>
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
