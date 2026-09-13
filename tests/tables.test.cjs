const {test}=require('node:test');
const assert=require('node:assert/strict');
const {tables,cells,matches}=require('../tables-data.js');
const table=id=>tables.find(t=>t.id===id);
test('article and adjective forms match the source charts',()=>{
  assert.deepEqual(table('definite').values,[['der','die','das','die'],['den','die','das','die'],['dem','der','dem','den'],['des','der','des','der']]);
  assert.deepEqual(table('adjective-strong').values,[['er','e','es','e'],['en','e','es','e'],['em','er','em','en'],['en','er','en','er']]);
  assert.deepEqual(table('adjective-mixed').values,[['er','e','es','en'],['en','e','es','en'],['en','en','en','en'],['en','en','en','en']]);
  assert.deepEqual(table('adjective-weak').values,[['e','e','e','en'],['en','e','e','en'],['en','en','en','en'],['en','en','en','en']]);
});
test('ein has no testable plural, even with Genitiv',()=>{
  assert.equal(cells(table('indefinite')).length,9);
  assert.equal(cells(table('indefinite'),true).length,12);
  assert.ok(cells(table('indefinite'),true).every(c=>c.c<3));
});
test('pronoun columns do not change with the Genitiv toggle',()=>{
  assert.equal(cells(table('personal')).length,27);
  assert.equal(cells(table('reflexive')).length,18);
  assert.deepEqual(cells(table('personal')),cells(table('personal'),true));
  assert.deepEqual(table('reflexive').values.slice(0,2),[['mich','mir'],['dich','dir']]);
});
test('formal address is distinguished from third person forms',()=>{
  assert.equal(matches(table('poss-Ihr'),'ihrem','Ihrem'),false);
  assert.equal(matches(table('personal'),'ihnen','Ihnen'),false);
  assert.equal(matches(table('personal'),' Ihnen ','Ihnen'),true);
  assert.equal(matches(table('poss-ihr'),'Ihre','ihre'),false);
});
test('endings accept an optional hyphen but not a whole adjective',()=>{
  assert.ok(matches(table('adjective-weak'),' -en ','en'));
  assert.ok(matches(table('adjective-weak'),'en','en'));
  assert.equal(matches(table('adjective-weak'),'guten','en'),false);
});
test('euer is shortened before endings and source attribution is complete',()=>{
  assert.deepEqual(table('poss-euer').values,[['euer','eure','euer','eure'],['euren','eure','euer','eure'],['eurem','eurer','eurem','euren'],['eures','eurer','eures','eurer']]);
  assert.equal(tables.length,17);
  assert.ok(tables.every(t=>t.source&&t.note&&t.values.length===t.rows.length&&t.values.every(r=>r.length===t.cols.length)));
});
