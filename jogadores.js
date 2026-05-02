/* ════════════════════════════════════════════════════════════════
   GUERRA DOS REINOS — Config de Jogadores
   ════════════════════════════════════════════════════════════════ */

const JOGADORES = {
  'ironverdict': {
    name: 'Ironverdict',
    csvKey: 'Ironverdict',
    brasao: '⚙',
    color: '#e0b070',
    region: 'Forja de Aço',
    lore: 'Os engenheiros do veredito final. Onde outros vacilam, eles forjam certeza em metal e fogo.',
  },
  'icebergteam': {
    name: 'Icebergteam',
    csvKey: 'Icebergteam',
    brasao: '❄',
    color: '#5ab8e0',
    region: 'Reino de Gelo Eterno',
    lore: 'Frios como o abismo, pacientes como geleiras. O que parece submerso é, na verdade, fundação.',
  },
  'andorinha': {
    name: 'Andorinha',
    csvKey: 'Andorinha',
    brasao: '🦅',
    color: '#88a0d8',
    region: 'Aerie das Alturas',
    lore: 'Voam alto e veem longe. Quando descem, é com precisão de raio em céu limpo.',
  },
  'andorinha-jr': {
    name: 'Andorinha Jr',
    csvKey: 'Andorinha Jr',
    brasao: '🪶',
    color: '#c5d0e0',
    region: 'Ninho do Aprendiz',
    lore: 'A linhagem mais nova. Asas ainda em formação, mas com o sangue dos antigos correndo nas veias.',
  },
  'ceec': {
    name: 'CEEC',
    csvKey: 'CEEC',
    brasao: '🏔',
    color: '#90b890',
    region: 'Picos Sagrados',
    lore: 'Senhores das montanhas eternas. Imutáveis quando precisam ser, devastadores quando escolhem.',
  },
  'lobonegro': {
    name: 'Lobonegro',
    csvKey: 'Lobonegro',
    brasao: '🌑',
    color: '#a878d0',
    region: 'Floresta Sombria',
    lore: 'Caçam sob a lua oculta. Quando o predador é silencioso, a presa nunca vê a chegada.',
  },
  'sons-of-numenor': {
    name: 'Sons of Númenor',
    csvKey: 'Sons of Númenor',
    brasao: '⚔',
    color: '#d4af37',
    region: 'Reino do Mar Antigo',
    lore: 'Descendentes da última grande civilização. Carregam o peso de impérios que afundaram — e a certeza de que se erguem de novo.',
  },
  'varelitas': {
    name: 'Varelitas',
    csvKey: 'Varelitas',
    brasao: '🐺',
    color: '#7ac060',
    region: 'Bosque de Sylvorn',
    lore: 'O bando ancestral das matas. Movem-se em sincronia: quando um caça, todos caçam.',
  },
  'otopatama': {
    name: 'Otopatamá',
    csvKey: 'Otopatamá',
    brasao: '🤖',
    color: '#8090a0',
    region: 'Cidadela Mecânica',
    lore: 'Engrenagens que nunca dormem. Calculam mil cenários enquanto outros ainda escolhem a primeira jogada.',
  },
};

/* Ordem de exibição no portal (você pode reordenar) */
const ORDEM_JOGADORES = [
  'ironverdict','sons-of-numenor','lobonegro','icebergteam','ceec',
  'andorinha','andorinha-jr','varelitas','otopatama'
];

/* Mapeia o csvKey (nome no CSV) para o slug — útil pra encontrar o slug a partir do nome */
const CSVKEY_TO_SLUG = Object.fromEntries(
  Object.entries(JOGADORES).map(([slug, j]) => [j.csvKey, slug])
);
