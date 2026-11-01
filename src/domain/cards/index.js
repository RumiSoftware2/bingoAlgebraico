import { CARTONES } from './cartones.data.js'
export { CARTONES, HUELLA_CATALOGO_USADA, VERSION_CARTONES } from './cartones.data.js'
export { validarCartones, CUOTAS_CARTON } from './validarCartones.js'

export function construirIndice(cartones = CARTONES) {
  const indice = new Map()
  for (const carton of cartones) carton.celdas.forEach((id, celda) => {
    if (!indice.has(id)) indice.set(id, [])
    indice.get(id).push({ cartonNumero: carton.numero, celda })
  })
  return indice
}

export function etiquetaCarton(numero) { return 'Cartón ' + String(numero).padStart(2, '0') }
