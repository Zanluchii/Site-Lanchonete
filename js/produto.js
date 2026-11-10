/* Modal do produto: variação, escolhas de combo, adicionais, molhos, observação e quantidade. */
const Produto = (function () {
  const modal = document.getElementById("modal-produto");
  const form = document.getElementById("form-produto");
  const opcoes = document.getElementById("produto-opcoes");
  const campoObs = document.getElementById("produto-obs");
  const elQtd = document.getElementById("produto-qtd");
  const btnMenos = document.getElementById("produto-menos");
  const elTotal = document.getElementById("produto-total");

  let item = null;
  let qtd = 1;

  function opcaoHtml({ tipo, nome, valor, rotulo, preco, marcado }) {
    return `
      <label class="opcao">
        <input type="${tipo}" name="${nome}" value="${Util.escapar(valor)}" ${marcado ? "checked" : ""}>
        <span class="opcao__nome">${Util.escapar(rotulo)}</span>
        ${preco != null ? `<span class="opcao__preco">${preco}</span>` : ""}
      </label>`;
  }

  function grupo(titulo, dica, conteudo, obrigatorio) {
    return `
      <fieldset class="grupo">
        <legend class="grupo__titulo">
          <span>${titulo}</span>
          <small${obrigatorio ? ' class="obrigatorio"' : ""}>${dica}</small>
        </legend>
        ${conteudo}
      </fieldset>`;
  }

  function montarOpcoes() {
    let html = "";

    if (item.variantes) {
      html += grupo("Escolha uma opção", "Obrigatório",
        item.variantes.map((v, i) => opcaoHtml({
          tipo: "radio", nome: "variante", valor: i, rotulo: v.nome,
          preco: Util.moeda(v.preco), marcado: i === 0,
        })).join(""), true);
    }

    if (item.escolhas) {
      const { quantidade, rotulo, opcoes: lista } = item.escolhas;
      let selects = "";
      for (let i = 0; i < quantidade; i++) {
        selects += `
          <label class="escolha">
            <span>${rotulo} ${i + 1}</span>
            <select name="escolha">${lista.map((o) => `<option>${Util.escapar(o)}</option>`).join("")}</select>
          </label>`;
      }
      html += grupo(`Escolha os ${quantidade} lanches`, "Obrigatório", selects, true);
    }

    if (item.sabores) {
      html += grupo(item.rotuloSabor || "Sabor", "Obrigatório",
        item.sabores.map((s, i) => opcaoHtml({
          tipo: "radio", nome: "sabor", valor: s, rotulo: s, marcado: i === 0,
        })).join(""), true);
    }

    if (item.adicionais) {
      html += grupo("Turbine seu lanche", "Opcional",
        ADICIONAIS.map((a) => opcaoHtml({
          tipo: "checkbox", nome: "adicional", valor: a.id, rotulo: a.nome,
          preco: "+ " + Util.moeda(a.preco),
        })).join(""));
    }

    if (item.adicionais || item.molhos) {
      html += grupo("Molhos adicionais", "Opcional",
        MOLHOS.map((m) => opcaoHtml({
          tipo: "checkbox", nome: "molho", valor: m.id, rotulo: m.nome,
          preco: "+ " + Util.moeda(m.preco),
        })).join(""));
    }

    opcoes.innerHTML = html;
  }

  function ler() {
    const dados = new FormData(form);
    const variante = item.variantes ? item.variantes[Number(dados.get("variante"))] : null;
    const extras = [
      ...dados.getAll("adicional").map((id) => ADICIONAIS.find((a) => a.id === id)),
      ...dados.getAll("molho").map((id) => MOLHOS.find((m) => m.id === id)),
    ];
    const base = variante ? variante.preco : item.preco;
    const precoUnit = base + extras.reduce((s, e) => s + e.preco, 0);

    return {
      id: item.id,
      nome: item.nome,
      variante: variante ? variante.nome : null,
      escolhas: dados.getAll("escolha"),
      sabor: dados.get("sabor"),
      extras: extras.map((e) => ({ nome: e.nome, preco: e.preco })),
      obs: campoObs.value.trim(),
      precoUnit,
      qtd,
    };
  }

  function atualizar() {
    elQtd.textContent = qtd;
    btnMenos.disabled = qtd <= 1;
    elTotal.textContent = "· " + Util.moeda(ler().precoUnit * qtd);
  }

  function abrir(novoItem) {
    item = novoItem;
    qtd = 1;
    form.reset();
    document.getElementById("produto-categoria").textContent = item.categoria;
    document.getElementById("produto-nome").textContent = item.nome;
    const desc = document.getElementById("produto-desc");
    desc.textContent = [item.desc, item.inclui].filter(Boolean).join(" ");
    desc.hidden = !desc.textContent;
    montarOpcoes();
    atualizar();
    modal.hidden = false;
    Util.travarRolagem(true);
    modal.querySelector(".produto__corpo").scrollTop = 0;
    modal.querySelector(".modal__fechar").focus();
  }

  function fechar() {
    modal.hidden = true;
    Util.travarRolagem(false);
  }

  form.addEventListener("change", atualizar);
  btnMenos.addEventListener("click", () => { if (qtd > 1) { qtd--; atualizar(); } });
  document.getElementById("produto-mais").addEventListener("click", () => { if (qtd < 50) { qtd++; atualizar(); } });
  modal.addEventListener("click", (e) => { if (e.target.closest("[data-fechar]")) fechar(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !modal.hidden) fechar(); });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    Carrinho.adicionar(ler());
    fechar();
    Util.toast(`${qtd}× ${item.nome} adicionado ao pedido`);
  });

  return { abrir, fechar };
})();
