import { useCallback, useEffect, useState } from 'react'
import { calcularPodio } from '../../domain/engine/index.js'
import { etiquetaCarton } from '../../domain/cards/index.js'
import { Trofeo } from '../../ui-kit/iconos/Trofeo.jsx'
import { Boton, Insignia } from '../../ui-kit/index.js'
import { Dialogo } from './Dialogo.jsx'
import { Historial } from './Historial.jsx'
import { Marcador } from './Marcador.jsx'
import { Podio } from './Podio.jsx'
import { Posiciones } from './Posiciones.jsx'
import { VerificarCarton } from './VerificarCarton.jsx'

function Ganadores({ ganadores }) {
  const puestos = calcularPodio(ganadores)
  return <section className="ganadores tarjeta" aria-labelledby="ganadores-titulo">
    <h2 id="ganadores-titulo"><Trofeo /> Ganadores</h2>
    {!puestos.length ? <p>Aún no hay cartones ganadores.</p> : <ol>
      {puestos.map(({ puesto, turno, cartones }) => <li key={turno}><strong>{puesto}.º puesto · ronda {turno}</strong><span>{cartones.map(etiquetaCarton).join(', ')}</span></li>)}
    </ol>}
  </section>
}

export function PantallaJuego({ juego, ajustes, actualizar, imprimir, volverInicio, PanelAjustes }) {
  const [confirmarNueva, setConfirmarNueva] = useState(false)
  const [verificar, setVerificar] = useState(false)
  const cerrarCelebracion = juego.cerrarCelebracion
  const iniciarPartidaNueva = juego.nuevaPartida
  const continuarPartida = juego.continuar
  const cerrarConfirmacion = useCallback(() => setConfirmarNueva(false), [])
  const aceptarNueva = useCallback(() => { cerrarConfirmacion(); iniciarPartidaNueva() }, [cerrarConfirmacion, iniciarPartidaNueva])
  const solicitarNuevaDesdePodio = useCallback(() => { cerrarCelebracion(); setConfirmarNueva(true) }, [cerrarCelebracion])
  const continuar = useCallback(() => { cerrarCelebracion(); continuarPartida() }, [cerrarCelebracion, continuarPartida])

  useEffect(() => {
    const manejar = (e) => {
      if (e.defaultPrevented || confirmarNueva || juego.celebracion) return
      if (e.code !== 'Space' && e.key !== 'Enter') return
      if (e.target.closest?.('input, textarea, select, button, a, [contenteditable="true"]')) return
      e.preventDefault()
      juego.sortear()
    }
    document.addEventListener('keydown', manejar)
    return () => document.removeEventListener('keydown', manejar)
  }, [juego, confirmarNueva])

  const ultimo = juego.resultado.ultimoId
  return <div className="juego">
    <h1 className="sr-only">Liga del Álgebra: partida en curso</h1>
    <header className="juego__encabezado">
      <button className="marca-liga" type="button" onClick={volverInicio} aria-label="Volver al inicio"><span className="marca-liga__balon">⚽</span><span><strong>LIGA DEL ÁLGEBRA</strong><small>Bingo de factorización</small></span></button>
      <Insignia icono={<span aria-hidden="true">◷</span>}>Ronda {juego.turno} de {juego.total}</Insignia>
      <PanelAjustes ajustes={ajustes} actualizar={actualizar} />
    </header>

    <main className="juego__principal">
      <Marcador key={ultimo ?? 'inicio'} ejercicioId={ultimo} turno={juego.turno} total={juego.total} />
      <section className="juego__acciones" aria-label="Controles de la partida">
        {juego.fase === 'terminada' && juego.mazoAgotado && !juego.hayGanadores && <p className="aviso-fin">No quedan más polinomios.</p>}
        <Boton variante="principal" grande disabled={juego.bloqueada} onClick={juego.sortear}>Sortear siguiente <span aria-hidden="true">→</span></Boton>
        {juego.hayGanadores && !juego.estado.continuar && <Boton variante="secundario" onClick={continuar}>Continuar para el 2.º puesto</Boton>}
        <Boton variante="secundario" onClick={() => setConfirmarNueva(true)}>Nueva partida</Boton>
        <Boton variante="secundario" onClick={() => setVerificar((v) => !v)}>{verificar ? 'Ocultar revisión' : 'Verificar cartón'}</Boton>
        <Boton variante="secundario" onClick={imprimir}>Imprimir cartones</Boton>
      </section>
      <footer className="juego__pie">
        <div className="progreso-global"><div className="progreso-global__texto"><strong>{juego.turno} sorteados</strong><span>{juego.pendientes} pendientes</span></div><progress value={juego.turno} max={juego.total} aria-label={juego.turno + ' polinomios sorteados de ' + juego.total} /></div>
        <p>Atajo: <kbd>Espacio</kbd> o <kbd>Enter</kbd> para sortear</p>
      </footer>
    </main>

    <aside className="juego__lateral" aria-label="Estado de la liga">
      <Posiciones resultado={juego.resultado} />
      <Historial historial={juego.resultado.historial} />
      <Ganadores ganadores={juego.resultado.ganadores} />
    </aside>
    {verificar && <section className="juego__verificacion"><VerificarCarton marcas={juego.resultado.marcas} /></section>}

    {juego.celebracion && <Podio celebracion={juego.celebracion} ganadores={juego.resultado.ganadores} onClose={juego.cerrarCelebracion} continuar={continuar} solicitarNueva={solicitarNuevaDesdePodio} />}
    {confirmarNueva && <Dialogo titulo="¿Empezar una nueva partida?" role="alertdialog" onClose={cerrarConfirmacion}>
      <p>Se borrará el avance guardado de esta partida. Los cartones impresos seguirán siendo los mismos.</p>
      <div className="dialogo__acciones"><Boton variante="secundario" onClick={cerrarConfirmacion}>Seguir jugando</Boton><Boton variante="peligro" onClick={aceptarNueva}>Sí, nueva partida</Boton></div>
    </Dialogo>}
  </div>
}
