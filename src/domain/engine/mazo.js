import { barajar, crearRng } from './rng.js'

export function crearMazo(ids, semilla) {
  return barajar([...ids].sort(), crearRng(semilla))
}
