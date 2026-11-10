/* Horário de funcionamento: status "aberto/fechado", tabela de horários e contatos. */
const Horario = (function () {
  const DIAS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

  const paraMin = (hhmm) => {
    const [h, m] = hhmm.split(":").map(Number);
    return h * 60 + m;
  };
  const formatar = (hhmm) => (paraMin(hhmm) >= 1440
    ? String(Math.floor((paraMin(hhmm) - 1440) / 60)).padStart(2, "0") + ":" + hhmm.split(":")[1]
    : hhmm);

  // Dia da semana e minutos de agora no fuso da lanchonete.
  function agora() {
    const partes = new Intl.DateTimeFormat("en-US", {
      timeZone: CONFIG.fuso, weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23",
    }).formatToParts(new Date());
    const p = Object.fromEntries(partes.map((x) => [x.type, x.value]));
    const dia = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(p.weekday);
    return { dia, min: Number(p.hour) * 60 + Number(p.minute) };
  }

  function status() {
    const { dia, min } = agora();
    const ontem = (dia + 6) % 7;
    const hOntem = CONFIG.horarios[ontem];
    // Ainda aberto do expediente de ontem (passou da meia-noite)?
    if (hOntem && paraMin(hOntem[1]) > 1440 && min < paraMin(hOntem[1]) - 1440) {
      return { aberto: true, texto: `Aberto · fecha às ${formatar(hOntem[1])}` };
    }
    const h = CONFIG.horarios[dia];
    if (h) {
      const [ab, fe] = h.map(paraMin);
      if (min >= ab && min < fe) return { aberto: true, texto: `Aberto · fecha às ${formatar(h[1])}` };
      if (min < ab) return { aberto: false, texto: `Fechado · abre hoje às ${h[0]}` };
    }
    for (let i = 1; i <= 7; i++) {
      const d = (dia + i) % 7;
      if (CONFIG.horarios[d]) {
        const quando = i === 1 ? "amanhã" : DIAS[d].toLowerCase();
        return { aberto: false, texto: `Fechado · abre ${quando} às ${CONFIG.horarios[d][0]}` };
      }
    }
    return { aberto: false, texto: "Fechado" };
  }

  function render() {
    const st = status();
    ["status-topo", "status-hero", "status-info"].forEach((id) => {
      const el = document.getElementById(id);
      el.textContent = st.texto;
      el.classList.toggle("aberto", st.aberto);
      el.classList.toggle("fechado", !st.aberto);
      el.hidden = false;
    });

    const hoje = agora().dia;
    const ordem = [1, 2, 3, 4, 5, 6, 0];
    document.getElementById("tabela-horarios").innerHTML = ordem.map((d) => {
      const h = CONFIG.horarios[d];
      return `<tr${d === hoje ? ' class="hoje"' : ""}><td>${DIAS[d]}</td><td>${h ? `${h[0]} – ${formatar(h[1])}` : "Fechado"}</td></tr>`;
    }).join("");
  }

  document.getElementById("info-endereco").textContent = CONFIG.endereco;
  document.getElementById("info-maps").href = CONFIG.mapsUrl;
  const tel = document.getElementById("info-telefone");
  tel.textContent = CONFIG.telefone;
  tel.href = CONFIG.telefoneLink;

  render();
  setInterval(render, 60 * 1000);

  return { status };
})();
