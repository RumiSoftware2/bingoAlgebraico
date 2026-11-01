export const estadoInicial = (semilla) => ({ semilla, turno: 0, continuar: false })

export function reductor(estado, accion) {
  switch (accion.tipo) {
    case 'SORTEAR':
      if (accion.bloqueada || estado.turno !== accion.desdeTurno || estado.turno >= accion.maxTurno) return estado
      return { ...estado, turno: estado.turno + 1 }
    case 'NUEVA':
      return estadoInicial(accion.semilla)
    case 'CONTINUAR':
      return estado.continuar ? estado : { ...estado, continuar: true }
    case 'RESTAURAR':
      return accion.estado
    default:
      return estado
  }
}
