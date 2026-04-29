"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import SectionHeader from "@/components/SectionHeader/SectionHeader";
import ScrollBackdrop from "@/components/ScrollBackdrop/ScrollBackdrop";
import Stat from "@/components/Stat/Stat";
import styles from "./Introduction.module.css";

const stats = [
  { value: "6", suffix: "", label: "Ruedas direccionales" },
  { value: "1:10", suffix: "", label: "Escala respecto al Curiosity" },
  { value: "45", suffix: "°", label: "Inclinación lateral máxima" },
  { value: "2×", suffix: "", label: "Tamaño máximo de obstáculo (vs. rueda)" },
];

const milestones = [
  { year: "1970", name: "Lunokhod 1", note: "Primer rover lunar (URSS)." },
  { year: "1997", name: "Sojourner", note: "Primer rover marciano (NASA)." },
  { year: "2012", name: "Curiosity", note: "Misión MSL · referencia teórica del estudio." },
  { year: "2026", name: "Prototipo UNACH", note: "Implementación a escala 1:10 con fines educativos." },
];

export default function Introduction() {
  const sectionRef = useRef(null);

  return (
    <section
      id="introduccion"
      ref={sectionRef}
      className={`section ${styles.section}`}
    >
      <ScrollBackdrop targetRef={sectionRef} variant="white" position="top" />
      <div className={`container ${styles.container}`}>
        <SectionHeader
          eyebrow="01 · Introducción"
          title="Antecedentes de la robótica de exploración."
          description="La robótica móvil aplicada a exploración planetaria tiene casi seis décadas de evolución desde el Lunokhod 1 hasta el Perseverance. Este proyecto se inscribe en esa línea histórica: estudia los principios cinemáticos del Rocker-Bogie y los implementa en un prototipo educativo de bajo costo, replicable en un contexto académico."
        />

        <div className={styles.statsGrid}>
          {stats.map((s, i) => (
            <Stat
              key={s.label}
              value={s.value}
              suffix={s.suffix}
              label={s.label}
              index={i}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className={styles.timeline}
        >
          <p className={styles.timelineEyebrow}>
            <span className="eyebrow">Línea cronológica</span>
          </p>
          <div className={styles.line}>
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className={`${styles.node} ${
                  i === milestones.length - 1 ? styles.nodeCurrent : ""
                }`}
              >
                <div className={styles.nodeDot} aria-hidden="true" />
                <p className={`mono ${styles.nodeYear}`}>{m.year}</p>
                <p className={styles.nodeName}>{m.name}</p>
                <p className={styles.nodeNote}>{m.note}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
