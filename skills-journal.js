'use strict';
/* V21 — carnet de compétences : indicateurs formatifs locaux, non certifiants */
(()=>{
const root=document.querySelector('#screen');if(!root)return;
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key)||'null')||fallback}catch{return fallback}};
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const skills={sujet:'Ordre sujet–verbe',accord:'Accord sujet–verbe',complément:'Compléter une phrase',temps:'Indicateurs de temps',lieu:'Indicateurs de lieu',prétérit:'Prétérit',connecteur:'Connecteurs',concession:'Concession'};
const glNames={question:'Questions',past:'Prétérit',aux:'Auxiliaires',relative:'Propositions relatives',combine:'Relier des propositions'};
const grades=['6e','5e','4e','3e'];
function collect(grade){
 const base=read('brick-it-up-save-v1',{cleared:[],stars:0});
 const grow=read('brick-grow-v12',{});
 const adaptive=read('brick-adaptive-v14',{});
 const grammar=read('brick-grammar-v16',{});
 const ap=[0,1,2].map(n=>adaptive[grade+':'+n]||{correct:0,attempts:0,mistakes:{},streak:0});
 const errors={};ap.forEach(p=>Object.entries(p.mistakes||{}).forEach(([k,v])=>{errors[k]=(errors[k]||0)+Math.max(0,Number(v)||0)}));
 const grammarHits=Object.entries(grammar).filter(([k])=>k.startsWith(grade+':')).map(([k,v])=>[k.split(':')[1],Number(v)||0]);
 return {baseCount:Array.isArray(base.cleared)?base.cleared.length:0,stars:Number(base.stars)||0,growCount:Object.entries(grow).filter(([k,v])=>k.startsWith(grade+':')&&v).length,ap,errors,grammarHits};
}
function recommendations(d){
 const ranked=Object.entries(d.errors).filter(([,v])=>v>0).sort((a,b)=>b[1]-a[1]).slice(0,3);
 return ranked.length?ranked.map(([k,n])=>({name:skills[k]||k,frequency:n,kind:k})): [];
}
function render(){
 const grade=(typeof chosenGrade!=='undefined'&&grades.includes(chosenGrade))?chosenGrade:'6e',d=collect(grade),adaptiveTotal=d.ap.reduce((n,p)=>n+(p.correct||0),0),attempts=d.ap.reduce((n,p)=>n+(p.attempts||0),0),rate=attempts?Math.round(adaptiveTotal/attempts*100):null,glTotal=d.grammarHits.reduce((n,[,c])=>n+c,0);
 const rec=recommendations(d);const activity=d.baseCount+adaptiveTotal+d.growCount+glTotal;
 let cefr=grade==='6e'?'A1 (repère de classe)':grade==='5e'?'A1 → A2 (repère de classe)':grade==='4e'?'A2 (repère de classe)':'A2 → B1 (repère de classe)';
 root.innerHTML='<button class="back-link" id="journalBack">← Accueil</button><section class="panel journal"><span class="tag">📘 MON CARNET DE COMPÉTENCES</span><h1>Mes progrès en anglais</h1><p>Un tableau de bord pour comprendre ce que tu sais déjà faire et ce que tu peux retravailler.</p>'+
 '<div class="journal-stats"><div><b>'+d.baseCount+'</b><small>Défis classiques réussis</small></div><div><b>'+adaptiveTotal+'</b><small>Réponses adaptatives correctes</small></div><div><b>'+d.growCount+'</b><small>Missions « Agrandis ta phrase »</small></div><div><b>'+glTotal+'</b><small>Transformations réussies</small></div></div>'+
 '<h2>🏗️ Mes paliers adaptatifs</h2><div class="journal-levels">'+['Découverte','Consolidation','Expert'].map((label,i)=>{const p=d.ap[i],total=p.attempts||0,correct=p.correct||0,pct=total?Math.round(correct/total*100):0;return '<div class="journal-level"><div class="journal-level-head"><strong>'+label+'</strong><span>'+(total?pct+' % de réponses correctes':'Non commencé')+'</span></div><div class="journal-meter"><span style="width:'+pct+'%"></span></div><small>'+correct+' réponses correctes sur '+total+' vérifications</small></div>'}).join('')+'</div>'+
 '<h2>🔎 Les notions à retravailler</h2>'+(rec.length?'<div class="journal-recs">'+rec.map(r=>'<div><strong>'+esc(r.name)+'</strong><small>'+r.frequency+' difficulté(s) enregistrée(s)</small></div>').join('')+'</div>':'<p class="info-note">Aucune difficulté récurrente identifiée pour le moment. Continue les défis pour obtenir des conseils personnalisés.</p>')+
 '<h2>🔧 Mes manipulations grammaticales</h2>'+(d.grammarHits.length?'<div class="journal-chips">'+d.grammarHits.map(([k,n])=>'<span>'+esc(glNames[k]||k)+' : '+n+'</span>').join('')+'</div>':'<p class="info-note">Les réussites dans Grammar Lab apparaîtront ici.</p>')+
 '<h2>🎯 Ma prochaine mission</h2><p>'+(rec.length?'Entraîne-toi sur « '+esc(rec[0].name)+' » dans le parcours adaptatif.':'Essaie le niveau Découverte dans le parcours adaptatif pour commencer ton bilan.')+'</p><div class="actions"><button class="cta green" id="journalTrain">▶ Lancer une révision adaptée</button><button class="cta blue" id="journalGrammar">🔧 Grammar Lab</button></div>'+
 '<h2>🌍 Mon repère CECRL</h2><div class="journal-cefr"><strong>'+cefr+'</strong><p>'+ (activity?'Activités enregistrées : '+activity+'. Ces résultats donnent des indices sur ta progression, sans suffire à attribuer un niveau CECRL individuel.':'Pas encore assez de données pour estimer des acquis individuels.') +'</p></div>'+
 '<p class="info-note"><strong>Important :</strong> ces indicateurs concernent surtout la construction de phrases et certaines manipulations grammaticales. Ce n’est ni un test CECRL complet ni une certification. Les données sont conservées sur cet appareil.</p></section>';
 root.querySelector('#journalBack').onclick=()=>typeof goHome==='function'&&goHome();
 root.querySelector('#journalTrain').onclick=()=>window.openAdaptiveBuilder?window.openAdaptiveBuilder():alert('Parcours adaptatif indisponible.');
 root.querySelector('#journalGrammar').onclick=()=>window.openGrammarLab?window.openGrammarLab():alert('Grammar Lab indisponible.');
}
window.openSkillsJournal=render;
})();
