# QA final · Liga del Álgebra

Fecha: 1 de noviembre de 2026

Node: v24.13.0
Navegadores probados en esta sesión: ninguno. La inspección visual del origen local no estuvo disponible; no se abrió otra superficie para evitar repetir el permiso de navegador que fue rechazado anteriormente.

## Comprobaciones automáticas

| Comando/comprobación | Resultado | Evidencia |
|---|---|---|
| `npm test` | OK: 22 pruebas, 0 fallos | Incluye matemáticas, catálogo, 30 cartones, impresión textual, motor, restauración, ganadores y simulación de 1000 partidas. Primer ganador: media 43.4, mínimo 37, máximo 46 turnos. |
| `npm run validar` | OK | Catálogo y cartones válidos. `MAX_SOLAPE` observado: 17; apariciones de cada ejercicio entre 15 y 16. |
| `npm run contraste` | OK | Todos los pares cumplen el umbral; mínimo de los pares auditados: 7.41:1 para tinta sobre acento. |
| `npm run build` | OK | Vite produjo bundle de producción y copió `dist/audio/happy-happy-game-show.mp3` (2,538,943 bytes). |
| `npm run lint` | OK | ESLint sin errores. |
| `npm run cartones` + `git diff --exit-code -- src/domain/cards/cartones.data.js` | OK | Regenera versión `C-da4284d4`; el archivo de cartones no cambia. |
| Higiene de `src/domain` | OK | Sin referencias a React, `window`, `document` ni `Math.random`. |
| URLs en el código fuente | OK con excepción prevista | Solo enlaces de créditos/licencia en la pantalla de créditos; la música se carga desde la ruta local `BASE_URL + audio/...`. |
| Uso de almacenamiento | OK | `localStorage` aparece únicamente detrás de `src/shared/almacenamiento.js`. |

## Pruebas manuales de interfaz

Estado de esta sesión: **pendientes de navegador**, no se marcan como realizadas a partir de las pruebas de dominio. No se anotaron fallos funcionales observados en navegador porque la app no se abrió.

| Área | Resultado |
|---|---|
| Sorteo desde la interfaz, 48 turnos y bloqueo al final | Pendiente |
| Historial y contador de progreso visibles | Pendiente |
| Podio y todos los ganadores de un turno | Cubierto por pruebas de dominio; presentación visual pendiente |
| Recarga con partida ganadora sin repetir celebración | Restauración de estado cubierta por pruebas; comportamiento visual pendiente |
| Reinicio desde los diálogos de inicio y juego | Pendiente |
| Persistencia/corrupción de almacenamiento desde el navegador | Restauración de motor probada; interacción del hook pendiente |
| Doble clic rápido en Sortear | Pendiente |
| Revisión visual del cartón | Lógica cubierta por pruebas; interfaz pendiente |
| Audio: gesto inicial, pausa, volumen, silencio y efectos | Código y archivo compilado comprobados; reproducción manual pendiente |
| Uso sin conexión y pestaña de red | El audio es local en el bundle; la inspección de red del navegador está pendiente |
| Lectura desde proyector a 1920×1080 | Pendiente |
| Ajuste a 1366×768, tableta y móvil | Pendiente |
| Impresión de todos, rango e individual; papel real | Textos comprobados en pruebas; vista previa y papel pendiente (ver también `docs/FASE-6.md`) |
| Animaciones reducidas y preferencia del sistema | Código de estilos presente; verificación visual pendiente |
| Recorrido de teclado completo | Pendiente |

## Partidas piloto

La simulación automática de 1000 partidas confirma que todos los cartones llegan a ganar al agotar el mazo. Las 2–3 partidas piloto en navegador y la comparación con cartones impresos no se realizaron en esta sesión; quedan pendientes junto con la revisión manual anterior.

## Trazabilidad de criterios de aceptación

| # | Criterio | Evidencia / estado |
|---:|---|---|
| 1 | Inicio local | `npm run dev` y `npm run build`; UI sin abrir en esta sesión. |
| 2 | Exactamente 30 cartones | `npm test`, `npm run validar`, versión `C-da4284d4`. |
| 3 | Se pueden imprimir los 30 | Generador/vista y prueba textual; impresión manual pendiente. |
| 4 | Cada cartón tiene 5×5 | `npm test`, 25 celdas por cartón. |
| 5 | Polinomios sin repetición por partida | RNG/mazo determinista y pruebas del motor. |
| 6 | Catálogo matemático verificado | `npm run validar`, pruebas matemáticas y catálogo. |
| 7 | Correspondencia de factorizaciones por id | Validadores de catálogo/cartones y pruebas de impresión. |
| 8 | Progreso de cartones por sorteo | Motor y reproducción del historial probados; UI manual pendiente. |
| 9 | Detección al completar 25 casillas | Pruebas de regla `cartonCompleto` y motor. |
| 10 | Todos los ganadores del mismo turno | Prueba de empates simultáneos; podio visual pendiente. |
| 11 | Reinicio conserva cartones | Prueba de reductor, idempotencia de generación y versión estable. |
| 12 | Música legal o Plan B | `public/audio/LICENCIAS.md`, atribución visible y pista local. |
| 13 | Control de música/volumen | Hook y ajustes implementados; interacción manual pendiente. |
| 14 | Legible mediante proyector | No evaluado visualmente; pendiente revisión humana. |
| 15 | Sin backend ni cuentas | Revisión del código: cliente local sin servicios ni endpoints. |
| 16 | Dominio probado independiente de UI | `npm test` con `node:test`; higiene confirma sin React/DOM en `src/domain`. |
| 17 | Identidad visual pastel, contraste y deporte/matemáticas | Código visual e iconos; `npm run contraste` pasa; vista manual pendiente. |
| 18 | Dominio independiente y probado | `npm test`; imports del dominio no alcanzan React ni DOM. |
| 19 | Versión de datos en cartón impreso | `VERSION_CARTONES` renderizada en `CartonImpreso`; textos cubiertos en pruebas. |

## Incidencias / siguiente revisión

- Pendiente de revisión humana en navegador: pantalla proyectable, juego de extremo a extremo, controles de sonido, recarga, impresión, responsive y teclado.
- No se puede declarar la fase 8 completamente cerrada hasta completar esa lista. Los resultados automáticos están en verde y no hay una incidencia de lógica detectada.
