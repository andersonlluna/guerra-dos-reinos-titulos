/* ════════════════════════════════════════════════════════════════
   GUERRA DOS REINOS — Motor JS · v3 · Álbum Colecionável
   ════════════════════════════════════════════════════════════════ */

const IMG_BASE = 'https://cdn.jsdelivr.net/gh/andersonlluna/guerra-dos-reinos-titulos@main/imagens';
const IMG_EXT  = 'jpg';

/* ─── Engine (mantém regras de cálculo do Cartola) ─── */
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

/* ─── Parse CSV + processarLiga ─── */
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
      g2:0, ptsCartola:0, pts:[], posPorRodada:[],
      figurinhas:[],   // [{cat, marco, nome, num, rodada}]
    };
  });

  /* Helper: registra desbloqueios verificando se um marco foi atingido na rodada */
  function checkDesbloqueio(j, cat, antes, depois, rodada){
    if (!CARD_NUM[cat]) return;
    Object.entries(CARD_NUM[cat]).forEach(([marco, num]) => {
      const m = parseInt(marco);
      if (antes < m && depois >= m){
        const titEntry = TITULOS[cat]?.find(t => t[0] === m);
        if (titEntry){
          estado[j].figurinhas.push({
            cat, marco:m, nome:titEntry[1], num, rodada
          });
        }
      }
    });
  }

  let acumAntes = jogadoresCsv.map(j => ({name:j, mvp:0, mitada:0, recuperacao:0, massacre:0, podio:0, lanterna:0, g2:0, ptsCartola:0}));
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

    /* Cálculo do massacre (escalada de ranking) */
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

    /* Atualiza acumAntes pra próxima rodada e registra posição */
    acumAntes = jogadoresCsv.map(j => ({name:j, pm:calcPM(j), ptsCartola:estado[j].ptsCartola}))
      .sort((a,b) => b.pm - a.pm || b.ptsCartola - a.ptsCartola);
    acumAntes.forEach((entry, posIdx) => {
      estado[entry.name].posPorRodada.push({rodada:r, pos:posIdx+1});
    });
  }

  /* Estado final */
  const finais = jogadoresCsv.map(j => {
    const l = estado[j];
    const breakdown = {};
    PRIORIDADE.forEach(cat => {
      breakdown[cat] = {
        count: l[cat],
        proximo: proximoMarco(cat, l[cat]),
      };
    });
    const rodadasJogadas = l.pts.filter(p => p !== undefined).length;
    const mediaCartola = rodadasJogadas > 0 ? l.ptsCartola / rodadasJogadas : 0;
    return {...l, breakdown, mediaCartola, rodadasJogadas};
  });

  /* Posição final pra cálculos de prêmios (sem expor pro UI) */
  const calcPM_final = j => {
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
  finais.forEach(f => f._pm = calcPM_final(f));
  finais.sort((a,b) => b._pm - a._pm || b.ptsCartola - a.ptsCartola);

  return {
    finais, rodadas,
    ultimaRodada: rodadas[rodadas.length-1],
    estado,
  };
}

/* ─── Cálculo de Raridade Global ─── */
const RARIDADE_TIERS = [
  { min:0, max:0, label:'Mítica',   cls:'mythic',   color:'var(--rar-mythic)' },
  { min:1, max:1, label:'Lendária', cls:'legend',   color:'var(--rar-legend)' },
  { min:2, max:2, label:'Épica',    cls:'epic',     color:'var(--rar-epic)' },
  { min:3, max:4, label:'Rara',     cls:'rare',     color:'var(--rar-rare)' },
  { min:5, max:7, label:'Incomum',  cls:'uncommon', color:'var(--rar-uncommon)' },
  { min:8, max:99,label:'Comum',    cls:'common',   color:'var(--rar-common)' },
];

function tierRaridade(count){
  return RARIDADE_TIERS.find(t => count >= t.min && count <= t.max) || RARIDADE_TIERS[RARIDADE_TIERS.length-1];
}

function calcularRaridades(state){
  /* Pra cada figurinha (1-30 + 31-38), conta quantos jogadores conquistaram */
  const counts = {};   // num → { donos:[name, name], count:N }
  const donosPorFigurinha = {};

  /* Inicializa todas 38 com count 0 */
  for (let n = 1; n <= 38; n++) donosPorFigurinha[n] = [];

  /* Inicial (#01): todo mundo tem */
  state.finais.forEach(j => donosPorFigurinha[1].push(j.name));

  /* Progressivos (figurinhas conquistadas via figurinhas[]) */
  state.finais.forEach(j => {
    j.figurinhas.forEach(fig => {
      donosPorFigurinha[fig.num].push(j.name);
    });
  });

  /* Prêmios Finais (31-38): líder atual "tem" preview */
  const lideres = calcularPremiosFinais(state);
  PREMIOS_FINAIS.forEach(p => {
    if (lideres[p.id]) donosPorFigurinha[p.num].push(lideres[p.id]);
  });

  return donosPorFigurinha;
}

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

/* ─── Stats por jogador (álbum-foco) ─── */
function statsAlbum(jogador){
  const totalConquistadas = 1 + jogador.figurinhas.length;  // +1 do Inicial
  const completude = totalConquistadas;
  const ultimaFig = jogador.figurinhas.length > 0
    ? jogador.figurinhas[jogador.figurinhas.length - 1]
    : null;
  return { completude, total: 38, ultimaFig };
}

function figurinhaMaisRara(jogador, donosPorFigurinha){
  /* Procura a figurinha do jogador com menor número de donos (mais rara) */
  const minhas = [{cat:'inicial', marco:0, num:1, nome:'Escudeiro Sem Nome'}, ...jogador.figurinhas];
  let mais = null; let minDonos = 999;
  minhas.forEach(fig => {
    const c = donosPorFigurinha[fig.num]?.length || 0;
    /* desempate: figurinha com maior marco (mais difícil) */
    if (c < minDonos || (c === minDonos && fig.marco > (mais?.marco || 0))){
      minDonos = c; mais = {...fig, donos:c};
    }
  });
  return mais;
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

function renderPortal(state){
  if (!state) return;
  const donos = calcularRaridades(state);

  const portal = document.getElementById('portal-grid');
  if (!portal) return;

  let html = '';
  for (const slug of ORDEM_JOGADORES){
    const cfg = JOGADORES[slug];
    const lord = state.finais.find(f => f.name === cfg.csvKey);
    if (!lord){
      html += renderPortalCardEmpty(slug, cfg);
      continue;
    }
    const stats = statsAlbum(lord);
    const rara = figurinhaMaisRara(lord, donos);
    const raraTier = rara ? tierRaridade(donos[rara.num].length) : null;
    const completudePct = Math.round((stats.completude / stats.total) * 100);

    html += `
      <a class="portal-card" href="./jogador/${slug}.html" style="--portal-color:${cfg.color}">
        <div class="portal-bg"></div>
        <div class="portal-shade"></div>
        <div class="portal-line"></div>
        <div class="portal-arrow">→</div>
        <div class="portal-content">
          <div class="portal-meta">
            <span class="portal-region">${escapeHtml(cfg.region)}</span>
            <span class="portal-completude">${stats.completude}/${stats.total}</span>
          </div>
          <div>
            <div class="portal-brasao">${cfg.brasao}</div>
            <div class="portal-name">${escapeHtml(cfg.name)}</div>
            <div class="portal-bar"><div class="portal-bar-fill" style="width:${completudePct}%"></div></div>
            ${rara ? `
              <div class="portal-rare">
                <span class="rare-label" style="color:${raraTier.color}">${raraTier.label}</span>
                <span class="rare-name">${escapeHtml(rara.nome)}</span>
              </div>` : `<div class="portal-rare"><span style="color:var(--text-tertiary);font-style:italic;font-size:11px">só Escudeiro Sem Nome</span></div>`}
          </div>
        </div>
      </a>
    `;
  }
  portal.innerHTML = html;
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

/* ════════════════════════════════════════════════════════════════
   PÁGINA DO JOGADOR
   ════════════════════════════════════════════════════════════════ */

let _ctx = null;   // { slug, cfg, lord, state, donos }

function renderJogador(slug, state){
  const cfg = JOGADORES[slug];
  if (!cfg) return;
  const lord = state ? state.finais.find(f => f.name === cfg.csvKey) : null;
  const donos = state ? calcularRaridades(state) : {};
  _ctx = { slug, cfg, lord, state, donos };

  document.documentElement.style.setProperty('--accent', cfg.color);
  document.documentElement.style.setProperty('--accent-soft', hexToRgba(cfg.color, .10));
  document.documentElement.style.setProperty('--accent-strong', hexToRgba(cfg.color, .40));

  /* HEADER */
  const hd = document.getElementById('player-header');
  const stats = lord ? statsAlbum(lord) : null;
  hd.innerHTML = `
    <a href="../index.html" class="back-link">← Portal</a>
    <a href="../regulamento.html" class="back-link" style="left:auto;right:1rem">Regulamento →</a>
    <div class="header-ornament"><span style="font-size:11px;letter-spacing:4px">✦</span></div>
    <span class="brasao-grande">${cfg.brasao}</span>
    <h1>${escapeHtml(cfg.name)}</h1>
    <div class="header-region">${escapeHtml(cfg.region)}</div>
  `;

  /* COMPLETUDE BAR */
  const sb = document.getElementById('player-stats');
  if (lord && stats){
    const pct = Math.round((stats.completude / stats.total) * 100);
    sb.innerHTML = `
      <div class="completude-block">
        <div class="completude-row">
          <span class="completude-label">Coleção</span>
          <span class="completude-val">${stats.completude}<span style="opacity:.5">/${stats.total}</span></span>
          <span class="completude-pct">${pct}%</span>
        </div>
        <div class="completude-bar"><div class="completude-bar-fill" style="width:${pct}%"></div></div>
        ${stats.ultimaFig ? `
          <div class="completude-last">
            <span class="completude-last-label">Última figurinha:</span>
            <span class="completude-last-name">${escapeHtml(stats.ultimaFig.nome)}</span>
            <span class="completude-last-meta">na R${stats.ultimaFig.rodada}</span>
          </div>` : `
          <div class="completude-last">
            <span style="color:var(--text-tertiary);font-style:italic">Apenas o Escudeiro Sem Nome até agora</span>
          </div>`}
      </div>
      ${renderProgressoPorCategoria(lord)}
    `;
  } else {
    sb.innerHTML = `<div class="completude-block"><div class="completude-row"><span style="color:var(--text-tertiary)">Sem dados</span></div></div>`;
  }

  renderAlbum(slug, lord, cfg);
  renderGaleria(slug, lord, cfg, state, donos);
  renderPremios(slug, lord, cfg, state);
  renderLore(slug, cfg, lord);
}

function renderProgressoPorCategoria(lord){
  let html = `<div class="progresso-cats">`;
  for (const cat of PRIORIDADE){
    const total = TITULOS[cat].length;
    const tab = [...TITULOS[cat]].sort((a,b) => a[0] - b[0]);
    const conquistadas = tab.filter(([m]) => lord[cat] >= m).length;
    const stickers = tab.map(([m]) =>
      lord[cat] >= m ? `<span class="sticker filled" style="color:var(--tier-${CATEGORIA_TIER[cat]})">${CATEGORIA_ICON[cat]}</span>`
                     : `<span class="sticker empty">○</span>`
    ).join('');
    html += `
      <div class="progresso-cat">
        <span class="progresso-label">${CATEGORIA_LABEL[cat]}</span>
        <span class="progresso-stickers">${stickers}</span>
        <span class="progresso-count">${conquistadas}/${total}</span>
      </div>
    `;
  }
  html += `</div>`;
  return html;
}

function renderAlbum(slug, lord, cfg){
  const root = document.getElementById('s-album');
  let html = `<div class="section-intro">O álbum dos seus feitos. Figurinhas conquistadas brilham — as bloqueadas são silhuetas, esperando o feito necessário.</div>`;

  /* INICIAL */
  html += `
    <div class="group-title" style="--gt-color:var(--tier-d)">
      <span class="group-title-icon">📜</span>
      Tier Inicial
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

  return `
    <div class="creature-card ${desbloqueado ? 'unlocked' : 'silhouette'}" style="--card-color:${tierColor}" onclick="openFigurinhaModal('${cat}', ${marco})">
      <div class="card-image-wrap">
        ${url ? `
          <img class="card-image" src="${url}" alt="${escapeAttr(nome)}" loading="lazy"
               onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
          <div class="card-image-fallback" style="display:none">${CATEGORIA_ICON[cat]}</div>
        ` : `<div class="card-image-fallback">${CATEGORIA_ICON[cat]}</div>`}
        <div class="card-image-shade"></div>
        ${desbloqueado ? '<div class="card-tier-line"></div>' : ''}
        ${desbloqueado ? `<div class="card-num-badge">${numLabel}</div>` : ''}
        ${desbloqueado ? `<div class="card-stamp">✦</div>` : `<div class="card-locked-overlay"><span>🔒</span></div>`}
        <div class="card-info">
          ${!desbloqueado ? `<div class="card-falta">${escapeHtml(faltamLabel)}</div>` : ''}
          <div class="card-name ${desbloqueado ? '' : 'silhouette-name'}">${escapeHtml(nome)}</div>
          ${desbloqueado ? `<div class="card-marco">${cat === 'inicial' ? 'Inicial' : marco + '× ' + CATEGORIA_LABEL[cat]}</div>` : ''}
        </div>
      </div>
    </div>
  `;
}

function renderGaleria(slug, lord, cfg, state, donos){
  const root = document.getElementById('s-galeria');
  if (!root || !state) return;

  let html = `
    <div class="section-intro">
      As 38 figurinhas da liga. Ao lado de cada uma, sua <strong>raridade</strong> baseada em quantos invocadores já conquistaram.
      As que <strong>você possui</strong> ficam destacadas.
    </div>
    <div class="raridade-legenda">
      ${RARIDADE_TIERS.map(t => `<span class="rar-pill rar-${t.cls}">${t.label}</span>`).join('')}
    </div>
  `;

  /* Agrupa: Inicial + Progressivas + Prêmios */
  /* Renderiza em 1 grid grande agrupado por categoria */
  const ordemNum = [];
  ordemNum.push({num:1, cat:'inicial', marco:0, nome:'Escudeiro Sem Nome'});
  for (const cat of ['mvp','podio','mitada','massacre','recuperacao','lanterna']){
    const ord = [...TITULOS[cat]].sort((a,b) => a[0] - b[0]);
    for (const [marco, nome] of ord){
      const num = CARD_NUM[cat]?.[marco];
      if (num) ordemNum.push({num, cat, marco, nome});
    }
  }
  /* Prêmios finais */
  PREMIOS_FINAIS.forEach(p => ordemNum.push({num:p.num, cat:'premio', marco:0, nome:p.nome, premio:p}));

  html += `<div class="galeria-grid">`;
  for (const fig of ordemNum){
    html += renderGaleriaCard(fig, donos, cfg);
  }
  html += `</div>`;

  root.innerHTML = html;
}

function renderGaleriaCard(fig, donos, jogadorCfg){
  const lista = donos[fig.num] || [];
  const tier = tierRaridade(lista.length);
  const url = getCardUrlByNum(fig.num);
  const ehMeu = lista.includes(jogadorCfg.csvKey);
  const ehPremio = fig.cat === 'premio';

  const numLabel = `#${String(fig.num).padStart(2,'0')}`;
  let subtitulo;
  if (fig.cat === 'inicial') subtitulo = 'Inicial';
  else if (ehPremio) subtitulo = 'Prêmio Final · R38';
  else subtitulo = `${fig.marco}× ${CATEGORIA_LABEL[fig.cat]}`;

  return `
    <div class="galeria-card ${ehMeu ? 'meu' : ''} rar-${tier.cls}" onclick="openGaleriaModal(${fig.num})">
      <div class="card-image-wrap">
        <img class="card-image" src="${url}" alt="${escapeAttr(fig.nome)}" loading="lazy"
             onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div class="card-image-fallback" style="display:none">⭐</div>
        <div class="card-image-shade"></div>
        <div class="rar-line" style="background:${tier.color}"></div>
        <div class="rar-tag" style="color:${tier.color};border-color:${tier.color}">${tier.label}</div>
        ${ehMeu ? `<div class="card-stamp small">✦</div>` : ''}
        <div class="card-info">
          <div class="card-marco" style="color:${tier.color}">${numLabel} · ${escapeHtml(subtitulo)}</div>
          <div class="card-name">${escapeHtml(fig.nome)}</div>
          <div class="rar-count">${lista.length}/9 invocadores</div>
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
      Os <strong>8 prêmios finais</strong> são revelados apenas na <strong>Rodada 38</strong>.
      Abaixo, os líderes atuais — sujeitos a mudança até a última rodada.
    </div>
  `;
  html += `
    <div class="group-title" style="--gt-color:${tierS}">
      <span class="group-title-icon">🏛</span>
      Pódio Final
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
      Especiais
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

  return `
    <div class="creature-card silhouette premio" style="--card-color:var(--tier-s)" onclick="openPremioModal('${premio.id}')">
      <div class="card-image-wrap">
        <img class="card-image" src="${url}" alt="${escapeAttr(premio.nome)}" loading="lazy"
             onerror="this.style.display='none';this.nextElementSibling.style.display='flex'">
        <div class="card-image-fallback" style="display:none">⭐</div>
        <div class="card-image-shade"></div>
        <div class="card-tier-line"></div>
        <div class="card-num-badge">#${String(premio.num).padStart(2,'0')}</div>
        ${ehLider
          ? `<div class="card-stamp gold">★</div><div class="lidera-tag">VOCÊ LIDERA</div>`
          : (liderAtual ? `<div class="lider-tag">↳ ${escapeHtml(liderAtual)}</div>` : `<div class="lider-tag empty">— sem favorito</div>`)}
        <div class="card-info">
          <div class="card-marco" style="color:var(--tier-s)">PRÊMIO FINAL · R38</div>
          <div class="card-name">${escapeHtml(premio.nome)}</div>
          <div class="card-falta">${escapeHtml(premio.desc)}</div>
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
    html += `
      <div style="max-width:340px;margin:2rem auto 0;background:var(--bg-card);border:1px solid var(--border-strong);border-top:3px solid var(--accent);border-radius:12px;overflow:hidden">
        <img src="${url}" alt="" style="width:100%;aspect-ratio:3/4;object-fit:cover;background:var(--bg-surface)" onerror="this.outerHTML='<div style=&quot;width:100%;aspect-ratio:3/4;display:flex;align-items:center;justify-content:center;font-size:5rem;color:var(--accent);background:var(--bg-surface)&quot;>${CATEGORIA_ICON[ult.cat]}</div>'">
        <div style="padding:1.25rem;text-align:center">
          <div style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--text-tertiary);letter-spacing:1.5px;text-transform:uppercase">Última Figurinha · R${ult.rodada}</div>
          <div style="font-family:'Cinzel',serif;font-size:1.3rem;font-weight:700;color:var(--accent);margin-top:.4rem">${escapeHtml(ult.nome)}</div>
          <div style="font-size:13px;color:var(--text-secondary);margin-top:.75rem;font-style:italic">${escapeHtml(lore)}</div>
        </div>
      </div>
    `;
  }
  root.innerHTML = html;
}

/* ─── Modais ─── */
function openFigurinhaModal(cat, marco){
  let nome, url, lore, num, subtitulo;
  if (cat === 'inicial'){
    nome = 'Escudeiro Sem Nome';
    url = getCardUrlByNum(1);
    num = 1;
    subtitulo = 'Tier Inicial';
    lore = TITULOS_LORE[nome];
  } else {
    const t = TITULOS[cat]?.find(t => t[0] === marco);
    if (!t) return;
    nome = t[1];
    url = getCardUrl(cat, marco);
    num = CARD_NUM[cat]?.[marco];
    subtitulo = `${marco}× ${CATEGORIA_LABEL[cat]}`;
    lore = TITULOS_LORE[nome] || '';
  }
  const lord = _ctx?.lord;
  const counts = (lord && cat !== 'inicial') ? lord[cat] : 0;
  const desbloqueado = (cat === 'inicial') || counts >= marco;
  const faltam = (cat === 'inicial' || desbloqueado) ? 0 : (marco - counts);

  const tierColor = `var(--tier-${CATEGORIA_TIER[cat]})`;
  const status = desbloqueado
    ? `<span style="color:${tierColor}">✦ Conquistada</span>${cat !== 'inicial' && lord && lord.figurinhas.find(f => f.cat === cat && f.marco === marco) ? ` · R${lord.figurinhas.find(f => f.cat === cat && f.marco === marco).rodada}` : ''}`
    : `🔒 Bloqueada — falta${faltam === 1 ? '' : 'm'} <strong>${faltam} ${CATEGORIA_LABEL[cat]}${faltam === 1 ? '' : 's'}</strong>`;

  const modal = document.getElementById('modal');
  modal.style.setProperty('--card-color', tierColor);
  document.getElementById('modal-body').innerHTML = `
    ${url ? `<img class="modal-img ${desbloqueado ? '' : 'silhouette-img'}" src="${url}" alt=""
         onerror="this.outerHTML='<div class=&quot;card-image-fallback&quot; style=&quot;position:relative;height:auto;aspect-ratio:3/4;font-size:5rem&quot;>${CATEGORIA_ICON[cat]}</div>'">` : ''}
    <div class="modal-body">
      <div class="modal-tier">
        <span style="color:${tierColor};font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase">
          #${String(num).padStart(2,'0')} · ${escapeHtml(subtitulo)}
        </span>
      </div>
      <div class="modal-name" style="color:${tierColor}">${escapeHtml(nome)}</div>
      <div class="modal-marco">${status}</div>
      <div class="modal-desc">${escapeHtml(lore)}</div>
    </div>
  `;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function openGaleriaModal(num){
  /* Encontra o que é #num */
  let info = null;
  if (num === 1){
    info = {cat:'inicial', marco:0, nome:'Escudeiro Sem Nome', subtitulo:'Tier Inicial', lore:TITULOS_LORE['Escudeiro Sem Nome']};
  } else if (num >= 31){
    const p = PREMIOS_FINAIS.find(x => x.num === num);
    if (!p) return;
    info = {cat:'premio', marco:0, nome:p.nome, subtitulo:`Prêmio Final · ${p.desc}`, lore:TITULOS_LORE[p.nome]};
  } else {
    /* Procura nos progressivos */
    for (const cat of Object.keys(CARD_NUM)){
      if (cat === 'inicial') continue;
      const entry = Object.entries(CARD_NUM[cat]).find(([m, n]) => n === num);
      if (entry){
        const marco = parseInt(entry[0]);
        const nome = TITULOS[cat]?.find(t => t[0] === marco)?.[1];
        info = {cat, marco, nome, subtitulo:`${marco}× ${CATEGORIA_LABEL[cat]}`, lore:TITULOS_LORE[nome] || ''};
        break;
      }
    }
  }
  if (!info) return;

  const donos = _ctx?.donos[num] || [];
  const tier = tierRaridade(donos.length);
  const url = getCardUrlByNum(num);

  const modal = document.getElementById('modal');
  modal.style.setProperty('--card-color', tier.color);

  const donosHtml = donos.length > 0
    ? `<div class="modal-donos">
         ${donos.map(d => `<span class="modal-dono ${d === _ctx?.cfg?.csvKey ? 'me' : ''}">${escapeHtml(d)}</span>`).join('')}
       </div>`
    : `<div style="color:var(--text-tertiary);font-style:italic">Nenhum invocador conquistou ainda</div>`;

  document.getElementById('modal-body').innerHTML = `
    <img class="modal-img" src="${url}" alt=""
         onerror="this.outerHTML='<div class=&quot;card-image-fallback&quot; style=&quot;position:relative;height:auto;aspect-ratio:3/4;font-size:5rem&quot;>⭐</div>'">
    <div class="modal-body">
      <div class="modal-tier">
        <span style="color:${tier.color};font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase">
          #${String(num).padStart(2,'0')} · ${escapeHtml(info.subtitulo)}
        </span>
      </div>
      <div class="modal-name" style="color:${tier.color}">${escapeHtml(info.nome)}</div>
      <div class="modal-marco">
        <span class="rar-pill rar-${tier.cls}" style="margin-right:8px">${tier.label}</span>
        ${donos.length}/9 invocadores
      </div>
      ${donosHtml}
      <div class="modal-desc" style="margin-top:1rem">${escapeHtml(info.lore || '')}</div>
    </div>
  `;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function openPremioModal(id){
  const premio = PREMIOS_FINAIS.find(p => p.id === id);
  if (!premio) return;
  const tierColor = `var(--tier-s)`;
  const lideres = calcularPremiosFinais(_ctx?.state);
  const lider = lideres[premio.id];
  const ehLider = lider === _ctx?.cfg?.csvKey;
  const lore = TITULOS_LORE[premio.nome] || '';

  const modal = document.getElementById('modal');
  modal.style.setProperty('--card-color', tierColor);

  const status = ehLider
    ? `<span style="color:${tierColor}">★ Você lidera atualmente</span> — defenda até R38`
    : (lider ? `Líder atual: <strong style="color:${tierColor}">${escapeHtml(lider)}</strong>` : 'Sem favorito definido');

  document.getElementById('modal-body').innerHTML = `
    <img class="modal-img" src="${getCardUrlByNum(premio.num)}" alt=""
         onerror="this.outerHTML='<div class=&quot;card-image-fallback&quot; style=&quot;position:relative;height:auto;aspect-ratio:3/4;font-size:5rem&quot;>⭐</div>'">
    <div class="modal-body">
      <div class="modal-tier">
        <span style="color:${tierColor};font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase">
          #${String(premio.num).padStart(2,'0')} · Prêmio Final · R38
        </span>
      </div>
      <div class="modal-name" style="color:${tierColor}">${escapeHtml(premio.nome)}</div>
      <div class="modal-marco">${status}</div>
      <div class="modal-desc"><strong>Critério:</strong> ${escapeHtml(premio.desc)}<br><br><em>${escapeHtml(lore)}</em></div>
    </div>
  `;
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCardModal(e){ if (e && e.target !== document.getElementById('modal')) return; closeCardModalDirect(); }
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
    /* Estatística leve no header: total de figurinhas distribuídas */
    const totalFigurinhas = state.finais.reduce((acc, j) => acc + j.figurinhas.length + 1, 0);
    document.getElementById('hm-conquistadas').textContent = totalFigurinhas;
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
