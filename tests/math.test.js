import test from 'node:test'
import assert from 'node:assert/strict'
import { aTexto, factorizacionATexto } from '../src/domain/math/formato.js'
import { contenido, expandir, mcd, multiplicar, normalizar } from '../src/domain/math/polinomio.js'

test('operaciones de polinomios y normalización', () => {
  assert.deepEqual(multiplicar([2, 1], [3, 1]), [6, 5, 1])
  assert.deepEqual(normalizar([0, 0]), [0])
  assert.equal(mcd(12, 18), 6)
  assert.equal(contenido([6, 9]), 3)
  assert.deepEqual(expandir({ constante: 1, factores: [{ coef: [3, 1], exp: 2 }] }), [9, 6, 1])
})

test('formato visible de polinomios y factorizaciones', () => {
  assert.equal(aTexto([-9, 0, 1]), 'x² − 9')
  assert.equal(aTexto([0, -10, 5]), '5x² − 10x')
  assert.equal(aTexto([-1, 0, 16]), '16x² − 1')
  assert.equal(factorizacionATexto({ constante: 3, factores: [{ coef: [0, 1], exp: 1 }, { coef: [2, 1], exp: 1 }] }), '3x(x + 2)')
  assert.equal(factorizacionATexto({ constante: 1, factores: [{ coef: [3, 1], exp: 2 }] }), '(x + 3)²')
  assert.equal(factorizacionATexto({ constante: 1, factores: [{ coef: [3, 0, 1], exp: 1 }] }), '(x² + 3)')
  assert.equal(aTexto([-1, -1]), '−x − 1')
  assert.equal(factorizacionATexto({ constante: 1, factores: [{ coef: [-2, 1], exp: 3 }] }), '(x − 2)³')
})
