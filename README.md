# Rover UNACH — Sitio web

Sitio web del proyecto integrador de Electricidad y Electrónica (UNACH, 2° N).
Documenta el rover prototipo a escala 1:10 inspirado en el Curiosity, con
suspensión Rocker-Bogie holonómica y control por ESP32.

## Stack

- **Next.js 14** (App Router, salida estática)
- **JavaScript** (sin TypeScript)
- **CSS Modules** (un módulo por componente, co-localizado)
- **Framer Motion** para animaciones
- **Lucide React** para iconos

## Estructura

```
src/
├── app/                  Layout, página raíz y estilos globales
├── components/           Componentes reutilizables (uno por carpeta)
│   ├── Navbar/
│   ├── Footer/
│   ├── Button/
│   ├── SectionHeader/
│   ├── ComponentCard/
│   ├── CodeBlock/
│   ├── Stat/
│   └── TeamCard/
└── sections/             Secciones de la página principal
    ├── Hero/
    ├── Introduction/
    ├── HowItWorks/
    ├── Components/
    ├── Electronics/
    ├── Code/
    ├── Flow/
    ├── BuildSteps/
    ├── Team/
    └── Resources/

public/
└── assets/
    └── components/       Imágenes generadas con nano banana
```

## Comandos

```bash
npm install            # Instalar dependencias
npm run dev            # Servidor de desarrollo en http://localhost:3000
npm run build          # Genera la build estática en out/
npm run start          # (No aplica con output: 'export')
```

## Imágenes

El sitio espera imágenes en `public/assets/components/`. Hasta tenerlas,
las cards muestran un placeholder con un patrón diagonal sutil. Los prompts
para generarlas con nano banana están en `NANO_BANANA_PROMPTS.md`.

## Deploy en Cloudflare Pages

1. Ejecuta `npm run build`. Genera la build estática en `out/`.
2. En Cloudflare Pages, conecta el repositorio o sube manualmente.
3. **Build command:** `npm run build`
4. **Build output directory:** `out`
5. **Node version:** `20.x`

Como `next.config.mjs` tiene `output: 'export'`, no se necesita el adaptador
`@cloudflare/next-on-pages` — son archivos estáticos puros.

## Personalización rápida

- **Color de acento (naranja PLA):** `--accent-orange` en `src/app/globals.css`.
- **Equipo:** array `team` en `src/sections/Team/Team.js`.
- **Componentes:** array `components` en `src/sections/Components/Components.js`.
- **Recursos / descargas:** array `resources` en `src/sections/Resources/Resources.js`
  (reemplaza los `href: "#"` con URLs reales cuando estén listas).
# Rover
