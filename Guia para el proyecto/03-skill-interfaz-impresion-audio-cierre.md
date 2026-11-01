---
name: bingo-algebraico-03-interfaz-impresion-audio-cierre
description: Skill 3 de 3 para la app "Bingo Algebraico" (Liga del Álgebra). Cubre las Fases 5 a 9: sistema de diseño pastel con temática matemáticas + deporte, pantalla de juego proyectable (marcador, jugadas, tabla de posiciones, podio, verificar cartón), impresión nativa de los 30 cartones en blanco y negro, música gratuita con licencia verificada y efectos sintetizados, QA final con checklists y documentación. Úsalo solo después de terminar los Skills 01 y 02.
---

# Skill 03 · Interfaz, impresión, audio, QA y cierre

> **Requisitos previos:** Skill 01 y Skill 02 terminados y con todas sus pruebas en verde. Existen `useBingoGame()`, `CARTONES`, `CASOS`, `aTokens`, `factorizacionATokens`, `clasificar`, `calcularPodio`, `verificarCarton`.
> **Reglas inviolables:** R1–R11 del Skill 01, sección 2. Aquí pesan **R9** (contraste y color nunca como único indicador) y **R10** (todo local, sin CDN).
> **Punto de revisión humana:** al terminar la Fase 5 detente y espera la aprobación visual del docente.

---

# FASE 5 · Sistema de diseño e interfaz del juego

**Objetivo:** pantalla de juego moderna, pastel, de temática matemática + deportiva, legible desde el fondo del aula, con una partida jugable de principio a fin.

## 5.1 Concepto visual: "Liga del Álgebra"

Un estadio de matemáticas. Vocabulario visual que ordena toda la interfaz:

| Elemento del juego | Metáfora deportiva | Componente |
|---|---|---|
| Polinomio actual | **Marcador** central | `Marcador.jsx` |
| Historial de sorteos | **Jugadas** anotadas | `Historial.jsx` |
| Progreso de cartones | **Tabla de posiciones** | `Posiciones.jsx` |
| Ganadores | **Podio** con trofeo | `Podio.jsx` |
| Número de turno | **Ronda / minuto** | encabezado |
| Nueva partida | **Pitido inicial** | botón con ícono de silbato |
| Revisar un cartón | **Revisión del árbitro** | `VerificarCarton.jsx` |

Motivos decorativos (todos SVG propios, sin imágenes externas):

- **Papel cuadriculado** y **ejes cartesianos** muy tenues como fondo.
- **Líneas de cancha** (círculo central, arco) como separadores sutiles.
- Íconos: balón, trofeo, silbato, medalla, cronómetro, signos matemáticos (π, ∑, √, ±, x²) como formas flotantes de baja opacidad.
- Formas geométricas (triángulo, círculo, cuadrado) como acentos.

Crea los íconos como componentes en `ui-kit/iconos/` (`Balon.jsx`, `Trofeo.jsx`, `Silbato.jsx`, `Medalla.jsx`, `Cronometro.jsx`, `Ejes.jsx`). Cada uno es un `<svg>` con `aria-hidden="true"` y `currentColor`, para que se tiñan por CSS.

## 5.2 Tokens · `ui-kit/tokens.css`

Los fondos son pastel; **el texto siempre es azul marino oscuro**.

```css
:root {
  /* Texto y superficies */
  --ink: #1E2A4A;           /* texto principal */
  --ink-suave: #3B4A6B;     /* texto secundario (verifica contraste) */
  --bg: #F6FAFF;            /* fondo general */
  --surface: #FFFFFF;

  /* Pasteles */
  --sky: #CDE7FB;
  --mint: #CFF1E4;
  --lavender: #E0D7FA;
  --peach: #FFE1CC;
  --lemon: #FFF3B8;
  --rose: #FFD3DC;

  /* Acento (botón principal, texto oscuro encima) */
  --accent: #8EC0F5;
  --accent-fuerte: #5FA4EC;
  --borde: #1E2A4A;

  /* Color por caso de factorización (siempre con icono y etiqueta) */
  --caso-factor-comun: var(--peach);
  --caso-diferencia-cuadrados: var(--sky);
  --caso-trinomio-cuadrado-perfecto: var(--lavender);
  --caso-trinomio-x2-bx-c: var(--mint);
  --caso-trinomio-ax2-bx-c: var(--rose);
  --caso-agrupacion: var(--lemon);

  /* Forma y espacio */
  --radio-s: 12px;
  --radio-m: 20px;
  --radio-l: 28px;
  --sombra: 0 6px 0 rgba(30, 42, 74, 0.12), 0 10px 24px rgba(30, 42, 74, 0.10);
  --borde-grueso: 3px solid var(--borde);

  /* Tipografía */
  --fuente-ui: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  --fuente-mate: "Cambria Math", "STIX Two Math", "Latin Modern Math", Cambria, Georgia, "Times New Roman", serif;

  /* Duraciones de animación (se anulan en modo reducido) */
  --t-rapida: 180ms;
  --t-revelar: 400ms;
}

@media (prefers-color-scheme: dark) { :root { color-scheme: light; } } /* la app es solo clara: proyección en aula iluminada */

:root[data-motion="reducido"] { --t-rapida: 0ms; --t-revelar: 0ms; }
@media (prefers-reduced-motion: reduce) { :root { --t-rapida: 0ms; --t-revelar: 0ms; } }
```

**Fuentes:** pila del sistema (`--fuente-ui`, `--fuente-mate`). **No uses Google Fonts ni ningún CDN.** Si más adelante se quiere una fuente propia, debe ser de licencia abierta, descargada, incluida en `public/fonts/` y registrada con `@font-face` local, con su licencia anotada.

### Verificación de contraste (obligatoria) · `scripts/contraste.mjs`

Script sin dependencias que lee los pares texto/fondo y calcula la razón WCAG:

```js
const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16) / 255);
const lin = (c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const lum = (h) => { const [r, g, b] = hex(h).map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const razon = (a, b) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05); };

// Ajusta los valores si cambias la paleta.
const PARES = [
  ['ink sobre bg',        '#1E2A4A', '#F6FAFF', 7],
  ['ink sobre sky',       '#1E2A4A', '#CDE7FB', 7],
  ['ink sobre mint',      '#1E2A4A', '#CFF1E4', 7],
  ['ink sobre lavender',  '#1E2A4A', '#E0D7FA', 7],
  ['ink sobre peach',     '#1E2A4A', '#FFE1CC', 7],
  ['ink sobre lemon',     '#1E2A4A', '#FFF3B8', 7],
  ['ink sobre rose',      '#1E2A4A', '#FFD3DC', 7],
  ['ink sobre accent',    '#1E2A4A', '#8EC0F5', 4.5],
  ['ink-suave sobre bg',  '#3B4A6B', '#F6FAFF', 4.5],
];
let fallo = false;
for (const [n, a, b, min] of PARES) {
  const r = razon(a, b);
  const ok = r >= min; if (!ok) fallo = true;
  console.log(`${ok ? 'OK ' : 'FALLA'} ${n}: ${r.toFixed(2)} (mín ${min})`);
}
process.exit(fallo ? 1 : 0);
```

Reglas: texto grande proyectado (marcador, botones) ≥ **7:1**; texto secundario ≥ **4,5:1**. Si un par falla, **oscurece el texto o aclara el fondo**, no cambies la regla. Registra el resultado en `docs/DECISIONES.md`.

## 5.3 Componentes del `ui-kit`

| Componente | Props | Notas |
|---|---|---|
| `Boton` | `variante` (`principal`\|`secundario`\|`peligro`), `icono`, `grande`, `disabled`, `onClick`, `children` | Altura mínima 48 px (objetivo táctil/proyección). Estado `:focus-visible` con anillo de 3 px bien visible. `principal` usa `--accent` con texto `--ink`. |
| `Tarjeta` | `color` (token), `titulo`, `children` | Borde `--borde-grueso`, `--radio-m`, `--sombra`. |
| `ChipCaso` | `caso` (clave) | Muestra **ícono + nombre** del caso con el color pastel. Nunca solo color. |
| `ExpresionMatematica` | `tokens`, `tam` (`xl`\|`l`\|`m`\|`s`) | Convierte tokens a spans/`<sup>`; usa `--fuente-mate`; incluye `aria-label` con el texto plano legible (por ejemplo "x al cuadrado menos nueve"). |
| `Insignia` | `icono`, `children` | Para contadores y etiquetas de turno. |

**Conversión de tokens a lectura accesible:** crea una función `aTextoAccesible(tokens)` en `ui-kit` (no en `domain`) que diga "al cuadrado", "al cubo", "menos", "más". Es solo para `aria-label`.

## 5.4 Pantallas y distribución (objetivo 1920×1080, adaptable)

**Estado de la app** (sin librería de rutas): `pantalla ∈ { 'inicio', 'juego', 'imprimir' }` en `App.jsx`.

### `PantallaInicio`

- Título "Liga del Álgebra" y subtítulo "Bingo de factorización".
- Botón grande **"¡Comenzar!"**. Este clic es el gesto del usuario que **habilita el audio** (ver Fase 7) y lleva a `juego`.
- Si hay una partida guardada con `turno > 0`: dos botones, **"Continuar partida"** y **"Nueva partida"**.
- Enlace secundario "Imprimir cartones" y un pie con "Créditos".

### `PantallaJuego` (cuadrícula CSS)

```
┌──────────────────────────────────────────────────────────────────┐
│ ENCABEZADO: logo · «Ronda 12 de 48» · 🔊 controles de audio · ⚙   │
├──────────────────────────────────────┬───────────────────────────┤
│                                      │ TABLA DE POSICIONES       │
│           M A R C A D O R            │  top 5 cartones           │
│                                      │  (número + barra + n/25)  │
│        x² + 5x + 6                   ├───────────────────────────┤
│        (fuente enorme)               │ JUGADAS (historial)       │
│                                      │  chips con color de caso, │
│   [ChipCaso al revelar]              │  último resaltado,        │
│   [Mostrar respuesta]                │  con scroll interno       │
├──────────────────────────────────────┴───────────────────────────┤
│ [ SORTEAR SIGUIENTE ]  [Nueva partida] [Verificar cartón] [Imprimir]│
│ Progreso ▓▓▓▓▓▓░░░░  12 sorteados · 36 pendientes                │
└──────────────────────────────────────────────────────────────────┘
```

```css
.juego {
  min-height: 100dvh;
  display: grid;
  grid-template-columns: minmax(0, 1.9fr) minmax(280px, 1fr);
  grid-template-rows: auto 1fr auto;
  grid-template-areas: "enc enc" "marcador lateral" "pie pie";
  gap: clamp(12px, 1.6vw, 28px);
  padding: clamp(12px, 1.6vw, 28px);
}
@media (max-width: 900px) {
  .juego { grid-template-columns: 1fr; grid-template-areas: "enc" "marcador" "lateral" "pie"; }
}
```

### `Marcador`

- Es **el elemento más grande de la pantalla**: `font-size: clamp(3rem, 9vw, 11rem)`.
- Revelación breve (≤ 400 ms): escala + desvanecimiento. Con animaciones reducidas, aparece sin movimiento.
- Muestra bajo la expresión: **número de turno** y el `ChipCaso` **solo tras "Mostrar respuesta"** (el caso es una pista; por defecto oculto).
- **"Mostrar respuesta"** (botón del docente): revela la factorización correcta y la `explicacion` breve en una tarjeta. Por defecto oculta, para que el estudiante no copie. Al sortear el siguiente, vuelve a ocultarse.
- Estado "inicio" (turno 0): mensaje "Pulsa *Sortear* para empezar".
- Debe usar `ejercicioActualId` y `EJERCICIOS_POR_ID` para obtener los datos. **No recalcula nada**.

### `Historial` ("Jugadas")

- Lista cronológica inversa o rejilla de chips: `n.º · polinomio (compacto)` con el color y el ícono del caso. El último resaltado con `--lemon` y borde grueso.
- Scroll interno; no debe alargar la página.
- `aria-live="polite"` en un contenedor oculto visualmente que anuncie "Turno N: <texto accesible>".

### `Posiciones`

- Usa `clasificar(resultado, 5)`. Cada fila: etiqueta `Cartón 07`, barra de progreso (`hechas/total`) y el número `21/25`. La barra va acompañada del número (R9).
- Los cartones ganadores se marcan con ícono de trofeo y texto "¡Ganó!".

### `Podio` (superposición de victoria)

- Aparece cuando `celebracion` no es `null`. Muestra **todos** los cartones del turno: número, turno de victoria y "25 de 25 casillas".
- Mensaje grande ("¡BINGO!") + trofeo + confeti.
- Botones: **"Cerrar"**, **"Nueva partida"** y, si la regla lo permite, **"Continuar para el 2.º puesto"** (despacha `continuar()`).
- Un panel fijo de "Ganadores" (fuera de la superposición) lista **siempre** `resultado.ganadores`, incluso tras cerrar la celebración o recargar la página. Usa `calcularPodio` para mostrar puestos.
- Si `fase === 'terminada'` y el mazo se agotó sin ganador (no debería ocurrir con la regla `cartonCompleto`), muestra "No quedan más polinomios".

### `VerificarCarton` (extra D8)

- Campo numérico 1–30 (validado) → muestra la cuadrícula 5×5 con `verificarCarton`. Las casillas que ya salieron llevan **✓ y fondo mint**; las que faltan, texto normal. Debajo, "21 de 25 casillas".
- Sirve para resolver dudas en el aula. Es solo lectura.

### Pie y controles

- **Sortear siguiente**: grande, `variante="principal"`, **deshabilitado** si `bloqueada`. Atajo de teclado: barra espaciadora o Enter (cuando el foco no esté en un campo de texto).
- **Nueva partida**: **pide confirmación** (diálogo propio accesible, no `window.confirm`) para evitar reinicios accidentales. Al confirmar llama a `nuevaPartida()`.
- Barra de progreso global `turno/total` con el texto "12 sorteados · 36 pendientes".

### Ajustes (`features/settings`)

`useAjustes()` guarda en `liga-algebra.ajustes.v1`: `{ animaciones: 'normal'|'reducido', volumen: 0..1, silenciado: bool, efectos: bool }`, validados al leer (valores inválidos → por defecto). El ajuste `animaciones` pone `data-motion="reducido"` en `<html>`. Por defecto sigue `prefers-reduced-motion`.

## 5.5 Animaciones (breves, anulables)

- Todas usan las variables `--t-rapida` y `--t-revelar` (se vuelven `0ms` en modo reducido).
- Revelación del polinomio: `transform: scale(.92)→1` + `opacity` (≤ 400 ms).
- Contadores: transición numérica corta (≤ 300 ms) o simplemente cambio instantáneo en modo reducido.
- **Confeti en CSS puro** (sin librerías): 30–40 `<span>` posicionados con `@keyframes` de caída y rotación, colores de la paleta, duración ≤ 2,5 s, `pointer-events: none`. En modo reducido no se renderiza el confeti; solo aparece el trofeo estático.
- **Ninguna animación bloquea la interacción**: el botón "Sortear" funciona aun durante la animación.

## 5.6 Accesibilidad mínima

- Estructura semántica: `header`, `main`, `aside`, `footer`. Un solo `h1`.
- Todo control con texto visible o `aria-label`. `:focus-visible` marcado.
- Anuncios para lectores de pantalla con `aria-live="polite"` (sorteo) y `role="alertdialog"` / foco atrapado en la superposición del podio y en el diálogo de confirmación; `Escape` cierra.
- No depender solo del color: casos con ícono + texto; progreso con número; verificación con ✓.

## 5.7 Pruebas y verificación de la fase

Si el proyecto **no** tiene herramienta de pruebas de componentes (no la agregues), verifica manualmente:

- [ ] `npm run dev` arranca sin errores ni advertencias de React en consola (revisa StrictMode).
- [ ] Una partida completa: inicio → sortear hasta que aparezca el primer ganador → podio → continuar/nueva partida.
- [ ] Varios ganadores simulados: usa una semilla de pruebas por URL **solo en desarrollo** (por ejemplo `?semilla=123` leída en `main.jsx` si `import.meta.env.DEV`) para reproducir un caso con ganadores múltiples. **No dejes esa función en producción.**
- [ ] Recarga la página a mitad de partida: se restaura el mismo turno y los mismos sorteos; no hay confeti repetido.
- [ ] Doble clic muy rápido en "Sortear": avanza **un solo** turno.
- [ ] `npm run contraste` (agrega el script a `package.json`) sale con código 0.
- [ ] Prueba a 1920×1080, 1366×768 y 390×844: el marcador sigue siendo lo más grande y nada se solapa.
- [ ] Modo de animaciones reducidas: no hay movimiento y todo sigue funcionando.
- [ ] Navegación solo con teclado completa.

### Terminada cuando

- [ ] Todo lo anterior marcado.
- [ ] El docente aprobó el diseño (**punto de revisión humana**).

---

# FASE 6 · Impresión de cartones

**Objetivo:** imprimir un cartón o los 30, en blanco y negro, tamaño carta, sin elementos de interfaz.

## 6.1 Decisión de formato

| Opción | Tamaño de casilla aprox. | Ventajas | Desventajas |
|---|---|---|---|
| 1 cartón por hoja | ≈ 39 × 48 mm | Máxima legibilidad; fácil de usar con fichas | 30 hojas |
| **2 cartones por hoja (por defecto)** | ≈ 39 × 22 mm | Buena legibilidad; 15 hojas | Letra algo menor |
| 4 por hoja | ≈ 20 × 13 mm | 8 hojas | Expresiones como `(5x + 3)(x + 2)` no caben con legibilidad. **Descartada.** |

Las medidas son aproximadas (área útil carta con márgenes de 10 mm). **Verifica con una impresión real.**

## 6.2 Estructura de archivos

```
features/print/  PaginaImpresion.jsx · CartonImpreso.jsx · impresion.css
```

`PaginaImpresion` recibe `CARTONES`, `EJERCICIOS_POR_ID` y `VERSION_CARTONES`. No conoce el estado de la partida.

**Controles (no se imprimen, clase `no-print`):**

- Selector: **Todos (30)** · **Un cartón** (campo 1–30) · **Rango** (opcional: "del 5 al 10").
- Selector de formato: **1 por página** · **2 por página**.
- Botón **Imprimir** → `window.print()`.
- Botón **Volver**.
- Aviso: "En el diálogo de impresión desactiva *Encabezados y pies de página* y usa tamaño *Carta*, escala *100 %*."
- Vista previa en pantalla con el mismo diseño de papel.

**Orden de operaciones al imprimir:** el estado `seleccion` y `formato` ya determinaron qué se renderiza; el botón solo llama `window.print()`. No cambies el DOM justo antes de imprimir.

## 6.3 `CartonImpreso.jsx`

```jsx
// Estructura (sin lógica de juego)
<section className="carton" aria-label={etiquetaCarton(n)}>
  <header className="carton__cab">
    <h2>{etiquetaCarton(n)}</h2>
    <span>Liga del Álgebra · Factorización</span>
  </header>
  <div className="carton__rejilla" role="grid">
    {carton.celdas.map((id, celda) => (
      <div className="carton__celda" role="gridcell" key={celda}>
        <ExpresionMatematica tokens={factorizacionATokens(EJERCICIOS_POR_ID.get(id).factorizacion, { espaciado: 'compacto' })} tam="s" />
      </div>
    ))}
  </div>
  <footer className="carton__pie">Versión de cartones: {VERSION_CARTONES}</footer>
</section>
```

Reglas:

- Las 25 casillas muestran **solo la factorización**, nunca el polinomio ni el id.
- El texto sale de `factorizacionATokens(..., { espaciado: 'compacto' })`. **Nada se escribe a mano.**
- No hay casilla central libre: las 25 contienen un ejercicio.

## 6.4 `impresion.css`

```css
.hoja { display: block; }

.carton {
  box-sizing: border-box;
  border: 2pt solid #000;
  border-radius: 0;           /* bordes rectos imprimen más nítidos */
  padding: 4mm;
  background: #fff;
  color: #000;
  break-inside: avoid;
  page-break-inside: avoid;
}
.carton__cab { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 3mm; }
.carton__cab h2 { margin: 0; font-size: 18pt; }
.carton__rejilla { display: grid; grid-template-columns: repeat(5, 1fr); }
.carton__celda {
  border: 1.5pt solid #000;
  display: flex; align-items: center; justify-content: center;
  text-align: center;
  white-space: nowrap;        /* una factorización no se parte en dos líneas */
  overflow: hidden;
  font-family: var(--fuente-mate);
  color: #000;
}
.carton__pie { margin-top: 2mm; font-size: 8pt; text-align: right; }

/* Formato 1 por página */
.formato-1 .hoja { break-after: page; page-break-after: always; }
.formato-1 .carton__celda { min-height: 42mm; font-size: 17pt; }

/* Formato 2 por página */
.formato-2 .hoja { break-after: page; page-break-after: always; display: grid; gap: 6mm; }
.formato-2 .carton__celda { min-height: 20mm; font-size: 13pt; }

@page { size: letter; margin: 10mm; }

@media print {
  html, body { background: #fff !important; }
  .no-print, header.app, nav, button, .controles-impresion { display: none !important; }
  .print-area { margin: 0; padding: 0; }
  .carton, .carton__celda { box-shadow: none; background: #fff; }
  .hoja:last-child { break-after: auto; page-break-after: auto; }
}
```

> Si los tamaños de fuente no entran en alguna casilla, **reduce el tamaño solo para ese formato** y prueba con la factorización más larga del catálogo (por ejemplo `(5x+3)(x+2)` o `2x²(x+4)`). No uses `font-size` por casilla ni reducciones automáticas con JavaScript.

## 6.5 Cómo ocultar el resto de la app al imprimir

- En `App.jsx`, cuando `pantalla === 'imprimir'`, renderiza **solo** `PaginaImpresion`. Así no existe otro DOM que ocultar.
- Todo lo que no sea `.print-area` lleva la clase `no-print`.
- Prueba imprimir desde la pantalla de impresión y comprueba que no salen botones, menús, ni encabezados de navegador.

## 6.6 Verificación de la fase

- [ ] Vista previa de impresión (Ctrl+P) con **"Más ajustes → Gráficos de fondo" desactivado**: todo se ve, bordes incluidos.
- [ ] Salida en **blanco y negro** (impresora o "Imprimir a PDF" en escala de grises).
- [ ] Tamaño carta, márgenes 10 mm, escala 100 %. Ninguna cuadrícula se corta entre páginas.
- [ ] Formato 1 por página: 30 páginas. Formato 2 por página: 15 páginas.
- [ ] Imprimir un solo cartón (por ejemplo el 07) funciona y muestra solo ese cartón.
- [ ] Los superíndices (`x²`, `x³`) se ven correctos en papel. **Imprime al menos 2 hojas reales** y míralas.
- [ ] Todas las factorizaciones caben en una línea dentro de su casilla.
- [ ] Cada cartón muestra "Cartón NN", su cuadrícula 5×5 de 25 casillas y la versión de cartones.
- [ ] Prueba automática en `tests/` (ligera, sin React): para cada cartón, todos los textos generados con `factorizacionATexto` son no vacíos y únicos dentro del cartón.

### Riesgos

- Fuente matemática ausente en la impresora o equipo: la pila de fuentes tiene respaldos (`Georgia`, `serif`). Verifica con una hoja real.
- Navegadores que ignoran `break-inside: avoid` dentro de `grid`: envuelve cada cartón en un contenedor `block` si ocurre.

### Terminada cuando

- [ ] Todo lo anterior marcado y se imprimieron al menos 2 hojas reales revisadas por el docente.

---

# FASE 7 · Música gratuita y efectos de sonido

**Objetivo:** música de fondo legalmente utilizable, almacenada localmente, con controles; efectos sintetizados e independientes.

## 7.1 Procedimiento de selección de la pista (obligatorio, en este orden)

**Nunca elijas una pista por memoria ni asumas que es gratuita.** Debes **consultar la página oficial de cada candidata** y su licencia.

1. Fuentes candidatas (investiga cada una en su sitio oficial): **OpenGameArt**, **Free Music Archive**, **Incompetech (Kevin MacLeod)**, **Pixabay Music**, y otras de dominio público/CC0 que encuentres.
2. Criterios de la pista: instrumental, alegre y dinámica, tipo videojuego o concurso, **sin voces**, volumen estable, que no distraiga de leer polinomios, duración ≥ 2 min (se reproduce en bucle), formato `.mp3` u `.ogg`.
3. Preferencia de licencia: **CC0 / dominio público** (sin atribución). Aceptable: **CC BY** (con atribución visible en "Créditos"). Cualquier otra licencia: léela completa y decide solo si permite **uso en una aplicación educativa, redistribución del archivo dentro del proyecto y no impone restricciones incompatibles**.
4. Para cada candidata registra en `public/audio/LICENCIAS.md`:

```markdown
## <Título de la pista>
- Autor/a:
- URL de origen (página oficial de la pista):
- Licencia y versión:
- URL de la licencia (texto oficial):
- ¿Exige atribución? Texto exacto de atribución:
- ¿Permite uso educativo/comercial? 
- ¿Permite redistribuir el archivo dentro de la app?
- Fecha de consulta:
- Archivo local: public/audio/<nombre>.mp3
```

5. **Si no puedes verificar la licencia de una pista, no la incluyas.**
6. **Plan B:** si ninguna candidata se puede verificar, entrega la app **sin pista**: los controles de música se muestran deshabilitados con el texto "Sin música instalada" y se documenta en el README cómo añadir una pista legal. **No uses música sin licencia verificada y no inventes una atribución.**
7. Descarga los archivos a `public/audio/` solo de la fuente oficial, con su licencia verificada. Cuida el tamaño (< 5 MB recomendado) y el volumen (sin picos).
8. Crea la pantalla de **Créditos** (ruta/estado `creditos` o diálogo) con autor, título, licencia, enlace y atribución exacta si la licencia la exige.

## 7.2 `features/audio/useAudio.js`

Reglas:

- La música **no arranca sola**. Se inicia con el clic de "¡Comenzar!" (política de autoplay de los navegadores): ese gesto llama a `iniciar()`.
- Un único `HTMLAudioElement` creado de forma perezosa, con `loop = true`. Ruta local relativa (`import.meta.env.BASE_URL + 'audio/<archivo>'`), nunca una URL remota.
- Si `play()` devuelve una promesa rechazada (por ejemplo `NotAllowedError`), captúrala y muestra el botón de reproducir como "pausado" sin romper la app.
- Volumen y silencio se aplican a la música; se persisten con `useAjustes`.

```js
import { useCallback, useEffect, useRef, useState } from 'react';

export function useAudio({ archivo, volumen, silenciado }) {
  const ref = useRef(null);
  const [sonando, setSonando] = useState(false);
  const [error, setError] = useState(false);

  const obtener = useCallback(() => {
    if (!archivo) return null;
    if (!ref.current) {
      const a = new Audio(archivo);
      a.loop = true;
      a.preload = 'auto';
      a.addEventListener('error', () => setError(true));
      ref.current = a;
    }
    return ref.current;
  }, [archivo]);

  useEffect(() => {
    const a = ref.current; if (!a) return;
    a.volume = Math.min(1, Math.max(0, volumen));
    a.muted = silenciado;
  }, [volumen, silenciado]);

  const reproducir = useCallback(async () => {
    const a = obtener(); if (!a) return;
    a.volume = volumen; a.muted = silenciado;
    try { await a.play(); setSonando(true); } catch { setSonando(false); }
  }, [obtener, volumen, silenciado]);

  const pausar = useCallback(() => { ref.current?.pause(); setSonando(false); }, []);
  const alternar = useCallback(() => (sonando ? pausar() : reproducir()), [sonando, pausar, reproducir]);

  useEffect(() => () => { ref.current?.pause(); }, []);   // limpieza al desmontar

  return { sonando, error, disponible: Boolean(archivo) && !error, reproducir, pausar, alternar };
}
```

## 7.3 `ControlesAudio.jsx`

- Botón **reproducir/pausar** (ícono + texto accesible).
- Control **deslizante de volumen** (`<input type="range" min="0" max="1" step="0.05">`) con etiqueta.
- Botón **silenciar** (ícono + texto "Silenciar"/"Quitar silencio").
- Interruptor independiente **"Efectos de sonido"**.
- Todo recuerda su estado en `liga-algebra.ajustes.v1`.

## 7.4 Efectos sintetizados · `features/audio/efectos.js`

Sin archivos ni licencias. Web Audio API, solo tras un gesto del usuario.

```js
let ctx = null;
const contexto = () => {
  if (!ctx) { const AC = window.AudioContext || window.webkitAudioContext; if (AC) ctx = new AC(); }
  if (ctx && ctx.state === 'suspended') ctx.resume();
  return ctx;
};

function nota(frecuencia, inicio, duracion, { tipo = 'sine', ganancia = 0.18 } = {}) {
  const c = contexto(); if (!c) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = tipo; osc.frequency.value = frecuencia;
  const t0 = c.currentTime + inicio;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(ganancia, t0 + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + duracion);
  osc.connect(g).connect(c.destination);
  osc.start(t0); osc.stop(t0 + duracion + 0.05);
}

export const efectos = {
  sortear:  () => { nota(660, 0, 0.12, { tipo: 'triangle' }); nota(880, 0.1, 0.16, { tipo: 'triangle' }); },
  pitido:   () => nota(1200, 0, 0.35, { tipo: 'square', ganancia: 0.12 }),
  victoria: () => [523, 659, 784, 1047].forEach((f, i) => nota(f, i * 0.14, 0.3, { tipo: 'triangle', ganancia: 0.22 })),
};
```

- Cada llamada respeta el interruptor `efectos` y el volumen general. Si `efectos` está desactivado, **no se llama** a la función.
- `sortear` suena al avanzar un turno; `pitido` al iniciar nueva partida; `victoria` junto con la celebración (y solo cuando hay `celebracion`).
- Fallos de Web Audio nunca deben romper el juego (`try/catch` alrededor).

## 7.5 Verificación de la fase

- [ ] `public/audio/LICENCIAS.md` completo, con URLs oficiales y fecha de consulta. **O** Plan B documentado.
- [ ] La música **no** suena al cargar la página; empieza tras "¡Comenzar!".
- [ ] Reproducir, pausar, volumen, silencio y interruptor de efectos funcionan, y su estado se recuerda al recargar.
- [ ] Sin conexión a Internet (modo avión o servidor local sin red): el audio sigue funcionando.
- [ ] No hay ninguna petición de red externa (pestaña *Red* del navegador).
- [ ] Pantalla de "Créditos" con la atribución exacta si la licencia la exige.
- [ ] Un fallo de carga de audio (archivo renombrado a propósito) no rompe la interfaz.

### Terminada cuando

- [ ] Todo lo anterior marcado.

---

# FASE 8 · QA final: pruebas matemáticas, funcionales y visuales

**Objetivo:** demostrar que se cumplen los criterios de aceptación.

## 8.1 Pruebas automáticas (deben pasar al 100 %)

```
npm test            # math, catálogo, cartones, motor, victoria, simulación, persistencia, impresión (textos)
npm run validar     # validadores de catálogo y cartones con métricas
npm run contraste   # contraste de la paleta
npm run build       # el proyecto compila sin errores
```

Revisa además que `npm run cartones` **no cambia** el archivo de datos (misma semilla → mismo resultado): `git diff --exit-code src/domain/cards/cartones.data.js` tras ejecutarlo.

## 8.2 Búsquedas de higiene (resultado esperado entre paréntesis)

```
grep -rnE "react|window|document|Math\.random" src/domain      # (vacío)
grep -rnE "https?://" src --include=*.js --include=*.jsx --include=*.css   # (solo enlaces de créditos/documentación, ninguno en carga de recursos)
grep -rn "localStorage" src                                    # (solo en src/shared/almacenamiento.js)
```

## 8.3 Pruebas manuales

| Área | Prueba | Resultado |
|---|---|---|
| Sorteo | Sortear 48 veces: no se repite ningún polinomio; al llegar al final el botón se deshabilita | ☐ |
| Historial | Coincide con lo sorteado y con el contador "sorteados/pendientes" | ☐ |
| Ganadores | Con semilla de pruebas, aparecen **todos** los ganadores del mismo turno, justo tras el sorteo | ☐ |
| Duplicados | Recargar con ganadores existentes no repite celebración ni duplica ganadores | ☐ |
| Reinicio | "Nueva partida" limpia historial y progreso; los cartones no cambian (mismo `VERSION_CARTONES`) | ☐ |
| Persistencia | Recargar a mitad de partida restaura turno y marcas; datos corruptos en `localStorage` no rompen la app | ☐ |
| Doble clic | Doble clic rápido en "Sortear" avanza un solo turno | ☐ |
| Verificar cartón | Un cartón al azar: las casillas ✓ coinciden con el historial | ☐ |
| Audio | Autoplay bloqueado → no hay errores; pausa/volumen/silencio OK | ☐ |
| Sin conexión | Con red desactivada, todo funciona (usando `npm run preview` o servidor local) | ☐ |
| Proyector | Desde el fondo del aula se lee el polinomio actual (prueba real o ventana a 1920×1080 a 4–5 m) | ☐ |
| Pantallas | 1920×1080, 1366×768, tableta y móvil sin solapamientos | ☐ |
| Impresión | Los 30 cartones y uno individual, en blanco y negro, sin controles | ☐ |
| Animaciones | Modo reducido y `prefers-reduced-motion` respetados | ☐ |
| Teclado | Toda la app usable sin ratón | ☐ |

## 8.4 Partida piloto

Juega **2–3 partidas completas** con semillas distintas y, si es posible, con 2–3 cartones reales a la vista, verificando a mano que el sorteo y el ganador coinciden con el papel. Anota hallazgos en `docs/QA.md`.

## 8.5 Terminada cuando

- [ ] Todas las pruebas automáticas en verde y todas las casillas manuales marcadas (o con una incidencia registrada y resuelta).
- [ ] `docs/QA.md` creado con fecha, versión de Node, navegador(es) probados y resultados.

---

# FASE 9 · Documentación y preparación para ejecutar o publicar

**Objetivo:** que cualquier persona pueda iniciar, usar y mantener la app solo con el README.

## 9.1 `README.md` (en español) debe incluir

1. **Qué es** (una descripción de 3 líneas) y captura de pantalla opcional.
2. **Requisitos:** versión de Node, navegador moderno.
3. **Cómo ejecutar:** `npm install` (si procede) y `npm run dev`.
4. **Cómo usar en clase:** imprimir cartones (con los ajustes de impresión), proyectar, flujo de una partida, qué hace "Mostrar respuesta", "Verificar cartón" y "Continuar".
5. **Cómo compilar y abrir sin conexión:** `npm run build` y `npm run preview` (o servir la carpeta de salida con un servidor estático local). **Aviso:** abrir el `index.html` compilado con doble clic (`file://`) puede fallar en algunos navegadores por los módulos ES; si el docente necesita doble clic, hay que evaluar (con aprobación) un plugin de un solo archivo.
6. **Cómo editar el catálogo y regenerar cartones**, con la **advertencia en negrita de que hay que reimprimir todos los cartones**:
   `editar ejercicios.data.js` → `npm test` → `npm run cartones` → `npm test` → `npm run validar` → imprimir.
7. **Cómo cambiar la regla de victoria** (`REGLA_POR_DEFECTO` en `domain/rules/index.js`).
8. **Arquitectura:** diagrama de módulos y reglas de dependencia (copia de la sección 4 del Skill 01).
9. **Limitaciones conocidas** (sección 3.3 del Skill 01).
10. **Créditos y licencias**, incluyendo la música.
11. **Solución de problemas:** audio no suena (pulsar "¡Comenzar!" / revisar volumen), impresión recortada (márgenes y escala), reiniciar datos (borrar claves `liga-algebra.*` del almacenamiento).

## 9.2 Cierre del proyecto

- [ ] `README.md`, `docs/DECISIONES.md`, `docs/INSPECCION.md`, `docs/QA.md` actualizados.
- [ ] `docs/DECISIONES.md` lista cada decisión D1–D11, quién la tomó, y los valores calibrados (`MAX_SOLAPE`, turno del primer ganador).
- [ ] Sin código muerto, sin `console.log` de depuración, sin la función de semilla por URL de la Fase 5 en producción.
- [ ] Sin dependencias nuevas, o cada una justificada por escrito.
- [ ] Commit final y, si procede, etiqueta con la versión de cartones.

---

# Criterios de aceptación finales

Los 16 del documento original más los 3 añadidos. Marca cada uno con la **evidencia** (comando, captura o nota en `docs/QA.md`).

1. ☐ La aplicación puede iniciarse localmente.
2. ☐ Existen exactamente 30 cartones predeterminados.
3. ☐ Los 30 cartones pueden imprimirse.
4. ☐ Cada cartón tiene una cuadrícula de 5 × 5.
5. ☐ Se muestran polinomios aleatorios sin repetirlos durante una partida.
6. ☐ Las expresiones pertenecen a un catálogo matemático verificado.
7. ☐ El sistema identifica las factorizaciones correspondientes (por `id`).
8. ☐ El progreso de los cartones se actualiza tras cada sorteo.
9. ☐ Se detectan automáticamente los cartones que completan sus 25 casillas.
10. ☐ Se muestran todos los ganadores de un mismo turno.
11. ☐ La partida se reinicia sin alterar los cartones.
12. ☐ Existe música de fondo gratuita y legalmente utilizable (o Plan B documentado).
13. ☐ El volumen y la reproducción se controlan.
14. ☐ La interfaz es legible mediante un proyector.
15. ☐ No hay backend ni cuentas de usuario.
16. ☐ La lógica matemática se prueba de forma independiente de la interfaz.
17. ☐ La identidad visual usa paleta pastel con texto de alto contraste y temática de matemáticas y deporte.
18. ☐ Los módulos de dominio funcionan y se prueban sin React.
19. ☐ Los cartones impresos llevan la versión de datos con la que se generaron.

---

# Informe final que debe entregar el agente

```
RESUMEN
- Versión de cartones: C-xxxxxxxx   Catálogo: 48 ejercicios
- Node: x.y.z   Navegadores probados: …
PRUEBAS
- npm test: N pruebas, 0 fallos   |   npm run validar: OK   |   npm run contraste: OK
- Simulación 1000 partidas: todos los cartones ganan. Primer ganador: promedio …, mín …, máx …
DECISIONES
- Por defecto aplicadas: … | Respondidas por el docente: …
- MAX_SOLAPE calibrado: …
AUDIO
- Pista: … Licencia: … (o Plan B)
LIMITACIONES
- (las de la sección 3.3 del Skill 01 + cualquier incidencia nueva)
PENDIENTE PARA EL DOCENTE
- Reimprimir cartones solo si cambia VERSION_CARTONES.
```

---

## Orden de ejecución resumido para el agente

1. **Skill 01:** Fase 1 (inspección, **espera aprobación**) → Fase 2 (catálogo, **espera revisión matemática**) → Fase 3 (cartones, **espera aprobación**).
2. **Skill 02:** Fase 4 (motor, ganadores, persistencia, pruebas, hook).
3. **Skill 03:** Fase 5 (diseño e interfaz, **espera aprobación visual**) → Fase 6 (impresión) → Fase 7 (audio con licencias verificadas) → Fase 8 (QA) → Fase 9 (documentación y cierre).
