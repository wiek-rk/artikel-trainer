(function(){
  'use strict';
  const data=window.GermanPhrases;
  const make=(tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e};
  const shuffle=items=>{const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a};
  function mount(kind,items,title,description){
    const root=document.getElementById(kind+'-panel'),key='artikel-phrases-'+kind+'-v1';
    let records={},storageOK=true,mode='study',round=[],index=0,score=0,checked=false;
    try{const saved=JSON.parse(localStorage.getItem(key)||'{}');for(const item of items){const r=saved?.[item.id];if(r&&Number.isSafeInteger(r.attempts)&&r.attempts>=0&&Number.isSafeInteger(r.correct)&&r.correct>=0&&r.correct<=r.attempts)records[item.id]={attempts:r.attempts,correct:r.correct,streak:Math.max(0,Number(r.streak)||0),pending:r.pending===true}}}catch{storageOK=false}
    root.classList.add('phrase-section');
    root.append(make('h1',title),make('p',description,'phrase-intro'));
    const nav=make('div',undefined,'phrase-modes');nav.setAttribute('aria-label',title+' mode');root.append(nav);
    const progress=make('p','', 'phrase-progress');root.append(progress);
    const surface=make('section',undefined,'phrase-surface'),content=make('div'),actions=make('div',undefined,'phrase-actions'),feedback=make('div','', 'phrase-feedback');feedback.setAttribute('aria-live','polite');surface.append(content,actions,feedback);root.append(surface);
    const notes=make('details'),summary=make('summary','How practice works');notes.append(summary,make('p',kind==='nvv'?'Type the verb in its infinitive form, for example treffen. The English meaning tells you which expression to complete.':'Type the preposition and its case. Learn the whole verb–preposition–case combination: the location/destination rule does not determine these fixed combinations.'),make('p','Practice contains up to 12 expressions, with saved mistakes first. Review revisits mistakes until you answer correctly twice later. Only the first check counts. Umlauts or ae/oe/ue are accepted; cases can be typed as Akkusativ / Akk or Dativ / Dat. Progress is stored on this browser.'));root.append(notes);
    const review=()=>items.filter(x=>records[x.id]?.pending);
    function save(){try{localStorage.setItem(key,JSON.stringify(records));storageOK=true}catch{storageOK=false}}
    function update(){
      progress.textContent=items.filter(x=>records[x.id]?.attempts).length+' / '+items.length+' expressions practised · '+(storageOK?'Saved on this browser':'Progress is temporary: browser storage unavailable');
      for(const b of nav.children){b.setAttribute('aria-pressed',String(b.dataset.mode===mode));b.classList.toggle('active',b.dataset.mode===mode);if(b.dataset.mode==='review')b.textContent='Review · '+review().length}
    }
    function button(label,fn,primary=false){const b=make('button',label,primary?'primary':'');b.type='button';b.onclick=fn;actions.append(b);return b}
    function start(next){mode=next;index=0;score=0;const shuffled=shuffle(items);round=(next==='review'?shuffle(review()):[...shuffled.filter(x=>records[x.id]?.pending),...shuffled.filter(x=>!records[x.id]?.pending)]).slice(0,12);render()}
    for(const [value,label] of [['study','Study'],['practice','Practice'],['review','Review']]){const b=make('button',label);b.type='button';b.dataset.mode=value;b.onclick=()=>start(value);nav.append(b)}
    function full(item){return kind==='nvv'?item.phrase+' '+item.answers[0]:item.verb+' '+item.pairs[0].prep+' + '+item.pairs[0].grammaticalCase}
    function reveal(item){
      feedback.append(make('strong',full(item)),make('p',item.example));
      if(kind==='nvv'&&item.answers.length>1)feedback.append(make('p','Also accepted here: '+item.answers.slice(1).join(', ')+'.'));
      if(kind==='preps'&&item.pairs.length>1)feedback.append(make('p','Also accepted for this meaning: '+item.pairs.slice(1).map(p=>p.prep+' + '+p.grammaticalCase).join('; ')+'.'));
      if(kind==='preps')feedback.append(make('p','Learn this verb and meaning together with '+item.pairs[0].prep+' + '+item.pairs[0].grammaticalCase+'.'));
    }
    function render(){
      checked=false;content.replaceChildren();actions.replaceChildren();feedback.replaceChildren();update();
      if(mode==='study'){
        content.append(make('h2',items.length+' expressions from your B2 materials'));
        const list=make('div',undefined,'expression-list');
        for(const item of items){const entry=make('details'),label=make('summary',full(item));entry.append(label,make('p',item.meaning),make('p',item.example));list.append(entry)}content.append(list);button('Start typed practice →',()=>start('practice'),true);return;
      }
      if(index>=round.length){
        content.append(make('h2',round.length?'Round complete':'No mistakes waiting for review'),make('p',round.length?score+' / '+round.length+' expressions completely correct.':'Practise some expressions to build your review list.'));
        if(round.length)content.append(make('p','Missed expressions stay in Review until two later correct answers.'));
        button(mode==='review'?'Review again':'New round →',()=>start(mode),true);button('Study',()=>start('study'));return;
      }
      const item=round[index];
      content.append(make('p',(mode==='review'?'Mistake review':'Practice')+' · '+(index+1)+' / '+round.length,'phrase-eyebrow'));
      content.append(make('h2',(kind==='nvv'?item.phrase:item.verb)+' ___','phrase-prompt'),make('p',item.meaning,'phrase-meaning'));
      const form=make('form'),fields=make('div',undefined,'phrase-fields');form.id=kind+'-answer-form';form.append(fields);
      function field(label,name){const wrap=make('label',label),input=make('input');input.name=name;input.type='text';input.autocomplete='off';input.spellcheck=false;input.setAttribute('autocapitalize','none');input.dataset.item=item.id;wrap.append(input);fields.append(wrap);return input}
      const answer=field(kind==='nvv'?'Verb · infinitive':'Preposition','answer'),grammaticalCase=kind==='preps'?field('Case · type Akkusativ or Dativ','case'):null;
      content.append(form);
      const check=()=>{
        if(checked)return;
        const empty=[answer,grammaticalCase].find(x=>x&&!x.value.trim());if(empty){feedback.textContent='Complete '+(grammaticalCase?'both fields':'the verb')+' before checking.';empty.focus();return}
        checked=true;const result=data.grade(kind,item,answer.value,grammaticalCase?.value),old=records[item.id]||{attempts:0,correct:0,streak:0,pending:false},streak=result.ok?old.streak+1:0;
        records[item.id]={attempts:old.attempts+1,correct:old.correct+(result.ok?1:0),streak,pending:result.ok?(old.pending&&streak<2):true};if(result.ok)score++;
        for(const [input,ok] of [[answer,result.wordOK],[grammaticalCase,result.caseOK]])if(input){input.readOnly=true;input.classList.add(ok?'correct':'wrong');input.setAttribute('aria-invalid',String(!ok))}
        feedback.replaceChildren(make('p',result.ok?'✓ Correct.':result.wordOK&&grammaticalCase?'Preposition correct; check its case.':'Not quite. Compare your answer below.'));reveal(item);
        save();update();actions.replaceChildren();button(index+1===round.length?'Finish round →':'Next expression →',()=>{index++;render();content.querySelector('input')?.focus()},true).focus();
      };
      form.onsubmit=e=>{e.preventDefault();check()};const submit=button('Check answer',()=>{},true);submit.type='submit';submit.setAttribute('form',form.id);
    }
    render();
  }
  mount('nvv',data.nvv,'Nomen–Verb-Verbindungen','Build natural expressions. Recall the verb, then read it in a sentence.');
  mount('preps',data.preps,'Verben mit Präpositionen','Recall the preposition and its case for a specific meaning.');
})();
