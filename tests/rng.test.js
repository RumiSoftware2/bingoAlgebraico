import test from 'node:test'
import assert from 'node:assert/strict'
import { barajar, crearRng } from '../src/domain/engine/rng.js'

test('rng repetible y Fisher–Yates conserva y no muta la entrada', () => {
  const secuencia = (semilla) => { const rng = crearRng(semilla); return Array.from({ length: 8 }, () => rng()) }
  const rng1 = crearRng(42), rng2 = crearRng(42), rng3 = crearRng(43)
  const valores1 = Array.from({ length: 8 }, () => rng1())
  const valores2 = Array.from({ length: 8 }, () => rng2())
  const valores3 = Array.from({ length: 8 }, () => rng3())
  assert.deepEqual(valores1, valores2)
  assert.notDeepEqual(valores1, valores3)
  assert.deepEqual(secuencia(42), valores1)
  assert.notDeepEqual(secuencia(43), valores1)

  const entrada = [1, 2, 3, 4, 5]
  const salida = barajar(entrada, crearRng(19))
  assert.deepEqual(entrada, [1, 2, 3, 4, 5])
  assert.deepEqual([...salida].sort(), entrada)
})
