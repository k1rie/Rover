"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import {
  Layers,
  GitBranch,
  Move3D,
  Zap,
  Mountain,
  Compass,
} from "lucide-react";
import SectionHeader from "@/components/SectionHeader/SectionHeader";
import ScrollBackdrop from "@/components/ScrollBackdrop/ScrollBackdrop";
import styles from "./HowItWorks.module.css";

const principles = [
  {
    icon: Layers,
    title: "Mecanismo diferencial",
    body: "Cuando un brazo Rocker se eleva ante un obstáculo, el sistema diferencial transmite la mitad del desplazamiento angular al chasis. La plataforma de instrumentación se mantiene aproximadamente nivelada, propiedad descrita en la literatura como inclinación promedio.",
  },
  {
    icon: Mountain,
    title: "Capacidad de franqueo",
    body: "La articulación entre Rocker y Bogie permite superar pasivamente obstáculos de altura hasta el doble del diámetro de la rueda. El rover \"camina\" sobre el obstáculo aprovechando la fuerza normal generada por las ruedas posteriores.",
  },
  {
    icon: GitBranch,
    title: "Contacto continuo",
    body: "A diferencia de una suspensión rígida, el Rocker-Bogie mantiene los seis puntos de apoyo en contacto con el suelo de forma simultánea. Esta característica maximiza la fricción disponible para la tracción.",
  },
  {
    icon: Move3D,
    title: "Movimiento holonómico",
    body: "Mediante servomotores en las cuatro ruedas de las esquinas, el prototipo realiza giros sobre su propio eje (radio cero) y desplazamientos laterales. Resulta apto para entornos con restricciones de espacio.",
  },
  {
    icon: Compass,
    title: "Tracción diferencial",
    body: "Cada rueda es accionada por un motorreductor independiente. El microcontrolador calcula las velocidades de cada lado a partir de las componentes de avance y dirección del comando recibido (mezcla diferencial).",
  },
  {
    icon: Zap,
    title: "Relación par-velocidad",
    body: "Los motorreductores priorizan el par motor sobre la velocidad lineal. Esta característica se justifica porque el objetivo del prototipo es la exploración y no la velocidad: un movimiento lento y continuo evita esfuerzos dinámicos sobre la estructura impresa.",
  },
];

export default function HowItWorks() {
  const sectionRef = useRef(null);

  return (
    <section
      id="funcionamiento"
      ref={sectionRef}
      className={`section ${styles.section}`}
    >
      <ScrollBackdrop targetRef={sectionRef} variant="white" position="top" />
      <ScrollBackdrop
        targetRef={sectionRef}
        variant="cool"
        position="bottom"
      />

      <div className={`container ${styles.container}`}>
        <SectionHeader
          eyebrow="03 · Marco teórico"
          title="Principios físicos del sistema Rocker-Bogie."
          description="El sistema Rocker-Bogie es un mecanismo de suspensión pasiva utilizado en los rovers de exploración planetaria de la NASA. Su funcionamiento se fundamenta en la geometría de los eslabones y la distribución de masas, sin requerir actuadores adicionales para la suspensión. A continuación se exponen los seis principios que rigen su comportamiento."
        />

        <div className={styles.grid}>
          {principles.map((p, i) => (
            <motion.article
              key={p.title}
              initial={{ opacity: 0, y: 36, rotateX: 8 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.7,
                delay: Math.min(i * 0.08, 0.5),
                ease: [0.22, 1, 0.36, 1],
              }}
              className={styles.card}
            >
              <div className={styles.iconWrap} aria-hidden="true">
                <p.icon size={20} strokeWidth={1.6} />
              </div>
              <p className={`mono ${styles.num}`}>
                P/{String(i + 1).padStart(2, "0")}
              </p>
              <h3 className={styles.title}>{p.title}</h3>
              <p className={styles.body}>{p.body}</p>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className={styles.callout}
        >
          <div className={styles.calloutLeft}>
            <p className="eyebrow">Estabilidad estática</p>
            <p className={styles.calloutTitle}>
              Centro de masa bajo y centrado: tolera inclinaciones laterales de hasta 45°.
            </p>
          </div>
          <p className={`body ${styles.calloutBody}`}>
            De acuerdo con los estudios de estabilidad estática (Verma, 2008),
            el diseño busca minimizar la altura del centro de masa y centrarlo
            en el plano transversal. Este criterio permite al vehículo
            soportar pendientes pronunciadas sin volcadura, propiedad
            relevante en terrenos no estructurados.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
