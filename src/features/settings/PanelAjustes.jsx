export function PanelAjustes({ ajustes, actualizar }) {
  return <details className="panel-ajustes no-print">
    <summary>⚙ Ajustes de pantalla y sonido</summary>
    <div className="panel-ajustes__contenido">
      <label className="ajuste-fila">Animaciones
        <select value={ajustes.animaciones} onChange={(e) => actualizar({ animaciones: e.target.value })}>
          <option value="normal">Normales</option><option value="reducido">Reducidas</option>
        </select>
      </label>
      <label className="ajuste-fila">Volumen de música
        <input type="range" min="0" max="1" step="0.05" value={ajustes.volumen} onChange={(e) => actualizar({ volumen: Number(e.target.value) })} />
        <span>{Math.round(ajustes.volumen * 100)} %</span>
      </label>
      <label className="ajuste-fila ajuste-fila--checks">
        <input type="checkbox" checked={ajustes.silenciado} onChange={(e) => actualizar({ silenciado: e.target.checked })} /> Música silenciada
      </label>
      <label className="ajuste-fila ajuste-fila--checks">
        <input type="checkbox" checked={ajustes.efectos} onChange={(e) => actualizar({ efectos: e.target.checked })} /> Efectos de sonido activados
      </label>
      <p className="ayuda-ajustes">Los controles de reproducción de audio estarán disponibles en la fase de sonido.</p>
    </div>
  </details>
}
