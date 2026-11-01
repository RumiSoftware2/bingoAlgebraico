export function Boton({ variante = 'secundario', icono, grande = false, className = '', children, ...props }) {
  return <button className={'boton boton--' + variante + (grande ? ' boton--grande' : '') + ' ' + className} {...props}>
    {icono && <span className="boton__icono">{icono}</span>}{children}
  </button>
}
