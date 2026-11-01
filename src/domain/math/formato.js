const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', '-': '⁻' }
const exponenteTexto = (n) => String(n).split('').map((c) => SUP[c]).join('')

function terminos(p, primeroSinSigno = false) {
  const out = []
  for (let i = p.length - 1; i >= 0; i--) {
    const c = p[i]
    if (c === 0) continue
    const negativo = c < 0
    const valor = Math.abs(c)
    const cuerpo = i === 0 ? String(valor) : `${valor === 1 ? '' : valor}x${i === 1 ? '' : exponenteTexto(i)}`
    out.push({ negativo: negativo && !(primeroSinSigno && out.length === 0), cuerpo })
  }
  return out
}

function tokensPolinomio(p, { espaciado = 'normal', dentroParentesis = false } = {}) {
  const compacto = espaciado === 'compacto'
  const ts = terminos(p, dentroParentesis)
  const salida = []
  ts.forEach(({ negativo, cuerpo }, i) => {
    if (i > 0) salida.push({ t: 'op', v: negativo ? '−' : '+', espacio: !compacto })
    else if (negativo) salida.push({ t: 'op', v: '−' })
    salida.push({ t: 'txt', v: cuerpo })
  })
  return salida
}

export function aTokens(p, opciones = {}) { return tokensPolinomio(p, opciones) }

export function aTexto(p, opciones = {}) {
  return aTokens(p, opciones).map(({ t, v, espacio }) => (t === 'op' && espacio ? ` ${v} ` : v)).join('')
}

export function factorizacionATokens(f, opciones = {}) {
  const tokens = []
  if (f.constante !== 1) tokens.push({ t: 'txt', v: String(f.constante) })
  for (const { coef, exp } of f.factores) {
    const monomio = coef.length === 2 && coef[0] === 0 && coef[1] === 1
    if (!monomio) tokens.push({ t: 'par', v: '(' })
    tokens.push(...tokensPolinomio(coef, { ...opciones, dentroParentesis: true }))
    if (!monomio) tokens.push({ t: 'par', v: ')' })
    if (exp > 1) tokens.push({ t: 'sup', v: String(exp) })
  }
  return tokens
}

export function factorizacionATexto(f, opciones = {}) {
  return factorizacionATokens(f, opciones).map(({ t, v, espacio }) => {
    if (t === 'sup') return exponenteTexto(v)
    if (t === 'op' && espacio) return ` ${v} `
    return v
  }).join('')
}
