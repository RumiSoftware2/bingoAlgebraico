import { useState } from 'react'
import { CARTONES, etiquetaCarton } from '../../domain/cards/index.js'
import { verificarCarton } from '../../domain/engine/index.js'
import { EJERCICIOS_POR_ID } from '../../domain/catalog/index.js'
import { factorizacionATexto } from '../../domain/math/index.js'
import { Tarjeta } from '../../ui-kit/index.js'

export function VerificarCarton({ marcas }) {
  const [numero, setNumero] = useState('01')
  const carton = CARTONES[Number(numero) - 1]
  const celdas = carton ? verificarCarton({ carton, marcas }) : []
  const marcadas = celdas.filter((celda) => celda.salio).length
  return <Tarjeta className="verificar" titulo="Revisión del árbitro" color="mint">
    <label className="verificar__selector">Número de cartón (1–30)
      <input type="number" min="1" max="30" step="1" value={numero} onChange={(e) => setNumero(e.target.value)} aria-label="Número del cartón que deseas revisar" />
    </label>
    {carton ? <>
      <h3>{etiquetaCarton(carton.numero)} · {marcadas} de 25 casillas</h3>
      <div className="verificar__rejilla" role="grid" aria-label={'Revisión de ' + etiquetaCarton(carton.numero)}>
        {celdas.map(({ celda, id, salio }) => <div key={celda} role="gridcell" className={'verificar__celda' + (salio ? ' verificar__celda--marcada' : '')} aria-label={factorizacionATexto(EJERCICIOS_POR_ID.get(id).factorizacion) + (salio ? ', salió' : ', pendiente')}>
          {salio && <span className="verificar__check" aria-hidden="true">✓</span>}
          <span>{factorizacionATexto(EJERCICIOS_POR_ID.get(id).factorizacion, { espaciado: 'compacto' })}</span>
        </div>)}
      </div>
    </> : <p className="mensaje-error">Ingresa un número de cartón entre 1 y 30.</p>}
  </Tarjeta>
}
