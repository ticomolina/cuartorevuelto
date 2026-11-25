/* ============================================================
   CUARTO REVUELTO · ARCHIVO DE DATOS
   Todo lo que se puede ajustar sin tocar el código está acá.
   Después de editar: subí el archivo y abrí la app dos veces
   (la primera baja la versión nueva, la segunda la usa).
   ============================================================ */

window.DATOS = {

  /* ---------- PARTIDA ---------- */
  partida: {
    vidas: 5,                 // corazones al empezar
    pistas: 3,                // pistas (lamparita) por partida
    segundosPista: 3,         // cuánto se ve el dibujo en la tarjeta
    cambiarEscenarioCada: 3,  // niveles seguidos en el mismo escenario
    segundosFestejo: 2.2      // duración del "¡MUY BIEN!" entre niveles
  },

  /* ---------- CURVA DE DIFICULTAD ----------
     Una fila por nivel. Después de la última fila se repite la última.
     misiones   : cuántas tarjetas de misión (1 a 3)
     cantidad   : [mín, máx] de objetos a encontrar por misión
     relleno    : objetos que NO hay que tocar
     tamano     : tamaño de los objetos, en % del ancho de la imagen de fondo
     giro       : rotación máxima en grados (0 = derechos)
     tapados    : proporción de objetos buscados que quedan medio tapados (0 a 1)
     parecidos  : probabilidad de que el relleno sea parecido a lo buscado (0 a 1)
     segundos   : tiempo límite (la barra no muestra números)
  */
  niveles: [
    /* 1 */ { misiones: 1, cantidad: [1, 2], relleno: 4,  tamano: 13,   giro: 0,  tapados: 0,    parecidos: 0,    segundos: 75 },
    /* 2 */ { misiones: 1, cantidad: [2, 3], relleno: 6,  tamano: 12,   giro: 8,  tapados: 0,    parecidos: 0,    segundos: 75 },
    /* 3 */ { misiones: 2, cantidad: [1, 2], relleno: 6,  tamano: 11.5, giro: 12, tapados: 0,    parecidos: 0.1,  segundos: 80 },
    /* 4 */ { misiones: 2, cantidad: [2, 2], relleno: 8,  tamano: 11,   giro: 18, tapados: 0.15, parecidos: 0.2,  segundos: 80 },
    /* 5 */ { misiones: 2, cantidad: [2, 3], relleno: 9,  tamano: 10.5, giro: 22, tapados: 0.2,  parecidos: 0.3,  segundos: 75 },
    /* 6 */ { misiones: 3, cantidad: [1, 2], relleno: 10, tamano: 10,   giro: 28, tapados: 0.25, parecidos: 0.35, segundos: 85 },
    /* 7 */ { misiones: 3, cantidad: [2, 2], relleno: 11, tamano: 9.5,  giro: 32, tapados: 0.3,  parecidos: 0.4,  segundos: 80 },
    /* 8 */ { misiones: 3, cantidad: [2, 3], relleno: 12, tamano: 9,    giro: 38, tapados: 0.35, parecidos: 0.5,  segundos: 80 },
    /* 9 */ { misiones: 3, cantidad: [2, 3], relleno: 13, tamano: 9,    giro: 42, tapados: 0.4,  parecidos: 0.55, segundos: 75 },
    /*10 */ { misiones: 3, cantidad: [2, 3], relleno: 14, tamano: 8.5,  giro: 45, tapados: 0.45, parecidos: 0.6,  segundos: 70 }
  ],

  /* ---------- ESCENARIOS ----------
     icono : emoji que aparece en el festejo cuando se cambia de escenario
     fondo : imagen del diorama (PNG o WEBP con fondo transparente, o JPG).
             Se muestra entera, centrada. Si agregás un archivo nuevo,
             sumalo también a la lista de sw.js.
     piso  : contorno del piso libre, donde pueden caer los objetos.
             Son puntos [x, y] en % de la imagen (0,0 = arriba a la izquierda;
             100,100 = abajo a la derecha), en orden alrededor del piso.
             Dejá afuera muebles, árboles, agua, etc.
     objetos:
       emoji     : el dibujo (emoji del sistema)
       palabra   : en singular, MAYÚSCULAS
       plural    : MAYÚSCULAS
       parecidos : palabras (singular) de este mismo escenario que se le parecen
     REGLAS IMPORTANTES:
       · No pongas en un mismo escenario dos objetos que los chicos podrían
         llamar igual (ej. ⚽ y 🏀 son las dos "PELOTA").
       · Mejor emojis viejos y conocidos: en tablets con Android viejo los
         emojis muy nuevos se ven como un cuadradito.
  */
  escenarios: [
    {
      nombre: "CUARTO",
      icono: "🛏️",
      fondo: "fondos/cuarto.webp",
      piso: [[9, 68], [30, 60], [33, 47], [44, 43], [57, 43], [60, 47], [58, 58], [74, 74], [50, 91]],
      objetos: [
        { emoji: "🕶️", palabra: "ANTEOJOS",  plural: "ANTEOJOS",   parecidos: ["RELOJ"] },
        { emoji: "⚽", palabra: "PELOTA",    plural: "PELOTAS",    parecidos: ["GLOBO", "DADO"] },
        { emoji: "🧸", palabra: "OSO",       plural: "OSOS",       parecidos: ["ROBOT"] },
        { emoji: "🧦", palabra: "MEDIA",     plural: "MEDIAS",     parecidos: ["ZAPATILLA", "PANTALÓN"] },
        { emoji: "🚗", palabra: "AUTO",      plural: "AUTOS",      parecidos: ["TREN"] },
        { emoji: "📕", palabra: "LIBRO",     plural: "LIBROS",     parecidos: ["MOCHILA"] },
        { emoji: "👕", palabra: "REMERA",    plural: "REMERAS",    parecidos: ["VESTIDO", "PANTALÓN"] },
        { emoji: "🧢", palabra: "GORRA",     plural: "GORRAS",     parecidos: ["CORONA"] },
        { emoji: "👟", palabra: "ZAPATILLA", plural: "ZAPATILLAS", parecidos: ["MEDIA"] },
        { emoji: "✏️", palabra: "LÁPIZ",     plural: "LÁPICES",    parecidos: ["LLAVE"] },
        { emoji: "🎈", palabra: "GLOBO",     plural: "GLOBOS",     parecidos: ["PELOTA"] },
        { emoji: "🚂", palabra: "TREN",      plural: "TRENES",     parecidos: ["AUTO"] },
        { emoji: "🎲", palabra: "DADO",      plural: "DADOS",      parecidos: ["PELOTA"] },
        { emoji: "🎒", palabra: "MOCHILA",   plural: "MOCHILAS",   parecidos: ["LIBRO"] },
        { emoji: "⏰", palabra: "RELOJ",     plural: "RELOJES",    parecidos: ["ANTEOJOS"] },
        { emoji: "🔑", palabra: "LLAVE",     plural: "LLAVES",     parecidos: ["LÁPIZ"] },
        { emoji: "👗", palabra: "VESTIDO",   plural: "VESTIDOS",   parecidos: ["REMERA"] },
        { emoji: "👖", palabra: "PANTALÓN",  plural: "PANTALONES", parecidos: ["MEDIA", "REMERA"] },
        { emoji: "🤖", palabra: "ROBOT",     plural: "ROBOTS",     parecidos: ["OSO"] },
        { emoji: "👑", palabra: "CORONA",    plural: "CORONAS",    parecidos: ["GORRA"] }
      ]
    },
    {
      nombre: "COCINA",
      icono: "🍳",
      fondo: "fondos/cocina.webp",
      piso: [[14, 68], [36, 60], [42, 50], [46, 47], [74, 63], [88, 70], [50, 90]],
      objetos: [
        { emoji: "🍎", palabra: "MANZANA",   plural: "MANZANAS",   parecidos: ["TOMATE", "FRUTILLA"] },
        { emoji: "🍌", palabra: "BANANA",    plural: "BANANAS",    parecidos: ["CHOCLO"] },
        { emoji: "☕", palabra: "TAZA",      plural: "TAZAS",      parecidos: ["VASO"] },
        { emoji: "🥛", palabra: "VASO",      plural: "VASOS",      parecidos: ["TAZA"] },
        { emoji: "🥄", palabra: "CUCHARA",   plural: "CUCHARAS",   parecidos: [] },
        { emoji: "🥚", palabra: "HUEVO",     plural: "HUEVOS",     parecidos: ["PAN"] },
        { emoji: "🍞", palabra: "PAN",       plural: "PANES",      parecidos: ["QUESO", "HUEVO"] },
        { emoji: "🧀", palabra: "QUESO",     plural: "QUESOS",     parecidos: ["PAN"] },
        { emoji: "🍐", palabra: "PERA",      plural: "PERAS",      parecidos: ["PALTA", "LIMÓN"] },
        { emoji: "🍓", palabra: "FRUTILLA",  plural: "FRUTILLAS",  parecidos: ["TOMATE", "MANZANA"] },
        { emoji: "🍅", palabra: "TOMATE",    plural: "TOMATES",    parecidos: ["MANZANA", "FRUTILLA"] },
        { emoji: "🥕", palabra: "ZANAHORIA", plural: "ZANAHORIAS", parecidos: ["CHOCLO"] },
        { emoji: "🍕", palabra: "PIZZA",     plural: "PIZZAS",     parecidos: ["GALLETITA"] },
        { emoji: "🎂", palabra: "TORTA",     plural: "TORTAS",     parecidos: [] },
        { emoji: "🍋", palabra: "LIMÓN",     plural: "LIMONES",    parecidos: ["PERA", "BANANA"] },
        { emoji: "🍪", palabra: "GALLETITA", plural: "GALLETITAS", parecidos: ["PIZZA"] },
        { emoji: "🌽", palabra: "CHOCLO",    plural: "CHOCLOS",    parecidos: ["ZANAHORIA", "BANANA"] },
        { emoji: "🥑", palabra: "PALTA",     plural: "PALTAS",     parecidos: ["PERA"] }
      ]
    },
    {
      nombre: "PLAZA",
      icono: "🌳",
      fondo: "fondos/plaza.webp",
      piso: [[31, 54], [30, 40], [36, 33], [48, 25], [78, 40], [80, 48], [50, 79]],
      objetos: [
        { emoji: "🐕", palabra: "PERRO",     plural: "PERROS",     parecidos: ["GATO", "CONEJO"] },
        { emoji: "🐈", palabra: "GATO",      plural: "GATOS",      parecidos: ["PERRO"] },
        { emoji: "🐦", palabra: "PÁJARO",    plural: "PÁJAROS",    parecidos: ["PATO"] },
        { emoji: "🦆", palabra: "PATO",      plural: "PATOS",      parecidos: ["PÁJARO"] },
        { emoji: "🌷", palabra: "FLOR",      plural: "FLORES",     parecidos: ["HOJA"] },
        { emoji: "🍁", palabra: "HOJA",      plural: "HOJAS",      parecidos: ["FLOR"] },
        { emoji: "🌳", palabra: "ÁRBOL",     plural: "ÁRBOLES",    parecidos: [] },
        { emoji: "🦋", palabra: "MARIPOSA",  plural: "MARIPOSAS",  parecidos: ["ABEJA"] },
        { emoji: "🐝", palabra: "ABEJA",     plural: "ABEJAS",     parecidos: ["MARIPOSA", "HORMIGA"] },
        { emoji: "🐜", palabra: "HORMIGA",   plural: "HORMIGAS",   parecidos: ["ABEJA", "CARACOL"] },
        { emoji: "🐌", palabra: "CARACOL",   plural: "CARACOLES",  parecidos: ["HORMIGA"] },
        { emoji: "🚲", palabra: "BICI",      plural: "BICIS",      parecidos: [] },
        { emoji: "🎈", palabra: "GLOBO",     plural: "GLOBOS",     parecidos: ["HELADO"] },
        { emoji: "🍦", palabra: "HELADO",    plural: "HELADOS",    parecidos: ["GLOBO"] },
        { emoji: "⚽", palabra: "PELOTA",    plural: "PELOTAS",    parecidos: [] },
        { emoji: "🐇", palabra: "CONEJO",    plural: "CONEJOS",    parecidos: ["PERRO", "GATO"] },
        { emoji: "☁️", palabra: "NUBE",      plural: "NUBES",      parecidos: [] }
      ]
    },
    {
      nombre: "PLAYA",
      icono: "🏖️",
      fondo: "fondos/playa.webp",
      piso: [[14, 57], [28, 42], [45, 30], [62, 32], [78, 45], [84, 60], [50, 84]],
      objetos: [
        { emoji: "⛱️", palabra: "SOMBRILLA", plural: "SOMBRILLAS", parecidos: ["PALMERA"] },
        { emoji: "🌴", palabra: "PALMERA",   plural: "PALMERAS",   parecidos: ["SOMBRILLA"] },
        { emoji: "🐟", palabra: "PEZ",       plural: "PECES",      parecidos: ["DELFÍN", "BALLENA"] },
        { emoji: "🐬", palabra: "DELFÍN",    plural: "DELFINES",   parecidos: ["PEZ", "BALLENA"] },
        { emoji: "🐳", palabra: "BALLENA",   plural: "BALLENAS",   parecidos: ["DELFÍN", "PEZ"] },
        { emoji: "🦀", palabra: "CANGREJO",  plural: "CANGREJOS",  parecidos: ["CARACOLA", "PULPO"] },
        { emoji: "🐚", palabra: "CARACOLA",  plural: "CARACOLAS",  parecidos: ["CANGREJO"] },
        { emoji: "🐙", palabra: "PULPO",     plural: "PULPOS",     parecidos: ["CALAMAR"] },
        { emoji: "🦑", palabra: "CALAMAR",   plural: "CALAMARES",  parecidos: ["PULPO"] },
        { emoji: "🐢", palabra: "TORTUGA",   plural: "TORTUGAS",   parecidos: ["CANGREJO"] },
        { emoji: "⛵", palabra: "BARCO",     plural: "BARCOS",     parecidos: ["OLA"] },
        { emoji: "🌊", palabra: "OLA",       plural: "OLAS",       parecidos: ["BARCO"] },
        { emoji: "🕶️", palabra: "ANTEOJOS",  plural: "ANTEOJOS",   parecidos: [] },
        { emoji: "🍦", palabra: "HELADO",    plural: "HELADOS",    parecidos: [] },
        { emoji: "🏐", palabra: "PELOTA",    plural: "PELOTAS",    parecidos: ["CARACOLA"] },
        { emoji: "🍍", palabra: "ANANÁ",     plural: "ANANÁS",     parecidos: ["PALMERA"] }
      ]
    },
    {
      nombre: "GRANJA",
      icono: "🐄",
      fondo: "fondos/granja.webp",
      piso: [[9, 54], [30, 44], [47, 38], [55, 27], [90, 53], [50, 79]],
      objetos: [
        { emoji: "🐄", palabra: "VACA",      plural: "VACAS",      parecidos: ["CABALLO"] },
        { emoji: "🐖", palabra: "CHANCHO",   plural: "CHANCHOS",   parecidos: ["RATÓN"] },
        { emoji: "🐎", palabra: "CABALLO",   plural: "CABALLOS",   parecidos: ["VACA"] },
        { emoji: "🐑", palabra: "OVEJA",     plural: "OVEJAS",     parecidos: ["CABRA"] },
        { emoji: "🐐", palabra: "CABRA",     plural: "CABRAS",     parecidos: ["OVEJA"] },
        { emoji: "🐔", palabra: "GALLINA",   plural: "GALLINAS",   parecidos: ["GALLO", "POLLITO"] },
        { emoji: "🐓", palabra: "GALLO",     plural: "GALLOS",     parecidos: ["GALLINA"] },
        { emoji: "🐤", palabra: "POLLITO",   plural: "POLLITOS",   parecidos: ["GALLINA", "PATO"] },
        { emoji: "🦆", palabra: "PATO",      plural: "PATOS",      parecidos: ["POLLITO"] },
        { emoji: "🐇", palabra: "CONEJO",    plural: "CONEJOS",    parecidos: ["RATÓN"] },
        { emoji: "🐁", palabra: "RATÓN",     plural: "RATONES",    parecidos: ["CONEJO", "CHANCHO"] },
        { emoji: "🐕", palabra: "PERRO",     plural: "PERROS",     parecidos: ["GATO"] },
        { emoji: "🐈", palabra: "GATO",      plural: "GATOS",      parecidos: ["PERRO"] },
        { emoji: "🚜", palabra: "TRACTOR",   plural: "TRACTORES",  parecidos: [] },
        { emoji: "🥚", palabra: "HUEVO",     plural: "HUEVOS",     parecidos: [] },
        { emoji: "🌽", palabra: "CHOCLO",    plural: "CHOCLOS",    parecidos: ["ZANAHORIA"] },
        { emoji: "🥕", palabra: "ZANAHORIA", plural: "ZANAHORIAS", parecidos: ["CHOCLO"] },
        { emoji: "🍎", palabra: "MANZANA",   plural: "MANZANAS",   parecidos: [] }
      ]
    },
    {
      nombre: "BAÑO",
      icono: "🛁",
      fondo: "fondos/bano.webp",
      piso: [[14, 72], [32, 62], [34, 52], [48, 44], [52, 50], [62, 53], [70, 53], [72, 62], [80, 67], [92, 68], [50, 94]],
      objetos: [
        { emoji: "🦆", palabra: "PATITO",         plural: "PATITOS",      parecidos: ["BARCO"] },
        { emoji: "🧼", palabra: "JABÓN",          plural: "JABONES",      parecidos: ["ESPONJA"] },
        { emoji: "🧽", palabra: "ESPONJA",        plural: "ESPONJAS",     parecidos: ["JABÓN"] },
        { emoji: "🐟", palabra: "PEZ",            plural: "PECES",        parecidos: ["BALLENA"] },
        { emoji: "🐳", palabra: "BALLENA",        plural: "BALLENAS",     parecidos: ["PEZ"] },
        { emoji: "⛵", palabra: "BARCO",          plural: "BARCOS",       parecidos: ["PATITO"] },
        { emoji: "🧸", palabra: "OSO",            plural: "OSOS",         parecidos: [] },
        { emoji: "🐙", palabra: "PULPO",          plural: "PULPOS",       parecidos: ["RANA"] },
        { emoji: "🐢", palabra: "TORTUGA",        plural: "TORTUGAS",     parecidos: ["RANA"] },
        { emoji: "🐸", palabra: "RANA",           plural: "RANAS",        parecidos: ["TORTUGA", "PULPO"] },
        { emoji: "⭐", palabra: "ESTRELLA",       plural: "ESTRELLAS",    parecidos: [] },
        { emoji: "👕", palabra: "REMERA",         plural: "REMERAS",      parecidos: ["MEDIA"] },
        { emoji: "🧦", palabra: "MEDIA",          plural: "MEDIAS",       parecidos: ["REMERA"] }
      ]
    },
    {
      nombre: "AULA",
      icono: "✏️",
      fondo: "fondos/aula.webp",
      piso: [[8, 64], [24, 56], [26, 48], [40, 44], [54, 41], [64, 48], [72, 56], [84, 62], [90, 64], [50, 93]],
      objetos: [
        { emoji: "✏️", palabra: "LÁPIZ",         plural: "LÁPICES",      parecidos: ["CRAYÓN", "PINCEL"] },
        { emoji: "🖍️", palabra: "CRAYÓN",        plural: "CRAYONES",     parecidos: ["LÁPIZ", "PINCEL"] },
        { emoji: "🖌️", palabra: "PINCEL",        plural: "PINCELES",     parecidos: ["LÁPIZ", "CRAYÓN"] },
        { emoji: "📏", palabra: "REGLA",          plural: "REGLAS",       parecidos: ["LÁPIZ"] },
        { emoji: "✂️", palabra: "TIJERA",        plural: "TIJERAS",      parecidos: ["CLIP"] },
        { emoji: "📎", palabra: "CLIP",           plural: "CLIPS",        parecidos: ["TIJERA"] },
        { emoji: "📕", palabra: "LIBRO",          plural: "LIBROS",       parecidos: ["MOCHILA"] },
        { emoji: "🎒", palabra: "MOCHILA",        plural: "MOCHILAS",     parecidos: ["LIBRO"] },
        { emoji: "🍎", palabra: "MANZANA",        plural: "MANZANAS",     parecidos: ["PELOTA"] },
        { emoji: "🔔", palabra: "CAMPANA",        plural: "CAMPANAS",     parecidos: ["RELOJ"] },
        { emoji: "⏰", palabra: "RELOJ",          plural: "RELOJES",      parecidos: ["CAMPANA"] },
        { emoji: "🎲", palabra: "DADO",           plural: "DADOS",        parecidos: [] },
        { emoji: "⚽", palabra: "PELOTA",         plural: "PELOTAS",      parecidos: ["GLOBO"] },
        { emoji: "🎈", palabra: "GLOBO",          plural: "GLOBOS",       parecidos: ["PELOTA", "MANZANA"] }
      ]
    },
    {
      nombre: "SUPERMERCADO",
      icono: "🛒",
      fondo: "fondos/supermercado.webp",
      piso: [[12, 59], [35, 46], [44, 41], [53, 37], [67, 45], [78, 53], [86, 59], [85, 72], [93, 72], [50, 95], [30, 84], [30, 66], [14, 62]],
      objetos: [
        { emoji: "🍞", palabra: "PAN",            plural: "PANES",        parecidos: ["QUESO"] },
        { emoji: "🧀", palabra: "QUESO",          plural: "QUESOS",       parecidos: ["PAN"] },
        { emoji: "🥛", palabra: "LECHE",          plural: "LECHES",       parecidos: [] },
        { emoji: "🍌", palabra: "BANANA",         plural: "BANANAS",      parecidos: ["LIMÓN"] },
        { emoji: "🍋", palabra: "LIMÓN",          plural: "LIMONES",      parecidos: ["BANANA"] },
        { emoji: "🍉", palabra: "SANDÍA",         plural: "SANDÍAS",      parecidos: ["FRUTILLA"] },
        { emoji: "🍓", palabra: "FRUTILLA",       plural: "FRUTILLAS",    parecidos: ["SANDÍA"] },
        { emoji: "🥚", palabra: "HUEVO",          plural: "HUEVOS",       parecidos: [] },
        { emoji: "🍫", palabra: "CHOCOLATE",      plural: "CHOCOLATES",   parecidos: ["GALLETITA"] },
        { emoji: "🍪", palabra: "GALLETITA",      plural: "GALLETITAS",   parecidos: ["CHOCOLATE", "PIZZA"] },
        { emoji: "🍭", palabra: "CHUPETÍN",       plural: "CHUPETINES",   parecidos: ["CARAMELO"] },
        { emoji: "🍬", palabra: "CARAMELO",       plural: "CARAMELOS",    parecidos: ["CHUPETÍN"] },
        { emoji: "🥕", palabra: "ZANAHORIA",      plural: "ZANAHORIAS",   parecidos: [] },
        { emoji: "🍗", palabra: "POLLO",          plural: "POLLOS",       parecidos: ["PESCADO"] },
        { emoji: "🐟", palabra: "PESCADO",        plural: "PESCADOS",     parecidos: ["POLLO"] },
        { emoji: "🍕", palabra: "PIZZA",          plural: "PIZZAS",       parecidos: ["GALLETITA"] },
        { emoji: "🍦", palabra: "HELADO",         plural: "HELADOS",      parecidos: [] }
      ]
    },
    {
      nombre: "BOSQUE",
      icono: "🌲",
      fondo: "fondos/bosque.webp",
      piso: [[8, 57], [24, 52], [42, 45], [45, 37], [58, 35], [70, 42], [72, 57], [88, 61], [50, 84]],
      objetos: [
        { emoji: "🍄", palabra: "HONGO",          plural: "HONGOS",       parecidos: ["HOJA"] },
        { emoji: "🍂", palabra: "HOJA",           plural: "HOJAS",        parecidos: ["HONGO"] },
        { emoji: "🐿️", palabra: "ARDILLA",       plural: "ARDILLAS",     parecidos: ["ERIZO", "CONEJO"] },
        { emoji: "🦊", palabra: "ZORRO",          plural: "ZORROS",       parecidos: ["CIERVO"] },
        { emoji: "🦌", palabra: "CIERVO",         plural: "CIERVOS",      parecidos: ["ZORRO"] },
        { emoji: "🦉", palabra: "BÚHO",           plural: "BÚHOS",        parecidos: ["PÁJARO"] },
        { emoji: "🐦", palabra: "PÁJARO",         plural: "PÁJAROS",      parecidos: ["BÚHO"] },
        { emoji: "🐻", palabra: "OSO",            plural: "OSOS",         parecidos: [] },
        { emoji: "🐸", palabra: "RANA",           plural: "RANAS",        parecidos: ["CARACOL"] },
        { emoji: "🦔", palabra: "ERIZO",          plural: "ERIZOS",       parecidos: ["ARDILLA"] },
        { emoji: "🐌", palabra: "CARACOL",        plural: "CARACOLES",    parecidos: ["RANA"] },
        { emoji: "🐇", palabra: "CONEJO",         plural: "CONEJOS",      parecidos: ["ARDILLA"] },
        { emoji: "🦋", palabra: "MARIPOSA",       plural: "MARIPOSAS",    parecidos: ["ABEJA"] },
        { emoji: "🐝", palabra: "ABEJA",          plural: "ABEJAS",       parecidos: ["MARIPOSA"] },
        { emoji: "🔦", palabra: "LINTERNA",       plural: "LINTERNAS",    parecidos: [] },
        { emoji: "🎒", palabra: "MOCHILA",        plural: "MOCHILAS",     parecidos: [] }
      ]
    },
    {
      nombre: "ZOOLÓGICO",
      icono: "🦁",
      fondo: "fondos/zoologico.webp",
      piso: [[20, 47], [39, 31], [48, 28], [60, 28], [61, 38], [72, 41], [78, 45], [79, 57], [85, 64], [70, 70], [63, 74], [50, 82], [37, 74], [26, 68], [22, 62], [21, 52]],
      objetos: [
        { emoji: "🦁", palabra: "LEÓN",           plural: "LEONES",       parecidos: ["TIGRE"] },
        { emoji: "🐅", palabra: "TIGRE",          plural: "TIGRES",       parecidos: ["LEÓN"] },
        { emoji: "🐘", palabra: "ELEFANTE",       plural: "ELEFANTES",    parecidos: ["HIPOPÓTAMO", "RINOCERONTE"] },
        { emoji: "🦛", palabra: "HIPOPÓTAMO",     plural: "HIPOPÓTAMOS",  parecidos: ["ELEFANTE", "RINOCERONTE"] },
        { emoji: "🦏", palabra: "RINOCERONTE",    plural: "RINOCERONTES", parecidos: ["HIPOPÓTAMO", "ELEFANTE"] },
        { emoji: "🦒", palabra: "JIRAFA",         plural: "JIRAFAS",      parecidos: ["CAMELLO", "CEBRA"] },
        { emoji: "🐫", palabra: "CAMELLO",        plural: "CAMELLOS",     parecidos: ["JIRAFA"] },
        { emoji: "🦓", palabra: "CEBRA",          plural: "CEBRAS",       parecidos: ["JIRAFA"] },
        { emoji: "🐒", palabra: "MONO",           plural: "MONOS",        parecidos: ["CANGURO"] },
        { emoji: "🦘", palabra: "CANGURO",        plural: "CANGUROS",     parecidos: ["MONO"] },
        { emoji: "🐧", palabra: "PINGÜINO",       plural: "PINGÜINOS",    parecidos: ["FLAMENCO"] },
        { emoji: "🦩", palabra: "FLAMENCO",       plural: "FLAMENCOS",    parecidos: ["PINGÜINO"] },
        { emoji: "🐊", palabra: "COCODRILO",      plural: "COCODRILOS",   parecidos: ["VÍBORA", "TORTUGA"] },
        { emoji: "🐍", palabra: "VÍBORA",         plural: "VÍBORAS",      parecidos: ["COCODRILO"] },
        { emoji: "🐢", palabra: "TORTUGA",        plural: "TORTUGAS",     parecidos: ["COCODRILO"] },
        { emoji: "🐼", palabra: "PANDA",          plural: "PANDAS",       parecidos: [] }
      ]
    }
  ]
};
