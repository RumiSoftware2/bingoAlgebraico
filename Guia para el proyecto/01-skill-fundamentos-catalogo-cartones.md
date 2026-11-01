---
name: bingo-algebraico-01-fundamentos-catalogo-cartones
description: Skill 1 de 3 para construir la app educativa "Bingo Algebraico" (React + JavaScript + CSS, sin backend). Cubre las reglas globales del proyecto, las decisiones técnicas, la arquitectura modular con sus contratos entre módulos, y las Fases 1 a 3 (inspección del proyecto, catálogo matemático verificado de 48 ejercicios y generación controlada de los 30 cartones fijos). Úsalo SIEMPRE primero, antes de escribir cualquier otro código del proyecto, y vuelve a consultarlo cuando una decisión de arquitectura o de datos matemáticos esté en duda.
---

# Skill 01 · Fundamentos, catálogo matemático y cartones

> **Serie de 3 skills.** Ejecútalos en orden:
> 1. `01-skill-fundamentos-catalogo-cartones.md` (este archivo): reglas, arquitectura, Fases 1, 2 y 3.
> 2. `02-skill-motor-ganadores-pruebas.md`: Fase 4 (motor, ganadores, pruebas automáticas, puente a React).
> 3. `03-skill-interfaz-impresion-audio-cierre.md`: Fases 5 a 9 (interfaz, impresión, audio, QA, documentación).

---

## 0. Cómo debes trabajar (protocolo del agente)

1. **Lee los tres skills completos antes de empezar**, aunque solo ejecutes uno.
2. **Trabaja fase por fase y en orden.** No empieces una fase sin que la anterior cumpla su checklist de "Terminada cuando".
3. **Al cerrar cada fase** escribe un informe corto (qué hiciste, archivos creados/modificados, resultado de las pruebas, dudas). Si el proyecto usa git, haz un commit por fase con el mensaje `fase N: <resumen>`.
4. **Puntos de revisión humana (detente y espera aprobación del docente):**
   - Fin de Fase 1 (informe de inspección y decisiones).
   - Fin de Fase 2 (el docente revisa el contenido matemático).
   - Fin de Fase 3 (el docente aprueba los cartones antes de imprimir nada).
   - Fin de Fase 5 (el docente aprueba el diseño visual).
   - En cualquier otro punto continúa sin esperar.
5. **No inventes nada.** No inventes dependencias, versiones, licencias, APIs ni funciones de bibliotecas. Si necesitas un dato actual (licencia, versión), consúltalo en la documentación oficial.
6. **Si algo del proyecto real contradice este skill**, no lo fuerces: documenta la diferencia en `docs/DECISIONES.md` y aplica la solución que mantenga las reglas inviolables de la sección 2.
7. **Idioma:** la interfaz, los comentarios y la documentación van en español. Los identificadores de código pueden ir en español (como en este documento) pero deben ser coherentes en todo el proyecto.

---

## 1. Contexto

- App para proyectar en el aula con estudiantes de **grado octavo**. Practican los casos de factorización con una dinámica de bingo.
- El docente proyecta la app. Los estudiantes usan **cartones físicos impresos** (5×5) y los cubren con fichas o lápiz. No usan computadores, celulares ni cuentas.
- La app sortea un polinomio, el estudiante halla su factorización y la busca en su cartón.
- La app registra internamente lo sorteado y detecta cartones ganadores automáticamente.
- **Condición de victoria v1:** completar las 25 casillas del cartón (sin casilla libre).
- **Nuevo requisito de diseño:** interfaz moderna, **colores claros pastel**, temática de **matemáticas + deporte**. El texto debe ser de alto contraste para proyectar.
- **Nuevo requisito de arquitectura:** **módulos independientes**, cada uno con una sola responsabilidad.

---

## 2. Reglas inviolables

Si una tarea te obliga a romper alguna, detente y consulta.

| # | Regla |
|---|---|
| R1 | Stack: **React + JavaScript + CSS** (JSX/HTML por componentes). Sin TypeScript, backend, base de datos, autenticación, servicios de pago ni APIs externas. |
| R2 | **No reemplaces** el entorno de desarrollo existente (bundler, scripts, configuración). Extiéndelo. |
| R3 | **Cero dependencias nuevas** salvo justificación escrita y aprobada. Este plan **no necesita ninguna** para Fases 1 a 8. |
| R4 | La carpeta `src/domain/**` **nunca importa React**, ni toca el DOM, ni `window`, ni `localStorage`, ni `Math.random` dentro de funciones del motor. Debe poder ejecutarse con `node`. |
| R5 | Los ejercicios se identifican **por `id`**, jamás por comparación de texto. |
| R6 | El texto visible de polinomios y factorizaciones se **genera** desde datos estructurados. Nunca se escribe a mano. |
| R7 | Los 30 cartones son **datos estáticos generados una sola vez** por script con semilla fija. La app **nunca** los genera en ejecución. |
| R8 | El estado de la partida se **deriva** del historial. No se guardan marcas ni ganadores como estado independiente. |
| R9 | Texto siempre de alto contraste. El color **nunca** es el único indicador de algo (acompáñalo con texto o icono). |
| R10 | Sin CDN ni recursos remotos en tiempo de ejecución (fuentes, audio, imágenes, scripts). Todo local. |
| R11 | Las importaciones del dominio llevan extensión explícita (`./x.js`) para que Node pueda ejecutarlas sin bundler. |

---

## 3. Decisiones

### 3.1 Establecidas (vienen del docente)

- Stack, restricciones y condición de victoria v1 descritos arriba.
- 30 cartones fijos, 5×5, sin casilla libre, ids visibles "Cartón 01"…"Cartón 30".
- Sorteo sin repetición, historial visible, múltiples ganadores, reinicio sin alterar cartones.
- Impresión nativa del navegador con CSS (`@media print`), tamaño carta, válida en blanco y negro.
- Música gratuita con licencia verificada, almacenada localmente, con controles de volumen/pausa/silencio.
- Arquitectura modular y estética pastel matemática-deportiva.

### 3.2 Recomendadas con valor por defecto

Si el docente **no ha respondido**, usa el valor por defecto y regístralo en `docs/DECISIONES.md` con la fecha. Si ya respondió, usa su respuesta.

| # | Decisión | Valor por defecto |
|---|---|---|
| D1 | Casos incluidos | Los 6 (incluye agrupación y ax²+bx+c). Si el docente indica que alguno **no** se ha visto, ver sección 3.3. |
| D2 | Tamaño del catálogo | **48 ejercicios** (8+8+8+10+8+6). |
| D3 | Fin de partida | Termina con el primer ganador; botón "Continuar para el 2.º puesto" opcional. |
| D4 | Impresión | Configurable 1 o 2 cartones por página; **2 por defecto**. Se descarta 4. |
| D5 | Efectos de sonido | Sintetizados con Web Audio API (sin archivos). |
| D6 | Persistencia | Solo ajustes y `{semilla, turno, continuar}` de la partida, con versionado. |
| D7 | Pruebas | `node --test` (integrado). Sin Vitest salvo que ya exista en el proyecto. |
| D8 | Extras | "Verificar cartón" y "Tabla de posiciones": **sí**. |
| D9 | Nombre | **Liga del Álgebra** (título visible). El nombre técnico del proyecto no cambia. |
| D10 | Estilos | CSS plano con variables (tokens) + un archivo `.css` por módulo/feature. Sin Tailwind ni librerías de UI. |
| D11 | Render matemático | Formateador propio (tokens + `<sup>`). KaTeX solo si aparecen fracciones o raíces. |

### 3.3 Limitaciones conocidas de la v1 (documéntalas en el README)

- **Dificultad configurable:** el campo `nivel` se guarda en cada ejercicio, pero la v1 usa **un único juego de cartones** que mezcla niveles. Filtrar el mazo por nivel haría imposibles algunas casillas impresas, lo cual está prohibido. Dificultad configurable real exige **un juego de cartones distinto por nivel** (trabajo futuro).
- **Casos no vistos:** si el docente indica que un caso no se ha trabajado, hay que **regenerar catálogo y cartones** (y reimprimir). El procedimiento: quitar esos ejercicios del catálogo, ejecutar `npm run cartones`, correr las pruebas, obtener nueva versión de cartones. No se resuelve filtrando en tiempo de ejecución.
- **Variable única `x`** y coeficientes enteros pequeños.

---

## 4. Arquitectura

### 4.1 Regla de dependencias

```
ui-kit  ←  features/*  →  domain/*
                features/* NO se importan entre sí (salvo vía props desde App)
domain/*: math ← catalog ← cards ← engine ;  rules (independiente)
```

Cada módulo expone **solo** su `index.js`. Nadie importa archivos internos de otro módulo.

### 4.2 Módulos y responsabilidades

| Módulo | Responsabilidad única | Depende de | Prohibido |
|---|---|---|---|
| `domain/math` | Álgebra de polinomios, clave canónica, formateo a texto y tokens | nada | conocer el juego |
| `domain/catalog` | Ejercicios, casos, detectores y validador del catálogo | `math` | conocer cartones |
| `domain/cards` | Los 30 cartones estáticos, índice de casillas y validador | `catalog` | generar en tiempo de ejecución |
| `domain/engine` | RNG con semilla, mazo, reductor de turnos, reproducción del historial | `cards`, `rules` | `Math.random` en el reductor, DOM, React |
| `domain/rules` | Condiciones de victoria enchufables | nada | conocer React |
| `ui-kit` | Tokens CSS, componentes base (botón, tarjeta, chip, expresión matemática, íconos SVG) | nada | lógica del juego |
| `features/game` | Pantalla de juego y hook `useBingoGame` | `engine`, `ui-kit` | lógica matemática |
| `features/print` | Vista de impresión de cartones | `cards`, `catalog`, `ui-kit` | estado de la partida |
| `features/audio` | Música, volumen, efectos sintetizados | nada | conocer el juego |
| `features/settings` | Ajustes (animaciones, sonido) y persistencia | nada | conocer el dominio |

### 4.3 Estructura de carpetas objetivo

```
proyecto/
  docs/
    DECISIONES.md
    INSPECCION.md
  scripts/
    generarCartones.mjs
    validarTodo.mjs
    contraste.mjs
  public/
    audio/            (pistas + LICENCIAS.md)
  src/
    domain/
      math/       polinomio.js · formato.js · index.js
      catalog/    casos.js · ejercicios.data.js · validarCatalogo.js · index.js
      cards/      cartones.data.js · indice.js · validarCartones.js · index.js
      engine/     rng.js · mazo.js · reductor.js · reproducir.js · index.js
      rules/      cartonCompleto.js · lineas.js · index.js
    ui-kit/       tokens.css · base.css · Boton.jsx · Tarjeta.jsx · ChipCaso.jsx
                  ExpresionMatematica.jsx · iconos/ (Balon, Trofeo, Silbato, Ejes…) · index.js
    features/
      game/       PantallaInicio.jsx · PantallaJuego.jsx · Marcador.jsx · Historial.jsx
                  Posiciones.jsx · Podio.jsx · VerificarCarton.jsx · useBingoGame.js · game.css
      print/      PaginaImpresion.jsx · CartonImpreso.jsx · impresion.css
      audio/      useAudio.js · efectos.js · ControlesAudio.jsx
      settings/   useAjustes.js · PanelAjustes.jsx
    shared/       almacenamiento.js   (utilidad neutra de localStorage, usada por game y settings)
    App.jsx · main.jsx
  tests/          math.test.js · catalogo.test.js · cartones.test.js · motor.test.js
                  victoria.test.js · simulacion.test.js · persistencia.test.js
```

Si el proyecto existente ya tiene otra convención (por ejemplo `src/components`), **adáptala** manteniendo la separación domain / ui-kit / features. No muevas archivos existentes sin necesidad.

### 4.4 Contratos públicos (APIs que debes respetar)

Los otros skills asumen exactamente estos nombres.

```js
// domain/math/index.js
normalizar(p)            // quita ceros finales; [] se normaliza a [0]
grado(p)                 // grado del polinomio (0 para constantes)
multiplicar(a, b)        // producto de polinomios
potencia(p, n)           // p^n con n >= 1
igual(a, b)              // igualdad tras normalizar
mcd(a, b)                // entero >= 0
contenido(p)             // mcd de todos los coeficientes (>= 0)
expandir(factorizacion)  // -> polinomio
claveDe(p)               // -> string canónico, ej. "-9,0,1"
aTokens(p, opciones)     // -> arreglo de tokens para renderizar en React
aTexto(p, opciones)      // -> string plano con ² ³ Unicode (pruebas y depuración)
factorizacionATokens(f, opciones)
factorizacionATexto(f, opciones)
```

```js
// domain/catalog/index.js
EJERCICIOS               // arreglo congelado
EJERCICIOS_POR_ID        // Map(id -> ejercicio)
IDS_EJERCICIOS           // arreglo ordenado de ids
CASOS                    // { clave: { nombre, color, icono, detectar } }
VERSION_CATALOGO         // string manual, ej. 'cat-1'
huellaCatalogo()         // sha1 corto de ids+claves (solo en Node/pruebas)
```

```js
// domain/cards/index.js
CARTONES                 // [{ numero: 1..30, celdas: [25 ids] }]  (celda = fila*5 + col)
VERSION_CARTONES         // string, ej. 'C-3f9a12bc'
construirIndice(cartones)// Map(idEjercicio -> [{ cartonNumero, celda }])
etiquetaCarton(numero)   // 'Cartón 07'
```

```js
// domain/engine/index.js
crearRng(semilla), barajar(lista, rng), nuevaSemilla()
crearMazo(ids, semilla)
estadoInicial(semilla), reductor(estado, accion)
reproducir({ mazo, turno, cartones, indice, regla })
```

```js
// domain/rules/index.js
REGLAS = { cartonCompleto, fila, columna, diagonal, cualquierLinea }
// cada regla: { id, nombre, gana(marcas: boolean[25]) -> boolean, progreso(marcas) -> {hechas, total} }
```

---

# FASE 1 · Inspección del proyecto y decisiones de arquitectura

**Objetivo:** conocer el entorno real y fijar la estructura sin modificar nada.

### Tareas

1. Lee `package.json`: scripts, dependencias, versión de React, bundler (Vite, CRA, Next, etc.), si existe `"type": "module"`.
2. Lista el árbol `src/`, `public/` y la raíz (sin `node_modules`). Identifica archivos de configuración (`vite.config.*`, `eslint`, etc.).
3. Identifica cómo se estilan los componentes actuales (CSS global, módulos, etc.).
4. Revisa si hay `README`, pruebas, o git (`git status`, rama actual).
5. Verifica la versión de Node (`node --version`). Se necesita Node >= 18 para `node --test`. Anota si hay `crypto.getRandomValues` global (Node >= 19) o si hay que importarlo desde `node:crypto` en pruebas.
6. Comprueba que `npm run dev` (o el script equivalente) arranca. Si arranca, no cambies configuración.
7. Escribe `docs/INSPECCION.md` con: stack real, estructura actual, diferencias frente a la sección 4.3, riesgos, y la lista de scripts que añadirás (`test`, `cartones`, `validar`).
8. Escribe `docs/DECISIONES.md` con la tabla D1–D11 (valor adoptado y quién lo decidió: "docente" o "por defecto").

### Reglas de esta fase

- **No instales dependencias. No modifiques código existente.** Solo crea `docs/*.md`.
- Si falta `"type": "module"` en `package.json`, **no lo cambies tú**: repórtalo, porque afecta a las importaciones. Propón la solución (añadirlo si el proyecto ya es ESM, o ejecutar las pruebas con extensión `.mjs`).

### Riesgos

- Choque con una estructura existente → adaptar sin mover cosas.
- Versión antigua de Node → informar antes de seguir.

### Terminada cuando

- [ ] Existen `docs/INSPECCION.md` y `docs/DECISIONES.md`.
- [ ] No hay cambios en archivos ajenos a `docs/` (`git status` lo confirma).
- [ ] El docente aprobó el informe (**punto de revisión humana**).

---

# FASE 2 · Catálogo matemático verificado

**Objetivo:** 48 ejercicios correctos, sin ambigüedad de caso, identificables por `id` y verificables automáticamente.

### 2.1 Modelo de datos

Los polinomios son **arreglos de coeficientes de menor a mayor grado**: `x² − 9` → `[-9, 0, 1]`.

```js
{
  id: 'DC-01',                       // único, estable. NUNCA reutilizar un id para otro ejercicio
  caso: 'diferencia-cuadrados',      // clave de CASOS
  nivel: 1,                          // 1 básico, 2 intermedio (metadato en v1)
  polinomio: [-9, 0, 1],             // independiente de la factorización (ver validación)
  factorizacion: {
    constante: 1,                    // entero positivo; se muestra solo si es distinto de 1
    factores: [
      { coef: [-3, 1], exp: 1 },     // (x − 3)
      { coef: [ 3, 1], exp: 1 }      // (x + 3)
    ]
  },
  explicacion: 'a² − b² = (a − b)(a + b), con a = x y b = 3.'
}
```

**Convenciones obligatorias** (el validador las exige):

- Coeficiente principal del polinomio **> 0**.
- Todo factor lineal es **primitivo** (mcd de sus coeficientes = 1) y de coeficiente principal > 0. El contenido numérico va en `constante`.
- `constante` ≠ 1 **solo** en factor común.
- Orden de los factores (para que la casilla impresa sea única y predecible):
  - Factor común: `constante`, luego monomio `x^k` (si k>0), luego el cociente.
  - Diferencia de cuadrados y T. cuadrado perfecto: como en la tabla de 2.5.
  - `x²+bx+c`: ordenar por |b| ascendente; si empatan, el negativo primero.
  - `ax²+bx+c`: ordenar por `a` ascendente; si empatan, por |b| ascendente.
  - Agrupación: primero el lineal, luego el cuadrático `(cx²+d)`.

### 2.2 Módulo `domain/math/polinomio.js`

```js
// domain/math/polinomio.js  (JS puro, sin React)
export const normalizar = (p) => {
  const q = [...p];
  while (q.length > 1 && q[q.length - 1] === 0) q.pop();
  return q.length ? q : [0];
};

export const grado = (p) => normalizar(p).length - 1;

export const multiplicar = (a, b) => {
  const r = new Array(a.length + b.length - 1).fill(0);
  a.forEach((x, i) => b.forEach((y, j) => { r[i + j] += x * y; }));
  return normalizar(r);
};

export const potencia = (p, n) => {
  let r = [1];
  for (let i = 0; i < n; i++) r = multiplicar(r, p);
  return r;
};

export const igual = (a, b) => {
  const x = normalizar(a), y = normalizar(b);
  return x.length === y.length && x.every((v, i) => v === y[i]);
};

export const mcd = (a, b) => {
  a = Math.abs(a); b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a;
};

export const contenido = (p) => normalizar(p).reduce((g, c) => mcd(g, c), 0);

export const expandir = ({ constante, factores }) => {
  let r = [constante];
  for (const { coef, exp } of factores) r = multiplicar(r, potencia(coef, exp));
  return normalizar(r);
};

export const claveDe = (p) => normalizar(p).join(',');
```

**Por qué la clave canónica resuelve el problema de equivalencia:** `(x+2)(x+3)` y `(x+3)(x+2)` se expanden al mismo arreglo `[6,5,1]`. Por unicidad de la factorización en los enteros (lema de Gauss), **dos factorizaciones completas son equivalentes si y solo si expanden al mismo polinomio**. La clave del polinomio expandido es, por tanto, la identidad matemática. El `id` es la identidad operativa. El texto **nunca** se compara.

### 2.3 Módulo `domain/math/formato.js`

Reglas de formato (genera tokens para React y texto plano para pruebas):

- Signo menos real **"−" (U+2212)**, no guion.
- Términos de mayor a menor grado. Se omiten los de coeficiente 0.
- Coeficiente 1 se omite delante de `x` (`x`, no `1x`); −1 se escribe `−x`. El término independiente 1 sí se escribe.
- Exponente 1 no se escribe. Exponente ≥ 2 va como superíndice.
- Polinomio, opción `espaciado: 'normal'` → `x² + 5x + 6`, `x² − 9`. Opción `'compacto'` → `x²+5x+6`.
- Factorización, `'normal'` → `(x − 3)(x + 3)`; `'compacto'` → `(x−3)(x+3)`. Nunca hay espacio entre factores.
- Un factor se encierra en paréntesis salvo que sea el monomio `x` solo (coef `[0,1]`), que se escribe `x` o `x²` sin paréntesis.
- La `constante` ≠ 1 va delante sin paréntesis: `3x(x + 2)`, `5(2x − 3)`, `2x²(x + 4)`.
- Un factor con exponente va como `(x + 3)²` (el exponente después del paréntesis).
- El primer término de un factor lleva su signo solo si es negativo: `(−x…)` nunca ocurre por la convención de principal positivo.

**Tokens** (lo que devuelve `aTokens` / `factorizacionATokens`), un arreglo plano:

```js
{ t: 'txt', v: 'x' }       // texto normal
{ t: 'op',  v: '−' }       // operador con su espaciado ya resuelto en el CSS, no con espacios literales
{ t: 'sup', v: '2' }       // superíndice
{ t: 'par', v: '(' }       // paréntesis
```

`ExpresionMatematica.jsx` (Fase 5) convierte `sup` en `<sup>` y aplica clases por tipo. `aTexto` convierte `sup` a `² ³ ⁴…` Unicode y se usa **solo** en pruebas y depuración.

### 2.4 Módulo `domain/catalog/casos.js`

Cada caso define `nombre`, `color` (token CSS), `icono` (nombre de ícono del ui-kit) y un `detectar(ejercicio) -> boolean`. **Cada ejercicio debe ser detectado por exactamente un caso** y ese caso debe ser el declarado.

Notación: `p = [c0, c1, c2, …]`, `esCuadrado(n)` = entero ≥ 0 con raíz entera, `r(n)` = raíz entera.

| Caso (`clave`) | Condición sobre `polinomio` | Condición sobre `factorizacion` |
|---|---|---|
| `factor-comun` | `g = contenido(p)`, `k` = índice del primer coef ≠ 0; `(g>1 ∨ k>0)`; el cociente `q = p.slice(k).map(c=>c/g)` tiene grado 1, ambos coef ≠ 0 y `contenido(q)=1` | exactamente `constante=g`, monomio `x^k` si k>0, y el factor `q` |
| `diferencia-cuadrados` | grado 2, `c1=0`, `c0<0`, `c2>0`, `esCuadrado(−c0)`, `esCuadrado(c2)`, `mcd(r(c2), r(−c0))=1` | `constante=1`; factores `(ax−b)(ax+b)` con `a=r(c2)`, `b=r(−c0)` |
| `trinomio-cuadrado-perfecto` | grado 2, `c2>0`, `c0>0`, ambos cuadrados, `a=r(c2)`, `b=r(c0)`, `mcd(a,b)=1`, `\|c1\| = 2ab` | `constante=1`; un factor lineal con `exp=2` |
| `trinomio-x2-bx-c` | grado 2, `c2=1`, `c0≠0`, `c1≠0`, `disc=c1²−4c0 > 0` y cuadrado perfecto | `constante=1`; dos factores `(x+p)(x+q)` mónicos, `p≠q`, `p,q≠0`, `p+q=c1`, `pq=c0` |
| `trinomio-ax2-bx-c` | grado 2, `c2>1`, `contenido(p)=1`, `c0≠0`, `c1≠0`, `disc>0` y cuadrado perfecto | `constante=1`; dos factores lineales primitivos |
| `agrupacion` | grado 3, los 4 coef ≠ 0, `c3>0`, `contenido(p)=1`, `c3·c0 = c2·c1` | `constante=1`; exactamente 2 factores: lineal `(ax+b)` y cuadrático `(cx²+d)` con `c>0`, `d>0` y coef de x igual a 0 |

Exclusiones que garantizan unicidad de clasificación (todas se comprueban en el validador):

- `x²+6x+9` es solo TCP (el trinomio `x²+bx+c` exige `disc>0`, lo que excluye TCP).
- `x²−4` es solo diferencia de cuadrados (`x²+bx+c` exige `c1≠0`).
- `x²−5x` es solo factor común (`x²+bx+c` exige `c0≠0`).
- Diferencia de cuadrados y TCP exigen `mcd(a,b)=1` para que no haya factor común escondido (`4x²−36` queda fuera).
- `ax²+bx+c` exige `contenido=1` para que no haya factor común escondido.
- No incluir en v1 ejercicios como `3x²−12` (factor común + diferencia de cuadrados).

### 2.5 Los 48 ejercicios (datos)

Archivo `domain/catalog/ejercicios.data.js`. Usa estos helpers locales para reducir errores de transcripción. El `polinomio` se escribe **explícitamente** y por separado (no se calcula desde la factorización), para que la prueba "expandir(factorización) = polinomio" sea una verificación real.

```js
// El archivo de datos no importa nada. Helpers locales:
const lin  = (a, b, exp = 1) => ({ coef: [b, a], exp });   // (ax + b)
const cuad = (c, d)           => ({ coef: [d, 0, c], exp: 1 }); // (cx² + d)
const X    = (exp = 1)        => ({ coef: [0, 1], exp });  // x^exp
const F    = (constante, ...factores) => ({ constante, factores });
const ej   = (id, caso, nivel, polinomio, factorizacion, explicacion) =>
  Object.freeze({ id, caso, nivel, polinomio, factorizacion, explicacion });
```

> El archivo empieza con los helpers y termina con `export const EJERCICIOS = Object.freeze([ … ]);`. No importa ningún módulo.

Tabla completa. Cada fila es una llamada a `ej(...)`. `polinomio` en orden [c0, c1, …].

**Factor común (8)** · caso `factor-comun`

| id | nivel | polinomio (texto) | `polinomio` | `F(...)` | explicación sugerida |
|---|---|---|---|---|---|
| FC-01 | 1 | 3x + 6 | `[6,3]` | `F(3, lin(1,2))` | Factor común 3 en ambos términos. |
| FC-02 | 1 | 5x² − 10x | `[0,-10,5]` | `F(5, X(1), lin(1,-2))` | Factor común 5x. |
| FC-03 | 1 | x² + 7x | `[0,7,1]` | `F(1, X(1), lin(1,7))` | Factor común x. |
| FC-04 | 1 | 4x² − 12x | `[0,-12,4]` | `F(4, X(1), lin(1,-3))` | Factor común 4x. |
| FC-05 | 2 | 6x² + 9x | `[0,9,6]` | `F(3, X(1), lin(2,3))` | Factor común 3x (mcd de 6 y 9, y la x). |
| FC-06 | 2 | 2x³ + 8x² | `[0,0,8,2]` | `F(2, X(2), lin(1,4))` | Factor común 2x². |
| FC-07 | 1 | 10x − 15 | `[-15,10]` | `F(5, lin(2,-3))` | Factor común 5. |
| FC-08 | 1 | x³ − 5x² | `[0,0,-5,1]` | `F(1, X(2), lin(1,-5))` | Factor común x². |

Texto mostrado de la factorización: `3(x + 2)`, `5x(x − 2)`, `x(x + 7)`, `4x(x − 3)`, `3x(2x + 3)`, `2x²(x + 4)`, `5(2x − 3)`, `x²(x − 5)`.

**Diferencia de cuadrados (8)** · caso `diferencia-cuadrados`

| id | nivel | polinomio | `polinomio` | `F(1, …)` |
|---|---|---|---|---|
| DC-01 | 1 | x² − 9 | `[-9,0,1]` | `lin(1,-3), lin(1,3)` |
| DC-02 | 1 | x² − 16 | `[-16,0,1]` | `lin(1,-4), lin(1,4)` |
| DC-03 | 1 | x² − 25 | `[-25,0,1]` | `lin(1,-5), lin(1,5)` |
| DC-04 | 1 | x² − 49 | `[-49,0,1]` | `lin(1,-7), lin(1,7)` |
| DC-05 | 2 | 4x² − 9 | `[-9,0,4]` | `lin(2,-3), lin(2,3)` |
| DC-06 | 2 | 9x² − 4 | `[-4,0,9]` | `lin(3,-2), lin(3,2)` |
| DC-07 | 2 | 25x² − 16 | `[-16,0,25]` | `lin(5,-4), lin(5,4)` |
| DC-08 | 2 | 16x² − 1 | `[-1,0,16]` | `lin(4,-1), lin(4,1)` |

Explicación: `a² − b² = (a − b)(a + b)` con los valores de `a` y `b` de cada fila (por ejemplo DC-05: a = 2x, b = 3).

**Trinomio cuadrado perfecto (8)** · caso `trinomio-cuadrado-perfecto`

| id | nivel | polinomio | `polinomio` | `F(1, …)` |
|---|---|---|---|---|
| TC-01 | 1 | x² + 6x + 9 | `[9,6,1]` | `lin(1,3,2)` |
| TC-02 | 1 | x² − 8x + 16 | `[16,-8,1]` | `lin(1,-4,2)` |
| TC-03 | 1 | x² + 10x + 25 | `[25,10,1]` | `lin(1,5,2)` |
| TC-04 | 1 | x² − 12x + 36 | `[36,-12,1]` | `lin(1,-6,2)` |
| TC-05 | 2 | 4x² + 12x + 9 | `[9,12,4]` | `lin(2,3,2)` |
| TC-06 | 2 | 9x² − 12x + 4 | `[4,-12,9]` | `lin(3,-2,2)` |
| TC-07 | 2 | 25x² + 10x + 1 | `[1,10,25]` | `lin(5,1,2)` |
| TC-08 | 2 | 4x² − 20x + 25 | `[25,-20,4]` | `lin(2,-5,2)` |

Explicación: `a² ± 2ab + b² = (a ± b)²` con `a` y `b` de cada fila (por ejemplo TC-06: a = 3x, b = 2, término medio −2·3x·2 = −12x).

**Trinomio x² + bx + c (10)** · caso `trinomio-x2-bx-c` · nivel 1

| id | polinomio | `polinomio` | `F(1, …)` | Razonamiento (explicación) |
|---|---|---|---|---|
| XB-01 | x² + 5x + 6 | `[6,5,1]` | `lin(1,2), lin(1,3)` | Dos números que sumen 5 y multipliquen 6: 2 y 3. |
| XB-02 | x² + 7x + 12 | `[12,7,1]` | `lin(1,3), lin(1,4)` | Suman 7 y multiplican 12: 3 y 4. |
| XB-03 | x² + 8x + 15 | `[15,8,1]` | `lin(1,3), lin(1,5)` | Suman 8 y multiplican 15: 3 y 5. |
| XB-04 | x² − 5x + 6 | `[6,-5,1]` | `lin(1,-2), lin(1,-3)` | Suman −5 y multiplican 6: −2 y −3. |
| XB-05 | x² + x − 6 | `[-6,1,1]` | `lin(1,-2), lin(1,3)` | Suman 1 y multiplican −6: −2 y 3. |
| XB-06 | x² − x − 12 | `[-12,-1,1]` | `lin(1,3), lin(1,-4)` | Suman −1 y multiplican −12: 3 y −4. |
| XB-07 | x² + 2x − 15 | `[-15,2,1]` | `lin(1,-3), lin(1,5)` | Suman 2 y multiplican −15: −3 y 5. |
| XB-08 | x² − 7x + 10 | `[10,-7,1]` | `lin(1,-2), lin(1,-5)` | Suman −7 y multiplican 10: −2 y −5. |
| XB-09 | x² + 9x + 20 | `[20,9,1]` | `lin(1,4), lin(1,5)` | Suman 9 y multiplican 20: 4 y 5. |
| XB-10 | x² − 3x − 10 | `[-10,-3,1]` | `lin(1,2), lin(1,-5)` | Suman −3 y multiplican −10: 2 y −5. |

(Orden de factores: |b| ascendente; en empate, negativo primero. Por eso XB-06 se muestra `(x + 3)(x − 4)` y XB-07 `(x − 3)(x + 5)`.)

**Trinomio ax² + bx + c, a ≠ 1 (8)** · caso `trinomio-ax2-bx-c` · nivel 2

| id | polinomio | `polinomio` | `F(1, …)` |
|---|---|---|---|
| AX-01 | 2x² + 7x + 3 | `[3,7,2]` | `lin(1,3), lin(2,1)` |
| AX-02 | 3x² + 10x + 8 | `[8,10,3]` | `lin(1,2), lin(3,4)` |
| AX-03 | 2x² − 5x − 3 | `[-3,-5,2]` | `lin(1,-3), lin(2,1)` |
| AX-04 | 3x² + x − 2 | `[-2,1,3]` | `lin(1,1), lin(3,-2)` |
| AX-05 | 2x² + 5x − 12 | `[-12,5,2]` | `lin(1,4), lin(2,-3)` |
| AX-06 | 5x² + 13x + 6 | `[6,13,5]` | `lin(1,2), lin(5,3)` |
| AX-07 | 6x² + 7x + 2 | `[2,7,6]` | `lin(2,1), lin(3,2)` |
| AX-08 | 4x² − 4x − 3 | `[-3,-4,4]` | `lin(2,1), lin(2,-3)` |

Explicación: método de descomposición del término medio (producto `a·c`, suma `b`) o prueba y error con los factores de `a` y `c`; indica en cada caso el par usado (por ejemplo AX-01: a·c = 6, suma 7 → 6 y 1: 2x² + 6x + x + 3 = (x + 3)(2x + 1)).

**Agrupación de términos (6)** · caso `agrupacion` · nivel 2

| id | polinomio | `polinomio` | `F(1, …)` | Explicación |
|---|---|---|---|---|
| AG-01 | x³ + 2x² + 3x + 6 | `[6,3,2,1]` | `lin(1,2), cuad(1,3)` | x²(x + 2) + 3(x + 2) = (x + 2)(x² + 3). |
| AG-02 | x³ − 3x² + 2x − 6 | `[-6,2,-3,1]` | `lin(1,-3), cuad(1,2)` | x²(x − 3) + 2(x − 3) = (x − 3)(x² + 2). |
| AG-03 | 2x³ + x² + 6x + 3 | `[3,6,1,2]` | `lin(2,1), cuad(1,3)` | x²(2x + 1) + 3(2x + 1) = (2x + 1)(x² + 3). |
| AG-04 | x³ + 4x² + 5x + 20 | `[20,5,4,1]` | `lin(1,4), cuad(1,5)` | x²(x + 4) + 5(x + 4) = (x + 4)(x² + 5). |
| AG-05 | 3x³ − 2x² + 3x − 2 | `[-2,3,-2,3]` | `lin(3,-2), cuad(1,1)` | x²(3x − 2) + 1(3x − 2) = (3x − 2)(x² + 1). |
| AG-06 | x³ − 5x² + 4x − 20 | `[-20,4,-5,1]` | `lin(1,-5), cuad(1,4)` | x²(x − 5) + 4(x − 5) = (x − 5)(x² + 4). |

> **Escribe los términos del polinomio en orden de grado descendente al mostrarlos** (lo hace el formateador). En los datos el arreglo es ascendente.
> Todas las filas anteriores ya fueron comprobadas a mano por el autor del plan. **Aun así, la validación automática es la autoridad.** Si el validador rechaza una fila, **no cambies el validador**: corrige el dato y avísale al docente.

**Si el docente excluyó casos** (D1), elimina sus filas y ajusta la cuota de cartones de la Fase 3.

### 2.6 Validador `validarCatalogo.js`

Función pura `validarCatalogo(ejercicios, casos) -> { ok, errores: string[] }`. Recopila **todos** los errores (no se detiene en el primero). Comprueba:

1. `id` con formato `^[A-Z]{2}-\d{2}$`; ids únicos.
2. `caso` existe en `CASOS`.
3. `igual(expandir(factorizacion), polinomio)`.
4. Coeficiente principal de `polinomio` > 0; todos los coeficientes enteros; `|coef| ≤ 50`.
5. Todo factor lineal: primitivo (`contenido = 1`), principal > 0, `exp ≥ 1` entero.
6. `constante` entero ≥ 1; distinta de 1 solo si `caso = 'factor-comun'`.
7. `detectar` del caso declarado devuelve `true`, y los **demás** casos devuelven `false` (unicidad de clasificación).
8. Forma de la factorización según la tabla de 2.4 (por ejemplo, el orden de factores y que la forma de factor común coincida exactamente con `g`, `x^k` y `q`).
9. Claves canónicas `claveDe(polinomio)` únicas en todo el catálogo.
10. Textos generados `aTexto(polinomio)` únicos, y `factorizacionATexto(f)` únicos (evita que dos ids se vean igual en un cartón).
11. Distribución: conteo por caso igual al esperado (8,8,8,10,8,6 o el ajustado).
12. `nivel ∈ {1, 2}`.

### 2.7 Pruebas de esta fase (`tests/math.test.js`, `tests/catalogo.test.js`)

Con `node:test` y `node:assert/strict`.

- **math:** `multiplicar([2,1],[3,1])` = `[6,5,1]`; `expandir` de un caso con exponente (`(x+3)²`) = `[9,6,1]`; `normalizar([0,0])` = `[0]`; `mcd(12,18)` = 6; `contenido([6,9])` = 3; formato: `aTexto([-9,0,1])` = `x² − 9`, `aTexto([0,-10,5])` = `5x² − 10x`, `aTexto([-1,0,16])` = `16x² − 1`; factorización: `3x(x + 2)`, `(x + 3)²`, `(x² + 3)`… con casos extremos (coeficiente −1 delante de x, exponente 3).
- **catálogo:** `validarCatalogo(EJERCICIOS, CASOS).ok === true`; hay 48 ejercicios; **pruebas negativas**: construir ejercicios inválidos a propósito (signo erróneo, caso incorrecto, factor no primitivo, `4x²−36` etiquetado como diferencia de cuadrados, `x²+6x+9` etiquetado como `trinomio-x2-bx-c`, id duplicado) y comprobar que el validador **los rechaza**. Esto demuestra que el validador funciona.

### Riesgos de la fase

- Errores de signo en `polinomio` → los detecta la prueba 3.
- Detectores que se solapan → los detecta la prueba 7 (unicidad).
- Cambiar un `id` después de generar cartones → desincroniza. Ver Fase 3.

### Terminada cuando

- [ ] `npm test` pasa los tests de `math` y `catalogo`.
- [ ] Las pruebas negativas fallan como se espera (el validador no es decorativo).
- [ ] Imprimes en consola (script temporal o prueba) la lista `id · polinomio · factorización · caso` y se la entregas al docente. **Punto de revisión humana: el docente confirma el contenido matemático.**

---

# FASE 3 · Los 30 cartones predeterminados

**Objetivo:** 30 cartones de 5×5 balanceados, distintos entre sí, con solapamiento controlado, generados una vez y congelados como datos estáticos.

### 3.0 Tarea previa: `domain/engine/rng.js` (se reutiliza en Fase 4)

```js
// domain/engine/rng.js  (único lugar donde se genera aleatoriedad)
export function crearRng(semilla) {            // mulberry32
  let a = semilla >>> 0;
  return function rng() {
    a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;   // [0, 1)
  };
}

export function barajar(lista, rng) {           // Fisher–Yates, no muta la entrada
  const a = [...lista];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function nuevaSemilla() {                // se llama SOLO desde la interfaz, nunca desde el reductor
  const buf = new Uint32Array(1);
  globalThis.crypto.getRandomValues(buf);
  return buf[0];
}
```

Prueba mínima: misma semilla → misma secuencia; semillas distintas → secuencias distintas; `barajar` conserva los elementos y no muta la entrada.

### 3.1 Estrategia de construcción

El script `scripts/generarCartones.mjs` se ejecuta con `npm run cartones` y **escribe** `src/domain/cards/cartones.data.js`. Parámetros al inicio del script:

```js
const SEMILLA_CARTONES = 20260101;  // fija y documentada
const N_CARTONES = 30;
const N_CASILLAS = 25;
const CUOTAS = {                    // por cartón; suma 24 + 1 casilla "libre" de reparto
  'factor-comun': 4,
  'diferencia-cuadrados': 4,
  'trinomio-cuadrado-perfecto': 4,
  'trinomio-x2-bx-c': 5,
  'trinomio-ax2-bx-c': 4,
  'agrupacion': 3,
};
const MAX_SOLAPE = 19;              // máx. de ejercicios compartidos entre 2 cartones (se calibra, ver 3.3)
const MAX_INTENTOS_CARTON = 300;
const MAX_REINICIOS = 50;
```

**Por qué estas cuotas:** 30 cartones × cuota ÷ nº de ejercicios del caso = 15 apariciones exactas por ejercicio en FC, DC, TCP, XB, AX y AG (30·4/8, 30·4/8, 30·4/8, 30·5/10, 30·4/8, 30·3/6). La casilla número 25 reparte 30 apariciones extra entre los 48 ejercicios. Así **ningún ejercicio es raro ni dominante**.

**Algoritmo (pseudocódigo)**

```
repetir hasta MAX_REINICIOS:
  rng = crearRng(SEMILLA_CARTONES + reinicio)
  uso = Map(id -> 0);  cartones = []
  para i en 1..30:
    para intento en 1..MAX_INTENTOS_CARTON:
      elegidos = []
      para cada caso, cuota en CUOTAS:
        candidatos = ejercicios del caso ordenados por (uso[id] + rng()*0.99) ascendente
        elegidos += primeros `cuota` candidatos
      restantes = todos los ids \ elegidos, ordenados por (uso[id] + rng()*0.99)
      elegidos += restantes[0]                              // casilla de reparto
      ordenados = ordenar elegidos alfabéticamente          // para comparar conjuntos
      si existe cartón previo con el mismo conjunto: continuar
      si max(solape(ordenados, previo) para previo en cartones) > MAX_SOLAPE: continuar
      celdas = barajar(elegidos, rng)                       // posiciones 5x5 distintas
      uso[id]++ para id en elegidos
      cartones.push({ numero: i, celdas }); salir del bucle de intentos
    si no se logró un cartón: reiniciar todo con otra semilla derivada
  si se lograron 30: terminar
```

`solape(a, b)` = tamaño de la intersección de los **conjuntos** de ids.

### 3.2 Formato del archivo generado

```js
// GENERADO por scripts/generarCartones.mjs — NO EDITAR A MANO. Regenerar implica REIMPRIMIR los cartones.
export const VERSION_CARTONES = 'C-3f9a12bc';           // sha1 (8 hex) del contenido de CARTONES
export const HUELLA_CATALOGO_USADA = '9be01c77';        // huella del catálogo con el que se generó
export const CARTONES = Object.freeze([
  Object.freeze({ numero: 1, celdas: Object.freeze(['XB-03','DC-05', /* … 25 ids … */]) }),
  // … 30 cartones
]);
```

`celdas[fila*5 + col]` es el ejercicio de esa casilla. Los números van de 1 a 30 y se muestran como `Cartón 01`…`Cartón 30` (`etiquetaCarton`).

`VERSION_CARTONES` se calcula como los 8 primeros hex de `sha1(JSON.stringify(cartones))` con `node:crypto` dentro del script.
`HUELLA_CATALOGO_USADA` = `huellaCatalogo()`: sha1 de la concatenación `id|claveDe(polinomio)` de todos los ejercicios en orden de id. **Esto detecta si alguien cambió el catálogo sin regenerar cartones.**

### 3.3 Calibración del solapamiento

Antes de fijar `MAX_SOLAPE`:

1. Con el algoritmo ya funcionando y `MAX_SOLAPE = 25` (sin restricción), mide la distribución de solapes por pares (mínimo, promedio, máximo, histograma).
2. El mínimo teórico es 2 (principio del palomar: 25+25−48). El promedio esperado ronda 13.
3. Fija `MAX_SOLAPE` ligeramente por encima del percentil 95 observado, nunca por encima de 20. Si el valor resultante hace que el script no termine en pocos segundos, súbelo hasta lo estrictamente necesario.
4. Documenta los valores obtenidos en `docs/DECISIONES.md`.

### 3.4 Validador `domain/cards/validarCartones.js`

`validarCartones(cartones, catalogo) -> { ok, errores[], metricas }`. Comprueba:

1. Hay **exactamente 30** cartones, `numero` = 1..30 sin huecos.
2. Cada cartón tiene **exactamente 25** celdas.
3. Sin ids repetidos dentro de un cartón.
4. Todo id existe en el catálogo.
5. No hay dos cartones con el mismo **conjunto** de ejercicios (ni con la misma disposición).
6. Solape máximo por pares ≤ `MAX_SOLAPE`.
7. **Cobertura:** todo ejercicio del catálogo aparece en al menos un cartón (no hay sorteos inútiles) **y** todo id de los cartones está en el catálogo (no hay casillas imposibles).
8. Cuotas por caso respetadas en cada cartón.
9. Apariciones por ejercicio: mínimo y máximo dentro de [14, 17] (documentar si el resultado difiere).
10. `HUELLA_CATALOGO_USADA === huellaCatalogo()` y `VERSION_CARTONES` coincide con el hash recalculado.

`metricas`: solape mínimo/promedio/máximo, apariciones por ejercicio, apariciones por casilla (posición 0–24) para vigilar sesgos de posición.

### 3.5 Pruebas (`tests/cartones.test.js`)

- Todas las del validador sobre los datos reales.
- Pruebas negativas: un cartón con 24 casillas, un id inexistente, dos cartones idénticos, un id repetido en un cartón, una huella de catálogo alterada → el validador falla.
- **Idempotencia del script:** ejecutar el generador dos veces produce **exactamente el mismo archivo** (misma semilla). Se puede probar importando la función `generar()` del script (expórtala) y comparando con los datos guardados.

### Riesgos de la fase

- `MAX_SOLAPE` demasiado estricto → el script no termina. Mitigación: calibración (3.3) y reinicios.
- Sesgo de posición (un ejercicio siempre en la esquina) → `barajar` las celdas y vigilar `metricas`.
- Regenerar sin reimprimir → desfase entre papel y app. Mitigación: versión impresa en cada hoja.

### Terminada cuando

- [ ] `npm run cartones` genera `cartones.data.js` y repetirlo no lo cambia.
- [ ] `npm test` pasa `cartones.test.js`.
- [ ] El archivo está versionado (`VERSION_CARTONES`) y **congelado**: se comunica al equipo que no debe editarse a mano.
- [ ] El docente aprobó los cartones (**punto de revisión humana**).

---

## Entrega al siguiente skill

Al terminar, deben existir y funcionar: `domain/math`, `domain/catalog`, `domain/cards`, `domain/engine/rng.js`, `scripts/generarCartones.mjs`, `docs/*.md` y los tests asociados. Continúa con **`02-skill-motor-ganadores-pruebas.md`**.
