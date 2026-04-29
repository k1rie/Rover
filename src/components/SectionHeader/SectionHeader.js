"use client";

import { motion } from "framer-motion";
import styles from "./SectionHeader.module.css";

export default function SectionHeader({
  eyebrow,
  title,
  description,
  align = "left",
  id,
}) {
  return (
    <div
      id={id}
      className={`${styles.wrap} ${align === "center" ? styles.center : ""}`}
    >
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="eyebrow"
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
        className={`headline ${styles.title}`}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.12 }}
          className={`body-lg ${styles.desc}`}
        >
          {description}
        </motion.p>
      )}
    </div>
  );
}
