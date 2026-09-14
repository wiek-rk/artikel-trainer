(function () {
  'use strict';
  const {tables,cells,practiceCells,possessiveStems,matches} = window.GermanTables;
  const root = document.getElementById('tables-panel');
  const key = 'artikel-tables-v1';
  let saved = {}, storageOK = true;
  try { saved = JSON.parse(localStorage.getItem(key) || '{}') || {}; } catch { storageOK = false; }
  if (typeof saved !== 'object' || Array.isArray(saved)) saved = {};
  let records = {};
  const validIds = new Set(tables.flatMap(t=>[...cells(t,true),...practiceCells(t,true)].map(c=>c.id)));
  for (const [id,value] of Object.entries(saved.records || {})) {
    if (validIds.has(id) && value && Number.isSafeInteger(value.attempts) && value.attempts >= 0 &&
        Number.isSafeInteger(value.correct) && value.correct >= 0 && value.correct <= value.attempts) {
      records[id] = {attempts:value.attempts,correct:value.correct,streak:Math.max(0,Number(value.streak)||0),pending:value.pending===true};
    }
  }
  if(possessiveStems.some(([stem])=>'poss-'+stem===saved.selected)) saved.selected='possessives';
  let table = tables.find(t=>t.id===saved.selected) || tables[0];
  let genitive = saved.genitive === true, mode = 'study', round = [], position = 0, roundCorrect = 0, checked = false;
  const findTable = id => tables.find(t=>t.id===id);
  const el = (tag,text,cls) => {const e=document.createElement(tag);if(text!==undefined)e.textContent=text;if(cls)e.className=cls;return e};
  function persist() {
    try {localStorage.setItem(key,JSON.stringify({selected:table.id,genitive,records}));storageOK=true;} catch {storageOK=false;}
    status.textContent = storageOK ? 'Progress saved on this browser' : 'Progress is temporary: browser storage is unavailable';
  }
  function shuffled(items) {
    const a=[...items];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]]}return a;
  }
  function record(cell,ok) {
    const old=records[cell.id]||{attempts:0,correct:0,streak:0,pending:false};
    const streak=ok?old.streak+1:0;
    records[cell.id]={attempts:old.attempts+1,correct:old.correct+(ok?1:0),streak,pending:ok?(old.pending&&streak<2):true};
  }
  function reviewCells(){return tables.flatMap(t=>t.kind==='possessive'?[...cells(t,genitive),...practiceCells(t,genitive)]:cells(t,genitive)).filter(c=>records[c.id]?.pending)}
  function format(t,answer){return t.kind==='ending'?'-'+answer:t.kind==='possessive'&&answer.length<3?(answer?'-'+answer:'—'):answer}
  function button(text,handler,primary=false){const b=el('button',text,primary?'primary':'');b.type='button';b.onclick=handler;actions.append(b);return b}
  root.innerHTML = `
    <h1>Make the tables stick.</h1>
    <p class="intro">Study the pattern. Hide it. Write it from memory.</p>
    <div class="table-controls"><label>Table to practise<select id="table-choice"></select></label><label id="case-label">Cases<select id="case-choice"><option value="3">First three cases</option><option value="4">Include Genitiv</option></select></label></div>
    <div class="table-modes" aria-label="Practice mode"></div>
    <div class="table-progress"><span id="table-progress"></span><span id="table-storage"></span></div>
    <section class="table-surface"><h2 id="table-heading"></h2><p class="table-note" id="table-note"></p><div id="table-exercise"></div><div class="table-actions" id="table-actions"></div><div class="result" id="table-result" aria-live="polite"></div></section>
    <details><summary>Learning notes</summary><div class="sources"><p id="table-source"></p><p>Practise the patterns from your B2 materials. <a href="SOURCES.md" target="_blank" rel="noopener">Full learning notes</a></p><p>Rebuild: all cells are hidden. Missing cells: about half are hidden. Recall mixes individual cells; Review revisits mistakes across tables. Two later correct attempts clear a cell from Review. Switching modes starts a fresh exercise. Genitiv is optional; pronoun tables keep their original cases.</p><p>Formal Sie, Ihnen and Ihr require capitals. An adjective ending can be typed as “en” or “-en”. A dash in the ein table is not an answer.</p><button type="button" id="export-progress">Export table progress</button></div></details>`;
  const selector=root.querySelector('#table-choice'),caseSelector=root.querySelector('#case-choice'),modes=root.querySelector('.table-modes');
  const heading=root.querySelector('#table-heading'),note=root.querySelector('#table-note'),exercise=root.querySelector('#table-exercise'),actions=root.querySelector('#table-actions'),result=root.querySelector('#table-result'),status=root.querySelector('#table-storage');
  for(const group of [...new Set(tables.map(t=>t.group))]){const optgroup=el('optgroup');optgroup.label=group;for(const t of tables.filter(t=>t.group===group)){const option=el('option',t.title);option.value=t.id;optgroup.append(option)}selector.append(optgroup)}
  const labels={study:'Study',missing:'Missing cells',rebuild:'Rebuild',recall:'Recall',review:'Review'};
  for(const [id,label] of Object.entries(labels)){const b=el('button',label);b.type='button';b.dataset.mode=id;b.onclick=()=>switchMode(id);modes.append(b)}
  selector.value=table.id;caseSelector.value=genitive?'4':'3';
  selector.onchange=()=>{table=findTable(selector.value);switchMode('study')};
  caseSelector.onchange=()=>{genitive=caseSelector.value==='4';switchMode(mode)};
  root.querySelector('#export-progress').onclick=()=>{
    const blob=new Blob([JSON.stringify({version:1,selected:table.id,genitive,records},null,2)],{type:'application/json'});
    const url=URL.createObjectURL(blob),a=el('a');a.href=url;a.download='artikel-table-progress.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
  };
  function updateProgress(){
    const active=table.kind==='possessive'?[...cells(table,genitive),...practiceCells(table,genitive)]:cells(table,genitive),practised=active.filter(c=>records[c.id]?.attempts>0).length;
    root.querySelector('#table-progress').textContent=practised+' / '+active.length+(table.kind==='possessive'?' endings & word forms practised':' cells practised in this table');
    const review=modes.querySelector('[data-mode="review"]');review.textContent='Review · '+reviewCells().length;
    persist();
  }
  function switchMode(next){
    mode=next;position=0;roundCorrect=0;
    if(mode==='recall'){
      const active=shuffled(practiceCells(table,genitive));
      round=[...active.filter(c=>records[c.id]?.pending),...active.filter(c=>!records[c.id]?.pending)].slice(0,12);
    } else if(mode==='review') round=shuffled(reviewCells()).slice(0,12);
    render();
  }
  function render(){
    checked=false;exercise.replaceChildren();actions.replaceChildren();result.textContent='';
    for(const b of modes.children){b.classList.toggle('active',b.dataset.mode===mode);b.setAttribute('aria-pressed',String(b.dataset.mode===mode))}
    root.querySelector('#case-label').hidden=table.kind==='pronoun'&&mode!=='review';
    heading.textContent=table.title;note.textContent=mode==='study'?table.note:(table.kind==='possessive'?'Type the shared endings. Enter a dash (-) for no ending.':table.kind==='ending'?'Type only the endings, with or without a hyphen.':'Write each form from memory.');root.querySelector('#table-source').textContent='Current table: '+table.source;
    updateProgress();
    if(mode==='recall'||mode==='review'){renderRecall();return}
    const active=cells(table,genitive),hidden=new Set(mode==='rebuild'?active.map(c=>c.id):mode==='missing'?shuffled(active).slice(0,Math.ceil(active.length/2)).map(c=>c.id):[]);
    const grid=el('table'),caption=el('caption',mode==='study'?'Read across each case; compare the forms.':'Type the missing forms, then check your first attempt.');grid.append(caption);
    const head=el('thead'),tr=el('tr');const first=el('th',table.kind==='pronoun'?'Person':'Case');first.scope='col';tr.append(first);
    for(const c of table.cols){const th=el('th');th.scope='col';const short={Maskulin:'Mask.',Feminin:'Fem.',Neutrum:'Neut.',Nominativ:'Nom.',Akkusativ:'Akk.',Dativ:'Dat.'}[c];if(short){th.append(el('span',c,'col-full'),el('span',short,'col-short'));th.setAttribute('aria-label',c)}else th.textContent=c;tr.append(th)}head.append(tr);grid.append(head);
    const body=el('tbody'),entries=[];
    table.values.forEach((row,r)=>{
      if(table.kind!=='pronoun'&&r===3&&!genitive)return;
      const line=el('tr'),label=el('th',table.rows[r]);label.scope='row';line.append(label);
      row.forEach((answer,c)=>{
        const td=el('td'),cell=active.find(a=>a.r===r&&a.c===c);
        if(answer===null){td.textContent='—';td.setAttribute('aria-label','No plural form of ein')}
        else if(!hidden.has(cell.id)) td.textContent=format(table,answer);
        else{
          const input=el('input');input.type='text';input.autocomplete='off';input.setAttribute('autocapitalize','none');input.spellcheck=false;input.setAttribute('aria-label',cell.row+' · '+cell.col);input.dataset.cell=cell.id;
          const response=el('span','', 'cell-result');response.id='feedback-'+cell.r+'-'+cell.c;input.setAttribute('aria-describedby',response.id);td.append(input,response);entries.push({input,response,cell});
        }line.append(td);
      });body.append(line);
    });grid.append(body);const wrapper=el('div',undefined,'grid-scroll');wrapper.append(grid);exercise.append(wrapper);
    if(mode==='study'&&table.kind==='possessive'){exercise.append(el('p',possessiveStems.map(([stem,meaning])=>stem+' = '+meaning).join(' · '),'table-note'));exercise.append(el('p','Rebuild practises endings. Recall practises full words with different stems.','table-note'));}
    if(mode==='study'){button('Hide some cells →',()=>switchMode('missing'),true);button('Rebuild whole table',()=>switchMode('rebuild'));return}
    const check=button('Check table',()=>{
      if(checked)return;const blank=entries.find(e=>!e.input.value.trim());if(blank){result.textContent='Fill every empty cell first.';blank.input.focus();return}
      checked=true;note.textContent=table.note;let correct=0;
      for(const {input,response,cell} of entries){const ok=matches(table,input.value,cell.answer);record(cell,ok);if(ok)correct++;input.readOnly=true;input.className=ok?'correct':'wrong';input.setAttribute('aria-invalid',String(!ok));response.textContent=ok?'✓ Correct':'→ '+format(table,cell.answer)}
      result.textContent=correct+' / '+entries.length+' correct on the first attempt. '+(correct===entries.length?'Try Recall without the table layout.':'Corrections are shown below your answers. Missed cells are saved for Review.');check.disabled=true;updateProgress();
      button('Try a fresh table',()=>switchMode(mode),true);button('Recall →',()=>switchMode('recall'));
    },true);
    button('Study again',()=>switchMode('study'));
    grid.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();if(!checked)check.click()}});
  }
  function renderRecall(){
    if(position>=round.length){
      heading.textContent=mode==='review'?'Review':'Recall';note.textContent='';
      exercise.append(el('h3',round.length?roundCorrect+' / '+round.length+' correct':'No mistakes waiting for review.'));
      if(round.length)exercise.append(el('p','Round complete. Review keeps missed cells until two later correct attempts.'));
      else exercise.append(el('p','Practise a table to build your review list. Genitiv cells appear when Include Genitiv is selected.'));
      button(mode==='review'?'Review again':'New recall round',()=>switchMode(mode),true);button('Study this table',()=>switchMode('study'));return;
    }
    const cell=round[position],t=findTable(cell.table);heading.textContent=t.title;note.textContent='';root.querySelector('#table-source').textContent='Current question: '+t.source;
    exercise.append(el('div',(mode==='review'?'Mistake review':'Recall')+' · '+(position+1)+' / '+round.length,'eyebrow'));
    exercise.append(el('h3',cell.row+' · '+cell.col+(cell.stem?' · '+cell.stem:''),'prompt'));
    const form=el('form'),label=el('label',t.kind==='possessive'&&!cell.stem?'Type the ending (dash for no ending)':t.kind==='ending'?'Type the adjective ending':'Type the German form','recall-input'),input=el('input');input.type='text';input.autocomplete='off';input.setAttribute('autocapitalize','none');input.spellcheck=false;input.dataset.cell=cell.id;label.append(input);form.append(label);exercise.append(form);
    if(t.caseSensitive)exercise.append(el('p','Capitalisation matters for this table.','table-note'));
    const check=()=>{
      if(checked)return;
      if(!input.value.trim()){result.textContent='Type your answer first.';input.focus();return}
      checked=true;const ok=matches(t,input.value,cell.answer);record(cell,ok);if(ok)roundCorrect++;
      input.readOnly=true;input.className=ok?'correct':'wrong';input.setAttribute('aria-invalid',String(!ok));
      result.textContent=(ok?'✓ Correct: ':'Answer: ')+format(t,cell.answer)+'. '+t.note;
      actions.replaceChildren();const next=button(position+1===round.length?'Finish round →':'Next cell →',()=>{position++;render();exercise.querySelector('input')?.focus()},true);next.focus();updateProgress();
    };
    form.onsubmit=e=>{e.preventDefault();check()};button('Check answer',check,true);
  }
  function navigate(){
    const showing=location.hash==='#tables';document.getElementById('article-panel').hidden=showing;root.hidden=!showing;
    document.getElementById('settings').hidden=showing;
    document.querySelectorAll('.app-nav a').forEach(a=>{if((a.hash==='#tables')===showing)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
  }
  addEventListener('hashchange',navigate);navigate();render();
})();
