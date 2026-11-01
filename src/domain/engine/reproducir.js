const contar = (marcas) => marcas.reduce((n, v) => n + (v ? 1 : 0), 0)

export function reproducir({ mazo, turno, cartones, indice, regla }) {
  const marcas = new Map(cartones.map((c) => [c.numero, Array(25).fill(false)]))
  const ganadores = [], yaGano = new Set()
  const turnos = Math.max(0, Math.min(turno, mazo.length))
  for (let t = 1; t <= turnos; t++) {
    const afectados = new Set()
    for (const { cartonNumero, celda } of indice.get(mazo[t - 1]) ?? []) {
      if (marcas.has(cartonNumero) && celda >= 0 && celda < 25) {
        marcas.get(cartonNumero)[celda] = true
        afectados.add(cartonNumero)
      }
    }
    for (const numero of [...afectados].sort((a, b) => a - b)) {
      if (!yaGano.has(numero) && regla.gana(marcas.get(numero))) {
        yaGano.add(numero)
        ganadores.push({ cartonNumero: numero, turno: t, casillas: contar(marcas.get(numero)) })
      }
    }
  }
  const progresos = new Map(cartones.map((c) => [c.numero, regla.progreso(marcas.get(c.numero))]))
  return {
    historial: mazo.slice(0, turnos),
    ultimoId: turnos > 0 ? mazo[turnos - 1] : null,
    marcas,
    progresos,
    ganadores,
    ganadoresDelTurno: ganadores.filter((g) => g.turno === turnos),
  }
}

export function clasificar(resultado, top = 5) {
  return [...resultado.progresos.entries()]
    .map(([cartonNumero, progreso]) => ({ cartonNumero, ...progreso }))
    .sort((a, b) => b.hechas - a.hechas || a.cartonNumero - b.cartonNumero)
    .slice(0, top)
}

export function calcularPodio(ganadores) {
  const porTurno = new Map()
  for (const ganador of ganadores) {
    if (!porTurno.has(ganador.turno)) porTurno.set(ganador.turno, [])
    porTurno.get(ganador.turno).push(ganador.cartonNumero)
  }
  return [...porTurno.entries()].sort((a, b) => a[0] - b[0])
    .map(([turno, cartones], i) => ({ puesto: i + 1, turno, cartones: cartones.sort((a, b) => a - b) }))
}

export function verificarCarton({ carton, marcas }) {
  const m = marcas.get(carton.numero)
  return carton.celdas.map((id, celda) => ({ celda, id, salio: Boolean(m?.[celda]) }))
}
