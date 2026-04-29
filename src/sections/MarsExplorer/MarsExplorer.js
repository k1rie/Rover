"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import {
  Eye,
  Cpu,
  Mountain,
  Cog,
  BatteryCharging,
} from "lucide-react";
import styles from "./MarsExplorer.module.css";

/**
 * Showcase inmersivo del rover y sus subsistemas.
 *
 * Outer section es ~500vh para dar espacio al scroll.
 * Inner stage es sticky 100vh — fondo dark studio limpio + spotlight
 * platform circular que pulsa, rover centrado con rotación turntable
 * continua, y 5 cards flotantes con backdrop-blur que aparecen en
 * secuencia mientras el usuario scrollea.
 */

const cards = [
  {
    id: "vision",
    icon: Eye,
    title: "Subsistema de percepción",
    spec: "HC-SR04 · 5 V",
    body: "Sensor ultrasónico montado al frente del chasis. Mide la distancia al suelo mediante pulsos acústicos. Permite implementar paro automático ante huecos o desniveles que excedan un umbral configurable.",
    pos: "top-left",
    range: [0.05, 0.15, 0.30, 0.40],
  },
  {
    id: "brain",
    icon: Cpu,
    title: "Unidad de control",
    spec: "ESP32 · WiFi dual",
    body: "El microcontrolador recibe comandos JSON por una interfaz HTTP, ejecuta la mezcla diferencial de velocidades y genera las señales PWM a 1 kHz que controlan los seis motores.",
    pos: "top-right",
    range: [0.18, 0.28, 0.43, 0.53],
  },
  {
    id: "suspension",
    icon: Mountain,
    title: "Suspensión Rocker-Bogie",
    spec: "Pasiva · 6 puntos de contacto",
    body: "Mecanismo de articulación pasivo que mantiene los seis puntos de apoyo en contacto con el suelo simultáneamente. Permite franquear obstáculos de altura igual al doble del diámetro de la rueda.",
    pos: "bottom-left",
    range: [0.32, 0.42, 0.57, 0.67],
  },
  {
    id: "traction",
    icon: Cog,
    title: "Sistema de tracción",
    spec: "JGA25-370 · 12 V · 16 RPM",
    body: "Seis motorreductores con caja de engranajes metálicos. La relación de transmisión privilegia el par motor sobre la velocidad lineal, reduciendo impactos dinámicos al superar pendientes.",
    pos: "bottom-right",
    range: [0.46, 0.56, 0.71, 0.81],
  },
  {
    id: "power",
    icon: BatteryCharging,
    title: "Alimentación dual",
    spec: "3 × 18650 · 11.1 V",
    body: "Las baterías de iones de litio alimentan los motores directamente. Un regulador reductor independiente provee 5 V a la lógica y a los servos, evitando caídas de tensión por demanda transitoria de corriente.",
    pos: "center-top",
    range: [0.60, 0.70, 0.85, 0.95],
  },
];

export default function MarsExplorer() {
  const reduce = useReducedMotion();
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 28,
    mass: 0.5,
  });
  const progress = reduce ? scrollYProgress : smooth;

  // Rover transforms — más sutiles ahora, dejamos al turntable la rotación
  const roverScale = useTransform(progress, [0, 0.4, 0.85, 1], [0.85, 1.0, 1.0, 0.92]);
  const roverY = useTransform(progress, [0, 1], [10, -10]);

  // Title fade
  const titleOpacity = useTransform(progress, [0, 0.05, 0.15], [1, 1, 0]);
  const titleY = useTransform(progress, [0, 0.15], [0, -40]);

  // Outro
  const outroOpacity = useTransform(progress, [0.85, 0.95, 1], [0, 1, 1]);
  const outroY = useTransform(progress, [0.85, 1], [40, 0]);

  // Particles drift horizontal con scroll — sustituye al dust de dunas
  const particleX = useTransform(progress, [0, 1], ["0%", "-20%"]);

  // Stage platform pulse opacity — sutil intensifica con scroll medio
  const platformOpacity = useTransform(progress, [0, 0.1, 0.9, 1], [0, 1, 1, 0.4]);

  // Progress bar
  const progressBarWidth = useTransform(progress, [0, 1], ["0%", "100%"]);

  return (
    <section
      ref={containerRef}
      className={styles.section}
      aria-label="Showcase de subsistemas del rover"
    >
      <div className={styles.sticky}>
        {/* Studio background — gradiente vertical limpio */}
        <div className={styles.studioBg} aria-hidden="true" />
        <div className={`grid-bg ${styles.grid}`} aria-hidden="true" />

        {/* Particles drifting (reemplaza al sun/stars/dunes) */}
        <motion.div
          style={{ x: particleX }}
          className={styles.particles}
          aria-hidden="true"
        >
          {Array.from({ length: 20 }).map((_, i) => (
            <span
              key={i}
              style={{
                left: `${(i * 17) % 100}%`,
                top: `${(i * 31) % 100}%`,
                animationDelay: `${(i % 7) * 0.4}s`,
              }}
            />
          ))}
        </motion.div>

        {/* Stage platform — spotlight pool circular debajo del rover */}
        <motion.div
          style={{ opacity: platformOpacity }}
          className={styles.stagePlatform}
          aria-hidden="true"
        >
          <div className={styles.platformCore} />
          <div className={styles.platformRing} />
          <div className={styles.platformRingFar} />
        </motion.div>

        {/* Title (fades out as scroll begins) */}
        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className={styles.titleBlock}
        >
          <p className="eyebrow">02 · Subsistemas</p>
          <h2 className={`headline ${styles.title}`}>
            Subsistemas funcionales del prototipo.
          </h2>
          <p className={`body-lg ${styles.titleBody}`}>
            El rover está compuesto por cinco subsistemas que operan de
            manera coordinada. A continuación se describen en orden de
            actuación durante un ciclo de operación.
          </p>
        </motion.div>

        {/* Rover — protagonista con turntable continuo
            (envuelto en un contenedor con place-items para que el
             centrado lo haga el padre vía grid, no vía transform —
             así motion puede aplicar scale/y sin pelear con el
             translate(-50%, -50%)). */}
        <div className={styles.roverContainer}>
          <motion.div
            style={{ scale: roverScale, y: roverY }}
            className={styles.roverStage}
          >
            <motion.div
              animate={
                reduce
                  ? undefined
                  : { rotateY: [0, 5, 0, -5, 0] }
              }
              transition={{
                duration: 16,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className={styles.roverTurntable}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/assets/mars/rover-specimen.png"
                alt="Rover Rocker-Bogie en exhibición"
                className={styles.roverImg}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* Floating cards */}
        <div className={styles.cardLayer}>
          {cards.map((c, i) => (
            <FloatingCard key={c.id} card={c} progress={progress} index={i} />
          ))}
        </div>

        {/* Outro */}
        <motion.div
          style={{ opacity: outroOpacity, y: outroY }}
          className={styles.outro}
        >
          <p className="eyebrow">Continúa</p>
          <h3 className={styles.outroTitle}>
            A continuación se detallan los principios físicos, los
            componentes y la implementación del firmware.
          </h3>
        </motion.div>

        {/* Progress bar */}
        <div className={styles.progressTrack} aria-hidden="true">
          <motion.div
            style={{ width: progressBarWidth }}
            className={styles.progressFill}
          />
        </div>
      </div>

      {/* ─── Snap targets — uno por card + intro y outro ───
        Cada punto está al pico de visibilidad del subsistema correspondiente,
        para que el scroll se asiente naturalmente en cada explicación. */}
      {[8, 22, 37, 52, 67, 82, 95].map((pct, i) => (
        <div
          key={`snap-${i}`}
          aria-hidden="true"
          className={styles.snapTarget}
          style={{ top: `${pct}%` }}
        />
      ))}
    </section>
  );
}

function FloatingCard({ card, progress, index }) {
  const [a, b, c, d] = card.range;
  const opacity = useTransform(progress, [a, b, c, d], [0, 1, 1, 0]);
  const y = useTransform(progress, [a, b, c, d], [40, 0, 0, -40]);
  const scale = useTransform(progress, [a, b, c, d], [0.92, 1, 1, 0.96]);
  const blur = useTransform(progress, [a, b, c, d], [8, 0, 0, 8]);
  const filter = useTransform(blur, (v) => `blur(${v}px)`);

  return (
    <motion.article
      style={{ opacity, y, scale, filter }}
      className={`${styles.card} ${styles[`pos_${card.pos.replace("-", "_")}`]}`}
      role="figure"
      aria-label={card.title}
    >
      <header className={styles.cardHead}>
        <div className={styles.cardIcon} aria-hidden="true">
          <card.icon size={18} strokeWidth={1.6} />
        </div>
        <span className={`mono ${styles.cardIndex}`}>
          {String(index + 1).padStart(2, "0")} / {String(5).padStart(2, "0")}
        </span>
      </header>
      <h3 className={styles.cardTitle}>{card.title}</h3>
      <p className={`mono ${styles.cardSpec}`}>{card.spec}</p>
      <p className={styles.cardBody}>{card.body}</p>
      <span className={styles.cardLine} aria-hidden="true" />
    </motion.article>
  );
}
