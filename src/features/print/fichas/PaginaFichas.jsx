import { Balon, Boton } from '../../../ui-kit/index.js'
import './fichas.css'

const VARIANTES = ['cielo', 'menta', 'lila', 'durazno', 'limon', 'rosa']

function FichaGenerica({ indice }) {
  return <div className={'ficha-cortable ficha-cortable--' + VARIANTES[indice % VARIANTES.length]} aria-label="Ficha genérica para cubrir una casilla">
    <span className="ficha-cortable__sello"><Balon /></span>
    <span className="ficha-cortable__texto"><strong>LIGA</strong><small>ÁLGEBRA</small></span>
    <span className="ficha-cortable__destello" aria-hidden="true">✦</span>
  </div>
}

function Plancha({ numero }) {
  return <section className="fichas-plancha" aria-label={'Plancha ' + numero + ' de fichas'}>
    <header className="fichas-plancha__cabecera">
      <h2><Balon /> Liga del Álgebra</h2>
      <span>Fichas genéricas · {numero}</span>
    </header>
    <div className="fichas-plancha__rejilla" role="grid" aria-label="25 fichas recortables">
      {Array.from({ length: 25 }, (_, indice) => <div role="gridcell" aria-label={'Ficha genérica ' + (indice + 1)} key={indice}><FichaGenerica indice={indice + Number(numero)} /></div>)}
    </div>
    <footer className="fichas-plancha__pie">Corta por las líneas punteadas · Tamaño compatible con las casillas</footer>
  </section>
}

export function PaginaFichas({ onVolver }) {
  return <main className="pagina-fichas">
    <section className="controles-fichas no-print">
      <p className="sobretitulo">Material de clase</p>
      <h1>Fichas genéricas</h1>
      <p>Dos planchas de 25 fichas, con el tamaño de las casillas de los cartones impresos con formato de 2 por página.</p>
      <p>En el diálogo de impresión usa papel Carta, escala 100 % y márgenes de 10 mm. Activa los gráficos de fondo para conservar los colores.</p>
      <div className="controles-fichas__acciones">
        <Boton variante="principal" grande onClick={() => window.print()}>Imprimir 50 fichas</Boton>
        <Boton variante="secundario" onClick={onVolver}>Volver al inicio</Boton>
      </div>
    </section>
    <section className="fichas-print-area" aria-label="Vista previa de fichas recortables">
      <div className="fichas-hoja">
        <Plancha numero="01" />
        <Plancha numero="02" />
      </div>
    </section>
  </main>
}
