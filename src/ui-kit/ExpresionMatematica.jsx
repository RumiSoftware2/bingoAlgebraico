import { aTextoAccesible } from './aTextoAccesible.js'

export function ExpresionMatematica({ tokens = [], tam = 'm', className = '' }) {
  return <span className={'expresion expresion--' + tam + ' ' + className} aria-label={aTextoAccesible(tokens)}>
    {tokens.map((token, i) => {
      if (token.t === 'sup') return <sup key={i}>{token.v}</sup>
      const espaciado = token.espacio ? ' expresion__operador--espaciado' : ''
      return <span key={i} className={'expresion__' + token.t + espaciado}>{token.v}</span>
    })}
  </span>
}
