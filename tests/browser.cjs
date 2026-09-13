// Run with NODE_PATH pointing at a Playwright installation if it is not installed locally.
const {chromium}=require('playwright');
const http=require('node:http');
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const {tables,cells}=require('../tables-data.js');
const root=path.resolve(__dirname,'..');
const server=http.createServer((req,res)=>{
  const name=decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\//,'')||'index.html';
  const file=path.resolve(root,name);
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return}
  try{res.setHeader('Content-Type',({'html':'text/html; charset=utf-8','js':'text/javascript; charset=utf-8','css':'text/css; charset=utf-8'})[path.extname(file).slice(1)]||'text/plain');res.end(fs.readFileSync(file))}catch{res.writeHead(404);res.end()}
});
(async()=>{
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const browser=await chromium.launch({headless:true,channel:'msedge'});
  try{
    const page=await browser.newPage({viewport:{width:1100,height:1000}}),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    const url='http://127.0.0.1:'+server.address().port+'/';await page.goto(url);
    const oldWord=await page.locator('#word').innerText();
    await page.locator('.app-nav a[href="#tables"]').click();
    await page.locator('[data-mode="rebuild"]').click();
    assert.equal(await page.locator('#tables-panel input').count(),12);
    await page.locator('#tables-panel input').first().fill('1');await page.keyboard.press('Enter');
    assert.equal(await page.locator('#attempts').innerText(),'0/30');
    assert.match(await page.locator('#table-result').innerText(),/Fill every/);
    for(const cell of cells(tables[0]))await page.locator('[data-cell="'+cell.id+'"]').fill(cell.r===0&&cell.c===0?'wrong':cell.answer);
    await page.getByRole('button',{name:'Check table',exact:true}).click();
    assert.match(await page.locator('#table-result').innerText(),/11 \/ 12/);
    assert.equal(await page.locator('.cell-result').first().innerText(),'→ der');
    assert.equal(await page.locator('[data-mode="review"]').innerText(),'Review · 1');
    await page.reload();await page.locator('[data-mode="review"]').click();
    assert.equal(await page.locator('[data-cell="definite:0:0"]').count(),1);
    await page.locator('[data-cell="definite:0:0"]').fill('der');await page.keyboard.press('Enter');
    assert.equal(await page.locator('[data-mode="review"]').innerText(),'Review · 1');
    await page.getByRole('button',{name:'Finish round →'}).click();await page.getByRole('button',{name:'Review again'}).click();
    await page.locator('[data-cell="definite:0:0"]').fill('der');await page.keyboard.press('Enter');
    assert.equal(await page.locator('[data-mode="review"]').innerText(),'Review · 0');
    // Every table renders and grades all source forms correctly, with Genitiv included.
    await page.locator('#case-choice').selectOption('4');
    for(const t of tables){
      await page.locator('#table-choice').selectOption(t.id);await page.locator('[data-mode="rebuild"]').click();
      assert.equal(await page.locator('#table-exercise input').count(),cells(t,true).length,t.id);
      for(const c of cells(t,true))await page.locator('[data-cell="'+c.id+'"]').fill(c.answer);
      await page.getByRole('button',{name:'Check table',exact:true}).click();
      assert.equal(await page.locator('#table-exercise input.wrong').count(),0,t.id);
    }
    await page.locator('.app-nav a[href="#articles"]').click();
    await page.locator('.answer').first().click();assert.equal(await page.locator('#attempts').innerText(),'1/30');
    await page.locator('.app-nav a[href="#tables"]').click();await page.locator('.app-nav a[href="#articles"]').click();
    assert.equal(await page.locator('#attempts').innerText(),'1/30');
    // Responsive preview screenshots and no horizontal clipping.
    await page.locator('.app-nav a[href="#tables"]').click();await page.locator('#table-choice').selectOption('definite');
    const out=process.env.ARTIKEL_SCREENSHOT_DIR;
    if(out){fs.mkdirSync(out,{recursive:true});await page.screenshot({path:path.join(out,'tables-desktop.png'),fullPage:true})}
    await page.setViewportSize({width:360,height:900});
    for(const id of ['definite','personal','poss-Ihr','adjective-mixed']){
      await page.locator('#table-choice').selectOption(id);await page.locator('[data-mode="rebuild"]').click();
      assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),id+' overflows');
    }
    if(out)await page.screenshot({path:path.join(out,'tables-mobile.png'),fullPage:true});
    // Corrupt or blocked storage must not prevent practice.
    const blocked=await browser.newContext();await blocked.addInitScript(()=>{Storage.prototype.getItem=()=>{throw Error('blocked')};Storage.prototype.setItem=()=>{throw Error('blocked')}});
    const p=await blocked.newPage();await p.goto(url+'#tables');assert.match(await p.locator('#table-storage').innerText(),/temporary/);await p.locator('[data-mode="recall"]').click();assert.equal(await p.locator('#table-exercise input').count(),1);await blocked.close();
    await page.evaluate(()=>localStorage.setItem('artikel-tables-v1','{bad json'));await page.reload();assert.equal(await page.locator('#table-choice').inputValue(),'definite');
    assert.deepEqual(errors,[]);
    console.log('PASS: 17 tables graded, review persistence, two-correct recovery, no duplicate scoring, article navigation/keyboard isolation, responsive layouts, blocked/corrupt storage.');
  }finally{await browser.close();server.close()}
})().catch(e=>{console.error(e);server.close();process.exitCode=1});
