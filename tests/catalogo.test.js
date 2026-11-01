import test from 'node:test'
import assert from 'node:assert/strict'
import { CASOS, EJERCICIOS, EJERCICIOS_POR_ID, IDS_EJERCICIOS, huellaCatalogo, validarCatalogo } from '../src/domain/catalog/index.js'

test('catálogo completo, único y matemáticamente consistente', () => {
  const resultado = validarCatalogo(EJERCICIOS, CASOS)
  assert.deepEqual(resultado, { ok: true, errores: [] })
  assert.equal(EJERCICIOS.length, 48)
  assert.equal(IDS_EJERCICIOS.length, 48)
  assert.equal(EJERCICIOS_POR_ID.size, 48)
  assert.match(huellaCatalogo(), /^[a-f0-9]{8}$/)
})

test('el validador rechaza signo, clasificación, primitivo, ambigüedad e id inválidos', () => {
  const base = EJERCICIOS[0]
  const muta = (cambios) => ({ ...base, ...cambios })
  const casosInvalidos = [
    muta({ polinomio: [-6, 3] }),
    muta({ caso: 'diferencia-cuadrados' }),
    muta({ factorizacion: { constante: 1, factores: [{ coef: [4, 2], exp: 1 }] } }),
    { ...EJERCICIOS.find((e) => e.id === 'DC-01'), polinomio: [-36, 0, 4], factorizacion: { constante: 1, factores: [{ coef: [-6, 2], exp: 1 }, { coef: [6, 2], exp: 1 }] } },
    { ...EJERCICIOS.find((e) => e.id === 'TC-01'), caso: 'trinomio-x2-bx-c' },
    muta({ id: 'FC-02' }),
  ]
  for (const ejercicio of casosInvalidos) assert.equal(validarCatalogo([ejercicio], CASOS).ok, false)
})
