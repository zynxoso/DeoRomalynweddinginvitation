import { chromium } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';
await mkdir('.review/envelope', { recursive: true });
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const errors=[];
try {
 for (const [width,height] of [[320,568],[390,844],[768,1024],[1440,900],[844,390]]) {
  const context=await browser.newContext({viewport:{width,height}});
  const page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(process.env.ENVELOPE_TEST_URL ?? 'http://localhost:3000');
  await page.getByRole('button',{name:'Open invitation',exact:true}).waitFor();
  await page.evaluate(()=>document.fonts.ready);
  await page.screenshot({path:`.review/envelope/${width}-closed.png`});
  await page.evaluate(()=>{
   window.envelopeFrames=[];
   const sample=()=>{
    const e=document.querySelector('.envelope');
    if(!e)return;
    if(e.classList.contains('is-opening')||window.envelopeFrames.length){
     const letter=e.querySelector('.envelope-letter');
     const title=document.getElementById('entrance-title');
     const stage=document.querySelector('.envelope-stage');
     const m=new DOMMatrix(getComputedStyle(letter).transform);
     const flapStyle=getComputedStyle(e.querySelector('.envelope-flap'));
     window.envelopeFrames.push({open:e.classList.contains('is-opening'),y:m.m42,letterTop:letter.getBoundingClientRect().top,titleBottom:title.getBoundingClientRect().bottom,stageTop:stage.getBoundingClientRect().top,flapZ:flapStyle.zIndex,flapY:new DOMMatrix(flapStyle.transform).m22});
    }
    requestAnimationFrame(sample);
   };requestAnimationFrame(sample);
  });
  await page.getByRole('button',{name:'Open invitation',exact:true}).click();
  await page.waitForTimeout(1350);
  const box=await page.locator('.envelope').boundingBox();
  const pixels=await page.screenshot({path:`.review/envelope/${width}-open.png`});
  const {data,info}=await sharp(pixels).removeAlpha().raw().toBuffer({resolveWithObject:true});
  const offset=(Math.floor(box.y+box.height*.1)*info.width+Math.floor(box.x+box.width/2))*info.channels;
  assert.ok(data[offset]>248 && data[offset+1]>245 && data[offset+2]>240,`Opaque envelope front covers the letter at ${width}`);
  await page.getByRole('dialog').waitFor({state:'hidden'});
  const frames=await page.evaluate(()=>window.envelopeFrames);
  assert.ok(frames.length>20);
  assert.ok(frames.every(f=>f.open),`Envelope closes during exit at ${width}`);
  assert.ok(frames.every(f=>f.letterTop>=f.titleBottom+12),`Letter overlaps heading at ${width}`);
  assert.ok(frames.every(f=>f.stageTop>=f.titleBottom),`Flap area overlaps heading at ${width}`);
  assert.ok(frames.at(-1).y<=-89);
  for(let i=1;i<frames.length;i++)assert.ok(frames[i].y<=frames[i-1].y+0.5,`Letter reverses at ${width}`);
  assert.equal(frames.at(-1).flapZ,'1');
  assert.ok(frames.filter(f=>f.y<-5).every(f=>f.flapY<-.95),`Letter emerges before flap opens at ${width}`);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
  await page.getByRole('button',{name:'Open the envelope again'}).click();
  assert.equal(await page.locator('.envelope.is-opening').count(),0);
  await page.getByRole('button',{name:'Open invitation',exact:true}).waitFor({state:'visible'});
  await page.keyboard.press('Tab');
  assert.equal(await page.getByRole('button',{name:'View invitation',exact:true}).evaluate(e=>e===document.activeElement),true);
  await page.keyboard.press('Escape');
  await page.getByRole('dialog').waitFor({state:'hidden'});
  if(width===390){
   await page.getByRole('button',{name:'Open the envelope again'}).click();
   const audit=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
   assert.deepEqual(audit.violations,[]);
  }
  await writeFile(`.review/envelope/${width}-frames.json`,JSON.stringify(frames));
  console.log(`${width}x${height}: no overlap/reversal, replay and keyboard passed`);
  await context.close();
 }
 const reducedContext=await browser.newContext({reducedMotion:'reduce'});
 const reducedPage=await reducedContext.newPage();
 await reducedPage.goto(process.env.ENVELOPE_TEST_URL ?? 'http://localhost:3000');
 await reducedPage.getByRole('button',{name:'Open invitation',exact:true}).click();
 await reducedPage.getByRole('dialog').waitFor({state:'hidden',timeout:1000});
 await reducedContext.close();
 console.log('Reduced motion: immediate entrance dismissal passed');
 assert.deepEqual(errors,[]);
} finally {await browser.close();}
