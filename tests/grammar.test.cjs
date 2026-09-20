const {test}=require('node:test');
const assert=require('node:assert/strict');
const {prepositionGroups,caseRounds,connectorGroups,clauseRounds,normalizeCase}=require('../grammar-data.js');
test('preposition groups are distinct and include the core fixed and two-way sets',()=>{
  assert.deepEqual(prepositionGroups.akkusativ,['bis','durch','für','gegen','ohne','um']);
  assert.ok(prepositionGroups.dativ.includes('mit'));
  assert.ok(prepositionGroups.wechsel.includes('an'));
  assert.ok(prepositionGroups.genitiv.includes('wegen'));
  assert.equal(new Set(Object.values(prepositionGroups).flat()).size,Object.values(prepositionGroups).flat().length);
});
test('case checks model fixed, two-way and genitive prepositions',()=>{
  assert.equal(caseRounds.find(x=>x.id==='mit-bus').answer,'Dativ');
  assert.equal(caseRounds.find(x=>x.id==='durch-park').answer,'Akkusativ');
  assert.equal(caseRounds.find(x=>x.id==='bild-wand').answer,'Dativ');
  assert.equal(caseRounds.find(x=>x.id==='bild-wand-move').answer,'Akkusativ');
  assert.equal(normalizeCase('akk'),'Akkusativ');
});
test('connector groups and clause rounds retain a complete canonical word order',()=>{
  assert.equal(connectorGroups.length,4);
  assert.ok(connectorGroups.find(x=>x.id==='subordinate').items.includes('weil'));
  assert.ok(connectorGroups.find(x=>x.id==='adverbs').items.includes('deshalb'));
  for(const round of clauseRounds){assert.deepEqual([...round.tokens].sort(),[...round.answer].sort());assert.ok(round.note)}
});
