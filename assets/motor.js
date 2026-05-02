/* ════════════════════════════════════════════════════════════════
   GUERRA DOS REINOS — Motor JS · v4 · Álbum (Raridade Fixa)
   ════════════════════════════════════════════════════════════════ */

const IMG_BASE = 'https://cdn.jsdelivr.net/gh/andersonlluna/guerra-dos-reinos-titulos@main/imagens';
const IMG_EXT  = 'jpg';

const G2_THRESHOLDS = [[110,14],[100,8],[90,4]];
const PRIORIDADE = ['mvp','mitada','recuperacao','massacre','podio','lanterna'];
const PRIMEIRA_RODADA_VALIDA = 6;

const TITULOS = {
  mvp: [
    [15,'Portador de Glamdring'], [10,'O Rei que Voltou'],
    [7,'Rei Coroado de Gondor'],  [5,'Herdeiro de Isildur'],
    [3,'Senhor dos Cavaleiros de Rohan'], [1,'Cavaleiro da Companhia'],
  ],
  mitada: [
    [10,'Portador da Espada de Fogo'], [7,'Portador da Garra Longa'],
    [5,'Cavaleiro do Amanhecer'], [3,'Empunhador de Andúril'], [1,'Portador da Ferroada'],
  ],
  recuperacao: [
    [7,'Ressurgido das Trevas'], [5,'Jon Snow Ressuscitado'],
    [3,'Renascido no Fogo'], [1,'Cavaleiro do Corvo Branco'],
  ],
  massacre: [
    [7,'Terror de Westeros'], [5,'Flagelo dos Reinos'],
    [3,'O Senhor do Aço Negro'], [1,'Conquistador de Terras'],
  ],
  podio: [
    [15,'Protetor dos Sete Reinos'], [10,'Mão do Rei'],
    [8,'Lorde Comandante da Muralha'], [5,'Cavaleiro da Guarda Real'], [1,'Guardião da Torre Branca'],
  ],
  lanterna: [
    [10,'Rei da Noite Eterna'], [7,'Prisioneiro de Mordor'],
    [5,'Servo de Sauron'], [3,'Habitante das Terras Sombrias'], [1,'Banido para o Exílio'],
  ],
};

const CARD_NUM = {
  inicial:     { 0: 1 },
  mvp:         { 1: 2,  3: 3,  5: 4,  7: 5,  10: 6,  15: 7  },
  podio:       { 1: 8,  5: 9,  8: 10, 10: 11, 15: 12 },
  mitada:      { 1: 13, 3: 14, 5: 15, 7: 16, 10: 17 },
  massacre:    { 1: 18, 3: 19, 5: 20, 7: 21 },
  recuperacao: { 1: 22, 3: 23, 5: 24, 7: 25 },
  lanterna:    { 1: 26, 3: 27, 5: 28, 7: 29, 10: 30 },
};

const PREMIOS_FINAIS = [
  { id:'imperador',     num:31, nome:'Imperador dos Sete Reinos',     desc:'1º lugar geral ao final da temporada',     grupo:'podio'    },
  { id:'principe',      num:32, nome:'Príncipe de Pedra do Dragão',   desc:'2º lugar geral ao final da temporada',     grupo:'podio'    },
  { id:'senhor_winter', num:33, nome:'Senhor de Winterfell',          desc:'3º lugar geral ao final da temporada',     grupo:'podio'    },
  { id:'esquecido',     num:34, nome:'O Esquecido pelas Crônicas',    desc:'Último lugar geral ao final da temporada', grupo:'podio'    },
  { id:'rei_gondor',    num:35, nome:'Rei de Gondor',                 desc:'1º geral sem nunca ter sido Lanterna',     grupo:'especial' },
  { id:'vhagar',        num:36, nome:'Cavaleiro de Vhagar',           desc:'Campeão vindo do 6º lugar ou abaixo',      grupo:'especial' },
  { id:'balerion',      num:37, nome:'Domador de Balerion',           desc:'Mais MVPs na temporada',                   grupo:'especial' },
  { id:'perfeicao',     num:38, nome:'Perfeição Encarnada',           desc:'Maior média de pontos Cartola na temporada', grupo:'especial' },
];

/* ─── Raridade FIXA por figurinha (baseada em dificuldade histórica) ─── */
const RARIDADE_FIXA = {
  /* Inicial */
  1: 'comum',
  /* MVP */
  2: 'comum', 3: 'incomum', 4: 'raro', 5: 'epico', 6: 'lendario', 7: 'mitico',
  /* Pódio */
  8: 'comum', 9: 'incomum', 10: 'raro', 11: 'epico', 12: 'lendario',
  /* Mitada */
  13: 'comum', 14: 'incomum', 15: 'raro', 16: 'epico', 17: 'lendario',
  /* Massacre */
  18: 'incomum', 19: 'raro', 20: 'epico', 21: 'mitico',
  /* Recuperação */
  22: 'incomum', 23: 'raro', 24: 'epico', 25: 'mitico',
  /* Lanterna */
  26: 'comum', 27: 'incomum', 28: 'raro', 29: 'epico', 30: 'mitico',
  /* Prêmios Finais */
  31: 'mitico', 32: 'lendario', 33: 'epico', 34: 'raro',
  35: 'mitico', 36: 'lendario', 37: 'epico', 38: 'raro',
};

const RARIDADE_INFO = {
  comum:    { label: 'Comum',    cls:'comum',    cor:'var(--rar-comum)',    ord: 1 },
  incomum:  { label: 'Incomum',  cls:'incomum',  cor:'var(--rar-incomum)',  ord: 2 },
  raro:     { label: 'Raro',     cls:'raro',     cor:'var(--rar-raro)',     ord: 3 },
  epico:    { label: 'Épico',    cls:'epico',    cor:'var(--rar-epico)',    ord: 4 },
  lendario: { label: 'Lendário', cls:'lendario', cor:'var(--rar-lendario)', ord: 5 },
  mitico:   { label: 'Mítico',   cls:'mitico',   cor:'var(--rar-mitico)',   ord: 6 },
};

function getRaridade(num){
  const key = RARIDADE_FIXA[num] || 'comum';
  return RARIDADE_INFO[key];
}

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

/* ─── Helpers ─── */
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
function escapeHtml(s){
  if (s == null) return '';
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}
function escapeAttr(s){ return escapeHtml(s).replace(/"/g,'&quot;'); }

/* ─── Engine de cálculo ─── */
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

function processarLiga(csv){
  const {dados, jogadoresCsv} = parseCSV(csv);
  if (jogadoresCsv.length === 0) return null;

  const estado = {};
  jogadoresCsv.forEach(j => {
    estado[j] = {
      name:j, mvp:0, mitada:0, recuperacao:0, massacre:0, podio:0, lanterna:0,
      g2:0, ptsCartola:0, pts:[], posPorRodada:[], figurinhas:[],
    };
  });

  function checkDesbloqueio(j, cat, antes, depois, rodada){
    if (!CARD_NUM[cat]) return;
    Object.entries(CARD_NUM[cat]).forEach(([marco, num]) => {
      const m = parseInt(marco);
      if (antes < m && depois >= m){
        const titEntry = TITULOS[cat]?.find(t => t[0] === m);
        if (titEntry){
          estado[j].figurinhas.push({cat, marco:m, nome:titEntry[1], num, rodada});
        }
      }
    });
  }

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
      if (!vale) return;
      const before = {mvp:lord.mvp, mitada:lord.mitada, recuperacao:lord.recuperacao, podio:lord.podio, lanterna:lord.lanterna};
      if (idx === 0) lord.mvp++;
      if (idx === 1 || idx === 2) lord.podio++;
      if (idx === sorted.length - 1) lord.lanterna++;
      if (td.pts >= 80) lord.mitada++;
      const ptsAnt = lord.pts[r-2];
      if (ptsAnt !== undefined && (td.pts - ptsAnt) >= 50) lord.recuperacao++;
      const g2 = bonusG2(td.pts);
      if (g2 > 0) lord.g2 += g2;

      checkDesbloqueio(td.time, 'mvp',         before.mvp,         lord.mvp,         r);
      checkDesbloqueio(td.time, 'mitada',      before.mitada,      lord.mitada,      r);
      checkDesbloqueio(td.time, 'recuperacao', before.recuperacao, lord.recuperacao, r);
      checkDesbloqueio(td.time, 'podio',       before.podio,       lord.podio,       r);
      checkDesbloqueio(td.time, 'lanterna',    before.lanterna,    lord.lanterna,    r);
    });

    const calcPM = j => {
      const l = estado[j];
      const ptsCat = (cat, c) => {
        const tab = {
          mvp:[[15,200],[10,135],[7,95],[5,65],[3,40],[2,20],[1,10]],
          mitada:[[10,100],[7,70],[5,45],[3,23],[2,10],[1,5]],
          recuperacao:[[7,96],[5,65],[3,36],[2,16],[1,8]],
          massacre:[[7,62],[5,40],[3,22],[2,12],[1,6]],
          podio:[[15,75],[10,45],[8,34],[5,20],[4,12],[3,9],[2,6],[1,3]],
          lanterna:[[10,-100],[7,-70],[5,-45],[3,-23],[2,-10],[1,-5]],
        };
        for (const [count,p] of tab[cat]) if (c >= count) return p;
        return 0;
      };
      return ptsCat('mvp',l.mvp) + ptsCat('mitada',l.mitada) + ptsCat('recuperacao',l.recuperacao)
           + ptsCat('massacre',l.massacre) + ptsCat('podio',l.podio) + ptsCat('lanterna',l.lanterna) + l.g2;
    };

    const acumPos = jogadoresCsv.map(j => ({name:j, pm:calcPM(j), ptsCartola:estado[j].ptsCartola}))
      .sort((a,b) => b.pm - a.pm || b.ptsCartola - a.ptsCartola);

    if (vale){
      for (const j of jogadoresCsv){
        const beforeMassacre = estado[j].massacre;
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
            checkDesbloqueio(j, 'massacre', beforeMassacre, estado[j].massacre, r);
          }
        }
      }
    }

    acumAntes = jogadoresCsv.map(j => ({name:j, pm:calcPM(j), ptsCartola:estado[j].ptsCartola}))
      .sort((a,b) => b.pm - a.pm || b.ptsCartola - a.ptsCartola);
    acumAntes.forEach((entry, posIdx) => {
      estado[entry.name].posPorRodada.push({rodada:r, pos:posIdx+1});
    });
  }

  const finais = jogadoresCsv.map(j => {
    const l = estado[j];
    const rodadasJogadas = l.pts.filter(p => p !== undefined).length;
    const mediaCartola = rodadasJogadas > 0 ? l.ptsCartola / rodadasJogadas : 0;
    return {...l, mediaCartola, rodadasJogadas};
  });

  /* Ordena por completude do álbum (desempate: maior raridade entre figurinhas) */
  finais.forEach(f => {
    f.completude = 1 + f.figurinhas.length;
    f.maiorRaridade = Math.max(0, ...f.figurinhas.map(fig => RARIDADE_INFO[RARIDADE_FIXA[fig.num]].ord));
  });
  finais.sort((a,b) => b.completude - a.completude || b.maiorRaridade - a.maiorRaridade);

  return {
    finais, rodadas,
    ultimaRodada: rodadas[rodadas.length-1],
    estado,
  };
}

/* ─── Mapa "quem possui figurinha N" ─── */
function donosPorFigurinha(state){
  const donos = {};
  for (let n = 1; n <= 38; n++) donos[n] = [];
  /* Inicial: todos */
  state.finais.forEach(j => donos[1].push(j.name));
  /* Conquistadas */
  state.finais.forEach(j => j.figurinhas.forEach(f => donos[f.num].push(j.name)));
  /* Prêmios Finais: líder atual "tem" preview */
  const lid = liderePremios(state);
  PREMIOS_FINAIS.forEach(p => { if (lid[p.id]) donos[p.num].push(lid[p.id]); });
  return donos;
}

function liderePremios(state){
  if (!state || state.finais.length === 0) return {};
  /* Pra prêmios, precisamos do ranking POR PM (não por completude do álbum) */
  const calcPM = j => {
    const ptsCat = (cat, c) => {
      const tab = {
        mvp:[[15,200],[10,135],[7,95],[5,65],[3,40],[2,20],[1,10]],
        mitada:[[10,100],[7,70],[5,45],[3,23],[2,10],[1,5]],
        recuperacao:[[7,96],[5,65],[3,36],[2,16],[1,8]],
        massacre:[[7,62],[5,40],[3,22],[2,12],[1,6]],
        podio:[[15,75],[10,45],[8,34],[5,20],[4,12],[3,9],[2,6],[1,3]],
        lanterna:[[10,-100],[7,-70],[5,-45],[3,-23],[2,-10],[1,-5]],
      };
      for (const [count,p] of tab[cat]) if (c >= count) return p;
      return 0;
    };
    return ptsCat('mvp',j.mvp) + ptsCat('mitada',j.mitada) + ptsCat('recuperacao',j.recuperacao)
         + ptsCat('massacre',j.massacre) + ptsCat('podio',j.podio) + ptsCat('lanterna',j.lanterna) + j.g2;
  };
  const porPM = [...state.finais].sort((a,b) => calcPM(b) - calcPM(a) || b.ptsCartola - a.ptsCartola);

  const result = {};
  result.imperador     = porPM[0]?.name || null;
  result.principe      = porPM[1]?.name || null;
  result.senhor_winter = porPM[2]?.name || null;
  result.esquecido     = porPM[porPM.length-1]?.name || null;
  const lider = porPM[0];
  result.rei_gondor = (lider && lider.lanterna === 0) ? lider.name : null;
  if (lider){
    const jaCaiu = lider.posPorRodada.some(p => p.pos >= 6);
    result.vhagar = jaCaiu ? lider.name : null;
  } else result.vhagar = null;
  let maxMvp = -1; let topMvp = null;
  porPM.forEach(j => { if (j.mvp > maxMvp){ maxMvp = j.mvp; topMvp = j.name; } });
  result.balerion = (maxMvp > 0) ? topMvp : null;
  let maxMedia = -1; let topMedia = null;
  porPM.forEach(j => { if (j.mediaCartola > maxMedia){ maxMedia = j.mediaCartola; topMedia = j.name; } });
  result.perfeicao = topMedia;
  return result;
}

const CATEGORIA_LABEL = {
  inicial:'Inicial', mvp:'MVP', mitada:'Mitada', recuperacao:'Recuperação',
  massacre:'Massacre', podio:'Pódio', lanterna:'Lanterna',
};
const CATEGORIA_TIER = {
  inicial:'d', mvp:'s', mitada:'a', massacre:'a',
  podio:'b', recuperacao:'b', lanterna:'c',
};
const CATEGORIA_ICON = {
  inicial:'📜', mvp:'👑', mitada:'💀', recuperacao:'📈',
  massacre:'🗡', podio:'🥇', lanterna:'🕯',
};

/* ════════════════════════════════════════════════════════════════
   PORTAL
   ════════════════════════════════════════════════════════════════ */

let _portalState = null;
let _portalDonos = null;

function renderPortal(state){
  if (!state) return;
  const donos = donosPorFigurinha(state);
  _portalState = state;
  _portalDonos = donos;

  /* GRID DE JOGADORES */
  const portal = document.getElementById('portal-grid');
  if (portal){
    let html = '';
    for (const slug of ORDEM_JOGADORES){
      const cfg = JOGADORES[slug];
      const lord = state.finais.find(f => f.name === cfg.csvKey);
      if (!lord){
        html += renderPortalCardEmpty(slug, cfg);
        continue;
      }
      const completude = 1 + lord.figurinhas.length;
      const pct = Math.round((completude / 38) * 100);
      /* Figurinha mais rara que ele tem */
      let raraNum = 1;
      let raraOrd = 1;
      [{num:1}, ...lord.figurinhas].forEach(f => {
        const o = RARIDADE_INFO[RARIDADE_FIXA[f.num]].ord;
        if (o > raraOrd){ raraOrd = o; raraNum = f.num; }
      });
      const rarInfo = RARIDADE_INFO[RARIDADE_FIXA[raraNum]];
      let raraNome = 'Escudeiro Sem Nome';
      if (raraNum > 1){
        const fig = lord.figurinhas.find(f => f.num === raraNum);
        raraNome = fig?.nome || raraNome;
      }

      html += `
        <a class="portal-card" href="./jogador/${slug}.html" style="--portal-color:${cfg.color}">
          <div class="portal-bg"></div>
          <div class="portal-shade"></div>
          <div class="portal-line"></div>
          <div class="portal-arrow">→</div>
          <div class="portal-content">
            <div class="portal-meta">
              <span class="portal-region">${escapeHtml(cfg.region)}</span>
              <span class="portal-completude">${completude}/38</span>
            </div>
            <div>
              <div class="portal-brasao">${cfg.brasao}</div>
              <div class="portal-name">${escapeHtml(cfg.name)}</div>
              <div class="portal-bar"><div class="portal-bar-fill" style="width:${pct}%"></div></div>
              <div class="portal-rare">
                <span class="rare-label rar-${rarInfo.cls}">${rarInfo.label} mais alta</span>
                <span class="rare-name">${escapeHtml(raraNome)}</span>
              </div>
            </div>
          </div>
        </a>
      `;
    }
    portal.innerHTML = html;
  }

  /* GALERIA NO PORTAL — todas 38 figurinhas */
  renderGaleriaPortal(state, donos);
}

function renderPortalCardEmpty(slug, cfg){
  return `
    <div class="portal-card" style="--portal-color:${cfg.color};opacity:.45;cursor:default" onclick="event.preventDefault()">
      <div class="portal-bg"></div>
      <div class="portal-shade"></div>
      <div class="portal-line"></div>
      <div class="portal-content">
        <div class="portal-meta">
          <span class="portal-region">${escapeHtml(cfg.region)}</span>
          <span class="portal-completude">—</span>
        </div>
        <div>
          <div class="portal-brasao">${cfg.brasao}</div>
          <div class="portal-name">${escapeHtml(cfg.name)}</div>
          <div class="portal-rare"><em>Sem dados ainda</em></div>
        </div>
      </div>
    </div>
  `;
}

function renderGaleriaPortal(state, donos){
  const root = document.getElementById('galeria-portal');
  if (!root) return;

  /* Lista das 38 figurinhas */
  const figs = [];
  figs.push({num:1, cat:'inicial', marco:0, nome:'Escudeiro Sem Nome'});
  for (const cat of ['mvp','podio','mitada','massacre','recuperacao','lanterna']){
    const ord = [...TITULOS[cat]].sort((a,b) => a[0] - b[0]);
    for (const [marco, nome] of ord){
      const num = CARD_NUM[cat]?.[marco];
      if (num) figs.push({num, cat, marco, nome});
    }
  }
  PREMIOS_FINAIS.forEach(p => figs.push({num:p.num, cat:'premio', marco:0, nome:p.nome, premio:p}));

  /* Header com filtros */
  let html = `
    <div class="galeria-header">
      <div class="raridade-legenda">
        ${Object.values(RARIDADE_INFO).map(r => `
          <button class="rar-pill rar-${r.cls} active" data-filter="${r.cls}" onclick="toggleRarFilter('${r.cls}', this)">${r.label}</button>
        `).join('')}
      </div>
    </div>
    <div class="galeria-grid" id="galeria-grid-inner">
  `;

  for (const fig of figs){
    html += renderGaleriaCard(fig, donos);
  }
  html += `</div>`;
  root.innerHTML = html;
}

function toggleRarFilter(rar, btn){
  btn.classList.toggle('active');
  const ativos = [...document.querySelectorAll('.rar-pill.active')].map(b => b.dataset.filter);
  document.querySelectorAll('#galeria-grid-inner .galeria-card').forEach(card => {
    const r = card.dataset.rar;
    card.style.display = ativos.includes(r) ? '' : 'none';
  });
}

function renderGaleriaCard(fig, donos){
  const lista = donos[fig.num] || [];
  const rar = getRaridade(fig.num);
  const url = getCardUrlByNum(fig.num);
  const ehPremio = fig.cat === 'premio';
  const ninguem = lista.length === 0;

  const numLabel = `#${String(fig.num).padStart(2,'0')}`;
  let subtitulo;
  if (fig.cat === 'inicial') subtitulo = 'Tier Inicial';
  else if (ehPremio) subtitulo = 'Prêmio Final · R38';
  else subtitulo = `${fig.marco}× ${CATEGORIA_LABEL[fig.cat]}`;

  return `
    <div class="galeria-card rar-${rar.cls} ${ninguem ? 'ninguem' : ''}" data-rar="${rar.cls}" onclick="openGaleriaModal(${fig.num})">
      <div class="card-image-wrap">
        <img class="card-image" src="${url}" alt="${escapeAttr(fig.nome)}" loading="lazy"
             onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div class="card-image-fallback" style="display:none">⭐</div>
        <div class="card-image-shade"></div>
        <div class="card-info">
          <div class="card-marco">${numLabel} · ${escapeHtml(subtitulo)}</div>
          <div class="card-name">${escapeHtml(fig.nome)}</div>
          <div class="card-donos">
            ${ninguem ? '<span class="donos-empty">— ninguém ainda</span>' : `<span class="donos-count">${lista.length} ${lista.length === 1 ? 'jogador tem' : 'jogadores têm'}</span>`}
          </div>
        </div>
      </div>
    </div>
  `;
}

function openGaleriaModal(num){
  let info = null;
  if (num === 1){
    info = {cat:'inicial', marco:0, nome:'Escudeiro Sem Nome', subtitulo:'Tier Inicial', criterio:'Todos começam com esta figurinha desbloqueada.', lore:TITULOS_LORE['Escudeiro Sem Nome']};
  } else if (num >= 31){
    const p = PREMIOS_FINAIS.find(x => x.num === num);
    if (!p) return;
    info = {cat:'premio', marco:0, nome:p.nome, subtitulo:`Prêmio Final · R38`, criterio:p.desc, lore:TITULOS_LORE[p.nome]};
  } else {
    for (const cat of Object.keys(CARD_NUM)){
      if (cat === 'inicial') continue;
      const entry = Object.entries(CARD_NUM[cat]).find(([m, n]) => n === num);
      if (entry){
        const marco = parseInt(entry[0]);
        const nome = TITULOS[cat]?.find(t => t[0] === marco)?.[1];
        info = {cat, marco, nome, subtitulo:`${marco}× ${CATEGORIA_LABEL[cat]}`, criterio:critPorCategoria(cat, marco), lore:TITULOS_LORE[nome] || ''};
        break;
      }
    }
  }
  if (!info) return;

  const donos = _portalDonos[num] || [];
  const rar = getRaridade(num);
  const url = getCardUrlByNum(num);
  const modal = document.getElementById('modal');
  modal.style.setProperty('--card-color', rar.cor);

  const donosHtml = donos.length > 0
    ? `<div class="modal-donos">${donos.map(d => `<span class="modal-dono">${escapeHtml(d)}</span>`).join('')}</div>`
    : `<div style="color:var(--text-tertiary);font-style:italic">Nenhum jogador conquistou ainda</div>`;

  document.getElementById('modal-body').innerHTML = `
    <img class="modal-img" src="${url}" alt=""
         onerror="this.outerHTML='<div class=&quot;card-image-fallback&quot; style=&quot;position:relative;height:auto;aspect-ratio:3/4;font-size:5rem&quot;>⭐</div>'">
    <div class="modal-body">
      <div class="modal-tier">
        <span class="rar-pill rar-${rar.cls}" style="margin-right:8px">${rar.label}</span>
        <span style="color:var(--text-tertiary);font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:1.5px;text-transform:uppercase">
          #${String(num).padStart(2,'0')} · ${escapeHtml(info.subtitulo)}
        </span>
      </div>
      <div class="modal-name" style="color:${rar.cor}">${escapeHtml(info.nome)}</div>
      <div class="modal-criterio"><strong>Como conquistar:</strong> ${escapeHtml(info.criterio || '')}</div>
      <div class="modal-section-title">Quem possui (${donos.length}/9)</div>
      ${donosHtml}
      <div class="modal-desc">${escapeHtml(info.lore || '')}</div>
      <button class="btn-share" id="btn-share-${num}" onclick="copiarLinkFigurinha(${num})">🔗 Copiar link</button>
    </div>
  `;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  atualizarUrlCard(num);
}

function critPorCategoria(cat, marco){
  const labels = {
    mvp: `${marco} vez${marco === 1 ? '' : 'es'} em 1º lugar na rodada (MVP)`,
    podio: `${marco} vez${marco === 1 ? '' : 'es'} em 2º ou 3º lugar na rodada (Pódio)`,
    mitada: `${marco} vez${marco === 1 ? '' : 'es'} pontuando ≥ 80 pts numa rodada`,
    massacre: `${marco} ultrapassagem${marco === 1 ? '' : 's'} no ranking acumulado com diferença ≥ 10 pts`,
    recuperacao: `${marco} vez${marco === 1 ? '' : 'es'} pontuando +50 pts a mais que na rodada anterior`,
    lanterna: `${marco} vez${marco === 1 ? '' : 'es'} em último lugar na rodada`,
  };
  return labels[cat] || '';
}

/* ════════════════════════════════════════════════════════════════
   PÁGINA DO JOGADOR (2 abas: Álbum, Lore)
   ════════════════════════════════════════════════════════════════ */

let _ctx = null;

function renderJogador(slug, state){
  const cfg = JOGADORES[slug];
  if (!cfg) return;
  const lord = state ? state.finais.find(f => f.name === cfg.csvKey) : null;
  _ctx = { slug, cfg, lord, state };

  document.documentElement.style.setProperty('--accent', cfg.color);
  document.documentElement.style.setProperty('--accent-soft', hexToRgba(cfg.color, .10));
  document.documentElement.style.setProperty('--accent-strong', hexToRgba(cfg.color, .40));

  /* HEADER compacto */
  document.getElementById('player-header').innerHTML = `
    <a href="../index.html" class="back-link">← Portal</a>
    <a href="../regulamento.html" class="back-link" style="left:auto;right:1rem">Regulamento →</a>
    <div class="header-ornament"><span style="font-size:11px;letter-spacing:4px">✦</span></div>
    <span class="brasao-grande">${cfg.brasao}</span>
    <h1>${escapeHtml(cfg.name)}</h1>
    <div class="header-region">${escapeHtml(cfg.region)}</div>
  `;

  /* STATS COMPACTOS — 3 linhas */
  const sb = document.getElementById('player-stats');
  if (lord){
    const completude = 1 + lord.figurinhas.length;
    const pct = Math.round((completude / 38) * 100);
    const ult = lord.figurinhas[lord.figurinhas.length - 1];

    /* Mini progresso por categoria — emoji por figurinha */
    const catsHtml = PRIORIDADE.map(cat => {
      const total = TITULOS[cat].length;
      const ord = [...TITULOS[cat]].sort((a,b) => a[0] - b[0]);
      const conq = ord.filter(([m]) => lord[cat] >= m).length;
      return `
        <div class="cat-mini">
          <span class="cat-mini-icon">${CATEGORIA_ICON[cat]}</span>
          <span class="cat-mini-count">${conq}/${total}</span>
        </div>
      `;
    }).join('');

    sb.innerHTML = `
      <div class="stats-compact">
        <div class="stats-row1">
          <span class="stats-num">${completude}<span class="stats-num-total">/38</span></span>
          <span class="stats-label">figurinhas</span>
          <div class="stats-bar"><div class="stats-bar-fill" style="width:${pct}%"></div></div>
          <span class="stats-pct">${pct}%</span>
        </div>
        <div class="stats-row2">${catsHtml}</div>
        ${ult ? `
          <div class="stats-row3">
            <span class="stats-row3-label">Última conquista:</span>
            <span class="stats-row3-name">${escapeHtml(ult.nome)}</span>
            <span class="stats-row3-meta">R${ult.rodada}</span>
          </div>` : `
          <div class="stats-row3">
            <span style="color:var(--text-tertiary);font-style:italic">Apenas o Escudeiro Sem Nome até agora</span>
          </div>`}
      </div>
    `;
  }

  renderMural(slug, lord, cfg);
  renderAlbum(slug, lord, cfg);
  renderLore(slug, cfg, lord);

  /* Verifica deep-link ?card=N depois do render */
  abrirCardDoUrl();
}

/* ─── Mural de troféus: 3 figurinhas mais raras + dono único ─── */
function renderMural(slug, lord, cfg){
  const root = document.getElementById('player-mural');
  if (!root || !lord) return;

  /* Lista das figurinhas do jogador (Inicial + conquistadas) com info de raridade e quantos donos */
  const minhas = [
    { num:1, cat:'inicial', marco:0, nome:'Escudeiro Sem Nome' },
    ...lord.figurinhas
  ];
  const donos = _portalDonos || {};

  /* Ordena por raridade desc, depois por exclusividade (menos donos = mais valioso) */
  const enriquecidas = minhas.map(f => {
    const rar = getRaridade(f.num);
    const numDonos = (donos[f.num] || []).length;
    return { ...f, rar, numDonos, ehUnico: numDonos === 1 };
  });
  enriquecidas.sort((a,b) => b.rar.ord - a.rar.ord || a.numDonos - b.numDonos);

  /* Top 3 raras (só mostra se a maior raridade for >= Incomum, senão fica meio bobo) */
  const top = enriquecidas.slice(0, 3);
  const temAlgo = top.some(f => f.rar.ord >= 2);

  /* Conta dono únicos (figurinhas que só esse jogador tem) */
  const unicas = enriquecidas.filter(f => f.ehUnico && f.num !== 1).length;

  if (!temAlgo && unicas === 0){
    root.innerHTML = '';
    return;
  }

  let html = `<div class="mural-block">`;
  if (unicas > 0){
    html += `
      <div class="mural-unicas">
        <span class="mural-unicas-icon">✨</span>
        <span class="mural-unicas-text">Você é dono único de <strong>${unicas} figurinha${unicas === 1 ? '' : 's'}</strong></span>
      </div>
    `;
  }

  if (temAlgo){
    html += `
      <div class="mural-title">
        <span class="mural-title-icon">🏆</span>
        Suas mais raras
      </div>
      <div class="mural-strip">
    `;
    for (const f of top){
      const url = getCardUrlByNum(f.num);
      html += `
        <div class="mural-card rar-${f.rar.cls}" onclick="openCardByNum(${f.num})">
          <img class="mural-card-img" src="${url}" alt="${escapeAttr(f.nome)}" loading="lazy"
               onerror="this.style.display='none'">
          <div class="mural-card-shade"></div>
          ${f.ehUnico ? `<div class="mural-unico-badge">✨ ÚNICO</div>` : ''}
          <div class="mural-card-info">
            <span class="rar-pill rar-${f.rar.cls}" style="font-size:9px;padding:3px 7px;margin-bottom:4px;display:inline-block">${f.rar.label}</span>
            <div class="mural-card-name">${escapeHtml(f.nome)}</div>
          </div>
        </div>
      `;
    }
    html += `</div>`;
  }
  html += `</div>`;
  root.innerHTML = html;
}

function renderAlbum(slug, lord, cfg){
  const root = document.getElementById('s-album');
  let html = `<div class="section-intro">Suas figurinhas. As conquistadas brilham; as bloqueadas mostram o que falta.</div>`;

  /* INICIAL */
  html += `
    <div class="group-title" style="--gt-color:var(--tier-d)">
      <span class="group-title-icon">📜</span>Tier Inicial
    </div>
    <div class="creature-grid">
      ${renderFigurinha('inicial', 0, 'Escudeiro Sem Nome', true, 0)}
    </div>
  `;

  for (const cat of PRIORIDADE){
    const tier = CATEGORIA_TIER[cat];
    const tierColor = `var(--tier-${tier})`;
    const counts = lord ? lord[cat] : 0;
    const conquistadas = TITULOS[cat].filter(([m]) => counts >= m).length;
    const total = TITULOS[cat].length;

    html += `
      <div class="group-title" style="--gt-color:${tierColor}">
        <span class="group-title-icon">${CATEGORIA_ICON[cat]}</span>
        ${CATEGORIA_LABEL[cat]} · ${conquistadas}/${total}
      </div>
      <div class="creature-grid">
    `;
    const ord = [...TITULOS[cat]].sort((a,b) => a[0] - b[0]);
    for (const [marco, nome] of ord){
      const desbloq = counts >= marco;
      html += renderFigurinha(cat, marco, nome, desbloq, counts);
    }
    html += `</div>`;
  }
  root.innerHTML = html;
}

function renderFigurinha(cat, marco, nome, desbloqueado, counts){
  const tier = CATEGORIA_TIER[cat];
  const tierColor = `var(--tier-${tier})`;
  const url = getCardUrl(cat, marco);
  const num = CARD_NUM[cat]?.[marco] || '';
  const numLabel = num ? `#${String(num).padStart(2,'0')}` : '';
  const faltam = cat === 'inicial' ? 0 : (marco - counts);
  const faltamLabel = faltam > 0 ? `Falta ${faltam} ${CATEGORIA_LABEL[cat]}${faltam === 1 ? '' : 's'}` : '';
  const rar = num ? getRaridade(num) : null;
  const rarCls = rar ? `rar-${rar.cls}` : '';

  return `
    <div class="creature-card ${desbloqueado ? 'unlocked' : 'silhouette'} ${rarCls}" style="--card-color:${tierColor}" onclick="openFigurinhaModal('${cat}', ${marco})">
      <div class="card-image-wrap">
        ${url ? `
          <img class="card-image" src="${url}" alt="${escapeAttr(nome)}" loading="lazy"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
          <div class="card-image-fallback" style="display:none">${CATEGORIA_ICON[cat]}</div>
        ` : `<div class="card-image-fallback">${CATEGORIA_ICON[cat]}</div>`}
        <div class="card-image-shade"></div>
        ${desbloqueado ? `<div class="card-stamp">✦</div>` : `<div class="card-locked-overlay"><span>🔒</span></div>`}
        <div class="card-info">
          <div class="card-marco">${numLabel}${cat === 'inicial' ? '' : ' · ' + marco + '× ' + CATEGORIA_LABEL[cat]}</div>
          ${!desbloqueado ? `<div class="card-falta">${escapeHtml(faltamLabel)}</div>` : ''}
          <div class="card-name ${desbloqueado ? '' : 'silhouette-name'}">${escapeHtml(nome)}</div>
        </div>
      </div>
    </div>
  `;
}

function renderLore(slug, cfg, lord){
  const root = document.getElementById('s-lore');
  let html = `
    <div class="section-intro">${escapeHtml(cfg.lore || '')}</div>
    <div style="text-align:center;padding:2rem 0">
      <div class="brasao-grande" style="font-size:5rem">${cfg.brasao}</div>
      <div style="font-family:'Cinzel',serif;color:var(--accent);font-size:14px;letter-spacing:3px;margin-top:.5rem;text-transform:uppercase">${escapeHtml(cfg.region)}</div>
    </div>
  `;
  if (lord && lord.figurinhas.length > 0){
    const ult = lord.figurinhas[lord.figurinhas.length - 1];
    const url = getCardUrlByNum(ult.num);
    const lore = TITULOS_LORE[ult.nome] || '';
    const rar = getRaridade(ult.num);
    html += `
      <div style="max-width:340px;margin:2rem auto 0;background:var(--bg-card);border:1px solid var(--border-strong);border-top:3px solid var(--accent);border-radius:12px;overflow:hidden">
        <img src="${url}" alt="" style="width:100%;aspect-ratio:3/4;object-fit:cover;background:var(--bg-surface)" onerror="this.outerHTML='<div style=&quot;width:100%;aspect-ratio:3/4;display:flex;align-items:center;justify-content:center;font-size:5rem;color:var(--accent);background:var(--bg-surface)&quot;>${CATEGORIA_ICON[ult.cat]}</div>'">
        <div style="padding:1.25rem;text-align:center">
          <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--text-tertiary);letter-spacing:1.5px;text-transform:uppercase">Última Figurinha · R${ult.rodada}</div>
          <div style="font-family:'Cinzel',serif;font-size:1.4rem;font-weight:700;color:var(--accent);margin-top:.4rem">${escapeHtml(ult.nome)}</div>
          <div style="margin-top:.5rem"><span class="rar-pill rar-${rar.cls}">${rar.label}</span></div>
          <div style="font-size:14px;color:var(--text-secondary);margin-top:.75rem;font-style:italic">${escapeHtml(lore)}</div>
        </div>
      </div>
    `;
  }
  root.innerHTML = html;
}

/* ─── Modais ─── */
function openFigurinhaModal(cat, marco){
  let nome, url, lore, num, subtitulo, criterio;
  if (cat === 'inicial'){
    nome = 'Escudeiro Sem Nome';
    url = getCardUrlByNum(1);
    num = 1;
    subtitulo = 'Tier Inicial';
    criterio = 'Todos começam com esta figurinha desbloqueada.';
    lore = TITULOS_LORE[nome];
  } else {
    const t = TITULOS[cat]?.find(t => t[0] === marco);
    if (!t) return;
    nome = t[1];
    url = getCardUrl(cat, marco);
    num = CARD_NUM[cat]?.[marco];
    subtitulo = `${marco}× ${CATEGORIA_LABEL[cat]}`;
    criterio = critPorCategoria(cat, marco);
    lore = TITULOS_LORE[nome] || '';
  }
  const lord = _ctx?.lord;
  const counts = (lord && cat !== 'inicial') ? lord[cat] : 0;
  const desbloqueado = (cat === 'inicial') || counts >= marco;
  const faltam = (cat === 'inicial' || desbloqueado) ? 0 : (marco - counts);
  const rar = getRaridade(num);

  const figConq = lord?.figurinhas.find(f => f.cat === cat && f.marco === marco);

  const status = desbloqueado
    ? `<span style="color:${rar.cor}">✦ Conquistada</span>${figConq ? ` · R${figConq.rodada}` : ''}`
    : `🔒 Bloqueada — falta${faltam === 1 ? '' : 'm'} <strong>${faltam} ${CATEGORIA_LABEL[cat]}${faltam === 1 ? '' : 's'}</strong>`;

  const modal = document.getElementById('modal');
  modal.style.setProperty('--card-color', rar.cor);
  document.getElementById('modal-body').innerHTML = `
    ${url ? `<img class="modal-img ${desbloqueado ? '' : 'silhouette-img'}" src="${url}" alt=""
         onerror="this.outerHTML='<div class=&quot;card-image-fallback&quot; style=&quot;position:relative;height:auto;aspect-ratio:3/4;font-size:5rem&quot;>${CATEGORIA_ICON[cat]}</div>'">` : ''}
    <div class="modal-body">
      <div class="modal-tier">
        <span class="rar-pill rar-${rar.cls}" style="margin-right:8px">${rar.label}</span>
        <span style="color:var(--text-tertiary);font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:1.5px">
          #${String(num).padStart(2,'0')} · ${escapeHtml(subtitulo)}
        </span>
      </div>
      <div class="modal-name" style="color:${rar.cor}">${escapeHtml(nome)}</div>
      <div class="modal-marco">${status}</div>
      <div class="modal-criterio"><strong>Como conquistar:</strong> ${escapeHtml(criterio)}</div>
      <div class="modal-desc">${escapeHtml(lore)}</div>
      <button class="btn-share" id="btn-share-${num}" onclick="copiarLinkFigurinha(${num})">🔗 Copiar link</button>
    </div>
  `;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  atualizarUrlCard(num);
}

function closeCardModal(e){ if (e && e.target !== document.getElementById('modal')) return; closeCardModalDirect(); }
function closeCardModalDirect(){
  const m = document.getElementById('modal');
  if (m) m.classList.remove('open');
  document.body.style.overflow = '';
  /* Limpa o ?card= da URL ao fechar */
  if (window.location.search.includes('card=')){
    const url = new URL(window.location);
    url.searchParams.delete('card');
    window.history.replaceState({}, '', url.pathname + (url.search ? url.search : ''));
  }
}

/* ─── DEEP LINK + SHARE ─── */
function abrirCardDoUrl(){
  const params = new URLSearchParams(window.location.search);
  const cardId = params.get('card');
  if (!cardId) return;
  const num = parseInt(cardId);
  if (isNaN(num) || num < 1 || num > 38) return;
  /* Pequeno delay pra garantir que tudo já renderizou */
  setTimeout(() => openCardByNum(num), 200);
}

/* Abre o modal apropriado a partir do número da figurinha */
function openCardByNum(num){
  if (_ctx){
    /* Estamos numa página de jogador — usa o modal da figurinha (mostra status do jogador) */
    if (num === 1){
      openFigurinhaModal('inicial', 0);
      atualizarUrlCard(num);
      return;
    }
    /* Procura cat+marco pelo número */
    for (const cat of Object.keys(CARD_NUM)){
      if (cat === 'inicial') continue;
      const entry = Object.entries(CARD_NUM[cat]).find(([m, n]) => n === num);
      if (entry){
        openFigurinhaModal(cat, parseInt(entry[0]));
        atualizarUrlCard(num);
        return;
      }
    }
    /* Prêmio final — usa o modal da galeria */
    if (num >= 31){
      openGaleriaModal(num);
      atualizarUrlCard(num);
      return;
    }
  } else {
    /* Estamos no portal — usa o modal da galeria */
    openGaleriaModal(num);
    atualizarUrlCard(num);
  }
}

function atualizarUrlCard(num){
  const url = new URL(window.location);
  url.searchParams.set('card', String(num).padStart(2,'0'));
  window.history.replaceState({}, '', url.pathname + url.search);
}

async function copiarLinkFigurinha(num){
  const baseUrl = window.location.origin + window.location.pathname.replace(/\/jogador\/.*$/, '/');
  /* Sempre aponta pro index do site (mais portátil) */
  const link = `${baseUrl}index.html?card=${String(num).padStart(2,'0')}`;
  const btn = document.getElementById('btn-share-' + num);
  try {
    await navigator.clipboard.writeText(link);
    if (btn){
      const orig = btn.innerHTML;
      btn.innerHTML = '✓ Link copiado!';
      btn.classList.add('copiado');
      setTimeout(() => { btn.innerHTML = orig; btn.classList.remove('copiado'); }, 2500);
    }
  } catch(e){
    /* Fallback: cria input temporário */
    const ta = document.createElement('textarea');
    ta.value = link;
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand('copy'); } catch {}
    document.body.removeChild(ta);
    if (btn){
      btn.innerHTML = '✓ Copiado!';
      setTimeout(() => { btn.innerHTML = '🔗 Copiar link'; }, 2500);
    }
  }
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
  for (const p of ['../dados.csv', './dados.csv']){
    try { const r = await fetch(p + '?t=' + Date.now()); if (r.ok) return await r.text(); } catch {}
  }
  return null;
}

async function initPortal(){
  const csv = await carregarCSV();
  if (!csv){
    document.getElementById('portal-grid').innerHTML = `<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Não foi possível carregar dados.csv</div><div>Sirva os arquivos via HTTP. Ex.: <code>python3 -m http.server</code></div></div>`;
    return;
  }
  const state = processarLiga(csv);
  if (state){
    document.getElementById('hm-rodadas').textContent = state.rodadas.length;
    document.getElementById('hm-jogadores').textContent = state.finais.length;
    const totalFigurinhas = state.finais.reduce((acc, j) => acc + j.figurinhas.length + 1, 0);
    document.getElementById('hm-conquistadas').textContent = totalFigurinhas;
  }
  renderPortal(state);
  abrirCardDoUrl();
}

async function initJogador(slug){
  const csv = await carregarCSV();
  if (!csv){
    document.getElementById('player-header').innerHTML = `<div class="empty"><div class="empty-icon">⚠</div><div class="empty-title">Não foi possível carregar dados.csv</div></div>`;
    return;
  }
  const state = processarLiga(csv);
  /* Necessário: portal-donos pra modal de galeria não usar (mas mesmo assim, cache aqui) */
  _portalState = state;
  _portalDonos = donosPorFigurinha(state);
  renderJogador(slug, state);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeCardModalDirect(); });
}
