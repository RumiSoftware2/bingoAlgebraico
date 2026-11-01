export function PanelAjustes({ ajustes, actualizar, audio }) {
  return <details className="panel-ajustes no-print">
    <summary>⚙ Ajustes de pantalla y sonido</summary>
    <div className="panel-ajustes__contenido">
      <label className="ajuste-fila">Animaciones
        <select value={ajustes.animaciones} onChange={(e) => actualizar({ animaciones: e.target.value })}>
          <option value="normal">Normales</option><option value="reducido">Reducidas</option>
        </select>
      </label>
      {audio && <section className="controles-audio" aria-label="Controles de sonido">
        {!audio.disponible ? <p role="status">{audio.error ? 'No se pudo cargar la música.' : 'Sin música instalada'}</p> : <>
          <button type="button" onClick={audio.alternar} aria-label={audio.sonando ? 'Pausar música' : 'Reproducir música'}>{audio.sonando ? '⏸ Pausar música' : '▶ Reproducir música'}</button>
          <label className="ajuste-fila">Volumen de música
            <input type="range" min="0" max="1" step="0.05" value={ajustes.volumen} onChange={(e) => actualizar({ volumen: Number(e.target.value) })} />
            <span>{Math.round(ajustes.volumen * 100)} %</span>
          </label>
          <button type="button" onClick={() => actualizar({ silenciado: !ajustes.silenciado })}>{ajustes.silenciado ? 'Quitar silencio' : 'Silenciar música'}</button>
        </>}
        <label className="ajuste-fila ajuste-fila--checks">
          <input type="checkbox" checked={ajustes.efectos} onChange={(e) => actualizar({ efectos: e.target.checked })} /> Efectos de sonido
        </label>
      </section>}
    </div>
  </details>
}
