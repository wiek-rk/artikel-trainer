const {test}=require('node:test');
const assert=require('node:assert/strict');
const {nvv,preps,grade}=require('../phrases-data.js');
test('all selected patterns have stable unique IDs, meanings and examples',()=>{
  assert.equal(nvv.length,40);assert.equal(preps.length,44);
  for(const deck of [nvv,preps]){assert.equal(new Set(deck.map(i=>i.id)).size,deck.length);assert.ok(deck.every(i=>i.meaning&&i.example))}
  for(const item of nvv)for(const answer of item.answers)assert.ok(grade('nvv',item,answer).ok);
  for(const item of preps)for(const pair of item.pairs)assert.ok(grade('preps',item,pair.prep,pair.grammaticalCase).ok);
});
test('meaning changes the preposition and partner/topic cases stay distinct',()=>{
  const get=id=>preps.find(i=>i.id===id);
  assert.ok(grade('preps',get('freuen-auf'),'auf','Akk').ok);
  assert.equal(grade('preps',get('freuen-auf'),'über','Akk').ok,false);
  assert.ok(grade('preps',get('freuen-ueber'),'ueber','Akkusativ').ok);
  assert.ok(grade('preps',get('sprechen-mit'),'mit','Dat').ok);
  assert.equal(grade('preps',get('sprechen-mit'),'mit','Akk').ok,false);
  assert.ok(grade('preps',get('sprechen-ueber'),'von','Dativ').ok);
  assert.equal(grade('preps',get('sprechen-ueber'),'von','Akkusativ').ok,false);
  assert.ok(grade('preps',get('bestehen-auf'),'auf','Dativ').ok);
  assert.ok(grade('preps',get('teilnehmen-an'),'an','Dativ').ok);
});
test('common equivalents and German keyboard alternatives work without accepting conjugation',()=>{
  assert.ok(grade('nvv',nvv.find(i=>i.id==='decision'),' fällen ').ok);
  assert.ok(grade('nvv',nvv.find(i=>i.id==='contract'),'abschliessen').ok);
  assert.ok(grade('nvv',nvv.find(i=>i.id==='keep-promise'),'halten').ok);
  assert.equal(grade('nvv',nvv.find(i=>i.id==='keep-promise'),'brechen').ok,false);
  assert.equal(grade('nvv',nvv.find(i=>i.id==='decision'),'trifft').ok,false);
});
