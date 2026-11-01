import { EJERCICIOS, VERSION_CATALOGO, hashSHA1, huellaCatalogo } from '../catalog/index.js'

export const CUOTAS_CARTON = Object.freeze({
  'factor-comun': 4,
  'diferencia-cuadrados': 4,
  'trinomio-cuadrado-perfecto': 4,
  'trinomio-x2-bx-c': 5,
  'trinomio-ax2-bx-c': 4,
  agrupacion: 3,
})

export function validarCartones(cartones, catalogo = EJERCICIOS, metadata = {}) {
  const errores = [], apariciones = new Map(), conjuntos = new Set(), disposiciones = new Set(), paresSolape = []
  const porId = new Map(catalogo.map((e) => [e.id, e]))
  if (!Array.isArray(cartones) || cartones.length !== 30) errores.push('Debe haber exactamente 30 cartones')
  const seenNumeros = new Set()
  for (const carton of cartones ?? []) {
    const n = carton?.numero
    if (!Number.isInteger(n) || n < 1 || n > 30 || seenNumeros.has(n)) errores.push('Número de cartón inválido o duplicado: ' + n)
    seenNumeros.add(n)
    const celdas = carton?.celdas
    if (!Array.isArray(celdas) || celdas.length !== 25) { errores.push('Cartón ' + n + ' debe tener exactamente 25 celdas'); continue }
    if (new Set(celdas).size !== 25) errores.push('Cartón ' + n + ' repite ids')
    for (const id of celdas) {
      if (!porId.has(id)) errores.push('Cartón ' + n + ' contiene id inexistente: ' + id)
      apariciones.set(id, (apariciones.get(id) ?? 0) + 1)
    }
    const conjunto = [...celdas].sort().join('|'), disposicion = celdas.join('|')
    if (conjuntos.has(conjunto)) errores.push('Cartón ' + n + ' repite un conjunto de ejercicios')
    if (disposiciones.has(disposicion)) errores.push('Cartón ' + n + ' repite una disposición')
    conjuntos.add(conjunto); disposiciones.add(disposicion)
    const cuotas = Object.fromEntries(Object.keys(CUOTAS_CARTON).map((caso) => [caso, 0]))
    for (const id of celdas) { const ej = porId.get(id); if (ej) cuotas[ej.caso] = (cuotas[ej.caso] ?? 0) + 1 }
    let sobrantes = 0
    for (const [caso, cantidad] of Object.entries(CUOTAS_CARTON)) {
      if (cuotas[caso] < cantidad || cuotas[caso] > cantidad + 1) errores.push('Cartón ' + n + ': cuota incorrecta de ' + caso + ' (' + cuotas[caso] + ', base ' + cantidad + ')')
      sobrantes += cuotas[caso] - cantidad
    }
    if (sobrantes !== 1) errores.push('Cartón ' + n + ': debe tener exactamente una casilla extra de reparto')
  }
  for (let i = 1; i <= 30; i++) if (!seenNumeros.has(i)) errores.push('Falta el cartón número ' + i)
  for (const ej of catalogo) {
    const cantidad = apariciones.get(ej.id) ?? 0
    if (cantidad === 0) errores.push('El ejercicio ' + ej.id + ' no aparece en ningún cartón')
    if (cantidad < 14 || cantidad > 17) errores.push('Apariciones fuera de [14,17] para ' + ej.id + ': ' + cantidad)
  }
  const minCasilla = Array(25).fill(Infinity), maxCasilla = Array(25).fill(-Infinity), sumaCasilla = Array(25).fill(0)
  for (let pos = 0; pos < 25; pos++) {
    const counts = new Map()
    for (const carton of cartones ?? []) { const id = carton?.celdas?.[pos]; if (id) counts.set(id, (counts.get(id) ?? 0) + 1) }
    const vals = [...counts.values()], total = vals.reduce((a, b) => a + b, 0)
    minCasilla[pos] = vals.length ? Math.min(...vals) : 0; maxCasilla[pos] = vals.length ? Math.max(...vals) : 0; sumaCasilla[pos] = total
  }
  for (let i = 0; i < (cartones?.length ?? 0); i++) for (let j = i + 1; j < cartones.length; j++) {
    const a = new Set(cartones[i].celdas), b = new Set(cartones[j].celdas)
    let solape = 0; for (const id of a) if (b.has(id)) solape++
    paresSolape.push(solape)
  }
  const minimo = paresSolape.length ? Math.min(...paresSolape) : 0
  const maximo = paresSolape.length ? Math.max(...paresSolape) : 0
  const promedio = paresSolape.length ? paresSolape.reduce((a, b) => a + b, 0) / paresSolape.length : 0
  if (metadata.maxSolape != null && maximo > metadata.maxSolape) errores.push('Solape máximo ' + maximo + ' excede MAX_SOLAPE=' + metadata.maxSolape)
  if (metadata.huellaCatalogo && metadata.huellaCatalogo !== huellaCatalogo()) errores.push('La huella del catálogo usado no coincide con el catálogo actual')
  if (metadata.version && metadata.version !== 'C-' + hashSHA1(JSON.stringify(cartones)).slice(0, 8)) errores.push('VERSION_CARTONES no coincide con el hash recalculado')
  return {
    ok: errores.length === 0, errores,
    metricas: {
      solape: { minimo, promedio: Number(promedio.toFixed(3)), maximo, histograma: paresSolape.reduce((h, n) => { h[n] = (h[n] ?? 0) + 1; return h }, {}) },
      apariciones: { minimo: Math.min(...[...apariciones.values()]), maximo: Math.max(...[...apariciones.values()]), porId: Object.fromEntries(apariciones) },
      casillas: { minimo: minCasilla, maximo: maxCasilla, totales: sumaCasilla },
      catalogo: VERSION_CATALOGO,
    },
  }
}
