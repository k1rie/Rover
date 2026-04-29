"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { RotateCw, RotateCcw, ArrowUp, ArrowDown, Pause } from "lucide-react";
import SectionHeader from "@/components/SectionHeader/SectionHeader";
import ScrollBackdrop from "@/components/ScrollBackdrop/ScrollBackdrop";
import styles from "./Interactive.module.css";

/**
 * Demo interactiva — calculadora de mezcla diferencial.
 *
 * El estudiante mueve los sliders de throttle y steer y observa en
 * tiempo real:
 *  - El cálculo de velIzq y velDer con la fórmula sustituida
 *  - La velocidad de cada uno de los 6 motores en una vista superior
 *  - El movimiento resultante del rover (texto descriptivo)
 *  - El JSON que se enviaría al ESP32 vía POST /controller
 */

function clamp(v, lo, hi) {
  return Math.max(lo, Math.min(hi, v));
}

function formatNum(n) {
  if (Object.is(n, -0)) return "0.00";
  return n.toFixed(2);
}

function describeMotion(throttle, steer) {
  const t = Math.abs(throttle);
  const s = Math.abs(steer);

  if (t < 0.05 && s < 0.05) {
    return { label: "En reposo", icon: Pause };
  }

  if (s < 0.05) {
    return throttle > 0
      ? { label: "Avance recto", icon: ArrowUp }
      : { label: "Retroceso recto", icon: ArrowDown };
  }

  if (t < 0.05) {
    return steer > 0
      ? { label: "Giro sobre eje (horario)", icon: RotateCw }
      : { label: "Giro sobre eje (antihorario)", icon: RotateCcw };
  }

  // Ambos componentes activos → curva
  const dir = throttle > 0 ? "Avance" : "Retroceso";
  const lado =
    steer > 0 ? "curva derecha" : "curva izquierda";
  return { label: `${dir} con ${lado}`, icon: throttle > 0 ? ArrowUp : ArrowDown };
}

export default function Interactive() {
  const sectionRef = useRef(null);
  const [throttle, setThrottle] = useState(0.5);
  const [steer, setSteer] = useState(0);

  const velIzq = clamp(throttle + steer, -1, 1);
  const velDer = clamp(throttle - steer, -1, 1);

  // Para la visualización: los 6 motores reciben las mismas señales
  // por lado (3 izq con velIzq, 3 der con velDer)
  const motors = [
    { id: "FL", label: "Frontal Izq.", side: "izq", row: 0, vel: velIzq },
    { id: "FR", label: "Frontal Der.", side: "der", row: 0, vel: velDer },
    { id: "ML", label: "Medio Izq.",   side: "izq", row: 1, vel: velIzq },
    { id: "MR", label: "Medio Der.",   side: "der", row: 1, vel: velDer },
    { id: "RL", label: "Trasero Izq.", side: "izq", row: 2, vel: velIzq },
    { id: "RR", label: "Trasero Der.", side: "der", row: 2, vel: velDer },
  ];

  const motion_ = describeMotion(throttle, steer);
  const Icon = motion_.icon;

  return (
    <section
      id="interactiva"
      ref={sectionRef}
      className={`section ${styles.section}`}
    >
      <ScrollBackdrop targetRef={sectionRef} variant="white" position="top" />
      <ScrollBackdrop targetRef={sectionRef} variant="cool" position="bottom" />

      <div className={`container ${styles.container}`}>
        <SectionHeader
          eyebrow="08 · Demo interactiva"
          title="Calculadora de mezcla diferencial."
          description="La operación del prototipo se basa en convertir un comando con dos componentes (avance y dirección) en dos velocidades independientes, una por cada lado del vehículo. Manipule los controles para observar el comportamiento del cálculo y el efecto sobre la actuación de los motores."
        />

        <div className={styles.grid}>
          {/* ─── Controles ─── */}
          <div className={styles.controls}>
            <Slider
              label="Throttle (avance)"
              variable="throttle"
              value={throttle}
              onChange={setThrottle}
              hint="−1 = retroceso máx.   +1 = avance máx."
            />
            <Slider
              label="Steer (dirección)"
              variable="steer"
              value={steer}
              onChange={setSteer}
              hint="−1 = giro a izquierda   +1 = giro a derecha"
            />

            {/* Fórmula sustituida en vivo */}
            <div className={styles.formula}>
              <p className={`mono ${styles.formulaTitle}`}>Fórmula aplicada</p>

              <div className={styles.formulaRow}>
                <span className={`mono ${styles.formulaVar}`}>velIzq</span>
                <span className={`mono ${styles.formulaOp}`}>=</span>
                <span className={`mono ${styles.formulaExpr}`}>
                  throttle <span className={styles.formulaPlus}>+</span> steer
                </span>
              </div>
              <div className={styles.formulaSubst}>
                <span className={`mono ${styles.formulaVar}`}>velIzq</span>
                <span className={`mono ${styles.formulaOp}`}>=</span>
                <span className={`mono ${styles.formulaExpr}`}>
                  ({formatNum(throttle)})
                  <span className={styles.formulaPlus}>+</span>
                  ({formatNum(steer)})
                  <span className={styles.formulaOp}>=</span>
                  <span className={styles.formulaResult}>
                    {formatNum(velIzq)}
                  </span>
                </span>
              </div>

              <div className={styles.formulaRow} style={{ marginTop: 12 }}>
                <span className={`mono ${styles.formulaVar}`}>velDer</span>
                <span className={`mono ${styles.formulaOp}`}>=</span>
                <span className={`mono ${styles.formulaExpr}`}>
                  throttle <span className={styles.formulaPlus}>−</span> steer
                </span>
              </div>
              <div className={styles.formulaSubst}>
                <span className={`mono ${styles.formulaVar}`}>velDer</span>
                <span className={`mono ${styles.formulaOp}`}>=</span>
                <span className={`mono ${styles.formulaExpr}`}>
                  ({formatNum(throttle)})
                  <span className={styles.formulaPlus}>−</span>
                  ({formatNum(steer)})
                  <span className={styles.formulaOp}>=</span>
                  <span className={styles.formulaResult}>
                    {formatNum(velDer)}
                  </span>
                </span>
              </div>
            </div>

            {/* Movimiento resultante */}
            <div className={styles.outcome}>
              <div className={styles.outcomeIcon} aria-hidden="true">
                <Icon size={22} strokeWidth={1.7} />
              </div>
              <div>
                <p className={`mono ${styles.outcomeLabel}`}>
                  Movimiento resultante
                </p>
                <p className={styles.outcomeValue}>{motion_.label}</p>
              </div>
            </div>

            {/* JSON que iría al ESP32 */}
            <div className={styles.json}>
              <p className={`mono ${styles.jsonLabel}`}>
                Mensaje HTTP enviado al ESP32
              </p>
              <pre className={`mono ${styles.jsonCode}`}>
                <code>{`POST /controller HTTP/1.1
Content-Type: application/json

{
  "axes": [${formatNum(throttle)}, ${formatNum(steer)}]
}`}</code>
              </pre>
            </div>
          </div>

          {/* ─── Visualización del rover ─── */}
          <div className={styles.visual}>
            <p className={`mono ${styles.visualLabel}`}>
              Vista superior · velocidad por motor
            </p>

            <RoverDiagram motors={motors} velIzq={velIzq} velDer={velDer} />

            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <span
                  className={styles.legendBar}
                  style={{ background: "var(--accent-green)" }}
                />
                <span>Adelante</span>
              </div>
              <div className={styles.legendItem}>
                <span
                  className={styles.legendBar}
                  style={{ background: "var(--accent-red)" }}
                />
                <span>Atrás</span>
              </div>
              <div className={styles.legendItem}>
                <span
                  className={styles.legendBar}
                  style={{ background: "var(--text-disabled)" }}
                />
                <span>Detenido</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pre-sets pedagógicos */}
        <div className={styles.presets}>
          <p className={`mono ${styles.presetsLabel}`}>
            Casos de prueba
          </p>
          <div className={styles.presetsRow}>
            <PresetButton
              label="Avance recto"
              onClick={() => {
                setThrottle(1);
                setSteer(0);
              }}
            />
            <PresetButton
              label="Curva suave a la derecha"
              onClick={() => {
                setThrottle(0.7);
                setSteer(0.3);
              }}
            />
            <PresetButton
              label="Giro sobre eje (horario)"
              onClick={() => {
                setThrottle(0);
                setSteer(1);
              }}
            />
            <PresetButton
              label="Retroceso lento"
              onClick={() => {
                setThrottle(-0.4);
                setSteer(0);
              }}
            />
            <PresetButton
              label="Reposo"
              onClick={() => {
                setThrottle(0);
                setSteer(0);
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Slider({ label, variable, value, onChange, hint }) {
  const pct = ((value + 1) / 2) * 100;
  return (
    <div className={styles.slider}>
      <div className={styles.sliderHead}>
        <label className={styles.sliderLabel}>{label}</label>
        <span className={`mono ${styles.sliderValue}`}>
          {formatNum(value)}
        </span>
      </div>

      <div className={styles.sliderTrack}>
        <div className={styles.sliderTrackBg} />
        {/* Marca del centro */}
        <div className={styles.sliderCenterMark} />
        {/* Fill desde el centro hacia donde está el valor */}
        <div
          className={styles.sliderFill}
          style={{
            left: value >= 0 ? "50%" : `${pct}%`,
            width: `${Math.abs(pct - 50)}%`,
          }}
        />
        <input
          type="range"
          min={-1}
          max={1}
          step={0.01}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className={styles.sliderInput}
          aria-label={label}
        />
      </div>

      <div className={styles.sliderHint}>
        <span>−1</span>
        <span className={styles.sliderHintMid}>{hint}</span>
        <span>+1</span>
      </div>
    </div>
  );
}

function PresetButton({ label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={styles.presetBtn}
    >
      {label}
    </button>
  );
}

function RoverDiagram({ motors, velIzq, velDer }) {
  // Posiciones de motores en el SVG (top-down, eje Y vertical)
  const positions = {
    FL: { x: 70, y: 90 },
    FR: { x: 230, y: 90 },
    ML: { x: 70, y: 200 },
    MR: { x: 230, y: 200 },
    RL: { x: 70, y: 310 },
    RR: { x: 230, y: 310 },
  };

  // Color y altura de barra según velocidad (-1..+1)
  const barColor = (v) => {
    if (v > 0.05) return "var(--accent-green)";
    if (v < -0.05) return "var(--accent-red)";
    return "var(--text-disabled)";
  };

  return (
    <svg viewBox="0 0 300 400" className={styles.diagram}>
      <defs>
        <linearGradient id="chasisGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.06)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0.02)" />
        </linearGradient>
      </defs>

      {/* Indicador "FRENTE" */}
      <text
        x="150"
        y="22"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="10"
        letterSpacing="0.18em"
        fill="var(--text-tertiary)"
      >
        FRENTE
      </text>

      {/* Indicador "ATRÁS" */}
      <text
        x="150"
        y="390"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="10"
        letterSpacing="0.18em"
        fill="var(--text-tertiary)"
      >
        ATRÁS
      </text>

      {/* Lados */}
      <text
        x="20"
        y="200"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="10"
        letterSpacing="0.16em"
        fill="var(--text-tertiary)"
        transform="rotate(-90 20 200)"
      >
        IZQUIERDO
      </text>
      <text
        x="280"
        y="200"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="10"
        letterSpacing="0.16em"
        fill="var(--text-tertiary)"
        transform="rotate(90 280 200)"
      >
        DERECHO
      </text>

      {/* Chasis */}
      <rect
        x="105"
        y="60"
        width="90"
        height="280"
        rx="14"
        fill="url(#chasisGrad)"
        stroke="rgba(255, 255, 255, 0.18)"
        strokeWidth="1"
      />

      {/* Etiquetas de lado con velocidad */}
      <g>
        <text
          x="30"
          y="50"
          fontFamily="var(--font-mono)"
          fontSize="11"
          fill="var(--accent)"
        >
          velIzq = {formatNum(velIzq)}
        </text>
        <text
          x="200"
          y="50"
          fontFamily="var(--font-mono)"
          fontSize="11"
          fill="var(--accent)"
        >
          velDer = {formatNum(velDer)}
        </text>
      </g>

      {/* Motores */}
      {motors.map((m) => {
        const pos = positions[m.id];
        const barH = Math.abs(m.vel) * 50;
        const color = barColor(m.vel);
        // La barra apunta arriba si vel positivo (avance), abajo si negativo
        const barY = m.vel >= 0 ? pos.y - barH : pos.y;

        return (
          <g key={m.id}>
            {/* Cuerpo de motor (círculo) */}
            <circle
              cx={pos.x}
              cy={pos.y}
              r="22"
              fill="rgba(20, 20, 28, 0.9)"
              stroke="rgba(255, 255, 255, 0.18)"
              strokeWidth="1"
            />

            {/* Barra de velocidad */}
            <motion.rect
              animate={{ height: barH }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              x={pos.x - 4}
              y={barY}
              width="8"
              fill={color}
              rx="2"
              style={{
                transformOrigin: `${pos.x}px ${pos.y}px`,
              }}
            />

            {/* Centro del motor */}
            <circle cx={pos.x} cy={pos.y} r="3" fill="var(--accent)" />

            {/* Etiqueta del motor */}
            <text
              x={pos.x}
              y={pos.y + 38}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize="9"
              fill="var(--text-tertiary)"
              letterSpacing="0.08em"
            >
              {m.id}
            </text>

            {/* Valor numérico de velocidad */}
            <text
              x={pos.x}
              y={pos.y + 5}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize="9"
              fill="var(--text-secondary)"
            >
              {formatNum(m.vel)}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
