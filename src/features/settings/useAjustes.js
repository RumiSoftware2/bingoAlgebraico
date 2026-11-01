import { useCallback, useEffect, useState } from 'react'
import { leer, guardar } from '../../shared/almacenamiento.js'

export const CLAVE_AJUSTES = 'liga-algebra.ajustes.v1'
export const AJUSTES_INICIALES = Object.freeze({ animaciones: 'normal', volumen: 0.35, silenciado: false, efectos: true })

function restaurarAjustes() {
  try {
    const valor = JSON.parse(leer(CLAVE_AJUSTES) ?? 'null')
    if (!valor || typeof valor !== 'object') return { ...AJUSTES_INICIALES }
    return {
      animaciones: valor.animaciones === 'reducido' ? 'reducido' : 'normal',
      volumen: Number.isFinite(valor.volumen) ? Math.min(1, Math.max(0, valor.volumen)) : AJUSTES_INICIALES.volumen,
      silenciado: typeof valor.silenciado === 'boolean' ? valor.silenciado : false,
      efectos: typeof valor.efectos === 'boolean' ? valor.efectos : true,
    }
  } catch { return { ...AJUSTES_INICIALES } }
}

export function useAjustes() {
  const [ajustes, setEstado] = useState(restaurarAjustes)
  const actualizar = useCallback((cambios) => setEstado((actual) => ({ ...actual, ...cambios })), [])
  useEffect(() => {
    document.documentElement.dataset.motion = ajustes.animaciones
    guardar(CLAVE_AJUSTES, JSON.stringify(ajustes))
  }, [ajustes])
  return { ajustes, actualizar }
}
