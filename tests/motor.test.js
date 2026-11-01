import test from 'node:test'
import assert from 'node:assert/strict'
import { IDS_EJERCICIOS } from '../src/domain/catalog/index.js'
import { CARTONES, construirIndice } from '../src/domain/cards/index.js'
import { crearMazo, crearRng, estadoInicial, reductor, reproducir } from '../src/domain/engine/index.js'
import { REGLA_POR_DEFECTO } from '../src/domain/rules/index.js'

test('el RNG es determinista y permanece en [0, 1)', () => {
  const secuencia = (semilla) => { const rng = crearRng(semilla); return Array.from({ length: 100 }, () => rng()) }
  assert.deepEqual(secuencia(123), secuencia(123))
  assert.notDeepEqual(secuencia(123), secuencia(124))
  assert.ok(secuencia(99).every((n) => n >= 0 && n < 1))
})

test('el mazo incluye los ids una vez y no depende del orden de entrada', () => {
  const mazo = crearMazo(IDS_EJERCICIOS, 324), invertido = crearMazo([...IDS_EJERCICIOS].reverse(), 324)
  assert.equal(mazo.length, 48)
  assert.equal(new Set(mazo).size, 48)
  assert.deepEqual([...mazo].sort(), [...IDS_EJERCICIOS].sort())
  assert.deepEqual(mazo, invertido)
})

test('el reductor es idempotente, bloquea y reinicia sin efectos laterales', () => {
  const s0 = estadoInicial(4)
  const s1 = reductor(s0, { tipo: 'SORTEAR', desdeTurno: 0, maxTurno: 48, bloqueada: false })
  const doble = reductor(s1, { tipo: 'SORTEAR', desdeTurno: 0, maxTurno: 48, bloqueada: false })
  assert.equal(s1.turno, 1)
  assert.equal(doble, s1)
  assert.equal(reductor(s0, { tipo: 'SORTEAR', desdeTurno: 0, maxTurno: 48, bloqueada: true }), s0)
  const final = { ...s0, turno: 48 }
  assert.equal(reductor(final, { tipo: 'SORTEAR', desdeTurno: 48, maxTurno: 48, bloqueada: false }), final)
  assert.deepEqual(reductor({ ...s1, continuar: true }, { tipo: 'CONTINUAR' }), { ...s1, continuar: true })
  assert.deepEqual(reductor(s1, { tipo: 'NUEVA', semilla: 8 }), estadoInicial(8))
})

test('historial y progreso se reproducen desde el prefijo de la partida', () => {
  const mazo = crearMazo(IDS_EJERCICIOS, 555), indice = construirIndice(CARTONES)
  const resultado = reproducir({ mazo, turno: 10, cartones: CARTONES, indice, regla: REGLA_POR_DEFECTO })
  assert.deepEqual(resultado.historial, mazo.slice(0, 10))
  assert.equal(resultado.ultimoId, mazo[9])
  assert.equal([...resultado.marcas.values()].reduce((n, m) => n + m.filter(Boolean).length, 0), [...resultado.historial].reduce((n, id) => n + indice.get(id).length, 0))
  assert.equal([...construirIndice(CARTONES).values()].reduce((n, celdas) => n + celdas.length, 0), 750)
})
