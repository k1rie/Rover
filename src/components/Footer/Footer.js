import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <p className={styles.brandTitle}>
              ROVER<span className={styles.brandAccent}>UNACH</span>
            </p>
            <p className={styles.brandTag}>
              Proyecto integrador · Electricidad y Electrónica · UNACH
            </p>
          </div>

          <div className={styles.cols}>
            <div className={styles.col}>
              <p className={styles.colTitle}>Proyecto</p>
              <a href="#introduccion">Introducción</a>
              <a href="#funcionamiento">Funcionamiento</a>
              <a href="#componentes">Componentes</a>
              <a href="#electronica">Electrónica</a>
            </div>
            <div className={styles.col}>
              <p className={styles.colTitle}>Recursos</p>
              <a href="#codigo">Código</a>
              <a href="#flujo">Diagrama</a>
              <a href="#construccion">Construcción</a>
              <a href="#recursos">Descargas</a>
            </div>
            <div className={styles.col}>
              <p className={styles.colTitle}>Universidad</p>
              <a
                href="https://www.unach.mx"
                target="_blank"
                rel="noreferrer"
              >
                UNACH
              </a>
              <a
                href="https://fcacampus1.unach.mx"
                target="_blank"
                rel="noreferrer"
              >
                Facultad de Contaduría
              </a>
              <a href="#equipo">Equipo</a>
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.legal}>
            © {new Date().getFullYear()} Equipo Rover UNACH · Proyecto integrador
            de Electricidad y Electrónica
          </p>
          <p className={styles.legal}>
            Benemérita Universidad Autónoma de Chiapas · Tuxtla Gutiérrez
          </p>
        </div>
      </div>
    </footer>
  );
}
