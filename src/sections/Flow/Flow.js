"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
} from "framer-motion";
import {
  Power,
  Cog,
  Wifi,
  Radio,
  Calculator,
  Ruler,
  AlertTriangle,
  Play,
} from "lucide-react";
import SectionHeader from "@/components/SectionHeader/SectionHeader";
import ScrollBackdrop from "@/components/ScrollBackdrop/ScrollBackdrop";
import styles from "./Flow.module.css";

const flow = [
  {
    icon: Power,
    title: "Energización del sistema",
    note: "Se aplica la alimentación dual; el LED de estado se enciende en blanco.",
    type: "start",
  },
  {
    icon: Cog,
    title: "Inicialización de periféricos",
    note: "Los pines de motor se configuran en estado de reposo; los del sensor en modo lectura.",
  },
  {
    icon: Wifi,
    title: "¿Conexión WiFi exitosa?",
    note: "Intento secuencial: red primaria, luego red de respaldo. El LED reporta el resultado.",
    type: "decision",
  },
  {
    icon: Radio,
    title: "Servidor HTTP en escucha",
    note: "Endpoint /controller queda disponible para recibir comandos.",
  },
  {
    icon: Radio,
    title: "Recepción de comando",
    note: "Mensaje JSON { axes: [throttle, steer] } por método POST.",
  },
  {
    icon: Calculator,
    title: "Cálculo de la mezcla diferencial",
    note: "velIzq = throttle + steer · velDer = throttle − steer.",
  },
  {
    icon: Ruler,
    title: "Lectura del sensor frontal",
    note: "Pulso de Trigger de 10 µs; tiempo de Echo en µs convertido a cm.",
  },
  {
    icon: AlertTriangle,
    title: "¿La distancia supera el umbral?",
    note: "Si la distancia frontal indica un hueco, se ejecuta paro de seguridad.",
    type: "decision",
  },
  {
    icon: Play,
    title: "Aplicación de PWM a los motores",
    note: "Señales PWM a 1 kHz hacia los drivers. El sistema retorna a la espera del siguiente comando.",
    type: "loop",
  },
];

export default function Flow() {
  const sectionRef = useRef(null);
  const flowRef = useRef(null);

  // Scroll progress ligado al contenedor del flujo (no a toda la sección),
  // para que el highlight avance exactamente conforme el usuario scrollea
  // sobre los pasos.
  const { scrollYProgress } = useScroll({
    target: flowRef,
    offset: ["start 70%", "end 30%"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    mass: 0.4,
  });

  // Línea que se va llenando vertical mientras scrollea
  const lineHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="flujo" ref={sectionRef} className={`section ${styles.section}`}>
      <ScrollBackdrop targetRef={sectionRef} variant="white" position="left" />
      <ScrollBackdrop targetRef={sectionRef} variant="cool" position="right" />

      <div className={`container ${styles.container}`}>
        <SectionHeader
          eyebrow="08 · Diagrama de bloques"
          title="Flujo de operación del firmware."
          description="El programa se modela como una máquina de estados secuencial. Los rectángulos representan acciones; los rombos, decisiones. La operación normal sigue el ciclo: inicialización → conexión → recepción de comando → procesamiento → percepción → actuación."
        />

        <div ref={flowRef} className={styles.flow}>
          {/* Línea vertical que se "llena" con el scroll */}
          <div className={styles.trackBg} aria-hidden="true" />
          <motion.div
            style={{ height: lineHeight }}
            className={styles.trackFill}
            aria-hidden="true"
          />

          {flow.map((step, i) => (
            <Row
              key={i}
              step={step}
              index={i}
              total={flow.length}
              progress={smoothProgress}
            />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className={styles.legend}
        >
          <div className={styles.legendItem}>
            <span className={`${styles.legendBox} ${styles.row_start}`} />
            <span>Inicio</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendBox} ${styles.row_decision}`} />
            <span>Decisión</span>
          </div>
          <div className={styles.legendItem}>
            <span className={`${styles.legendBox} ${styles.row_loop}`} />
            <span>Bucle / Acción</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Row({ step, index, total, progress }) {
  const start = index / total;
  const peak = (index + 0.5) / total;
  const end = (index + 1) / total;

  // Iluminación de fila ligada al scroll — más brillante en su pico
  const activeStrength = useTransform(
    progress,
    [start, peak, end],
    [0, 1, 0.35]
  );

  // Borde ilumina cuando esta fila es la "activa"
  const borderOpacity = useTransform(activeStrength, (v) => 0.08 + v * 0.45);
  const glowOpacity = useTransform(activeStrength, (v) => v * 0.25);
  const dotOpacity = useTransform(activeStrength, (v) => 0.3 + v * 0.7);

  return (
    <motion.div
      initial={{ opacity: 0, x: -24 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.55,
        delay: Math.min(index * 0.05, 0.4),
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`${styles.row} ${
        step.type ? styles[`row_${step.type}`] : ""
      }`}
    >
      {/* Glow de fila activa (escalado por scroll) */}
      <motion.span
        style={{ opacity: glowOpacity }}
        className={styles.rowGlow}
        aria-hidden="true"
      />
      <motion.span
        style={{
          borderColor: useTransform(
            borderOpacity,
            (v) => `rgba(255, 255, 255, ${v})`
          ),
        }}
        className={styles.rowBorder}
        aria-hidden="true"
      />

      {/* Punto en la línea, brilla al pasar */}
      <motion.span
        style={{ opacity: dotOpacity }}
        className={styles.trackDot}
        aria-hidden="true"
      />

      <div className={styles.iconWrap} aria-hidden="true">
        <step.icon size={18} strokeWidth={1.6} />
      </div>
      <div className={styles.body}>
        <p className={styles.title}>{step.title}</p>
        <p className={styles.note}>{step.note}</p>
      </div>
      <span className={`mono ${styles.idx}`}>
        {String(index + 1).padStart(2, "0")}
      </span>
    </motion.div>
  );
}
