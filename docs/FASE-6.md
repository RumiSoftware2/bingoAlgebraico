# Informe de Fase 6 · Impresión

Fecha: 1 de noviembre de 2026

## Implementación

- Vista de impresión independiente de la partida, con selección de todos los cartones, uno o un rango del 1 al 30.
- Formato de 1 cartón por página o 2 por página; 2 por página queda seleccionado por defecto.
- Las hojas carta muestran cuadrículas de 5×5 en blanco y negro, con solo la factorización en cada casilla, el nombre del cartón y `VERSION_CARTONES`.
- El botón prepara el contenido según las opciones y llama a `window.print()`; la vista usa `@page` tamaño carta y márgenes de 10 mm.
- Al imprimir, la app presenta solo la vista y oculta sus controles. No hay casilla libre.

## Verificaciones técnicas

- `npm test`: 22 pruebas aprobadas, 0 fallidas. La nueva prueba recorre los 30 cartones y confirma 25 expresiones no vacías y únicas en cada uno.
- `npm run lint`: correcto.
- `npm run build`: correcto.
- Los datos conservan la versión `C-da4284d4`.

## Revisión manual pendiente

La vista previa del navegador y la impresión real no se verificaron. El control de origen del navegador rechazó el permiso para abrir `http://127.0.0.1:5173/`; no se intentó otra vía. Queda pendiente comprobar en el diálogo de impresión los formatos de 30 y 15 páginas, revisar un cartón individual y examinar al menos dos hojas impresas, incluyendo el ajuste de escala y los encabezados/pies del navegador.
