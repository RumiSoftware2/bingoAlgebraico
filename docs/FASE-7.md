# Fase 7 · Música y efectos

## Implementado

- Música local en `public/audio/happy-happy-game-show.mp3`, bajo CC BY 4.0, con crédito completo visible en el diálogo Créditos y detalle de la recodificación en `public/audio/LICENCIAS.md`.
- Reproductor HTML de creación perezosa, en bucle, sin autoplay. Se inicia con una acción del usuario, captura errores de reproducción/carga y permite reproducir, pausar, volumen y silencio.
- Ajustes de audio reutilizan `liga-algebra.ajustes.v1`, incluyendo volumen, silencio y efectos.
- Efectos sintetizados con Web Audio API para inicio, sorteo y victoria. Respetan interruptor y volumen; los errores de audio no interrumpen la partida.
- No se cargan recursos de audio remotos en tiempo de ejecución.

## Verificación técnica

- Fuente y términos verificados en el sitio oficial de Incompetech y Creative Commons el 2026-11-01.
- MP3 local: 2,538,943 bytes; 158.61 s; 128 kb/s; pico medido 0.0 dBFS.
- Pruebas manuales de interacción y modo sin conexión quedan pendientes de ejecutar en navegador. El entorno restringió la inspección de la aplicación local en fases anteriores.
