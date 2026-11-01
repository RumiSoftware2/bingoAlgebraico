import test from 'node:test'
import assert from 'node:assert/strict'
import { CARTONES, HUELLA_CATALOGO_USADA, VERSION_CARTONES, validarCartones } from '../src/domain/cards/index.js'
import { EJERCICIOS } from '../src/domain/catalog/index.js'
import { generar } from '../scripts/generarCartones.mjs'

test('30 cartones estáticos válidos, balanceados y versionados', () => {
  const resultado = validarCartones(CARTONES, EJERCICIOS, { maxSolape: 17, huellaCatalogo: HUELLA_CATALOGO_USADA, version: VERSION_CARTONES })
  assert.equal(resultado.ok, true, resultado.errores.join('\n'))
  assert.equal(CARTONES.length, 30)
  assert.equal(resultado.metricas.apariciones.minimo, 15)
  assert.equal(resultado.metricas.apariciones.maximo, 16)
  assert.equal(resultado.metricas.solape.maximo, 17)
})

test('la generación es idempotente con la semilla fija', () => {
  assert.deepEqual(generar(), CARTONES)
  assert.deepEqual(generar(), CARTONES)
})

test('el validador detecta cartones incompletos, ids erróneos, duplicados y huella alterada', () => {
  const incompleto = CARTONES.map((c) => ({ ...c, celdas: [...c.celdas] }))
  incompleto[0].celdas.pop()
  assert.equal(validarCartones(incompleto).ok, false)

  const inexistente = CARTONES.map((c) => ({ ...c, celdas: [...c.celdas] }))
  inexistente[0].celdas[0] = 'ZZ-99'
  assert.equal(validarCartones(inexistente).ok, false)

  const repetido = CARTONES.map((c) => ({ ...c, celdas: [...c.celdas] }))
  repetido[0].celdas[0] = repetido[0].celdas[1]
  assert.equal(validarCartones(repetido).ok, false)

  const identicos = CARTONES.map((c) => ({ ...c, celdas: [...c.celdas] }))
  identicos[1].celdas = [...identicos[0].celdas]
  assert.equal(validarCartones(identicos).ok, false)

  assert.equal(validarCartones(CARTONES, EJERCICIOS, { huellaCatalogo: '00000000' }).ok, false)
  assert.equal(validarCartones(CARTONES, EJERCICIOS, { version: 'C-00000000' }).ok, false)
})
