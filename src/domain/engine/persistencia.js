export const CLAVE_PARTIDA = 'liga-algebra.partida.v1'

export function serializarPartida(estado, ctx) {
  return JSON.stringify({ v: 1, versionCartones: ctx.versionCartones, semilla: estado.semilla, turno: estado.turno, continuar: estado.continuar })
}

export function restaurarPartida(texto, ctx) {
  try {
    const d = JSON.parse(texto)
    const semillaOk = Number.isInteger(d?.semilla) && d.semilla >= 0 && d.semilla <= 4294967295
    const turnoOk = Number.isInteger(d?.turno) && d.turno >= 0 && d.turno <= ctx.totalMazo
    if (d?.v !== 1 || d.versionCartones !== ctx.versionCartones) return null
    if (!semillaOk || !turnoOk || typeof d.continuar !== 'boolean') return null
    return { semilla: d.semilla, turno: d.turno, continuar: d.continuar }
  } catch {
    return null
  }
}
