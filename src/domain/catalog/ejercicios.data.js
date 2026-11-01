// Coeficientes en orden ascendente: [c₀, c₁, …].
const lin = (a, b, exp = 1) => ({ coef: [b, a], exp })
const cuad = (c, d) => ({ coef: [d, 0, c], exp: 1 })
const X = (exp = 1) => ({ coef: [0, 1], exp })
const F = (constante, ...factores) => ({ constante, factores })
const ej = (id, caso, nivel, polinomio, factorizacion, explicacion) => Object.freeze({
  id, caso, nivel, polinomio: Object.freeze(polinomio),
  factorizacion: Object.freeze({ constante: factorizacion.constante, factores: Object.freeze(factorizacion.factores.map((f) => Object.freeze({ coef: Object.freeze(f.coef), exp: f.exp }))) }),
  explicacion,
})

export const EJERCICIOS = Object.freeze([
  ej('FC-01','factor-comun',1,[6,3],F(3,lin(1,2)),'Factor común 3 en ambos términos.'),
  ej('FC-02','factor-comun',1,[0,-10,5],F(5,X(),lin(1,-2)),'Factor común 5x.'),
  ej('FC-03','factor-comun',1,[0,7,1],F(1,X(),lin(1,7)),'Factor común x.'),
  ej('FC-04','factor-comun',1,[0,-12,4],F(4,X(),lin(1,-3)),'Factor común 4x.'),
  ej('FC-05','factor-comun',2,[0,9,6],F(3,X(),lin(2,3)),'Factor común 3x.'),
  ej('FC-06','factor-comun',2,[0,0,8,2],F(2,X(2),lin(1,4)),'Factor común 2x².'),
  ej('FC-07','factor-comun',1,[-15,10],F(5,lin(2,-3)),'Factor común 5.'),
  ej('FC-08','factor-comun',1,[0,0,-5,1],F(1,X(2),lin(1,-5)),'Factor común x².'),

  ej('DC-01','diferencia-cuadrados',1,[-9,0,1],F(1,lin(1,-3),lin(1,3)),'a² − b² = (a − b)(a + b), con a = x y b = 3.'),
  ej('DC-02','diferencia-cuadrados',1,[-16,0,1],F(1,lin(1,-4),lin(1,4)),'a² − b² = (a − b)(a + b), con a = x y b = 4.'),
  ej('DC-03','diferencia-cuadrados',1,[-25,0,1],F(1,lin(1,-5),lin(1,5)),'a² − b² = (a − b)(a + b), con a = x y b = 5.'),
  ej('DC-04','diferencia-cuadrados',1,[-49,0,1],F(1,lin(1,-7),lin(1,7)),'a² − b² = (a − b)(a + b), con a = x y b = 7.'),
  ej('DC-05','diferencia-cuadrados',2,[-9,0,4],F(1,lin(2,-3),lin(2,3)),'a² − b² = (a − b)(a + b), con a = 2x y b = 3.'),
  ej('DC-06','diferencia-cuadrados',2,[-4,0,9],F(1,lin(3,-2),lin(3,2)),'a² − b² = (a − b)(a + b), con a = 3x y b = 2.'),
  ej('DC-07','diferencia-cuadrados',2,[-16,0,25],F(1,lin(5,-4),lin(5,4)),'a² − b² = (a − b)(a + b), con a = 5x y b = 4.'),
  ej('DC-08','diferencia-cuadrados',2,[-1,0,16],F(1,lin(4,-1),lin(4,1)),'a² − b² = (a − b)(a + b), con a = 4x y b = 1.'),

  ej('TC-01','trinomio-cuadrado-perfecto',1,[9,6,1],F(1,lin(1,3,2)),'a² + 2ab + b² = (a + b)², con a = x y b = 3.'),
  ej('TC-02','trinomio-cuadrado-perfecto',1,[16,-8,1],F(1,lin(1,-4,2)),'a² − 2ab + b² = (a − b)², con a = x y b = 4.'),
  ej('TC-03','trinomio-cuadrado-perfecto',1,[25,10,1],F(1,lin(1,5,2)),'a² + 2ab + b² = (a + b)², con a = x y b = 5.'),
  ej('TC-04','trinomio-cuadrado-perfecto',1,[36,-12,1],F(1,lin(1,-6,2)),'a² − 2ab + b² = (a − b)², con a = x y b = 6.'),
  ej('TC-05','trinomio-cuadrado-perfecto',2,[9,12,4],F(1,lin(2,3,2)),'a² + 2ab + b² = (a + b)², con a = 2x y b = 3.'),
  ej('TC-06','trinomio-cuadrado-perfecto',2,[4,-12,9],F(1,lin(3,-2,2)),'a² − 2ab + b² = (a − b)², con a = 3x y b = 2.'),
  ej('TC-07','trinomio-cuadrado-perfecto',2,[1,10,25],F(1,lin(5,1,2)),'a² + 2ab + b² = (a + b)², con a = 5x y b = 1.'),
  ej('TC-08','trinomio-cuadrado-perfecto',2,[25,-20,4],F(1,lin(2,-5,2)),'a² − 2ab + b² = (a − b)², con a = 2x y b = 5.'),

  ej('XB-01','trinomio-x2-bx-c',1,[6,5,1],F(1,lin(1,2),lin(1,3)),'Dos números suman 5 y multiplican 6: 2 y 3.'),
  ej('XB-02','trinomio-x2-bx-c',1,[12,7,1],F(1,lin(1,3),lin(1,4)),'Dos números suman 7 y multiplican 12: 3 y 4.'),
  ej('XB-03','trinomio-x2-bx-c',1,[15,8,1],F(1,lin(1,3),lin(1,5)),'Dos números suman 8 y multiplican 15: 3 y 5.'),
  ej('XB-04','trinomio-x2-bx-c',1,[6,-5,1],F(1,lin(1,-2),lin(1,-3)),'Dos números suman −5 y multiplican 6: −2 y −3.'),
  ej('XB-05','trinomio-x2-bx-c',1,[-6,1,1],F(1,lin(1,-2),lin(1,3)),'Dos números suman 1 y multiplican −6: −2 y 3.'),
  ej('XB-06','trinomio-x2-bx-c',1,[-12,-1,1],F(1,lin(1,3),lin(1,-4)),'Dos números suman −1 y multiplican −12: 3 y −4.'),
  ej('XB-07','trinomio-x2-bx-c',1,[-15,2,1],F(1,lin(1,-3),lin(1,5)),'Dos números suman 2 y multiplican −15: −3 y 5.'),
  ej('XB-08','trinomio-x2-bx-c',1,[10,-7,1],F(1,lin(1,-2),lin(1,-5)),'Dos números suman −7 y multiplican 10: −2 y −5.'),
  ej('XB-09','trinomio-x2-bx-c',1,[20,9,1],F(1,lin(1,4),lin(1,5)),'Dos números suman 9 y multiplican 20: 4 y 5.'),
  ej('XB-10','trinomio-x2-bx-c',1,[-10,-3,1],F(1,lin(1,2),lin(1,-5)),'Dos números suman −3 y multiplican −10: 2 y −5.'),

  ej('AX-01','trinomio-ax2-bx-c',2,[3,7,2],F(1,lin(1,3),lin(2,1)),'a·c = 6; los números 6 y 1 suman 7.'),
  ej('AX-02','trinomio-ax2-bx-c',2,[8,10,3],F(1,lin(1,2),lin(3,4)),'a·c = 24; los números 6 y 4 suman 10.'),
  ej('AX-03','trinomio-ax2-bx-c',2,[-3,-5,2],F(1,lin(1,-3),lin(2,1)),'a·c = −6; los números −6 y 1 suman −5.'),
  ej('AX-04','trinomio-ax2-bx-c',2,[-2,1,3],F(1,lin(1,1),lin(3,-2)),'a·c = −6; los números 3 y −2 suman 1.'),
  ej('AX-05','trinomio-ax2-bx-c',2,[-12,5,2],F(1,lin(1,4),lin(2,-3)),'a·c = −24; los números 8 y −3 suman 5.'),
  ej('AX-06','trinomio-ax2-bx-c',2,[6,13,5],F(1,lin(1,2),lin(5,3)),'a·c = 30; los números 10 y 3 suman 13.'),
  ej('AX-07','trinomio-ax2-bx-c',2,[2,7,6],F(1,lin(2,1),lin(3,2)),'a·c = 12; los números 4 y 3 suman 7.'),
  ej('AX-08','trinomio-ax2-bx-c',2,[-3,-4,4],F(1,lin(2,1),lin(2,-3)),'a·c = −12; los números 2 y −6 suman −4.'),

  ej('AG-01','agrupacion',2,[6,3,2,1],F(1,lin(1,2),cuad(1,3)),'x²(x + 2) + 3(x + 2) = (x + 2)(x² + 3).'),
  ej('AG-02','agrupacion',2,[-6,2,-3,1],F(1,lin(1,-3),cuad(1,2)),'x²(x − 3) + 2(x − 3) = (x − 3)(x² + 2).'),
  ej('AG-03','agrupacion',2,[3,6,1,2],F(1,lin(2,1),cuad(1,3)),'x²(2x + 1) + 3(2x + 1) = (2x + 1)(x² + 3).'),
  ej('AG-04','agrupacion',2,[20,5,4,1],F(1,lin(1,4),cuad(1,5)),'x²(x + 4) + 5(x + 4) = (x + 4)(x² + 5).'),
  ej('AG-05','agrupacion',2,[-2,3,-2,3],F(1,lin(3,-2),cuad(1,1)),'x²(3x − 2) + 1(3x − 2) = (3x − 2)(x² + 1).'),
  ej('AG-06','agrupacion',2,[-20,4,-5,1],F(1,lin(1,-5),cuad(1,4)),'x²(x − 5) + 4(x − 5) = (x − 5)(x² + 4).'),
])
