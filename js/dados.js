/*
 * Cardápio da Xexéu Lanches.
 *
 * Cada item pode ter:
 *   preco        preço base
 *   variantes    [{ nome, preco }] (ex.: simples/duplo); substitui o preço base
 *   escolhas     { quantidade, rotulo, opcoes: [] } para combos (escolher N lanches)
 *   inclui       texto extra mostrado no combo (ex.: "+ Refrigerante 2 L")
 *   adicionais   true para permitir "Turbine seu lanche" e molhos
 *   sabores      lista de sabores (ex.: refrigerante)
 *   somenteLocal texto explicando que o item não vai para entrega/retirada
 */

const ADICIONAIS = [
  { id: "batata-palha", nome: "Batata palha", preco: 3 },
  { id: "ovo", nome: "Ovo", preco: 3 },
  { id: "bacon", nome: "Bacon", preco: 9 },
  { id: "mussarela", nome: "Mussarela", preco: 4 },
  { id: "salsicha", nome: "Salsicha", preco: 3 },
  { id: "hamburguer", nome: "Hambúrguer artesanal 120 g", preco: 8 },
  { id: "frango", nome: "Frango desfiado", preco: 9 },
  { id: "milho", nome: "Milho", preco: 3 },
];

const MOLHOS = [
  { id: "maionese-verde", nome: "Maionese verde", preco: 2 },
  { id: "barbecue", nome: "Barbecue", preco: 2 },
  { id: "maionese-alho", nome: "Maionese de alho", preco: 2 },
];

const SABORES_REFRI = ["Coca-Cola", "Guaraná", "Fanta Laranja", "Sprite"];

const CATEGORIAS = [
  {
    id: "artesanal",
    nome: "Hambúrguer Artesanal",
    nota: "Todos com <strong>hambúrguer artesanal de 120 g</strong>. Peça duplo para dois hambúrgueres.",
    itens: [
      { id: "burguer-salada", nome: "Burguer Salada", desc: "Pão, hambúrguer, mussarela, maionese, alface, tomate e ketchup.", variantes: [{ nome: "Simples", preco: 24 }, { nome: "Duplo", preco: 32 }], adicionais: true },
      { id: "burguer-bacon", nome: "Burguer Bacon", desc: "Pão, bacon, hambúrguer, mussarela, maionese, ketchup, alface e tomate.", variantes: [{ nome: "Simples", preco: 29 }, { nome: "Duplo", preco: 37 }], adicionais: true },
      { id: "burguer-frango", nome: "Burguer Frango", desc: "Pão, frango desfiado, hambúrguer, mussarela, maionese, ketchup, tomate e alface.", variantes: [{ nome: "Simples", preco: 28 }, { nome: "Duplo", preco: 36 }], adicionais: true },
      { id: "moda-da-casa", nome: "Moda da Casa", desc: "Pão, salsicha, bacon, hambúrguer, mussarela, cebola caramelizada, maionese, ketchup, tomate e alface.", variantes: [{ nome: "Simples", preco: 31 }, { nome: "Duplo", preco: 39 }], adicionais: true },
      { id: "burguer-egg", nome: "Burguer Egg", desc: "Pão, hambúrguer artesanal, ovo, mussarela, alface, tomate, ketchup e maionese.", variantes: [{ nome: "Simples", preco: 27 }, { nome: "Duplo", preco: 35 }], adicionais: true },
      { id: "modao", nome: "Modão", desc: "Pão, salsicha, bacon, calabresa, frango desfiado, ovo, 2 hambúrgueres, 2 fatias de mussarela, batata palha, maionese, ketchup, tomate e alface.", preco: 40, adicionais: true },
    ],
  },
  {
    id: "especiais",
    nome: "Especiais da Casa",
    itens: [
      { id: "churrasco", nome: "Churrasco", desc: "Pão baguete, alcatra picada (170 g), bacon, mussarela, maionese de alho, ketchup, tomate e alface.", preco: 34, adicionais: true },
      { id: "costela-baguete", nome: "Costela na Baguete", desc: "Pão baguete, costela desfiada, mussarela, vinagrete e molho do chefe.", preco: 39, adicionais: true },
      { id: "x-alcatra", nome: "X-Alcatra", desc: "Pão, alcatra picada (170 g), 2 fatias de mussarela, maionese, alface e tomate.", preco: 31, adicionais: true },
      { id: "salada-caesar", nome: "Salada Caesar", desc: "Alface, queijo parmesão ralado, farofa de bacon, croutons, molho caesar e frango grelhado.", preco: 24 },
      { id: "lanche-raiz", nome: "Lanche Raiz", desc: "Pão, 2 salsichas, bacon, batata palha, milho, tomate, alface, ketchup, maionese e mostarda.", preco: 27, adicionais: true },
    ],
  },
  {
    id: "dog",
    nome: "Dog",
    itens: [
      { id: "hot-dog", nome: "Hot Dog", desc: "Pão de dog, salsicha, tomate, batata palha, maionese, ketchup e mostarda.", preco: 15, adicionais: true },
      { id: "dog-frango", nome: "Dog Frango", desc: "Pão de dog, salsicha, frango desfiado, tomate, maionese, ketchup e mostarda.", preco: 20, adicionais: true },
      { id: "dog-bacon", nome: "Dog Bacon", desc: "Pão de dog, salsicha, bacon, tomate, maionese, ketchup e mostarda.", preco: 24, adicionais: true },
      { id: "dog-frango-bacon", nome: "Dog Frango Bacon", desc: "Pão de dog, salsicha, frango desfiado, bacon, tomate, maionese, ketchup e mostarda.", preco: 26, adicionais: true },
      { id: "dog-bacon-queijo", nome: "Dog Bacon Queijo", desc: "Pão de dog, salsicha, bacon, mussarela, tomate, maionese, ketchup e mostarda.", preco: 26, adicionais: true },
      { id: "dog-frango-queijo", nome: "Dog Frango Queijo", desc: "Pão de dog, salsicha, frango desfiado, mussarela, tomate, maionese, ketchup e mostarda.", preco: 24, adicionais: true },
      { id: "dog-burguer", nome: "Dog Burguer", desc: "Pão de dog, salsicha, hambúrguer artesanal, tomate, maionese, ketchup e mostarda.", preco: 22, adicionais: true },
    ],
  },
  {
    id: "tradicional",
    nome: "Hambúrguer Tradicional",
    itens: [
      { id: "x-salada", nome: "X-Salada", desc: "Pão, hambúrguer, presunto, mussarela, maionese, ketchup, alface e tomate.", preco: 20, adicionais: true },
      { id: "x-bacon", nome: "X-Bacon", desc: "Pão, bacon, hambúrguer, presunto, mussarela, maionese, ketchup, alface e tomate.", preco: 27, adicionais: true },
      { id: "x-frango", nome: "X-Frango", desc: "Pão, frango desfiado, hambúrguer, presunto, mussarela, maionese, ketchup, alface e tomate.", preco: 25, adicionais: true },
      { id: "frango-especial", nome: "Frango Especial", desc: "Pão, filé de frango em cubos, catupiry, mussarela, maionese, alface e tomate.", preco: 29, adicionais: true },
      { id: "x-egg", nome: "X-Egg", desc: "Pão, hambúrguer, ovo, presunto, mussarela, alface, tomate, ketchup e maionese.", preco: 23, adicionais: true },
      { id: "x-tudo", nome: "X-Tudo", desc: "Pão, salsicha, bacon, calabresa, frango desfiado, ovo, hambúrguer, presunto, mussarela, batata palha, maionese, ketchup, alface e tomate.", preco: 34, adicionais: true },
      { id: "x-catupiry", nome: "X-Catupiry", desc: "Pão, frango desfiado, catupiry, hambúrguer, mussarela, batata palha, tomate, ketchup e maionese.", preco: 29, adicionais: true },
    ],
  },
  {
    id: "combos",
    nome: "Combos",
    itens: [
      { id: "combo-kids", nome: "Combo Xexéu Kids", desc: "Pão, hambúrguer, mussarela, maionese e ketchup + suco Kapo + batata P.", preco: 24 },
      { id: "combo-casal", nome: "Combo Casal", desc: "2 lanches à escolha (Burguer Salada ou Dog Frango) + refrigerante 600 ml.", preco: 50,
        escolhas: { quantidade: 2, rotulo: "Lanche", opcoes: ["Burguer Salada", "Dog Frango"] }, sabores: SABORES_REFRI, rotuloSabor: "Refrigerante 600 ml" },
      { id: "combo-3", nome: "Combo 3 Lanches", desc: "3 lanches à escolha (X-Salada, Hot Dog ou Dog Frango) + refrigerante Refriko 2 L.", preco: 60,
        escolhas: { quantidade: 3, rotulo: "Lanche", opcoes: ["X-Salada", "Hot Dog", "Dog Frango"] } },
      { id: "combo-4", nome: "Combo 4 Lanches", desc: "4 lanches à escolha (X-Salada, Hot Dog ou Dog Frango) + refrigerante Refriko 2 L.", preco: 75,
        escolhas: { quantidade: 4, rotulo: "Lanche", opcoes: ["X-Salada", "Hot Dog", "Dog Frango"] } },
    ],
  },
  {
    id: "acompanhamentos",
    nome: "Acompanhamentos",
    itens: [
      { id: "batata-p", nome: "Batata P", desc: "Porção pequena de batata frita.", preco: 9, molhos: true },
      { id: "batata-g", nome: "Batata G", desc: "Porção grande de batata frita.", preco: 12, molhos: true },
      { id: "aneis-cebola", nome: "Anéis de Cebola", desc: "Porção de anéis de cebola empanados.", preco: 12, molhos: true },
      { id: "batata-cheddar-bacon", nome: "Batata Cheddar e Bacon", desc: "Batata frita coberta com cheddar e bacon.", preco: 30, molhos: true },
      { id: "pastelzinho", nome: "Pastelzinho de Doce de Leite com Queijo", desc: "Sobremesa: pastelzinho recheado com doce de leite e queijo.", variantes: [{ nome: "1 unidade", preco: 4 }, { nome: "3 unidades", preco: 10.9 }] },
    ],
  },
  {
    id: "bebidas",
    nome: "Bebidas",
    itens: [
      { id: "refri-2l", nome: "Refrigerante 2 L", preco: 15, sabores: SABORES_REFRI },
      { id: "refri-600", nome: "Refrigerante 600 ml", preco: 9, sabores: SABORES_REFRI },
      { id: "refri-lata", nome: "Refrigerante Lata", preco: 7, sabores: SABORES_REFRI },
      { id: "agua", nome: "Água", variantes: [{ nome: "Sem gás", preco: 3 }, { nome: "Com gás", preco: 3 }] },
      { id: "suco-900", nome: "Suco Natural 900 ml", desc: "Abacaxi com hortelã, morango, maracujá ou uva.", preco: 15, somenteLocal: "Somente consumo no local" },
      { id: "suco-330", nome: "Suco Natural 330 ml", desc: "Abacaxi com hortelã, morango, maracujá ou uva.", preco: 9, somenteLocal: "Somente consumo no local" },
    ],
  },
];

/* Índice para achar um item pelo id. */
const ITENS_POR_ID = {};
for (const cat of CATEGORIAS) {
  for (const item of cat.itens) {
    item.categoria = cat.nome;
    ITENS_POR_ID[item.id] = item;
  }
}
