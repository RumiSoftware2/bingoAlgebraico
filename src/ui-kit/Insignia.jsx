export function Insignia({ icono, children, className = '' }) {
  return <span className={'insignia ' + className}>{icono}<span>{children}</span></span>
}
