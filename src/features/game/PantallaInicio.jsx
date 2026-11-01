import { useState } from 'react'
import { Balon } from '../../ui-kit/iconos/Balon.jsx'
import { Silbato } from '../../ui-kit/iconos/Silbato.jsx'
import { Boton, Insignia } from '../../ui-kit/index.js'
import { Dialogo } from './Dialogo.jsx'

export function PantallaInicio({ turno, continuar, comenzar, nuevaPartida, imprimir, ajustes, actualizar, PanelAjustes, audio }) {
  const [confirmarNueva, setConfirmarNueva] = useState(false)
  const aceptarNueva = () => { setConfirmarNueva(false); nuevaPartida() }
  const guardada = turno > 0
  return <main className="inicio">
    <header className="inicio__encabezado">
      <Insignia icono={<Balon />}>BINGO DE FACTORIZACIÓN</Insignia>
      <PanelAjustes ajustes={ajustes} actualizar={actualizar} audio={audio} />
    </header>
    <section className="inicio__hero tarjeta tarjeta--sky">
      <div className="inicio__ilustracion" aria-hidden="true"><span>x²</span><Balon /><span>+</span><span>(a+b)</span></div>
      <p className="sobretitulo">Temporada de álgebra · Grado octavo</p>
      <h1>Liga del Álgebra</h1>
      <p className="inicio__subtitulo">El estadio donde cada factorización suma puntos.</p>
      <div className="inicio__acciones">
        {guardada ? <>
          <Boton variante="principal" grande icono={<Silbato />} onClick={continuar}>Continuar partida · ronda {turno}</Boton>
          <Boton variante="secundario" onClick={() => setConfirmarNueva(true)}>Nueva partida</Boton>
        </> : <Boton variante="principal" grande icono={<Silbato />} onClick={comenzar}>¡Comenzar!</Boton>}
      </div>
      <button className="enlace-boton" type="button" onClick={imprimir}>Imprimir cartones</button>
    </section>
    <footer className="inicio__pie"><span>Matemáticas en equipo, jugada a jugada.</span><button className="enlace-boton" type="button" onClick={() => document.getElementById('creditos-inicio')?.showModal()}>Créditos</button></footer>
    <dialog id="creditos-inicio" className="dialogo-creditos"><h2>Créditos</h2><p>Aplicación educativa Liga del Álgebra.</p><h3>Música</h3><p>“Happy Happy Game Show”, Kevin MacLeod (incompetech.com). <a href="https://incompetech.com/music/royalty-free/index.html?isrc=USUAN1600006" target="_blank" rel="noreferrer">Página oficial de la pista</a>.</p><p>Licensed under Creative Commons: By Attribution 4.0 License · <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer">CC BY 4.0</a>.</p><p>“Happy Happy Game Show” Kevin MacLeod (incompetech.com)<br />Licensed under Creative Commons: By Attribution 4.0 License<br />http://creativecommons.org/licenses/by/4.0/</p><p>Archivo recodificado a 128 kb/s; sin recorte ni mezcla.</p><button onClick={() => document.getElementById('creditos-inicio')?.close()}>Cerrar</button></dialog>
    {confirmarNueva && <Dialogo titulo="¿Empezar una nueva partida?" role="alertdialog" onClose={() => setConfirmarNueva(false)}>
      <p>Se reiniciará el avance guardado. Los cartones impresos no cambian.</p>
      <div className="dialogo__acciones"><Boton variante="secundario" onClick={() => setConfirmarNueva(false)}>Cancelar</Boton><Boton variante="peligro" onClick={aceptarNueva}>Sí, nueva partida</Boton></div>
    </Dialogo>}
  </main>
}
