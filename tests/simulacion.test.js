import test from 'node:test'
import assert from 'node:assert/strict'
import { CARTONES, construirIndice } from '../src/domain/cards/index.js'
import { IDS_EJERCICIOS } from '../src/domain/catalog/index.js'
import { crearMazo, reproducir } from '../src/domain/engine/index.js'
import { REGLAS } from '../src/domain/rules/index.js'

test('simulación de 1000 partidas: todos los cartones ganan al agotar el mazo', () => {
  const indice = construirIndice(CARTONES), primerGanador = []
  for (let semilla = 1; semilla <= 1000; semilla++) {
    const mazo = crearMazo(IDS_EJERCICIOS, semilla)
    const fin = reproducir({ mazo, turno: mazo.length, cartones: CARTONES, indice, regla: REGLAS.cartonCompleto })
    assert.equal(fin.ganadores.length, CARTONES.length, 'semilla ' + semilla)
    primerGanador.push(Math.min(...fin.ganadores.map((g) => g.turno)))
  }
  const promedio = primerGanador.reduce((a, b) => a + b, 0) / primerGanador.length
  console.log('Primer ganador: promedio turno ' + promedio.toFixed(1) + ', mín ' + Math.min(...primerGanador) + ', máx ' + Math.max(...primerGanador))
})

test('el resultado al turno t conserva como prefijo los ganadores previos', () => {
  const indice = construirIndice(CARTONES), mazo = crearMazo(IDS_EJERCICIOS, 12345)
  let previo = []
  for (let turno = 0; turno <= mazo.length; turno++) {
    const resultado = reproducir({ mazo, turno, cartones: CARTONES, indice, regla: REGLAS.cartonCompleto })
    assert.deepEqual(resultado.ganadores.slice(0, previo.length), previo, 'turno ' + turno)
    previo = resultado.ganadores
  }
})

test('misma semilla y turno producen el mismo resultado', () => {
  const indice = construirIndice(CARTONES), regla = REGLAS.cartonCompleto
  const a = reproducir({ mazo: crearMazo(IDS_EJERCICIOS, 777), turno: 45, cartones: CARTONES, indice, regla })
  const b = reproducir({ mazo: crearMazo(IDS_EJERCICIOS, 777), turno: 45, cartones: CARTONES, indice, regla })
  assert.deepEqual(a.ganadores, b.ganadores)
  assert.deepEqual([...a.progresos], [...b.progresos])
})
