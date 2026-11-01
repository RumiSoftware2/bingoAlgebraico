import { Balon } from './iconos/Balon.jsx'
import { Cronometro } from './iconos/Cronometro.jsx'
import { Ejes } from './iconos/Ejes.jsx'
import { Medalla } from './iconos/Medalla.jsx'
import { Silbato } from './iconos/Silbato.jsx'

const iconos = { factor: Ejes, cuadrados: Balon, cuadrado: Medalla, trinomio: Cronometro, agrupacion: Silbato }

export function ChipCaso({ caso, nombre, icono, compacto = false }) {
  if (!nombre) return null
  const Icono = iconos[icono] ?? Ejes
  return <span className={'chip-caso chip-caso--' + caso + (compacto ? ' chip-caso--compacto' : '')}>
    <Icono className="chip-caso__icono" /><span>{nombre}</span>
  </span>
}
