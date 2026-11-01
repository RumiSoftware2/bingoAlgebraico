export function Tarjeta({ color = 'blanca', titulo, className = '', children, ...props }) {
  return <section className={'tarjeta tarjeta--' + color + ' ' + className} {...props}>
    {titulo && <h2 className="tarjeta__titulo">{titulo}</h2>}{children}
  </section>
}
