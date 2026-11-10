/* Monta as abas de categorias e a lista de itens do cardápio. */
(function () {
  const trilho = document.getElementById("categorias-trilho");
  const lista = document.getElementById("cardapio-lista");

  function precoDoItem(item) {
    if (item.variantes) {
      const menor = Math.min(...item.variantes.map((v) => v.preco));
      const iguais = item.variantes.every((v) => v.preco === menor);
      return iguais
        ? Util.moeda(menor)
        : `<small>a partir de</small>${Util.moeda(menor)}`;
    }
    return Util.moeda(item.preco);
  }

  function cartao(item) {
    const indisponivel = Boolean(item.somenteLocal);
    const tag = indisponivel
      ? `<span class="item__tag">${Util.escapar(item.somenteLocal)}</span>`
      : item.variantes && item.variantes.some((v) => v.nome === "Duplo")
        ? `<span class="item__tag">Duplo: ${Util.moeda(item.variantes[1].preco)}</span>`
        : "";
    return `
      <button class="item${indisponivel ? " item--indisponivel" : ""}" data-id="${item.id}" ${indisponivel ? 'aria-disabled="true"' : ""}>
        <div class="item__info">
          <h3 class="item__nome">${Util.escapar(item.nome)}</h3>
          ${item.desc ? `<p class="item__desc">${Util.escapar(item.desc)}</p>` : ""}
          ${tag}
        </div>
        <div class="item__lado">
          <span class="item__preco">${precoDoItem(item)}</span>
          <span class="item__mais" aria-hidden="true">+</span>
        </div>
      </button>`;
  }

  trilho.innerHTML = CATEGORIAS.map(
    (c) => `<a href="#cat-${c.id}" data-cat="${c.id}">${Util.escapar(c.nome)}</a>`
  ).join("");

  lista.innerHTML = CATEGORIAS.map((c) => `
    <section class="secao" id="cat-${c.id}">
      <h2 class="secao__titulo">${Util.escapar(c.nome)}</h2>
      ${c.nota ? `<p class="secao__nota">${c.nota}</p>` : ""}
      <div class="grade">${c.itens.map(cartao).join("")}</div>
    </section>`).join("");

  lista.addEventListener("click", (e) => {
    const botao = e.target.closest(".item");
    if (!botao) return;
    const item = ITENS_POR_ID[botao.dataset.id];
    if (item.somenteLocal) {
      Util.toast(`${item.nome}: ${item.somenteLocal.toLowerCase()}`);
      return;
    }
    Produto.abrir(item);
  });

  // Destaca a categoria visível e mantém a aba ativa à vista no trilho.
  const links = [...trilho.querySelectorAll("a")];
  function ativar(id) {
    links.forEach((a) => {
      const ativa = a.dataset.cat === id;
      a.classList.toggle("ativa", ativa);
      if (ativa) {
        trilho.scrollTo({ left: a.offsetLeft - 16, behavior: "smooth" });
      }
    });
  }

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((en) => {
        if (en.isIntersecting) ativar(en.target.id.replace("cat-", ""));
      });
    },
    { rootMargin: "-130px 0px -60% 0px" }
  );
  document.querySelectorAll(".secao").forEach((s) => observador.observe(s));
})();
