/* Efeitos: revelar ao rolar, contadores, barra de progresso, lanche voando e comemoração. */
(function () {
  const semMovimento = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.documentElement.classList.add("js-efeitos");

  /* ---------- Revelar elementos ao rolar ---------- */
  const revelar = new IntersectionObserver((entradas) => {
    entradas.forEach((en) => {
      if (en.isIntersecting) {
        en.target.classList.add("visivel");
        revelar.unobserve(en.target);
      }
    });
  }, { rootMargin: "0px 0px -8% 0px", threshold: 0.05 });
  document.querySelectorAll("[data-revelar]").forEach((el) => revelar.observe(el));

  /* ---------- Contadores do topo ---------- */
  const anos = new Date().getFullYear() - 1999;
  function contar(el) {
    const alvo = el.dataset.contar === "anos" ? anos : Number(el.dataset.contar);
    const casas = Number(el.dataset.decimais || 0);
    const sufixo = el.dataset.sufixo || "";
    const fmt = (v) => v.toLocaleString("pt-BR", { minimumFractionDigits: casas, maximumFractionDigits: casas }) + sufixo;
    if (semMovimento) { el.textContent = fmt(alvo); return; }
    const dur = 1600;
    const ini = performance.now();
    (function passo(t) {
      const p = Math.min(1, (t - ini) / dur);
      const suave = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(casas ? alvo * suave : Math.round(alvo * suave));
      if (p < 1) requestAnimationFrame(passo);
    })(ini);
  }
  setTimeout(() => document.querySelectorAll("[data-contar]").forEach(contar), 700);

  /* ---------- Topo: progresso da rolagem ---------- */
  const topo = document.getElementById("topo");
  const progresso = document.getElementById("progresso");
  let agendado = false;
  function aoRolar() {
    agendado = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    progresso.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    topo.classList.toggle("rolou", scrollY > 10);
  }
  addEventListener("scroll", () => {
    if (!agendado) { agendado = true; requestAnimationFrame(aoRolar); }
  }, { passive: true });
  aoRolar();

  /* ---------- Faixa rolante sem buracos em telas largas ---------- */
  const trilho = document.querySelector(".faixa__trilho");
  if (trilho) {
    const modelo = trilho.firstElementChild.cloneNode(true);
    function encherFaixa() {
      trilho.replaceChildren(modelo.cloneNode(true));
      const largura = trilho.firstElementChild.getBoundingClientRect().width || 1;
      // Metade do trilho precisa cobrir a tela inteira para o loop não abrir espaço.
      const copias = Math.max(2, 2 * Math.ceil(innerWidth / largura));
      for (let i = 1; i < copias; i++) trilho.appendChild(modelo.cloneNode(true));
      trilho.style.animationDuration = `${(largura * copias / 2) / 45}s`; // ~45 px/s
    }
    encherFaixa();
    let t;
    addEventListener("resize", () => { clearTimeout(t); t = setTimeout(encherFaixa, 200); });
    if (document.fonts) document.fonts.ready.then(encherFaixa);
  }

  /* ---------- Telefone na faixa de delivery ---------- */
  const tel = document.getElementById("delivery-telefone");
  if (tel) tel.href = CONFIG.telefoneLink;

  /* ---------- Lanche voando até o carrinho ---------- */
  const emojiPorCategoria = Object.fromEntries(CATEGORIAS.map((c) => [c.nome, c.icone || "🍔"]));
  document.addEventListener("submit", (e) => {
    if (e.target.id !== "form-produto" || semMovimento) return;
    const origem = document.getElementById("produto-adicionar").getBoundingClientRect();
    const categoria = document.getElementById("produto-categoria").textContent;
    // Executa depois que o modal fecha, para o carrinho estar visível.
    requestAnimationFrame(() => voar(origem, emojiPorCategoria[categoria] || "🍔"));
  }, true);

  function voar(origem, emoji) {
    const barra = document.getElementById("barra-carrinho");
    const destinoEl = !barra.hidden && innerWidth < 720 ? barra : document.getElementById("abrir-carrinho");
    const destino = destinoEl.getBoundingClientRect();
    const el = document.createElement("span");
    el.className = "voador";
    el.textContent = emoji;
    document.body.appendChild(el);

    const x0 = origem.left + origem.width / 2 - 16;
    const y0 = origem.top + origem.height / 2 - 16;
    const x1 = destino.left + destino.width / 2 - 16;
    const y1 = destino.top + destino.height / 2 - 16;
    const pico = Math.min(y0, y1) - 120;

    const anim = el.animate([
      { transform: `translate(${x0}px, ${y0}px) scale(1) rotate(0deg)` },
      { transform: `translate(${(x0 + x1) / 2}px, ${pico}px) scale(1.5) rotate(-200deg)`, offset: 0.45 },
      { transform: `translate(${x1}px, ${y1}px) scale(.4) rotate(-360deg)`, opacity: 0.6 },
    ], { duration: 750, easing: "cubic-bezier(.45, 0, .55, 1)" });
    anim.onfinish = () => {
      el.remove();
      destinoEl.classList.remove("pulo");
      void destinoEl.offsetWidth;
      destinoEl.classList.add("pulo");
    };
  }

  /* ---------- Comemoração ao enviar o pedido ---------- */
  const festa = document.getElementById("festa");
  const fecharFesta = () => { festa.hidden = true; Util.travarRolagem(false); };
  document.getElementById("festa-fechar").addEventListener("click", fecharFesta);
  festa.addEventListener("click", (e) => { if (e.target === festa) fecharFesta(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !festa.hidden) fecharFesta(); });

  document.addEventListener("pedido-enviado", (e) => {
    const nome = (e.detail && e.detail.nome || "").split(" ")[0];
    document.getElementById("festa-titulo").textContent = nome ? `Valeu, ${nome}!` : "Pedido enviado!";
    festa.hidden = false;
    Util.travarRolagem(true);
    document.getElementById("festa-fechar").focus();
    if (!semMovimento) confete();
  });

  function confete() {
    const cores = ["#c8201a", "#ffc629", "#ffffff", "#e4572e", "#1d1a17"];
    for (let i = 0; i < 90; i++) {
      const c = document.createElement("span");
      c.className = "confete";
      c.style.background = cores[i % cores.length];
      festa.insertBefore(c, festa.firstChild);
      const x = innerWidth / 2 + (Math.random() - 0.5) * 80;
      const y = innerHeight / 2;
      const dx = (Math.random() - 0.5) * innerWidth * 1.1;
      const dy = -Math.random() * innerHeight * 0.6 - 80;
      const giro = (Math.random() - 0.5) * 1440;
      c.animate([
        { transform: `translate(${x}px, ${y}px) rotate(0deg)`, opacity: 1 },
        { transform: `translate(${x + dx * 0.7}px, ${y + dy}px) rotate(${giro / 2}deg)`, opacity: 1, offset: 0.4 },
        { transform: `translate(${x + dx}px, ${innerHeight + 40}px) rotate(${giro}deg)`, opacity: 0.8 },
      ], { duration: 1800 + Math.random() * 1200, easing: "cubic-bezier(.2, .6, .4, 1)" })
        .onfinish = () => c.remove();
    }
  }
})();
