import { useCallback, useEffect, useRef, useState } from 'react'

export function useAudio({ archivo, volumen, silenciado }) {
  const ref = useRef(null)
  const [sonando, setSonando] = useState(false)
  const [error, setError] = useState(false)

  const obtener = useCallback(() => {
    if (!archivo || typeof Audio === 'undefined') return null
    if (!ref.current) {
      const audio = new Audio(archivo)
      audio.loop = true
      audio.preload = 'auto'
      audio.addEventListener('error', () => { setError(true); setSonando(false) })
      ref.current = audio
    }
    return ref.current
  }, [archivo])

  useEffect(() => {
    const audio = ref.current
    if (!audio) return
    audio.volume = Math.min(1, Math.max(0, volumen))
    audio.muted = silenciado
  }, [volumen, silenciado])

  const reproducir = useCallback(async () => {
    const audio = obtener()
    if (!audio) return
    audio.volume = Math.min(1, Math.max(0, volumen))
    audio.muted = silenciado
    try { await audio.play(); setSonando(true); setError(false) } catch { setSonando(false) }
  }, [obtener, volumen, silenciado])

  const pausar = useCallback(() => { ref.current?.pause(); setSonando(false) }, [])
  const alternar = useCallback(() => (sonando ? pausar() : reproducir()), [sonando, pausar, reproducir])
  useEffect(() => () => { ref.current?.pause() }, [])

  return { sonando, error, disponible: Boolean(archivo) && !error, reproducir, pausar, alternar }
}
