/*
 * ================================================================
 * ROVER UNACH — Firmware con DIAGNÓSTICO completo
 * ================================================================
 *
 * COMANDOS DE TEST (Serial Monitor 115200 baud)
 * ────────────────────────────────────────────────
 *   h → ayuda
 *   l → test LED (cicla colores)
 *   1 → motores IZQUIERDOS adelante/atrás
 *   2 → motores DERECHOS adelante/atrás
 *   3 → ambos motores juntos
 *   s → servos barrido completo
 *   d → leer distancia del sensor
 *   t → test completo
 *   p → PARAR todo (emergencia)
 *
 * COMANDOS DE DIAGNÓSTICO (nuevos)
 * ────────────────────────────────────────────────
 *   v → estado VERBOSE del sistema (todo)
 *   r → razón del último reset
 *   m → motor IZQ ramp (0 → 100 % despacio, 5 seg)
 *   b → motor IZQ BURST (100 % por 200 ms, 3 veces)
 *   i → estado de pines GPIO en tiempo real
 *   w → estado WiFi
 *
 * El LED azul integrado del ESP32 (GPIO 2) parpadea como heartbeat.
 * Si NO parpadea, el chip se colgó.
 *
 * Librerías: Adafruit NeoPixel · ESP32Servo · ArduinoJson v7
 * Placa: ESP32 Dev Module
 * ================================================================
 */

#include <WiFi.h>
#include <WebServer.h>
#include <ArduinoJson.h>
#include <ESP32Servo.h>
#include <Adafruit_NeoPixel.h>
#include <esp_system.h>
#include <esp_chip_info.h>
#include <esp_heap_caps.h>

// =====================================================
// CONFIGURACIÓN
// =====================================================
const char* WIFI_SSID_1 = "Diego’s iPhone";
const char* WIFI_PASS_1 = "Diego1233";

const char* WIFI_SSID_2 = "S24 de J";
const char* WIFI_PASS_2 = "chiapasionate";

const long  UMBRAL_HUECO_CM = 30;     // distancia para considerar hueco
const int   PWM_FREQ        = 1000;   // 1 kHz para motores
const int   PWM_RES         = 8;      // 0..255

// =====================================================
// PINES
// =====================================================
#define MOTOR_IZQ_RPWM  25   // adelante izq
#define MOTOR_IZQ_LPWM  26   // atrás izq
#define MOTOR_DER_RPWM  27   // adelante der
#define MOTOR_DER_LPWM  14   // atrás der

#define SERVO_FL_PIN  32     // delantero izq
#define SERVO_FR_PIN  33     // delantero der
#define SERVO_RL_PIN  19     // trasero izq
#define SERVO_RR_PIN  23     // trasero der

#define TRIG_PIN       5
#define ECHO_PIN      18
#define NEOPIXEL_PIN   4
#define STATUS_LED     2     // LED azul integrado del ESP32 (heartbeat)

// =====================================================
// OBJETOS GLOBALES
// =====================================================
WebServer            server(80);
Adafruit_NeoPixel    led(1, NEOPIXEL_PIN, NEO_GRB + NEO_KHZ800);
Servo                sFL, sFR, sRL, sRR;

unsigned long        ultimoComando    = 0;
unsigned long        ultimoHeartbeat  = 0;
const unsigned long  TIMEOUT_MS       = 1000;
const unsigned long  HEARTBEAT_MS     = 1000;
bool                 wifiOK           = false;
bool                 ledStatusOn      = false;
unsigned long        contadorReinicios= 0;

// =====================================================
// HTML EMBEBIDO (joystick web)
// =====================================================
const char HTML_PAGE[] PROGMEM = R"rawliteral(
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
<title>Rover UNACH</title>
<style>
*{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
body{background:#07070A;color:#fff;font-family:-apple-system,sans-serif;margin:0;padding:20px;touch-action:none;overflow:hidden;height:100vh}
h1{font-size:18px;text-align:center;margin:0 0 4px}
.sub{color:#888;font-size:12px;text-align:center;margin-bottom:24px}
.stat{font-family:monospace;font-size:13px;text-align:center;margin-bottom:12px;color:#FF7A1A;min-height:18px}
.pad{width:280px;height:280px;background:radial-gradient(circle,#16161D,#0a0a0e);border:2px solid #FF7A1A;border-radius:50%;position:relative;margin:0 auto;box-shadow:0 0 40px rgba(255,122,26,.18)}
.stick{width:80px;height:80px;background:linear-gradient(135deg,#FF9248,#C04F0F);border-radius:50%;position:absolute;top:100px;left:100px}
.row{display:flex;gap:8px;justify-content:center;margin-top:20px;flex-wrap:wrap}
button{background:#16161D;color:#fff;border:1px solid #333;padding:14px 16px;border-radius:10px;font-size:14px;flex:1 1 100px;max-width:140px}
button:active{background:#FF7A1A;color:#000}
.led{display:inline-block;width:8px;height:8px;border-radius:50%;background:#4ADE80;margin-right:6px}
</style>
</head>
<body>
<h1>🚀 ROVER<span style="color:#FF7A1A">UNACH</span></h1>
<p class="sub">Arrastra el joystick · botones rotan los servos</p>
<p class="stat" id="stat"><span class="led"></span>Conectado</p>
<div class="pad" id="pad"><div class="stick" id="stick"></div></div>
<div class="row">
  <button onclick="setS(-45)">⟲ Pivote</button>
  <button onclick="setS(0)">↑ Recto</button>
  <button onclick="setS(45)">Pivote ⟳</button>
</div>
<div class="row">
  <button onclick="setS(90)">← Lateral</button>
  <button onclick="setS(-90)">Lateral →</button>
</div>
<script>
const pad=document.getElementById('pad'),stick=document.getElementById('stick'),stat=document.getElementById('stat');
let t=0,s=0,act=false;
function move(x,y){stick.style.left=(100+x*100)+'px';stick.style.top=(100+y*100)+'px';}
function fe(e){const r=pad.getBoundingClientRect();const cx=(e.clientX-r.left)/r.width*2-1,cy=(e.clientY-r.top)/r.height*2-1;s=Math.max(-1,Math.min(1,cx));t=Math.max(-1,Math.min(1,-cy));move(s,-t);}
pad.addEventListener('pointerdown',e=>{act=true;pad.setPointerCapture(e.pointerId);fe(e);});
pad.addEventListener('pointermove',e=>{if(act)fe(e);});
pad.addEventListener('pointerup',()=>{act=false;t=0;s=0;move(0,0);});
pad.addEventListener('pointercancel',()=>{act=false;t=0;s=0;move(0,0);});
async function setS(a){try{await fetch('/steering',{method:'POST',body:JSON.stringify({angulo:a})});}catch(e){}}
setInterval(async()=>{
  try{const r=await fetch('/controller',{method:'POST',body:JSON.stringify({axes:[t,s]})});const d=await r.json();
  stat.innerHTML=`<span class="led" style="background:${d.status==='ok'?'#4ADE80':'#F87171'}"></span>${d.status} · dist ${d.distancia_cm>=0?d.distancia_cm+'cm':'??'}`;
  }catch(e){stat.innerHTML='<span class="led" style="background:#F87171"></span>sin conexión';}
},120);
</script>
</body>
</html>
)rawliteral";

// =====================================================
// HELPERS BÁSICOS
// =====================================================
inline float clampf(float v, float lo, float hi) {
  return v < lo ? lo : (v > hi ? hi : v);
}

void setColor(uint8_t r, uint8_t g, uint8_t b) {
  led.setPixelColor(0, led.Color(r, g, b));
  led.show();
}

void aplicarMotor(int pinR, int pinL, float vel) {
  vel = clampf(vel, -1.0f, 1.0f);
  int duty = (int)(fabs(vel) * 255);
  if (vel >= 0) {
    ledcWrite(pinR, duty);
    ledcWrite(pinL, 0);
  } else {
    ledcWrite(pinR, 0);
    ledcWrite(pinL, duty);
  }
}

void setMotores(float velIzq, float velDer) {
  aplicarMotor(MOTOR_IZQ_RPWM, MOTOR_IZQ_LPWM, velIzq);
  aplicarMotor(MOTOR_DER_RPWM, MOTOR_DER_LPWM, velDer);
}

void parar() {
  setMotores(0, 0);
}

void setServos(int angulo) {
  angulo = constrain(angulo, -90, 90);
  int pos = angulo + 90;
  sFL.write(pos);
  sFR.write(pos);
  sRL.write(pos);
  sRR.write(pos);
}

long medirDistanciaCm() {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);
  long us = pulseIn(ECHO_PIN, HIGH, 30000);
  return us > 0 ? us / 58 : -1;
}

// =====================================================
// FUNCIONES DE TEST
// =====================================================
void testLED() {
  Serial.println("[TEST] LED — ciclo de colores (5 seg)");
  setColor(255, 0, 0);   delay(800);  Serial.println("  rojo");
  setColor(0, 255, 0);   delay(800);  Serial.println("  verde");
  setColor(0, 0, 255);   delay(800);  Serial.println("  azul");
  setColor(255, 255, 0); delay(800);  Serial.println("  amarillo");
  setColor(255, 255, 255); delay(800); Serial.println("  blanco");
  setColor(0, 0, 0);
  Serial.println("[TEST] LED OK\n");
}

void testMotor(const char* lado, int pinR, int pinL) {
  Serial.printf("[TEST] Motor %s ── adelante 1.5s\n", lado);
  ledcWrite(pinR, 180);
  ledcWrite(pinL, 0);
  delay(1500);

  ledcWrite(pinR, 0);
  ledcWrite(pinL, 0);
  delay(300);

  Serial.printf("[TEST] Motor %s ── atrás 1.5s\n", lado);
  ledcWrite(pinR, 0);
  ledcWrite(pinL, 180);
  delay(1500);

  ledcWrite(pinR, 0);
  ledcWrite(pinL, 0);
  Serial.printf("[TEST] Motor %s OK\n\n", lado);
}

void testTodosMotores() {
  Serial.println("[TEST] Ambos motores ── adelante 1.5s");
  setMotores(0.7f, 0.7f);
  delay(1500);
  parar();
  delay(300);

  Serial.println("[TEST] Ambos motores ── atrás 1.5s");
  setMotores(-0.7f, -0.7f);
  delay(1500);
  parar();
  delay(300);

  Serial.println("[TEST] Giro a la derecha 1s");
  setMotores(0.6f, -0.6f);
  delay(1000);
  parar();
  delay(300);

  Serial.println("[TEST] Giro a la izquierda 1s");
  setMotores(-0.6f, 0.6f);
  delay(1000);
  parar();
  Serial.println("[TEST] Motores OK\n");
}

void testServos() {
  Serial.println("[TEST] Servos — barrido -45° a +45°");
  for (int a = -45; a <= 45; a += 5) {
    setServos(a);
    delay(40);
  }
  delay(500);
  Serial.println("[TEST] Servos — regreso a 0°");
  for (int a = 45; a >= 0; a -= 5) {
    setServos(a);
    delay(40);
  }
  setServos(0);
  Serial.println("[TEST] Servos OK\n");
}

void testSensor() {
  Serial.println("[TEST] Sensor — 5 lecturas");
  for (int i = 0; i < 5; i++) {
    long d = medirDistanciaCm();
    if (d < 0) {
      Serial.printf("  lectura %d: SIN ECO (sensor desconectado o nada al frente)\n", i + 1);
    } else {
      Serial.printf("  lectura %d: %ld cm\n", i + 1, d);
    }
    delay(300);
  }
  Serial.println("[TEST] Sensor terminado\n");
}

void testCompleto() {
  Serial.println("\n========== TEST COMPLETO ==========\n");
  testLED();
  testServos();
  testMotor("IZQ", MOTOR_IZQ_RPWM, MOTOR_IZQ_LPWM);
  testMotor("DER", MOTOR_DER_RPWM, MOTOR_DER_LPWM);
  testTodosMotores();
  testSensor();
  Serial.println("========== TEST COMPLETO OK ==========\n");
}

void mostrarAyuda() {
  Serial.println("\n╔══════════ COMANDOS ══════════╗");
  Serial.println(" TESTS:");
  Serial.println("  h → esta ayuda");
  Serial.println("  l → test LED (colores)");
  Serial.println("  1 → test motores IZQUIERDOS");
  Serial.println("  2 → test motores DERECHOS");
  Serial.println("  3 → test ambos motores");
  Serial.println("  s → test servos (barrido)");
  Serial.println("  d → leer distancia sensor");
  Serial.println("  t → test COMPLETO");
  Serial.println("  p → PARAR todo");
  Serial.println(" DIAGNÓSTICO:");
  Serial.println("  v → estado VERBOSE completo");
  Serial.println("  r → razón del último reset");
  Serial.println("  m → motor IZQ ramp 0→100%");
  Serial.println("  b → motor IZQ BURST 100%");
  Serial.println("  i → estado de GPIOs en vivo");
  Serial.println("  w → estado WiFi");
  Serial.println("╚══════════════════════════════╝\n");
}

// =====================================================
// FUNCIONES DE DIAGNÓSTICO
// =====================================================

const char* nombreReset(esp_reset_reason_t r) {
  switch (r) {
    case ESP_RST_POWERON:   return "POWERON (encendido normal)";
    case ESP_RST_EXT:       return "EXT (botón de reset)";
    case ESP_RST_SW:        return "SW (reinicio por software)";
    case ESP_RST_PANIC:     return "PANIC ⚠️ (crash de código)";
    case ESP_RST_INT_WDT:   return "INT_WDT (watchdog interno)";
    case ESP_RST_TASK_WDT:  return "TASK_WDT (watchdog de tarea)";
    case ESP_RST_WDT:       return "WDT (watchdog)";
    case ESP_RST_DEEPSLEEP: return "DEEPSLEEP";
    case ESP_RST_BROWNOUT:  return "BROWNOUT ⚠️ (caída de voltaje)";
    case ESP_RST_SDIO:      return "SDIO";
    default:                return "DESCONOCIDO";
  }
}

void mostrarRazonReset() {
  esp_reset_reason_t r = esp_reset_reason();
  Serial.printf("[RESET] razón: %s\n", nombreReset(r));
  if (r == ESP_RST_BROWNOUT) {
    Serial.println("  ⚠️ El ESP32 se reinició por CAÍDA DE VOLTAJE.");
    Serial.println("  → La fuente no puede entregar suficiente corriente.");
    Serial.println("  → Solución: USB del laptop, powerbank, o");
    Serial.println("    aumenta capacitor de la salida del UBEC/reductor.");
  }
  Serial.println();
}

void mostrarVerbose() {
  Serial.println("\n╔════════ ESTADO COMPLETO ════════╗");
  Serial.printf(" Uptime:        %.1f seg\n", millis() / 1000.0);
  Serial.printf(" Reset razón:   %s\n", nombreReset(esp_reset_reason()));
  Serial.printf(" Heap libre:    %d bytes (%.1f%%)\n",
                ESP.getFreeHeap(),
                100.0 * ESP.getFreeHeap() / ESP.getHeapSize());
  Serial.printf(" Heap total:    %d bytes\n", ESP.getHeapSize());
  Serial.printf(" CPU freq:      %d MHz\n", getCpuFrequencyMhz());
  Serial.printf(" Chip rev:      %d\n", ESP.getChipRevision());
  Serial.printf(" Flash size:    %d MB\n", ESP.getFlashChipSize() / 1024 / 1024);

  Serial.println("\n  WiFi:");
  if (WiFi.status() == WL_CONNECTED) {
    Serial.printf("    SSID:        %s\n", WiFi.SSID().c_str());
    Serial.printf("    IP:          %s\n", WiFi.localIP().toString().c_str());
    Serial.printf("    Gateway:     %s\n", WiFi.gatewayIP().toString().c_str());
    Serial.printf("    RSSI:        %d dBm  (mejor cerca de 0)\n", WiFi.RSSI());
    Serial.printf("    MAC:         %s\n", WiFi.macAddress().c_str());
  } else {
    Serial.println("    DESCONECTADO");
  }

  Serial.println("\n  Pines de motores (estado lógico):");
  Serial.printf("    GPIO %d (IZQ_RPWM): %s\n", MOTOR_IZQ_RPWM,
                digitalRead(MOTOR_IZQ_RPWM) ? "HIGH" : "LOW");
  Serial.printf("    GPIO %d (IZQ_LPWM): %s\n", MOTOR_IZQ_LPWM,
                digitalRead(MOTOR_IZQ_LPWM) ? "HIGH" : "LOW");
  Serial.printf("    GPIO %d (DER_RPWM): %s\n", MOTOR_DER_RPWM,
                digitalRead(MOTOR_DER_RPWM) ? "HIGH" : "LOW");
  Serial.printf("    GPIO %d (DER_LPWM): %s\n", MOTOR_DER_LPWM,
                digitalRead(MOTOR_DER_LPWM) ? "HIGH" : "LOW");

  Serial.println("\n  Sensor HC-SR04:");
  long d = medirDistanciaCm();
  if (d < 0) Serial.println("    SIN ECO (no conectado o nada al frente)");
  else       Serial.printf("    %ld cm\n", d);

  Serial.println("╚══════════════════════════════════╝\n");
}

void testMotorRamp() {
  Serial.println("[RAMP] Motor IZQ subiendo despacio 0 → 100% en 5 seg");
  Serial.println("       Si no oyes ni sientes nada al 100%, el motor");
  Serial.println("       no está recibiendo corriente.\n");

  for (int duty = 0; duty <= 255; duty += 5) {
    ledcWrite(MOTOR_IZQ_RPWM, duty);
    ledcWrite(MOTOR_IZQ_LPWM, 0);
    Serial.printf("  PWM = %3d  (%2d %%)\n", duty, (duty * 100) / 255);
    delay(100);
  }

  Serial.println("[RAMP] Manteniendo 100% por 1 seg...");
  delay(1000);
  ledcWrite(MOTOR_IZQ_RPWM, 0);
  ledcWrite(MOTOR_IZQ_LPWM, 0);
  Serial.println("[RAMP] Apagado\n");
}

void testMotorBurst() {
  Serial.println("[BURST] Motor IZQ a 100% por 200 ms x 3 veces");
  Serial.println("        Si no se mueve a 100%, no llega corriente al motor.\n");

  for (int i = 1; i <= 3; i++) {
    Serial.printf("  Burst %d ── ON\n", i);
    ledcWrite(MOTOR_IZQ_RPWM, 255);
    ledcWrite(MOTOR_IZQ_LPWM, 0);
    delay(200);
    ledcWrite(MOTOR_IZQ_RPWM, 0);
    ledcWrite(MOTOR_IZQ_LPWM, 0);
    Serial.printf("  Burst %d ── OFF\n", i);
    delay(400);
  }
  Serial.println("[BURST] Terminado\n");
}

void testGPIOs() {
  Serial.println("[GPIO] Toggle de cada pin de motor por 500 ms");
  Serial.println("       Mide con multímetro entre el pin y GND.");
  Serial.println("       Debe leer cerca de 3.3 V cuando esté HIGH.\n");

  int pines[] = {MOTOR_IZQ_RPWM, MOTOR_IZQ_LPWM, MOTOR_DER_RPWM, MOTOR_DER_LPWM};
  const char* nombres[] = {"IZQ_RPWM", "IZQ_LPWM", "DER_RPWM", "DER_LPWM"};

  for (int i = 0; i < 4; i++) {
    Serial.printf("  GPIO %d (%s) ── HIGH (3.3V)\n", pines[i], nombres[i]);
    ledcWrite(pines[i], 255);  // 100% duty = HIGH constante
    delay(500);
    ledcWrite(pines[i], 0);
    Serial.printf("  GPIO %d (%s) ── LOW  (0V)\n", pines[i], nombres[i]);
    delay(200);
  }
  Serial.println("[GPIO] Terminado — ningun motor debió moverse durante esta prueba.\n");
}

void heartbeat() {
  unsigned long ahora = millis();
  if (ahora - ultimoHeartbeat < HEARTBEAT_MS) return;
  ultimoHeartbeat = ahora;
  ledStatusOn = !ledStatusOn;
  digitalWrite(STATUS_LED, ledStatusOn ? HIGH : LOW);
}

void mostrarEstadoWiFi() {
  if (WiFi.status() == WL_CONNECTED) {
    Serial.printf("[WiFi] %s · IP: %s · señal: %d dBm\n",
                  WiFi.SSID().c_str(),
                  WiFi.localIP().toString().c_str(),
                  WiFi.RSSI());
  } else {
    Serial.println("[WiFi] DESCONECTADO");
  }
}

void procesarSerial() {
  if (!Serial.available()) return;
  char c = Serial.read();
  switch (c) {
    case 'h': case 'H': case '?': mostrarAyuda(); break;
    case 'l': case 'L': testLED(); break;
    case '1':           testMotor("IZQ", MOTOR_IZQ_RPWM, MOTOR_IZQ_LPWM); break;
    case '2':           testMotor("DER", MOTOR_DER_RPWM, MOTOR_DER_LPWM); break;
    case '3':           testTodosMotores(); break;
    case 's': case 'S': testServos(); break;
    case 'd': case 'D': testSensor(); break;
    case 't': case 'T': testCompleto(); break;
    case 'p': case 'P':
      parar();
      setServos(0);
      setColor(255, 0, 0);
      Serial.println("[STOP] todo parado\n");
      break;
    case 'w': case 'W': mostrarEstadoWiFi(); break;
    // Comandos de diagnóstico
    case 'v': case 'V': mostrarVerbose(); break;
    case 'r': case 'R': mostrarRazonReset(); break;
    case 'm': case 'M': testMotorRamp(); break;
    case 'b': case 'B': testMotorBurst(); break;
    case 'i': case 'I': testGPIOs(); break;
    case '\n': case '\r': case ' ': break;
    default:
      Serial.printf("[?] '%c' no reconocido. Escribe 'h' para ayuda.\n", c);
  }
}

// =====================================================
// HANDLERS HTTP (joystick web)
// =====================================================
void handleRoot() {
  server.send_P(200, "text/html; charset=utf-8", HTML_PAGE);
}

void handleController() {
  if (!server.hasArg("plain")) {
    server.send(400, "application/json", "{\"error\":\"sin cuerpo\"}");
    return;
  }
  JsonDocument doc;
  if (deserializeJson(doc, server.arg("plain"))) {
    server.send(400, "application/json", "{\"error\":\"json invalido\"}");
    return;
  }

  float throttle = doc["axes"][0] | 0.0f;
  float steer    = doc["axes"][1] | 0.0f;

  long dist = medirDistanciaCm();
  bool hayHueco = (dist > UMBRAL_HUECO_CM) && (throttle > 0.05);

  if (hayHueco) {
    parar();
    setColor(255, 0, 0);
    String r = "{\"status\":\"STOP\",\"razon\":\"hueco\",\"distancia_cm\":" + String(dist) + "}";
    server.send(200, "application/json", r);
    return;
  }

  float velIzq = clampf(throttle + steer, -1.0f, 1.0f);
  float velDer = clampf(throttle - steer, -1.0f, 1.0f);
  setMotores(velIzq, velDer);

  if (fabs(velIzq) > 0.05 || fabs(velDer) > 0.05) {
    setColor(0, 200, 0);
  } else {
    setColor(0, 30, 60);
  }

  ultimoComando = millis();
  String r = "{\"status\":\"ok\",\"distancia_cm\":" + String(dist) +
             ",\"vel\":[" + String(velIzq, 2) + "," + String(velDer, 2) + "]}";
  server.send(200, "application/json", r);
}

void handleSteering() {
  if (!server.hasArg("plain")) {
    server.send(400, "application/json", "{\"error\":\"sin cuerpo\"}");
    return;
  }
  JsonDocument doc;
  if (deserializeJson(doc, server.arg("plain"))) {
    server.send(400, "application/json", "{\"error\":\"json invalido\"}");
    return;
  }
  int angulo = doc["angulo"] | 0;
  setServos(angulo);
  server.send(200, "application/json",
              "{\"status\":\"ok\",\"angulo\":" + String(angulo) + "}");
}

// =====================================================
// SETUP
// =====================================================
void setup() {
  Serial.begin(115200);
  delay(300);
  Serial.println("\n\n╔════════════════════════════╗");
  Serial.println("║   ROVER UNACH — booting   ║");
  Serial.println("╚════════════════════════════╝\n");

  // Razón del último reset (CRÍTICO para diagnosticar brown-out)
  mostrarRazonReset();

  // LED de estado integrado (heartbeat)
  pinMode(STATUS_LED, OUTPUT);
  digitalWrite(STATUS_LED, LOW);

  // NeoPixel (opcional)
  led.begin();
  setColor(255, 255, 255);  // blanco arrancando

  // PWM motores (1 kHz, 8 bits)
  ledcAttach(MOTOR_IZQ_RPWM, PWM_FREQ, PWM_RES);
  ledcAttach(MOTOR_IZQ_LPWM, PWM_FREQ, PWM_RES);
  ledcAttach(MOTOR_DER_RPWM, PWM_FREQ, PWM_RES);
  ledcAttach(MOTOR_DER_LPWM, PWM_FREQ, PWM_RES);
  parar();

  // Servos (50 Hz por la librería ESP32Servo)
  sFL.attach(SERVO_FL_PIN);
  sFR.attach(SERVO_FR_PIN);
  sRL.attach(SERVO_RL_PIN);
  sRR.attach(SERVO_RR_PIN);
  setServos(0);

  // Sensor
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  digitalWrite(TRIG_PIN, LOW);

  Serial.println("[init] motores · servos · sensor OK");

  // WiFi failover
  WiFi.mode(WIFI_STA);
  Serial.printf("[WiFi] intentando red 1: %s\n", WIFI_SSID_1);
  WiFi.begin(WIFI_SSID_1, WIFI_PASS_1);
  for (int i = 0; i < 20 && WiFi.status() != WL_CONNECTED; i++) {
    delay(500);
    Serial.print(".");
  }
  Serial.println();

  if (WiFi.status() == WL_CONNECTED) {
    setColor(0, 0, 255);
    wifiOK = true;
  } else {
    Serial.printf("[WiFi] intentando red 2: %s\n", WIFI_SSID_2);
    WiFi.begin(WIFI_SSID_2, WIFI_PASS_2);
    for (int i = 0; i < 20 && WiFi.status() != WL_CONNECTED; i++) {
      delay(500);
      Serial.print(".");
    }
    Serial.println();
    if (WiFi.status() == WL_CONNECTED) {
      setColor(0, 255, 0);
      wifiOK = true;
    } else {
      setColor(255, 0, 0);
      Serial.println("[WiFi] sin conexión — solo modo TEST por Serial");
    }
  }

  if (wifiOK) {
    Serial.printf("[WiFi] OK · IP: %s\n", WiFi.localIP().toString().c_str());
    server.on("/",          HTTP_GET,  handleRoot);
    server.on("/controller", HTTP_POST, handleController);
    server.on("/steering",   HTTP_POST, handleSteering);
    server.begin();
    Serial.println("[HTTP] servidor en puerto 80");
  }

  ultimoComando = millis();
  mostrarAyuda();   // imprime los comandos al arrancar
}

// =====================================================
// LOOP
// =====================================================
void loop() {
  if (wifiOK) server.handleClient();
  procesarSerial();
  heartbeat();   // parpadea el LED azul integrado cada segundo

  // Watchdog: si no recibimos comandos web por 1s, frenar motores
  if (wifiOK && millis() - ultimoComando > TIMEOUT_MS) {
    aplicarMotor(MOTOR_IZQ_RPWM, MOTOR_IZQ_LPWM, 0);
    aplicarMotor(MOTOR_DER_RPWM, MOTOR_DER_LPWM, 0);
  }
}
