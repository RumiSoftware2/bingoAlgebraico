# Catálogo matemático para revisión

Versión: `cat-1` · 48 ejercicios. Las expresiones de esta tabla se generan desde el catálogo estructurado; no se usan como datos del juego.

| ID | Polinomio | Factorización | Caso |
|---|---|---|---|
| FC-01 | 3x + 6 | 3(x + 2) | Factor común |
| FC-02 | 5x² − 10x | 5x(x − 2) | Factor común |
| FC-03 | x² + 7x | x(x + 7) | Factor común |
| FC-04 | 4x² − 12x | 4x(x − 3) | Factor común |
| FC-05 | 6x² + 9x | 3x(2x + 3) | Factor común |
| FC-06 | 2x³ + 8x² | 2x²(x + 4) | Factor común |
| FC-07 | 10x − 15 | 5(2x − 3) | Factor común |
| FC-08 | x³ − 5x² | x²(x − 5) | Factor común |
| DC-01 | x² − 9 | (x − 3)(x + 3) | Diferencia de cuadrados |
| DC-02 | x² − 16 | (x − 4)(x + 4) | Diferencia de cuadrados |
| DC-03 | x² − 25 | (x − 5)(x + 5) | Diferencia de cuadrados |
| DC-04 | x² − 49 | (x − 7)(x + 7) | Diferencia de cuadrados |
| DC-05 | 4x² − 9 | (2x − 3)(2x + 3) | Diferencia de cuadrados |
| DC-06 | 9x² − 4 | (3x − 2)(3x + 2) | Diferencia de cuadrados |
| DC-07 | 25x² − 16 | (5x − 4)(5x + 4) | Diferencia de cuadrados |
| DC-08 | 16x² − 1 | (4x − 1)(4x + 1) | Diferencia de cuadrados |
| TC-01 | x² + 6x + 9 | (x + 3)² | Trinomio cuadrado perfecto |
| TC-02 | x² − 8x + 16 | (x − 4)² | Trinomio cuadrado perfecto |
| TC-03 | x² + 10x + 25 | (x + 5)² | Trinomio cuadrado perfecto |
| TC-04 | x² − 12x + 36 | (x − 6)² | Trinomio cuadrado perfecto |
| TC-05 | 4x² + 12x + 9 | (2x + 3)² | Trinomio cuadrado perfecto |
| TC-06 | 9x² − 12x + 4 | (3x − 2)² | Trinomio cuadrado perfecto |
| TC-07 | 25x² + 10x + 1 | (5x + 1)² | Trinomio cuadrado perfecto |
| TC-08 | 4x² − 20x + 25 | (2x − 5)² | Trinomio cuadrado perfecto |
| XB-01 | x² + 5x + 6 | (x + 2)(x + 3) | Trinomio x² + bx + c |
| XB-02 | x² + 7x + 12 | (x + 3)(x + 4) | Trinomio x² + bx + c |
| XB-03 | x² + 8x + 15 | (x + 3)(x + 5) | Trinomio x² + bx + c |
| XB-04 | x² − 5x + 6 | (x − 2)(x − 3) | Trinomio x² + bx + c |
| XB-05 | x² + x − 6 | (x − 2)(x + 3) | Trinomio x² + bx + c |
| XB-06 | x² − x − 12 | (x + 3)(x − 4) | Trinomio x² + bx + c |
| XB-07 | x² + 2x − 15 | (x − 3)(x + 5) | Trinomio x² + bx + c |
| XB-08 | x² − 7x + 10 | (x − 2)(x − 5) | Trinomio x² + bx + c |
| XB-09 | x² + 9x + 20 | (x + 4)(x + 5) | Trinomio x² + bx + c |
| XB-10 | x² − 3x − 10 | (x + 2)(x − 5) | Trinomio x² + bx + c |
| AX-01 | 2x² + 7x + 3 | (x + 3)(2x + 1) | Trinomio ax² + bx + c |
| AX-02 | 3x² + 10x + 8 | (x + 2)(3x + 4) | Trinomio ax² + bx + c |
| AX-03 | 2x² − 5x − 3 | (x − 3)(2x + 1) | Trinomio ax² + bx + c |
| AX-04 | 3x² + x − 2 | (x + 1)(3x − 2) | Trinomio ax² + bx + c |
| AX-05 | 2x² + 5x − 12 | (x + 4)(2x − 3) | Trinomio ax² + bx + c |
| AX-06 | 5x² + 13x + 6 | (x + 2)(5x + 3) | Trinomio ax² + bx + c |
| AX-07 | 6x² + 7x + 2 | (2x + 1)(3x + 2) | Trinomio ax² + bx + c |
| AX-08 | 4x² − 4x − 3 | (2x + 1)(2x − 3) | Trinomio ax² + bx + c |
| AG-01 | x³ + 2x² + 3x + 6 | (x + 2)(x² + 3) | Agrupación |
| AG-02 | x³ − 3x² + 2x − 6 | (x − 3)(x² + 2) | Agrupación |
| AG-03 | 2x³ + x² + 6x + 3 | (2x + 1)(x² + 3) | Agrupación |
| AG-04 | x³ + 4x² + 5x + 20 | (x + 4)(x² + 5) | Agrupación |
| AG-05 | 3x³ − 2x² + 3x − 2 | (3x − 2)(x² + 1) | Agrupación |
| AG-06 | x³ − 5x² + 4x − 20 | (x − 5)(x² + 4) | Agrupación |

## Comprobaciones de la fase

- `npm test`: 4 pruebas aprobadas, 0 fallidas.
- El validador confirma unicidad de clasificación, expansión de cada factorización y las cuotas 8/8/8/10/8/6.
- Las pruebas negativas comprueban que se rechacen alteraciones de signo, caso, primitivad, ambigüedad e id duplicado.
- Pendiente de revisión del docente: aprobar el contenido y el orden mostrado antes de generar los cartones.
