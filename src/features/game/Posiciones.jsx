import { clasificar } from '../../domain/engine/index.js'
import { etiquetaCarton } from '../../domain/cards/index.js'
import { Trofeo } from '../../ui-kit/iconos/Trofeo.jsx'
import { Tarjeta } from '../../ui-kit/Tarjeta.jsx'

export function Posiciones({ resultado }) {
  const top = clasificar(resultado, 5)
  const ganadores = new Set(resultado.ganadores.map((g) => g.cartonNumero))
  return <Tarjeta className="posiciones" titulo="Tabla de posiciones" color="lemon">
    <ol className="posiciones__lista">
      {top.map((fila) => <li className="posiciones__fila" key={fila.cartonNumero}>
        <div className="posiciones__identidad"><strong>{etiquetaCarton(fila.cartonNumero)}</strong>{ganadores.has(fila.cartonNumero) && <span className="posiciones__ganador"><Trofeo /> ¡Ganó!</span>}</div>
        <div className="posiciones__barra"><span style={{ width: (fila.hechas / fila.total * 100) + '%' }} /></div>
        <span className="posiciones__progreso">{fila.hechas}/{fila.total}</span>
      </li>)}
    </ol>
  </Tarjeta>
}
