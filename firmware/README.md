# Firmware del Rover — Arduino IDE

Sketch listo para compilar y subir desde Arduino IDE al ESP32. Incluye control
diferencial de motores, dirección por servos, sensor HC-SR04, LED de estado y
una interfaz web embebida (no necesitas app, abres una URL desde el celular).

## Setup en Arduino IDE (15 minutos, una sola vez)

### 1. Instalar Arduino IDE

Descarga la última versión 2.x desde [arduino.cc/en/software](https://arduino.cc/en/software).

### 2. Agregar el soporte para ESP32

1. Abre Arduino IDE.
2. `File → Preferences` (en macOS: `Arduino IDE → Settings`).
3. En **Additional boards manager URLs** pega:
   ```
   https://espressif.github.io/arduino-esp32/package_esp32_index.json
   ```
4. `Tools → Board → Boards Manager`. Busca **esp32** (de Espressif Systems)
   y haz **Install**. Tarda ~5 min.
5. `Tools → Board → ESP32 Arduino → ESP32 Dev Module`.

### 3. Instalar las 3 librerías

`Sketch → Include Library → Manage Libraries`. Busca e instala:

- **Adafruit NeoPixel** (de Adafruit)
- **ESP32Servo** (de Kevin Harrington)
- **ArduinoJson** (de Benoit Blanchon) — versión 7.x

### 4. Driver USB (Windows / Mac)

La mayoría de ESP32 usan el chip **CP2102** o **CH340**. Si tu PC no detecta
el puerto cuando conectas el ESP32, instala el driver:

- CP2102: [silabs.com](https://www.silabs.com/developers/usb-to-uart-bridge-vcp-drivers)
- CH340: [wch-ic.com](https://www.wch-ic.com/downloads/CH341SER_EXE.html)

### 5. Conectar y subir el sketch

1. Conecta el ESP32 con cable USB.
2. `Tools → Port` → selecciona el puerto que apareció (ej. `/dev/cu.usbserial-XXXX` en Mac, `COM3` en Windows).
3. Abre `rover_unach/rover_unach.ino` con Arduino IDE.
4. **Edita las credenciales WiFi** al principio del archivo (líneas 26-32).
5. Click en el botón **Upload** (flecha →). Compila y sube en ~30 segundos.
6. Abre `Tools → Serial Monitor`, baudios **115200**. Verás:
   ```
   [ROVER UNACH] arrancando...
   [WiFi] intento red 1: MI_RED_LAB
   ......
   [WiFi] conectado a red 1 → IP: 192.168.1.42
   [HTTP] servidor en puerto 80
   ```

### 6. Controlar el rover

Desde tu celular (en la misma red WiFi), abre el navegador y entra a:

```
http://192.168.1.42/
```

(reemplaza con la IP que muestre el Serial Monitor)

Verás un joystick virtual. Arrastra para mover. Los botones rotan los servos
para giro en su propio eje y desplazamiento lateral.

---

## Cableado

Mira [WIRING.md](./WIRING.md) para el diagrama de pines.

---

## Estados del LED

| Color | Significado |
|---|---|
| Blanco | Arrancando |
| Azul | Conectado a la red 1 |
| Verde | Conectado a la red 2 (failover) |
| Rojo | Sin WiFi · obstáculo detectado · paro de emergencia |
| Verde brillante | Motores en movimiento |
| Azul tenue | En reposo, esperando comandos |

## Plan de pruebas (haz esto antes de instalar todo en el rover)

Compila y sube **antes** de conectar motores y servos. Verifica en pasos:

1. **LED y serial.** Conecta solo el cable USB. El LED debe parpadear blanco
   y luego rojo (sin WiFi todavía). El Serial Monitor muestra el log de WiFi.

2. **WiFi.** Edita las credenciales y vuelve a subir. El LED debe ponerse
   azul o verde y el Serial Monitor debe mostrar la IP. Abre la IP en el
   navegador — debes ver el joystick (aunque no haya hardware conectado).

3. **HC-SR04.** Conecta solo el sensor. Mueve la mano frente al rover y
   verifica que la distancia cambia en el Serial Monitor.

4. **1 motor.** Conecta UN motor al BTS7960 izquierdo. Mueve el joystick
   hacia adelante: el motor debe girar. Hacia atrás: debe invertirse.

5. **Los 6 motores.** Conecta los 3 izq en paralelo a un BTS7960 y los 3
   der al otro. Asegúrate del polaridad — si un lado gira al revés,
   intercambia los cables del motor.

6. **Servos.** Conecta los 4 servos. Pulsa los botones de pivote y lateral.
   Las ruedas de las esquinas deben rotar al ángulo correspondiente.

## Troubleshooting rápido

- **"Failed to connect to ESP32: Timed out waiting for packet header"**
  Mantén presionado el botón **BOOT** del ESP32 mientras pulsas Upload, suéltalo
  cuando empiece a subir. Algunas placas requieren esto.

- **El ESP32 se reinicia solo cuando arranco motores.**
  Es brown-out por caída de voltaje. Asegúrate de que el ESP32 se alimenta
  por una línea independiente (vía el reductor 12V→5V), no por la misma del motor.

- **Los servos vibran o tiemblan.**
  Falta corriente. Los MG996R consumen mucho — necesitan los 5V del reductor,
  no el 3.3V del ESP32. Comparte GND.

- **Los motores giran al revés.**
  Intercambia los cables del motor en el BTS7960, o cambia los pines RPWM/LPWM
  en el sketch.

- **El sketch compila pero no sube y dice "wrong board".**
  `Tools → Board` debe ser exactamente **"ESP32 Dev Module"** (no Arduino Uno).
