import { CASOS, EJERCICIOS, validarCatalogo } from '../src/domain/catalog/index.js'
import { CARTONES, HUELLA_CATALOGO_USADA, VERSION_CARTONES, validarCartones } from '../src/domain/cards/index.js'

const catalogo = validarCatalogo(EJERCICIOS, CASOS)
const cartones = validarCartones(CARTONES, EJERCICIOS, {
  maxSolape: 17,
  huellaCatalogo: HUELLA_CATALOGO_USADA,
  version: VERSION_CARTONES,
})
console.log('Catálogo:', catalogo.ok ? 'OK' : catalogo.errores.join('\n'))
console.log('Cartones:', cartones.ok ? 'OK' : cartones.errores.join('\n'))
console.log('Métricas:', JSON.stringify(cartones.metricas))
if (!catalogo.ok || !cartones.ok) process.exitCode = 1
