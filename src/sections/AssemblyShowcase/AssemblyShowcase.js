"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
} from "framer-motion";
import styles from "./AssemblyShowcase.module.css";

/**
 * Sección de ensamblaje progresivo del rover, controlado por scroll.
 *
 * Cómo funciona:
 *   - Outer section es muy alta (1100vh = 11 viewports)
 *   - Inner stage es position: sticky → permanece fijo mientras se scrollea
 *   - 10 etapas, cada una con su rango de opacity en el scrollYProgress
 *   - Cross-fade suave entre etapas + sutil zoom + parallax del fondo
 *   - Caption + progress dot indicator a la derecha
 *
 * Para que funcione necesitas las imágenes en
 *   public/assets/assembly/stage-01-chasis.png ... stage-10-final.png
 *
 * Si las imágenes no existen aún, la sección renderiza un placeholder
 * con outline de cada etapa (no rompe el layout).
 */

const stages = [
  {
    id: 1,
    titulo: "Chasís",
    descripcion: "Cuerpo principal del prototipo. Aloja en su cavidad central los componentes electrónicos y la batería. Constituye el punto de anclaje del sistema de suspensión.",
    spec: "140 × 102 × 73 mm · PLA",
    posicion: "Centro · plataforma estructural",
    img: "/assets/assembly/01-chasis.png",
  },
  {
    id: 2,
    titulo: "Brazo Rocker",
    descripcion: "Eslabón principal de la suspensión Rocker-Bogie. Vincula el chasís con el bogie y permite el primer grado de libertad de la articulación pasiva.",
    spec: "305.1 mm · pivote ø 3.2 mm · ×2",
    posicion: "Costados izquierdo y derecho del chasís",
    img: "/assets/assembly/02-brazo.png",
  },
  {
    id: 3,
    titulo: "Pivote Bogie",
    descripcion: "Articulación entre el brazo Rocker y los soportes de motor. Es responsable de la capacidad de franqueo: permite superar obstáculos de altura hasta el doble del diámetro de la rueda.",
    spec: "Apertura 123.2 mm · 27 mm espesor · ×2",
    posicion: "Extremos delanteros de cada brazo",
    img: "/assets/assembly/03-pivote.png",
  },
  {
    id: 4,
    titulo: "Barra diferencial",
    descripcion: "Barra horizontal central que vincula ambos Rockers. Es el componente clave de la cinemática: transmite la mitad del desplazamiento angular para mantener el chasís nivelado.",
    spec: "183 mm · pivote ø 3.2 mm",
    posicion: "Sobre el chasís, en posición central",
    img: "/assets/assembly/04-barra.png",
  },
  {
    id: 5,
    titulo: "Enlace diferencial",
    descripcion: "Eslabón que conecta cada extremo de la barra diferencial con su Rocker correspondiente. Transmite el desplazamiento angular del mecanismo diferencial.",
    spec: "ø 3.2 mm · ×2",
    posicion: "Extremos de la barra diferencial",
    img: "/assets/assembly/05-enlace.png",
  },
  {
    id: 6,
    titulo: "Soporte de motor",
    descripcion: "Pieza estructural en forma de L que aloja el motorreductor JGA25-370. Se fija a brazos y pivotes mediante tornillería M3.",
    spec: "PLA · ×6",
    posicion: "Una por rueda (4 esquinas + 2 centrales)",
    img: "/assets/assembly/06-soporte.png",
  },
  {
    id: 7,
    titulo: "Adaptador de acoplamiento",
    descripcion: "Pieza intermedia entre el eje del motor y el rin. Reduce holguras mecánicas y permite intercambiar el tipo de rin (estándar o hexagonal).",
    spec: "PLA · ×6 · tornillería M3",
    posicion: "Acoplado al eje de cada motor",
    img: "/assets/assembly/07-adaptador.png",
  },
  {
    id: 8,
    titulo: "Rin",
    descripcion: "Estructura radial con ocho rayos curvos. Se acopla al adaptador del motor o, en su versión hexagonal, a un cubo de 12 mm.",
    spec: "ø 40 mm · 26 mm espesor · ×6",
    posicion: "Sobre cada adaptador",
    img: "/assets/assembly/08-rin.png",
  },
  {
    id: 9,
    titulo: "Neumático",
    descripcion: "Banda exterior con perfil de relieve vertical. Su geometría aumenta el coeficiente de fricción sobre superficies irregulares y mejora el agarre en pendientes.",
    spec: "ø 50 mm · ancho 40 mm · ×6",
    posicion: "Sobre cada rin",
    img: "/assets/assembly/09-neumatico.png",
  },
  {
    id: 10,
    titulo: "Prototipo ensamblado",
    descripcion: "Sistema mecánico completo con la electrónica integrada: microcontrolador ESP32, drivers BTS7960, regulador UBEC, batería de iones de litio y sensor HC-SR04.",
    spec: "WiFi · 6 motores · 4 servos · sensor frontal",
    posicion: "Sistema completo",
    img: "/assets/assembly/10-final.png",
  },
];

const TOTAL = stages.length;

export default function AssemblyShowcase() {
  const reduce = useReducedMotion();
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const smooth = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 28,
    mass: 0.5,
  });
  const progress = reduce ? scrollYProgress : smooth;

  // Background gradient shift de azul frío → naranja cálido conforme avanza
  const bgHue = useTransform(progress, [0, 1], [220, 25]);
  const bgGlow = useTransform(progress, (v) =>
    `radial-gradient(ellipse 60% 40% at 50% 70%,
       hsla(${bgHue.get()}, 70%, 35%, 0.18) 0%,
       transparent 70%)`
  );

  // Progress bar pinned bottom
  const progressBarWidth = useTransform(progress, [0, 1], ["0%", "100%"]);

  // Stage counter (1..10) animado
  const stageIndex = useTransform(progress, (v) => {
    const idx = Math.min(TOTAL - 1, Math.floor(v * TOTAL));
    return idx;
  });

  // Sutil parallax del título lateral
  const headerY = useTransform(progress, [0, 1], [0, -100]);
  const headerOpacity = useTransform(progress, [0, 0.05, 0.95, 1], [1, 1, 1, 0.4]);

  return (
    <section
      id="ensamblaje"
      ref={sectionRef}
      className={styles.section}
      aria-label="Ensamblaje progresivo del rover"
    >
      <div className={styles.sticky}>
        {/* Fondo dinámico */}
        <motion.div
          style={{ background: bgGlow }}
          className={styles.bgGlow}
          aria-hidden="true"
        />
        <div className={`grid-bg ${styles.grid}`} aria-hidden="true" />

        {/* Header lateral con título y descripción */}
        <motion.aside
          style={{ y: headerY, opacity: headerOpacity }}
          className={styles.header}
        >
          <p className="eyebrow">04 · Componentes estructurales</p>
          <h2 className={`headline ${styles.title}`}>
            Componentes mecánicos<br />
            <span className={styles.titleAccent}>del prototipo.</span>
          </h2>
          <p className={`body ${styles.subtitle}`}>
            La estructura del prototipo se obtiene mediante manufactura
            aditiva (impresión 3D en PLA y PETG). A continuación se describe
            cada pieza con su función dentro del conjunto y sus dimensiones
            principales.
          </p>
        </motion.aside>

        {/* Stage area — todas las imágenes apiladas */}
        <div className={styles.stage}>
          {stages.map((s, i) => {
            // Cada etapa visible en su slot de scroll
            const start = i / TOTAL;
            const peak1 = (i + 0.15) / TOTAL;
            const peak2 = (i + 0.85) / TOTAL;
            const end = (i + 1) / TOTAL;

            return (
              <Stage
                key={s.id}
                stage={s}
                progress={progress}
                range={[start, peak1, peak2, end]}
                isLast={i === TOTAL - 1}
              />
            );
          })}
        </div>

        {/* Indicador de progreso lateral */}
        <div className={styles.progressDots} aria-hidden="true">
          {stages.map((s, i) => (
            <ProgressDot
              key={s.id}
              index={i}
              total={TOTAL}
              progress={progress}
              label={s.titulo}
            />
          ))}
        </div>

        {/* Barra de progreso fina al fondo */}
        <div className={styles.progressTrack} aria-hidden="true">
          <motion.div
            style={{ width: progressBarWidth }}
            className={styles.progressFill}
          />
        </div>
      </div>

      {/* ─── Snap targets — invisibles, uno por etapa ───
        Posicionados al PUNTO ÓPTIMO de visualización de cada pieza
        (50% de su rango de scroll, donde la pieza está totalmente
        visible y el caption legible). El navegador hace snap suave
        cuando el usuario se detiene cerca. */}
      {stages.map((_, i) => (
        <div
          key={`snap-${i}`}
          aria-hidden="true"
          className={styles.snapTarget}
          style={{ top: `${i * (100 / TOTAL) + 50 / TOTAL}%` }}
        />
      ))}
    </section>
  );
}

function Stage({ stage, progress, range, isLast }) {
  const [a, b, c, d] = range;

  // ─── Animación de entrada cinematográfica ───
  // peakIn: punto de overshoot al 70% del recorrido entre a y b
  // (estrictamente entre los dos para que useTransform sea monotónico).
  const peakIn = a + 0.7 * (b - a);

  // Opacidad — directa de a a b para evitar caption-bug
  const opacity = useTransform(progress, [a, b, c, d], [0, 1, 1, 0]);

  // Escala con overshoot suave en peakIn (efecto resorte)
  const scale = useTransform(
    progress,
    [a, peakIn, b, c, d],
    [0.6, 1.05, 1.0, 1.0, 0.94]
  );

  const enterRotateY = useTransform(progress, [a, b, c, d], [-22, 0, 0, 18]);
  const enterRotateX = useTransform(progress, [a, b, c, d], [12, 0, 0, -6]);
  const y = useTransform(progress, [a, b, c, d], [100, 0, 0, -50]);

  // Blur en la entrada — efecto de "cámara enfocando"
  const blur = useTransform(progress, [a, b, c, d], [20, 0, 0, 6]);
  const filter = useTransform(blur, (v) => `blur(${v.toFixed(2)}px)`);

  // Glow del piso intensifica cuando la pieza ya está clara
  const glowIntensity = useTransform(progress, [a, b, c, d], [0, 1, 1, 0]);

  // Caption — sigue exactamente al piece, fade simple sin peak intermedio
  const captionOpacity = useTransform(progress, [a, b, c, d], [0, 1, 1, 0]);
  const captionY = useTransform(progress, [a, b], [30, 0]);

  return (
    <>
      {/* Glow ambiental detrás */}
      <motion.div
        style={{ opacity: glowIntensity }}
        className={styles.stageGlow}
        aria-hidden="true"
      />

      {/* Pieza con entrada dramática + turntable continuo */}
      <motion.div
        style={{ opacity, scale, y, rotateX: enterRotateX, filter }}
        className={styles.stageImg}
      >
        <motion.div
          style={{ rotateY: enterRotateY }}
          className={styles.partWrapper}
        >
          <motion.div
            animate={{ rotateY: [0, 6, 0, -6, 0] }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={styles.partTurntable}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={stage.img}
              alt={stage.titulo}
              className={styles.img}
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.nextElementSibling.style.display = "flex";
              }}
            />
            <div className={styles.placeholder}>
              <p className={`mono ${styles.placeholderTag}`}>
                {String(stage.id).padStart(2, "0")} · {stage.titulo}
              </p>
              <p className={styles.placeholderHint}>
                Imagen pendiente — guarda en<br />
                <code>{stage.img}</code>
              </p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Caption con stage number, descripción y posición */}
      <motion.div
        style={{ opacity: captionOpacity, y: captionY }}
        className={styles.caption}
      >
        <div className={styles.captionInner}>
          <span className={`mono ${styles.captionStage}`}>
            {String(stage.id).padStart(2, "0")} / {String(TOTAL).padStart(2, "0")}
          </span>
          <h3 className={styles.captionTitle}>{stage.titulo}</h3>
          <p className={styles.captionDesc}>{stage.descripcion}</p>
          {stage.posicion && (
            <div className={styles.captionPos}>
              <span className={`mono ${styles.captionPosLabel}`}>
                Ubicación
              </span>
              <span className={styles.captionPosValue}>{stage.posicion}</span>
            </div>
          )}
          <p className={`mono ${styles.captionSpec}`}>{stage.spec}</p>
        </div>
      </motion.div>
    </>
  );
}

function ProgressDot({ index, total, progress, label }) {
  const start = index / total;
  const end = (index + 1) / total;
  const peak = (index + 0.5) / total;

  const dotScale = useTransform(progress, [start, peak, end], [1, 1.6, 1]);
  const dotOpacity = useTransform(progress, [start, peak, end], [0.3, 1, 0.5]);
  const lineOpacity = useTransform(progress, [start, peak], [0.2, 1]);
  const labelOpacity = useTransform(progress, [start, peak, end], [0, 1, 0]);
  const labelX = useTransform(progress, [start, peak], [10, 0]);

  return (
    <div className={styles.dotRow}>
      <motion.div
        style={{ scale: dotScale, opacity: dotOpacity }}
        className={styles.dot}
      />
      <motion.div
        style={{ opacity: lineOpacity }}
        className={styles.dotLine}
      />
      <motion.span
        style={{ opacity: labelOpacity, x: labelX }}
        className={styles.dotLabel}
      >
        {label}
      </motion.span>
    </div>
  );
}
