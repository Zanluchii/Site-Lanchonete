/* Carrinho: guarda os itens, mostra a gaveta e os contadores. */
const Carrinho = (function () {
  const CHAVE = "xexeu:carrinho";
  let itens = Util.ler(CHAVE, []);
  if (!Array.isArray(itens)) itens = [];

  const gaveta = document.getElementById("gaveta");
  const lista = document.getElementById("carrinho-itens");
  const vazio = document.getElementById("carrinho-vazio");
  const etapaCarrinho = document.getElementById("etapa-carrinho");
  const etapaCheckout = document.getElementById("etapa-checkout");
  const titulo = document.getElementById("gaveta-titulo");
  const voltar = document.getElementById("gaveta-voltar");
  const acao = document.getElementById("gaveta-acao");
  const resumo = document.getElementById("resumo");
  const rodape = document.getElementById("gaveta-rodape");
  const barra = document.getElementById("barra-carrinho");
  const btnTopo = document.getElementById("abrir-carrinho");

  let etapa = "carrinho";

  // Dois itens iguais (mesmas opções) viram um só, somando a quantidade.
  const assinatura = (i) => JSON.stringify([i.id, i.variante, i.escolhas, i.sabor, i.extras, i.obs]);

  function detalhes(i) {
    const partes = [];
    if (i.variante) partes.push(i.variante);
    if (i.escolhas && i.escolhas.length) partes.push(i.escolhas.join(", "));
    if (i.sabor) partes.push(i.sabor);
    i.extras.forEach((e) => partes.push("+ " + e.nome));
    if (i.obs) partes.push("Obs.: " + i.obs);
    return partes;
  }

  const quantidade = () => itens.reduce((s, i) => s + i.qtd, 0);
  const subtotal = () => itens.reduce((s, i) => s + i.precoUnit * i.qtd, 0);

  function salvar() {
    Util.salvar(CHAVE, itens);
    render();
  }

  function adicionar(novo) {
    const existente = itens.find((i) => assinatura(i) === assinatura(novo));
    if (existente) existente.qtd += novo.qtd;
    else itens.push(novo);
    salvar();
    btnTopo.classList.remove("pulo");
    void btnTopo.offsetWidth;
    btnTopo.classList.add("pulo");
  }

  function alterar(indice, delta) {
    const i = itens[indice];
    if (!i) return;
    i.qtd += delta;
    if (i.qtd <= 0) itens.splice(indice, 1);
    salvar();
  }

  function limpar() {
    itens = [];
    salvar();
  }

  function renderResumo() {
    if (etapa === "checkout") return; // a finalização desenha o próprio resumo
    resumo.innerHTML = `
      <div class="resumo__total"><span>Subtotal</span><span>${Util.moeda(subtotal())}</span></div>
      <div class="resumo__nota"><span>Taxa de entrega calculada na próxima etapa</span></div>`;
  }

  function render() {
    const qtd = quantidade();
    document.getElementById("carrinho-qtd-topo").textContent = qtd;
    document.getElementById("barra-qtd").textContent = qtd;
    document.getElementById("barra-total").textContent = Util.moeda(subtotal());
    barra.hidden = qtd === 0 || !gaveta.hidden;

    vazio.hidden = itens.length > 0;
    rodape.hidden = itens.length === 0;
    lista.innerHTML = itens.map((i, idx) => `
      <li>
        <span class="itens__nome">${Util.escapar(i.nome)}</span>
        <span class="itens__preco">${Util.moeda(i.precoUnit * i.qtd)}</span>
        ${detalhes(i).length ? `<p class="itens__det">${detalhes(i).map(Util.escapar).join(" · ")}</p>` : ""}
        <div class="itens__acoes">
          <div class="qtd qtd--mini">
            <button type="button" class="qtd__btn" data-idx="${idx}" data-delta="-1" aria-label="Diminuir">−</button>
            <span class="qtd__valor">${i.qtd}</span>
            <button type="button" class="qtd__btn" data-idx="${idx}" data-delta="1" aria-label="Aumentar">+</button>
          </div>
          <button type="button" class="itens__remover" data-idx="${idx}" data-delta="-${i.qtd}">Remover</button>
        </div>
      </li>`).join("");

    if (itens.length === 0 && etapa === "checkout") mostrarEtapa("carrinho");
    renderResumo();
  }

  function mostrarEtapa(nova) {
    etapa = nova;
    const noCheckout = etapa === "checkout";
    etapaCarrinho.hidden = noCheckout;
    etapaCheckout.hidden = !noCheckout;
    voltar.hidden = !noCheckout;
    titulo.textContent = noCheckout ? "Finalizar pedido" : "Seu pedido";
    acao.textContent = noCheckout ? "Enviar pedido pelo WhatsApp" : "Continuar";
    if (noCheckout) Checkout.mostrar();
    else renderResumo();
    gaveta.querySelector(".gaveta__conteudo:not([hidden])").scrollTop = 0;
  }

  function abrirGaveta() {
    gaveta.hidden = false;
    Util.travarRolagem(true);
    mostrarEtapa("carrinho");
    render();
  }

  function fecharGaveta() {
    gaveta.hidden = true;
    Util.travarRolagem(false);
    render();
  }

  lista.addEventListener("click", (e) => {
    const b = e.target.closest("[data-idx]");
    if (b) alterar(Number(b.dataset.idx), Number(b.dataset.delta));
  });
  btnTopo.addEventListener("click", abrirGaveta);
  barra.addEventListener("click", abrirGaveta);
  voltar.addEventListener("click", () => mostrarEtapa("carrinho"));
  gaveta.addEventListener("click", (e) => { if (e.target.closest("[data-fechar-gaveta]")) fecharGaveta(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !gaveta.hidden) fecharGaveta(); });
  acao.addEventListener("click", () => {
    if (etapa === "carrinho") mostrarEtapa("checkout");
    else Checkout.enviar();
  });

  render();

  return {
    adicionar, limpar, detalhes, subtotal, quantidade, fecharGaveta,
    itens: () => itens,
    renderResumo: (html) => { resumo.innerHTML = html; },
  };
})();
