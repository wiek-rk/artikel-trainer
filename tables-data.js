/* Grammar forms checked against the user's B2 charts; see SOURCES.md.
   Explanations and practice presentation are original. No PDF or dictionary data is bundled. */
(function (host) {
  'use strict';
  const cases = ['Nominativ', 'Akkusativ', 'Dativ', 'Genitiv'];
  const genders = ['Maskulin', 'Feminin', 'Neutrum', 'Plural'];
  const sources = {
    articles: 'B2 article and pronoun charts',
    genitive: 'B2 Genitiv chart',
    adjectives: 'B2 adjective-ending charts',
    reflexive: 'B2 reflexive-pronoun charts'
  };
  const tables = [];
  function add(id, title, group, values, note, source, extra = {}) {
    tables.push({id, title, group, rows: cases, cols: genders, values, note, source, ...extra});
  }
  const articleSource = sources.articles + '; Genitiv: ' + sources.genitive;
  add('definite', 'Bestimmte Artikel · der / die / das', '1 · Articles',
    [['der','die','das','die'],['den','die','das','die'],['dem','der','dem','den'],['des','der','des','der']],
    'Start with the first three cases. Notice: only masculine changes from Nominativ to Akkusativ. Dativ plural uses den; the noun often also takes -n.', articleSource);
  add('indefinite', 'Unbestimmte Artikel · ein', '1 · Articles',
    [['ein','eine','ein',null],['einen','eine','ein',null],['einem','einer','einem',null],['eines','einer','eines',null]],
    'Ein has no plural. The dash means “no form” and is never tested. Plural nouns without a determiner use the adjective table “Ohne Artikel”.', articleSource);
  const einEndings = [['','e','','e'],['en','e','','e'],['em','er','em','en'],['es','er','es','er']];
  const inflect = stem => einEndings.map(row => row.map(ending => (stem === 'euer' && ending ? 'eur' : stem) + ending));
  add('negative', 'Negativartikel · kein', '1 · Articles', inflect('kein'),
    'Kein follows the ein pattern in the singular and also has plural forms: keine, keine, keinen, keiner.', articleSource + ' (Genitiv follows the ein pattern)');
  const derEndings = [['er','e','es','e'],['en','e','es','e'],['em','er','em','en'],['es','er','es','er']];
  for (const [id,stem,label] of [['dieser','dies','Demonstrativartikel · dieser'],['welcher','welch','Frageartikel · welcher']]) {
    add(id,label,'1 · Articles',derEndings.map(row=>row.map(e=>stem+e)),
      'Used before a noun, these determiners show its gender, number and case. They use the der-word pattern.', articleSource + (id === 'welcher' ? ' (Genitiv extended using the der-word pattern)' : ''));
  }
  for (const [stem,meaning] of [['mein','my'],['dein','your · informal singular'],['sein','his / its'],['ihr','her / their'],['Ihr','your · formal'],['unser','our'],['euer','your · informal plural']]) {
    add('poss-'+stem, 'Possessivartikel · '+stem+' ('+meaning+')', '2 · Possessives', inflect(stem),
      'The owner chooses the stem; the noun’s gender, number and case choose the ending. ' +
      (stem === 'euer' ? 'Practise the chart’s shortened forms: euer → eure, euren, eurem, eurer, eures.' : stem === 'Ihr' ? 'Keep the capital I for formal address: Ihr, Ihre, Ihrem.' : 'Use the same endings as kein.'), articleSource,
      {caseSensitive: stem === 'Ihr' || stem === 'ihr'});
  }
  const people = ['ich · I','du · you (sing.)','er · he','es · it','sie · she','Sie · formal you','sie · they','wir · we','ihr · you (pl.)'];
  add('personal','Personalpronomen','3 · Pronouns',
    [['ich','mich','mir'],['du','dich','dir'],['er','ihn','ihm'],['es','es','ihm'],['sie','sie','ihr'],['Sie','Sie','Ihnen'],['sie','sie','ihnen'],['wir','uns','uns'],['ihr','euch','euch']],
    'Learn the person across cases. Capital letters distinguish formal Sie / Ihnen from sie / ihnen. Type the form as shown in the chart.', sources.articles,
    {rows: people, cols: cases.slice(0,3), kind:'pronoun', caseSensitive:true});
  add('reflexive','Reflexivpronomen · mich / mir / sich','3 · Pronouns',
    [['mich','mir'],['dich','dir'],['sich','sich'],['sich','sich'],['sich','sich'],['sich','sich'],['sich','sich'],['uns','uns'],['euch','euch']],
    'Only ich and du differ between Akkusativ and Dativ: mich / mir, dich / dir. Compare: Ich wasche mich. Ich wasche mir die Hände.', sources.reflexive,
    {rows: people, cols: ['Akkusativ','Dativ'], kind:'pronoun'});
  add('adjective-weak','Adjektive · after der / dieser','4 · Adjective endings',
    [['e','e','e','en'],['en','e','e','en'],['en','en','en','en'],['en','en','en','en']],
    'Weak endings: der gute Tee, das gute Brot. Dativ, Genitiv and every plural cell take -en. Type only the ending, with or without its hyphen.', sources.adjectives, {kind:'ending'});
  add('adjective-mixed','Adjektive · after ein / kein / mein','4 · Adjective endings',
    [['er','e','es','en'],['en','e','es','en'],['en','en','en','en'],['en','en','en','en']],
    'Mixed endings: ein guter Tee, ein gutes Brot. The plural column applies to keine / meine etc., not ein: meine guten Bücher. Type only the ending.', sources.adjectives, {kind:'ending'});
  add('adjective-strong','Adjektive · without an article','4 · Adjective endings',
    [['er','e','es','e'],['en','e','es','e'],['em','er','em','en'],['en','er','en','er']],
    'Strong endings: guter Tee, kaltes Wasser. Notice Genitiv masculine and neuter: -en, not -es. Type only the ending.', sources.adjectives, {kind:'ending'});
  function cells(table, includeGenitive = false) {
    return table.values.flatMap((row,r) => row.flatMap((answer,c) =>
      answer === null || (!includeGenitive && table.kind !== 'pronoun' && r === 3) ? [] :
        [{id:table.id+':'+r+':'+c, table:table.id, r, c, answer, row:table.rows[r], col:table.cols[c]}]));
  }
  function matches(table, value, answer) {
    let normalized = value.trim().normalize('NFC');
    if (table.kind === 'ending') normalized = normalized.replace(/^[-−–]\s*/, '');
    return table.caseSensitive ? normalized === answer : normalized.toLocaleLowerCase('de') === answer.toLocaleLowerCase('de');
  }
  const api = {tables,cells,matches};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else host.GermanTables = api;
})(globalThis);
