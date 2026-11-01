# Decisiones del proyecto

Fecha de registro: 1 de noviembre de 2026. No hay respuestas previas del docente para estas decisiones; se aplican los valores por defecto indicados en la guía.

| ID | Decisión | Valor adoptado | Quién lo decidió |
|---|---|---|---|
| D1 | Casos incluidos | Los seis casos: factor común, diferencia de cuadrados, trinomio cuadrado perfecto, `x² + bx + c`, `ax² + bx + c` y agrupación | Por defecto |
| D2 | Tamaño del catálogo | 48 ejercicios: 8 + 8 + 8 + 10 + 8 + 6 | Por defecto |
| D3 | Fin de partida | Termina con el primer ganador; se ofrecerá continuar para segundo puesto | Por defecto |
| D4 | Impresión | 2 cartones por página por defecto; opción de 1 cartón por página | Por defecto |
| D5 | Efectos de sonido | Sonidos sintetizados con Web Audio API | Por defecto |
| D6 | Persistencia | Solo ajustes y `{semilla, turno, continuar}` de la partida, con versionado | Por defecto |
| D7 | Pruebas | `node --test`, sin Vitest | Por defecto |
| D8 | Extras | Verificar cartón y tabla de posiciones | Por defecto |
| D9 | Nombre visible | Liga del Álgebra; el nombre técnico `bingoalgebraico` se conserva | Por defecto |
| D10 | Estilos | CSS plano con variables y un archivo CSS por módulo/feature | Por defecto |
| D11 | Render matemático | Formateador propio con tokens y `<sup>`; KaTeX solo si fueran necesarias fracciones o raíces | Por defecto |

## Decisiones de arquitectura confirmadas en la inspección

- Se conserva el stack React + JavaScript + CSS y el entorno Vite existente.
- No se añaden dependencias para las fases previstas.
- Se sigue la separación de dominio, kit visual, features y almacenamiento compartido especificada en la guía.
- La inspección no encontró contradicciones con las reglas inviolables del proyecto.

## Calibraciones pendientes

`MAX_SOLAPE` quedó calibrado en 17 en la Fase 3. En la muestra sin restricción (435 pares), el solape mínimo fue 2, el promedio 12,621, el percentil 95 fue 16 y el máximo observado 17. La semilla fija es `20260101`. En la simulación de 1000 partidas de la Fase 4, el primer ganador apareció en promedio en el turno 43,4 (mínimo 37, máximo 46). El máximo de la muestra fue menor que los 48 sorteos posibles; todos los cartones ganaron al agotar el mazo, por lo que la detección y la cobertura completa se confirman.

La paleta de la Fase 5 cumple los objetivos del script de contraste: tinta sobre fondo 13,49:1; sobre pasteles 10,28–12,63:1; tinta sobre acento 7,41:1; texto suave sobre fondo 8,43:1.

## Decisiones complementarias de audio y QA

- Música seleccionada: “Happy Happy Game Show” de Kevin MacLeod, CC BY 4.0, por su descripción oficial bouncy/humorous, tempo animado y duración de 2:39. Se da atribución exacta visible en Créditos. El archivo oficial se recodificó a 128 kb/s para reducir su tamaño a 2.54 MB, sin recorte ni mezcla; la transformación se informa en los créditos y en `public/audio/LICENCIAS.md`.
- QA final: las verificaciones automatizadas pasan. Las pruebas de interfaz, navegador, proyector, audio real, impresión física y partidas piloto se mantienen como revisión humana pendiente y están desglosadas en `docs/QA.md`.
- Responsable de decisiones: se aplicaron los valores por defecto de la guía; no hay valores adicionales confirmados por el docente en la conversación.
