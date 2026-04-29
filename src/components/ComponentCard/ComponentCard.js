"use client";

import { motion } from "framer-motion";
import styles from "./ComponentCard.module.css";

export default function ComponentCard({
  name,
  category,
  qty,
  specs,
  description,
  image,
  index = 0,
  highlight = false,
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 36, rotateX: 8 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.7,
        delay: Math.min(index * 0.08, 0.5),
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`${styles.card} ${highlight ? styles.highlight : ""}`}
    >
      <div className={styles.media}>
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={name} loading="lazy" />
        ) : (
          <div className={styles.placeholder}>
            <span className={styles.placeholderTag}>{category}</span>
          </div>
        )}
        {qty != null && <span className={styles.qty}>×{qty}</span>}
      </div>

      <div className={styles.body}>
        <p className={styles.cat}>{category}</p>
        <h3 className={styles.name}>{name}</h3>
        {description && <p className={styles.desc}>{description}</p>}

        {specs && specs.length > 0 && (
          <ul className={styles.specs}>
            {specs.map((s) => (
              <li key={s.label} className={styles.spec}>
                <span className={styles.specLabel}>{s.label}</span>
                <span className={`${styles.specValue} mono`}>{s.value}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </motion.article>
  );
}
