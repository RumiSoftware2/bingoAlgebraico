export const cartonCompleto = Object.freeze({
  id: 'carton-completo',
  nombre: 'Cartón completo',
  gana: (marcas) => marcas.length === 25 && marcas.every(Boolean),
  progreso: (marcas) => ({ hechas: marcas.filter(Boolean).length, total: 25 }),
})
