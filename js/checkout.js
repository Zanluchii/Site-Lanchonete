/* Finalização: dados do cliente, entrega/retirada, pagamento e envio pelo WhatsApp. */
const Checkout = (function () {
  const CHAVE = "xexeu:cliente";
  const form = document.getElementById("etapa-checkout");
  let montado = false;

  const salvo = Util.ler(CHAVE, {});

  function campo(nome, rotulo, attrs = "", valor = "") {
    return `
      <label class="campo" data-campo="${nome}">
        <span class="campo__rotulo">${rotulo}</span>
        <input name="${nome}" value="${Util.escapar(valor)}" ${attrs}>
      </label>`;
  }

  function montar() {
    form.innerHTML = `
      <p class="alerta alerta--vermelho" id="aviso-fechado" hidden></p>

      ${campo("nome", "Seu nome", 'autocomplete="name" required maxlength="60"', salvo.nome)}
      ${campo("telefone", 'Telefone <small>(opcional)</small>', 'type="tel" autocomplete="tel" inputmode="tel" maxlength="20" placeholder="(43) 9 9999-9999"', salvo.telefone)}

      <p class="checkout__titulo">Como quer receber?</p>
      <div class="segmento">
        <label><input type="radio" name="tipo" value="entrega" ${salvo.tipo !== "retirada" ? "checked" : ""}>Entrega<small>no seu endereço</small></label>
        <label><input type="radio" name="tipo" value="retirada" ${salvo.tipo === "retirada" ? "checked" : ""}>Retirada<small>no balcão</small></label>
      </div>

      <div id="bloco-endereco">
        <div class="linha-campos">
          ${campo("rua", "Rua", 'autocomplete="address-line1" maxlength="80"', salvo.rua)}
          ${campo("numero", "Número", 'inputmode="numeric" maxlength="10"', salvo.numero)}
        </div>
        ${campo("bairro", "Bairro", 'maxlength="60"', salvo.bairro)}
        ${campo("complemento", 'Complemento / referência <small>(opcional)</small>', 'maxlength="80" placeholder="Apto, bloco, ponto de referência"', salvo.complemento)}
      </div>
      <p class="alerta" id="bloco-retirada" hidden></p>

      <p class="checkout__titulo">Forma de pagamento</p>
      <div class="segmento segmento--3">
        <label><input type="radio" name="pagamento" value="Pix" ${salvo.pagamento === "Pix" || !salvo.pagamento ? "checked" : ""}>Pix</label>
        <label><input type="radio" name="pagamento" value="Cartão" ${salvo.pagamento === "Cartão" ? "checked" : ""}>Cartão<small>na entrega</small></label>
        <label><input type="radio" name="pagamento" value="Dinheiro" ${salvo.pagamento === "Dinheiro" ? "checked" : ""}>Dinheiro</label>
      </div>
      <div id="bloco-troco" hidden>
        ${campo("troco", 'Troco para quanto? <small>(deixe vazio se não precisar)</small>', 'inputmode="decimal" maxlength="10" placeholder="Ex.: 100"')}
      </div>

      <label class="campo">
        <span class="campo__rotulo">Observação do pedido <small>(opcional)</small></span>
        <textarea name="obs" rows="2" maxlength="200" placeholder="Algo mais que precisamos saber?"></textarea>
      </label>`;

    form.addEventListener("change", atualizar);
    form.addEventListener("input", (e) => {
      const c = e.target.closest(".campo");
      if (c) limparErro(c);
    });
    form.addEventListener("submit", (e) => { e.preventDefault(); enviar(); });
    montado = true;
  }

  const valor = (nome) => (form.elements[nome]?.value || "").trim();

  function taxa() {
    return valor("tipo") === "entrega" && typeof CONFIG.taxaEntrega === "number" ? CONFIG.taxaEntrega : 0;
  }

  function atualizar() {
    const entrega = valor("tipo") === "entrega";
    document.getElementById("bloco-endereco").hidden = !entrega;
    const retirada = document.getElementById("bloco-retirada");
    retirada.hidden = entrega;
    retirada.textContent = "Retirar em: " + CONFIG.endereco;
    document.getElementById("bloco-troco").hidden = valor("pagamento") !== "Dinheiro";

    const aviso = document.getElementById("aviso-fechado");
    const st = Horario.status();
    aviso.hidden = st.aberto;
    aviso.textContent = `Estamos fechados agora (${st.texto.toLowerCase()}). Você pode enviar o pedido, mas ele só será atendido quando abrirmos.`;

    const sub = Carrinho.subtotal();
    const linhaTaxa = !entrega
      ? `<div><span>Retirada no local</span><span>grátis</span></div>`
      : typeof CONFIG.taxaEntrega === "number"
        ? `<div><span>Taxa de entrega</span><span>${Util.moeda(CONFIG.taxaEntrega)}</span></div>`
        : `<div class="resumo__nota"><span>Taxa de entrega</span><span>informada pelo WhatsApp</span></div>`;
    Carrinho.renderResumo(`
      <div><span>Subtotal (${Carrinho.quantidade()} ${Carrinho.quantidade() === 1 ? "item" : "itens"})</span><span>${Util.moeda(sub)}</span></div>
      ${linhaTaxa}
      <div class="resumo__total"><span>Total</span><span>${Util.moeda(sub + taxa())}</span></div>`);
  }

  function erro(nome, msg) {
    const c = form.querySelector(`[data-campo="${nome}"]`);
    c.classList.add("campo--erro");
    if (!c.querySelector(".campo__erro")) {
      c.insertAdjacentHTML("beforeend", `<span class="campo__erro">${msg}</span>`);
    }
    return c;
  }

  function limparErro(c) {
    c.classList.remove("campo--erro");
    c.querySelector(".campo__erro")?.remove();
  }

  function validar() {
    form.querySelectorAll(".campo--erro").forEach(limparErro);
    const erros = [];
    if (valor("nome").length < 2) erros.push(erro("nome", "Informe seu nome"));
    if (valor("tipo") === "entrega") {
      if (!valor("rua")) erros.push(erro("rua", "Informe a rua"));
      if (!valor("numero")) erros.push(erro("numero", "Nº"));
      if (!valor("bairro")) erros.push(erro("bairro", "Informe o bairro"));
    }
    if (valor("pagamento") === "Dinheiro" && valor("troco")) {
      const troco = Number(valor("troco").replace(/[^\d,.]/g, "").replace(",", "."));
      if (!troco || troco < Carrinho.subtotal() + taxa()) {
        erros.push(erro("troco", "O troco deve ser maior que o total do pedido"));
      }
    }
    if (erros.length) {
      erros[0].scrollIntoView({ behavior: "smooth", block: "center" });
      erros[0].querySelector("input")?.focus({ preventScroll: true });
      return false;
    }
    return true;
  }

  function mensagem() {
    const linhas = [];
    linhas.push(`*Novo pedido · ${CONFIG.nome}*`, "");
    Carrinho.itens().forEach((i) => {
      linhas.push(`*${i.qtd}x ${i.nome}* · ${Util.moeda(i.precoUnit * i.qtd)}`);
      Carrinho.detalhes(i).forEach((d) => linhas.push(`   - ${d}`));
    });
    linhas.push("");
    const sub = Carrinho.subtotal();
    linhas.push(`Subtotal: ${Util.moeda(sub)}`);
    if (valor("tipo") === "entrega") {
      linhas.push(typeof CONFIG.taxaEntrega === "number"
        ? `Taxa de entrega: ${Util.moeda(CONFIG.taxaEntrega)}`
        : "Taxa de entrega: a informar");
    }
    linhas.push(`*Total: ${Util.moeda(sub + taxa())}*`, "");

    linhas.push(`*Cliente:* ${valor("nome")}`);
    if (valor("telefone")) linhas.push(`*Telefone:* ${valor("telefone")}`);
    if (valor("tipo") === "entrega") {
      linhas.push("*Entrega em:*");
      linhas.push(`${valor("rua")}, ${valor("numero")} · ${valor("bairro")}`);
      if (valor("complemento")) linhas.push(valor("complemento"));
    } else {
      linhas.push("*Retirada no local*");
    }
    let pag = `*Pagamento:* ${valor("pagamento")}`;
    if (valor("pagamento") === "Dinheiro") {
      pag += valor("troco") ? ` (troco para R$ ${valor("troco")})` : " (sem troco)";
    }
    linhas.push(pag);
    if (valor("obs")) linhas.push(`*Obs.:* ${valor("obs")}`);
    return linhas.join("\n");
  }

  function enviar() {
    if (!Carrinho.itens().length) return;
    if (!validar()) return;

    Util.salvar(CHAVE, {
      nome: valor("nome"), telefone: valor("telefone"), tipo: valor("tipo"),
      rua: valor("rua"), numero: valor("numero"), bairro: valor("bairro"),
      complemento: valor("complemento"), pagamento: valor("pagamento"),
    });

    const url = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem())}`;
    window.open(url, "_blank", "noopener");
    Carrinho.limpar();
    Carrinho.fecharGaveta();
    document.dispatchEvent(new CustomEvent("pedido-enviado", { detail: { nome: valor("nome") } }));
  }

  function mostrar() {
    if (!montado) montar();
    atualizar();
  }

  return { mostrar, enviar, mensagem };
})();
