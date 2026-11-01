# Inspección del proyecto

Fecha: 1 de noviembre de 2026

## Entorno real

- Aplicación cliente con React 19.3.1 y JavaScript/JSX.
- Vite 8.3.5 como servidor de desarrollo y empaquetador; configuración `vite.config.js` con el plugin oficial de React.
- Proyecto ESM (`"type": "module"`). ESLint está configurado en `eslint.config.js`.
- Scripts actuales: `npm run dev`, `npm run build`, `npm run lint` y `npm run preview`.
- Node: v24.13.0. `node --test` está disponible y `crypto.getRandomValues` es global en este entorno.
- No se encontraron dependencias de pruebas ni de interfaz adicionales. No instalar dependencias para este proyecto.

## Estructura actual

- Raíz: `package.json`, `package-lock.json`, `vite.config.js`, `eslint.config.js`, `index.html`, `README.md`, `public/`, `src/`.
- `src/`: `App.jsx`, `App.css`, `index.css`, `main.jsx`, `assets/` (hero, React y Vite).
- `public/`: sin archivos propios.
- No hay carpeta `tests/`, documentación `docs/` ni módulos de dominio/features todavía.
- Git está en la rama `main`, siguiendo `origin/main`; el árbol de trabajo estaba limpio al iniciar la inspección.

## Estilos y punto de partida

Los estilos son CSS global plano, importado desde `main.jsx`/`App.jsx`, con variables en `index.css`. El contenido es la pantalla de bienvenida predeterminada de Vite y React (contador y enlaces de documentación); aún no hay funcionalidad de Bingo Algebraico. La página HTML conserva idioma inglés, título de plantilla e icono `/favicon.svg`, que no existe en `public/`.

## Diferencias frente a la estructura objetivo

La estructura de `src/` está por crear: `domain/{math,catalog,cards,engine,rules}`, `ui-kit`, `features/{game,print,audio,settings}` y `shared`. También se crearán `scripts/`, `tests/`, `docs/` y `public/audio/` conforme avancen las fases. Se conservarán React, Vite, scripts y configuración existentes, extendiéndolos solo cuando corresponda; no se moverán archivos existentes sin necesidad.

## Verificación del servidor

`npm run dev -- --host 127.0.0.1` inició correctamente con Vite y anunció `http://127.0.0.1:5173/`. Se detuvo el proceso tras verificar el arranque. No se cambió la configuración.

## Riesgos y notas

- El proyecto está en blanco funcionalmente; no existe lógica previa que integrar.
- `index.html` y el contenido de plantilla están en inglés y deberán adaptarse al español al llegar a la fase de interfaz.
- Vite puede servir el SVG de favicon predeterminado aunque el archivo no exista; se reemplazará o corregirá durante la implementación de interfaz.
- Node cumple ampliamente el requisito mínimo de Node 18 y admite pruebas nativas con `node --test`.
- No se validaron todavía matemáticas, interfaz, impresión ni audio: corresponden a fases posteriores.

## Scripts que se añadirán

- `npm test`: ejecutar la suite integrada con `node --test`.
- `npm run cartones`: generar los 30 cartones reproducibles a partir de semilla fija.
- `npm run validar`: validar catálogo y cartones.
- `npm run contraste`: verificar el contraste de la paleta.

Los scripts se incorporarán en las fases correspondientes, sin sustituir los scripts existentes.
