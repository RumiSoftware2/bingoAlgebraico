import { cartonCompleto } from './cartonCompleto.js'
import { fila, columna, diagonal, cualquierLinea } from './lineas.js'

export { cartonCompleto, fila, columna, diagonal, cualquierLinea }
export const REGLAS = Object.freeze({ cartonCompleto, fila, columna, diagonal, cualquierLinea })
export const REGLA_POR_DEFECTO = cartonCompleto
