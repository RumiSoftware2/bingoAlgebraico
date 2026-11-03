import { useCallback, useState } from 'react'
import { useBingoGame } from './features/game/useBingoGame.js'
import { PantallaInicio } from './features/game/PantallaInicio.jsx'
import { PantallaJuego } from './features/game/PantallaJuego.jsx'
import { useAjustes } from './features/settings/useAjustes.js'
import { PanelAjustes } from './features/settings/PanelAjustes.jsx'
import { CARTONES, VERSION_CARTONES } from './domain/cards/index.js'
import { EJERCICIOS_POR_ID } from './domain/catalog/index.js'
import { PaginaImpresion } from './features/print/PaginaImpresion.jsx'
import { PaginaFichas } from './features/print/fichas/PaginaFichas.jsx'
import { useAudio } from './features/audio/useAudio.js'
import { efectos } from './features/audio/efectos.js'

const ARCHIVO_MUSICA = `${import.meta.env.BASE_URL}audio/happy-happy-game-show.mp3`

function App() {
  const juego = useBingoGame()
  const { ajustes, actualizar } = useAjustes()
  const audio = useAudio({ archivo: ARCHIVO_MUSICA, volumen: ajustes.volumen, silenciado: ajustes.silenciado })
  const [pantalla, setPantalla] = useState('inicio')
  const sonido = useCallback((tipo) => {
    if (!ajustes.efectos) return
    efectos[tipo]?.(ajustes.volumen)
  }, [ajustes.efectos, ajustes.volumen])
  const iniciarJuego = () => { void audio.reproducir(); sonido('pitido'); setPantalla('juego') }
  const continuarJuego = () => { void audio.reproducir(); setPantalla('juego') }
  const nuevaPartida = () => { void audio.reproducir(); juego.nuevaPartida(); sonido('pitido'); setPantalla('juego') }
  const sortear = () => { if (!juego.bloqueada) { sonido('sortear'); juego.sortear() } }
  const celebrar = useCallback(() => sonido('victoria'), [sonido])
  const imprimir = () => setPantalla('imprimir')
  const imprimirFichas = () => setPantalla('fichas')

  if (pantalla === 'inicio') return <PantallaInicio
    turno={juego.turno}
    continuar={continuarJuego}
    comenzar={iniciarJuego}
    nuevaPartida={nuevaPartida}
    imprimir={imprimir}
    imprimirFichas={imprimirFichas}
    ajustes={ajustes}
    actualizar={actualizar}
    PanelAjustes={PanelAjustes}
    audio={audio}
  />
  if (pantalla === 'imprimir') return <PaginaImpresion
    cartones={CARTONES}
    ejerciciosPorId={EJERCICIOS_POR_ID}
    versionCartones={VERSION_CARTONES}
    onVolver={() => setPantalla(juego.turno > 0 ? 'juego' : 'inicio')}
  />
  if (pantalla === 'fichas') return <PaginaFichas onVolver={() => setPantalla('inicio')} />
  return <PantallaJuego juego={juego} ajustes={ajustes} actualizar={actualizar} imprimir={imprimir} volverInicio={() => setPantalla('inicio')} PanelAjustes={PanelAjustes} audio={audio} onSortear={sortear} onVictoria={celebrar} onNuevaPartida={() => { juego.nuevaPartida(); sonido('pitido') }} />
}

export default App
