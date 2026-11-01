import { useState } from 'react'
import { EJERCICIOS_POR_ID } from '../../domain/catalog/index.js'
import { CASOS } from '../../domain/catalog/casos.js'
import { aTokens, factorizacionATokens } from '../../domain/math/index.js'
import { Boton, ChipCaso, ExpresionMatematica } from '../../ui-kit/index.js'
import { Tarjeta } from '../../ui-kit/Tarjeta.jsx'

export function Marcador({ ejercicioId, turno, total }) {
  const [mostrarRespuesta, setMostrarRespuesta] = useState(false)
  const ejercicio = ejercicioId ? EJERCICIOS_POR_ID.get(ejercicioId) : null
  if (!ejercicio) return <Tarjeta className="marcador marcador--vacio" color="sky">
    <p className="sobretitulo">Marcador central</p><h2>¡El partido está por comenzar!</h2>
    <p>Pulsa <strong>Sortear</strong> para revelar el primer polinomio.</p>
  </Tarjeta>
  return <Tarjeta className="marcador" color="sky" aria-label={'Marcador. Turno ' + turno + ' de ' + total}>
    <div className="marcador__cabecera"><span className="sobretitulo">POLINOMIO EN JUEGO</span><span className="marcador__ronda">Ronda {turno} / {total}</span></div>
    <div key={ejercicio.id} className="marcador__expresion">
      <ExpresionMatematica tokens={aTokens(ejercicio.polinomio)} tam="xl" />
    </div>
    <div className="marcador__respuesta">
      {!mostrarRespuesta ? <Boton variante="secundario" onClick={() => setMostrarRespuesta(true)}>Mostrar respuesta</Boton> : <>
        <ChipCaso caso={ejercicio.caso} nombre={CASOS[ejercicio.caso].nombre} icono={CASOS[ejercicio.caso].icono} />
        <div className="marcador__factorizacion"><span>Factorización</span><ExpresionMatematica tokens={factorizacionATokens(ejercicio.factorizacion)} tam="l" /></div>
        <p className="marcador__explicacion">{ejercicio.explicacion}</p>
        <Boton variante="secundario" onClick={() => setMostrarRespuesta(false)}>Ocultar respuesta</Boton>
      </>}
    </div>
  </Tarjeta>
}
