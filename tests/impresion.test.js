import test from 'node:test'
import assert from 'node:assert/strict'
import { CARTONES } from '../src/domain/cards/index.js'
import { EJERCICIOS_POR_ID } from '../src/domain/catalog/index.js'
import { factorizacionATexto } from '../src/domain/math/index.js'

test('cada cartón tiene 25 factorizaciones impresas, completas y sin duplicados', () => {
  for (const carton of CARTONES) {
    const textos = carton.celdas.map((id) => factorizacionATexto(EJERCICIOS_POR_ID.get(id).factorizacion, { espaciado: 'compacto' }))
    assert.equal(textos.length, 25, 'cartón ' + carton.numero)
    assert.ok(textos.every((texto) => texto.trim().length > 0), 'texto vacío en cartón ' + carton.numero)
    assert.equal(new Set(textos).size, 25, 'factorización repetida en cartón ' + carton.numero)
  }
})
