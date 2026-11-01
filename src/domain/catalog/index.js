import { EJERCICIOS } from './ejercicios.data.js'
export { CASOS } from './casos.js'
export { EJERCICIOS } from './ejercicios.data.js'
export { validarCatalogo } from './validarCatalogo.js'

export const EJERCICIOS_POR_ID = new Map(EJERCICIOS.map((e) => [e.id, e]))
export const IDS_EJERCICIOS = Object.freeze(EJERCICIOS.map((e) => e.id))
export const VERSION_CATALOGO = 'cat-1'

// SHA-1 pequeño y autocontenido para que el catálogo siga siendo compatible con Node y navegador.
function sha1(texto) {
  const data = Array.from(new TextEncoder().encode(texto)), bytes = data.length
  data.push(128)
  while (data.length % 64 !== 56) data.push(0)
  const bits = bytes * 8
  for (let i = 7; i >= 0; i--) data.push(i >= 4 ? 0 : (bits >>> (i * 8)) & 255)
  let h = [0x67452301, 0xefcdab89, 0x98badcfe, 0x10325476, 0xc3d2e1f0]
  for (let off = 0; off < data.length; off += 64) {
    const w = new Array(80)
    for (let i = 0; i < 16; i++) w[i] = ((data[off+i*4] << 24) | (data[off+i*4+1] << 16) | (data[off+i*4+2] << 8) | data[off+i*4+3]) >>> 0
    for (let i = 16; i < 80; i++) { const x = w[i-3] ^ w[i-8] ^ w[i-14] ^ w[i-16]; w[i] = ((x << 1) | (x >>> 31)) >>> 0 }
    let [a,b,c,d,e] = h
    for (let i = 0; i < 80; i++) {
      const f = i < 20 ? (b & c) | (~b & d) : i < 40 ? b ^ c ^ d : i < 60 ? (b & c) | (b & d) | (c & d) : b ^ c ^ d
      const k = i < 20 ? 0x5a827999 : i < 40 ? 0x6ed9eba1 : i < 60 ? 0x8f1bbcdc : 0xca62c1d6
      const t = (((a << 5) | (a >>> 27)) + f + e + k + w[i]) >>> 0
      e = d; d = c; c = ((b << 30) | (b >>> 2)) >>> 0; b = a; a = t
    }
    h = h.map((n, i) => (n + [a,b,c,d,e][i]) >>> 0)
  }
  return h.map((n) => n.toString(16).padStart(8, '0')).join('').slice(0, 10)
}

export function huellaCatalogo() {
  return sha1(EJERCICIOS.map(({ id, caso }) => id + ':' + caso).join('|'))
}
