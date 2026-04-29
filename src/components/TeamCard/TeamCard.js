"use client";

import { motion } from "framer-motion";
import styles from "./TeamCard.module.css";

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

export default function TeamCard({ name, role, index = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className={styles.card}
    >
      <div className={styles.avatar} aria-hidden="true">
        <span>{initials(name)}</span>
      </div>
      <div className={styles.info}>
        <p className={styles.name}>{name}</p>
        <p className={styles.role}>{role}</p>
      </div>
    </motion.div>
  );
}
