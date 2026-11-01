import { CASOS, EJERCICIOS_POR_ID } from '../../domain/catalog/index.js'
import { aTexto } from '../../domain/math/index.js'
import { ChipCaso } from '../../ui-kit/index.js'
import { Tarjeta } from '../../ui-kit/Tarjeta.jsx'

export function Historial({ historial }) {
  const ids = [...historial].reverse()
  const ultimo = ids[0] ? EJERCICIOS_POR_ID.get(ids[0]) : null
  return <Tarjeta className="historial" titulo="Jugadas" color="blanca">
    <p className="sr-only" aria-live="polite" aria-atomic="true">
      {ultimo ? 'Turno ' + historial.length + ': ' + aTexto(ultimo.polinomio) : 'Aún no hay polinomios sorteados.'}
    </p>
    <ol className="historial__lista">
      {ids.map((id, i) => {
        const ejercicio = EJERCICIOS_POR_ID.get(id)
        const turno = historial.length - i
        return <li key={id} className={i === 0 ? 'historial__jugada historial__jugada--ultima' : 'historial__jugada'}>
          <span className="historial__turno">{String(turno).padStart(2, '0')}</span>
          <span className="historial__polinomio">{aTexto(ejercicio.polinomio, { espaciado: 'compacto' })}</span>
          <ChipCaso caso={ejercicio.caso} nombre={CASOS[ejercicio.caso].nombre} icono={CASOS[ejercicio.caso].icono} compacto />
        </li>
      })}
      {!ids.length && <li className="historial__vacio">Las jugadas aparecerán aquí.</li>}
    </ol>
  </Tarjeta>
}
