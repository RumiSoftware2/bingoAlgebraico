import test from 'node:test'
import assert from 'node:assert/strict'
import { clasificar, calcularPodio, reproducir, verificarCarton } from '../src/domain/engine/reproducir.js'
import { cartonCompleto, fila, columna, diagonal, cualquierLinea } from '../src/domain/rules/index.js'

const ids = Array.from({ length: 30 }, (_, i) => 'E' + String(i + 1).padStart(2, '0'))
const cartones = [
  { numero: 1, celdas: [...ids.slice(0, 24), ids[29]] },
  { numero: 2, celdas: [...ids.slice(5, 29), ids[29]] },
]
const mazo = [...ids.slice(0, 29), ids[29]]
const indice = new Map()
for (const carton of cartones) carton.celdas.forEach((id, celda) => {
  if (!indice.has(id)) indice.set(id, [])
  indice.get(id).push({ cartonNumero: carton.numero, celda })
})

test('cartón completo solo gana con sus 25 ejercicios y reporta todos los empatados', () => {
  const antes = reproducir({ mazo, turno: 29, cartones, indice, regla: cartonCompleto })
  assert.equal(antes.ganadores.length, 0)
  assert.equal(antes.progresos.get(1).hechas, 24)
  const fin = reproducir({ mazo, turno: 30, cartones, indice, regla: cartonCompleto })
  assert.deepEqual(fin.ganadoresDelTurno, [{ cartonNumero: 1, turno: 30, casillas: 25 }, { cartonNumero: 2, turno: 30, casillas: 25 }])
  assert.deepEqual(reproducir({ mazo: [...mazo, ids[29]], turno: 31, cartones, indice, regla: cartonCompleto }).ganadores.map((g) => g.cartonNumero), [1, 2])
  assert.equal(verificarCarton({ carton: cartones[0], marcas: antes.marcas }).filter((x) => x.salio).length, 24)
})

test('reglas de fila, columna, diagonal y cualquier línea calculan avance', () => {
  const marks = Array(25).fill(false)
  for (const i of [0, 1, 2, 3, 4]) marks[i] = true
  assert.equal(fila.gana(marks), true)
  assert.equal(columna.gana(marks), false)
  assert.equal(diagonal.gana(marks), false)
  assert.equal(cualquierLinea.gana(marks), true)
  assert.deepEqual(fila.progreso(marks), { hechas: 5, total: 5 })
  marks.fill(false)
  for (const i of [0, 6, 12, 18, 24]) marks[i] = true
  assert.equal(diagonal.gana(marks), true)
})

test('clasificación ordena avance y número; el podio agrupa empates por turno', () => {
  const resultado = reproducir({ mazo, turno: 12, cartones, indice, regla: cartonCompleto })
  assert.deepEqual(clasificar(resultado, 1).map((x) => x.cartonNumero), [1])
  assert.deepEqual(calcularPodio([{ cartonNumero: 8, turno: 20 }, { cartonNumero: 2, turno: 20 }, { cartonNumero: 3, turno: 22 }]), [
    { puesto: 1, turno: 20, cartones: [2, 8] }, { puesto: 2, turno: 22, cartones: [3] },
  ])
})
