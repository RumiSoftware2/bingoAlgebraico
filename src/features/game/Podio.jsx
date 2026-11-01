import { useMemo } from 'react'
import { calcularPodio } from '../../domain/engine/index.js'
import { etiquetaCarton } from '../../domain/cards/index.js'
import { Boton, Trofeo } from '../../ui-kit/index.js'
import { Dialogo } from './Dialogo.jsx'

export function Podio({ celebracion, ganadores, continuar, onClose, solicitarNueva }) {
  const puestos = useMemo(() => calcularPodio(ganadores), [ganadores])
  const delTurno = celebracion?.cartones ?? []
  const turno = celebracion?.turno ?? 0
  const confeti = Array.from({ length: 36 }, (_, i) => <i key={i} style={{ '--i': i, left: ((i * 37 + 5) % 100) + '%' }} />)
  return <Dialogo titulo="¡BINGO!" role="alertdialog" className="podio" onClose={onClose}>
    <div className="podio__confeti" aria-hidden="true">{confeti}</div>
    <Trofeo className="podio__trofeo" />
    <p className="podio__turno">Victoria en la ronda {turno}</p>
    <ul className="podio__ganadores">
      {delTurno.map((n) => <li key={n}><strong>{etiquetaCarton(n)}</strong><span>25 de 25 casillas</span></li>)}
    </ul>
    {puestos.length > 1 && <p className="podio__otros">La tabla conserva los {puestos.length} puestos registrados hasta ahora.</p>}
    <div className="dialogo__acciones">
      <Boton variante="secundario" onClick={onClose}>Cerrar</Boton>
      <Boton variante="principal" onClick={continuar}>Continuar para el 2.º puesto</Boton>
      <Boton variante="peligro" onClick={solicitarNueva}>Nueva partida</Boton>
    </div>
    <span className="sr-only">Hay {delTurno.length} ganadores en esta ronda.</span>
  </Dialogo>
}
