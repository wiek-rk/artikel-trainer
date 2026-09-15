(function(){
  const routes={'#articles':'article-panel','#tables':'tables-panel','#nvv':'nvv-panel','#preps':'preps-panel'};
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
})();
