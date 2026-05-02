/* ════════════════════════════════════════════════════════════════
   GUERRA DOS REINOS — Motor JS · v2
   Engine de cálculo + renderização (portal e página de jogador)
   ════════════════════════════════════════════════════════════════ */

/* ─── Configuração base de imagens ─── */
const IMG_BASE = 'https://cdn.jsdelivr.net/gh/andersonlluna/guerra-dos-reinos-titulos@main/imagens';
const IMG_EXT  = 'jpg';   // troque para 'png' se necessário

/* ─── Tabelas de pontuação (step function) ─── */
const PONTOS = {
  mvp:         [[15,200],[10,135],[7,95],[5,65],[3,40],[2,20],[1,10]],
  mitada:      [[10,100],[7,70],[5,45],[3,23],[2,10],[1,5]],
  podio:       [[15,75],[10,45],[8,34],[5,20],[4,12],[3,9],[2,6],[1,3]],
  recuperacao: [[7,96],[5,65],[3,36],[2,16],[1,8]],
  massacre:    [[7,62],[5,40],[3,22],[2,12],[1,6]],
  lanterna:    [[10,-100],[7,-70],[5,-45],[3,-23],[2,-10],[1,-5]],
};
const G2_THRESHOLDS = [[110,14],[100,8],[90,4]];
const PRIORIDADE = ['mvp','mitada','recuperacao','massacre','podio','lanterna'];
const PRIMEIRA_RODADA_VALIDA = 6;

/* ─── Tabelas de títulos progressivos (marco → nome) ─── */
const TITULOS = {
  mvp: [
    [15,'Portador de Glamdring'],
    [10,'O Rei que Voltou'],
    [7,'Rei Coroado de Gondor'],
    [5,'Herdeiro de Isildur'],
    [3,'Senhor dos Cavaleiros de Rohan'],
    [1,'Cavaleiro da Companhia'],
  ],
  mitada: [
    [10,'Portador da Espada de Fogo'],
    [7,'Portador da Garra Longa'],
    [5,'Cavaleiro do Amanhecer'],
    [3,'Empunhador de Andúril'],
    [1,'Portador da Ferroada'],
  ],
  recuperacao: [
    [7,'Ressurgido das Trevas'],
    [5,'Jon Snow Ressuscitado'],
    [3,'Renascido no Fogo'],
    [1,'Cavaleiro do Corvo Branco'],
  ],
  massacre: [
    [7,'Terror de Westeros'],
    [5,'Flagelo dos Reinos'],
    [3,'O Senhor do Aço Negro'],
    [1,'Conquistador de Terras'],
  ],
  podio: [
    [15,'Protetor dos Sete Reinos'],
    [10,'Mão do Rei'],
    [8,'Lorde Comandante da Muralha'],
    [5,'Cavaleiro da Guarda Real'],
    [1,'Guardião da Torre Branca'],
  ],
  lanterna: [
    [10,'Rei da Noite Eterna'],
    [7,'Prisioneiro de Mordor'],
    [5,'Servo de Sauron'],
    [3,'Habitante das Terras Sombrias'],
    [1,'Banido para o Exílio'],
  ],
};

/* ─── Mapeamento (categoria, marco) → número do arquivo (01-30) ─── */
const CARD_NUM = {
  inicial:     { 0: 1 },
  mvp:         { 1: 2,  3: 3,  5: 4,  7: 5,  10: 6,  15: 7  },
  podio:       { 1: 8,  5: 9,  8: 10, 10: 11, 15: 12 },
  mitada:      { 1: 13, 3: 14, 5: 15, 7: 16, 10: 17 },
  massacre:    { 1: 18, 3: 19, 5: 20, 7: 21 },
  recuperacao: { 1: 22, 3: 23, 5: 24, 7: 25 },
  lanterna:    { 1: 26, 3: 27, 5: 28, 7: 29, 10: 30 },
};

/* ─── Prêmios Finais (31-38) ─── */
const PREMIOS_FINAIS = [
  { id:'imperador',      num:31, nome:'Imperador dos Sete Reinos',     desc:'1º lugar geral ao final da temporada',      grupo:'podio'    },
  { id:'principe',       num:32, nome:'Príncipe de Pedra do Dragão',   desc:'2º lugar geral ao final da temporada',      grupo:'podio'    },
  { id:'senhor_winter',  num:33, nome:'Senhor de Winterfell',          desc:'3º lugar geral ao final da temporada',      grupo:'podio'    },
  { id:'esquecido',      num:34, nome:'O Esquecido pelas Crônicas',    desc:'Último lugar geral ao final da temporada',  grupo:'podio'    },
  { id:'rei_gondor',     num:35, nome:'Rei de Gondor',                 desc:'1º geral sem nunca ter sido Lanterna',      grupo:'especial' },
  { id:'vhagar',         num:36, nome:'Cavaleiro de Vhagar',           desc:'Campeão vindo do 6º lugar ou abaixo',       grupo:'especial' },
  { id:'balerion',       num:37, nome:'Domador de Balerion',           desc:'Mais MVPs na temporada',                    grupo:'especial' },
  { id:'perfeicao',      num:38, nome:'Perfeição Encarnada',           desc:'Maior média de pontos Cartola na temporada',grupo:'especial' },
];

/* ─── Lore curto por título ─── */
const TITULOS_LORE = {
  'Escudeiro Sem Nome': 'O ponto de partida. Sem feitos para reivindicar — mas com toda a temporada pela frente.',
  'Cavaleiro da Companhia': 'O primeiro juramento de combate. Você venceu uma rodada — agora tem nome entre os cavaleiros.',
  'Senhor dos Cavaleiros de Rohan': 'Três vitórias. A cavalaria responde quando você galopa à frente.',
  'Herdeiro de Isildur': 'Cinco MVPs. Você carrega a linhagem dos reis caídos — e a obrigação de não cair.',
  'Rei Coroado de Gondor': 'Sete vezes o melhor da rodada. A coroa branca é sua, e o trono pesa.',
  'O Rei que Voltou': 'Dez MVPs. Aragorn voltou de exílio e tomou o que era seu — você fez o mesmo.',
  'Portador de Glamdring': 'Quinze. A Espada-Fenda-Inimigos só responde a quem mereceu chamá-la pelo nome.',
  'Portador da Ferroada': 'Sua primeira pontuação acima de 80. A lâmina dos hobbits brilha no escuro — e você acendeu.',
  'Empunhador de Andúril': 'Três mitadas. A Espada Reforjada — o que estava partido, agora corta inimigos.',
  'Cavaleiro do Amanhecer': 'Cinco mitadas. Você nasce com cada rodada e vence a noite.',
  'Portador da Garra Longa': 'Sete mitadas. A espada valiriana é sua — peso ancestral, fio que não cega.',
  'Portador da Espada de Fogo': 'Dez mitadas. Você não pontua alto — você queima a rodada.',
  'Cavaleiro do Corvo Branco': 'Você caiu e voltou. +50 pts numa rodada, e o corvo da Patrulha cruza o céu.',
  'Renascido no Fogo': 'Três recuperações. Como o sangue Targaryen, o fogo te purifica em vez de matar.',
  'Jon Snow Ressuscitado': 'Cinco. Você morreu pra liga e voltou — agora tem dívida com nada e ninguém.',
  'Ressurgido das Trevas': 'Sete recuperações. Quem ainda duvida que você reaparece quando necessário?',
  'Conquistador de Terras': 'Sua primeira ultrapassagem com peso. Subiu no ranking deixando alguém pra trás.',
  'O Senhor do Aço Negro': 'Três massacres. Aço Valiriano não enfraquece com o tempo — assim como sua escalada.',
  'Flagelo dos Reinos': 'Cinco massacres. Os reinos fortes te temem mais que os fracos te ignoram.',
  'Terror de Westeros': 'Sete. Cidades fecham portões quando seu nome surge no ranking.',
  'Guardião da Torre Branca': 'Pódio na rodada. Você é vista de longe — e isso significa algo.',
  'Cavaleiro da Guarda Real': 'Cinco pódios. Branco e ouro — escolhido pra proteger a coroa, não pra usá-la.',
  'Lorde Comandante da Muralha': 'Oito pódios. A Patrulha te elege quando ninguém mais quer o frio.',
  'Mão do Rei': 'Dez pódios. Quem governa de fato é quem assina.',
  'Protetor dos Sete Reinos': 'Quinze pódios. Você é a constância em que reis se apoiam — e contra a qual eles falham.',
  'Banido para o Exílio': 'Você foi último na rodada. Os portões da cidade fecharam — vá longe e em silêncio.',
  'Habitante das Terras Sombrias': 'Três lanternas. Quem vive aqui sabe que o sol é uma lembrança.',
  'Servo de Sauron': 'Cinco. O Olho te marcou. Não há retorno simples desse contrato.',
  'Prisioneiro de Mordor': 'Sete lanternas. As correntes ficam pesadas — mas você se acostuma.',
  'Rei da Noite Eterna': 'Dez. Você reina sobre o silêncio — e o silêncio responde.',
  'Imperador dos Sete Reinos': 'A coroa de ferro do reino unificado. Não há outro acima — e todos os outros prestam contas.',
  'Príncipe de Pedra do Dragão': 'Herdeiro do trono — não pelo nascimento, mas pelo mérito. O segundo lugar nunca teve tanto peso.',
  'Senhor de Winterfell': 'O Norte se lembra. Bronze é mais sólido que ouro quando o inverno chega.',
  'O Esquecido pelas Crônicas': 'As páginas se fecharam antes do seu nome. As gerações futuras não saberão que você esteve aqui.',
  'Rei de Gondor': 'Você reinou sem pisar nas trevas. A pureza da campanha vale uma segunda coroa.',
  'Cavaleiro de Vhagar': 'Você caiu e voltou montado num dragão antigo. Quem voltou do 6º lugar não voltou sozinho.',
  'Domador de Balerion': 'O Terror Negro responde só a você. Mais vitórias semanais que qualquer outro — domínio absoluto.',
  'Perfeição Encarnada': 'Não a vitória estridente, mas a constância de quem nunca pontua mal. A média não mente.',
};

/* ─── Funções de cálculo ─── */
function pontosPorContagem(cat, count){
  for (const [c,p] of PONTOS[cat]) if (count >= c) return p;
  return 0;
}
function tituloPorContagem(cat, count){
  for (const [c,t] of TITULOS[cat]) if (count >= c) return {marco:c, nome:t};
  return null;
}
function proximoMarco(cat, count){
  const tab = TITULOS[cat];
  for (let i = tab.length - 1; i >= 0; i--){
    if (count < tab[i][0]) return {marco:tab[i][0], nome:tab[i][1]};
  }
  return null;
}
function bonusG2(pts){
  for (const [thr,b] of G2_THRESHOLDS) if (pts >= thr) return b;
  return 0;
}
function getCardUrl(cat, marco){
  const n = CARD_NUM[cat]?.[marco];
  return n ? `${IMG_BASE}/${String(n).padStart(2,'0')}.${IMG_EXT}` : null;
}
function getCardUrlByNum(num){
  return `${IMG_BASE}/${String(num).padStart(2,'0')}.${IMG_EXT}`;
}

/* ─── Parse CSV ─── */
function parseCSV(csv){
  const linhas = csv.trim().split(/\r?\n/);
  const dados = {};
  const jogadoresCsv = new Set();
  for (let i = 1; i < linhas.length; i++){
    const partes = linhas[i].split(',').map(s => s.trim());
    if (partes.length < 3) continue;
    const r = parseInt(partes[0]);
    const t = partes[1];
    const p = parseFloat(partes[2]);
    if (isNaN(r) || isNaN(p) || !t) continue;
    if (!dados[r]) dados[r] = [];
    dados[r].push({time:t, pts:p});
    jogadoresCsv.add(t);
  }
  return {dados, jogadoresCsv:[...jogadoresCsv].sort()};
}

/* ─── Processa toda a liga ─── */
function processarLiga(csv){
  const {dados, jogadoresCsv} = parseCSV(csv);
  if (jogadoresCsv.length === 0) return null;

  const estado = {};
  jogadoresCsv.forEach(j => {
    estado[j] = {
      name:j, mvp:0, mitada:0, recuperacao:0, massacre:0, podio:0, lanterna:0,
      g2:0, ptsCartola:0, pts:[], historico:[],
      posPorRodada:[],
    };
  });

  let acumAntes = jogadoresCsv.map(j => ({name:j, pm:0, ptsCartola:0}));
  const rodadas = Object.keys(dados).map(Number).sort((a,b) => a-b);

  for (const r of rodadas){
    const sorted = [...dados[r]].sort((a,b) => b.pts - a.pts);
    const vale = r >= PRIMEIRA_RODADA_VALIDA;

    sorted.forEach(td => {
      estado[td.time].pts[r-1] = td.pts;
      estado[td.time].ptsCartola += td.pts;
    });

    sorted.forEach((td, idx) => {
      const lord = estado[td.time];
      const conqEntry = {rodada:r, pts:td.pts, posRodada:idx+1, totalNaRodada:sorted.length, conquistas:[], g2:0};
      if (vale){
        if (idx === 0){ lord.mvp++; conqEntry.conquistas.push('mvp'); }
        if (idx === 1 || idx === 2){ lord.podio++; conqEntry.conquistas.push('podio'); }
        if (idx === sorted.length - 1){ lord.lanterna++; conqEntry.conquistas.push('lanterna'); }
        if (td.pts >= 80){ lord.mitada++; conqEntry.conquistas.push('mitada'); }
        const ptsAnt = lord.pts[r-2];
        if (ptsAnt !== undefined && (td.pts - ptsAnt) >= 50){
          lord.recuperacao++;
          conqEntry.conquistas.push('recuperacao');
        }
        const g2 = bonusG2(td.pts);
        if (g2 > 0){ lord.g2 += g2; conqEntry.g2 = g2; }
      }
      lord.historico.push(conqEntry);
    });

    const acumPos = jogadoresCsv.map(j => {
      const l = estado[j];
      const pm = pontosPorContagem('mvp',l.mvp) + pontosPorContagem('mitada',l.mitada)
        + pontosPorContagem('recuperacao',l.recuperacao) + pontosPorContagem('massacre',l.massacre)
        + pontosPorContagem('podio',l.podio) + pontosPorContagem('lanterna',l.lanterna) + l.g2;
      return {name:j, pm, ptsCartola:l.ptsCartola};
    }).sort((a,b) => b.pm - a.pm || b.ptsCartola - a.ptsCartola);

    if (vale){
      for (const j of jogadoresCsv){
        const posBefore = acumAntes.findIndex(x => x.name === j);
        const posAfter = acumPos.findIndex(x => x.name === j);
        if (posAfter < posBefore){
          let ok = false;
          for (const adv of acumAntes){
            if (adv.name === j) continue;
            const ab = acumAntes.findIndex(x => x.name === adv.name);
            const aa = acumPos.findIndex(x => x.name === adv.name);
            if (ab < posBefore && aa > posAfter){
              const myPm = acumPos.find(x => x.name === j).pm;
              const advPm = acumPos.find(x => x.name === adv.name).pm;
              if (Math.abs(myPm - advPm) >= 10){ ok = true; break; }
            }
          }
          if (ok){
            estado[j].massacre++;
            const last = estado[j].historico[estado[j].historico.length - 1];
            if (last && last.rodada === r) last.conquistas.push('massacre');
          }
        }
      }
    }

    acumAntes = jogadoresCsv.map(j => {
      const l = estado[j];
      const pm = pontosPorContagem('mvp',l.mvp) + pontosPorContagem('mitada',l.mitada)
        + pontosPorContagem('recuperacao',l.recuperacao) + pontosPorContagem('massacre',l.massacre)
        + pontosPorContagem('podio',l.podio) + pontosPorContagem('lanterna',l.lanterna) + l.g2;
      return {name:j, pm, ptsCartola:l.ptsCartola};
    }).sort((a,b) => b.pm - a.pm || b.ptsCartola - a.ptsCartola);

    acumAntes.forEach((entry, posIdx) => {
      estado[entry.name].posPorRodada.push({rodada:r, pos:posIdx+1});
    });
  }

  const finais = jogadoresCsv.map(j => {
    const l = estado[j];
    const breakdown = {};
    PRIORIDADE.forEach(cat => {
      breakdown[cat] = {
        count: l[cat],
        pontos: pontosPorContagem(cat, l[cat]),
        titulo: tituloPorContagem(cat, l[cat]),
        proximo: proximoMarco(cat, l[cat]),
      };
    });
    const pm = Object.values(breakdown).reduce((a,b) => a + b.pontos, 0) + l.g2;
    const rodadasJogadas = l.historico.length;
    const mediaCartola = rodadasJogadas > 0 ? l.ptsCartola / rodadasJogadas : 0;
    return {...l, breakdown, pm, mediaCartola, rodadasJogadas};
  });
  finais.sort((a,b) => b.pm - a.pm || b.ptsCartola - a.ptsCartola);

  return {
    finais, rodadas,
    ultimaRodada: rodadas[rodadas.length-1],
    dadosUltimaRodada: dados[rodadas[rodadas.length-1]],
    estado,
  };
}

function tituloDominante(jogador){
  for (const cat of PRIORIDADE){
    if (jogador.breakdown[cat].titulo) return {cat, ...jogador.breakdown[cat].titulo};
  }
  return null;
}

/* ─── Calcula líderes atuais dos Prêmios Finais ─── */
function calcularPremiosFinais(state){
  if (!state || state.finais.length === 0) return {};
  const finais = state.finais;
  const result = {};

  result.imperador     = finais[0]?.name || null;
  result.principe      = finais[1]?.name || null;
  result.senhor_winter = finais[2]?.name || null;
  result.esquecido     = finais[finais.length-1]?.name || null;

  const lider = finais[0];
  result.rei_gondor = (lider && lider.lanterna === 0) ? lider.name : null;

  if (lider){
    const jaCaiu = lider.posPorRodada.some(p => p.pos >= 6);
    result.vhagar = jaCaiu ? lider.name : null;
  } else result.vhagar = null;

  let maxMvp = -1; let topMvp = null;
  finais.forEach(j => { if (j.mvp > maxMvp){ maxMvp = j.mvp; topMvp = j.name; } });
  result.balerion = (maxMvp > 0) ? topMvp : null;

  let maxMedia = -1; let topMedia = null;
  finais.forEach(j => { if (j.mediaCartola > maxMedia){ maxMedia = j.mediaCartola; topMedia = j.name; } });
  result.perfeicao = topMedia;

  return result;
}

const CATEGORIA_LABEL = {
  inicial:'Inicial', mvp:'MVP', mitada:'Mitada', recuperacao:'Recuperação',
  massacre:'Massacre', podio:'Pódio', lanterna:'Lanterna', premios:'Prêmios Finais'
};
const CATEGORIA_TIER = {
  inicial:'d', mvp:'s', mitada:'a', massacre:'a',
  podio:'b', recuperacao:'b', lanterna:'c', premios:'s'
};
const CATEGORIA_ICON = {
  inicial:'📰', mvp:'👑', mitada:'💀', recuperacao:'📈',
  massacre:'🗡', podio:'🥇', lanterna:'🕯', premios:'⭐'
};

function escapeHtml(s){
  if (s == null) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function escapeAttr(s){ return escapeHtml(s).replace(/"/g,'&quot;'); }

/* ════════════════════════════════════════════════════════════════
   RENDER — PORTAL (index.html)
   ════════════════════════════════════════════════════════════════ */

function renderPortal(state){
  const liga = document.getElementById('home-viva');
  if (!state){
    liga.innerHTML = `<div class="empty"><div class="empty-icon">⏳</div><div class="empty-title">Aguardando dados</div></div>`;
    return;
  }

  let html = '';

  if (state.ultimaRodada >= PRIMEIRA_RODADA_VALIDA){
    const ord = [...state.dadosUltimaRodada].sort((a,b) => b.pts - a.pts);
    const mvp = ord[0];
    const lanterna = ord[ord.length - 1];
    const mitadas = ord.filter(t => t.pts >= 80);
    html += `
      <div class="section-title"><span style="color:var(--gold)">◆</span>Rodada ${state.ultimaRodada}<span style="color:var(--gold)">◆</span></div>
      <div class="last-round">
        <div class="lr-card mvp">
          <div class="lr-icon">👑</div>
          <div class="lr-label">MVP da Rodada</div>
          <div class="lr-name">${escapeHtml(mvp.time)}</div>
          <div class="lr-stat">${mvp.pts.toFixed(2)} pts</div>
        </div>
        <div class="lr-card mitada">
          <div class="lr-icon">💀</div>
          <div class="lr-label">${mitadas.length} Mitada${mitadas.length === 1 ? '' : 's'}</div>
          <div class="lr-name">${mitadas.length > 0 ? escapeHtml(mitadas.map(m => m.time).join(', ')) : '<em style="color:var(--text-tertiary)">Nenhuma</em>'}</div>
          <div class="lr-stat">≥ 80 pts</div>
        </div>
        <div class="lr-card lanterna">
          <div class="lr-icon">🕯</div>
          <div class="lr-label">Lanterna</div>
          <div class="lr-name">${escapeHtml(lanterna.time)}</div>
          <div class="lr-stat">${lanterna.pts.toFixed(2)} pts</div>
        </div>
      </div>
    `;
  } else {
    html += `<div class="empty"><div class="empty-icon">⚔</div><div class="empty-title">Conquistas valem a partir da Rodada 6</div><div>R1–R5 são fase de calibragem.</div></div>`;
  }

  html += `
    <div class="section-title spaced"><span style="color:var(--gold)">◆</span>Classificação Geral<span style="color:var(--gold)">◆</span></div>
    <div class="ranking-mini">
  `;
  state.finais.forEach((lord, i) => {
    const slug = CSVKEY_TO_SLUG[lord.name];
    const cls = i === 0 ? 'top1' : (i === 1 ? 'top2' : (i === 2 ? 'top3' : ''));
    html += `
      <a class="rank-row ${cls}" href="./jogador/${slug}.html">
        <div class="rank-pos">${i+1}</div>
        <div class="rank-name">${JOGADORES[slug]?.brasao || ''} ${escapeHtml(lord.name)}</div>
        <div class="rank-pm">${lord.pm}</div>
        <div><span class="rank-pm-label">PM</span></div>
      </a>
    `;
  });
  html += `</div>`;

  liga.innerHTML = html;

  const portal = document.getElementById('portal-grid');
  if (portal){
    const ranking = {};
    state.finais.forEach((j, i) => ranking[j.name] = i + 1);

    let pHtml = '';
    for (const slug of ORDEM_JOGADORES){
      const cfg = JOGADORES[slug];
      const lord = state.finais.find(f => f.name === cfg.csvKey);
      if (!lord){
        pHtml += renderPortalCardEmpty(slug, cfg);
        continue;
      }
      const tEx = tituloDominante(lord);
      const pos = ranking[lord.name];
      const cls = pos === 1 ? 'top1' : '';
      pHtml += `
        <a class="portal-card" href="./jogador/${slug}.html" style="--portal-color:${cfg.color}">
          <div class="portal-bg"></div>
          <div class="portal-shade"></div>
          <div class="portal-line"></div>
          <div class="portal-arrow">→</div>
          <div class="portal-content">
            <div class="portal-rank ${cls}">${pos}º · ${escapeHtml(cfg.region)}</div>
            <div>
              <div class="portal-brasao">${cfg.brasao}</div>
              <div class="portal-name">${escapeHtml(cfg.name)}</div>
              <div class="portal-title">${tEx ? escapeHtml(tEx.nome) : '<em>Escudeiro Sem Nome</em>'}</div>
              <div class="portal-stats">
                <span class="portal-pm">${lord.pm}</span>
                <span class="portal-pm-label">Pontos Medievais</span>
              </div>
            </div>
          </div>
        </a>
      `;
    }
    portal.innerHTML = pHtml;
  }
}

function renderPortalCardEmpty(slug, cfg){
  return `
    <div class="portal-card" style="--portal-color:${cfg.color};opacity:.45;cursor:default" onclick="event.preventDefault()">
      <div class="portal-bg"></div>
      <div class="portal-shade"></div>
      <div class="portal-line"></div>
      <div class="portal-content">
        <div class="portal-rank">— · ${escapeHtml(cfg.region)}</div>
        <div>
          <div class="portal-brasao">${cfg.brasao}</div>
          <div class="portal-name">${escapeHtml(cfg.name)}</div>
          <div class="portal-title"><em>Sem dados ainda</em></div>
        </div>
      </div>
    </div>
  `;
}

/* ════════════════════════════════════════════════════════════════
   RENDER — PÁGINA DE JOGADOR
   ════════════════════════════════════════════════════════════════ */

let _currentPlayer = null;
let _currentState = null;

function renderJogador(slug, state){
  const cfg = JOGADORES[slug];
  if (!cfg){ console.error('Jogador desconhecido:', slug); return; }

  const lord = state ? state.finais.find(f => f.name === cfg.csvKey) : null;
  _currentPlayer = {slug, cfg, lord, state};
  _currentState = state;

  document.documentElement.style.setProperty('--accent', cfg.color);
  document.documentElement.style.setProperty('--accent-soft', hexToRgba(cfg.color, .10));
  document.documentElement.style.setProperty('--accent-strong', hexToRgba(cfg.color, .40));

  const hd = document.getElementById('player-header');
  const tDom = lord ? tituloDominante(lord) : null;
  const ranking = state ? state.finais.findIndex(f => f.name === cfg.csvKey) + 1 : '—';

  hd.innerHTML = `
    <a href="../index.html" class="back-link">← Portal</a>
    <a href="../regulamento.html" class="back-link" style="left:auto;right:1rem">Regulamento →</a>
    <div class="header-ornament"><span style="font-size:11px;letter-spacing:4px">✦</span></div>
    <span class="brasao-grande">${cfg.brasao}</span>
    <h1>${escapeHtml(cfg.name)}</h1>
    <div class="header-region">${escapeHtml(cfg.region)}</div>
    <div class="header-title-current">
      ${tDom ? '"' + escapeHtml(tDom.nome) + '"' : '<em>"Escudeiro Sem Nome"</em>'}
    </div>
  `;

  const sb = document.getElementById('player-stats');
  if (lord){
    sb.innerHTML = `
      <div class="stat-item"><span class="stat-val">${ranking}º</span><span class="stat-label">Posição</span></div>
      <div class="stat-item"><span class="stat-val ${lord.pm < 0 ? 'neg' : (lord.pm === 0 ? 'zero' : '')}">${lord.pm}</span><span class="stat-label">Pontos Medievais</span></div>
      <div class="stat-item"><span class="stat-val">${lord.mvp}</span><span class="stat-label">MVP</span></div>
      <div class="stat-item"><span class="stat-val">${lord.mitada}</span><span class="stat-label">Mitada</span></div>
      <div class="stat-item"><span class="stat-val">${lord.podio}</span><span class="stat-label">Pódio</span></div>
      <div class="stat-item"><span class="stat-val">${lord.recuperacao}</span><span class="stat-label">Recuperação</span></div>
      <div class="stat-item"><span class="stat-val">${lord.massacre}</span><span class="stat-label">Massacre</span></div>
      <div class="stat-item"><span class="stat-val ${lord.lanterna > 0 ? 'neg' : 'zero'}">${lord.lanterna}</span><span class="stat-label">Lanterna</span></div>
      <div class="stat-item"><span class="stat-val">+${lord.g2}</span><span class="stat-label">G2</span></div>
    `;
  } else {
    sb.innerHTML = `<div class="stat-item" style="grid-column:1/-1;border-right:none"><span class="stat-val">—</span><span class="stat-label">Sem dados</span></div>`;
  }

  renderConquistas(slug, lord, cfg);
  renderHistorico(slug, lord);
  renderLore(slug, cfg, lord);
  renderPremios(slug, lord, cfg, state);
}

function renderConquistas(slug, lord, cfg){
  const root = document.getElementById('s-conquistas');
  let html = `<div class="section-intro">Os títulos forjados em sua jornada. Cards desbloqueados brilham — os bloqueados ainda esperam o feito necessário.</div>`;

  /* INICIAL */
  const tierD = `var(--tier-d)`;
  const escudeiroDesc = lord && tituloDominante(lord) ? 'Você já passou desse ponto — mas ele é o início de toda jornada.' : 'Seu título atual. Nenhuma conquista desbloqueada ainda.';
  html += `
    <div class="group-title" style="--gt-color:${tierD}">
      <span class="group-title-icon">📰</span>
      Tier Inicial · ponto de partida
    </div>
    <div class="creature-grid">
      ${renderCard('inicial', 0, 'Escudeiro Sem Nome', true, 0, escudeiroDesc)}
    </div>
  `;

  for (const cat of PRIORIDADE){
    const tier = CATEGORIA_TIER[cat];
    const tierColor = `var(--tier-${tier})`;
    const counts = lord ? lord[cat] : 0;
    const titArr = TITULOS[cat];

    html += `
      <div class="group-title" style="--gt-color:${tierColor}">
        <span class="group-title-icon">${CATEGORIA_ICON[cat]}</span>
        ${CATEGORIA_LABEL[cat]} · ${counts} ocorrência${counts === 1 ? '' : 's'}${lord ? ` · ${pontosPorContagem(cat, counts) >= 0 ? '+' : ''}${pontosPorContagem(cat, counts)} pts` : ''}
      </div>
      <div class="creature-grid">
    `;

    const ordenados = [...titArr].sort((a,b) => a[0] - b[0]);
    for (const [marco, nome] of ordenados){
      const desbloqueado = counts >= marco;
      html += renderCard(cat, marco, nome, desbloqueado, counts);
    }
    html += `</div>`;
  }

  root.innerHTML = html;
}

function renderCard(cat, marco, nome, desbloqueado, counts, customMsg){
  const tier = CATEGORIA_TIER[cat];
  const tierColor = `var(--tier-${tier})`;
  const url = getCardUrl(cat, marco);
  const ptsTitulo = cat === 'inicial' ? 0 : ((PONTOS[cat]?.find(p => p[0] === marco) || [marco, 0])[1]);
  const ptsLabel = cat === 'inicial' ? 'sem pontos' : (ptsTitulo > 0 ? `+${ptsTitulo} pts` : (ptsTitulo < 0 ? `${ptsTitulo} pts` : '0 pts'));
  const num = CARD_NUM[cat]?.[marco] || '';

  return `
    <div class="creature-card ${desbloqueado ? '' : 'locked'}" style="--card-color:${tierColor}" onclick="openCardModal('${cat}', ${marco})">
      <div class="card-image-wrap">
        ${url ? `
          <img class="card-image" src="${url}" alt="${escapeAttr(nome)}" loading="lazy"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
          <div class="card-image-fallback" style="display:none">${CATEGORIA_ICON[cat]}</div>
        ` : `<div class="card-image-fallback">${CATEGORIA_ICON[cat]}</div>`}
        <div class="card-image-shade"></div>
        <div class="card-tier-line"></div>
        <div class="card-tier-badge">${cat === 'inicial' ? '·' : marco + '×'}</div>
        ${desbloqueado
          ? `<div class="card-unlocked-tag">✦ Conquistado</div>`
          : `<div class="card-locked-tag">🔒 Bloqueado</div>`}
        <div class="card-info">
          <div class="card-marco">${num ? '#' + String(num).padStart(2,'0') + ' · ' : ''}${cat === 'inicial' ? 'INICIAL' : cat.toUpperCase() + ' · ' + marco + '×'}</div>
          <div class="card-name">${escapeHtml(nome)}</div>
          <div class="card-pts">${ptsLabel}</div>
        </div>
      </div>
    </div>
  `;
}

function renderPremios(slug, lord, cfg, state){
  const root = document.getElementById('s-premios');
  if (!root) return;
  const lideres = calcularPremiosFinais(state);
  const tierS = `var(--tier-s)`;

  let html = `
    <div class="section-intro">
      Os <strong>8 prêmios finais</strong> são concedidos apenas ao final da temporada (Rodada 38).
      Abaixo, os líderes atuais — sujeitos a mudança até a última rodada.
    </div>
  `;

  html += `
    <div class="group-title" style="--gt-color:${tierS}">
      <span class="group-title-icon">🏛</span>
      Pódio Final · classificação geral
    </div>
    <div class="creature-grid">
  `;
  for (const p of PREMIOS_FINAIS.filter(x => x.grupo === 'podio')){
    html += renderPremioCard(p, lideres, cfg.csvKey);
  }
  html += `</div>`;

  html += `
    <div class="group-title" style="--gt-color:${tierS}">
      <span class="group-title-icon">⭐</span>
      Especiais · feitos extraordinários
    </div>
    <div class="creature-grid">
  `;
  for (const p of PREMIOS_FINAIS.filter(x => x.grupo === 'especial')){
    html += renderPremioCard(p, lideres, cfg.csvKey);
  }
  html += `</div>`;

  root.innerHTML = html;
}

function renderPremioCard(premio, lideres, jogadorAtual){
  const liderAtual = lideres[premio.id];
  const ehLider = liderAtual === jogadorAtual;
  const url = getCardUrlByNum(premio.num);
  const tierS = `var(--tier-s)`;

  return `
    <div class="creature-card locked" style="--card-color:${tierS};opacity:1;filter:none" onclick="openPremioModal('${premio.id}')">
      <div class="card-image-wrap">
        <img class="card-image" src="${url}" alt="${escapeAttr(premio.nome)}" loading="lazy"
             onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div class="card-image-fallback" style="display:none">⭐</div>
        <div class="card-image-shade"></div>
        <div class="card-tier-line"></div>
        <div class="card-tier-badge">R38</div>
        ${ehLider
          ? `<div class="card-unlocked-tag" style="background:var(--tier-s);color:var(--bg)">✦ Você lidera</div>`
          : (liderAtual
              ? `<div class="card-locked-tag" style="background:rgba(232,200,122,.15);color:var(--tier-s);border:1px solid rgba(232,200,122,.3)">↳ ${escapeHtml(liderAtual)}</div>`
              : `<div class="card-locked-tag">— sem favorito</div>`)}
        <div class="card-info">
          <div class="card-marco">#${String(premio.num).padStart(2,'0')} · PRÊMIO FINAL</div>
          <div class="card-name">${escapeHtml(premio.nome)}</div>
          <div class="card-pts">${escapeHtml(premio.desc)}</div>
        </div>
      </div>
    </div>
  `;
}

function renderHistorico(slug, lord){
  const root = document.getElementById('s-historico');
  if (!lord || lord.historico.length === 0){
    root.innerHTML = `<div class="empty"><div class="empty-icon">⏳</div><div class="empty-title">Sem histórico</div></div>`;
    return;
  }

  let html = `<div class="section-intro">Cada rodada vivida. R1–R5 não geram pontos (calibragem); a partir da R6, o jogo começa.</div>`;
  html += `<table class="historico-table"><thead><tr><th>R</th><th>Pts</th><th>Posição</th><th>Conquistas</th></tr></thead><tbody>`;
  for (const h of lord.historico){
    const posCls = h.posRodada === 1 ? 'pos-1' : (h.posRodada === h.totalNaRodada ? 'pos-last' : '');
    const tags = h.conquistas.map(c => `<span class="conq-tag ${c}">${CATEGORIA_LABEL[c]}</span>`).join('');
    const g2Tag = h.g2 > 0 ? `<span class="conq-tag g2">+${h.g2} G2</span>` : '';
    html += `
      <tr>
        <td>${h.rodada}</td>
        <td>${h.pts.toFixed(2)}</td>
        <td class="${posCls}">${h.posRodada}º / ${h.totalNaRodada}</td>
        <td><div class="conq-tags">${tags}${g2Tag || (tags === '' ? '<span style="color:var(--text-tertiary);font-size:11px">—</span>' : '')}</div></td>
      </tr>
    `;
  }
  html += `</tbody></table>`;
  root.innerHTML = html;
}

function renderLore(slug, cfg, lord){
  const root = document.getElementById('s-lore');
  const tDom = lord ? tituloDominante(lord) : null;
  let html = `
    <div class="section-intro">${escapeHtml(cfg.lore || '')}</div>
    <div style="text-align:center;padding:2rem 0">
      <div class="brasao-grande" style="font-size:5rem">${cfg.brasao}</div>
      <div style="font-family:'Cinzel',serif;color:var(--accent);font-size:14px;letter-spacing:3px;margin-top:.5rem;text-transform:uppercase">${escapeHtml(cfg.region)}</div>
    </div>
  `;

  let url, nome, lore, label;
  if (tDom){
    url = getCardUrl(tDom.cat, tDom.marco);
    nome = tDom.nome;
    lore = TITULOS_LORE[nome] || '';
    label = 'Título do Momento';
  } else {
    url = getCardUrlByNum(1);
    nome = 'Escudeiro Sem Nome';
    lore = TITULOS_LORE[nome];
    label = 'Título Atual';
  }
  html += `
    <div style="max-width:340px;margin:2rem auto 0;background:var(--bg-card);border:1px solid var(--border-strong);border-top:3px solid var(--accent);border-radius:12px;overflow:hidden">
      ${url ? `<img src="${url}" alt="" style="width:100%;aspect-ratio:3/4;object-fit:cover;background:var(--bg-surface)" onerror="this.outerHTML='<div style=&quot;width:100%;aspect-ratio:3/4;display:flex;align-items:center;justify-content:center;font-size:5rem;color:var(--accent);background:var(--bg-surface)&quot;>${tDom ? CATEGORIA_ICON[tDom.cat] : '📰'}</div>'">` : ''}
      <div style="padding:1.25rem;text-align:center">
        <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--text-tertiary);letter-spacing:1.5px;text-transform:uppercase">${label}</div>
        <div style="font-family:'Cinzel',serif;font-size:1.3rem;font-weight:700;color:var(--accent);margin-top:.4rem">${escapeHtml(nome)}</div>
        <div style="font-size:13px;color:var(--text-secondary);margin-top:.75rem;font-style:italic">${escapeHtml(lore)}</div>
      </div>
    </div>
  `;
  root.innerHTML = html;
}

/* ─── Modais ─── */
function openCardModal(cat, marco){
  const tier = CATEGORIA_TIER[cat];
  const tierColor = `var(--tier-${tier})`;
  let nome, url, pts, lore;

  if (cat === 'inicial'){
    nome = 'Escudeiro Sem Nome';
    url = getCardUrlByNum(1);
    pts = 0;
    lore = TITULOS_LORE[nome] || '';
  } else {
    const titArr = TITULOS[cat];
    const titEntry = titArr.find(t => t[0] === marco);
    if (!titEntry) return;
    nome = titEntry[1];
    url = getCardUrl(cat, marco);
    pts = (PONTOS[cat].find(p => p[0] === marco) || [marco, 0])[1];
    lore = TITULOS_LORE[nome] || '';
  }

  const lord = _currentPlayer?.lord;
  const counts = (lord && cat !== 'inicial') ? lord[cat] : 0;
  const desbloqueado = (cat === 'inicial') ? true : counts >= marco;

  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  modal.style.setProperty('--card-color', tierColor);

  let statusHtml;
  if (cat === 'inicial'){
    statusHtml = `<span style="color:${tierColor}">✦ Sempre desbloqueado</span> — todo invocador começa aqui`;
  } else if (desbloqueado){
    statusHtml = `<span style="color:${tierColor}">✦ Conquistado</span> — você tem ${counts} ocorrência${counts === 1 ? '' : 's'} de ${CATEGORIA_LABEL[cat]}`;
  } else {
    statusHtml = `🔒 Bloqueado — faltam ${marco - counts} ${CATEGORIA_LABEL[cat]}${(marco - counts) === 1 ? '' : 's'} para desbloquear`;
  }

  modalBody.innerHTML = `
    ${url
      ? `<img class="modal-img" src="${url}" alt="" onerror="this.outerHTML='<div class=&quot;card-image-fallback&quot; style=&quot;position:relative;height:auto;aspect-ratio:3/4;font-size:5rem&quot;>${CATEGORIA_ICON[cat]}</div>'">`
      : `<div class="card-image-fallback" style="position:relative;height:auto;aspect-ratio:3/4;font-size:5rem">${CATEGORIA_ICON[cat]}</div>`}
    <div class="modal-body">
      <div class="modal-tier">
        <span style="color:${tierColor};font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase">
          ${CATEGORIA_LABEL[cat]}${cat === 'inicial' ? '' : ' · ' + marco + '× · ' + (pts > 0 ? '+' : '') + pts + ' pts'}
        </span>
      </div>
      <div class="modal-name" style="color:${tierColor}">${escapeHtml(nome)}</div>
      <div class="modal-marco">${statusHtml}</div>
      <div class="modal-desc">${escapeHtml(lore)}</div>
    </div>
  `;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function openPremioModal(id){
  const premio = PREMIOS_FINAIS.find(p => p.id === id);
  if (!premio) return;
  const tierColor = `var(--tier-s)`;
  const lideres = calcularPremiosFinais(_currentState);
  const lider = lideres[premio.id];
  const ehLider = lider === _currentPlayer?.cfg?.csvKey;
  const lore = TITULOS_LORE[premio.nome] || '';

  const modal = document.getElementById('modal');
  const modalBody = document.getElementById('modal-body');
  modal.style.setProperty('--card-color', tierColor);

  let statusHtml;
  if (ehLider){
    statusHtml = `<span style="color:${tierColor}">✦ Você lidera atualmente</span> — defenda até a Rodada 38`;
  } else if (lider){
    statusHtml = `Líder atual: <strong style="color:${tierColor}">${escapeHtml(lider)}</strong>`;
  } else {
    statusHtml = `Sem favorito definido ainda`;
  }

  modalBody.innerHTML = `
    <img class="modal-img" src="${getCardUrlByNum(premio.num)}" alt=""
         onerror="this.outerHTML='<div class=&quot;card-image-fallback&quot; style=&quot;position:relative;height:auto;aspect-ratio:3/4;font-size:5rem&quot;>⭐</div>'">
    <div class="modal-body">
      <div class="modal-tier">
        <span style="color:${tierColor};font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase">
          Prêmio Final · #${String(premio.num).padStart(2,'0')} · Rodada 38
        </span>
      </div>
      <div class="modal-name" style="color:${tierColor}">${escapeHtml(premio.nome)}</div>
      <div class="modal-marco">${statusHtml}</div>
      <div class="modal-desc"><strong>Critério:</strong> ${escapeHtml(premio.desc)}<br><br><em>${escapeHtml(lore)}</em></div>
    </div>
  `;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCardModal(e){
  if (e && e.target !== document.getElementById('modal')) return;
  closeCardModalDirect();
}
function closeCardModalDirect(){
  const m = document.getElementById('modal');
  if (m) m.classList.remove('open');
  document.body.style.overflow = '';
}

function showSection(id, btn){
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('s-' + id).classList.add('active');
  btn.classList.add('active');
  const nav = document.querySelector('.page-nav');
  if (nav) window.scrollTo({top: nav.offsetTop, behavior: 'smooth'});
}

function hexToRgba(hex, alpha){
  const h = hex.replace('#','');
  const r = parseInt(h.substr(0,2),16);
  const g = parseInt(h.substr(2,2),16);
  const b = parseInt(h.substr(4,2),16);
  return `rgba(${r},${g},${b},${alpha})`;
}

async function carregarCSV(){
  try {
    const res = await fetch('../dados.csv?t=' + Date.now());
    if (res.ok) return await res.text();
  } catch (e) {}
  try {
    const res = await fetch('./dados.csv?t=' + Date.now());
    if (res.ok) return await res.text();
  } catch (e) {}
  return null;
}

async function initPortal(){
  const csv = await carregarCSV();
  if (!csv){
    document.getElementById('home-viva').innerHTML = `<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Não foi possível carregar dados.csv</div><div>Sirva os arquivos via HTTP. Ex.: <code>python3 -m http.server</code></div></div>`;
    return;
  }
  const state = processarLiga(csv);
  if (state){
    document.getElementById('hm-rodadas').textContent = state.rodadas.length;
    document.getElementById('hm-jogadores').textContent = state.finais.length;
  }
  renderPortal(state);
}

async function initJogador(slug){
  const csv = await carregarCSV();
  if (!csv){
    document.getElementById('player-header').innerHTML = `<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Não foi possível carregar dados.csv</div></div>`;
    return;
  }
  const state = processarLiga(csv);
  renderJogador(slug, state);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCardModalDirect(); });
}
