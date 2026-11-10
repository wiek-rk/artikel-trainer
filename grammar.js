(function(){
  const data=window.GermanGrammar;if(!data)return;
  const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));let caseIndex=0,chosen='',caseAnswered=false,clauseIndex=0,built=[];
  const caseRoundSize=30;
  const unseenCases=[...data.caseRounds];
  const seenCases=[];
  let caseRoundNumber=0, missedCases=[], score=0, includeGenitive=false, roundGenitive=false;
  let caseRound=startCaseRound();

  function startCaseRound(){
    roundGenitive=includeGenitive;
    score=0;
    const eligible=item=>roundGenitive||item.answer!=='Genitiv';
    const round=missedCases.filter(eligible).slice(0,caseRoundSize);
    missedCases=missedCases.filter(item=>!round.includes(item));
    const fresh=unseenCases.filter(eligible).slice(0,caseRoundSize-round.length);
    for(const item of fresh) unseenCases.splice(unseenCases.indexOf(item),1);
    round.push(...fresh);
    const reviewCount=caseRoundSize-round.length;
    if(reviewCount){
      const review=seenCases.filter(item=>eligible(item)&&!round.includes(item)).slice(0,reviewCount);
      for(const item of review) seenCases.splice(seenCases.indexOf(item),1);
      round.push(...review);
      seenCases.push(...review);
    }
    seenCases.push(...fresh);
    caseRoundNumber++;
    return round;
  }

  function renderCases(){const item=caseRound[caseIndex],el=document.getElementById('preposition-panel');if(!el)return;el.innerHTML=`<div class="grammar-section"><section class="grammar-card"><div class="eyebrow">Learn the pattern</div><h2>Präpositionen & Fälle</h2><p>Start with the fixed groups. The middle group is <b>Wechselpräpositionen</b>: use Dativ for a location (<i>Wo?</i>) and Akkusativ for a direction or change (<i>Wohin?</i>).</p><div class="venn-wrap" aria-label="Preposition case groups"><div class="venn dat"><b>DATIV</b><small>${data.prepositionGroups.dativ.join(' · ')}</small></div><div class="venn two"><b>DATIV<br>oder<br>AKKUSATIV</b><small>${data.prepositionGroups.wechsel.join(' · ')}</small></div><div class="venn akk"><b>AKKUSATIV</b><small>${data.prepositionGroups.akkusativ.join(' · ')}</small></div></div><div class="case-legend"><span><b>Genitiv:</b> ${data.prepositionGroups.genitiv.join(' · ')}</span><span>Wo? = Dativ</span><span>Wohin? = Akkusativ</span></div></section><section class="grammar-card case-quiz"><div class="eyebrow">Round ${caseRoundNumber} · Case check ${caseIndex+1} / ${caseRound.length}</div><label class="case-setting"><input type="checkbox" id="case-genitive" ${includeGenitive?'checked':''}> Include Genitiv ${caseRoundNumber===1&&caseIndex===0&&!caseAnswered?'':'(next round)'}</label><div aria-live="polite"><b>${caseAnswered&&caseIndex+1===caseRound.length?'Final score':'Score'} · ${score} / ${caseRound.length} points</b></div><div class="case-question">${esc(item.sentence)}</div><p>Which case follows <b>${esc(item.prep)}</b>?</p><div class="case-options">${(roundGenitive?['Dativ','Akkusativ','Genitiv']:['Dativ','Akkusativ']).map(x=>`<button data-case="${x}" class="${chosen===x?'selected':''}" ${caseAnswered?'disabled':''}>${x}</button>`).join('')}</div><div class="grammar-feedback" aria-live="polite">${caseAnswered?(chosen===item.answer?'✓ Correct. ':'Try again next time. ')+esc(item.note):''}</div><button class="grammar-action" id="case-next" ${caseAnswered?'':'hidden'}>${caseIndex+1===caseRound.length?'Start next round':'Next case'} →</button></section></div>`;el.querySelectorAll('[data-case]').forEach(b=>b.onclick=()=>{chosen=b.dataset.case;if(chosen===item.answer)score++;else missedCases.push(item);caseAnswered=true;renderCases()});const genitive=el.querySelector('#case-genitive');
    genitive.onchange=()=>{
      includeGenitive=genitive.checked;
      if(caseRoundNumber===1&&caseIndex===0&&!caseAnswered){
        unseenCases.splice(0,unseenCases.length,...data.caseRounds);
        seenCases.length=0;
        caseRoundNumber=0;
        caseRound=startCaseRound();
        renderCases();
        el.querySelector('#case-genitive').focus();
      }
    };
    const next=el.querySelector('#case-next');if(next)next.onclick=()=>{caseIndex++;if(caseIndex===caseRound.length){caseRound=startCaseRound();caseIndex=0;}chosen='';caseAnswered=false;renderCases()};}
  function renderConnectors(){const el=document.getElementById('connectors-panel');if(!el)return;const round=data.clauseRounds[clauseIndex],used=new Set(built.map(x=>x.i));el.innerHTML=`<div class="grammar-section"><section class="grammar-card"><div class="eyebrow">Learn the word order</div><h2>Konnektoren</h2><p>First choose the connector group. Then use the clause builder to make the verb placement automatic.</p><div class="connector-grid">${data.connectorGroups.map(g=>`<article class="connector-group"><h3>${esc(g.name)}</h3><p>${esc(g.rule)}</p><div class="connector-items">${esc(g.items.join(' · '))}</div><em>${esc(g.example)}</em></article>`).join('')}</div></section><section class="grammar-card"><div class="builder-meta">Build the clause · ${clauseIndex+1} / ${data.clauseRounds.length}</div><h2>Clause builder</h2><p><b>${esc(round.hint)}</b></p><div class="builder-prompt">${esc(round.prompt)}</div><div class="built-clause" aria-label="Your clause">${built.length?built.map(x=>`<button class="token" data-remove="${x.i}">${esc(x.word)}</button>`).join(''):'<span>Click the words below in order.</span>'}</div><p>Available words</p><div class="token-bank">${round.tokens.map((w,i)=>`<button class="token" data-token="${i}" ${used.has(i)?'disabled':''}>${esc(w)}</button>`).join('')}</div><div class="builder-tools"><button class="grammar-action" id="check-clause">Check</button><button class="grammar-action" id="reset-clause">Start over</button></div><div class="grammar-feedback" id="clause-feedback" aria-live="polite"></div></section></div>`;el.querySelectorAll('[data-token]').forEach(b=>b.onclick=()=>{built.push({i:+b.dataset.token,word:round.tokens[+b.dataset.token]});renderConnectors()});el.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{built=built.filter(x=>x.i!==+b.dataset.remove);renderConnectors()});el.querySelector('#reset-clause').onclick=()=>{built=[];renderConnectors()};el.querySelector('#check-clause').onclick=()=>{const ok=built.map(x=>x.word).join(' ')===round.answer.join(' '),fb=el.querySelector('#clause-feedback');fb.textContent=ok?'✓ '+round.note:'Not yet. Check where the conjugated verb belongs.';if(ok){const b=document.createElement('button');b.className='grammar-action';b.textContent='Next clause →';b.onclick=()=>{clauseIndex=(clauseIndex+1)%data.clauseRounds.length;built=[];renderConnectors()};fb.after(b)}}
  }
  renderCases();renderConnectors();
})();
