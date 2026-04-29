"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, animate } from "framer-motion";
import styles from "./Stat.module.css";

/**
 * Stat — métrica numérica grande con animación de contador.
 * Cuando el componente entra al viewport, el número cuenta de 0 hasta
 * su valor final con easing suave. Si el valor no es numérico (ej. "1:10"),
 * se muestra tal cual sin animar.
 */
export default function Stat({ value, label, suffix = "", index = 0 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [display, setDisplay] = useState("0");

  // Detectar si el valor es un número parseable (ej. "6", "45")
  // o si tiene caracteres no-numéricos (ej. "1:10")
  const numericValue = parseFloat(value);
  const isNumeric =
    !isNaN(numericValue) &&
    isFinite(numericValue) &&
    /^[\d.,]+$/.test(String(value).trim());

  useEffect(() => {
    if (!inView) return;

    if (!isNumeric) {
      setDisplay(value);
      return;
    }

    const isInt = Number.isInteger(numericValue);
    const controls = animate(0, numericValue, {
      duration: 1.4,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => {
        setDisplay(isInt ? Math.round(v).toString() : v.toFixed(1));
      },
    });

    return () => controls.stop();
  }, [inView, isNumeric, numericValue, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.7,
        delay: index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={styles.stat}
    >
      <p className={styles.value}>
        {display}
        {suffix && <span className={styles.suffix}>{suffix}</span>}
      </p>
      <p className={styles.label}>{label}</p>
    </motion.div>
  );
}
