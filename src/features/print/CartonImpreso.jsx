import { etiquetaCarton } from '../../domain/cards/index.js'
import { factorizacionATokens } from '../../domain/math/index.js'
import { ExpresionMatematica } from '../../ui-kit/index.js'

export function CartonImpreso({ carton, ejerciciosPorId, versionCartones }) {
  return <section className="carton" aria-label={etiquetaCarton(carton.numero)}>
    <header className="carton__cab">
      <h2>{etiquetaCarton(carton.numero)}</h2>
      <span>Liga del Álgebra · Factorización</span>
    </header>
    <div className="carton__rejilla" role="grid" aria-label="Cuadrícula de 5 por 5">
      {carton.celdas.map((id, celda) => <div className="carton__celda" role="gridcell" key={celda}>
        <ExpresionMatematica tokens={factorizacionATokens(ejerciciosPorId.get(id).factorizacion, { espaciado: 'compacto' })} tam="s" />
      </div>)}
    </div>
    <footer className="carton__pie">Versión de cartones: {versionCartones}</footer>
  </section>
}
