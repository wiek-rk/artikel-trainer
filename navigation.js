(function(){
  const routes={'#articles':'article-panel','#tables':'tables-panel','#nvv':'nvv-panel','#preps':'preps-panel','#preposition-cases':'preposition-panel','#connectors':'connectors-panel'};
  const nav=document.querySelector('.app-nav');
  [['#preposition-cases','Präpositionen'],['#connectors','Konnektoren']].forEach(([href,label])=>{if(!nav.querySelector(`a[href="${href}"]`)){const a=document.createElement('a');a.href=href;a.textContent=label;nav.append(a)}});
  [['preposition-panel','Prepositions and cases'],['connectors-panel','Connector practice']].forEach(([id,label])=>{if(!document.getElementById(id)){const section=document.createElement('section');section.id=id;section.hidden=true;section.setAttribute('aria-label',label);document.querySelector('main.shell').append(section)}});
  if(!document.querySelector('link[href="grammar.css"]')){const link=document.createElement('link');link.rel='stylesheet';link.href='grammar.css';document.head.append(link)}
  const load=src=>new Promise((resolve,reject)=>{const s=document.createElement('script');s.src=src;s.onload=resolve;s.onerror=reject;document.head.append(s)});
  function navigate(){
    const route=Object.hasOwn(routes,location.hash)?location.hash:'#articles';
    for(const [hash,id] of Object.entries(routes))document.getElementById(id).hidden=hash!==route;
    document.getElementById('settings').hidden=route!=='#articles';
    if(route!=='#articles')document.getElementById('modal').classList.remove('open');
    for(const link of document.querySelectorAll('.app-nav a')){
      if(link.hash===route)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');
    }
  }
  addEventListener('hashchange',navigate);navigate();
  load('grammar-data.js').then(()=>load('grammar.js')).catch(()=>{});
})();
