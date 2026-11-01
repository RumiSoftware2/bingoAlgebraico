import { useMemo, useState } from 'react'
import { Boton } from '../../ui-kit/index.js'
import { CartonImpreso } from './CartonImpreso.jsx'
import './impresion.css'

function agrupar(lista, cantidad) {
  const grupos = []
  for (let i = 0; i < lista.length; i += cantidad) grupos.push(lista.slice(i, i + cantidad))
  return grupos
}

export function PaginaImpresion({ cartones, ejerciciosPorId, versionCartones, onVolver }) {
  const [seleccion, setSeleccion] = useState('todos')
  const [numero, setNumero] = useState('7')
  const [desde, setDesde] = useState('1')
  const [hasta, setHasta] = useState('30')
  const [formato, setFormato] = useState('2')

  const seleccionados = useMemo(() => {
    if (seleccion === 'uno') return cartones.filter((c) => c.numero === Number(numero))
    if (seleccion === 'rango') {
      const a = Number(desde), b = Number(hasta)
      if (!Number.isInteger(a) || !Number.isInteger(b) || a < 1 || b > 30 || a > b) return []
      return cartones.filter((c) => c.numero >= a && c.numero <= b)
    }
    return cartones
  }, [cartones, seleccion, numero, desde, hasta])
  const paginas = useMemo(() => agrupar(seleccionados, Number(formato)), [seleccionados, formato])

  return <main className="pagina-impresion">
    <section className="controles-impresion no-print" aria-label="Controles de impresión">
      <div className="impresion__titulo"><span className="sobretitulo">Material de clase</span><h1>Imprimir cartones</h1><p>Versión {versionCartones} · 30 cartones listos</p></div>
      <div className="impresion__controles">
        <label>Cartones
          <select value={seleccion} onChange={(e) => setSeleccion(e.target.value)}>
            <option value="todos">Todos (30)</option><option value="uno">Un cartón</option><option value="rango">Rango</option>
          </select>
        </label>
        {seleccion === 'uno' && <label>Número (1–30)
          <input type="number" min="1" max="30" step="1" value={numero} onChange={(e) => setNumero(e.target.value)} />
        </label>}
        {seleccion === 'rango' && <div className="impresion__rango">
          <label>Desde <input type="number" min="1" max="30" step="1" value={desde} onChange={(e) => setDesde(e.target.value)} /></label>
          <label>Hasta <input type="number" min="1" max="30" step="1" value={hasta} onChange={(e) => setHasta(e.target.value)} /></label>
        </div>}
        <label>Formato
          <select value={formato} onChange={(e) => setFormato(e.target.value)}>
            <option value="1">1 por página</option><option value="2">2 por página</option>
          </select>
        </label>
        <div className="impresion__botones"><Boton variante="principal" grande disabled={!seleccionados.length} onClick={() => window.print()}>Imprimir {seleccionados.length} cartones</Boton><Boton variante="secundario" onClick={onVolver}>Volver</Boton></div>
      </div>
      <p className="impresion__aviso">En el diálogo, desactiva <strong>Encabezados y pies de página</strong> y usa tamaño <strong>Carta</strong>, márgenes de 10 mm y escala del 100 %.</p>
      {!seleccionados.length && <p className="mensaje-error" role="alert">Selecciona un cartón válido del 1 al 30 o un rango ascendente dentro de ese intervalo.</p>}
      <p className="impresion__nota">Vista previa. Los cartones se imprimen en blanco y negro y cada hoja incluye la versión de sus datos.</p>
    </section>
    <section className={'print-area formato-' + formato} aria-label="Vista previa de cartones">
      {paginas.map((pagina, i) => <div className="hoja" key={pagina[0]?.numero ?? i}>
        {pagina.map((carton) => <CartonImpreso key={carton.numero} carton={carton} ejerciciosPorId={ejerciciosPorId} versionCartones={versionCartones} />)}
      </div>)}
    </section>
  </main>
}
