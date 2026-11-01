# Informe de Fase 3 · Cartones

Fecha: 1 de noviembre de 2026

## Resultado

- Generados 30 cartones fijos, cada uno con 25 ids distintos y las cuotas de casos especificadas más una casilla de reparto.
- Semilla fija: `20260101`; límite calibrado `MAX_SOLAPE = 17`.
- Versión: `C-da4284d4`; huella del catálogo: `95e8af0d`.
- Todos los 48 ejercicios aparecen 15 o 16 veces.
- Entre los 435 pares de cartones: solape mínimo 2, promedio 12,621 y máximo 17. Histograma: 2:1, 3:1, 4:3, 5:3, 6:1, 7:3, 8:5, 9:9, 10:23, 11:53, 12:86, 13:98, 14:78, 15:42, 16:24, 17:5.
- Calibración: percentil 95 observado 16; el límite se fijó un punto por encima.

## Pruebas

- `npm run cartones`: genera el archivo y las métricas indicadas.
- Idempotencia: dos generaciones con la semilla fija coinciden con los datos estáticos. El SHA-256 del archivo antes y después de regenerar fue `B1C88212B85DF11DE37627FB42B240CED43719D79F3A6EC46CD8029B9D9649F4`.
- `npm test`: 8 pruebas aprobadas, 0 fallidas, incluyendo validador, casos negativos, RNG e idempotencia.
- `npm run lint`: correcto.
- `git diff --check`: sin errores de formato.

## Pendiente de revisión

El docente debe aprobar los 30 cartones y su versión antes de proceder con impresión. No se debe editar `src/domain/cards/cartones.data.js` a mano; cualquier regeneración requiere reimprimir los cartones.
