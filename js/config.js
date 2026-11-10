/*
 * Configurações da lanchonete.
 * Altere aqui telefone, WhatsApp, endereço, horários e taxa de entrega.
 */
const CONFIG = {
  nome: "Xexéu Lanches",

  // Número que recebe os pedidos no WhatsApp: código do país + DDD + número, só dígitos.
  // CONFIRMAR com a lanchonete qual número usa WhatsApp.
  whatsapp: "554333486860",

  telefone: "(43) 3348-6860",
  telefoneLink: "tel:+554333486860",

  endereco: "R. Osmy Muniz, 423 (esquina com a R. Tanzânia) · Ouro Verde, Londrina – PR, 86080-010",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Xex%C3%A9u+Lanches+R.+Osmy+Muniz+423+Londrina",

  // Taxa de entrega em reais. Deixe null para "a combinar" (o atendente informa pelo WhatsApp).
  taxaEntrega: null,

  // Fuso horário usado para saber se está aberto.
  fuso: "America/Sao_Paulo",

  // 0 = domingo ... 6 = sábado. Fechamento depois da meia-noite: use "24:00" ou mais (ex.: "24:30").
  horarios: {
    0: ["18:00", "23:00"],
    1: ["18:00", "23:00"],
    2: ["18:00", "23:30"],
    3: ["18:00", "23:30"],
    4: ["18:00", "23:30"],
    5: ["18:00", "23:30"],
    6: ["18:30", "24:00"],
  },
};

/*
 * Assinatura do desenvolvedor no rodapé.
 * O link usa o primeiro preenchido: WhatsApp, depois Instagram, depois o site.
 */
const DESENVOLVEDOR = {
  nome: "Zanluchi",
  whatsapp: "",  // só dígitos, ex.: "5543999999999"
  instagram: "", // só o usuário, sem @
  site: "https://github.com/Zanluchii",
  mensagem: "Olá! Vi o site da Xexéu Lanches e quero um site para o meu negócio.",
};
