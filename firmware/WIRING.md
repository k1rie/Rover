# Cableado del Rover

## Mapa de pines del ESP32

```
┌───────────── ESP32 DEV MODULE ─────────────┐
│                                             │
│  GPIO 25 ───► BTS7960 IZQ · RPWM           │
│  GPIO 26 ───► BTS7960 IZQ · LPWM           │
│  GPIO 27 ───► BTS7960 DER · RPWM           │
│  GPIO 14 ───► BTS7960 DER · LPWM           │
│                                             │
│  GPIO 32 ───► Servo Front-Left  (señal)    │
│  GPIO 33 ───► Servo Front-Right (señal)    │
│  GPIO 19 ───► Servo Rear-Left   (señal)    │
│  GPIO 23 ───► Servo Rear-Right  (señal)    │
│                                             │
│  GPIO  5 ───► HC-SR04 TRIG                 │
│  GPIO 18 ◄─── HC-SR04 ECHO                 │
│                                             │
│  GPIO  4 ───► NeoPixel DIN                 │
│                                             │
│  3V3      ───► R_EN, L_EN de cada BTS7960  │
│  3V3      ───► VCC del HC-SR04 (también 5V)│
│  5V       ───► VCC NeoPixel · servos       │
│  GND      ───► GND común (CRÍTICO)         │
│                                             │
└─────────────────────────────────────────────┘
```

## Diagrama de potencia

```
                ┌─────────────────────┐
                │  Batería Ovonic 3S  │
                │      11.1 V         │
                └──────────┬──────────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
            ▼              ▼              ▼
   ┌──────────────┐ ┌──────────────┐ ┌──────────────┐
   │ BTS7960 IZQ  │ │ BTS7960 DER  │ │ Reductor     │
   │ VCC = 11.1V  │ │ VCC = 11.1V  │ │ 12V → 5V     │
   └──────┬───────┘ └──────┬───────┘ └──────┬───────┘
          │                │                │
          ▼                ▼                ▼
   3 motores izq     3 motores der    ┌─────┴─────┐
   (paralelo)        (paralelo)       │           │
                                      ▼           ▼
                                 ESP32 5V    Servos × 4
                                              + HC-SR04
                                              + NeoPixel

⚠ TIERRA COMÚN: el GND de la batería, los BTS7960, el reductor y el ESP32
  deben estar conectados entre sí. Sin tierra común, nada funciona bien.
```

## Conexión motor por motor (lado izquierdo, idem derecho)

```
BTS7960 IZQ:
  ┌────────────┐
  │ VCC ───────────► +11.1V batería
  │ GND ───────────► GND común
  │ R_EN ──────────► 3.3V ESP32
  │ L_EN ──────────► 3.3V ESP32
  │ RPWM ──────────► GPIO 25
  │ LPWM ──────────► GPIO 26
  │ M+  ───────────► (+) de los 3 motores izquierdos en paralelo
  │ M-  ───────────► (-) de los 3 motores izquierdos en paralelo
  └────────────┘
```

> Los 3 motores izquierdos van en PARALELO (todos los + juntos, todos los -
> juntos, conectados al M+ y M- del BTS7960). Esto comparte la corriente
> entre los 3 motores y los hace girar juntos como un solo "lado".

## Servos MG996R

Cada servo tiene 3 cables:

| Color | Función | Conexión |
|---|---|---|
| Marrón | GND | GND común |
| Rojo | VCC | 5V (del reductor, NO del ESP32 directo) |
| Naranja/Amarillo | Señal | GPIO 32 / 33 / 19 / 23 según corresponda |

⚠ **No alimentes los servos desde el pin 3.3V o 5V del ESP32**. Los MG996R
pueden consumir hasta 1A cada uno cuando hacen torque. Eso reinicia el ESP32.

## HC-SR04

| Pin sensor | Conexión |
|---|---|
| VCC | 5V (puede ser del reductor) |
| TRIG | GPIO 5 |
| ECHO | GPIO 18 |
| GND | GND común |

> El HC-SR04 trabaja a 5V pero su pin ECHO devuelve una señal de 5V que
> conectada directo al ESP32 (3.3V) podría dañarlo a la larga. Para una
> versión rápida del proyecto suele funcionar sin problema, pero si quieres
> hacerlo bien usa un divisor de voltaje en ECHO (resistencia de 1kΩ entre
> ECHO y GPIO 18, y 2kΩ entre GPIO 18 y GND).

## NeoPixel WS2812 (1 LED de estado)

| Pin LED | Conexión |
|---|---|
| VCC / 5V | 5V del reductor |
| GND | GND común |
| DIN | GPIO 4 |

## Checklist final antes de encender

- [ ] GND de la batería conectado al GND del ESP32
- [ ] R_EN y L_EN de los BTS7960 a 3.3V (no a 5V)
- [ ] Servos alimentados por 5V del reductor, no del ESP32
- [ ] Los 3 motores izquierdos en paralelo en el BTS7960 izquierdo
- [ ] Los 3 motores derechos en paralelo en el BTS7960 derecho
- [ ] El cable USB del ESP32 desconectado cuando conectas la batería
      (para no inyectar 5V por dos lados a la vez)
