import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { CARTONES, VERSION_CARTONES, construirIndice } from '../../domain/cards/index.js'
import { IDS_EJERCICIOS } from '../../domain/catalog/index.js'
import {
  crearMazo, estadoInicial, reductor, reproducir, nuevaSemilla,
  serializarPartida, restaurarPartida, CLAVE_PARTIDA,
} from '../../domain/engine/index.js'
import { REGLA_POR_DEFECTO } from '../../domain/rules/index.js'
import { leer, guardar, borrar } from '../../shared/almacenamiento.js'

const INDICE = construirIndice(CARTONES)
const TOTAL = IDS_EJERCICIOS.length
const CTX = { versionCartones: VERSION_CARTONES, totalMazo: TOTAL }

function cargarInicial() {
  const texto = leer(CLAVE_PARTIDA)
  const restaurado = texto ? restaurarPartida(texto, CTX) : null
  return restaurado ?? estadoInicial(nuevaSemilla())
}

export function useBingoGame(regla = REGLA_POR_DEFECTO) {
  const [estado, dispatch] = useReducer(reductor, undefined, cargarInicial)
  const mazo = useMemo(() => crearMazo(IDS_EJERCICIOS, estado.semilla), [estado.semilla])
  const resultado = useMemo(
    () => reproducir({ mazo, turno: estado.turno, cartones: CARTONES, indice: INDICE, regla }),
    [mazo, estado.turno, regla],
  )
  const hayGanadores = resultado.ganadores.length > 0
  const mazoAgotado = estado.turno >= mazo.length
  const bloqueada = mazoAgotado || (hayGanadores && !estado.continuar)
  const [celebracion, setCelebracion] = useState(null)
  const sortear = useCallback(() => {
    if (!bloqueada) {
      const siguiente = reproducir({ mazo, turno: estado.turno + 1, cartones: CARTONES, indice: INDICE, regla })
      setCelebracion(siguiente.ganadoresDelTurno.length
        ? { turno: estado.turno + 1, cartones: siguiente.ganadoresDelTurno.map((g) => g.cartonNumero) }
        : null)
    }
    dispatch({ tipo: 'SORTEAR', desdeTurno: estado.turno, maxTurno: mazo.length, bloqueada })
  }, [estado.turno, mazo, bloqueada, regla])
  const nuevaPartida = useCallback(() => {
    setCelebracion(null)
    dispatch({ tipo: 'NUEVA', semilla: nuevaSemilla() })
  }, [])
  const continuar = useCallback(() => dispatch({ tipo: 'CONTINUAR' }), [])

  useEffect(() => { guardar(CLAVE_PARTIDA, serializarPartida(estado, CTX)) }, [estado])

  return {
    estado, mazo, resultado,
    turno: estado.turno, total: TOTAL, pendientes: TOTAL - estado.turno,
    ejercicioActualId: resultado.ultimoId,
    hayGanadores, mazoAgotado, bloqueada,
    fase: estado.turno === 0 ? 'inicio' : bloqueada ? 'terminada' : 'en-curso',
    celebracion, cerrarCelebracion: () => setCelebracion(null),
    sortear, nuevaPartida, continuar,
    descartarGuardado: () => borrar(CLAVE_PARTIDA),
  }
}
