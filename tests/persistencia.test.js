import test from 'node:test'
import assert from 'node:assert/strict'
import { CARTONES, VERSION_CARTONES, construirIndice } from '../src/domain/cards/index.js'
import { IDS_EJERCICIOS } from '../src/domain/catalog/index.js'
import { crearMazo, estadoInicial, restaurarPartida, serializarPartida, reproducir } from '../src/domain/engine/index.js'
import { cartonCompleto } from '../src/domain/rules/index.js'

const ctx = { versionCartones: VERSION_CARTONES, totalMazo: IDS_EJERCICIOS.length }

test('serializar y restaurar conserva el mínimo estado de partida', () => {
  const estado = { semilla: 123456, turno: 18, continuar: true }
  assert.deepEqual(restaurarPartida(serializarPartida(estado, ctx), ctx), estado)
  assert.deepEqual(estadoInicial(7), { semilla: 7, turno: 0, continuar: false })
})

test('restaurar rechaza entradas corruptas, incompatibles o fuera de rango sin lanzar', () => {
  const invalidos = ['', '{', 'null', undefined, null,
    JSON.stringify({ v: 2, versionCartones: VERSION_CARTONES, semilla: 2, turno: 1, continuar: false }),
    JSON.stringify({ v: 1, versionCartones: 'otra', semilla: 2, turno: 1, continuar: false }),
    JSON.stringify({ v: 1, versionCartones: VERSION_CARTONES, semilla: 2, turno: -1, continuar: false }),
    JSON.stringify({ v: 1, versionCartones: VERSION_CARTONES, semilla: 2, turno: 49, continuar: false }),
    JSON.stringify({ v: 1, versionCartones: VERSION_CARTONES, semilla: 1.5, turno: 1, continuar: false }),
    JSON.stringify({ v: 1, versionCartones: VERSION_CARTONES, semilla: 2, turno: 1, continuar: 0 })]
  for (const texto of invalidos) assert.doesNotThrow(() => assert.equal(restaurarPartida(texto, ctx), null))
})

test('un estado restaurado reproduce exactamente las mismas marcas y ganadores', () => {
  const estado = { semilla: 987, turno: 25, continuar: false }
  const restored = restaurarPartida(serializarPartida(estado, ctx), ctx)
  const indice = construirIndice(CARTONES)
  const a = reproducir({ mazo: crearMazo(IDS_EJERCICIOS, estado.semilla), turno: estado.turno, cartones: CARTONES, indice, regla: cartonCompleto })
  const b = reproducir({ mazo: crearMazo(IDS_EJERCICIOS, restored.semilla), turno: restored.turno, cartones: CARTONES, indice, regla: cartonCompleto })
  assert.deepEqual([...a.marcas], [...b.marcas])
  assert.deepEqual(a.ganadores, b.ganadores)
})
