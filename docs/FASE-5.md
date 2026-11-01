# Informe de Fase 5 · Interfaz

Fecha: 1 de noviembre de 2026

## Implementación

- Sistema visual claro en pastel, con motivos de cancha, papel cuadriculado, matemáticas y deporte; componentes base, chips por caso e iconos SVG locales.
- Inicio con continuar/nueva partida, pantalla de juego adaptable, marcador de polinomio, respuesta del docente, historial, tabla de posiciones, ganadores, revisión de cartón, diálogo de reinicio y celebración accesible.
- Ajustes versionados de animaciones, volumen, silencio y efectos; preferencia de movimiento reducido respetada.
- Atajos de teclado, foco visible, anuncios de turnos para lector de pantalla y progreso acompañado de números y etiquetas.
- No se añadieron dependencias externas. El dominio visual no depende de servicios remotos.

## Verificaciones técnicas

- `npm test`: 21 pruebas aprobadas, 0 fallidas; simulación de 1000 partidas incluida.
- `npm run lint`: correcto.
- `npm run build`: correcto.
- `npm run contraste`: todos los pares cumplen; tinta sobre fondo 13,49:1, sobre pasteles 10,28–12,63:1, sobre acento 7,41:1 y texto suave sobre fondo 8,43:1.

## Revisión visual pendiente

La política de seguridad del navegador rechazó abrir `http://127.0.0.1:5173/` después de que el usuario declinara la solicitud de permiso de origen. No se intentó acceder por otra vía. Por eso no fue posible confirmar visualmente las vistas a 1920×1080, 1366×768 y 390×844 ni la interacción manual. El docente puede abrir la app con `npm run dev` y revisar el diseño antes de aprobar la Fase 5.
