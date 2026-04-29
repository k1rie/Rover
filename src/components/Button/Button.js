"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import styles from "./Button.module.css";

export default function Button({
  children,
  href,
  variant = "primary",
  icon = true,
  external = false,
  onClick,
  ariaLabel,
}) {
  const className = `${styles.btn} ${styles[variant]}`;

  const content = (
    <>
      <span>{children}</span>
      {icon && (
        <ArrowRight
          size={16}
          strokeWidth={2.2}
          className={styles.icon}
          aria-hidden="true"
        />
      )}
    </>
  );

  if (href) {
    if (external || href.startsWith("http") || href.startsWith("#")) {
      return (
        <a
          href={href}
          className={className}
          aria-label={ariaLabel}
          target={external ? "_blank" : undefined}
          rel={external ? "noreferrer" : undefined}
        >
          {content}
        </a>
      );
    }
    return (
      <Link href={href} className={className} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  return (
    <button
      className={className}
      onClick={onClick}
      aria-label={ariaLabel}
      type="button"
    >
      {content}
    </button>
  );
}
