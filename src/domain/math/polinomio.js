export const normalizar = (p) => {
  const q = [...p]
  while (q.length > 1 && q.at(-1) === 0) q.pop()
  return q.length ? q : [0]
}

export const grado = (p) => normalizar(p).length - 1

export const multiplicar = (a, b) => {
  const r = Array(a.length + b.length - 1).fill(0)
  a.forEach((x, i) => b.forEach((y, j) => { r[i + j] += x * y }))
  return normalizar(r)
}

export const potencia = (p, n) => {
  let r = [1]
  for (let i = 0; i < n; i++) r = multiplicar(r, p)
  return r
}

export const igual = (a, b) => {
  const x = normalizar(a), y = normalizar(b)
  return x.length === y.length && x.every((v, i) => v === y[i])
}

export const mcd = (a, b) => {
  a = Math.abs(a); b = Math.abs(b)
  while (b) [a, b] = [b, a % b]
  return a
}

export const contenido = (p) => normalizar(p).reduce((g, c) => mcd(g, c), 0)

export const expandir = ({ constante, factores }) => {
  let r = [constante]
  for (const { coef, exp } of factores) r = multiplicar(r, potencia(coef, exp))
  return normalizar(r)
}

export const claveDe = (p) => normalizar(p).join(',')
