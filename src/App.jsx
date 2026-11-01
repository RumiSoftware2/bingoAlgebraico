import { useState } from 'react'
import { useBingoGame } from './features/game/useBingoGame.js'
import { PantallaInicio } from './features/game/PantallaInicio.jsx'
import { PantallaJuego } from './features/game/PantallaJuego.jsx'
import { useAjustes } from './features/settings/useAjustes.js'
import { PanelAjustes } from './features/settings/PanelAjustes.jsx'
import { Boton } from './ui-kit/Boton.jsx'

function App() {
  const juego = useBingoGame()
  const { ajustes, actualizar } = useAjustes()
  const [pantalla, setPantalla] = useState('inicio')
  const irAJuego = () => setPantalla('juego')
  const imprimir = () => setPantalla('imprimir')

  if (pantalla === 'inicio') return <PantallaInicio
    turno={juego.turno}
    continuar={irAJuego}
    comenzar={irAJuego}
    nuevaPartida={() => { juego.nuevaPartida(); irAJuego() }}
    imprimir={imprimir}
    ajustes={ajustes}
    actualizar={actualizar}
    PanelAjustes={PanelAjustes}
  />
  if (pantalla === 'imprimir') return <main className="pantalla-pendiente">
    <span className="sobretitulo">Próxima etapa</span>
    <h1>Impresión de cartones</h1>
    <p>La vista de impresión se habilitará en la Fase 6.</p>
    <Boton variante="principal" onClick={() => setPantalla(juego.turno > 0 ? 'juego' : 'inicio')}>Volver</Boton>
  </main>
  return <PantallaJuego juego={juego} ajustes={ajustes} actualizar={actualizar} imprimir={imprimir} volverInicio={() => setPantalla('inicio')} PanelAjustes={PanelAjustes} />
}

export default App
