"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import Button from "@/components/Button/Button";
import styles from "./Hero.module.css";

const fade = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
});

export default function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);
  const roverRef = useRef(null);

  /* Scroll #1 — ligado a la SECCIÓN entera. Lo usamos para el parallax
   * del título y el polvo ambiental: 0 cuando la sección entra, 1 cuando
   * sale por arriba. */
  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  /* Scroll #2 — ligado a la IMAGEN del rover. Con offset
   * ["start end", "end start"]:
   *    progress = 0    → rover acaba de entrar por abajo del viewport
   *    progress = 0.5  → rover está centrado verticalmente en pantalla ⭐
   *    progress = 1    → rover acaba de salir por arriba del viewport
   * Entonces peak de scale + rotación EN 0.5 = rover gigante en el centro. */
  const { scrollYProgress: roverProgress } = useScroll({
    target: roverRef,
    offset: ["start end", "end start"],
  });

  // Suavizado de ambos progresos con spring
  const sectionSmooth = useSpring(sectionProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.4,
  });
  const roverSmooth = useSpring(roverProgress, {
    stiffness: 130,
    damping: 28,
    mass: 0.45,
  });

  // ─── Transforms del rover (peak at center) ───
  const roverScale = useTransform(
    reduce ? roverProgress : roverSmooth,
    [0, 0.5, 1],
    [0.78, 1.18, 0.85]
  );
  const roverRotateY = useTransform(
    reduce ? roverProgress : roverSmooth,
    [0, 0.5, 1],
    [-9, 0, 9]
  );
  // Sutil flotación vertical — sube ligeramente al pasar por el centro
  const roverY = useTransform(
    reduce ? roverProgress : roverSmooth,
    [0, 0.5, 1],
    [20, 0, -20]
  );

  // ─── Transforms del título y ambiente (ligados a la sección) ───
  const titleY = useTransform(sectionSmooth, [0, 1], [0, -120]);
  const titleOpacity = useTransform(sectionSmooth, [0, 0.6, 1], [1, 0.6, 0]);
  const dustOpacity = useTransform(sectionSmooth, [0, 1], [0.0, 0.45]);

  return (
    <section id="top" ref={sectionRef} className={styles.hero}>
      <div className={styles.bgGradient} aria-hidden="true" />
      <div className={`grid-bg ${styles.grid}`} aria-hidden="true" />
      <motion.div
        style={{ opacity: dustOpacity }}
        className={styles.marsDust}
        aria-hidden="true"
      />

      <div className={`container ${styles.inner}`}>
        <motion.div style={{ y: titleY, opacity: titleOpacity }}>
          <motion.div {...fade(0.05)} className={styles.eyebrowRow}>
            <span className={styles.statusDot} aria-hidden="true" />
            <span className={styles.eyebrow}>
              UNACH · 2° Semestre · Electricidad y Electrónica
            </span>
          </motion.div>

          <motion.h1 {...fade(0.15)} className={`display ${styles.title}`}>
            Estudio de un rover
            <br />
            <span className={styles.titleAccent}>Rocker-Bogie a escala.</span>
          </motion.h1>

          <motion.p {...fade(0.3)} className={`body-lg ${styles.subtitle}`}>
            Proyecto integrador del curso de Electricidad y Electrónica. El
            prototipo, a escala 1:10 del Rover{" "}
            <em className={styles.em}>Curiosity</em> de la NASA, permite
            estudiar la suspensión pasiva Rocker-Bogie, la tracción
            holonómica con seis ruedas direccionales y la implementación de
            un sistema de control inalámbrico sobre ESP32.
          </motion.p>

          <motion.div {...fade(0.45)} className={styles.cta}>
            <Button href="#funcionamiento" variant="accent">
              Ver el proyecto
            </Button>
            <Button href="#codigo" variant="ghost">
              Revisar el código
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          ref={roverRef}
          style={{ y: roverY }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className={styles.roverStage}
        >
          <div className={styles.roverGlow} aria-hidden="true" />
          <motion.img
            src="/assets/hero/rover-hero.png"
            alt="Rover holonómico Rocker-Bogie"
            style={{ scale: roverScale, rotateY: roverRotateY }}
            className={styles.roverImg}
          />

          <div className={styles.statRow} aria-hidden="true">
            <div className={styles.statCell}>
              <p className={`mono ${styles.statVal}`}>6</p>
              <p className={styles.statLabel}>Ruedas direccionales</p>
            </div>
            <div className={styles.statCell}>
              <p className={`mono ${styles.statVal}`}>HC-SR04</p>
              <p className={styles.statLabel}>Sensor de proximidad</p>
            </div>
            <div className={styles.statCell}>
              <p className={`mono ${styles.statVal}`}>ESP32</p>
              <p className={styles.statLabel}>Unidad de control</p>
            </div>
            <div className={styles.statCell}>
              <p className={`mono ${styles.statVal}`}>1:10</p>
              <p className={styles.statLabel}>Escala respecto al Curiosity</p>
            </div>
          </div>
        </motion.div>

        <motion.div {...fade(0.7)} className={styles.scrollHint}>
          <span>Desliza para explorar</span>
          <span className={styles.scrollLine} aria-hidden="true" />
        </motion.div>
      </div>
    </section>
  );
}
