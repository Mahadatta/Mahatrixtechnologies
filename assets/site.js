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
  var PN={starter:'Launch',pro:'Accelerate',exclusive:'Autopilot'};$('#signupTitle').textContent=plan&&PN[plan]?'Start with '+PN[plan]+' — 5 days free':'Start your free trial';
  dlg.showModal();setTimeout(function(){$('[name=first_name]',f).focus();},50);var dn=$('.done',dlg);if(dn&&!dn.dataset.orig)dn.dataset.orig=dn.innerHTML;else if(dn)dn.innerHTML=dn.dataset.orig;
}
window.mxSignup=openSignup;
$$('[data-signup]').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();openSignup(b.getAttribute('data-signup'));});});
if(dlg){
  $$('[data-close]',dlg).forEach(function(b){b.addEventListener('click',function(){dlg.close();});});
  dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close();});
  $('form',dlg).addEventListener('submit',async function(e){
    e.preventDefault();var f=e.target,btn=$('button[type=submit]',f),err=$('.err',f),d=data(f);
    var plan=d.plan||'trial';err.textContent='';
    if(!/^\d{6}$/.test(d.pin||'')){err.textContent='Choose a 6-digit PIN (numbers only).';return;}
    if(d.pin!==d.pin2){err.textContent='The two PINs don\'t match.';return;}
    if(!d.agree){err.textContent='Please accept the Terms and Privacy Policy.';return;}
    var body={name:((d.first_name||'')+' '+(d.last_name||'')).trim(),email:d.email,phone:d.phone,role:d.role,visa:d.visa,experience:d.experience,
      linkedin:d.linkedin,pin:d.pin,agree:true,website:d.website||'',plan:plan};
    btn.disabled=true;btn.textContent='Creating account…';
    try{
      try{await post('/signup',body);}
      catch(x){   /* sign-up switched off on the server: send the details as before */
        if(!/closed/i.test(x.message))throw x;
        await post('/leads',{first_name:d.first_name,last_name:d.last_name,email:d.email,phone:d.phone,role:d.role,work_authorization:d.visa,experience_years:d.experience,
          linkedin:d.linkedin,message:'Plan: '+plan+'.',agree:true,job_types:['Full-time']});
        $('.done p',dlg).innerHTML='<b>Thanks — we have your details.</b>';$('.done p:nth-of-type(2)',dlg).textContent='We\'ll email you from info@mahatrixtechnologies.com, usually within one business day, to set up your account.';
      }
      var go=$('#signupGo');if(go)go.href='https://portal.mahatrixtechnologies.com/?u='+encodeURIComponent(d.email||'');
      f.hidden=true;$('.done',dlg).hidden=false;
    }
    catch(x){err.textContent=x.message;}
    finally{btn.disabled=false;btn.textContent='Create account';}
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
  $$('[data-chat]').forEach(function(b){b.addEventListener('click',function(e){e.preventDefault();openChat(b.getAttribute('data-chat'));var m=b.getAttribute('data-msg');if(m){var t=$('[name=message]',chat);if(t&&!t.value)t.value=m;}});});
  $('form',chat).addEventListener('submit',async function(e){
    e.preventDefault();var f=e.target,btn=$('button[type=submit]',f),err=$('.err',f),d=data(f);d.page=location.pathname+location.hash;
    btn.disabled=true;btn.textContent='Sending…';err.textContent='';
    try{await post('/public/support',d);f.hidden=true;$('.chat .done').hidden=false;}
    catch(x){err.textContent=x.message;}
    finally{btn.disabled=false;btn.textContent='Send message';}
  });
}

/* =================== v4 tech layer =================== */
var fine=matchMedia('(pointer:fine)').matches;

/* signal mesh behind each hero: job nodes drift, link up near each other and near the pointer; pulses run along links */
$$('.hero').forEach(function(h){
  if(reduce)return;
  var c=document.createElement('canvas');c.className='mesh';c.setAttribute('aria-hidden','true');h.insertBefore(c,h.firstChild);
  var x=c.getContext('2d'),W=0,H=0,dpr=Math.min(2,window.devicePixelRatio||1),N=[],P=[],mx=-999,my=-999,vis=true,sub=h.classList.contains('sub');
  function size(){var r=h.getBoundingClientRect();W=r.width;H=r.height;c.width=W*dpr;c.height=H*dpr;x.setTransform(dpr,0,0,dpr,0,0);
    var n=Math.round(Math.min(sub?46:80,W*H/(sub?16000:12000)));N=[];for(var i=0;i<n;i++)N.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.25,vy:(Math.random()-.5)*.25,r:Math.random()*1.4+.6,h:Math.random()<.12});}
  size();var rt2;window.addEventListener('resize',function(){clearTimeout(rt2);rt2=setTimeout(size,200);});
  h.addEventListener('pointermove',function(e){var r=h.getBoundingClientRect();mx=e.clientX-r.left;my=e.clientY-r.top;},{passive:true});
  h.addEventListener('pointerleave',function(){mx=my=-999;});
  if('IntersectionObserver' in window)new IntersectionObserver(function(es){vis=es[0].isIntersecting;}).observe(h);
  var D=130,last=0;
  function frame(ts){requestAnimationFrame(frame);if(!vis||document.hidden)return;
    x.clearRect(0,0,W,H);var i,j,a,b,dx,dy,d;
    for(i=0;i<N.length;i++){a=N[i];a.x+=a.vx;a.y+=a.vy;if(a.x<0||a.x>W)a.vx*=-1;if(a.y<0||a.y>H)a.vy*=-1;
      dx=mx-a.x;dy=my-a.y;d=Math.sqrt(dx*dx+dy*dy);if(d<180){a.x+=dx*.004;a.y+=dy*.004;}}
    x.lineWidth=1;
    for(i=0;i<N.length;i++){a=N[i];for(j=i+1;j<N.length;j++){b=N[j];dx=a.x-b.x;dy=a.y-b.y;d=dx*dx+dy*dy;if(d<D*D){x.strokeStyle='rgba(127,227,214,'+(.16*(1-Math.sqrt(d)/D))+')';x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke();}}
      dx=mx-a.x;dy=my-a.y;d=Math.sqrt(dx*dx+dy*dy);if(d<200){x.strokeStyle='rgba(127,227,214,'+(.45*(1-d/200))+')';x.beginPath();x.moveTo(a.x,a.y);x.lineTo(mx,my);x.stroke();}}
    for(i=0;i<N.length;i++){a=N[i];x.fillStyle=a.h?'rgba(127,227,214,.95)':'rgba(220,240,238,.45)';x.beginPath();x.arc(a.x,a.y,a.h?a.r+.8:a.r,0,6.283);x.fill();
      if(a.h){x.fillStyle='rgba(127,227,214,.12)';x.beginPath();x.arc(a.x,a.y,7,0,6.283);x.fill();}}
    if(ts-last>420&&N.length>2){last=ts;a=N[Math.random()*N.length|0];var best=null,bd=1e9;for(j=0;j<N.length;j++){b=N[j];if(b===a)continue;dx=a.x-b.x;dy=a.y-b.y;d=dx*dx+dy*dy;if(d<D*D&&d<bd&&d>400){bd=d;best=b;}}if(best)P.push({a:a,b:best,t:0});}
    for(i=P.length-1;i>=0;i--){var q=P[i];q.t+=.025;if(q.t>=1){P.splice(i,1);continue;}var px=q.a.x+(q.b.x-q.a.x)*q.t,py=q.a.y+(q.b.y-q.a.y)*q.t;
      var g=x.createRadialGradient(px,py,0,px,py,9);g.addColorStop(0,'rgba(255,255,255,.95)');g.addColorStop(.3,'rgba(127,227,214,.8)');g.addColorStop(1,'rgba(127,227,214,0)');x.fillStyle=g;x.beginPath();x.arc(px,py,9,0,6.283);x.fill();}
  }
  requestAnimationFrame(frame);
});

/* headline decodes from signal noise into words (once) */
function decode(el){
  if(reduce||!el||el.dataset.dec)return;el.dataset.dec='1';
  var txt=el.textContent,G='01<>/{}[]#$%&*+=?ABCDEFXYZ',L=txt.length,t0=performance.now(),dur=1100;el.classList.add('dec');el.setAttribute('aria-label',txt);
  function step(now){var p=Math.min(1,(now-t0)/dur),out='';
    for(var i=0;i<L;i++){var ch=txt[i],th=i/L*.75;if(ch===' '||p>=th+.25)out+=esc(ch);else if(p<th)out+='<span class="g" style="opacity:.18">'+esc(G[Math.random()*G.length|0])+'</span>';else out+='<span class="g">'+esc(G[Math.random()*G.length|0])+'</span>';}
    el.innerHTML=out;if(p<1)requestAnimationFrame(step);else el.textContent=txt;}
  requestAnimationFrame(step);
}
var h1=$('.hero h1');
if(h1){var go1=function(){setTimeout(function(){decode(h1);},120);};if(intro&&!intro.classList.contains('done')){var mo=new MutationObserver(function(){if(intro.classList.contains('done')){mo.disconnect();go1();}});mo.observe(intro,{attributes:true});}else go1();}

/* match engine terminal: types its run when it comes into view, then loops */
var term=$('.term-body');
var RUN=[
 ['$ ','scan --role "Data Engineer" --auth H-1B --near "Dallas, TX"'],
 ['ok','new jobs found across the USA · last hour'],
 ['ok','removed: no sponsorship · clearance only · citizens only'],
 ['bar','scored against your resume',92,'top match 92%'],
 ['$ ','tailor --job "Senior Data Engineer · Vantor Logistics"'],
 ['ok','key skills found in your real experience: Kafka, Spark, Airflow'],
 ['bar','ATS match 64% → 92%',92,''],
 ['$ ','track'],
 ['ok','assessment invite received · next step saved'],
 ['ok','screening booked · Wed 11:30 AM · prep sheet ready'],
 ['hi','interview · round 2 · you are prepared']
];
if(term){
  var running=false;
  function line(r){if(r[0]==='$ ')return '<span class="p">$ </span><span class="hi"></span>';if(r[0]==='bar')return '<span class="ok">✓ </span><span class="t"></span> <span class="bar"></span> <span class="dim"></span>';if(r[0]==='hi')return '<span class="p">→ </span><span class="hi t"></span>';return '<span class="ok">✓ </span><span class="t"></span>';}
  async function wait(ms){return new Promise(function(r){setTimeout(r,ms);});}
  async function type(el,s,sp){for(var i=1;i<=s.length;i++){el.textContent=s.slice(0,i);await wait(sp);}}
  async function play(){
    if(running)return;running=true;
    while(true){
      term.innerHTML='';var cur=document.createElement('span');cur.className='cur';
      for(var i=0;i<RUN.length;i++){var r=RUN[i],d=document.createElement('div');d.innerHTML=line(r);term.appendChild(d);d.appendChild(cur);
        if(r[0]==='$ '){await type(d.querySelector('.hi'),r[1],reduce?0:28);await wait(260);}
        else{var t=d.querySelector('.t');t.textContent=r[1];if(r[0]==='bar'){var b=d.querySelector('.bar');await wait(60);b.style.setProperty('--w',(r[2]*1.8)+'px');await wait(1000);d.querySelector('.dim').textContent=r[3];}await wait(reduce?0:420);}
        flowTo(i);
      }
      if(reduce)return;await wait(5200);
    }
  }
  if('IntersectionObserver' in window){var tio=new IntersectionObserver(function(es){if(es[0].isIntersecting){tio.disconnect();play();}},{threshold:.35});tio.observe(term);}else play();
}
/* flow rail lights up step by step with the terminal */
var steps=$$('.flow-steps li'),fl=$('.flow'),spark=null;
var MAP=[0,0,1,1,2,2,2,3,4,4,5];
function flowTo(i){if(!steps.length)return;var k=MAP[i]||0;if(i===0)steps.forEach(function(s){s.classList.remove('on');});
  steps.forEach(function(s,ix){if(ix<=k)s.classList.add('on');});
  if(!spark){spark=document.createElement('span');spark.className='spark';$('.flow-steps').appendChild(spark);}
  spark.style.transition=reduce?'none':'top .6s cubic-bezier(.2,.75,.15,1)';spark.style.top=(steps[k].offsetTop+2)+'px';}

/* plan cards tilt toward the pointer; the featured plan carries a moving light beam */
$$('.plan.pick').forEach(function(p){var b=document.createElement('span');b.className='beam';b.setAttribute('aria-hidden','true');p.appendChild(b);});
if(fine&&!reduce)$$('.tilt').forEach(function(t){
  t.addEventListener('pointermove',function(e){var r=t.getBoundingClientRect(),cx=(e.clientX-r.left)/r.width-.5,cy=(e.clientY-r.top)/r.height-.5;
    t.style.transform='perspective(900px) rotateY('+(cx*8).toFixed(2)+'deg) rotateX('+(-cy*8).toFixed(2)+'deg) translateZ(6px)';});
  t.addEventListener('pointerleave',function(){t.style.transform='';});
});
/* primary buttons lean toward the pointer */
if(fine&&!reduce)$$('.btn-primary').forEach(function(b){
  b.addEventListener('pointermove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.12).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*.18).toFixed(1)+'px)';});
  b.addEventListener('pointerleave',function(){b.style.transform='';});
});
var y=$('#year');if(y)y.textContent=new Date().getFullYear();
})();
