/* Mahatrix website: hero board, live plans, free-trial sign-up, chat */
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

/* ---------- plans: live from the portal, fallback below ---------- */
var FALLBACK={plans:[{id:'trial',name:'Trial',price:0,perks:['5 applications a day','Full-time jobs','Daily applications file + your own login','1 ATS resume check']},
  {id:'basic',name:'Basic',price:50,perks:['15 applications a day','Full-time jobs','Daily applications file + your own login','ATS resume checks','Resume tailored for 2 jobs a week']},
  {id:'standard',name:'Standard',price:100,perks:['30 applications a day','Full-time + W2 / C2C / C2H vendor jobs','Resume tailored daily','Vendor outreach in your voice','Vendor call prep + interview prep','Assessment & RTR follow-up']},
  {id:'premium',name:'Premium',price:150,perks:['50 applications a day','All jobs — email requirements first','Resume tailored for every application','Vendor outreach in your voice','Call prep, interview prep + mock interview','Dedicated recruiter + weekly strategy call']}],trial_days:5};
function money(v){v=Number(v||0);return '$'+(v%1?v.toFixed(2):v.toFixed(0));}
function renderPlans(d){
  var box=$('#plans');if(!box)return;
  var td=d.trial_days||5;
  box.innerHTML=(d.plans||[]).map(function(p){
    var trial=p.id==='trial',pick=p.id==='standard';
    return '<article class="plan'+(pick?' pick':'')+'"><h3>'+esc(p.name)+'</h3><div class="tag">'+(pick?'Most chosen':trial?td+' days, no card':'')+'</div>'+
      '<div class="price">'+(trial?'Free':money(p.price))+(trial?'':' <small>/ month</small>')+'</div>'+
      '<ul>'+(p.perks||[]).map(function(x){return '<li>'+esc(String(x).replace(/,?\s*with proof/i,''))+'</li>';}).join('')+'</ul>'+
      '<button class="btn '+(pick?'btn-primary':'btn-ghost')+'" data-plan="'+esc(p.id)+'">'+(trial?'Start free trial':'Choose '+esc(p.name))+'</button></article>';}).join('');
  $$('[data-plan]',box).forEach(function(b){b.addEventListener('click',function(){openSignup(b.getAttribute('data-plan'));});});
}
renderPlans(FALLBACK);
fetch(API+'/plans/public').then(function(r){return r.ok?r.json():null;}).then(function(d){if(d&&d.plans&&d.plans.length)renderPlans(d);}).catch(function(){});

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
