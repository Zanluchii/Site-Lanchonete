/* Link da assinatura do desenvolvedor no rodapé (configurado em js/config.js). */
(function () {
  const link = document.getElementById("assinatura");
  if (!link || typeof DESENVOLVEDOR === "undefined") return;
  const d = DESENVOLVEDOR;
  if (d.whatsapp) {
    link.href = `https://wa.me/${d.whatsapp}?text=${encodeURIComponent(d.mensagem)}`;
  } else if (d.instagram) {
    link.href = `https://instagram.com/${d.instagram}`;
  } else if (d.site) {
    link.href = d.site;
  }
  link.setAttribute("aria-label", `Site desenvolvido por ${d.nome}. Quer um site assim? Fale comigo.`);
})();
