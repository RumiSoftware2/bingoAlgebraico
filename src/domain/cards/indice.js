export function construirIndice(cartones) {
  const indice = new Map()
  for (const carton of cartones) carton.celdas.forEach((id, celda) => {
    if (!indice.has(id)) indice.set(id, [])
    indice.get(id).push({ cartonNumero: carton.numero, celda })
  })
  return indice
}

export const etiquetaCarton = (numero) => 'Cartón ' + String(numero).padStart(2, '0')
