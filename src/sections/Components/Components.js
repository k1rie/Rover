"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SectionHeader from "@/components/SectionHeader/SectionHeader";
import ScrollBackdrop from "@/components/ScrollBackdrop/ScrollBackdrop";
import ComponentCard from "@/components/ComponentCard/ComponentCard";
import styles from "./Components.module.css";

const filters = [
  { id: "todos", label: "Todos" },
  { id: "estructura", label: "Estructura 3D" },
  { id: "ruedas", label: "Ruedas" },
  { id: "actuadores", label: "Actuadores" },
];

const components = [
  {
    id: "chasis",
    name: "Chasís (cuerpo principal)",
    category: "Estructura 3D",
    cat: "estructura",
    qty: 1,
    description:
      "Caja central que aloja el ESP32, la batería y los módulos de potencia. Protegida frente a impactos durante navegación.",
    specs: [
      { label: "Material", value: "PLA / PETG" },
      { label: "Medidas", value: "140 × 102 × 73 mm" },
      { label: "Espesor pared", value: "10 mm" },
    ],
    image: "/assets/assembly/01-chasis.png",
    highlight: true,
  },
  {
    id: "brazo-izq",
    name: "Brazo izquierdo / derecho",
    category: "Estructura 3D",
    cat: "estructura",
    qty: 2,
    description:
      "Eslabón principal del Rocker. Conecta la rueda delantera con el pivote del Bogie.",
    specs: [
      { label: "Material", value: "PETG" },
      { label: "Largo total", value: "305.1 mm" },
      { label: "Pivote ø", value: "3.2 mm" },
    ],
    image: "/assets/assembly/02-brazo.png",
  },
  {
    id: "pivote",
    name: "Pivote izquierdo / derecho",
    category: "Estructura 3D",
    cat: "estructura",
    qty: 2,
    description:
      "Articulación entre el brazo Rocker y los soportes de motor del Bogie. Distribuye carga y permite escalada pasiva.",
    specs: [
      { label: "Material", value: "PETG" },
      { label: "Apertura", value: "123.2 mm" },
      { label: "Espesor", value: "27 mm" },
    ],
    image: "/assets/assembly/03-pivote.png",
  },
  {
    id: "barra-dif",
    name: "Barra diferencial",
    category: "Estructura 3D",
    cat: "estructura",
    qty: 1,
    description:
      "Barra central que une los dos Rockers. Promedia la inclinación entre ambos lados — clave del sistema diferencial.",
    specs: [
      { label: "Material", value: "PETG" },
      { label: "Largo", value: "183.08 mm" },
      { label: "Pivote ø", value: "3.2 mm" },
    ],
    image: "/assets/assembly/04-barra.png",
  },
  {
    id: "enlace-dif",
    name: "Enlace diferencial L / R",
    category: "Estructura 3D",
    cat: "estructura",
    qty: 2,
    description:
      "Conecta la barra diferencial con cada Rocker. Transmite el desplazamiento angular para nivelar el chasis.",
    specs: [
      { label: "Material", value: "PETG" },
      { label: "Pivote ø", value: "3.2 mm" },
    ],
    image: "/assets/assembly/05-enlace.png",
  },
  {
    id: "soporte-motor",
    name: "Soporte de motor",
    category: "Estructura 3D",
    cat: "estructura",
    qty: 6,
    description:
      "Aloja al motorreductor JGA25-370 y lo fija al brazo o al Bogie. Acepta acoplamiento directo al rin.",
    specs: [
      { label: "Material", value: "PETG" },
      { label: "Anclaje", value: "ø3.2 mm" },
    ],
    image: "/assets/assembly/06-soporte.png",
  },
  {
    id: "adaptador",
    name: "Adaptador de acoplamiento",
    category: "Estructura 3D",
    cat: "estructura",
    qty: 6,
    description:
      "Pieza intermedia entre el eje del motor y el rin. Absorbe holguras y permite intercambio de tipo de rin (estándar / hexagonal).",
    specs: [
      { label: "Material", value: "PETG" },
      { label: "Acopla a", value: "Eje GA25" },
    ],
    image: "/assets/assembly/07-adaptador.png",
  },
  {
    id: "rin",
    name: "Rin estándar / hexagonal",
    category: "Ruedas",
    cat: "ruedas",
    qty: 6,
    description:
      "Estructura interior. La versión hexagonal se acopla a un cubo de 12 mm; la estándar va directo al adaptador del motor.",
    specs: [
      { label: "Material", value: "PETG" },
      { label: "Diámetro", value: "Ø40 mm" },
      { label: "Espesor", value: "26 mm" },
    ],
    image: "/assets/assembly/08-rin.png",
  },
  {
    id: "neumatico",
    name: "Neumático",
    category: "Ruedas",
    cat: "ruedas",
    qty: 6,
    description:
      "Banda exterior con perfil agresivo para maximizar agarre en tierra, grava y superficies irregulares.",
    specs: [
      { label: "Material", value: "PETG / TPU" },
      { label: "Diámetro", value: "Ø50 mm" },
      { label: "Ancho", value: "40 mm" },
    ],
    image: "/assets/assembly/09-neumatico.png",
  },
  {
    id: "motor",
    name: "Motorreductor JGA25-370",
    category: "Actuador de tracción",
    cat: "actuadores",
    qty: 6,
    description:
      "Motor DC con caja reductora metálica. Alto torque a baja velocidad — ideal para superar pendientes sin impactos dinámicos.",
    specs: [
      { label: "Voltaje", value: "12 V" },
      { label: "Velocidad", value: "16 RPM" },
      { label: "Corriente máx.", value: "2 A" },
    ],
    image: null,
    highlight: true,
  },
  {
    id: "servo",
    name: "Servomotor MG996R",
    category: "Actuador de dirección",
    cat: "actuadores",
    qty: 4,
    description:
      "Servomotor con engranajes metálicos de 15 kg·cm. Dirección angular precisa para giro sobre eje y desplazamiento lateral.",
    specs: [
      { label: "Voltaje", value: "3 – 7.2 V" },
      { label: "Torque", value: "15 kg·cm" },
      { label: "Engranajes", value: "Metálicos" },
    ],
    image: null,
  },
];

export default function Components() {
  const [filter, setFilter] = useState("todos");
  const sectionRef = useRef(null);

  const filtered =
    filter === "todos"
      ? components
      : components.filter((c) => c.cat === filter);

  return (
    <section
      id="componentes"
      ref={sectionRef}
      className={`section ${styles.section}`}
    >
      <ScrollBackdrop targetRef={sectionRef} variant="white" position="center" />
      <ScrollBackdrop targetRef={sectionRef} variant="cool" position="bottom" />
      <div className={`container ${styles.container}`}>
        <SectionHeader
          eyebrow="05 · Lista de materiales"
          title="Inventario de componentes del prototipo."
          description="El proyecto utiliza piezas de manufactura aditiva (PLA y PETG), actuadores comerciales y electrónica de bajo costo. Cada elemento ha sido seleccionado para integrarse sin necesidad de elementos de fijación externos. La siguiente lista presenta los componentes con sus especificaciones técnicas."
        />

        <div className={styles.filters} role="tablist">
          {filters.map((f) => (
            <button
              key={f.id}
              role="tab"
              aria-selected={filter === f.id}
              className={`${styles.filterBtn} ${
                filter === f.id ? styles.filterActive : ""
              }`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
              <span className={styles.filterCount}>
                {f.id === "todos"
                  ? components.length
                  : components.filter((c) => c.cat === f.id).length}
              </span>
            </button>
          ))}
        </div>

        <motion.div layout className={styles.grid}>
          <AnimatePresence mode="popLayout">
            {filtered.map((c, i) => (
              <motion.div
                layout
                key={c.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ComponentCard {...c} index={i} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
