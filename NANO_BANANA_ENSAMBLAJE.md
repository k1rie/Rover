# Prompts para nano banana — Piezas individuales blancas

**Workflow simple: una pieza a la vez. Cero composición.**

Cada pieza la generas independientemente con un solo prompt. La sección
del sitio (`AssemblyShowcase`) las muestra una por una con animaciones
cinematográficas — cada scroll-stage muestra UNA pieza gigante centrada,
con luz de estudio, contacto al piso y rotación sutil.

---

## El prompt único — úsalo para CADA pieza

Adjunta **solo 1 imagen**: la captura del 3D model de la pieza (la naranja
del PDF). Pega este prompt:

```
TASK: Take the attached 3D model screenshot of this rover part. Perform
ONLY two modifications and NOTHING else:

1. CHANGE COLOR: Replace the orange material with matte WHITE PLA filament
   (#F0F0EE — slightly off-white warm tone, NOT pure white). Keep subtle
   3D-printing layer lines and the matte plastic texture. The part must
   look like real 3D-printed plastic, not glossy.

2. NEW BACKGROUND: Place the part on a pure black studio background
   (#050507) with:
   - A subtle cool white radial glow underneath the part
     (rgba(255, 255, 255, 0.10)) for floor reflection
   - A faint electric-blue rim accent on one side
     (rgba(170, 210, 255, 0.10))
   - Soft contact shadow underneath

CRITICAL — DO NOT MODIFY:
  • The geometry, shape, proportions, dimensions of the part
  • The position, angle, or perspective shown in the input image
  • The number of holes, ridges, or any structural feature
  • The number of parts shown (if there are 2 in the reference, show 2)

The output must be VISUALLY IDENTICAL to the input image except for:
  - the material color (orange → white)
  - the background (whatever it was → black studio with cool glow)

NO additions of any kind. NO geometric changes. NO reinterpretation.

Lighting: cool top-light (6500K daylight) from upper-left + subtle cool
rim light (7000K) from back-right. Photorealistic 3D render, premium
product photography aesthetic similar to Apple keynote renders.

Output: PNG with transparent background where there is no part.
1600x1100 resolution.

ABSOLUTELY NO text, labels, watermarks, logos, captions, dimension lines,
arrows, or annotations of any kind. NO orange/warm tinting.
```

---

## Cómo generar las 10 piezas

Para cada una: abres nano banana, adjuntas la captura del 3D model
correspondiente, pegas el prompt de arriba, generas, descargas.

| # | Captura del 3D model que adjuntas | Guardar como |
|---|---|---|
| 1 | Chasís | `public/assets/assembly/01-chasis.png` |
| 2 | Brazo izquierdo (o derecho) | `public/assets/assembly/02-brazo.png` |
| 3 | Pivote | `public/assets/assembly/03-pivote.png` |
| 4 | Barra diferencial | `public/assets/assembly/04-barra.png` |
| 5 | Enlace diferencial | `public/assets/assembly/05-enlace.png` |
| 6 | Soporte de motor | `public/assets/assembly/06-soporte.png` |
| 7 | Adaptador de acoplamiento | `public/assets/assembly/07-adaptador.png` |
| 8 | Rin | `public/assets/assembly/08-rin.png` |
| 9 | Neumático | `public/assets/assembly/09-neumatico.png` |
| 10 | (opcional) Foto de tu rover armado | `public/assets/assembly/10-final.png` |

> Para la etapa 10 final tienes 2 opciones:
> - **A:** usa una foto real de tu rover ensamblado (la que ya tienes).
>   Aplica el mismo tratamiento: la subes a nano banana, le pides que
>   solo cambie el fondo a negro estudio con glow. Las piezas blancas
>   ya están blancas en la foto real.
> - **B:** déjala vacía y la sección termina en la pieza 9. El usuario
>   queda con la sensación "todo ensamblado mentalmente".

---

## Si nano banana cambia algo que no debe

Síntomas comunes y qué agregar al final del prompt:

**Cambia ángulo o perspectiva:**
> *"FINAL CHECK: The output must show the part from the EXACT SAME viewpoint, angle, and perspective as the input. If the angle changed, the output is wrong."*

**Pone color crema/beige en vez de blanco:**
> *"The white must be neutral matte white (#F0F0EE), NOT yellow, NOT cream, NOT beige. A clean printed-PLA white tone."*

**Agrega texto, números o flechas:**
> *"REMOVE any text, numbers, arrows, dimension lines, or annotations. The output is purely visual — only the part on the background, nothing else."*

**Hace la pieza demasiado brillante:**
> *"The part is matte and rough, not glossy or shiny. Visible 3D-printing layer lines. NO mirror reflections, NO chrome look. Like real PLA filament."*

---

## Notas de tu rover real

Para que el resultado se vea consistente con tu prototipo físico:

- **Color:** PLA blanco ligeramente cálido, no blanco hospital puro
- **Acabado:** mate, con líneas de capa visibles de cerca
- **Neumáticos:** TPU/PLA blanco con ridges verticales (no negros)
- **Componentes electrónicos:** colores de fábrica intactos (verde ESP32,
  azul BTS7960, etc.) — solo aplica si los muestras
- **Luz ambiente:** fría (blanco-azul), nunca cálida o naranja

---

## Lo que pasa después

Cuando tengas las 10 PNGs en `public/assets/assembly/`:

1. La sección `AssemblyShowcase` las consume automáticamente.
2. El usuario hace scroll → cada pieza aparece centrada, gigante,
   con animación de entrada (rotación Y, escala, fade).
3. A su lado aparece el caption con:
   - Número de etapa (01/10, 02/10...)
   - Nombre de la pieza
   - Descripción de su función
   - Spec técnica
4. Indicador de progreso vertical (10 puntos) marca el avance.
5. Background glow sutil cambia conforme avanza.

**No necesitas componer nada.** Cada pieza es independiente y la web
hace el efecto cinematográfico de "tour de componentes".
