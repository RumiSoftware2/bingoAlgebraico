import { aTexto, factorizacionATexto } from '../math/formato.js'
import { claveDe, contenido, expandir, igual } from '../math/polinomio.js'

const esperados = { 'factor-comun': 8, 'diferencia-cuadrados': 8, 'trinomio-cuadrado-perfecto': 8, 'trinomio-x2-bx-c': 10, 'trinomio-ax2-bx-c': 8, agrupacion: 6 }
const mismo = (a, b) => JSON.stringify(a) === JSON.stringify(b)
const raiz = Math.sqrt

function validarForma(e) {
  const p = e.polinomio, f = e.factorizacion, fs = f?.factores
  if (!Array.isArray(fs)) return 'no tiene arreglo de factores'
  const lineal = (x) => x?.coef?.length === 2 && x.coef.every(Number.isInteger) && Number.isInteger(x.exp) && x.exp >= 1
  if (e.caso !== 'agrupacion' && !fs.every(lineal)) return 'contiene factores lineales inválidos'
  if (e.caso === 'factor-comun') {
    const g = contenido(p), k = p.findIndex((c) => c !== 0), q = p.slice(k).map((c) => c / g)
    const esperado = (k > 0 ? [[0, 1, k]] : []).concat([[q[0], q[1], 1]])
    if (f.constante !== g || !mismo(fs.map((x) => [x.coef[0], x.coef[1], x.exp]), esperado)) return 'la forma u orden del factor común no coincide'
  }
  if (e.caso === 'diferencia-cuadrados') {
    const a = raiz(p[2]), b = raiz(-p[0])
    if (f.constante !== 1 || fs.length !== 2 || !mismo(fs.map((x) => x.coef), [[-b, a], [b, a]]) || fs.some((x) => x.exp !== 1)) return 'la forma de diferencia de cuadrados es incorrecta'
  }
  if (e.caso === 'trinomio-cuadrado-perfecto') {
    const a = raiz(p[2]), b = raiz(p[0]), signo = p[1] < 0 ? -1 : 1
    if (f.constante !== 1 || fs.length !== 1 || !mismo(fs[0]?.coef, [signo * b, a]) || fs[0]?.exp !== 2) return 'la forma del trinomio cuadrado perfecto es incorrecta'
  }
  if (e.caso === 'trinomio-x2-bx-c') {
    const d = raiz(p[1] ** 2 - 4 * p[0]), roots = [(-p[1] - d) / 2, (-p[1] + d) / 2]
    const constants = roots.map((r) => -r).sort((a, b) => Math.abs(a) - Math.abs(b) || Number(b < 0) - Number(a < 0))
    if (f.constante !== 1 || fs.length !== 2 || !mismo(fs.map((x) => x.coef), constants.map((c) => [c, 1])) || fs.some((x) => x.exp !== 1)) return 'los factores del trinomio x² + bx + c no respetan el orden canónico'
  }
  if (e.caso === 'trinomio-ax2-bx-c') {
    const sorted = [...fs].sort((a, b) => a.coef[1] - b.coef[1] || Math.abs(a.coef[0]) - Math.abs(b.coef[0]))
    if (f.constante !== 1 || fs.length !== 2 || !mismo(fs, sorted) || fs.some((x) => x.exp !== 1)) return 'los factores del trinomio ax² + bx + c no respetan el orden canónico'
  }
  if (e.caso === 'agrupacion' && (f.constante !== 1 || fs.length !== 2 || fs[0]?.coef?.length !== 2 || fs[0].exp !== 1 || fs[1]?.coef?.length !== 3 || fs[1].coef[1] !== 0 || fs[1].coef[0] <= 0 || fs[1].coef[2] <= 0 || fs[1].exp !== 1)) return 'la agrupación debe tener primero el factor lineal y luego cx² + d positivo'
  return null
}

export function validarCatalogo(ejercicios, casos) {
  const errores = [], ids = new Set(), claves = new Set(), textos = new Set(), formas = new Set()
  const conteo = Object.fromEntries(Object.keys(esperados).map((k) => [k, 0]))
  ejercicios.forEach((e, i) => {
    const id = e?.id ?? 'índice ' + i
    if (!e || typeof e !== 'object') { errores.push(id + ': ejercicio inválido'); return }
    if (!/^[A-Z]{2}-\d{2}$/.test(e.id)) errores.push(id + ': id inválido')
    if (ids.has(e.id)) errores.push(id + ': id duplicado')
    ids.add(e.id)
    if (!casos[e.caso]) errores.push(id + ': caso inexistente ' + e.caso)
    else conteo[e.caso] = (conteo[e.caso] ?? 0) + 1
    if (![1, 2].includes(e.nivel)) errores.push(id + ': nivel debe ser 1 o 2')
    const p = e.polinomio
    if (!Array.isArray(p) || !p.length || !p.every(Number.isInteger)) errores.push(id + ': polinomio debe contener enteros')
    else {
      if (p.at(-1) <= 0) errores.push(id + ': coeficiente principal debe ser positivo')
      if (p.some((c) => Math.abs(c) > 50)) errores.push(id + ': coeficiente supera 50')
      const key = claveDe(p), text = aTexto(p)
      if (claves.has(key)) errores.push(id + ': polinomio duplicado ' + key)
      if (textos.has(text)) errores.push(id + ': texto de polinomio duplicado ' + text)
      claves.add(key); textos.add(text)
    }
    const f = e.factorizacion
    if (!f || !Number.isInteger(f.constante) || f.constante < 1) errores.push(id + ': constante de factorización inválida')
    else if (f.constante !== 1 && e.caso !== 'factor-comun') errores.push(id + ': constante distinta de 1 solo se admite en factor común')
    if (Array.isArray(f?.factores)) {
      for (const factor of f.factores) {
        if (!factor?.coef?.length || !factor.coef.every(Number.isInteger) || !Number.isInteger(factor.exp) || factor.exp < 1) { errores.push(id + ': factor inválido'); continue }
        if (factor.coef.length === 2) {
          if (factor.coef[1] <= 0) errores.push(id + ': factor lineal con principal no positivo')
          if (contenido(factor.coef) !== 1) errores.push(id + ': factor lineal no primitivo')
        }
      }
      try { if (!igual(expandir(f), p)) errores.push(id + ': factorización no expande al polinomio') }
      catch { errores.push(id + ': factorización no expandible') }
      const text = factorizacionATexto(f), formError = validarForma(e)
      if (formas.has(text)) errores.push(id + ': factorización visible duplicada ' + text)
      formas.add(text)
      if (formError) errores.push(id + ': ' + formError)
    }
    const found = Object.entries(casos).filter(([, c]) => c.detectar(e)).map(([key]) => key)
    if (found.length !== 1 || found[0] !== e.caso) errores.push(id + ': clasificación no única; detectado ' + (found.join(', ') || 'ninguno'))
  })
  for (const [caso, cantidad] of Object.entries(esperados)) if ((conteo[caso] ?? 0) !== cantidad) errores.push(caso + ': se esperaban ' + cantidad + ' y hay ' + (conteo[caso] ?? 0))
  return { ok: errores.length === 0, errores }
}
