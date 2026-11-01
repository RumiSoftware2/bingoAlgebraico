export function aTextoAccesible(tokens) {
  return tokens.map(({ t, v }) => {
    if (t === 'sup') return v === '2' ? ' al cuadrado' : v === '3' ? ' al cubo' : ' a la potencia ' + v
    if (t === 'op') return v === '−' ? ' menos ' : ' más '
    if (t === 'par') return v === '(' ? ' abre paréntesis ' : ' cierra paréntesis '
    return v
  }).join('').replace(/\s+/g, ' ').trim()
}
