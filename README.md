# Site Xexéu Lanches

Site de cardápio e pedidos da **Xexéu Lanches** (Ouro Verde, Londrina – PR, desde 1999).

O cliente monta o pedido no site e envia tudo pronto para o WhatsApp da lanchonete: itens, adicionais, observações, endereço e forma de pagamento.

## Funcionalidades

- Cardápio completo por categoria: Hambúrguer Artesanal, Especiais da Casa, Dog, Hambúrguer Tradicional, Combos, Acompanhamentos e Bebidas
- Opção simples/duplo nos artesanais
- "Turbine seu lanche" (adicionais) e molhos adicionais com preço somado na hora
- Combos com escolha de cada lanche
- Observação por item (ex.: "sem tomate")
- Carrinho salvo no navegador
- Entrega ou retirada, pagamento em Pix, cartão ou dinheiro (com troco)
- Aviso de aberto/fechado de acordo com o horário de funcionamento
- Layout pensado primeiro para celular

## Como rodar

É um site estático (HTML, CSS e JavaScript puro), sem instalação. Basta abrir o `index.html` no navegador.

Para publicar de graça, dá para usar o **GitHub Pages**: em *Settings → Pages*, escolha a branch `main` e a pasta `/ (root)`.

## Onde editar

| O que mudar | Arquivo |
| --- | --- |
| Número do WhatsApp, telefone, endereço, horários, taxa de entrega | `js/config.js` |
| Lanches, preços, descrições, adicionais, molhos, sabores de refrigerante | `js/dados.js` |
| Cores e visual | `css/style.css` (variáveis no topo do arquivo) |

## Estrutura

```
index.html        página
css/style.css     estilos
js/config.js      dados da lanchonete
js/dados.js       cardápio
js/util.js        funções auxiliares
js/cardapio.js    lista do cardápio e abas de categoria
js/produto.js     janela do produto (opções, adicionais, quantidade)
js/carrinho.js    carrinho
js/checkout.js    finalização e envio pelo WhatsApp
js/horario.js     aberto/fechado e tabela de horários
```
