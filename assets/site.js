/* Mahatrix website v2: logo unveil, glass lights, reveals, hero board, sign-up, chat */
(function(){
var API='https://mahatrix-job-agent-2cpwtflusq-uc.a.run.app';
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
function $(s,r){return (r||document).querySelector(s);}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s));}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}

/* mobile menu */
var head=$('.site-head'),mb=$('.menu-btn');
if(mb)mb.addEventListener('click',function(){var o=head.classList.toggle('open');mb.setAttribute('aria-expanded',o);});
$$('.nav a').forEach(function(a){a.addEventListener('click',function(){head.classList.remove('open');});});


/* ---------- logo unveil (once per visit) ---------- */
var intro=$('#intro');
if(intro){
  var seen=false;try{seen=sessionStorage.getItem('mx_intro')==='1';}catch(e){}
  if(reduce||seen){intro.classList.add('done');document.documentElement.classList.add('ready');}
  else{
    try{sessionStorage.setItem('mx_intro','1');}catch(e){}
    var endIntro=function(){if(intro.classList.contains('done'))return;intro.classList.add('done');document.documentElement.classList.add('ready');reveal();};
    setTimeout(endIntro,2900);intro.addEventListener('click',endIntro);
    document.addEventListener('keydown',function(e){if(e.key==='Escape')endIntro();},{once:true});
  }
}

/* ---------- header turns to glass after scrolling ---------- */
function onScroll(){if(head)head.classList.toggle('scrolled',window.scrollY>24);}
window.addEventListener('scroll',onScroll,{passive:true});onScroll();

/* ---------- reveal on scroll ---------- */
var io=null;
function reveal(){
  var els=$$('.rv:not(.in)');
  if(reduce||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in');});return;}
  if(!io)io=new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target);}});},{threshold:.12,rootMargin:'0px 0px -6% 0px'});
  els.forEach(function(e){io.observe(e);});
}
if(!intro||intro.classList.contains('done'))reveal();

/* ---------- light that follows the pointer on glass ---------- */
document.addEventListener('pointermove',function(e){
  var t=e.target.closest&&e.target.closest('.lit');if(!t)return;
  var r=t.getBoundingClientRect();t.style.setProperty('--x',(e.clientX-r.left)+'px');t.style.setProperty('--y',(e.clientY-r.top)+'px');
},{passive:true});

/* ---------- hero board tilts a little with the pointer ---------- */
var bd=$('#board');
if(bd&&!reduce&&matchMedia('(pointer:fine)').matches){
  var hero=$('.hero');
  hero.addEventListener('pointermove',function(e){var r=bd.getBoundingClientRect(),cx=(e.clientX-(r.left+r.width/2))/r.width,cy=(e.clientY-(r.top+r.height/2))/r.height;
    bd.style.transform='perspective(1200px) rotateY('+(cx*5).toFixed(2)+'deg) rotateX('+(-cy*5).toFixed(2)+'deg)';});
  hero.addEventListener('pointerleave',function(){bd.style.transform='';});
}

/* ---------- demo video plays when it is on screen ---------- */
var dv=$('#demoVideo');
if(dv&&'IntersectionObserver' in window&&!reduce){
  new IntersectionObserver(function(es){es.forEach(function(en){if(en.isIntersecting){var p=dv.play();if(p&&p.catch)p.catch(function(){});}else dv.pause();});},{threshold:.5}).observe(dv);
}

/* ---------- hero board: job signals travel the traces into the feed ---------- */
var JOBS=[['Data Engineer','Fabrikam Bank','Plano, TX',91],['Senior Java Developer','Contoso Health','Charlotte, NC',86],['Business Analyst','Woodgrove Financial','Jersey City, NJ',88],
  ['Machine Learning Engineer','Northwind Analytics','Remote, USA',93],['QA Automation Engineer','Tailspin Logistics','Atlanta, GA',84],['.NET Developer','Harbor Mutual','Irving, TX',87],
  ['Salesforce Developer','Lucerne Insurance','Chicago, IL',82],['DevOps Engineer','Granite Cloud','Austin, TX',89],['Power BI Developer','Summit Data Co','Remote, USA',85],
  ['Cloud Data Engineer','Litware Energy','Houston, TX',90],['Full Stack Developer','Proseware Labs','Denver, CO',83],['IT Project Manager','Maple Systems','Phoenix, AZ',81]];
var board=$('.board-grid'),feed=$('.feed'),svg=$('.traces'),srcs=$$('.src');
var k=0,mins=[3,7,12,18,26,34];
function jobHTML(j,m,isNew){return '<li class="job'+(isNew?' new':'')+'"><b>'+esc(j[0])+'</b><span>'+esc(j[1])+' · '+esc(j[2])+' · '+m+' min ago</span><em>'+j[3]+'%</em></li>';}
function fill(){if(!feed)return;var h='';for(var i=0;i<5;i++){h+=jobHTML(JOBS[(k+i)%JOBS.length],mins[i],false);}k=5;feed.innerHTML=h;}
function paths(){
  if(!svg||!board||getComputedStyle(svg).display==='none')return [];
  var br=board.getBoundingClientRect(),fr=(feed.firstElementChild||feed).getBoundingClientRect(),W=br.width,H=br.height;
  svg.setAttribute('viewBox','0 0 '+W+' '+H);svg.setAttribute('width',W);svg.setAttribute('height',H);
  var tx=fr.left-br.left,ty=(feed.firstElementChild?feed.firstElementChild.getBoundingClientRect().top-br.top+feed.firstElementChild.offsetHeight/2:40);
  var out='',n=srcs.length;
  srcs.forEach(function(s,i){var lr=s.getBoundingClientRect(),r=s.querySelector('i').getBoundingClientRect(),y=r.top-br.top+r.height/2,
      x0=lr.right-br.left+8,bx=tx-14-(n-1-i)*5,ty2=ty-12+i*5,c=4,dir=ty2>y?1:-1;
    if(Math.abs(ty2-y)<2*c){out+='<path d="M'+x0+' '+y+' H'+tx+'" data-i="'+i+'"/>';return;}
    out+='<path d="M'+x0+' '+y+' H'+(bx-c)+' Q'+bx+' '+y+' '+bx+' '+(y+dir*c)+' V'+(ty2-dir*c)+' Q'+bx+' '+ty2+' '+(bx+c)+' '+ty2+' H'+tx+'" data-i="'+i+'"/>';});
  svg.innerHTML=out+'<circle r="4" cx="-20" cy="-20"/>';
  return $$('path',svg);
}
var ps=[];
function pulse(){
  if(!feed)return;
  var i=Math.floor(Math.random()*srcs.length),p=ps[i],dot=svg&&svg.querySelector('circle');
  function land(){
    var li=document.createElement('div');li.innerHTML=jobHTML(JOBS[k%JOBS.length],'1',true);k++;
    var n=li.firstChild;n.querySelector('span').innerHTML=n.querySelector('span').innerHTML.replace('1 min ago','just now');
    feed.insertBefore(n,feed.firstChild);
    $$('.job',feed).forEach(function(el,ix){if(ix>0){el.classList.remove('new');var sp=el.querySelector('span');sp.innerHTML=sp.innerHTML.replace(/just now|\d+ min ago/,(mins[ix-1]||40)+' min ago');}});
    while(feed.children.length>5)feed.removeChild(feed.lastChild);
    if(srcs[i]){srcs[i].classList.add('hot');setTimeout(function(){srcs[i].classList.remove('hot');},900);}
  }
  if(!p||!dot){land();return;}
  p.classList.add('lit');srcs[i].classList.add('hot');
  var L=p.getTotalLength(),t0=null,dur=1100;
  function step(ts){if(t0===null)t0=ts;var f=Math.min(1,(ts-t0)/dur),e=f<.5?2*f*f:1-Math.pow(-2*f+2,2)/2,pt=p.getPointAtLength(L*e);
    dot.setAttribute('cx',pt.x);dot.setAttribute('cy',pt.y);
    if(f<1)requestAnimationFrame(step);else{dot.setAttribute('cx',-20);p.classList.remove('lit');land();}}
  requestAnimationFrame(step);
}
if(feed){
  fill();
  var start=function(){ps=paths();if(!reduce){setTimeout(pulse,900);setInterval(function(){if(!document.hidden)pulse();},3200);}};
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(start);else window.addEventListener('load',start);
  var rt;window.addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){ps=paths();},150);});
}

/* ---------- forms ---------- */
async function post(path,body){
  var r=await fetch(API+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  var d={};try{d=await r.json();}catch(e){}
  if(!r.ok)throw new Error(typeof d.detail==='string'?d.detail:'Something went wrong. Email info@mahatrixtechnologies.com instead.');
  return d;
}
function data(form){var o={};new FormData(form).forEach(function(v,k){if(o[k]!==undefined){o[k]=[].concat(o[k],v);}else o[k]=v;});return o;}

/* free-trial / plan sign-up */
var dlg=$('#signup');
function openSignup(plan){
  if(!dlg)return;
  var f=$('form',dlg);f.hidden=false;$('.done',dlg).hidden=true;$('.err',f).textContent='';
  $('[name=plan]',f).value=plan||'trial';
  $('#signupTitle').textContent=plan&&plan!=='trial'?'Get started — '+plan.charAt(0).toUpperCase()+plan.slice(1)+' plan':'Start your free trial';
  dlg.showModal();setTimeout(function(){$('[name=first_name]',f).focus();},50);
}
window.mxSignup=openSignup;
$$('[data-signup]').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();openSignup(b.getAttribute('data-signup'));});});
if(dlg){
  $$('[data-close]',dlg).forEach(function(b){b.addEventListener('click',function(){dlg.close();});});
  dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close();});
  $('form',dlg).addEventListener('submit',async function(e){
    e.preventDefault();var f=e.target,btn=$('button[type=submit]',f),err=$('.err',f),d=data(f);
    d.job_types=[].concat(d.job_types||[]);d.agree=!!d.agree;
    var plan=d.plan;delete d.plan;d.message=(plan&&plan!=='trial'?'Plan: '+plan+'. ':'')+(d.message||'');
    btn.disabled=true;btn.textContent='Sending…';err.textContent='';
    try{await post('/leads',d);f.hidden=true;$('.done',dlg).hidden=false;}
    catch(x){err.textContent=x.message;}
    finally{btn.disabled=false;btn.textContent='Send';}
  });
}

/* chat */
var chat=$('#chat'),cb=$('#chatBtn');
function openChat(kind){chat.classList.add('on');cb.setAttribute('aria-expanded','true');var f=$('form',chat);if(kind)$('[name=kind]',f).value=kind;setTimeout(function(){$('[name=name]',f).focus();},60);}
function closeChat(){chat.classList.remove('on');cb.setAttribute('aria-expanded','false');cb.focus();}
window.mxChat=openChat;
if(chat&&cb){
  cb.addEventListener('click',function(){chat.classList.contains('on')?closeChat():openChat();});
  $('.x',chat).addEventListener('click',closeChat);
  document.addEventListener('keydown',function(e){if(e.key==='Escape'&&chat.classList.contains('on'))closeChat();});
  $$('[data-chat]').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();openChat(b.getAttribute('data-chat'));});});
  $('form',chat).addEventListener('submit',async function(e){
    e.preventDefault();var f=e.target,btn=$('button[type=submit]',f),err=$('.err',f),d=data(f);d.page=location.pathname+location.hash;
    btn.disabled=true;btn.textContent='Sending…';err.textContent='';
    try{await post('/public/support',d);f.hidden=true;$('.chat .done').hidden=false;}
    catch(x){err.textContent=x.message;}
    finally{btn.disabled=false;btn.textContent='Send message';}
  });
}
var y=$('#year');if(y)y.textContent=new Date().getFullYear();
})();
