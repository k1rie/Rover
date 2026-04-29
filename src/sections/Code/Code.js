"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import SectionHeader from "@/components/SectionHeader/SectionHeader";
import CodeBlock from "@/components/CodeBlock/CodeBlock";
import styles from "./Code.module.css";

const steps = [
  {
    id: "setup",
    label: "1 · setup()",
    title: "Inicialización del hardware",
    description:
      "Al energizar el sistema, el firmware ejecuta una secuencia de inicialización: configura el LED de estado, los pines PWM de los motores y los pines del sensor ultrasónico. A continuación intenta establecer la conexión WiFi. El color del LED informa el estado del sistema: blanco durante el arranque, azul si conectó a la red primaria, verde si conectó a la red de respaldo, rojo si no logró establecer conexión.",
    file: "setup.cpp",
    code: `// setup() — se ejecuta una sola vez al encender
void setup() {
  // LED -> blanco mientras arranca
  strip.begin();
  strip.setPixelColor(0, strip.Color(255, 255, 255));
  strip.show();

  // Motores: PWM 1 kHz, 8 bits (0-255)
  ledcAttach(MOTOR_A_RPWM_PIN, 1000, 8);
  ledcAttach(MOTOR_A_LPWM_PIN, 1000, 8);
  ledcAttach(MOTOR_B_RPWM_PIN, 1000, 8);
  ledcAttach(MOTOR_B_LPWM_PIN, 1000, 8);
  ledcWrite(MOTOR_A_RPWM_PIN, 0);
  ledcWrite(MOTOR_A_LPWM_PIN, 0);
  ledcWrite(MOTOR_B_RPWM_PIN, 0);
  ledcWrite(MOTOR_B_LPWM_PIN, 0);

  // Sensor ultrasonico
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
}`,
  },
  {
    id: "wifi",
    label: "2 · WiFi con respaldo",
    title: "Conexión con red de respaldo",
    description:
      "El firmware implementa un mecanismo de failover entre dos redes WiFi configuradas. Intenta primero la red primaria durante hasta diez segundos (veinte intentos de 500 ms). Si no obtiene respuesta, intenta la red secundaria con el mismo procedimiento. Esta estrategia permite operar en distintos entornos sin recompilar el firmware.",
    file: "wifi.cpp",
    code: `// WiFi: intenta red 1, luego red 2
WiFi.begin(WIFI_SSID_1, WIFI_PASS_1);
int intentos = 0;
while (WiFi.status() != WL_CONNECTED && intentos < 20) {
  delay(500);
  intentos++;
}

if (WiFi.status() == WL_CONNECTED) {
  strip.setPixelColor(0, strip.Color(0, 0, 255));   // Azul = red 1 OK
} else {
  WiFi.begin(WIFI_SSID_2, WIFI_PASS_2);
  intentos = 0;
  while (WiFi.status() != WL_CONNECTED && intentos < 20) {
    delay(500);
    intentos++;
  }
  if (WiFi.status() == WL_CONNECTED) {
    strip.setPixelColor(0, strip.Color(0, 255, 0)); // Verde = red 2 OK
  } else {
    strip.setPixelColor(0, strip.Color(255, 0, 0)); // Rojo = sin WiFi
  }
}
strip.show();`,
  },
  {
    id: "post",
    label: "3 · Comando HTTP POST",
    title: "Recepción de comandos del operador",
    description:
      "El operador envía un mensaje JSON con dos componentes normalizadas: throttle en el rango [-1, +1] (avance y retroceso) y steer en el rango [-1, +1] (giro a la izquierda y a la derecha). El servidor valida la estructura del mensaje, calcula las velocidades por lado y responde con la distancia medida por el sensor ultrasónico.",
    file: "controller.cpp",
    code: `// throttle: -1.0 (atras) ... +1.0 (adelante)
// steer:    -1.0 (izq)   ... +1.0 (derecha)
void handlePostData() {
  if (!server.hasArg("plain")) {
    server.send(400, "application/json", "{\\"error\\":\\"Sin cuerpo\\"}");
    return;
  }
  StaticJsonDocument<256> doc;
  DeserializationError err = deserializeJson(doc, server.arg("plain"));
  if (err) {
    server.send(400, "application/json", "{\\"error\\":\\"JSON invalido\\"}");
    return;
  }
  float throttle = doc["axes"][0] | 0.0f;
  float steer    = doc["axes"][1] | 0.0f;`,
  },
  {
    id: "mix",
    label: "4 · Mezcla diferencial",
    title: "Cálculo de velocidad por lado",
    description:
      "Se aplica la ecuación clásica del control diferencial: la velocidad de cada lado del vehículo se obtiene como la suma o resta de las componentes throttle y steer. Los valores se acotan al intervalo [-1, +1] para no exceder el rango del PWM. La rigidez lateral del Rocker-Bogie permite efectuar el giro diferencial sin deslizamiento significativo.",
    file: "mix.cpp",
    code: `// Mezcla diferencial
// Convierte throttle+steer en velocidad independiente por lado.
float velIzq = constrain(throttle + steer, -1.0f, 1.0f);
float velDer = constrain(throttle - steer, -1.0f, 1.0f);
setMotores(velIzq, velDer);

// Responde con la distancia actual para monitoreo opcional
long dist = medirDistancia();
String respuesta = "{\\"status\\":\\"ok\\",\\"distancia_cm\\":" + String(dist) + "}";
server.send(200, "application/json", respuesta);`,
  },
  {
    id: "loop",
    label: "5 · loop()",
    title: "Atención continua del servidor",
    description:
      "El bucle principal del firmware tiene una única responsabilidad: despachar las peticiones HTTP entrantes. Toda la lógica de control está encapsulada en los manejadores de cada endpoint. Esta arquitectura simplifica el mantenimiento del firmware y facilita su extensión con endpoints adicionales para telemetría o calibración.",
    file: "loop.cpp",
    code: `// Servidor HTTP
server.on("/controller", HTTP_POST, handlePostData);
server.begin();

// loop() — atiende clientes HTTP continuamente
void loop() {
  server.handleClient();
}`,
  },
];

export default function Code() {
  const [active, setActive] = useState(steps[0].id);
  const current = steps.find((s) => s.id === active) || steps[0];

  return (
    <section id="codigo" className={`section ${styles.section}`}>
      <div className="container">
        <SectionHeader
          eyebrow="07 · Implementación"
          title="Firmware del microcontrolador."
          description="El firmware se desarrolla sobre la plataforma Arduino IDE con soporte para ESP32. La arquitectura del software se estructura en cinco bloques principales que se ejecutan en el orden indicado. A continuación se explica cada uno con su finalidad y justificación dentro del sistema."
        />

        <div className={styles.layout}>
          <aside className={styles.steps} aria-label="Pasos del firmware">
            {steps.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`${styles.step} ${
                  active === s.id ? styles.stepActive : ""
                }`}
                aria-pressed={active === s.id}
              >
                <span className={`mono ${styles.stepNum}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className={styles.stepText}>
                  <span className={styles.stepLabel}>{s.label}</span>
                  <span className={styles.stepTitle}>{s.title}</span>
                </div>
                <span
                  className={styles.stepDot}
                  aria-hidden="true"
                />
              </button>
            ))}
          </aside>

          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={styles.right}
          >
            <div className={styles.rightHead}>
              <p className="eyebrow">{current.label}</p>
              <h3 className={styles.rightTitle}>{current.title}</h3>
              <p className={`body ${styles.rightDesc}`}>{current.description}</p>
            </div>
            <CodeBlock code={current.code} title={current.file} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
