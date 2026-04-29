"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import {
  FileBox,
  Wrench,
  CircuitBoard,
  TestTube2,
  Rocket,
} from "lucide-react";
import SectionHeader from "@/components/SectionHeader/SectionHeader";
import ScrollBackdrop from "@/components/ScrollBackdrop/ScrollBackdrop";
import styles from "./BuildSteps.module.css";

const phases = [
  {
    icon: FileBox,
    label: "Fase 1",
    title: "Manufactura aditiva de las piezas",
    duration: "~12–18 h",
    items: [
      "Material: filamento PLA o PETG de 1.75 mm, aproximadamente 1 kg en total.",
      "Imprimir chasís, brazos Rocker, pivotes, barra y enlaces diferenciales, soportes y adaptadores.",
      "Imprimir los seis neumáticos en TPU para incrementar el coeficiente de fricción.",
      "Parámetros de impresión: altura de capa 0.2 mm, densidad de relleno 30 %, soporte automático según geometría.",
    ],
  },
  {
    icon: Wrench,
    label: "Fase 2",
    title: "Ensamblaje mecánico",
    duration: "~3 h",
    items: [
      "Fijar los soportes a brazos y pivotes mediante tornillería M3.",
      "Insertar los adaptadores en el eje de cada motorreductor JGA25-370.",
      "Acoplar el rin estándar al adaptador correspondiente.",
      "Vincular los Rockers al cuerpo principal mediante la barra y los enlaces diferenciales.",
    ],
  },
  {
    icon: CircuitBoard,
    label: "Fase 3",
    title: "Cableado del sistema electrónico",
    duration: "~2 h",
    items: [
      "Instalar el microcontrolador ESP32 en la cavidad superior del chasís.",
      "Conectar los tres drivers BTS7960 (dos motores por driver) a la batería de 11.1 V.",
      "Montar el sensor HC-SR04 al frente del chasís y cablear las señales Trig y Echo al microcontrolador.",
      "Conectar la salida del regulador 12 V → 5 V al microcontrolador, sensor y servomotores.",
    ],
  },
  {
    icon: TestTube2,
    label: "Fase 4",
    title: "Carga y verificación del firmware",
    duration: "~30 min",
    items: [
      "Instalar el soporte para ESP32 en Arduino IDE.",
      "Configurar las credenciales WiFi en las constantes WIFI_SSID_1 y WIFI_SSID_2.",
      "Compilar y cargar el firmware mediante el puerto USB.",
      "Verificar el LED de estado: blanco durante el arranque, azul o verde si conectó a la red, rojo en caso de error.",
    ],
  },
  {
    icon: Rocket,
    label: "Fase 5",
    title: "Operación y calibración",
    duration: "Continua",
    items: [
      "Acceder a la interfaz de control desde un dispositivo en la misma red.",
      "Enviar comandos POST /controller con la estructura { axes: [throttle, steer] }.",
      "Realizar pruebas en superficie plana antes de evaluar el comportamiento sobre obstáculos.",
      "Ajustar el umbral de detección de huecos según las condiciones del terreno de prueba.",
    ],
  },
];

export default function BuildSteps() {
  const sectionRef = useRef(null);

  return (
    <section
      id="construccion"
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
          eyebrow="09 · Metodología"
          title="Etapas de construcción del prototipo."
          description="El proceso de construcción se divide en cinco etapas. La metodología puede replicarse en un contexto académico con una impresora 3D estándar, herramientas básicas de electrónica y el firmware documentado en la sección anterior."
        />

        <div className={styles.grid}>
          {phases.map((p, i) => (
            <motion.article
              key={p.label}
              initial={{ opacity: 0, y: 36, rotateX: 8 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.75,
                delay: Math.min(i * 0.10, 0.6),
                ease: [0.22, 1, 0.36, 1],
              }}
              className={styles.card}
            >
              <header className={styles.cardHeader}>
                <div className={styles.iconWrap}>
                  <p.icon size={20} strokeWidth={1.6} />
                </div>
                <span className={`mono ${styles.cardLabel}`}>{p.label}</span>
                <span className={`mono ${styles.cardDuration}`}>
                  {p.duration}
                </span>
              </header>
              <h3 className={styles.cardTitle}>{p.title}</h3>
              <ul className={styles.list}>
                {p.items.map((item, idx) => (
                  <li key={idx} className={styles.item}>
                    <span className={styles.bullet} aria-hidden="true">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className={styles.connector} aria-hidden="true" />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
