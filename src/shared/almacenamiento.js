export function leer(clave) {
  try { return window.localStorage.getItem(clave) } catch { return null }
}

export function guardar(clave, texto) {
  try { window.localStorage.setItem(clave, texto) } catch { /* La partida sigue disponible en memoria. */ }
}

export function borrar(clave) {
  try { window.localStorage.removeItem(clave) } catch { /* El almacenamiento puede estar bloqueado. */ }
}
