const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright');
const fs = require('node:fs');
const assert = require('node:assert/strict');
async function verify() {
  const production = process.env.TEST_PRODUCTION === '1';
  const url = process.env.TEST_URL || `http://127.0.0.1:${production ? 4174 : 5174}`;
  fs.mkdirSync('artifacts', { recursive: true });
  const browser = await chromium.launch({ headless: true,
    ...(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {}),
    args: process.env.SOFTWARE_WEBGL === '1' ? ['--enable-unsafe-swiftshader', '--use-gl=angle', '--use-angle=swiftshader'] : [],
  });
  const report = { production, renderer: process.env.SOFTWARE_WEBGL === '1' ? 'SwiftShader software' : 'browser default', errors: [], warnings: [], views: [], checks: [] };
  const observe = page => {
    page.on('pageerror', e => report.errors.push(e.message));
    page.on('console', e => { if (e.type() === 'error') report.errors.push(e.text()); else if(e.type() === 'warning') report.warnings.push(e.text()); });
    page.on('response', r => { if(r.status() >= 400) report.errors.push(`${r.status()} ${r.url()}`); });
  };
  const ready = async page => { await page.locator('.immersive-app[data-ready="true"]').waitFor({ timeout: 90000 }); };
  const chapter = async (page, id) => {
    await page.evaluate(id => document.getElementById(id).scrollIntoView({ behavior: 'instant' }), id);
    const index = ['arrival','companions','collection','philosophy','finale'].indexOf(id);
    await page.waitForFunction(i => document.querySelector('.immersive-app').dataset.chapter === String(i), index, {timeout:30000});
    await page.waitForTimeout(200);
  };
  try {
    for (const [width,height] of production ? [[1440,960],[375,812]] : [[1440,960],[768,1024],[375,812]]) {
      const page = await browser.newPage({ viewport:{width,height}, reducedMotion:'reduce' }); observe(page);
      await page.goto(url); await ready(page);
      assert.equal(await page.locator('.immersive-app').getAttribute('data-webgl'), 'available');
      assert.equal(await page.locator('canvas').count(), 1);
      for (const id of ['arrival','companions','collection','philosophy','finale']) {
        await chapter(page,id);
        const state = await page.evaluate(id => {
          const frame = document.querySelector(`#${id} .chapter-frame`);
          const heading = frame.querySelector('h1,h2');
          const rect = heading.getBoundingClientRect();
          return { id, width: innerWidth, overflow: document.documentElement.scrollWidth-innerWidth,
            visible: getComputedStyle(frame).visibility === 'visible' && Number(getComputedStyle(frame).opacity) > .99,
            headingInViewport: rect.top >= 0 && rect.bottom <= innerHeight, metrics: window.__GOODKIND_3D__ ?? null };
        },id);
        assert.equal(state.overflow,0); assert.ok(state.visible,`${width}/${id}: hidden copy`); assert.ok(state.headingInViewport,`${width}/${id}: heading outside viewport`);
        if(state.metrics) { assert.equal(state.metrics.renderMode,'demand'); assert.equal(state.metrics.fps,null); assert.ok(state.metrics.triangles>0); }
        report.views.push(state);
        await page.screenshot({path:`artifacts/${production?'production-':''}3d-${width}-${id}.png`});
      }
      await chapter(page,'collection');
      const first = page.locator('.product-index button').first(); await first.focus(); await first.press('Enter');
      await page.locator('.product-dialog[open]').waitFor();
      await page.keyboard.press('Escape'); await page.locator('.product-dialog[open]').waitFor({state:'hidden'});
      assert.ok(await first.evaluate(el => el === document.activeElement),'Dialog focus not restored');
      if(width<701) {
        await page.getByRole('button',{name:'Explore',exact:false}).click();
        await page.locator('#world-menu[open]').waitFor(); await page.keyboard.press('Escape');
        assert.equal(await page.locator('#world-menu').getAttribute('open'),null);
      }
      await page.evaluate(()=>document.querySelector('canvas').getContext('webgl2').getExtension('WEBGL_lose_context').loseContext());
      await page.locator('.immersive-app[data-view="simple"]').waitFor();
      assert.equal(await page.locator('.immersive-app').getAttribute('data-webgl'),'failed');
      report.checks.push(`${width}: WebGL chapters, native product dialog, keyboard focus, context-loss recovery`);
      await page.close();
    }
    const fallback = await browser.newPage({viewport:{width:375,height:812}}); observe(fallback);
    await fallback.addInitScript(()=>{const original=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return /webgl/.test(type)?null:original.call(this,type,...args)}});
    await fallback.goto(url); await ready(fallback);
    assert.equal(await fallback.locator('.immersive-app').getAttribute('data-webgl'),'unavailable');
    assert.equal(await fallback.locator('canvas').count(),0);
    for (const button of await fallback.locator('.product-index button').all()) {
      await button.click(); await fallback.locator('.product-dialog[open]').waitFor();
      await fallback.keyboard.press('Escape');
    }
    await fallback.evaluate(async()=>{for(const image of document.images){image.loading='eager';await image.decode().catch(()=>{})}});
    assert.deepEqual(await fallback.evaluate(()=>[...document.images].filter(i=>!i.naturalWidth).map(i=>i.src)),[]);
    assert.deepEqual(await fallback.evaluate(()=>[...document.querySelectorAll('a[href^="#"]')].filter(a=>!document.getElementById(a.hash.slice(1))).map(a=>a.hash)),[]);
    await fallback.screenshot({path:`artifacts/${production?'production-':''}illustrated-mobile.png`});
    report.checks.push('No-WebGL recovery; all four products; intact images and anchors'); await fallback.close();
    assert.deepEqual(report.errors,[]);
  } finally {
    fs.writeFileSync(`artifacts/${production?'production-':''}verification-3d.json`,JSON.stringify(report,null,2));
    await browser.close();
  }
  console.log(JSON.stringify(report,null,2));
}
verify().catch(error=>{console.error(error);process.exitCode=1;});
