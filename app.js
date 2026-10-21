'use strict';
const KEY='shaadiplanner.v1';
const CATS=['Venue / Hall','Catering','Decoration / Mandap','Photo & Video','Outfits & Jewellery','Mehndi & Makeup','DJ & Music','Cards / Invitations','Travel & Stay','Pandit & Pooja','Gifts / Shagun','Other'];
const TASKS={
 '6+ months before':['Fix the total budget with family','Ask the pandit for a date and muhurat','Make a rough guest count','Shortlist venues and visit them','Book the venue and pay the advance','Shortlist caterers and do a tasting','Book the photographer / videographer'],
 '3-5 months before':['Order outfits (lehenga / sherwani)','Order / select jewellery','Finalise the card design and print it','Book DJ / band / dhol','Finalise the decorator and mandap theme','Book the mehndi and makeup artists','Plan stay and travel for outstation guests'],
 '1-2 months before':['Start distributing cards / send WhatsApp invites','Track guest RSVPs','Make the pooja items list','Prepare return gifts / shagun envelopes','Confirm horse / car / band for the baraat','Fix the sangeet and mehndi programme','Give all vendors a final payment schedule'],
 '1 week before':['Call and confirm every vendor','Give the final guest count to the caterer','Final outfit fitting','Emergency kit (safety pins, medicines, chargers)','Keep cash / shagun envelopes ready','Seating and room allotment list','Assign one responsibility to each family member'],
 'Wedding day':['Check vendor arrivals in the morning','Final check of mandap and stage','Call the pandit on time','Give the photographer a must-have shots list','Check food and water for guests','Prepare for the vidaai','After the wedding: final payments to vendors']};
let S=load();let tab='home',filt='all',gFilt='all';
function blank(){return{info:{names:'',date:'',budget:0},tasks:Object.entries(TASKS).flatMap(([g,l])=>l.map(t=>({id:uid(),g,t,done:false}))),exps:[],plans:{},guests:[]}}
function load(){const d=store.get(KEY,null);if(!d)return blank();return Object.assign(blank(),d)}
function save(){store.set(KEY,S)}
const inr=n=>'₹'+Math.round(n||0).toLocaleString('en-IN');
const daysTo=d=>d?Math.round((new Date(d+'T00:00:00')-new Date(new Date().toDateString()))/864e5):null;
function totals(){const planned=Object.values(S.plans).reduce((a,b)=>a+(+b||0),0);const spent=S.exps.reduce((a,e)=>a+(+e.amt||0),0);const paid=S.exps.filter(e=>e.paid).reduce((a,e)=>a+(+e.amt||0),0);return{planned,spent,paid,pend:spent-paid}}
function render(){
 const tabs=[['home','Home'],['check','Checklist'],['budget','Budget'],['guests','Guests'],['backup','Backup']];
 $('#app').innerHTML=`<div class="tabs">${tabs.map(([k,l])=>`<button data-t="${k}" class="${tab===k?'on':''}">${l}</button>`).join('')}</div><div id="v"></div>`;
 $$('[data-t]').forEach(b=>b.onclick=()=>{tab=b.dataset.t;render();scrollTo(0,0)});
 ({home:vHome,check:vCheck,budget:vBudget,guests:vGuests,backup:vBackup})[tab]($('#v'));
}
function vHome(el){
 const d=daysTo(S.info.date),t=totals(),done=S.tasks.filter(x=>x.done).length,pc=S.tasks.length?Math.round(done/S.tasks.length*100):0;
 const heads=S.guests.reduce((a,g)=>a+(g.rsvp==='no'?0:(+g.n||1)),0),yes=S.guests.filter(g=>g.rsvp==='yes').reduce((a,g)=>a+(+g.n||1),0);
 const tb=+S.info.budget||0,over=tb&&t.spent>tb;
 el.innerHTML=`<div class="hero"><div class="card"><div class="muted" style="font-weight:700">${S.info.names?esc(S.info.names):'Your wedding'}</div>
  <div class="count">${d==null?'--':d>0?d:d===0?'Today!':'Done'}</div><div class="muted">${d==null?'Set a date':d>0?'days to go':d===0?'Congratulations!':Math.abs(d)+' days ago'}</div></div>
  <div class="card"><div class="stat"><div><b>${pc}%</b><span>Checklist</span></div><div><b>${inr(t.spent)}</b><span>Spent</span></div><div><b>${heads}</b><span>Guests</span></div></div></div></div>
 ${over?`<div class="alert bad">Spending is <b>${inr(t.spent-tb)}</b> over budget.</div>`:''}
 <div class="card"><h3>Wedding details</h3><form id="info" class="grid"><div><label class="f">Couple's names</label><input name="names" maxlength="80" value="${esc(S.info.names)}" placeholder="e.g. Rahul & Priya"></div>
  <div><label class="f">Wedding date</label><input type="date" name="date" value="${esc(S.info.date)}"></div>
  <div><label class="f">Total budget (₹)</label><input name="budget" inputmode="numeric" value="${S.info.budget||''}" placeholder="e.g. 1500000"></div>
  <div style="align-self:end"><button class="btn pri" style="width:100%">Save</button></div></form></div>
 <div class="card"><h3>At a glance</h3><div class="stat"><div><b>${S.tasks.length-done}</b><span>Tasks left</span></div><div><b>${inr(t.paid)}</b><span>Paid</span></div><div><b>${inr(t.pend)}</b><span>Pending</span></div><div><b>${yes}</b><span>RSVP yes</span></div></div>
 ${tb?`<div style="margin-top:14px"><div class="row"><span class="muted">Budget used</span><b class="right">${Math.round(t.spent/tb*100)}%</b></div><div class="bar ${over?'over':''}"><i style="width:${Math.min(100,t.spent/tb*100)}%"></i></div></div>`:''}</div>`;
 $('#info').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);S.info.names=f.get('names').trim();S.info.date=f.get('date');S.info.budget=Math.max(0,parseFloat(String(f.get('budget')).replace(/[,\s₹]/g,''))||0);save();render();toast('Saved')};
}
function vCheck(el){
 const groups=[...new Set(S.tasks.map(t=>t.g))];
 const list=S.tasks.filter(t=>filt==='all'||(filt==='todo'?!t.done:t.done));
 const done=S.tasks.filter(x=>x.done).length,pc=S.tasks.length?Math.round(done/S.tasks.length*100):0;
 el.innerHTML=`<div class="card"><div class="row"><h3 style="margin:0">Checklist</h3><span class="pill right">${done}/${S.tasks.length}</span></div><div class="bar" style="margin:12px 0"><i style="width:${pc}%"></i></div>
 <form id="addT" class="row"><input class="grow" name="t" maxlength="100" required placeholder="New task"><select name="g" style="width:auto">${groups.map(g=>`<option>${esc(g)}</option>`).join('')}</select><button class="btn pri">Add</button></form></div>
 <div class="filters">${[['all','All'],['todo','Pending'],['done','Done']].map(([k,l])=>`<button data-f="${k}" class="${filt===k?'on':''}">${l}</button>`).join('')}</div>
 <div class="card">${groups.map(g=>{const l=list.filter(t=>t.g===g);if(!l.length)return '';const all=S.tasks.filter(t=>t.g===g);return `<div class="sec"><span>${esc(g)}</span><span>${all.filter(t=>t.done).length}/${all.length}</span></div>`+l.map(t=>`<div class="chk ${t.done?'done':''}"><input type="checkbox" data-c="${t.id}" ${t.done?'checked':''} aria-label="${esc(t.t)}"><span class="l">${esc(t.t)}</span><button class="btn sm bad" data-r="${t.id}" aria-label="Remove">✕</button></div>`).join('')}).join('')||'<div class="empty">Nothing in this filter.</div>'}</div>
 <div class="row"><button class="btn sm" id="rst">Untick all</button></div>`;
 $$('[data-f]').forEach(b=>b.onclick=()=>{filt=b.dataset.f;render()});
 $('#addT').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);const t=f.get('t').trim();if(t){S.tasks.push({id:uid(),g:f.get('g'),t,done:false});save();render()}};
 $$('[data-c]',el).forEach(c=>c.onchange=()=>{S.tasks.find(t=>t.id===c.dataset.c).done=c.checked;save();render()});
 $$('[data-r]',el).forEach(b=>b.onclick=()=>{S.tasks=S.tasks.filter(t=>t.id!==b.dataset.r);save();render()});
 $('#rst').onclick=()=>{S.tasks.forEach(t=>t.done=false);save();render()};
}
function vBudget(el){
 const t=totals(),tb=+S.info.budget||0;
 const cats=[...new Set([...CATS,...S.exps.map(e=>e.cat)])];
 el.innerHTML=`<div class="card"><div class="stat"><div><b>${inr(tb)}</b><span>Total budget</span></div><div><b>${inr(t.planned)}</b><span>Planned</span></div><div><b>${inr(t.spent)}</b><span>Spent</span></div><div><b>${inr(tb-t.spent)}</b><span>Left</span></div></div>
 ${tb&&t.planned>tb?`<div class="alert warn">Category plans (${inr(t.planned)}) add up to more than the total budget.</div>`:''}${tb&&t.spent>tb?`<div class="alert bad">Total budget exceeded.</div>`:''}
 ${!tb?'<div class="alert">Set your total budget on the Home tab.</div>':''}</div>
 <div class="card"><h3>Add an expense</h3><form id="addE" class="grid"><div><label class="f">Expense name *</label><input name="n" required maxlength="80" placeholder="e.g. Hall advance"></div>
  <div><label class="f">Category</label><select name="c">${cats.map(c=>`<option>${esc(c)}</option>`).join('')}</select></div>
  <div><label class="f">Amount (₹) *</label><input name="a" required inputmode="decimal" placeholder="25000"></div>
  <div style="align-self:end"><label class="row" style="gap:8px;flex-wrap:nowrap"><input type="checkbox" name="p" checked> <span style="font-size:.9rem">Already paid</span></label></div>
  <div style="grid-column:1/-1"><button class="btn pri">Add expense</button></div></form></div>
 <div class="card"><h3>Category-wise</h3>${cats.map(c=>{const sp=S.exps.filter(e=>e.cat===c).reduce((a,e)=>a+(+e.amt||0),0),pl=+S.plans[c]||0;
  const pc=pl?Math.min(100,sp/pl*100):(sp?100:0),ov=pl&&sp>pl;
  const items=S.exps.filter(e=>e.cat===c);
  return `<div class="cat"><div class="h"><b>${esc(c)}</b><span class="${ov?'pill bad':'pill'}">${inr(sp)} / ${inr(pl)}</span></div><div class="bar ${ov?'over':''}"><i style="width:${pc}%"></i></div>
  <div class="row" style="margin-top:8px"><label class="f" style="margin:0">Plan (₹)</label><input data-pl="${esc(c)}" inputmode="numeric" value="${pl||''}" style="max-width:150px;min-height:38px;padding:6px 10px"></div>
  ${items.map(e=>`<div class="exp"><span class="n">${esc(e.n)}</span><b>${inr(e.amt)}</b><button class="btn sm ${e.paid?'':'bad'}" data-tp="${e.id}">${e.paid?'Paid ✓':'Pending'}</button><button class="btn sm bad" data-re="${e.id}" aria-label="Remove">✕</button></div>`).join('')}</div>`}).join('')}</div>`;
 $('#addE').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);const a=parseFloat(String(f.get('a')).replace(/[,\s₹]/g,''));if(!(a>0)){toast('Enter a valid amount');return}S.exps.push({id:uid(),n:f.get('n').trim(),cat:f.get('c'),amt:a,paid:!!f.get('p')});save();render();toast('Expense added')};
 $$('[data-pl]',el).forEach(i=>i.onchange=()=>{const v=parseFloat(String(i.value).replace(/[,\s₹]/g,''))||0;if(v>0)S.plans[i.dataset.pl]=v;else delete S.plans[i.dataset.pl];save();render()});
 $$('[data-tp]',el).forEach(b=>b.onclick=()=>{x=S.exps.find(e=>e.id===b.dataset.tp);x.paid=!x.paid;save();render()});
 $$('[data-re]',el).forEach(b=>b.onclick=()=>{S.exps=S.exps.filter(e=>e.id!==b.dataset.re);save();render()});
}
function vGuests(el){
 const list=S.guests.filter(g=>gFilt==='all'||g.rsvp===gFilt);
 const heads=(arr)=>arr.reduce((a,g)=>a+(+g.n||1),0);
 const side={a:S.guests.filter(g=>g.side==='a'),b:S.guests.filter(g=>g.side==='b')};
 el.innerHTML=`<div class="card"><div class="stat"><div><b>${heads(S.guests)}</b><span>Total guests</span></div><div><b>${heads(S.guests.filter(g=>g.rsvp==='yes'))}</b><span>Coming</span></div><div><b>${heads(S.guests.filter(g=>g.rsvp==='pending'))}</b><span>Awaiting reply</span></div><div><b>${heads(S.guests.filter(g=>g.rsvp==='no'))}</b><span>Not coming</span></div></div>
 <p class="muted" style="margin:10px 0 0;font-size:.85rem">Groom's side ${heads(side.a)} · Bride's side ${heads(side.b)}</p></div>
 <div class="card"><h3>Add a guest</h3><form id="addG" class="grid"><div><label class="f">Name / family *</label><input name="n" required maxlength="60" placeholder="e.g. Sharma family"></div>
  <div><label class="f">How many people</label><input name="c" type="number" min="1" max="100" value="1"></div>
  <div><label class="f">Side</label><select name="s"><option value="a">Groom's side</option><option value="b">Bride's side</option></select></div>
  <div><label class="f">RSVP</label><select name="r"><option value="pending">Awaiting reply</option><option value="yes">Coming</option><option value="no">Not coming</option></select></div>
  <div style="grid-column:1/-1"><button class="btn pri">Add guest</button></div></form></div>
 <div class="filters">${[['all','All'],['pending','Pending'],['yes','Coming'],['no','Not coming']].map(([k,l])=>`<button data-gf="${k}" class="${gFilt===k?'on':''}">${l}</button>`).join('')}</div>
 <div class="card">${list.length?list.map(g=>`<div class="guest"><div><div class="n">${esc(g.name)} <span class="muted" style="font-weight:500">× ${g.n}</span></div><div class="muted" style="font-size:.8rem">${g.side==='a'?"Groom's side":"Bride's side"}</div></div>
  <div class="row"><select data-gr="${g.id}" style="width:auto;min-height:38px;padding:6px 8px"><option value="pending" ${g.rsvp==='pending'?'selected':''}>Pending</option><option value="yes" ${g.rsvp==='yes'?'selected':''}>Coming</option><option value="no" ${g.rsvp==='no'?'selected':''}>No</option></select><button class="btn sm bad" data-rg="${g.id}" aria-label="Remove">✕</button></div></div>`).join(''):'<div class="empty">No guests yet.</div>'}</div>`;
 $$('[data-gf]').forEach(b=>b.onclick=()=>{gFilt=b.dataset.gf;render()});
 $('#addG').onsubmit=e=>{e.preventDefault();const f=new FormData(e.target);S.guests.push({id:uid(),name:f.get('n').trim(),n:Math.max(1,Math.min(100,parseInt(f.get('c'))||1)),side:f.get('s'),rsvp:f.get('r')});save();render()};
 $$('[data-gr]',el).forEach(s=>s.onchange=()=>{S.guests.find(g=>g.id===s.dataset.gr).rsvp=s.value;save();render()});
 $$('[data-rg]',el).forEach(b=>b.onclick=()=>{S.guests=S.guests.filter(g=>g.id!==b.dataset.rg);save();render()});
}
function csvCell(v){v=String(v??'');if(/^[=+\-@\t\r]/.test(v))v="'"+v;return '"'+v.replace(/"/g,'""')+'"'}
function csv(rows){return '\ufeff'+rows.map(r=>r.map(csvCell).join(',')).join('\r\n')}
function vBackup(el){
 el.innerHTML=`<div class="card"><h2>Export &amp; backup</h2><p class="muted">Your data is stored only in this browser. Take a backup before changing phones. CSV files open in Excel / Google Sheets.</p>
 <div class="row"><button class="btn pri" id="bk">Backup (.json)</button><label class="btn" style="display:inline-block">Restore<input type="file" id="rs" accept=".json,application/json" class="hide"></label><button class="btn" id="ex">Expenses CSV</button><button class="btn" id="gc">Guest list CSV</button><button class="btn" id="ck">Checklist CSV</button><button class="btn" onclick="print()">Print</button></div></div>
 <div class="card"><h3>Reset everything</h3><p class="muted">Start fresh. Take a backup first.</p><button class="btn bad" id="reset">Reset</button></div>`;
 const d=new Date().toISOString().slice(0,10);
 $('#bk').onclick=()=>download('wedding-planner-backup-'+d+'.json',JSON.stringify(S),'application/json');
 $('#ex').onclick=()=>download('expenses-'+d+'.csv',csv([['Item','Category','Amount','Status'],...S.exps.map(e=>[e.n,e.cat,e.amt,e.paid?'Paid':'Pending'])]),'text/csv');
 $('#gc').onclick=()=>download('guests-'+d+'.csv',csv([['Name','People','Side','RSVP'],...S.guests.map(g=>[g.name,g.n,g.side==='a'?"Groom's side":"Bride's side",g.rsvp])]),'text/csv');
 $('#ck').onclick=()=>download('checklist-'+d+'.csv',csv([['Timeline','Task','Done'],...S.tasks.map(t=>[t.g,t.t,t.done?'Yes':'No'])]),'text/csv');
 $('#reset').onclick=()=>{if(confirm('All data will be deleted. Are you sure?')){S=blank();save();tab='home';render()}};
 $('#rs').onchange=async x=>{const f=x.target.files[0];if(!f)return;try{const j=JSON.parse(await f.text());if(!j||typeof j!=='object'||!Array.isArray(j.tasks)||!Array.isArray(j.exps)||!Array.isArray(j.guests))throw 0;
  const b=blank();const n=Object.assign(b,{info:{names:String(j.info?.names||''),date:String(j.info?.date||''),budget:+j.info?.budget||0},
   tasks:j.tasks.map(t=>({id:String(t.id||uid()),g:String(t.g||'Other'),t:String(t.t||''),done:!!t.done})),
   exps:j.exps.map(e=>({id:String(e.id||uid()),n:String(e.n||''),cat:String(e.cat||'Other'),amt:+e.amt||0,paid:!!e.paid})),
   plans:Object.fromEntries(Object.entries(j.plans||{}).map(([k,v])=>[String(k),+v||0])),
   guests:j.guests.map(g=>({id:String(g.id||uid()),name:String(g.name||''),n:Math.max(1,+g.n||1),side:g.side==='b'?'b':'a',rsvp:['yes','no'].includes(g.rsvp)?g.rsvp:'pending'}))});
  if(!confirm('Replace current data with this backup?'))return;S=n;save();tab='home';render();toast('Backup restored')}catch(_){toast('This is not a valid backup file')}};
}
render();
