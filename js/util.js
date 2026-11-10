/* Funções auxiliares usadas pelos outros scripts. */
const Util = {
  moeda(valor) {
    return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  },

  escapar(texto) {
    return String(texto ?? "").replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
    })[c]);
  },

  $(seletor, raiz = document) {
    return raiz.querySelector(seletor);
  },

  // localStorage pode falhar (aba anônima, bloqueio); nunca deixa o site quebrar.
  ler(chave, padrao) {
    try {
      const v = localStorage.getItem(chave);
      return v ? JSON.parse(v) : padrao;
    } catch {
      return padrao;
    }
  },

  salvar(chave, valor) {
    try { localStorage.setItem(chave, JSON.stringify(valor)); } catch { /* ignora */ }
  },

  toast(msg) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("visivel");
    clearTimeout(Util._t);
    Util._t = setTimeout(() => el.classList.remove("visivel"), 2200);
  },

  travarRolagem(travar) {
    document.body.classList.toggle("travado", travar);
  },
};
