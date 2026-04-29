# Prompts para nano banana

Estos prompts generan imágenes consistentes con el diseño del sitio: fondo
oscuro casi negro, componente flotando en el centro, iluminación suave, estilo
producto profesional. Todos a 1024×768 (relación 4:3 que coincide con la card).

Guarda cada imagen en `public/assets/components/<nombre>.png` con el nombre
exacto que aparece en cada bloque.

---

## 1. Chasís (cuerpo principal) → `chasis.png`

```
A 3D rendered orange PLA filament printed rectangular chassis box, hollow
interior visible, smooth matte plastic finish with subtle layer lines,
floating in center of frame on a near-black studio background (#0a0a0a),
soft top-down rim lighting with a warm orange highlight on one edge,
slight contact shadow underneath, isometric three-quarter angle, no text,
clean product photography style, 1024x768.
```

## 2. Brazo izquierdo / derecho → `brazo.png`

```
A 3D rendered orange PLA filament rocker arm for a Mars-rover style
robot, long curved structural beam with mounting holes at both ends and
a triangular reinforcement near the pivot, matte plastic with visible
3D printing layers, isometric view, floating on near-black background
(#0a0a0a), soft warm rim light from upper left, subtle contact shadow,
product photography, no text, 1024x768.
```

## 3. Pivote izquierdo / derecho → `pivote.png`

```
A 3D rendered orange PLA filament bogie pivot arm — an angled bent
linkage with two mounting bosses, one cylindrical end and one rectangular
servo-mount end, matte 3D print finish with subtle layer lines, isometric
three-quarter angle, floating on dark studio background (#0a0a0a), warm
orange rim lighting, soft contact shadow, no text, clean product render,
1024x768.
```

## 4. Barra diferencial → `barra.png`

```
A 3D rendered orange PLA flat rectangular differential bar with two
circular mounting bosses at each end, slim and elongated, matte plastic
with visible 3D print layers, top-down view tilted slightly, floating on
near-black background (#0a0a0a), warm rim light, soft shadow, no text,
clean product render style, 1024x768.
```

## 5. Enlace diferencial → `enlace.png`

```
A 3D rendered orange PLA differential linkage piece — a small flat
disc-shaped element with two parallel arms extending from it, like a
miniature rocker bracket, matte plastic with print layer lines, isometric
view, floating on dark studio background (#0a0a0a), soft warm side
lighting, contact shadow underneath, product photography, no text,
1024x768.
```

## 6. Soporte de motor → `soporte.png`

```
A 3D rendered orange PLA L-shaped motor mount bracket with a circular
hole for a cylindrical gearmotor, matte plastic with subtle 3D-print
layer lines, isometric view, floating on near-black background
(#0a0a0a), soft warm rim lighting from upper left, gentle contact
shadow, clean product photography style, no text, 1024x768.
```

## 7. Adaptador de acoplamiento → `adaptador.png`

```
A 3D rendered orange PLA round wheel-hub coupling adapter — a flat
circular plate with multiple small bolt holes around the perimeter and a
short cylindrical shaft on the underside, matte plastic with print
layers, isometric three-quarter angle, floating on dark background
(#0a0a0a), warm side lighting, soft shadow, product render, no text,
1024x768.
```

## 8. Neumático → `neumatico.png`

```
A 3D rendered black TPU rubber-like rover tire, thick aggressive tread
pattern with vertical wavy ridges around the circumference, donut shape
with a hollow circular center, matte rubbery surface, floating on dark
near-black studio background (#0a0a0a), three-quarter isometric angle,
soft warm rim light, subtle contact shadow, product photography style,
no text, 1024x768.
```

## 9. Rin (estándar / hexagonal) → `rin.png`

```
A 3D rendered orange PLA wheel rim with eight elongated curved spokes
radiating from a central hub, hexagonal cutout in the middle, matte
plastic with print layer texture, front-on view tilted slightly,
floating on near-black background (#0a0a0a), warm orange rim lighting,
soft shadow, product photography, no text, 1024x768.
```

## 10. Motorreductor JGA25-370 → `motor-ga25.png`

```
A photorealistic 3D render of a JGA25-370 DC gearmotor — small silver
metal cylindrical body with a black plastic gearbox at one end, a thin
output shaft, two red and black power leads coming out the back, matte
metal finish, floating horizontally on dark studio background (#0a0a0a),
soft top lighting with a subtle warm orange accent, contact shadow,
product photography style, no text, 1024x768.
```

## 11. Servomotor MG996R → `servo.png`

```
A photorealistic 3D render of an MG996R hobby servomotor — black
rectangular plastic body with a silver metal output gear on top, three
brand-style mounting flanges on the sides, three-wire ribbon (red,
brown, orange) coming out one side, matte and slightly glossy plastic
finish, floating on dark near-black background (#0a0a0a), soft top
lighting with a faint warm rim light, subtle shadow, product
photography, no text, 1024x768.
```

---

## Bonus: Hero image (opcional, para reemplazar el SVG actual) → `hero-rover.png`

```
A cinematic photorealistic 3D render of a six-wheeled Mars exploration
rover prototype with rocker-bogie suspension, orange PLA 3D-printed
body and arms, black knobby rubber wheels, mounted ESP32 electronics
visible on the chassis, ultrasonic HC-SR04 sensor at the front, on a
dramatic near-black studio background with a warm orange rim light from
behind and cool blue accent light from below, soft fog/mist atmosphere,
3/4 hero angle slightly low, ultra-detailed, premium product
photography aesthetic similar to Apple keynote renders, no text, no
logos, 1920x1080.
```

## Bonus: Robot ensamblado para sección Introducción → `rover-assembled.png`

```
A clean studio shot of a six-wheeled rocker-bogie rover prototype, 1:10
scale Curiosity-inspired, orange 3D-printed PLA chassis and structural
arms, six black tires with deep tread, ESP32 microcontroller and BTS7960
H-bridge drivers visible inside the open chassis, cables neatly routed,
HC-SR04 ultrasonic sensor at the front like two eyes, on a dark
gradient background (#08080c at edges, lighter toward center), soft
even lighting with subtle warm orange highlights, three-quarter view,
photorealistic, ultra-detailed, no text, no watermarks, 1600x1200.
```

---

## Tips

- Si nano banana añade texto en alguna imagen, repite el prompt agregando
  al final: **"absolutely no text, no logos, no labels, no captions"**.
- Para mantener todas las piezas con el mismo color de PLA, usa el
  hex `#FF7A1A` o describe el color como **"warm orange (Pantone Tangerine)"**.
- Si quieres que las piezas se vean **más realistas** y menos render
  brillante, agrega: **"matte finish, slight imperfections from 3D
  printing, fine layer lines visible, no glossy reflections"**.
- Si prefieres versión **hexagonal del rin**, cambia "eight elongated
  curved spokes" por "ten straight rectangular spokes" y sustituye
  "hexagonal cutout" por "central hexagonal hub of 12mm".
