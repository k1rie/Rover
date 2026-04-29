"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import SectionHeader from "@/components/SectionHeader/SectionHeader";
import ScrollBackdrop from "@/components/ScrollBackdrop/ScrollBackdrop";
import TeamCard from "@/components/TeamCard/TeamCard";
import styles from "./Team.module.css";

const team = [
  { name: "Josué Gabriel Escobar Domínguez", role: "Equipo de desarrollo" },
  { name: "José Manuel Peña Morales", role: "Equipo de desarrollo" },
  { name: "Alan Eduardo Peréz Hernández", role: "Equipo de desarrollo" },
  { name: "Diego Enrique González Guerrero", role: "Equipo de desarrollo" },
  { name: "Ades Yasir Gómez Delgado", role: "Equipo de desarrollo" },
  { name: "Gabriela Casanova Peréz", role: "Equipo de desarrollo" },
];

export default function Team() {
  const sectionRef = useRef(null);

  return (
    <section
      id="equipo"
      ref={sectionRef}
      className={`section ${styles.section}`}
    >
      <ScrollBackdrop targetRef={sectionRef} variant="soft" position="top" />
      <div className={`container ${styles.container}`}>
        <SectionHeader
          eyebrow="10 · Autores"
          title="Integrantes del equipo de trabajo."
          description="Estudiantes de la carrera de Ingeniería en Desarrollo y Tecnologías de Software, segundo semestre, grupo N. El presente trabajo corresponde al proyecto integrador del curso de Electricidad y Electrónica."
        />

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5 }}
          className={styles.advisor}
        >
          <div className={styles.advisorIcon}>
            <GraduationCap size={20} strokeWidth={1.6} />
          </div>
          <div className={styles.advisorBody}>
            <p className="eyebrow">Catedrático responsable</p>
            <p className={styles.advisorName}>Mtro. Genaro Hernández Martínez</p>
            <p className={styles.advisorNote}>
              Curso: Electricidad y Electrónica · 2° semestre · Grupo N
            </p>
          </div>
          <div className={styles.advisorMeta}>
            <p className={styles.metaItem}>
              <span>Universidad</span>
              <strong>UNACH</strong>
            </p>
            <p className={styles.metaItem}>
              <span>Facultad</span>
              <strong>FCA · Campus I</strong>
            </p>
            <p className={styles.metaItem}>
              <span>Carrera</span>
              <strong>IDTS</strong>
            </p>
          </div>
        </motion.div>

        <div className={styles.grid}>
          {team.map((m, i) => (
            <TeamCard key={m.name} {...m} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
