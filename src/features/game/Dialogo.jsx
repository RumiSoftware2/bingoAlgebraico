import { useEffect, useRef } from 'react'

export function Dialogo({ titulo, role = 'dialog', onClose, children, className = '' }) {
  const raiz = useRef(null)
  useEffect(() => {
    const anterior = document.activeElement
    raiz.current?.focus()
    const manejar = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); onClose?.(); return }
      if (e.key !== 'Tab' || !raiz.current) return
      const controles = [...raiz.current.querySelectorAll('button:not(:disabled), input:not(:disabled), select:not(:disabled), a[href], [tabindex="0"]')]
      if (!controles.length) { e.preventDefault(); raiz.current.focus(); return }
      const primero = controles[0], ultimo = controles.at(-1)
      if (e.shiftKey && document.activeElement === primero) { e.preventDefault(); ultimo.focus() }
      else if (!e.shiftKey && document.activeElement === ultimo) { e.preventDefault(); primero.focus() }
    }
    document.addEventListener('keydown', manejar)
    return () => { document.removeEventListener('keydown', manejar); anterior?.focus?.() }
  }, [onClose])
  return <div className="capa-dialogo" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose?.() }}>
    <section className={'dialogo ' + className} role={role} aria-modal="true" aria-labelledby="dialogo-titulo" tabIndex={-1} ref={raiz}>
      <h2 id="dialogo-titulo">{titulo}</h2>{children}
    </section>
  </div>
}
