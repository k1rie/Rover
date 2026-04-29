"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import {
  Cpu,
  Battery,
  Activity,
  Wifi,
  Zap,
  Radar,
} from "lucide-react";
import SectionHeader from "@/components/SectionHeader/SectionHeader";
import ScrollBackdrop from "@/components/ScrollBackdrop/ScrollBackdrop";
import styles from "./Electronics.module.css";

const nodes = [
  {
    id: "battery",
    icon: Battery,
    title: "Batería de iones de litio",
    spec: "11.1 V · 2200 mAh · 25C",
    note: "Fuente primaria de energía. Alimenta los motores directamente y, mediante un regulador, también la lógica del microcontrolador.",
    role: "ENERGÍA",
  },
  {
    id: "regulator",
    icon: Zap,
    title: "Regulador reductor",
    spec: "12 V → 5 V",
    note: "Línea de alimentación independiente para la lógica. Evita caídas de tensión que provocarían reinicios del microcontrolador.",
    role: "REGULACIÓN",
  },
  {
    id: "esp32",
    icon: Cpu,
    title: "Microcontrolador ESP32",
    spec: "WiFi · Bluetooth · doble núcleo",
    note: "Unidad central del sistema. Procesa comandos JSON, calcula la mezcla diferencial y genera las señales PWM para los actuadores.",
    role: "CONTROL",
    highlight: true,
  },
  {
    id: "drivers",
    icon: Activity,
    title: "Driver Puente H BTS7960",
    spec: "5.5–27 V · 43 A máx · ×3",
    note: "Cada módulo controla dos motores. Se requieren tres unidades para los seis motores de tracción del prototipo.",
    role: "POTENCIA",
  },
  {
    id: "motors",
    icon: Activity,
    title: "Motorreductores JGA25-370",
    spec: "12 V · 16 RPM · ×6",
    note: "Actuadores de tracción con caja de engranajes metálicos. Reciben señal PWM a 1 kHz con resolución de 8 bits.",
    role: "TRACCIÓN",
  },
  {
    id: "ultrasonic",
    icon: Radar,
    title: "Sensor ultrasónico HC-SR04",
    spec: "5 V · 15 mA · 2–400 cm",
    note: "Sensor de proximidad frontal. Si la distancia medida supera el umbral configurado, el firmware detiene los actuadores.",
    role: "PERCEPCIÓN",
  },
  {
    id: "wifi",
    icon: Wifi,
    title: "Comunicación inalámbrica",
    spec: "WiFi local · POST /controller",
    note: "El microcontrolador expone un servidor HTTP que recibe los comandos del operador. La estructura del mensaje es { axes: [throttle, steer] }.",
    role: "COMUNICACIÓN",
  },
];

export default function Electronics() {
  const sectionRef = useRef(null);

  return (
    <section
      id="electronica"
      ref={sectionRef}
      className={`section ${styles.section}`}
    >
      <ScrollBackdrop targetRef={sectionRef} variant="cool" position="center" />
      <div className={`container ${styles.container}`}>
        <SectionHeader
          eyebrow="06 · Sistema de control"
          title="Arquitectura electrónica del prototipo."
          description="El sistema de control se diseñó con una arquitectura de alimentación dual que aísla la lógica del microcontrolador de la potencia destinada a los actuadores. Esta separación previene caídas de tensión durante maniobras que demandan alto par motor. A continuación se describen los componentes que integran el sistema."
        />

        <div className={styles.diagram}>
          <div className={styles.busLine} aria-hidden="true">
            <span className={styles.busLabel}>BUS DE ALIMENTACIÓN</span>
          </div>

          <div className={styles.grid}>
            {nodes.map((n, i) => (
              <motion.article
                key={n.id}
                initial={{ opacity: 0, y: 32, rotateX: 10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.7,
                  delay: Math.min(i * 0.09, 0.6),
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`${styles.node} ${n.highlight ? styles.highlight : ""}`}
              >
                <div className={styles.nodeHead}>
                  <div className={styles.iconWrap}>
                    <n.icon size={18} strokeWidth={1.6} />
                  </div>
                  <span className={`mono ${styles.role}`}>{n.role}</span>
                </div>
                <h3 className={styles.title}>{n.title}</h3>
                <p className={`mono ${styles.spec}`}>{n.spec}</p>
                <p className={styles.note}>{n.note}</p>

                {n.highlight && (
                  <span className={styles.brain} aria-hidden="true">
                    <span /> <span /> <span />
                  </span>
                )}
              </motion.article>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className={styles.dualPower}
        >
          <div>
            <p className="eyebrow">Alimentación dual</p>
            <h3 className={styles.dualTitle}>
              Separación entre la línea de potencia y la línea de lógica.
            </h3>
          </div>
          <div className={styles.lines}>
            <div className={styles.lineItem}>
              <span
                className={styles.lineDot}
                style={{ background: "var(--accent-orange)" }}
              />
              <div>
                <p className={styles.lineTitle}>Línea de potencia</p>
                <p className={styles.lineNote}>
                  La batería alimenta directamente los drivers BTS7960. La capacidad de descarga (25C) soporta los picos de corriente que demandan los motores al iniciar el movimiento o superar pendientes.
                </p>
              </div>
            </div>
            <div className={styles.lineItem}>
              <span
                className={styles.lineDot}
                style={{ background: "var(--accent-blue)" }}
              />
              <div>
                <p className={styles.lineTitle}>Línea de lógica</p>
                <p className={styles.lineNote}>
                  El regulador reductor entrega 5 V regulados al microcontrolador, al sensor y a los servomotores. Esta línea queda aislada del ruido eléctrico generado por la conmutación de los motores.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
