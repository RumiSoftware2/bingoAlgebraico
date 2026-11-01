---
name: bingo-algebraico-02-motor-ganadores-pruebas
description: Skill 2 de 3 para la app "Bingo Algebraico". Cubre la Fase 4 completa, es decir el motor del bingo (RNG con semilla, mazo sin repetición, reductor de turnos idempotente, reproducción del historial, detección de ganadores múltiples y reglas de victoria enchufables), la persistencia segura de la partida, el hook puente a React y toda la batería de pruebas automáticas con node --test incluida una simulación de 1000 partidas. Úsalo después de completar el Skill 01 y antes de construir la interfaz.
---

# Skill 02 · Motor del bingo, ganadores y pruebas

> **Requisito previo:** Skill 01 terminado (`domain/math`, `domain/catalog`, `domain/cards`, `domain/engine/rng.js`, datos de cartones congelados y aprobados).
> **Reglas inviolables:** son las R1–R11 del Skill 01, sección 2. En esta fase pesan sobre todo **R4** (dominio sin React/DOM/`Math.random`) y **R8** (estado derivado del historial).

---

## 0. Principio central: guardar poco, derivar todo

```
estado (lo único que existe)   = { semilla, turno, continuar }
mazo      = crearMazo(IDS_EJERCICIOS, semilla)      // calculado, determinista
historial = mazo.slice(0, turno)                    // calculado
marcas, conteos, ganadores = reproducir(historial)  // calculado
```

Consecuencias que buscamos (y que las pruebas deben demostrar):

| Problema | Cómo lo evita el diseño |
|---|---|
| Falsos ganadores | El estado de las casillas es siempre función del historial. No hay marcas "sueltas" que puedan desincronizarse. |
| Ganadores duplicados | Se calculan en una sola pasada con un `Set` de cartones que ya ganaron. |
| Doble ejecución en React StrictMode | El reductor es puro. No hay efectos secundarios en el sorteo. |
| Doble clic rápido | El reductor es **idempotente** por token `desdeTurno` (ver 2). |
| Reproducibilidad | Misma semilla + mismo turno = mismo resultado, siempre. |
| Inconsistencia al recargar | Solo se persiste `{semilla, turno, continuar}` y se valida la versión de cartones. |

---

# FASE 4 · Motor de sorteo y detección de ganadores

**Objetivo:** lógica pura de la partida, probada sin navegador.

### Archivos que se crean

```
src/domain/engine/  mazo.js · reductor.js · reproducir.js · persistencia.js · index.js   (rng.js ya existe)
src/domain/cards/   indice.js
src/domain/rules/   cartonCompleto.js · lineas.js · index.js
src/shared/         almacenamiento.js        (utilidad neutra de localStorage, ver 5)
scripts/            validarTodo.mjs
tests/              motor.test.js · victoria.test.js · simulacion.test.js · persistencia.test.js
```

### Dependencias

Ninguna nueva. Ajusta `package.json` (solo `scripts`, sin tocar nada más):

```json
{
  "scripts": {
    "test": "node --test",
    "cartones": "node scripts/generarCartones.mjs",
    "validar": "node scripts/validarTodo.mjs"
  }
}
```

> `node --test` sin argumentos descubre los archivos `*.test.js`. Comprueba que funciona con la versión de Node instalada (anotada en `docs/INSPECCION.md`). Si el proyecto ya tiene un script `test`, **no lo reemplaces**: añade `test:dominio`.

---

## 1. Índice de casillas · `domain/cards/indice.js`

Se construye una vez. Permite saber en O(1) qué casillas de qué cartones contienen un ejercicio.

```js
// Map(idEjercicio -> [{ cartonNumero, celda }])
export function construirIndice(cartones) {
  const indice = new Map();
  for (const carton of cartones) {
    carton.celdas.forEach((id, celda) => {
      if (!indice.has(id)) indice.set(id, []);
      indice.get(id).push({ cartonNumero: carton.numero, celda });
    });
  }
  return indice;
}

export const etiquetaCarton = (n) => `Cartón ${String(n).padStart(2, '0')}`;
```

Exporta `construirIndice` y `etiquetaCarton` desde `domain/cards/index.js`.

---

## 2. Mazo y reductor

### 2.1 `domain/engine/mazo.js`

```js
import { crearRng, barajar } from './rng.js';

// Ordenar primero hace que el mazo NO dependa del orden en que estén escritos los datos.
export function crearMazo(ids, semilla) {
  return barajar([...ids].sort(), crearRng(semilla));
}
```

### 2.2 `domain/engine/reductor.js`

```js
export const estadoInicial = (semilla) => ({ semilla, turno: 0, continuar: false });

/**
 * Acciones:
 *  { tipo:'SORTEAR', desdeTurno, maxTurno, bloqueada }
 *  { tipo:'NUEVA', semilla }
 *  { tipo:'CONTINUAR' }
 *  { tipo:'RESTAURAR', estado }
 */
export function reductor(estado, accion) {
  switch (accion.tipo) {
    case 'SORTEAR': {
      // Idempotencia: solo avanza si la acción nació del turno actual.
      // Un doble clic (o un doble despacho de StrictMode) despacha dos veces el mismo
      // `desdeTurno`; la segunda ya no coincide y se ignora.
      if (accion.bloqueada) return estado;
      if (estado.turno !== accion.desdeTurno) return estado;
      if (estado.turno >= accion.maxTurno) return estado;
      return { ...estado, turno: estado.turno + 1 };
    }
    case 'NUEVA':
      return estadoInicial(accion.semilla);
    case 'CONTINUAR':
      return estado.continuar ? estado : { ...estado, continuar: true };
    case 'RESTAURAR':
      return accion.estado;
    default:
      return estado;
  }
}
```

**Reglas del reductor:** sin `Math.random`, sin `Date`, sin acceso a almacenamiento. La semilla nueva llega **ya generada** en la acción `NUEVA` (la genera el manejador de evento con `nuevaSemilla()`).

---

## 3. Reglas de victoria enchufables · `domain/rules`

`marcas` es un arreglo de 25 booleanos, índice `celda = fila*5 + col`.

```js
// rules/cartonCompleto.js
export const cartonCompleto = {
  id: 'carton-completo',
  nombre: 'Cartón completo',
  gana: (m) => m.length === 25 && m.every(Boolean),
  progreso: (m) => ({ hechas: m.filter(Boolean).length, total: 25 }),
};
```

```js
// rules/lineas.js
const rango = (n) => Array.from({ length: n }, (_, i) => i);
export const FILAS = rango(5).map((f) => rango(5).map((c) => f * 5 + c));
export const COLUMNAS = rango(5).map((c) => rango(5).map((f) => f * 5 + c));
export const DIAGONALES = [[0, 6, 12, 18, 24], [4, 8, 12, 16, 20]];

export function crearReglaDeLineas(id, nombre, lineas) {
  return {
    id, nombre,
    gana: (m) => lineas.some((l) => l.every((i) => m[i])),
    progreso: (m) => ({
      hechas: Math.max(...lineas.map((l) => l.filter((i) => m[i]).length)),
      total: 5,
    }),
  };
}

export const fila = crearReglaDeLineas('fila', 'Una fila', FILAS);
export const columna = crearReglaDeLineas('columna', 'Una columna', COLUMNAS);
export const diagonal = crearReglaDeLineas('diagonal', 'Una diagonal', DIAGONALES);
export const cualquierLinea = crearReglaDeLineas('cualquier-linea', 'Cualquier línea',
  [...FILAS, ...COLUMNAS, ...DIAGONALES]);
```

```js
// rules/index.js
import { cartonCompleto } from './cartonCompleto.js';
import { fila, columna, diagonal, cualquierLinea } from './lineas.js';
export const REGLAS = { cartonCompleto, fila, columna, diagonal, cualquierLinea };
export const REGLA_POR_DEFECTO = cartonCompleto;
```

Añadir un modo nuevo de bingo **solo** requiere crear un objeto con `gana` y `progreso` y registrarlo aquí. El motor no cambia.

**Implicación de usar 25 casillas sin casilla libre (para el README y para el docente):** un cartón gana únicamente cuando salieron **sus 25 ejercicios** de un mazo de 48. Estadísticamente el primer ganador aparece muy tarde (en torno al turno 43 de 48; las simulaciones del punto 6.5 lo confirman o corrigen). Por eso la partida dura casi todo el mazo. Si el docente la quiere más corta, las opciones son: usar la regla de líneas (sin cambiar el motor), o reducir el catálogo (lo que exige regenerar y reimprimir cartones).

---

## 4. Reproducción del historial · `domain/engine/reproducir.js`

Es el corazón de la detección de ganadores.

```js
const contar = (marcas) => marcas.reduce((n, v) => n + (v ? 1 : 0), 0);

export function reproducir({ mazo, turno, cartones, indice, regla }) {
  const marcas = new Map(cartones.map((c) => [c.numero, new Array(25).fill(false)]));
  const ganadores = [];
  const yaGano = new Set();

  for (let t = 1; t <= turno; t++) {
    const afectados = new Set();
    for (const { cartonNumero, celda } of indice.get(mazo[t - 1]) ?? []) {
      marcas.get(cartonNumero)[celda] = true;
      afectados.add(cartonNumero);
    }
    // Orden determinista para que varios ganadores del mismo turno salgan siempre igual.
    for (const n of [...afectados].sort((a, b) => a - b)) {
      if (!yaGano.has(n) && regla.gana(marcas.get(n))) {
        yaGano.add(n);
        ganadores.push({ cartonNumero: n, turno: t, casillas: contar(marcas.get(n)) });
      }
    }
  }

  const progresos = new Map(cartones.map((c) => [c.numero, regla.progreso(marcas.get(c.numero))]));
  return {
    historial: mazo.slice(0, turno),
    ultimoId: turno > 0 ? mazo[turno - 1] : null,
    marcas,                                   // Map(cartonNumero -> boolean[25])
    progresos,                                // Map(cartonNumero -> {hechas,total})
    ganadores,                                // [{cartonNumero, turno, casillas}]
    ganadoresDelTurno: ganadores.filter((g) => g.turno === turno),
  };
}

// Cartones más cercanos a ganar (para la "Tabla de posiciones"). Orden: más hechas, luego menor número.
export function clasificar(resultado, top = 5) {
  return [...resultado.progresos.entries()]
    .map(([cartonNumero, p]) => ({ cartonNumero, ...p }))
    .sort((a, b) => b.hechas - a.hechas || a.cartonNumero - b.cartonNumero)
    .slice(0, top);
}

// Agrupa ganadores por turno; los empatados comparten puesto. Usado por el podio.
export function calcularPodio(ganadores) {
  const porTurno = new Map();
  for (const g of ganadores) {
    if (!porTurno.has(g.turno)) porTurno.set(g.turno, []);
    porTurno.get(g.turno).push(g.cartonNumero);
  }
  return [...porTurno.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([turno, cartones], i) => ({ puesto: i + 1, turno, cartones: cartones.sort((a, b) => a - b) }));
}

// Para el extra "Verificar cartón": 25 celdas con su ejercicio y si ya salió.
export function verificarCarton({ carton, marcas }) {
  const m = marcas.get(carton.numero);
  return carton.celdas.map((id, celda) => ({ celda, id, salio: m[celda] }));
}
```

**Por qué cumple lo pedido**

- **Múltiples ganadores:** varios cartones pueden entrar en el mismo `t`. Se reportan todos, ordenados por número.
- **Sin duplicados:** `yaGano` impide anunciar dos veces el mismo cartón. Además, el resultado es una función pura, así que renderizar dos veces no duplica nada.
- **Reproducibilidad:** `reproducir` solo depende de `mazo`, `turno`, `cartones` y `regla`.
- **El resultado al turno `t` es prefijo del resultado al turno `t+1`** (propiedad que se prueba).
- Complejidad: ≤ 48 turnos × pocos cartones por ejercicio. Se recalcula entera en cada render sin costo apreciable. **No optimices antes de medir.**

### 4.1 `domain/engine/index.js`

```js
export { crearRng, barajar, nuevaSemilla } from './rng.js';
export { crearMazo } from './mazo.js';
export { estadoInicial, reductor } from './reductor.js';
export { reproducir, clasificar, calcularPodio, verificarCarton } from './reproducir.js';
export { serializarPartida, restaurarPartida, CLAVE_PARTIDA } from './persistencia.js';
```

---

## 5. Persistencia segura de la partida

### 5.1 `domain/engine/persistencia.js` (pura, sin `localStorage`)

```js
export const CLAVE_PARTIDA = 'liga-algebra.partida.v1';

export function serializarPartida(estado, ctx) {
  return JSON.stringify({
    v: 1,
    versionCartones: ctx.versionCartones,
    semilla: estado.semilla,
    turno: estado.turno,
    continuar: estado.continuar,
  });
}

// Devuelve un estado válido o null. NUNCA lanza.
export function restaurarPartida(texto, ctx) {
  try {
    const d = JSON.parse(texto);
    const semillaOk = Number.isInteger(d.semilla) && d.semilla >= 0 && d.semilla <= 4294967295;
    const turnoOk = Number.isInteger(d.turno) && d.turno >= 0 && d.turno <= ctx.totalMazo;
    if (d.v !== 1 || d.versionCartones !== ctx.versionCartones) return null;
    if (!semillaOk || !turnoOk || typeof d.continuar !== 'boolean') return null;
    return { semilla: d.semilla, turno: d.turno, continuar: d.continuar };
  } catch {
    return null;
  }
}
```

**Por qué no hay inconsistencias:** lo guardado son tres números/booleanos. Marcas y ganadores se recalculan. Si el `localStorage` está corrupto, tiene otra versión de cartones, o falta, se descarta y la partida empieza limpia. Un estado restaurado nunca puede contradecir el historial porque **el historial no se guarda**: se regenera desde la semilla.

### 5.2 `src/shared/almacenamiento.js` (utilidad neutra)

```js
// Acceso seguro: localStorage puede no existir (modo privado, bloqueado) o lanzar.
export function leer(clave) {
  try { return window.localStorage.getItem(clave); } catch { return null; }
}
export function guardar(clave, texto) {
  try { window.localStorage.setItem(clave, texto); } catch { /* silencio: no es crítico */ }
}
export function borrar(clave) {
  try { window.localStorage.removeItem(clave); } catch { /* idem */ }
}
```

`features/settings` reutiliza este mismo archivo (no crea otro). **Ajuste a la estructura del Skill 01 (4.3):** en lugar de `features/settings/almacenamiento.js` existe `src/shared/almacenamiento.js`, para que ni `game` ni `settings` dependan entre sí.

---

## 6. Pruebas automáticas (`node --test`)

Estructura común: `import test from 'node:test'; import assert from 'node:assert/strict';`.

### 6.1 `tests/motor.test.js`

- `crearRng`: misma semilla → misma secuencia de 100 números; semillas distintas → difieren; valores en `[0,1)`.
- `barajar`: conserva elementos (misma longitud y mismo conjunto), no muta la entrada.
- `crearMazo`: longitud 48, **sin repetidos**, mismo conjunto que `IDS_EJERCICIOS`, determinista con la misma semilla, **independiente del orden** de la lista de entrada.
- `reductor`:
  - `SORTEAR` desde turno 0 con `desdeTurno: 0` → turno 1.
  - **Idempotencia:** dos `SORTEAR` con el mismo `desdeTurno` seguidos → turno 1 (no 2).
  - `bloqueada: true` → no cambia (misma referencia de objeto).
  - `turno = maxTurno` → no avanza más allá del mazo.
  - `NUEVA` → `turno 0`, `continuar false`, semilla nueva.
  - `CONTINUAR` es idempotente.
- **Historial coincide con los sorteos:** tras 10 `SORTEAR` encadenados, `reproducir(...).historial` es igual a `mazo.slice(0, 10)`.
- **Se detiene al agotar el mazo:** `turno === 48` no pasa de 48 aunque se despache más.
- **Reinicio:** tras `NUEVA`, se puede avanzar de nuevo y el nuevo mazo es válido.
- `indice`: cada celda de cada cartón aparece exactamente una vez en el índice (suma de longitudes = 750).

### 6.2 `tests/victoria.test.js`

Con mazo y cartones **de juguete** (por ejemplo 3 cartones de 25 ids sintéticos `E01…E30` y un mazo fijo escrito a mano) para controlar el resultado:

- Un cartón **no** gana con 24 de 25 marcas; **sí** con 25.
- Varios ganadores en el mismo turno (dos cartones cuya última casilla es el mismo ejercicio) → ambos en `ganadoresDelTurno`, con el mismo `turno` y orden por número.
- Un cartón que ganó no se repite en `ganadores` aunque se reproduzcan más turnos.
- `ganadoresDelTurno` aparece **en el mismo turno** en que se completa (ni antes ni después).
- `casillas` del ganador = 25.
- Las marcas coinciden con el historial: una celda está `true` si y solo si su id está en `historial`. (Comprobación exhaustiva sobre los datos reales en varios turnos.)
- Reglas de líneas: una fila completa gana con `fila` y no con `cartonCompleto`; una columna con `columna`; una diagonal con `diagonal`; `cualquierLinea` acepta las tres; `progreso` devuelve el máximo de la mejor línea.
- `clasificar` devuelve como máximo `top` cartones, ordenados por hechas desc y número asc.
- `calcularPodio`: empates comparten puesto; los puestos siguen la secuencia de turnos distintos.

### 6.3 `tests/simulacion.test.js`

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import { CARTONES, construirIndice } from '../src/domain/cards/index.js';
import { IDS_EJERCICIOS } from '../src/domain/catalog/index.js';
import { crearMazo, reproducir } from '../src/domain/engine/index.js';
import { REGLAS } from '../src/domain/rules/index.js';

test('simulación de 1000 partidas: ninguna casilla es imposible', () => {
  const indice = construirIndice(CARTONES);
  const regla = REGLAS.cartonCompleto;
  const primerGanador = [];
  for (let semilla = 1; semilla <= 1000; semilla++) {
    const mazo = crearMazo(IDS_EJERCICIOS, semilla);
    const fin = reproducir({ mazo, turno: mazo.length, cartones: CARTONES, indice, regla });
    // Con todo el mazo sorteado, TODOS los cartones deben haber ganado.
    assert.equal(fin.ganadores.length, CARTONES.length, `semilla ${semilla}`);
    primerGanador.push(Math.min(...fin.ganadores.map((g) => g.turno)));
  }
  const prom = primerGanador.reduce((a, b) => a + b, 0) / primerGanador.length;
  console.log(`Primer ganador: promedio turno ${prom.toFixed(1)}, ` +
              `mín ${Math.min(...primerGanador)}, máx ${Math.max(...primerGanador)}`);
});

test('el resultado al turno t es prefijo del resultado al turno t+1', () => {
  const indice = construirIndice(CARTONES);
  const regla = REGLAS.cartonCompleto;
  const mazo = crearMazo(IDS_EJERCICIOS, 12345);
  let previo = [];
  for (let t = 0; t <= mazo.length; t++) {
    const r = reproducir({ mazo, turno: t, cartones: CARTONES, indice, regla });
    assert.deepEqual(r.ganadores.slice(0, previo.length), previo, `turno ${t}`);
    previo = r.ganadores;
  }
});

test('reproducibilidad: misma semilla y turno dan el mismo resultado', () => {
  const indice = construirIndice(CARTONES);
  const regla = REGLAS.cartonCompleto;
  const a = reproducir({ mazo: crearMazo(IDS_EJERCICIOS, 777), turno: 45, cartones: CARTONES, indice, regla });
  const b = reproducir({ mazo: crearMazo(IDS_EJERCICIOS, 777), turno: 45, cartones: CARTONES, indice, regla });
  assert.deepEqual(a.ganadores, b.ganadores);
  assert.deepEqual([...a.progresos], [...b.progresos]);
});
```

Registra en `docs/DECISIONES.md` el promedio, mínimo y máximo del turno del primer ganador, y compáralos con la estimación (~43). Si el mínimo es muy bajo o el máximo no llega a 48, **informa**: puede indicar un problema de balance.

### 6.4 `tests/persistencia.test.js`

- `serializarPartida` → `restaurarPartida` devuelve el mismo estado.
- Devuelve `null` con: texto vacío, JSON inválido, `v` distinta, `versionCartones` distinta, `turno` negativo, `turno > totalMazo`, semilla no entera, `continuar` no booleano, `null`/`undefined`.
- **Nunca lanza** (prueba con entradas basura).
- Consistencia: restaurar `{semilla, turno}` y reproducir da el mismo resultado que la partida original.

### 6.5 `scripts/validarTodo.mjs`

Ejecuta `validarCatalogo` y `validarCartones`, imprime las métricas (solape, apariciones, cuotas) y termina con `process.exit(1)` si hay errores. Se usa antes de publicar y en la Fase 8.

---

## 7. Puente a React · `features/game/useBingoGame.js`

Este hook es el **único** punto donde el motor toca React. Debe ser delgado: no contiene lógica matemática ni de victoria.

```js
import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { CARTONES, VERSION_CARTONES, construirIndice } from '../../domain/cards/index.js';
import { IDS_EJERCICIOS } from '../../domain/catalog/index.js';
import {
  crearMazo, estadoInicial, reductor, reproducir, nuevaSemilla,
  serializarPartida, restaurarPartida, CLAVE_PARTIDA,
} from '../../domain/engine/index.js';
import { REGLA_POR_DEFECTO } from '../../domain/rules/index.js';
import { leer, guardar, borrar } from '../../shared/almacenamiento.js';

const INDICE = construirIndice(CARTONES);          // una sola vez
const TOTAL = IDS_EJERCICIOS.length;
const CTX = { versionCartones: VERSION_CARTONES, totalMazo: TOTAL };

function cargarInicial() {
  const texto = leer(CLAVE_PARTIDA);
  const restaurado = texto ? restaurarPartida(texto, CTX) : null;
  return restaurado ?? estadoInicial(nuevaSemilla());
}

export function useBingoGame(regla = REGLA_POR_DEFECTO) {
  const [estado, dispatch] = useReducer(reductor, undefined, cargarInicial);
  const mazo = useMemo(() => crearMazo(IDS_EJERCICIOS, estado.semilla), [estado.semilla]);
  const resultado = useMemo(
    () => reproducir({ mazo, turno: estado.turno, cartones: CARTONES, indice: INDICE, regla }),
    [mazo, estado.turno, regla],
  );

  const hayGanadores = resultado.ganadores.length > 0;
  const mazoAgotado = estado.turno >= mazo.length;
  const bloqueada = mazoAgotado || (hayGanadores && !estado.continuar);

  const sortear = useCallback(
    () => dispatch({ tipo: 'SORTEAR', desdeTurno: estado.turno, maxTurno: mazo.length, bloqueada }),
    [estado.turno, mazo.length, bloqueada],
  );
  const nuevaPartida = useCallback(() => dispatch({ tipo: 'NUEVA', semilla: nuevaSemilla() }), []);
  const continuar = useCallback(() => dispatch({ tipo: 'CONTINUAR' }), []);

  // Persistencia: solo {semilla, turno, continuar}.
  useEffect(() => { guardar(CLAVE_PARTIDA, serializarPartida(estado, CTX)); }, [estado]);

  // Celebración: solo cuando el turno AVANZA durante esta sesión (no al recargar la página).
  const turnoVisto = useRef(estado.turno);
  const [celebracion, setCelebracion] = useState(null);
  useEffect(() => {
    if (estado.turno === 0) setCelebracion(null);
    else if (estado.turno > turnoVisto.current && resultado.ganadoresDelTurno.length > 0) {
      setCelebracion({ turno: estado.turno, cartones: resultado.ganadoresDelTurno.map((g) => g.cartonNumero) });
    }
    turnoVisto.current = estado.turno;
  }, [estado.turno]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    estado, mazo, resultado,
    turno: estado.turno, total: TOTAL, pendientes: TOTAL - estado.turno,
    ejercicioActualId: resultado.ultimoId,
    hayGanadores, mazoAgotado, bloqueada,
    fase: estado.turno === 0 ? 'inicio' : bloqueada ? 'terminada' : 'en-curso',
    celebracion, cerrarCelebracion: () => setCelebracion(null),
    sortear, nuevaPartida, continuar,
    descartarGuardado: () => borrar(CLAVE_PARTIDA),
  };
}
```

**Puntos críticos (verifícalos en la Fase 5 y la Fase 8):**

1. `nuevaSemilla()` solo se llama desde `cargarInicial` (una vez) y desde `nuevaPartida` (evento del usuario). Nunca dentro del reductor ni en el render.
2. `cargarInicial` se pasa como inicializador perezoso de `useReducer`: no vuelve a ejecutarse en cada render.
3. En StrictMode los efectos se ejecutan dos veces en desarrollo. La celebración usa `turnoVisto` para no duplicarse: la segunda ejecución ve `turno === turnoVisto.current` y no hace nada.
4. Un ganador que ya existía al recargar **no** dispara celebración (`turnoVisto` arranca con el turno restaurado), pero **sí** se muestra en el panel de ganadores, porque ese panel se alimenta de `resultado.ganadores`.
5. Si `fase === 'terminada'`, el botón de sortear debe estar **deshabilitado** (la UI también protege, aunque el reductor ya lo bloquea).

---

## 8. Riesgos de la fase

| Riesgo | Mitigación |
|---|---|
| Impurezas bajo StrictMode | Reductor puro + token `desdeTurno` + celebración con `useRef`. |
| Mazo dependiente del orden de los datos | `crearMazo` ordena los ids antes de barajar. |
| `Uint32` y semillas negativas | `crearRng` usa `>>> 0`; `nuevaSemilla` devuelve un entero sin signo. |
| `localStorage` bloqueado | `almacenamiento.js` captura excepciones; la partida sigue funcionando en memoria. |
| Cambiar cartones/catálogo con partidas guardadas | Se descartan por `versionCartones` distinta. |

## 9. Terminada cuando

- [ ] `npm test` pasa `motor`, `victoria`, `simulacion` y `persistencia`, además de lo anterior (Skill 01).
- [ ] La simulación de 1000 semillas demuestra que **los 30 cartones ganan** al agotar el mazo.
- [ ] `npm run validar` sale con código 0.
- [ ] `domain/**` no importa React ni usa `window`, `document` ni `Math.random`. Búscalo: `grep -rnE "react|window|document|Math\.random" src/domain` debe devolver **vacío**.
- [ ] Los resultados de la simulación (primer ganador) están anotados en `docs/DECISIONES.md`.
- [ ] El hook `useBingoGame` existe pero **todavía no tiene interfaz**.

---

## Entrega al siguiente skill

Disponible para la interfaz: `useBingoGame()`, `CARTONES`, `EJERCICIOS_POR_ID`, `CASOS`, `aTokens/factorizacionATokens`, `clasificar`, `calcularPodio`, `verificarCarton`, `etiquetaCarton`, `VERSION_CARTONES`. Continúa con **`03-skill-interfaz-impresion-audio-cierre.md`**.
