const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹', '-': '⁻' }
const exponenteTexto = (n) => String(n).split('').map((c) => SUP[c]).join('')

function tokensPolinomio(p, { espaciado = 'normal', dentroParentesis = false } = {}) {
  const compacto = espaciado === 'compacto'
  const salida = []
  let vistos = 0
  for (let i = p.length - 1; i >= 0; i--) {
    const c = p[i]
    if (c === 0) continue
    const negativo = c < 0, valor = Math.abs(c)
    if (vistos > 0) salida.push({ t: 'op', v: negativo ? '−' : '+', espacio: !compacto })
    else if (negativo && !dentroParentesis) salida.push({ t: 'op', v: '−' })
    if (i === 0) salida.push({ t: 'txt', v: String(valor) })
    else {
      if (valor !== 1) salida.push({ t: 'txt', v: String(valor) })
      salida.push({ t: 'txt', v: 'x' })
      if (i > 1) salida.push({ t: 'sup', v: String(i) })
    }
    vistos++
  }
  return salida
}

export function aTokens(p, opciones = {}) { return tokensPolinomio(p, opciones) }

export function aTexto(p, opciones = {}) {
  return aTokens(p, opciones).map(({ t, v, espacio }) => t === 'sup' ? exponenteTexto(v) : t === 'op' && espacio ? ` ${v} ` : v).join('')
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
  return factorizacionATokens(f, opciones).map(({ t, v, espacio }) => t === 'sup' ? exponenteTexto(v) : t === 'op' && espacio ? ` ${v} ` : v).join('')
}
