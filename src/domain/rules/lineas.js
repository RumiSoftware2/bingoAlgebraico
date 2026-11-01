const rango = (n) => Array.from({ length: n }, (_, i) => i)
export const FILAS = rango(5).map((f) => rango(5).map((c) => f * 5 + c))
export const COLUMNAS = rango(5).map((c) => rango(5).map((f) => f * 5 + c))
export const DIAGONALES = [[0, 6, 12, 18, 24], [4, 8, 12, 16, 20]]

export function crearReglaDeLineas(id, nombre, lineas) {
  return Object.freeze({
    id, nombre,
    gana: (marcas) => lineas.some((linea) => linea.every((i) => marcas[i])),
    progreso: (marcas) => ({ hechas: Math.max(...lineas.map((linea) => linea.filter((i) => marcas[i]).length)), total: 5 }),
  })
}

export const fila = crearReglaDeLineas('fila', 'Una fila', FILAS)
export const columna = crearReglaDeLineas('columna', 'Una columna', COLUMNAS)
export const diagonal = crearReglaDeLineas('diagonal', 'Una diagonal', DIAGONALES)
export const cualquierLinea = crearReglaDeLineas('cualquier-linea', 'Cualquier línea', [...FILAS, ...COLUMNAS, ...DIAGONALES])
