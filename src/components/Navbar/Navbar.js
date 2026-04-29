"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import styles from "./Navbar.module.css";

const links = [
  { href: "#introduccion", label: "Introducción" },
  { href: "#funcionamiento", label: "Funcionamiento" },
  { href: "#componentes", label: "Componentes" },
  { href: "#electronica", label: "Electrónica" },
  { href: "#codigo", label: "Código" },
  { href: "#equipo", label: "Equipo" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}
    >
      <div className={`container ${styles.inner}`}>
        <Link href="#top" className={styles.brand} onClick={() => setOpen(false)}>
          <span className={styles.brandMark} aria-hidden="true">
            <span className={styles.brandDot} />
            <span className={styles.brandDot} />
            <span className={styles.brandDot} />
            <span className={styles.brandDot} />
            <span className={styles.brandDot} />
            <span className={styles.brandDot} />
          </span>
          <span className={styles.brandText}>
            ROVER<span className={styles.brandAccent}>UNACH</span>
          </span>
        </Link>

        <nav className={styles.nav} aria-label="Principal">
          {links.map((l) => (
            <a key={l.href} href={l.href} className={styles.link}>
              {l.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <a href="#recursos" className={styles.cta}>
            Recursos
            <span className={styles.ctaArrow} aria-hidden="true">
              →
            </span>
          </a>
          <button
            className={styles.menuBtn}
            aria-label="Abrir menú"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className={styles.mobileMenu}
          >
            <div className="container">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className={styles.mobileLink}
                  onClick={() => setOpen(false)}
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#recursos"
                className={styles.mobileCta}
                onClick={() => setOpen(false)}
              >
                Recursos →
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
