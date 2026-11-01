let ctx = null

function contexto() {
  try {
    if (typeof window === 'undefined') return null
    const AC = window.AudioContext || window.webkitAudioContext
    if (!AC) return null
    if (!ctx) ctx = new AC()
    if (ctx.state === 'suspended') void ctx.resume().catch(() => {})
    return ctx
  } catch { return null }
}

function nota(frecuencia, inicio, duracion, { tipo = 'sine', ganancia = 0.18, volumen = 1 } = {}) {
  try {
    const c = contexto()
    if (!c) return
    const osc = c.createOscillator()
    const g = c.createGain()
    osc.type = tipo
    osc.frequency.value = frecuencia
    const t0 = c.currentTime + inicio
    g.gain.setValueAtTime(0.0001, t0)
    g.gain.exponentialRampToValueAtTime(Math.max(0.0002, ganancia * volumen), t0 + 0.02)
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + duracion)
    osc.connect(g).connect(c.destination)
    osc.start(t0)
    osc.stop(t0 + duracion + 0.05)
  } catch { /* Un error de audio no debe interrumpir el juego. */ }
}

export const efectos = {
  sortear: (volumen = 1) => { nota(660, 0, 0.12, { tipo: 'triangle', volumen }); nota(880, 0.1, 0.16, { tipo: 'triangle', volumen }) },
  pitido: (volumen = 1) => nota(1200, 0, 0.35, { tipo: 'square', ganancia: 0.12, volumen }),
  victoria: (volumen = 1) => [523, 659, 784, 1047].forEach((f, i) => nota(f, i * 0.14, 0.3, { tipo: 'triangle', ganancia: 0.22, volumen })),
}
