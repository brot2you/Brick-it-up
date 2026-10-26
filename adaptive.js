'use strict';
/* Brick It Up! V14 — parcours adaptatif indépendant des défis existants. */
(()=>{
const ROOT=document.querySelector('#screen'), HEADER=document.querySelector('#app');
if(!ROOT)return;
const key='brick-adaptive-v14';
const grades=['6e','5e','4e','3e'],levels=['Découverte','Consolidation','Expert'];
const pool={
'6e':[
 {subjects:['She','He','Maya','Leo'],verbs:['plays','likes','practises'],objects:['football','tennis','basketball'],places:['in the park','at school','at the sports centre'],times:['on Saturdays','after school','every weekend']},
 {subjects:['They','We','My friends','The children'],verbs:['play','watch','enjoy'],objects:['video games','cartoons','football'],places:['at home','in the garden','in the park'],times:['on Sundays','after school','every evening']}
],
'5e':[
 {subjects:['She','My sister','Maya','The girl'],verbs:['reads','studies','practises'],objects:['English','French','Spanish'],places:['at school','in her room','at the library'],times:['every day','after school','on Mondays']},
 {subjects:['They','We','My friends','The students'],verbs:['study','practise','learn'],objects:['English','French','Spanish'],places:['at school','at home','in the classroom'],times:['every week','after lunch','on Fridays']}
],
'4e':[
 {subjects:['She','My brother','Leo','The student'],verbs:['watched','visited','enjoyed'],objects:['a film','a museum','a concert'],places:['in London','with her family','last summer'],times:['yesterday','last week','on Saturday']},
 {subjects:['They','We','My friends','The students'],verbs:['watched','visited','enjoyed'],objects:['a film','a museum','a concert'],places:['in London','with their friends','during the holiday'],times:['yesterday','last week','on Saturday']}
],
'3e':[
 {subjects:['She','The athlete','Maya','The teenager'],verbs:['trained','worked','studied'],objects:['hard','regularly','every day'],places:['at home','at school','in London'],times:['last year','during the holidays','on Saturday']},
 {subjects:['They','We','The students','My friends'],verbs:['trained','worked','studied'],objects:['hard','regularly','every day'],places:['at home','at school','in London'],times:['last year','during the holidays','on Saturday']}
]};
const grammar={
'6e':['sujet','accord','complément','temps'],
'5e':['sujet','accord','complément','lieu'],
'4e':['sujet','prétérit','complément','temps'],
'3e':['sujet','prétérit','connecteur','concession']};
const distractors={
'sujet':['Him','Her','Them'],
'accord':['play','playss','are play'],
'prétérit':['watching','visits','enjoy'],
'complément':['a playing','the footballs is','an very book'],
'temps':['every Saturdays','in yesterday','at last week'],
'lieu':['at the London','on home','in school the'],
'connecteur':['because of she','because he want','so because'],
'concession':['although because','even she tired','despite she was']};
let saved={};try{saved=JSON.parse(localStorage.getItem(key)||'{}')}catch{}
let state={grade:'6e',level:0,session:0,question:null,placed:[],tries:0,hints:0,feedback:''};
function store(){try{localStorage.setItem(key,JSON.stringify(saved))}catch{}}
function profile(){const id=state.grade+':'+state.level;return saved[id]||(saved[id]={seen:{},mistakes:{},correct:0,attempts:0,streak:0,successes:0})}
function num(seed,n){return (Math.imul(seed+1,1103515245)+12345>>>0)%n}
function sample(arr,seed){return arr[num(seed,arr.length)]}
function generate(){
 const p=profile(),cfg=pool[state.grade],session=state.session;
 const templates=[];
 for(let group=0;group<cfg.length;group++){
  for(let si=0;si<4;si++)for(let vi=0;vi<3;vi++)for(let oi=0;oi<3;oi++)for(let t=0;t<3;t++){
   const c=cfg[group],subject=c.subjects[si],verb=c.verbs[vi],object=c.objects[oi];
   const parts=[[subject,'subject','sujet'],[verb,'verb',state.level===0?'accord':(state.grade==='4e'||state.grade==='3e'?'prétérit':'accord')],[object,'object','complément']];
   if(state.level>=1)parts.push([c.times[t],'time','temps']);
   if(state.level===2)parts.push([c.places[(t+vi)%3],'place','lieu']);
   const id=[group,si,vi,oi,t].join('-');
   templates.push({id,parts,skill:parts[1][2],group,subject,verb});
  }
 }
 let ordered=templates.filter(t=>!p.seen[t.id]);
 if(ordered.length===0){p.seen={};ordered=templates;}
 const weaker=Object.entries(p.mistakes).sort((a,b)=>b[1]-a[1])[0]?.[0];
 let candidates=ordered.filter(t=>weaker?t.parts.some(part=>part[2]===weaker):true);
 if(!candidates.length)candidates=ordered;
 const q=candidates[num(session*17+state.level*11,candidates.length)];
 let pieces=q.parts.map((part,i)=>({id:'v'+i,text:part[0],kind:part[1],skill:part[2],position:i,valid:true}));
 const wrongKind=q.parts[1][2],wrong=sample(distractors[wrongKind]||distractors.accord,session);
 pieces.push({id:'x1',text:wrong,kind:'verb',skill:wrongKind,valid:false});
 if(state.level>0)pieces.push({id:'x2',text:sample(distractors.temps,session+3),kind:'time',skill:'temps',valid:false});
 if(state.level===2)pieces.push({id:'x3',text:sample(distractors.lieu,session+7),kind:'place',skill:'lieu',valid:false});
 const shift=num(session+5,pieces.length);pieces=pieces.slice(shift).concat(pieces.slice(0,shift)).reverse();
 return {...q,pieces,expected:q.parts.map(p=>p[0]).join(' ')+'.'};
}
function link(){if(document.querySelector('#adaptiveLaunch'))return;const b=document.createElement('button');b.id='adaptiveLaunch';b.className='cta green';b.textContent='🧠 Parcours adaptatif · 3 paliers';b.addEventListener('click',()=>open());const group=document.querySelector('.grade-detail')||document.querySelector('.grade-section')||document.querySelector('.hero-content');if(group)group.appendChild(b)}
function open(){state.grade=(typeof chosenGrade!=='undefined'&&grades.includes(chosenGrade))?chosenGrade:state.grade;state.question=null;renderMenu()}
function renderMenu(){
 const total=pool[state.grade].length*4*3*3*3;
 ROOT.innerHTML='<button class="back-link" id="adaptBack">← Accueil</button><section class="panel adapt-panel"><span class="tag">🧠 SENTENCE ENGINEERING · ADAPTATIF</span><h1>Mon parcours de constructeur</h1><p>Des missions générées à partir de modèles vérifiés, des conseils progressifs et des révisions ciblées.</p><div class="adapt-grades">'+grades.map(g=>'<button class="hint-btn '+(g===state.grade?'selected':'')+'" data-grade="'+g+'">'+g+'</button>').join('')+'</div><div class="adapt-levels">'+levels.map((label,i)=>{let p=saved[state.grade+':'+i]||{correct:0,attempts:0,streak:0};return '<button class="adapt-level" data-level="'+i+'"><b>'+['🌱','🔧','🏆'][i]+' '+label+'</b><small>'+ (i===0?'Sujet + verbe + complément':i===1?'Ajout de précisions temporelles':'Phrase enrichie, davantage de pièges')+'</small><span>'+p.correct+' réussites · '+p.attempts+' essais</span></button>'}).join('')+'</div><p class="info-note">'+total+' constructions de base différentes par palier et par classe, avant les révisions. Les exercices s’adaptent aux erreurs mémorisées localement.</p></section>';
 document.querySelector('#adaptBack').onclick=()=>{if(typeof goHome==='function')goHome()};
 document.querySelectorAll('[data-grade]').forEach(b=>b.onclick=()=>{state.grade=b.dataset.grade;renderMenu()});
 document.querySelectorAll('[data-level]').forEach(b=>b.onclick=()=>{state.level=+b.dataset.level;state.session=0;next()});
}
function next(){state.question=generate();state.placed=[];state.tries=0;state.hints=0;state.feedback='';renderQuestion()}
function renderQuestion(){
 const q=state.question,p=profile(),isDone=state.feedback.startsWith('✅');
 const applied=state.placed.map(id=>q.pieces.find(x=>x.id===id));
 const pct=p.attempts?Math.round(p.correct/p.attempts*100):0;
 ROOT.innerHTML='<button class="back-link" id="adaptMenu">← Mes parcours</button><section class="panel adapt-panel"><div class="game-head"><span class="tag">'+state.grade+' · '+levels[state.level]+'</span><strong>'+p.correct+' réussites · '+pct+' %</strong></div><h2>Construis une phrase correcte</h2><p>Choisis les bonnes briques et place-les dans l’ordre. Certaines briques sont des pièges !</p><div class="adapt-progress"><div style="width:'+Math.max(4,pct)+'%"></div></div><div class="play-area"><h3>🧱 Ta construction</h3><div class="sentence grow-sentence">'+(applied.length?applied.map((x,i)=>'<button class="brick" data-kind="'+x.kind+'" data-remove="'+i+'" '+(isDone?'disabled':'')+'>'+x.text+' ×</button>').join(''):'<span class="placeholder">Sélectionne les briques…</span>')+'</div><h3>🧰 Réserve de briques</h3><div class="bank">'+q.pieces.filter(x=>!state.placed.includes(x.id)).map(x=>'<button class="brick" data-kind="'+x.kind+'" data-add="'+x.id+'" '+(isDone?'disabled':'')+'>'+x.text+'</button>').join('')+'</div></div><div class="feedback" role="status">'+state.feedback+'</div><div class="actions"><button class="cta green" id="adaptCheck" '+(!applied.length||isDone?'disabled':'')+'>✔ Vérifier</button><button class="hint-btn" id="adaptHint" '+(isDone?'disabled':'')+'>💡 Indice '+state.hints+'/3</button><button class="hint-btn" id="adaptClear" '+(isDone?'disabled':'')+'>↶ Recommencer</button>'+(isDone?'<button class="cta blue" id="adaptNext">➜ Défi suivant</button>':'')+'</div><p class="info-note">Ton entraînement est enregistré sur cet appareil. Les notions avec erreurs reviennent plus souvent.</p></section>';
 document.querySelector('#adaptMenu').onclick=renderMenu;
 document.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{state.placed.push(b.dataset.add);state.feedback='';renderQuestion()});
 document.querySelectorAll('[data-remove]').forEach(b=>b.onclick=()=>{state.placed.splice(+b.dataset.remove,1);state.feedback='';renderQuestion()});
 document.querySelector('#adaptClear').onclick=()=>{state.placed=[];state.feedback='';renderQuestion()};
 document.querySelector('#adaptHint').onclick=()=>{
  state.hints=Math.min(3,state.hints+1);
  const h=state.hints;
  state.feedback=h===1?'Indice 1 : repère d’abord le sujet (bleu), puis le verbe (rouge).':h===2?'Indice 2 : la phrase attend '+q.parts.length+' briques. Évite les formes grammaticalement incorrectes.':'Indice 3 : les premiers mots sont « '+q.parts.slice(0,2).map(x=>x[0]).join(' ')+' ».';
  renderQuestion()
 };
 document.querySelector('#adaptCheck').onclick=()=>{
  const chosen=state.placed.map(id=>q.pieces.find(x=>x.id===id));
  const valid=chosen.length===q.parts.length&&chosen.every((x,i)=>x.valid&&x.position===i);
  p.attempts++;p.seen[q.id]=true;
  if(valid){p.correct++;p.successes++;p.streak++;state.feedback='✅ Bravo ! '+q.expected+' Construction correcte.';p.mistakes[q.skill]=Math.max(0,(p.mistakes[q.skill]||0)-1)}
  else{p.streak=0;state.tries++;const firstWrong=chosen.find((x,i)=>!x.valid||x.position!==i);const skill=firstWrong?.skill||q.skill;p.mistakes[skill]=(p.mistakes[skill]||0)+1;state.feedback='À retravailler : '+(skill==='accord'?'accord sujet-verbe':skill==='prétérit'?'forme du verbe au passé':skill==='temps'?'expression du temps':skill==='lieu'?'expression du lieu':'ordre sujet – verbe – complément')+'. Essaie de modifier tes briques.'}
  store();renderQuestion()
 };
 const nxt=document.querySelector('#adaptNext');if(nxt)nxt.onclick=()=>{state.session++;next()};
}
setTimeout(link,0);
const observer=new MutationObserver(()=>{if(document.querySelector('.grade-detail')&&!document.querySelector('#adaptiveLaunch'))link()});
observer.observe(ROOT,{childList:true,subtree:false});
})();
