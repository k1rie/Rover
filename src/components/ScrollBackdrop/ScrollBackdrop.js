"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./ScrollBackdrop.module.css";

/**
 * Backdrop ambiental ligado al scroll de la sección.
 * Orbe de luz suave que se desliza vertical y cambia opacidad mientras
 * el usuario hace scroll por la sección — da sensación de profundidad
 * sin distraer del contenido.
 *
 * Uso:
 *   <section ref={ref} ...>
 *     <ScrollBackdrop targetRef={ref} variant="white" />
 *     <div className="container">...</div>
 *   </section>
 *
 * Props:
 *   targetRef → ref del elemento al que se ata el scroll
 *   variant   → "white" (default) | "cool" (azul eléctrico) | "soft" (mínimo)
 *   position  → "center" (default) | "top" | "bottom" | "left" | "right"
 */
export default function ScrollBackdrop({
  targetRef,
  variant = "white",
  position = "center",
}) {
  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start end", "end start"],
  });

  // Movimiento vertical sutil mientras la sección pasa por el viewport
  const y = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const opacity = useTransform(
    scrollYProgress,
    [0, 0.25, 0.75, 1],
    [0, 1, 1, 0]
  );
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1.05, 0.95]);

  return (
    <motion.div
      style={{ y, opacity, scale }}
      className={`${styles.orb} ${styles[`v_${variant}`]} ${
        styles[`p_${position}`]
      }`}
      aria-hidden="true"
    />
  );
}
