const {chromium}=require('playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const data=require('../phrases-data.js'),root=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{
  const file=path.resolve(root,'.'+new URL(req.url,'http://localhost').pathname);
  const target=file===root?path.join(root,'index.html'):file;
  if(!target.startsWith(root+path.sep)){res.writeHead(403);res.end();return}
  try{res.setHeader('Content-Type',({'js':'text/javascript','css':'text/css','html':'text/html'})[path.extname(target).slice(1)]+'; charset=utf-8');res.end(fs.readFileSync(target))}catch{res.writeHead(404);res.end()}
});
(async()=>{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));const url='http://127.0.0.1:'+server.address().port+'/';
  const browser=await chromium.launch({headless:true,channel:'msedge'});
  try{
    const p=await browser.newPage({viewport:{width:1100,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
    await p.goto(url+'#nvv');assert.ok(await p.locator('#article-panel').isHidden());assert.ok(await p.locator('#tables-panel').isHidden());
    for(const [kind,deck] of [['nvv',data.nvv],['preps',data.preps]]){
      await p.locator('.app-nav a[href="#'+kind+'"]').click();const panel=p.locator('#'+kind+'-panel');
      assert.equal(await panel.locator('.expression-list details').count(),deck.length);
      await panel.locator('[data-mode=practice]').click();
      await panel.getByRole('button',{name:'Check answer'}).click();assert.match(await panel.locator('.phrase-feedback').innerText(),/Complete/);
      const firstId=await panel.locator('input[name=answer]').getAttribute('data-item');
      const first=deck.find(i=>i.id===firstId);
      await panel.locator('input[name=answer]').fill(kind==='nvv'?'wrong':first.pairs[0].prep);
      if(kind==='preps')await panel.locator('input[name=case]').fill(first.pairs[0].grammaticalCase==='Dativ'?'Akk':'Dat');
      await panel.getByRole('button',{name:'Check answer'}).click();assert.equal(await panel.locator('[data-mode=review]').innerText(),'Review · 1');
      assert.equal(await p.locator('#attempts').innerText(),'0/30');
      const snapshot=await panel.locator('.phrase-feedback').innerText();
      await p.locator('.app-nav a[href="#tables"]').click();await p.locator('.app-nav a[href="#'+kind+'"]').click();
      await panel.waitFor({state:'visible'});assert.equal(await panel.locator('.phrase-feedback').innerText(),snapshot);
      await p.reload();
      await panel.locator('[data-mode=review]').click();assert.equal(await panel.locator('input[name=answer]').getAttribute('data-item'),firstId);
      for(let n=0;n<2;n++){
        await panel.locator('input[name=answer]').fill(kind==='nvv'?first.answers[0]:first.pairs[0].prep);
        if(kind==='preps')await panel.locator('input[name=case]').fill(first.pairs[0].grammaticalCase);
        await panel.getByRole('button',{name:'Check answer'}).click();
        assert.equal(await panel.locator('[data-mode=review]').innerText(),'Review · '+(n===0?1:0));
        await panel.getByRole('button',{name:'Finish round →'}).click();if(n===0)await panel.getByRole('button',{name:'Review again'}).click();
      }
      await panel.locator('[data-mode=practice]').click();
      const ids=[];
      for(let n=0;n<12;n++){
        const id=await panel.locator('input[name=answer]').getAttribute('data-item'),item=deck.find(x=>x.id===id);ids.push(id);
        await panel.locator('input[name=answer]').fill(kind==='nvv'?item.answers[0]:item.pairs[0].prep);
        if(kind==='preps')await panel.locator('input[name=case]').fill(item.pairs[0].grammaticalCase);
        await panel.locator('input[name=answer]').press('Enter');
        assert.match(await panel.locator('.phrase-feedback').innerText(),/✓ Correct/);
        await panel.getByRole('button',{name:n===11?'Finish round →':'Next expression →'}).click();
      }
      assert.equal(new Set(ids).size,12);assert.match(await panel.locator('.phrase-surface').innerText(),/12 \/ 12/);
    }
    // Direct URLs, mobile layout and local error handling.
    const out=process.env.ARTIKEL_SCREENSHOT_DIR;if(out)fs.mkdirSync(out,{recursive:true});
    for(const width of [1100,360]){await p.setViewportSize({width,height:900});for(const hash of ['nvv','preps']){
      await p.goto(url+'#'+hash);await p.locator('#'+hash+'-panel [data-mode=practice]').click();
      assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
      if(out)await p.screenshot({path:path.join(out,hash+'-'+width+'.png'),fullPage:true});
    }}
    await p.locator('.app-nav a[href="#articles"]').click();await p.locator('.answer').first().click();assert.equal(await p.locator('#attempts').innerText(),'1/30');
    const context=await browser.newContext();await context.addInitScript(()=>{Storage.prototype.getItem=()=>{throw Error('blocked')};Storage.prototype.setItem=()=>{throw Error('blocked')}});
    const blocked=await context.newPage();await blocked.goto(url+'#preps');assert.match(await blocked.locator('#preps-panel .phrase-progress').innerText(),/temporary/);await context.close();
    assert.deepEqual(errors,[]);console.log('PASS: expression rounds, partial answers, persistence, mistake recovery, navigation isolation, direct links and mobile layout.');
  }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
