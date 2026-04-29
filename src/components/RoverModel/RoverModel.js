"use client";

import { motion } from "framer-motion";
import styles from "./RoverModel.module.css";

/**
 * Reusable rover illustration. Accepts MotionValues (or static numbers) for
 * `scale` and `rotateY` so the parent can drive the animation from useScroll.
 *
 * Props:
 *   scale     — MotionValue or number, default 1
 *   rotateY   — MotionValue or number, default 0
 *   variant   — "studio" (dark gradient floor) | "mars" (no floor, transparent)
 *   wheelsSpin — boolean, animate wheel rotation independently (default true)
 */
export default function RoverModel({
  scale = 1,
  rotateY = 0,
  variant = "studio",
  wheelsSpin = true,
  className = "",
}) {
  return (
    <motion.div
      style={{ scale, rotateY }}
      className={`${styles.wrap} ${className}`}
    >
      <svg
        viewBox="0 0 700 420"
        className={styles.svg}
        role="img"
        aria-label="Rover holonómico Rocker-Bogie"
      >
        <defs>
          {/* Cuerpo en blanco — match con el rover real impreso */}
          <linearGradient id="rmBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="40%" stopColor="#E8E8EE" />
            <stop offset="100%" stopColor="#9A9AA3" />
          </linearGradient>
          <linearGradient id="rmArm" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#E8E8EE" />
            <stop offset="100%" stopColor="#FFFFFF" />
          </linearGradient>
          <radialGradient id="rmWheel" cx="0.4" cy="0.4" r="0.6">
            <stop offset="0%" stopColor="#F5F5F5" />
            <stop offset="60%" stopColor="#C8C8CE" />
            <stop offset="100%" stopColor="#7A7A82" />
          </radialGradient>
          <radialGradient id="rmHub" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor="#FFFFFF" />
            <stop offset="100%" stopColor="#A8A8B0" />
          </radialGradient>
          <linearGradient id="rmFloor" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(255, 255, 255, 0)" />
            <stop offset="100%" stopColor="rgba(255, 255, 255, 0.10)" />
          </linearGradient>
          <filter id="rmGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="rmShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" />
          </filter>
        </defs>

        {/* contact shadow */}
        <ellipse
          cx="350"
          cy="372"
          rx="240"
          ry="14"
          fill="rgba(0,0,0,0.5)"
          filter="url(#rmShadow)"
          opacity="0.7"
        />

        {/* floor accent (only in studio variant) */}
        {variant === "studio" && (
          <rect
            x="0"
            y="360"
            width="700"
            height="60"
            fill="url(#rmFloor)"
            opacity="0.6"
          />
        )}

        {/* Rocker-Bogie linkages — back layer */}
        <g
          stroke="url(#rmArm)"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        >
          {/* main rocker arm (top horizontal) */}
          <line x1="140" y1="220" x2="560" y2="220" />
          {/* left rocker → bogie */}
          <line x1="140" y1="220" x2="100" y2="290" />
          <line x1="140" y1="220" x2="180" y2="290" />
          {/* right rocker → bogie */}
          <line x1="560" y1="220" x2="520" y2="290" />
          <line x1="560" y1="220" x2="600" y2="290" />
          {/* center vertical supports */}
          <line x1="280" y1="220" x2="280" y2="290" />
          <line x1="420" y1="220" x2="420" y2="290" />
        </g>

        {/* Differential bar (subtle, behind body) */}
        <rect
          x="220"
          y="155"
          width="260"
          height="10"
          rx="5"
          fill="#C8C8CE"
          opacity="0.6"
        />

        {/* Main body / chassis */}
        <g>
          <rect
            x="220"
            y="160"
            width="260"
            height="100"
            rx="14"
            fill="url(#rmBody)"
            stroke="rgba(0,0,0,0.25)"
            strokeWidth="1.5"
          />
          {/* Top deck */}
          <rect
            x="240"
            y="148"
            width="220"
            height="18"
            rx="4"
            fill="#B8B8C2"
          />
          {/* Side panel lines */}
          <line
            x1="245"
            y1="190"
            x2="455"
            y2="190"
            stroke="rgba(0,0,0,0.18)"
            strokeWidth="1"
          />
          <line
            x1="245"
            y1="220"
            x2="455"
            y2="220"
            stroke="rgba(0,0,0,0.18)"
            strokeWidth="1"
          />

          {/* Sensor cluster — front (HC-SR04 "eyes") */}
          <g transform="translate(450, 195)">
            <rect width="40" height="22" rx="4" fill="#1c1c22" />
            <circle cx="12" cy="11" r="6" fill="#0c0c12" stroke="rgba(170, 210, 255, 0.7)" />
            <circle cx="28" cy="11" r="6" fill="#0c0c12" stroke="rgba(170, 210, 255, 0.7)" />
            <circle cx="12" cy="11" r="2.5" fill="#FFFFFF" filter="url(#rmGlow)" />
            <circle cx="28" cy="11" r="2.5" fill="#FFFFFF" filter="url(#rmGlow)" />
          </g>

          {/* Status LED */}
          <motion.circle
            cx="350"
            cy="146"
            r="4"
            fill="#4ADE80"
            initial={{ opacity: 0.4 }}
            animate={{ opacity: [0.4, 1, 0.4] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          />

          {/* Sensor mast */}
          <rect x="252" y="120" width="3" height="30" fill="#D8D8E0" />
          <circle cx="253.5" cy="118" r="5" fill="#FFFFFF" filter="url(#rmGlow)" />

          {/* Heat-sink / vent grid */}
          <g transform="translate(280, 230)" opacity="0.55">
            {[0, 12, 24, 36, 48, 60, 72, 84, 96, 108, 120].map((x) => (
              <rect
                key={x}
                x={x}
                y={0}
                width="6"
                height="20"
                rx="1"
                fill="#3a3a44"
              />
            ))}
          </g>
        </g>

        {/* Wheels (6) */}
        {[100, 180, 280, 420, 520, 600].map((cx, i) => {
          const Wheel = (
            <g>
              <circle
                cx={cx}
                cy={330}
                r="36"
                fill="url(#rmWheel)"
                stroke="rgba(0,0,0,0.35)"
                strokeWidth="1.5"
              />
              {/* tire tread */}
              {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(
                (deg) => {
                  const rad = (deg * Math.PI) / 180;
                  const x1 = cx + Math.cos(rad) * 30;
                  const y1 = 330 + Math.sin(rad) * 30;
                  const x2 = cx + Math.cos(rad) * 36;
                  const y2 = 330 + Math.sin(rad) * 36;
                  return (
                    <line
                      key={deg}
                      x1={x1}
                      y1={y1}
                      x2={x2}
                      y2={y2}
                      stroke="rgba(0,0,0,0.45)"
                      strokeWidth="2"
                    />
                  );
                }
              )}
              {/* hub */}
              <circle cx={cx} cy={330} r="10" fill="url(#rmHub)" />
              {/* spokes */}
              <line
                x1={cx - 24}
                y1={330}
                x2={cx + 24}
                y2={330}
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="2"
              />
              <line
                x1={cx}
                y1={306}
                x2={cx}
                y2={354}
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="2"
              />
            </g>
          );
          if (!wheelsSpin) return <g key={cx}>{Wheel}</g>;
          return (
            <motion.g
              key={cx}
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.04,
              }}
              style={{ transformOrigin: `${cx}px 330px` }}
            >
              {Wheel}
            </motion.g>
          );
        })}

        {/* Sensor cone in front */}
        <motion.path
          d="M 490 206 L 690 160 L 690 252 Z"
          fill="rgba(170, 210, 255, 0.06)"
          stroke="rgba(170, 210, 255, 0.5)"
          strokeWidth="1"
          strokeDasharray="3 5"
          initial={{ opacity: 0.3 }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 2.4, repeat: Infinity }}
        />
      </svg>
    </motion.div>
  );
}
