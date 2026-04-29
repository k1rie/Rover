# Prompts para nano banana — usando tus fotos del rover

Nano banana (Gemini 2.5 Flash Image) soporta image-to-image. Sube tu foto del
rover ensamblado como **referencia** y agrega el prompt. Los resultados van a
mantener el rover real pero con la estética cinematográfica del sitio.

## Setup de carpetas

Crea estas subcarpetas dentro de `public/assets/`:

```
public/assets/
├── hero/          ← imágenes grandes para el Hero
├── mars/          ← rover sobre Marte (MarsExplorer)
├── components/    ← partes individuales (ya existe)
├── gallery/       ← gallería del prototipo real
└── build/         ← fases de construcción
```

---

## 🥇 PRIORIDAD ALTA — las 4 imágenes que más impacto dan

### 1. Hero principal — rover cinematográfico

**Foto a subir:** la mejor toma 3/4 de tu rover (de frente y un poco de lado).

**Prompt:**
```
Take this photo of the 6-wheel Mars-rover prototype and restyle it as a
cinematic hero shot for a premium tech website. Keep the rover exactly as
in the reference (orange 3D-printed PLA chassis, six tires, rocker-bogie
linkages, electronics visible, ultrasonic sensor at front). Place it on a
near-black studio background (#07070A) with a dramatic warm orange rim
light from the upper-left and a subtle cool blue accent light from the
lower-right. Add slight atmospheric haze, a soft contact shadow on the
floor, and a faint reflection underneath. Three-quarter angle, slightly
low camera, photorealistic, ultra-detailed. No text, no logos, no labels.
1920x1080.
```

**Guardar como:** `public/assets/hero/rover-hero.jpg`
**Tamaño recomendado:** 1920×1080 (16:9)

**Cómo usarlo:** reemplaza el `<RoverModel>` del Hero por la imagen, manteniendo el scroll animation. Edita [Hero.js](src/sections/Hero/Hero.js):

```jsx
// Reemplaza esto:
<RoverModel scale={roverScale} rotateY={roverRotateY} />

// Por esto:
<motion.img
  src="/assets/hero/rover-hero.jpg"
  alt="Rover holonómico Rocker-Bogie"
  style={{ scale: roverScale, rotateY: roverRotateY }}
  className={styles.roverImg}
/>
```

Y agrega al [Hero.module.css](src/sections/Hero/Hero.module.css):

```css
.roverImg {
  width: 100%;
  max-width: 760px;
  height: auto;
  display: block;
  filter: drop-shadow(0 30px 50px rgba(0, 0, 0, 0.6));
  will-change: transform;
}
```

---

### 2. Rover sobre Marte — protagonista del MarsExplorer

**Foto a subir:** vista lateral o 3/4 del rover (preferentemente fondo limpio).

**Prompt:**
```
Use this photo of the rover prototype as the subject. Composite it onto a
realistic Martian surface scene: rusty orange-red sand and gravel terrain
in the foreground, rolling sand dunes in the middle distance, dusty
red-orange sky with a faint pale sun behind atmospheric haze, soft
sunset lighting from the right side casting a long shadow under the
rover. Keep the rover sharp and well-lit while the background has slight
atmospheric perspective. The rover's wheels should be in contact with
the ground (small dust around them is OK). Realistic Mars Curiosity-era
photography style. No text. 1600x1100.
```

**Guardar como:** `public/assets/mars/rover-on-mars.png`
**Tamaño recomendado:** 1600×1100, fondo opaco está bien aquí

**Cómo usarlo:** reemplaza el `<RoverModel>` del MarsExplorer. Edita [MarsExplorer.js](src/sections/MarsExplorer/MarsExplorer.js):

```jsx
// Reemplaza:
<RoverModel scale={1} rotateY={0} variant="mars" wheelsSpin={!reduce} />

// Por:
<motion.img
  src="/assets/mars/rover-on-mars.png"
  alt="Rover sobre Marte"
  className={styles.roverImg}
/>
```

Y en [MarsExplorer.module.css](src/sections/MarsExplorer/MarsExplorer.module.css), reemplaza las dunas SVG por la imagen también si quieres una sola toma cinematográfica. Si prefieres conservar el cielo + dunas SVG y solo poner el rover encima, **omite el fondo marciano del prompt** y pídele "transparent background, only the rover with shadow".

---

### 3. Versión con fondo transparente — para componer encima de las dunas SVG

**Foto a subir:** misma foto del rover, vista lateral limpia.

**Prompt:**
```
Take this photo of the 6-wheel rover and isolate it on a fully transparent
background (PNG alpha). Keep the orange 3D-printed PLA chassis, six tires,
rocker-bogie suspension and front sensor exactly as in the reference.
Add a soft realistic contact shadow underneath as if it sits on a flat
surface. Lighting: even, slightly warm, no harsh highlights — natural
daylight feel so it composites well over any background. Three-quarter
view, slightly low camera, ultra-detailed, photorealistic. No text, no
logos. 1400x1000 PNG with transparency.
```

**Guardar como:** `public/assets/mars/rover-cutout.png`

**Cómo usarlo:** úsalo en el MarsExplorer en lugar del SVG. Quedará flotando sobre el cielo marciano + dunas SVG que ya están en la sección. Misma sustitución que en el #2 pero más versátil porque la sección ya tiene su fondo.

---

### 4. Foto de detalle — sensor + electrónica

**Foto a subir:** close-up del frente del rover donde se vea el HC-SR04 y el ESP32.

**Prompt:**
```
Macro close-up of the front of this 6-wheel rover prototype. Highlight
the HC-SR04 ultrasonic sensor (two circular transducers like eyes) and
the ESP32 microcontroller and BTS7960 H-bridge drivers visible inside
the chassis. Cinematic shallow depth of field — sensor in sharp focus,
background slightly blurred. Studio lighting on a near-black background
(#07070A) with a warm orange rim light highlighting the orange PLA
edges. Soft cyan glow from the sensor "eyes". Photorealistic. No text,
no labels. 1400x1000.
```

**Guardar como:** `public/assets/gallery/detail-sensor.jpg`
**Tamaño:** 1400×1000

**Cómo usarlo:** te paso un componente `Gallery` opcional al final si quieres una sección "Prototipo real" entre Introducción y MarsExplorer. Avísame.

---

## 🥈 PRIORIDAD MEDIA — tomas para enriquecer la página

### 5. Vista superior (top-down) — para sección "Diagrama"

**Foto a subir:** si tienes una toma cenital del rover, perfecta. Si no, una 3/4.

**Prompt:**
```
Generate a top-down orthographic view of this 6-wheel rover prototype as
if seen from directly above (90° overhead). Keep the orange PLA chassis
shape, six tires arranged in two rows of three, rocker-bogie linkages
visible, sensor mast pointing forward. Render on a flat dark background
(#07070A) with a subtle blueprint/schematic feel: faint grid lines
underneath, thin white technical-drawing overlay lines optional.
Photorealistic but flat-lit. No text, no measurements, no labels.
1200x900.
```

**Guardar como:** `public/assets/gallery/rover-top.jpg`

---

### 6. Acción — rover en escalada

**Foto a subir:** una foto del rover sobre un obstáculo (libro, escalón, piedra).

**Prompt:**
```
Take this photo of the rover and restyle it climbing a small rocky
obstacle (about twice the diameter of its wheels). Keep the rover real
and sharp; the front wheels should be elevated, rocker-bogie articulated,
rear wheels still on the ground. Outdoor terrain background: rocky red-
brown soil, harsh side lighting, dramatic late-afternoon shadow. Action
photography style, slight motion implied. No text. 1600x1000.
```

**Guardar como:** `public/assets/gallery/rover-climbing.jpg`

---

### 7. Detalle — rueda con tread

**Foto a subir:** close-up de una rueda del rover.

**Prompt:**
```
Macro close-up of a single wheel of this rover: black TPU tire with
aggressive vertical tread, orange PLA rim with eight curved spokes
visible through the tread gaps, JGA25-370 gearmotor partially visible
behind. Studio dark background (#07070A), warm rim light from the
right, subtle reflection underneath. Sharp focus on the tire tread
texture. Photorealistic, ultra-detailed. No text. 1200x900.
```

**Guardar como:** `public/assets/components/wheel-detail.jpg`

---

### 8. Mars terrain panorama (sin rover) — para fondo del MarsExplorer

**Sin foto de referencia** (a menos que tengas una toma de tu sesión que sirva).

**Prompt:**
```
Photorealistic ultra-wide panorama of the Martian surface: rolling sand
dunes in rust-orange and ochre tones, scattered dark rocks of various
sizes, the horizon meeting a hazy salmon-pink sky. Late afternoon
lighting from the right casting long soft shadows. No vegetation, no
people, no structures, no rover. Reminiscent of Curiosity rover panorama
photography. Subtle dust haze. No text, no watermarks. 2400x900.
```

**Guardar como:** `public/assets/mars/mars-panorama.jpg`

**Cómo usarlo:** reemplazar el SVG de dunas + cielo del MarsExplorer con esta imagen para máximo realismo. Avísame si quieres y te paso el cambio en el CSS.

---

## 🥉 PRIORIDAD BAJA — opcional pero pulen mucho la pieza

### 9. OG image / preview en redes sociales

**Foto a subir:** la mejor toma 3/4 del rover.

**Prompt:**
```
Composite this rover photo as the centerpiece of a social media share
card. Place the rover slightly right of center on a near-black gradient
background (#07070A → #16161D) with warm orange rim light. Reserve the
left third of the frame for clean negative space (text will be added
later in code). Subtle dust particles, premium tech-launch aesthetic.
No text, no logos. 1200x630 (Open Graph aspect).
```

**Guardar como:** `public/assets/og-image.jpg`

**Cómo usarlo:** edita [layout.js](src/app/layout.js) y agrega en `metadata.openGraph`:

```js
openGraph: {
  // ...
  images: [{ url: "/assets/og-image.jpg", width: 1200, height: 630 }],
},
```

---

### 10. Fases de construcción — 5 imágenes para BuildSteps

Si tienes fotos del proceso (impresión, ensamblaje mecánico, cableado, prueba), súbelas con estos prompts. Si no las tienes, omite — la sección funciona bien sin ellas.

**Prompts (uno por fase):**

```
Phase 1 — 3D printing:
Cinematic close-up of an orange PLA filament 3D-printed rover chassis
piece on a printer bed mid-print, fine layer lines visible, glowing hot
end nozzle in the background slightly out of focus. Premium product
photography, dark studio. No text. 800x600.

Phase 2 — Mechanical assembly:
Hands holding two orange 3D-printed rocker-bogie arms, aligning them
with M3 screws and a Phillips screwdriver visible. Top-down workshop
lighting, dark wood or matte black surface. Macro detail of the screw
threads. No text. 800x600.

Phase 3 — Wiring:
Close-up of an ESP32 microcontroller and BTS7960 H-bridge drivers being
wired with red and black silicone cables inside the orange chassis cavity.
Soldering iron tip visible at edge of frame, slight smoke. Warm tungsten
lighting. No text. 800x600.

Phase 4 — Firmware upload:
Laptop screen showing the Arduino IDE compiling code (out of focus is OK)
in the foreground, the rover with a USB cable connected sitting on the
desk in the background, soft bokeh. Cool blue screen glow on the rover.
No readable text, no logos. 800x600.

Phase 5 — Operation:
The fully assembled 6-wheel rover prototype rolling across rocky outdoor
terrain at dusk. Long shadow, motion in the wheels. Cinematic, slightly
low angle. No text. 800x600.
```

**Guardar como:**
- `public/assets/build/phase-1-printing.jpg`
- `public/assets/build/phase-2-assembly.jpg`
- `public/assets/build/phase-3-wiring.jpg`
- `public/assets/build/phase-4-firmware.jpg`
- `public/assets/build/phase-5-operation.jpg`

**Cómo usarlas:** te paso el cambio en `BuildSteps.js` cuando tengas las imágenes — ahora mismo la sección no las usa, hay que agregar un campo `image` a cada fase y un slot visual en la card.

---

## 🛠️ Tips para nano banana

- **Si una pieza queda con texto incrustado:** repite el prompt agregando al final `"absolutely no text, no logos, no labels, no captions, no watermarks"`.
- **Si pierde fidelidad al rover real:** agrega `"preserve the exact geometry, color and proportions of the reference rover photo, only change lighting and background"`.
- **Si el naranja sale muy saturado o muy apagado:** especifica el color exacto: `"PLA orange filament, hex #FF7A1A, slightly matte finish with visible 3D printing layer lines"`.
- **Para mantener consistencia visual entre todas las imágenes:** repite siempre la misma frase de iluminación y fondo: `"near-black studio background (#07070A), warm orange rim light, subtle contact shadow"`.

---

## 📋 Checklist rápido

| # | Imagen | Carpeta | ¿Requiere edición de código? |
|---|--------|---------|------------------------------|
| 1 | Hero cinematográfico | `hero/` | Sí — swap RoverModel por `<motion.img>` |
| 2 | Rover sobre Marte | `mars/` | Sí — swap RoverModel del MarsExplorer |
| 3 | Rover cutout transparente | `mars/` | Sí — alternativa al #2 |
| 4 | Detalle sensor | `gallery/` | Opcional (sección Gallery nueva) |
| 5 | Vista superior | `gallery/` | Opcional |
| 6 | Acción escalando | `gallery/` | Opcional |
| 7 | Rueda detalle | `components/` | No (sustituye placeholder) |
| 8 | Panorama Marte | `mars/` | Sí — bg del MarsExplorer |
| 9 | OG image | `assets/` raíz | Sí — metadata layout.js |
| 10 | 5 fases construcción | `build/` | Sí — agregar slot a BuildSteps |

Cuando tengas las imágenes generadas, dime cuáles bajaste y te hago los cambios de código en bloque.
