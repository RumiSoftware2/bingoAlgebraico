const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
const lineal = (c) => c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
const luminancia = (hex) => { const [r, g, b] = rgb(hex).map(lineal); return 0.2126 * r + 0.7152 * g + 0.0722 * b }
const razon = (a, b) => { const [x, y] = [luminancia(a), luminancia(b)].sort((p, q) => q - p); return (x + 0.05) / (y + 0.05) }
const pares = [
  ['ink sobre bg', '#1E2A4A', '#F6FAFF', 7],
  ['ink sobre sky', '#1E2A4A', '#CDE7FB', 7],
  ['ink sobre mint', '#1E2A4A', '#CFF1E4', 7],
  ['ink sobre lavender', '#1E2A4A', '#E0D7FA', 7],
  ['ink sobre peach', '#1E2A4A', '#FFE1CC', 7],
  ['ink sobre lemon', '#1E2A4A', '#FFF3B8', 7],
  ['ink sobre rose', '#1E2A4A', '#FFD3DC', 7],
  ['ink sobre accent', '#1E2A4A', '#8EC0F5', 4.5],
  ['ink-suave sobre bg', '#3B4A6B', '#F6FAFF', 4.5],
]
let fallo = false
for (const [nombre, texto, fondo, minimo] of pares) {
  const contraste = razon(texto, fondo), ok = contraste >= minimo
  if (!ok) fallo = true
  console.log((ok ? 'OK ' : 'FALLA ') + nombre + ': ' + contraste.toFixed(2) + ' (mín ' + minimo + ')')
}
if (fallo) process.exitCode = 1
