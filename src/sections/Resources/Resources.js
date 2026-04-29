"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { FileText, Code2, Box, ExternalLink } from "lucide-react";
import SectionHeader from "@/components/SectionHeader/SectionHeader";
import ScrollBackdrop from "@/components/ScrollBackdrop/ScrollBackdrop";
import styles from "./Resources.module.css";

const resources = [
  {
    icon: FileText,
    title: "Documento técnico del proyecto",
    note: "Reporte completo del proyecto integrador, incluye marco teórico, especificaciones técnicas, diagramas y referencias bibliográficas.",
    cta: "Descargar PDF",
    href: "#",
  },
  {
    icon: Code2,
    title: "Código fuente del firmware",
    note: "Implementación en C/C++ para la plataforma Arduino IDE con soporte para ESP32. Documentado y listo para compilar.",
    cta: "Repositorio",
    href: "#",
  },
  {
    icon: Box,
    title: "Modelos para manufactura aditiva",
    note: "Archivos en formato STL y STEP de las siete piezas estructurales del prototipo y los rines (versión estándar y hexagonal).",
    cta: "Descargar archivos",
    href: "#",
  },
];

export default function Resources() {
  const sectionRef = useRef(null);

  return (
    <section
      id="recursos"
      ref={sectionRef}
      className={`section ${styles.section}`}
    >
      <ScrollBackdrop targetRef={sectionRef} variant="white" position="center" />
      <div className={`container ${styles.container}`}>
        <SectionHeader
          eyebrow="11 · Documentación"
          title="Material complementario del proyecto."
          description="El presente proyecto se publica como recurso educativo abierto. Los siguientes documentos facilitan la consulta, replicación o adaptación del prototipo en otros contextos académicos."
        />

        <div className={styles.grid}>
          {resources.map((r, i) => (
            <motion.a
              key={r.title}
              href={r.href}
              initial={{ opacity: 0, y: 36, rotateX: 10 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.75,
                delay: i * 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={styles.card}
            >
              <div className={styles.iconWrap}>
                <r.icon size={22} strokeWidth={1.6} />
              </div>
              <h3 className={styles.title}>{r.title}</h3>
              <p className={styles.note}>{r.note}</p>
              <span className={styles.cta}>
                {r.cta}
                <ExternalLink size={14} strokeWidth={2} />
              </span>
            </motion.a>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
          className={styles.cta_block}
        >
          <p className="eyebrow">Disponibilidad para consulta</p>
          <h3 className={styles.ctaTitle}>
            Recurso académico abierto.
          </h3>
          <p className={`body ${styles.ctaBody}`}>
            Si este trabajo sirve como referencia para futuros proyectos
            integradores o surge alguna duda específica sobre la
            implementación, los autores quedan a disposición a través de la
            facultad. La documentación se mantendrá disponible en la medida
            en que se publiquen el código y los modelos.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
