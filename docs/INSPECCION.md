# Inspección del proyecto

Fecha de actualización: 1 de noviembre de 2026

## Entorno y dependencias

- Aplicación cliente React 19.3.1 + JavaScript/JSX, empaquetada con Vite 8.3.5.
- Node requerido por Vite: `^20.19.0 || >=22.12.0`. Versión usada en la revisión: v24.13.0.
- Proyecto ESM. ESLint y `node:test` están configurados.
- Sin backend, cuentas, telemetría ni dependencias nuevas para estas fases. Las dependencias runtime son React y React DOM; no se añadió librería de audio ni de pruebas.
- El audio de música es un MP3 local licenciado; los efectos se sintetizan con Web Audio API.

## Estructura actual

- `src/domain/`: matemáticas, catálogo de 48 ejercicios, 30 cartones estáticos versionados, motor reproducible y reglas.
- `src/ui-kit/`: tokens y componentes visuales, expresiones accesibles e iconos SVG propios.
- `src/features/game/`: pantallas de inicio y juego, marcador, historial, posiciones, podio, verificación y hook de partida.
- `src/features/print/`: selector, vista de impresión y CSS carta en blanco y negro.
- `src/features/audio/`: reproductor local y efectos Web Audio sintetizados.
- `src/features/settings/`: ajustes de animación/audio en `liga-algebra.ajustes.v1`.
- `src/shared/almacenamiento.js`: acceso protegido a `localStorage`.
- `public/audio/`: pista y su registro de licencia.
- `scripts/`, `tests/` y `docs/`: generación/validación/contraste, pruebas nativas y documentación de fases/QA.

## Arquitectura y separación

- El dominio no importa React, `window` ni `document`, y no usa `Math.random`.
- `math → catalog → cards`; `engine` recibe el mazo, cartones e implementación de regla desde la feature de juego; `rules` es independiente. La UI se compone desde `App.jsx`; features usan `ui-kit`, módulos públicos del dominio y `shared` según corresponda.
- Persistencia de partida y ajustes se limita a dos claves locales con versión. No hay llamadas a un backend.
- La ruta de audio se deriva de `import.meta.env.BASE_URL` y apunta a `public/audio/`; enlaces de Internet solo se muestran como crédito/licencia y se abren bajo acción explícita.

## Scripts disponibles

- `npm run dev`: desarrollo con Vite.
- `npm test`: 22 pruebas con `node --test`.
- `npm run cartones`: genera cartones deterministas y reporta versión/métricas.
- `npm run validar`: valida catálogo y cartones.
- `npm run contraste`: verifica los umbrales WCAG documentados.
- `npm run lint`, `npm run build`, `npm run preview`.

## Estado técnico revisado

En la sesión del 1 de noviembre de 2026, `npm test`, `npm run validar`, `npm run contraste`, `npm run lint` y `npm run build` pasaron. La regeneración de cartones conservó `C-da4284d4` y no cambió `src/domain/cards/cartones.data.js`. Informe detallado, incluidos los controles manuales pendientes, en `docs/QA.md`.

No se inspeccionó la app renderizada en navegador en esta sesión. Por eso permanecen pendientes la revisión visual, impresión física, reproducción real del audio, interacción de controles y partidas piloto; ver `docs/FASE-6.md`, `docs/FASE-7.md` y `docs/QA.md`.
