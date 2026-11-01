import { createHash } from 'node:crypto'
import { writeFile } from 'node:fs/promises'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { dirname, resolve } from 'node:path'
import { EJERCICIOS, huellaCatalogo } from '../src/domain/catalog/index.js'
import { barajar, crearRng } from '../src/domain/engine/rng.js'
import { CUOTAS_CARTON, validarCartones } from '../src/domain/cards/validarCartones.js'

export const SEMILLA_CARTONES = 20260101
export const N_CARTONES = 30
export const N_CASILLAS = 25
export const MAX_SOLAPE = 17 // Percentil 95 sin restricción: 16; se fija un punto por encima.
export const MAX_INTENTOS_CARTON = 300
export const MAX_REINICIOS = 50

const porCaso = new Map(Object.keys(CUOTAS_CARTON).map((caso) => [caso, EJERCICIOS.filter((e) => e.caso === caso).map((e) => e.id)]))
const hash = (texto) => createHash('sha1').update(texto).digest('hex').slice(0, 8)

function menosUsados(ids, uso, rng) {
  return ids.map((id) => ({ id, puntaje: (uso.get(id) ?? 0) + rng() * 0.99 }))
    .sort((a, b) => a.puntaje - b.puntaje || a.id.localeCompare(b.id)).map((x) => x.id)
}

export function generar({ semilla = SEMILLA_CARTONES, maxSolape = MAX_SOLAPE } = {}) {
  for (let reinicio = 0; reinicio < MAX_REINICIOS; reinicio++) {
    const rng = crearRng((semilla + reinicio) >>> 0), uso = new Map(EJERCICIOS.map((e) => [e.id, 0])), cartones = []
    let reiniciar = false
    for (let numero = 1; numero <= N_CARTONES; numero++) {
      let aceptado = null
      for (let intento = 0; intento < MAX_INTENTOS_CARTON && !aceptado; intento++) {
        const elegidos = []
        for (const [caso, cuota] of Object.entries(CUOTAS_CARTON)) elegidos.push(...menosUsados(porCaso.get(caso), uso, rng).slice(0, cuota))
        const seleccion = new Set(elegidos)
        const restantes = EJERCICIOS.map((e) => e.id).filter((id) => !seleccion.has(id))
        elegidos.push(menosUsados(restantes, uso, rng)[0])
        if (elegidos.length !== N_CASILLAS || new Set(elegidos).size !== N_CASILLAS) continue
        const conjunto = [...elegidos].sort()
        if (cartones.some((previo) => previo.conjunto === conjunto.join('|'))) continue
        let solapeMax = 0
        for (const previo of cartones) {
          const set = new Set(previo.celdas)
          let solape = 0
          for (const id of conjunto) if (set.has(id)) solape++
          solapeMax = Math.max(solapeMax, solape)
        }
        if (solapeMax > maxSolape) continue
        aceptado = { numero, celdas: barajar(elegidos, rng), conjunto: conjunto.join('|') }
      }
      if (!aceptado) { reiniciar = true; break }
      delete aceptado.conjunto
      for (const id of aceptado.celdas) uso.set(id, uso.get(id) + 1)
      cartones.push(aceptado)
    }
    if (!reiniciar) {
      const apariciones = [...uso.values()]
      if (Math.min(...apariciones) >= 14 && Math.max(...apariciones) <= 17) return cartones
    }
  }
  throw new Error('No se pudo construir un conjunto válido de cartones; revise MAX_SOLAPE y los límites de intentos.')
}

export async function escribirCartones({ semilla = SEMILLA_CARTONES, maxSolape = MAX_SOLAPE, destino } = {}) {
  const cartones = generar({ semilla, maxSolape })
  const version = 'C-' + hash(JSON.stringify(cartones)), huella = huellaCatalogo()
  const validacion = validarCartones(cartones, EJERCICIOS, { maxSolape, huellaCatalogo: huella, version })
  if (!validacion.ok) throw new Error(validacion.errores.join('\n'))
  const cuerpo = [
    '// GENERADO por scripts/generarCartones.mjs — NO EDITAR A MANO. Regenerar implica REIMPRIMIR los cartones.',
    "export const VERSION_CARTONES = '" + version + "'",
    "export const HUELLA_CATALOGO_USADA = '" + huella + "'",
    'export const CARTONES = Object.freeze([',
    ...cartones.map((c) => '  Object.freeze({ numero: ' + c.numero + ', celdas: Object.freeze(' + JSON.stringify(c.celdas) + ') }),'),
    '])',
    '',
  ].join('\n')
  const archivo = destino ?? resolve(dirname(fileURLToPath(import.meta.url)), '../src/domain/cards/cartones.data.js')
  await writeFile(archivo, cuerpo, 'utf8')
  return { cartones, version, huella, metricas: validacion.metricas }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const resultado = await escribirCartones()
  console.log('Cartones generados:', resultado.version, '| catálogo:', resultado.huella)
  console.log('Solapes:', JSON.stringify(resultado.metricas.solape))
  console.log('Apariciones:', resultado.metricas.apariciones.minimo, 'a', resultado.metricas.apariciones.maximo)
}
