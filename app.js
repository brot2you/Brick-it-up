'use strict';
const KEY='brick-it-up-save-v1';
const $=s=>document.querySelector(s);
const E=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const worlds=[['Basic Builders','🌳','Les fondations'],['Super Sentences','🏰','Enrichis tes phrases'],['Time Travellers','⏳','Voyage dans le temps'],['Connectors Lab','🌈','Relie tes idées'],['Master Architects','🏆','Deviens architecte']];
const K={subject:'Nom / sujet',verb:'Verbe',object:'Complément',time:'Temps',place:'Lieu',connector:'Connecteur',detail:'Précision',other:'Autre'};
// Each challenge specifies unique pieces and every acceptable ordering. Never marks grammar correct by superficial keyword presence.
const q=[
{w:0,p:'Construis une phrase simple.',scene:'👧 ⚽',pieces:[['She','subject'],['plays','verb'],['football','object']],answers:[[0,1,2]],why:'En anglais, l’ordre de base est sujet + verbe + complément.'},
{w:0,p:'Décris ce garçon et son animal.',scene:'👦 🐕',pieces:[['The boy','subject'],['has','verb'],['a dog','object']],answers:[[0,1,2]],why:'Le groupe sujet précède le verbe. « A dog » est le complément.'},
{w:0,p:'Que fait Maya ?',scene:'👩 📖',pieces:[['Maya','subject'],['reads','verb'],['books','object']],answers:[[0,1,2]],why:'Avec he, she, it au présent simple affirmatif, on ajoute généralement -s au verbe.'},
{w:0,p:'Forme une phrase avec un sujet pluriel.',scene:'🧑‍🤝‍🧑 🎮',pieces:[['They','subject'],['play','verb'],['video games','object']],answers:[[0,1,2]],why:'« They » est pluriel : play ne prend pas de -s.'},
{w:0,p:'Décris ce chat.',scene:'🐈 🛋️',pieces:[['The cat','subject'],['is','verb'],['happy','detail']],answers:[[0,1,2]],why:'Be relie le sujet à un adjectif attribut : The cat is happy.'},
{w:1,p:'Ajoute une information de temps à la phrase.',scene:'👦 🛹 🕒',pieces:[['He','subject'],['rides','verb'],['his skateboard','object'],['every day','time']],answers:[[0,1,2,3],[3,0,1,2]],why:'Un complément de temps peut se placer en fin de phrase ou en début de phrase.'},
{w:1,p:'Dis où se déroule l’action.',scene:'🧒 📚 🏫',pieces:[['She','subject'],['studies','verb'],['English','object'],['at school','place']],answers:[[0,1,2,3],[3,0,1,2]],why:'Le groupe « at school » précise le lieu de l’action.'},
{w:1,p:'Décris la promenade avec deux précisions.',scene:'👨‍👩‍👧 🏞️',pieces:[['We','subject'],['walk','verb'],['in the park','place'],['on Sundays','time']],answers:[[0,1,2,3],[3,0,1,2]],why:'Une construction naturelle est sujet + verbe + lieu + temps.'},
{w:1,p:'Ajoute un adjectif au bon endroit.',scene:'🐶 🟤',pieces:[['I','subject'],['have','verb'],['a small dog','object']],answers:[[0,1,2]],why:'En anglais, l’adjectif se place généralement avant le nom : a small dog.'},
{w:1,p:'Ajoute une précision sur la façon de faire.',scene:'👧 🎤',pieces:[['Lucy','subject'],['sings','verb'],['beautifully','detail']],answers:[[0,1,2]],why:'L’adverbe « beautifully » indique comment Lucy chante.'},
{w:2,p:'Raconte une action passée.',scene:'🧑 🎬',pieces:[['I','subject'],['watched','verb'],['a film','object'],['yesterday','time']],answers:[[0,1,2,3],[3,0,1,2]],why:'Yesterday invite à employer ici le prétérit : watched.'},
{w:2,p:'Exprime une action en cours.',scene:'👧 📕',pieces:[['She','subject'],['is reading','verb'],['a book','object'],['now','time']],answers:[[0,1,2,3],[3,0,1,2]],why:'Be + verbe en -ing permet de présenter une action en cours.'},
{w:2,p:'Raconte une visite passée.',scene:'👨‍👩‍👧 🏛️',pieces:[['We','subject'],['visited','verb'],['the museum','object'],['last weekend','time']],answers:[[0,1,2,3],[3,0,1,2]],why:'« Visited » est au prétérit, pour un événement terminé.'},
{w:2,p:'Construis une phrase négative.',scene:'👦 ☕',pieces:[['He','subject'],["doesn't drink",'verb'],['coffee','object']],answers:[[0,1,2]],why:'Au présent simple, la négation avec he s’exprime par doesn’t + base verbale.'},
{w:2,p:'Construis une question au présent simple.',scene:'👩 🎾',pieces:[['Does','verb'],['she','subject'],['play tennis','object']],answers:[[0,1,2]],why:'Dans une question au présent simple avec she : Does + sujet + base verbale.'},
{w:3,p:'Explique pourquoi elle sourit.',scene:'👩 😊 🎁',pieces:[['She','subject'],['is happy','verb'],['because','connector'],['she got a present','detail']],answers:[[0,1,2,3]],why:'Because introduit une cause et est suivi d’une proposition.'},
{w:3,p:'Relie deux actions qui se suivent.',scene:'👦 🏠 📚',pieces:[['I do my homework','subject'],['when','connector'],['I get home','detail']],answers:[[0,1,2]],why:'When permet d’indiquer le moment où une action se produit.'},
{w:3,p:'Exprime une opposition.',scene:'🌧️ 👫 🌳',pieces:[['Although it is raining','connector'],['we','subject'],['go outside','verb']],answers:[[0,1,2]],why:'Although introduit un contraste. Une virgule peut séparer les deux propositions.'},
{w:3,p:'Exprime une condition.',scene:'☀️ 🏖️',pieces:[['If it is sunny','connector'],['we','subject'],['will go to the beach','verb']],answers:[[0,1,2]],why:'Pour une condition future réalisable : if + présent, will + base verbale dans la proposition principale.'},
{w:3,p:'Exprime un résultat.',scene:'😴 🛏️',pieces:[['I was tired','subject'],['so','connector'],['I went to bed','detail']],answers:[[0,1,2]],why:'So relie une cause à sa conséquence.'},
{w:4,p:'Construis une phrase avec une proposition relative.',scene:'👧 🐕 🌳',pieces:[['The girl','subject'],['who lives next door','detail'],['walks','verb'],['her dog','object'],['every morning','time']],answers:[[0,1,2,3,4]],why:'Who introduit ici une relative qui apporte une précision sur the girl.'},
{w:4,p:'Combine une condition et une idée future.',scene:'🌤️ 🧺 🌳',pieces:[['If the weather is nice','connector'],['we','subject'],['will have a picnic','verb'],['in the park','place']],answers:[[0,1,2,3]],why:'La subordonnée en if est au présent, puis on emploie will dans la principale.'},
{w:4,p:'Exprime une concession et une raison.',scene:'👦 📖 🌙',pieces:[['Although he was tired','connector'],['Tom','subject'],['kept reading','verb'],['because the story was exciting','detail']],answers:[[0,1,2,3]],why:'Although exprime l’opposition, because introduit la cause.'},
{w:4,p:'Indique une action antérieure à une autre.',scene:'👩 🚂 🕰️',pieces:[['When the train arrived','time'],['she','subject'],['had already left','verb']],answers:[[0,1,2]],why:'Le past perfect situe le départ avant l’arrivée du train.'},
{w:4,p:'Construis une phrase très élaborée.',scene:'🏫 🧑‍🤝‍🧑 🎉',pieces:[['The students','subject'],['who had worked hard','detail'],['celebrated','verb'],['their success','object'],['after the exam','time']],answers:[[0,1,2,3,4]],why:'Une relative enrichit le sujet ; le complément de temps situe l’événement.'}
];

// Parcours de classe : exemples progressifs alignés sur les objectifs linguistiques,
// sans prétendre que les 8 exercices ajoutés couvrent la totalité des programmes.
const gradeTracks={
 '6e':{label:'6e · Premières constructions',cefr:'A1 → A1+',summary:'Présenter, décrire, exprimer goûts et habitudes. Sujet + verbe + complément, be/have, présent simple.',world:0},
 '5e':{label:'5e · Enrichir et situer',cefr:'A1+ → A2',summary:'Ajouter des précisions, décrire le quotidien, lieux, temps, fréquence, adjectifs et groupes nominaux.',world:1},
 '4e':{label:'4e · Relier ses idées',cefr:'Vers A2+',summary:'Questions, négations, récit au passé, connecteurs de cause et d’opposition, comparaison.',world:3},
 '3e':{label:'3e · Nuancer et argumenter',cefr:'Vers B1',summary:'Relatives, conditions, justification, concession et narration plus élaborée.',world:4}
};
let chosenGrade='6e';
try{chosenGrade=localStorage.getItem('brick-grade')||'6e'}catch{}
if(!gradeTracks[chosenGrade])chosenGrade='6e';
const gradeChallenges=[
 {w:0,p:'6e : présente une personne et son âge.',scene:'👧 🎂',pieces:[['My sister','subject'],['is','verb'],['twelve years old','object']],answers:[[0,1,2]],why:'Pour donner l’âge en anglais, on utilise be : My sister is twelve years old.'},
 {w:0,p:'6e : exprime un goût.',scene:'👦 🍎',pieces:[['I','subject'],['like','verb'],['apples','object']],answers:[[0,1,2]],why:'Le sujet vient avant le verbe au présent simple.'},
 {w:1,p:'5e : enrichis avec la fréquence.',scene:'👩 🏃',pieces:[['She','subject'],['often runs','verb'],['in the park','object']],answers:[[0,1,2]],why:'L’adverbe de fréquence often précède en général le verbe lexical.'},
 {w:1,p:'5e : situe une activité dans le temps.',scene:'🧒 🎹',pieces:[['I','subject'],['play','verb'],['the piano','object'],['after school','time']],answers:[[0,1,2,3]],why:'After school précise le moment de l’activité.'},
 {w:3,p:'4e : justifie une décision.',scene:'🌧️ ☂️',pieces:[['We','subject'],['stayed','verb'],['at home','object'],['because it was raining','connector']],answers:[[0,1,2,3]],why:'Because permet de justifier la décision ; le prétérit situe l’événement dans le passé.'},
 {w:3,p:'4e : oppose deux idées.',scene:'📚 🏀',pieces:[['I','subject'],['like reading','verb'],['but','connector'],['my brother prefers sport','detail']],answers:[[0,1,2,3]],why:'But relie deux propositions qui présentent des préférences différentes.'},
 {w:4,p:'3e : enrichis avec une relative.',scene:'👨 📖',pieces:[['The author','subject'],['who wrote this book','detail'],['lives','verb'],['in London','object']],answers:[[0,1,2,3]],why:'La relative who wrote this book précise de quel auteur on parle.'},
 {w:4,p:'3e : exprime une concession.',scene:'🌧️ 🚴',pieces:[['Although it was raining','connector'],['they','subject'],['continued cycling','verb']],answers:[[0,1,2]],why:'Although présente une opposition entre les circonstances et l’action.'}
];
q.push(...gradeChallenges);

let save={stars:0,cleared:[],sound:true,clean:0};try{let p=JSON.parse(localStorage.getItem(KEY)||localStorage.getItem('sentence-builders-save-v1'));if(p&&Array.isArray(p.cleared))save={...save,...p}}catch{};
let mode='build',world=0,index=0,selected=[],checked=false,hintShown=false,freePiece=0;
// All unlocks are deterministic: existing saved successes immediately count.
const BADGES=[
 ['first','Première brique','🧱','common','Réussir ton premier défi',p=>p.n>=1],
 ['three','Apprenti bâtisseur','🔨','common','Réussir 3 défis',p=>p.n>=3],
 ['five','Architecte en herbe','🏗️','common','Réussir 5 défis',p=>p.n>=5],
 ['ten','Constructeur confirmé','🛠️','rare','Réussir 10 défis',p=>p.n>=10],
 ['twenty','Grand architecte','🏰','epic','Réussir 20 défis',p=>p.n>=20],
 ['all','Légende des briques','👑','legend','Réussir tous les défis',p=>p.n===q.length],
 ['clean','Sans indice','🎯','rare','Réussir un nouveau défi sans indice',p=>p.clean>=1],
 ['clean3','Œil de lynx','🦅','epic','Réussir 3 nouveaux défis sans indice',p=>p.clean>=3],
 ['clean10','Esprit de maître','🧠','legend','Réussir 10 nouveaux défis sans indice',p=>p.clean>=10],
 ['s1','Maître du sujet','🔵','common','Réussir 3 défis du monde 1',p=>p.by[0]>=3],
 ['s2','Phrase enrichie','✨','common','Réussir 3 défis du monde 2',p=>p.by[1]>=3],
 ['s3','Maître du temps','⌛','rare','Réussir 3 défis du monde 3',p=>p.by[2]>=3],
 ['s4','Tisseur d’idées','🔗','rare','Réussir 3 défis du monde 4',p=>p.by[3]>=3],
 ['s5','Architecte expert','🏆','epic','Réussir 3 défis du monde 5',p=>p.by[4]>=3],
 ['world1','Île verte','🌳','rare','Terminer le monde 1',p=>p.full[0]],
 ['world2','Île bleue','💎','rare','Terminer le monde 2',p=>p.full[1]],
 ['world3','Île orange','🌋','epic','Terminer le monde 3',p=>p.full[2]],
 ['world4','Île violette','🔮','epic','Terminer le monde 4',p=>p.full[3]],
 ['world5','Île rouge','🐉','legend','Terminer le monde 5',p=>p.full[4]],
 ['fiveStars','Chasseur d’étoiles','🌟','rare','Accumuler 15 étoiles',p=>p.stars>=15],
 ['thirtyStars','Étoile filante','🌠','epic','Accumuler 45 étoiles',p=>p.stars>=45],
 ['fiftyStars','Constellation','🌌','legend','Accumuler 75 étoiles',p=>p.stars>=75],
 ['explorer','Explorateur','🧭','rare','Réussir un défi dans 3 mondes',p=>p.by.filter(Boolean).length>=3],
 ['traveler','Tour du monde','🌍','legend','Réussir un défi dans les 5 mondes',p=>p.by.every(Boolean)]
];
function badgeProgress(){const clear=new Set(save.cleared.filter(i=>Number.isInteger(i)&&i>=0&&i<q.length));const by=[0,0,0,0,0],tot=[0,0,0,0,0];q.forEach((v,i)=>{tot[v.w]++;if(clear.has(i))by[v.w]++});return {n:clear.size,by,full:by.map((v,i)=>v===tot[i]),clean:save.clean||0,stars:save.stars||0}}
function unlockedBadges(){const progress=badgeProgress();return BADGES.filter(b=>b[5](progress))}
function badgeTile(b,active){return `<div class="badge-tile ${active?'unlocked':'locked'} ${b[3]}" aria-label="${E(b[1])}: ${active?'obtenu':'à débloquer'}"><span class="badge-crest"><img class="badge-picture" src="assets/badges/${b[0]}.png" alt="" loading="lazy"></span><strong>${E(b[1])}</strong><small>${active?'Débloqué':E(b[4])}</small><span class="badge-rarity">${{common:'Bronze',rare:'Argent',epic:'Or',legend:'Légendaire'}[b[3]]}</span></div>`}
function renderTrophies(){const owned=new Set(unlockedBadges().map(b=>b[0]));screen().innerHTML=`<button class="back-link" id="back">← Retour à l’accueil</button><section class="trophy-room"><div class="trophy-heading"><span class="trophy-gem">🏆</span><div><h1>Ma collection</h1><p>Débloque les badges en construisant des phrases et en explorant les mondes !</p></div></div><div class="trophy-stats"><strong>${owned.size} / ${BADGES.length} badges</strong><span>⭐ ${save.stars} étoiles</span><span>🧱 ${badgeProgress().n} défis réussis</span></div><div class="badge-grid">${BADGES.map(b=>badgeTile(b,owned.has(b[0]))).join('')}</div><p class="trophy-foot">Chaque défi ne donne des étoiles qu’à sa première réussite. Les badges déjà gagnés restent dans ta collection sur cet appareil.</p></section>`;$('#back').onclick=goHome}

function persist(){try{localStorage.setItem(KEY,JSON.stringify(save))}catch{}$('#stars').textContent=save.stars}
function beep(ok=true){if(!save.sound)return;try{const A=window.AudioContext||window.webkitAudioContext;const a=new A(),o=a.createOscillator(),g=a.createGain();o.connect(g);g.connect(a.destination);o.type='sine';o.frequency.value=ok?660:240;g.gain.setValueAtTime(.045,a.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+.16);o.start();o.stop(a.currentTime+.16);o.onended=()=>a.close()}catch{}}
const screen=()=>$('#screen');function updateHead(){persist();$('#soundBtn').textContent=save.sound?'🔊':'🔇'};
function goHome(){mode='build';renderHome()}

function homeGradeButtons(){return '<div class="grade-grid">'+Object.entries(gradeTracks).map(([g,t])=>'<button class="grade-btn '+(chosenGrade===g?'active':'')+'" data-grade="'+g+'" aria-pressed="'+(chosenGrade===g)+'"><b>'+g+'</b><span>'+t.cefr+'</span></button>').join('')+'</div>'}
function bindGradeButtons(){document.querySelectorAll('[data-grade]').forEach(b=>b.onclick=()=>{chosenGrade=b.dataset.grade;try{localStorage.setItem('brick-grade',chosenGrade)}catch{};renderHome()})}
function v17Module(kind){
 let html='<button class="back-link" id="v17Back">← Accueil</button><section class="panel v17-sub">';
 if(kind==='build'){
  html+='<span class="tag">CONSTRUIRE</span><h1>Choisis ton chantier</h1><p>Explore les mondes, enrichis tes phrases ou construis librement.</p><div class="v17-feature"><img src="assets/character-2.webp" alt=""><div><h2>🧱 Agrandis ta phrase</h2><p>Quatre étapes pour transformer une phrase simple en phrase enrichie.</p><button class="cta green" id="openGrow">▶ Jouer</button></div></div><h2>Les 5 mondes</h2><div class="worlds">'+worlds.map((w,i)=>'<button class="world-card" data-w="'+i+'"><span class="level-no">'+(i+1)+'</span><img class="world-art" src="assets/world-card-'+(i+1)+'.webp" alt="" loading="lazy"><b>'+E(w[0])+'</b><small>'+q.filter(x=>x.w===i).length+' défis</small></button>').join('')+'</div><h2>Autres façons de construire</h2><div class="modes">'+[['build','Build It','Assembler'],['upgrade','Upgrade It','Enrichir'],['fix','Fix It','Corriger'],['free','Free Build','Créer librement']].map(([m,t,d])=>'<button class="mode-card" data-mode="'+m+'"><b>'+t+'</b><small>'+d+'</small></button>').join('')+'</div>';
 } else if(kind==='progress'){
  html+='<span class="tag">PROGRESSER</span><h1>Avance à ton rythme</h1><p>Trois paliers pour chacune des classes : Découverte, Consolidation et Expert.</p><div class="v17-feature"><img src="assets/character-3.webp" alt=""><div><h2>🧠 Mon parcours adaptatif</h2><p>Des exercices variés et des révisions ciblées selon tes erreurs.</p><button class="cta green" id="adaptiveLaunch">▶ Choisir un palier</button></div></div><p class="info-note">Classe sélectionnée : '+chosenGrade+'. Tu pourras changer de classe dans le parcours.</p>';
 }else if(kind==='transform'){
  html+='<span class="tag">TRANSFORMER</span><h1>Grammar Lab</h1><p>Des manipulations de phrases pour comprendre le fonctionnement de l’anglais.</p><div class="v17-feature"><img src="assets/character-4.webp" alt=""><div><h2>🔧 Transforme tes phrases</h2><p>Questions, prétérit, auxiliaires, propositions relatives et connecteurs.</p><button class="cta blue" id="grammarLaunch">▶ Ouvrir Grammar Lab</button></div></div>';
 }
 screen().innerHTML=html+'</section>';$('#v17Back').onclick=renderHome;
 if(kind==='build'){
  $('#openGrow').onclick=()=>growStart(chosenGrade,0);
  document.querySelectorAll('[data-w]').forEach(b=>b.onclick=()=>start(+b.dataset.w,'build'));
  document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>start(gradeTracks[chosenGrade].world,b.dataset.mode));
 }
 if(kind==='progress')$('#adaptiveLaunch').onclick=()=>window.openAdaptiveBuilder?window.openAdaptiveBuilder():alert('Actualise la page pour charger le parcours adaptatif.');
 if(kind==='transform')$('#grammarLaunch').onclick=()=>window.openGrammarLab?window.openGrammarLab():alert('Actualise la page pour charger Grammar Lab.');
}
function renderHome(){
 screen().innerHTML='<section class="hero v17-hero"><div class="hero-content"><span class="eyebrow">YOUR ENGLISH ADVENTURE</span><img class="hero-logo" src="assets/brick-it-up-logo.png" alt="Brick It Up!"><p>Construis, progresse et transforme tes phrases en anglais !</p></div><div class="hero-friends" aria-hidden="true"><img src="assets/character-1.webp"><img src="assets/character-2.webp"><img src="assets/character-3.webp"><img src="assets/character-4.webp"></div></section>'+
 '<section class="v17-class"><div><h2>Mon aventure</h2><p>Choisis ta classe pour commencer.</p></div>'+homeGradeButtons()+'<div class="v17-stats"><span>🏅 '+save.cleared.length+' / '+q.length+' défis réussis</span><span>⭐ '+save.stars+' étoiles</span><span>🏆 '+unlockedBadges().length+' / '+BADGES.length+' badges</span></div></section>'+
 '<section class="journal-access journal-access-top"><button id="openSkillsJournalTop" class="cta blue">📘 OUVRIR MON CARNET DE COMPÉTENCES</button><span>Mes acquis · Mes erreurs · Mes révisions</span></section>'+ 
 '<section class="v17-home"><div class="v17-release">NOUVEL ACCUEIL · V18</div><h2>Que veux-tu faire aujourd’hui ?</h2><div class="v17-grid">'+
 '<button class="v17-card" data-section="build" aria-label="Construire : les cinq mondes et les modes de construction"><img src="assets/rubrique-construire.png" alt=""></button>'+
 '<button class="v17-card" data-section="progress" aria-label="Progresser : parcours adaptatifs"><img src="assets/rubrique-progresser.png" alt=""></button>'+
 '<button class="v17-card" data-section="transform" aria-label="Transformer : Grammar Lab"><img src="assets/rubrique-transformer.png" alt=""></button>'+
 '<button class="v17-card" id="v17Trophies" aria-label="Ma collection : trophées et badges"><img src="assets/rubrique-ma-collection.png" alt=""></button>'+
 '</div><div class="journal-access"><button id="openSkillsJournal" class="cta blue">📘 Mon carnet de compétences</button><span>Mes acquis · Mes erreurs · Mes révisions · Repères CECRL</span></div></section>';
 bindGradeButtons();document.querySelectorAll('[data-section]').forEach(b=>b.onclick=()=>v17Module(b.dataset.section));$('#v17Trophies').onclick=renderTrophies;const journalTop=$('#openSkillsJournalTop');if(journalTop)journalTop.onclick=()=>window.openSkillsJournal?window.openSkillsJournal():alert('Actualise la page pour charger le carnet.');const journalBtn=$('#openSkillsJournal');if(journalBtn)journalBtn.onclick=()=>window.openSkillsJournal?window.openSkillsJournal():alert('Actualise la page pour charger le carnet.');
}
function start(w,m='build'){world=w;mode=m;selected=[];checked=false;hintShown=false;let matches=q.map((x,i)=>x.w===world?i:-1).filter(i=>i>=0);index=matches.find(i=>!save.cleared.includes(i))??matches[0];if(mode==='free')renderFree();else renderGame()}
function sceneHtml(item){const pictures=['scene-01','scene-02','scene-03','scene-04','scene-05','scene-06','scene-07','scene-08','scene-09','scene-10'];const idx=q.indexOf(item);const sceneIds=[0,1,2,3,4,5,6,7,1,8,9,2,7,8,0,2,6,7,5,9,1,7,8,9,6,2,1,6,8,7,5,0,9];const n=sceneIds[idx]??(idx%pictures.length);return `<div class="scene illustrated-scene"><img src="assets/scenes/${pictures[n]}.webp" alt="Illustration du défi : ${E(item.p)}" loading="lazy"></div>`}
function itemOrder(){return mode==='fix'?q[index].pieces.map((_,i)=>i).reverse():q[index].pieces.map((_,i)=>i).sort((a,b)=>((a*7+index*3)%11)-((b*7+index*3)%11))}
function renderGame(message='',status=''){let item=q[index],indices=q.map((x,i)=>x.w===world?i:-1).filter(i=>i>=0),pos=indices.indexOf(index),order=itemOrder();screen().innerHTML=`<button class="back-link" id="back">← Retour aux mondes</button><section class="panel"><div class="game-head"><span class="tag">${worlds[world][1]} ${worlds[world][0]}</span><strong>Défi ${pos+1} / ${indices.length}</strong><div class="progress" role="progressbar" aria-valuenow="${pos+1}" aria-valuemin="1" aria-valuemax="${indices.length}"><div style="width:${(pos+1)/indices.length*100}%"></div></div></div><div class="mission"><div><div class="speech"><span class="guide">👦🏻</span>${E(item.p)}<div class="small-muted">${mode==='fix'?'🔧 Répare la phrase en replaçant les briques.':mode==='upgrade'?'🚀 Assemble les groupes et observe comment la phrase s’enrichit.':'🧱 Clique sur les briques dans le bon ordre.'}</div></div><div class="legend">${Object.entries(K).slice(0,7).map(([k,l])=>`<span><i style="background:${{subject:'#2183f2',verb:'#f44343',object:'#24bd64',time:'#18a7ad',place:'#8f58e4',connector:'#a14ce0',detail:'#ee66b7'}[k]}"></i>${l}</span>`).join('')}</div></div>${sceneHtml(item)}</div><div class="play-area"><h3>🏗️ Ton chantier — touche une brique pour la déplacer</h3><div class="sentence" id="sentence" aria-label="Ta phrase en construction">${selected.length?selected.map((id,place)=>brick(item.pieces[id],id,true,place)).join(''):'<span class="placeholder">Dépose les briques ici…</span>'}</div><h3 style="margin-top:25px">🧰 Réserve de briques</h3><div class="bank" id="bank">${order.filter(i=>!selected.includes(i)).map(i=>brick(item.pieces[i],i,false)).join('')}</div></div><div id="feedback" class="${message?'feedback '+status:''}" role="status">${message}</div><div class="actions"><button class="cta green" id="check" ${selected.length!==item.pieces.length||checked?'disabled':''}>✔ Check my sentence</button><button class="hint-btn" id="hint">💡 Indice</button><button class="hint-btn" id="undo" ${!selected.length||checked?'disabled':''}>↶ Annuler</button><button class="hint-btn" id="reset">🔄 Recommencer</button>${checked?'<button class="cta blue" id="next">Next challenge ➜</button>':''}</div></section>`;
$('#rewardGallery')&&($('#rewardGallery').onclick=renderTrophies);$('#back').onclick=goHome;$('#hint').onclick=()=>{$('#feedback').className='feedback';$('#feedback').textContent=`💡 ${item.why}`;hintShown=true};$('#undo').onclick=()=>{selected.pop();renderGame()};$('#reset').onclick=()=>{selected=[];checked=false;renderGame()};$('#check').onclick=check;$('#next')&&($('#next').onclick=next);document.querySelectorAll('.brick').forEach(b=>{b.onclick=()=>{if(checked)return;let id=+b.dataset.id;if(b.dataset.placed==='true')selected.splice(selected.indexOf(id),1);else if(!selected.includes(id))selected.push(id);renderGame()};b.addEventListener('dragstart',e=>e.dataTransfer.setData('text/plain',b.dataset.id))});let target=$('#sentence');target.ondragover=e=>e.preventDefault();target.ondrop=e=>{e.preventDefault();if(checked)return;let id=Number(e.dataTransfer.getData('text/plain'));if(Number.isInteger(id)&&id>=0&&id<item.pieces.length&&!selected.includes(id)){selected.push(id);renderGame()}}}
function brick(piece,id,placed,place){return `<button class="brick ${placed?'in-sentence':''}" data-kind="${E(piece[1])}" data-id="${id}" data-placed="${placed}" draggable="true" aria-label="${placed?'Retirer':'Ajouter'} ${E(piece[0])}">${E(piece[0])}${placed?' <span aria-hidden="true">×</span>':''}</button>`}
function check(){let item=q[index],ok=item.answers.some(a=>a.length===selected.length&&a.every((id,j)=>id===selected[j]));beep(ok);if(ok){checked=true;let newUnlocks=[];if(!save.cleared.includes(index)){const before=new Set(unlockedBadges().map(b=>b[0]));save.cleared.push(index);save.stars+=hintShown?2:3;if(!hintShown)save.clean=(save.clean||0)+1;newUnlocks=unlockedBadges().filter(b=>!before.has(b[0]));updateHead()}renderGame(`🌟 Brilliant! ${selected.map(i=>item.pieces[i][0]).join(' ')}${selected.some(i=>item.pieces[i][0].startsWith('Does'))?'?':'.'}<br><small>${E(item.why)}</small>${newUnlocks.length?`<div class="earned-badges"><b>🎉 Nouveaux badges débloqués !</b><div>${newUnlocks.map(b=>`<span>${b[2]} ${E(b[1])}</span>`).join(String.fromCharCode(32))}</div><button id="rewardGallery" class="hint-btn">Voir ma collection</button></div>`: ""}`,'success')}else{renderGame(`🛠️ Pas tout à fait ! Vérifie l’ordre des briques. ${selected.length>0?'Commence par repérer le sujet et le verbe.':''}`,'error')}}
function next(){const a=q.map((x,i)=>x.w===world?i:-1).filter(i=>i>=0),position=a.indexOf(index);if(position===a.length-1){world=Math.min(world+1,4);index=q.findIndex(x=>x.w===world)}else index=a[position+1];selected=[];checked=false;hintShown=false;renderGame()}
const freeBank=[['I','subject'],['She','subject'],['They','subject'],['We','subject'],['play','verb'],['plays','verb'],['visit','verb'],['like','verb'],['a game','object'],['football','object'],['London','object'],['in the park','place'],['at school','place'],['every day','time'],['on Saturdays','time'],['because','connector'],['it is fun','detail'],['with friends','detail']];let freeSel=[];
function renderFree(msg=''){screen().innerHTML=`<button class="back-link" id="back">← Retour aux mondes</button><section class="panel"><span class="tag">🎨 Brick It Up! — Free Build</span><h2 style="margin-top:15px">Crée ta propre phrase !</h2><p class="info-note">🎯 Atelier libre d’expérimentation : construis, transforme et lis tes phrases. La validation grammaticale automatique n’est disponible que dans les défis guidés.</p><div class="scene illustrated-scene"><img src="assets/scenes/scene-04.webp" alt="Des collégiens jouent ensemble" loading="lazy"></div><div class="play-area"><h3>Ta création</h3><div class="sentence" id="freeSentence">${freeSel.length?freeSel.map((i,j)=>`<button class="brick" data-kind="${freeBank[i][1]}" data-remove="${j}">${E(freeBank[i][0])} ×</button>`).join(''):'<span class="placeholder">Construis ta propre phrase…</span>'}</div><h3 style="margin-top:26px">Toutes les briques</h3><div class="bank">${freeBank.map((p,i)=>`<button class="brick" data-kind="${p[1]}" data-add="${i}">${E(p[0])}</button>`).join('')}</div></div><div class="actions"><button class="cta green" id="read">🔊 Listen</button><button class="hint-btn" id="clear">🔄 Effacer</button><button class="hint-btn" id="copy">📋 Copier</button></div>${msg?`<div class="feedback" role="status">${E(msg)}</div>`:''}</section>`;$('#back').onclick=goHome;document.querySelectorAll('[data-add]').forEach(x=>x.onclick=()=>{freeSel.push(+x.dataset.add);renderFree()});document.querySelectorAll('[data-remove]').forEach(x=>x.onclick=()=>{freeSel.splice(+x.dataset.remove,1);renderFree()});$('#clear').onclick=()=>{freeSel=[];renderFree()};$('#copy').onclick=async()=>{const s=freeSel.map(i=>freeBank[i][0]).join(' ');try{await navigator.clipboard.writeText(s);renderFree('Phrase copiée !')}catch{renderFree('Copie indisponible sur ce navigateur.')}};$('#read').onclick=()=>{if(!('speechSynthesis'in window)){renderFree('Lecture vocale non disponible.');return}let u=new SpeechSynthesisUtterance(freeSel.map(i=>freeBank[i][0]).join(' '));u.lang='en-GB';u.rate=.82;window.speechSynthesis.cancel();window.speechSynthesis.speak(u)}}

/* V12 — Agrandis ta phrase : construction cumulative, sans recommencer la phrase */
const GROW_MISSIONS={
 "6e":[
  {title:"Au terrain de sport",image:"scene-01.webp",steps:[
   {add:[["She","subject"],["plays","verb"]],help:"Commence par le sujet, puis le verbe.",why:"Une phrase anglaise simple commence généralement par sujet + verbe."},
   {add:[["football","object"]],help:"Ajoute ce qu'elle pratique.",why:"Le complément indique ce que fait la personne."},
   {add:[["every Saturday","time"]],help:"Précise quand elle joue.",why:"Le complément de temps peut se placer en fin de phrase."},
   {add:[["with her friends","detail"]],help:"Ajoute avec qui elle joue.",why:"On enrichit la phrase sans perdre les informations précédentes."}]},
  {title:"Le petit chien",image:"scene-02.webp",steps:[
   {add:[["The boy","subject"],["walks","verb"]],help:"Qui fait l'action ?",why:"The boy est le sujet, walks est le verbe au présent."},
   {add:[["his dog","object"]],help:"Ajoute l'animal.",why:"His dog complète le verbe walks."},
   {add:[["in the park","place"]],help:"Ajoute le lieu.",why:"In the park situe l'action."},
   {add:[["every morning","time"]],help:"Précise le moment.",why:"On peut accumuler plusieurs compléments."}]}],
 "5e":[
  {title:"La grande lecture",image:"scene-03.webp",steps:[
   {add:[["Maya","subject"],["reads","verb"]],help:"Qui fait l'action ?",why:"Au présent simple, reads porte -s avec Maya (she)."},
   {add:[["an interesting book","object"]],help:"Ajoute le livre.",why:"L'adjectif interesting précède le nom book."},
   {add:[["in her room","place"]],help:"Où lit-elle ?",why:"Le complément de lieu enrichit le message."},
   {add:[["every evening","time"]],help:"Quand lit-elle ?",why:"Le temps peut suivre le lieu."}]},
  {title:"Le skateboard",image:"scene-06.webp",steps:[
   {add:[["He","subject"],["practises","verb"]],help:"Commence par le sujet et le verbe.",why:"He implique le -s de la troisième personne."},
   {add:[["skateboarding","object"]],help:"Quelle activité ?",why:"Le groupe suivant complète le verbe."},
   {add:[["after school","time"]],help:"Quand ?",why:"After school situe l'habitude."},
   {add:[["with his best friend","detail"]],help:"Avec qui ?",why:"Ajout d'une précision sur l'accompagnement."}]}],
 "4e":[
  {title:"Une soirée au cinéma",image:"scene-10.webp",steps:[
   {add:[["We","subject"],["watched","verb"]],help:"Raconte au passé.",why:"Watched est au prétérit."},
   {add:[["an exciting film","object"]],help:"Qu'avons-nous regardé ?",why:"L'adjectif exciting qualifie le film."},
   {add:[["last night","time"]],help:"Quand ?",why:"Last night situe l'événement passé."},
   {add:[["because we love stories","connector"]],help:"Pourquoi ?",why:"Because introduit une justification complète."}]},
  {title:"Un jour de pluie",image:"scene-09.webp",steps:[
   {add:[["They","subject"],["stayed","verb"]],help:"Qui et quelle action passée ?",why:"Stayed marque un événement terminé."},
   {add:[["at home","place"]],help:"Où ?",why:"At home situe l'événement."},
   {add:[["yesterday","time"]],help:"Quand ?",why:"Yesterday complète le récit au passé."},
   {add:[["because it was raining","connector"]],help:"Donne une raison.",why:"Because relie le fait principal à sa cause."}]}],
 "3e":[
  {title:"La jeune sportive",image:"scene-01.webp",steps:[
   {add:[["The girl","subject"],["trained","verb"]],help:"Commence un récit au passé.",why:"Trained décrit l'entraînement terminé."},
   {add:[["every day","time"]],help:"Ajoute une habitude passée.",why:"Every day précise la fréquence."},
   {add:[["because she wanted to improve","connector"]],help:"Explique sa motivation.",why:"Because introduit la justification."},
   {add:[["although she was often tired","connector"]],help:"Ajoute une concession.",why:"Although introduit une opposition et nuance l'idée."}]},
  {title:"Un auteur mystérieux",image:"scene-03.webp",steps:[
   {add:[["The writer","subject"],["lived","verb"]],help:"Qui et qu'a-t-il fait ?",why:"Lived est au prétérit."},
   {add:[["in London","place"]],help:"Où ?",why:"In London situe le récit."},
   {add:[["for several years","time"]],help:"Combien de temps ?",why:"For exprime la durée."},
   {add:[["before he moved to Scotland","connector"]],help:"Relie les événements.",why:"Before met en relation deux moments du passé."}]}]
};

/* V13 — choix ouverts, distracteurs, variantes correctes, vraie progression cumulative */
const GROW_OPTIONS={
 "6e":[[
  [ ["She","subject"],["plays","verb"] ],
  [["football","object"],["tennis","object"],["the guitar","object"]],
  [["every Saturday","time"],["after school","time"],["on Sundays","time"]],
  [["with her friends","detail"],["with her sister","detail"],["at the sports club","place"]]
 ],[
  [["The boy","subject"],["walks","verb"]],
  [["his dog","object"],["a small dog","object"]],
  [["in the park","place"],["near the river","place"]],
  [["every morning","time"],["after school","time"]]
 ]],
 "5e":[[
  [["Maya","subject"],["reads","verb"]],
  [["an interesting book","object"],["a comic book","object"],["a mystery novel","object"]],
  [["in her room","place"],["at the library","place"]],
  [["every evening","time"],["after dinner","time"]]
 ],[
  [["He","subject"],["practises","verb"]],
  [["skateboarding","object"],["football","object"]],
  [["after school","time"],["every weekend","time"]],
  [["with his best friend","detail"],["with his classmates","detail"]]
 ]],
 "4e":[[
  [["We","subject"],["watched","verb"]],
  [["an exciting film","object"],["a documentary","object"]],
  [["last night","time"],["yesterday evening","time"]],
  [["because we love stories","connector"],["because we wanted to relax","connector"]]
 ],[
  [["They","subject"],["stayed","verb"]],
  [["at home","place"],["inside","place"]],
  [["yesterday","time"],["last Sunday","time"]],
  [["because it was raining","connector"],["because the weather was terrible","connector"]]
 ]],
 "3e":[[
  [["The girl","subject"],["trained","verb"]],
  [["every day","time"],["three times a week","time"]],
  [["because she wanted to improve","connector"],["because she hoped to win","connector"]],
  [["although she was often tired","connector"],["even though it was difficult","connector"]]
 ],[
  [["The writer","subject"],["lived","verb"]],
  [["in London","place"],["in a small town","place"]],
  [["for several years","time"],["for a long time","time"]],
  [["before he moved to Scotland","connector"],["before he became famous","connector"]]
 ]]
};
const GROW_TRAPS={
 subject:["are","does","he"],
 verb:["play","playing","is play"],
 object:["a quickly","footballing","the footballs is"],
 place:["yesterday go","at yesterday","to there"],
 time:["last yesterday","every Saturdays","in Monday"],
 detail:["with she friends","with her friend are","in quickly"],
 connector:["because she improve","although because","because of she"]
};
let growGrade="6e",growMission=0,growStage=0,growPlaced=[],growBuilt=[],growChecked=false,growHint=false,growMessage="",growStatus="";
let growSave={};try{growSave=JSON.parse(localStorage.getItem("brick-grow-v12"))||{}}catch{}
function growPersist(){try{localStorage.setItem("brick-grow-v12",JSON.stringify(growSave))}catch{}}
function growData(){return GROW_MISSIONS[growGrade][growMission]}
function growStageOptions(){return GROW_OPTIONS[growGrade][growMission][growStage]}
function growExpected(){return growData().steps[growStage].add}
function growStart(g=chosenGrade||"6e",m=0){growGrade=GROW_MISSIONS[g]?g:"6e";growMission=m;growStage=0;growPlaced=[];growBuilt=[];growChecked=false;growHint=false;growMessage="";growStatus="";renderGrow()}
function growText(arr){return arr.map(x=>x[0]).join(" ")}
function growChoices(){
 const step=growData().steps[growStage], valid=growStageOptions(), base=step.add;
 const options=[];
 if(growStage===0){
  base.forEach((piece,i)=>options.push({piece,id:"v"+i,valid:true,order:i}));
  const bad=base[1][0].endsWith("s")?base[1][0].slice(0,-1):base[1][0]+"s";
  options.push({piece:[bad,"verb"],id:"x0",valid:false,reason:"Attention à l'accord entre le sujet et le verbe."});
 }else{
  valid.forEach((piece,i)=>options.push({piece,id:"v"+i,valid:true}));
  const type=valid[0][1];
  const bad=GROW_TRAPS[type]||GROW_TRAPS.detail;
  options.push({piece:[bad[(growMission+growStage)%bad.length],type],id:"x0",valid:false,reason:"Cette brique n'est pas grammaticalement adaptée à la phrase."});
 }
 return options;
}
function renderGrow(){
 const d=growData(),step=d.steps[growStage],options=growChoices();
 const all=growBuilt.concat(growPlaced.map(id=>options.find(o=>o.id===id).piece));
 const total=GROW_MISSIONS[growGrade].length;
 const completed=Object.keys(growSave).filter(k=>k.startsWith(growGrade+":")&&growSave[k]).length;
 screen().innerHTML='<button class="back-link" id="growBack">← Retour à l’accueil</button>'+
 '<section class="panel grow-workshop"><div class="game-head"><span class="tag">🧱 Agrandis ta phrase · '+E(growGrade)+'</span><strong>Mission '+(growMission+1)+' / '+total+'</strong></div>'+
 '<h2>'+E(d.title)+'</h2><div class="grow-steps">'+d.steps.map((item,i)=>'<span class="'+(i<growStage?"done":i===growStage?"current":"")+'">'+(i<growStage?"✓":i+1)+'</span>').join("")+'</div>'+
 '<div class="mission"><div><div class="speech"><b>Étape '+(growStage+1)+' / '+d.steps.length+'</b><p>'+E(["Pose les fondations de la phrase.","Choisis ce que tu veux ajouter.","Enrichis librement ta construction.","Termine avec une précision ou une idée plus complexe."][growStage])+'</p><small>'+E(step.help)+'</small></div></div><div class="scene illustrated-scene"><img src="assets/scenes/'+d.image+'" alt="Illustration de la mission" loading="lazy"></div></div>'+
 '<div class="play-area"><h3>🏗️ Ta phrase grandit brique après brique</h3><div class="sentence grow-sentence">'+
 growBuilt.map(p=>'<span class="brick grow-locked" data-kind="'+E(p[1])+'">'+E(p[0])+'</span>').join("")+
 growPlaced.map(id=>{const piece=options.find(o=>o.id===id).piece;return '<button class="brick" data-kind="'+E(piece[1])+'" data-remove="'+id+'">'+E(piece[0])+' ×</button>'}).join("")+
 (!all.length?'<span class="placeholder">Construis ta phrase…</span>':'')+'</div>'+
 '<h3>🧰 À toi de choisir : plusieurs briques peuvent convenir</h3><div class="bank">'+options.filter(o=>!growPlaced.includes(o.id)).map(o=>'<button class="brick" data-kind="'+E(o.piece[1])+'" data-add="'+o.id+'">'+E(o.piece[0])+'</button>').join("")+'</div></div>'+
 '<div class="'+(growMessage?'feedback '+growStatus:'')+'" role="status">'+E(growMessage)+'</div>'+
 '<div class="actions"><button class="cta green" id="growCheck" '+(growPlaced.length!==(growStage===0?2:1)||growChecked?'disabled':'')+'>✔ Vérifier ma phrase</button>'+
 '<button class="hint-btn" id="growHint">💡 Comprendre</button><button class="hint-btn" id="growReset">↶ Retirer les nouvelles briques</button>'+
 (growChecked?'<button class="cta blue" id="growNext">'+(growStage===d.steps.length-1?"🏆 Terminer la mission":"➜ Enrichir encore")+'</button>':'')+'</div>'+
 '<p class="info-note">Tes choix corrects restent dans la phrase. Une brique piège ne fait pas perdre la progression : tu peux la remplacer.</p>'+
 '<p class="small-muted">'+completed+' / '+total+' missions terminées dans ce parcours.</p></section>';
 $('#growBack').onclick=goHome;
 document.querySelectorAll("[data-add]").forEach(b=>b.onclick=()=>{if(!growChecked){const limit=growStage===0?2:1;if(growPlaced.length>=limit)growPlaced.shift();growPlaced.push(b.dataset.add);growMessage="";growStatus="";renderGrow()}});
 document.querySelectorAll("[data-remove]").forEach(b=>b.onclick=()=>{if(!growChecked){growPlaced=growPlaced.filter(id=>id!==b.dataset.remove);growMessage="";renderGrow()}});
 $('#growHint').onclick=()=>{growHint=true;const box=screen().querySelector('[role=status]');box.className="feedback";box.textContent="💡 "+step.why+" Plusieurs choix peuvent être corrects."};
 $('#growReset').onclick=()=>{growPlaced=[];growChecked=false;growMessage="";growStatus="";renderGrow()};
 $('#growCheck').onclick=()=>{
  const chosen=growPlaced.map(id=>options.find(o=>o.id===id));
  const valid=chosen.every(o=>o.valid)&&(growStage>0||chosen.every((o,i)=>o.order===i));
  if(valid){growChecked=true;growMessage="Excellent ! "+growText(all)+". "+step.why;growStatus="success";beep(true)}
  else{const trap=chosen.find(o=>!o.valid);growMessage=trap?trap.reason:"Vérifie l'ordre : commence par le sujet, puis le verbe.";growStatus="error";beep(false)}
  renderGrow()
 };
 const next=$('#growNext');if(next)next.onclick=()=>{
  growBuilt=growBuilt.concat(growPlaced.map(id=>options.find(o=>o.id===id).piece));
  if(growStage<d.steps.length-1){growStage++;growPlaced=[];growChecked=false;growMessage="";growStatus="";renderGrow()}
  else{growSave[growGrade+":"+growMission]=true;growPersist();if(growMission+1<total){growMission++;growStage=0;growBuilt=[];growPlaced=[];growChecked=false;growMessage="";growStatus="";renderGrow()}else{goHome()}}
 };
}

$('#homeBtn').onclick=goHome;$('#soundBtn').onclick=()=>{save.sound=!save.sound;updateHead()};updateHead();renderHome();
