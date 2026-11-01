import { contenido, grado, mcd } from '../math/index.js'

const esCuadrado = (n) => Number.isInteger(n) && n >= 0 && Number.isInteger(Math.sqrt(n))
const raiz = (n) => Math.sqrt(n)
const polinomio = (e) => e?.polinomio ?? []
const factorComun = (e) => {
  const p = polinomio(e), g = contenido(p)
  const k = p.findIndex((c) => c !== 0)
  if (k < 0 || !(g > 1 || k > 0)) return false
  const q = p.slice(k).map((c) => c / g)
  return q.length === 2 && q[0] !== 0 && q[1] !== 0 && contenido(q) === 1
}
const diferenciaCuadrados = (e) => {
  const p = polinomio(e)
  return grado(p) === 2 && p[1] === 0 && p[0] < 0 && p[2] > 0 && esCuadrado(-p[0]) && esCuadrado(p[2]) && mcd(raiz(p[2]), raiz(-p[0])) === 1
}
const tcp = (e) => {
  const p = polinomio(e)
  if (grado(p) !== 2 || p[0] <= 0 || p[2] <= 0 || !esCuadrado(p[0]) || !esCuadrado(p[2])) return false
  const a = raiz(p[2]), b = raiz(p[0])
  return mcd(a, b) === 1 && Math.abs(p[1]) === 2 * a * b
}
const trinomioX2 = (e) => {
  const p = polinomio(e), disc = p[1] ** 2 - 4 * p[0]
  return grado(p) === 2 && p[2] === 1 && p[0] !== 0 && p[1] !== 0 && disc > 0 && esCuadrado(disc)
}
const trinomioAX2 = (e) => {
  const p = polinomio(e), disc = p[1] ** 2 - 4 * p[2] * p[0]
  return grado(p) === 2 && p[2] > 1 && contenido(p) === 1 && p[0] !== 0 && p[1] !== 0 && disc > 0 && esCuadrado(disc)
}
const agrupacion = (e) => {
  const p = polinomio(e)
  return grado(p) === 3 && p.every((c) => c !== 0) && p[3] > 0 && contenido(p) === 1 && p[3] * p[0] === p[2] * p[1]
}

export const CASOS = Object.freeze({
  'factor-comun': Object.freeze({ nombre: 'Factor común', color: 'caso-factor-comun', icono: 'factor', detectar: factorComun }),
  'diferencia-cuadrados': Object.freeze({ nombre: 'Diferencia de cuadrados', color: 'caso-diferencia-cuadrados', icono: 'cuadrados', detectar: diferenciaCuadrados }),
  'trinomio-cuadrado-perfecto': Object.freeze({ nombre: 'Trinomio cuadrado perfecto', color: 'caso-trinomio-cuadrado-perfecto', icono: 'cuadrado', detectar: tcp }),
  'trinomio-x2-bx-c': Object.freeze({ nombre: 'Trinomio x² + bx + c', color: 'caso-trinomio-x2-bx-c', icono: 'trinomio', detectar: trinomioX2 }),
  'trinomio-ax2-bx-c': Object.freeze({ nombre: 'Trinomio ax² + bx + c', color: 'caso-trinomio-ax2-bx-c', icono: 'trinomio', detectar: trinomioAX2 }),
  agrupacion: Object.freeze({ nombre: 'Agrupación', color: 'caso-agrupacion', icono: 'agrupacion', detectar: agrupacion }),
})

export const DETECTORES = Object.freeze({ factorComun, diferenciaCuadrados, tcp, trinomioX2, trinomioAX2, agrupacion })
