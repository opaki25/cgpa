import {calculate} from './calc.mjs';
const $=id=>document.getElementById(id);
const blank=()=>({gpa:'',type:'actual',credits:'20'});
let state={years:3,scale:5,rows:Array.from({length:12},blank)};
try{const old=JSON.parse(localStorage.getItem('cgpa-plan'));if(old&&[2,3,4,5,6].includes(old.years)&&[4,5].includes(old.scale)&&Array.isArray(old.rows)&&old.rows.length===12&&old.rows.every(r=>r&&['actual','expected'].includes(r.type)&&typeof r.gpa==='string')){state=old;state.rows.forEach(r=>{if(r.gpa==='')r.type='actual'})}}catch{}
function render(){
  $('years').value=state.years;$('scale').value=state.scale;$('semesters').replaceChildren();
  for(let y=0;y<state.years;y++){
    const group=document.createElement('section');
    group.innerHTML=`<h2>Year ${y+1}</h2>`;
    for(let s=0;s<2;s++){
      const i=y*2+s,r=state.rows[i],row=document.createElement('div');row.className='semester';
      row.innerHTML=`<label for="gpa-${i}">Semester ${s+1}</label><input id="gpa-${i}" aria-label="Year ${y+1}, semester ${s+1} GPA" type="number" inputmode="decimal" min="0" max="${state.scale}" step="0.01" placeholder="—"><select aria-label="Year ${y+1}, semester ${s+1} result type"><option value="actual">Actual</option><option value="expected">Expected</option></select>`;
      const input=row.querySelector('input'),select=row.querySelector('select');input.value=r.gpa;select.value=r.type;
      input.oninput=()=>{r.gpa=input.value;update()};select.onchange=()=>{r.type=select.value;update()};group.append(row);
    }
    $('semesters').append(group);
  }
  update();
}
function update(){
  const rows=state.rows.slice(0,state.years*2),r=calculate(rows,state.scale,false);
  const fmt=v=>v==null?'—':(Math.round((v+Number.EPSILON)*100)/100).toFixed(2);
  $('current').textContent=fmt(r.current);$('maximum').textContent=fmt(r.maximum);$('projected').textContent=fmt(r.projected);
  $('error').textContent=r.invalid?`Enter GPAs between 0 and ${state.scale}.`:'';
  $('max-note').textContent=r.invalid?'':r.count===rows.length?'All semesters completed.':`With ${state.scale.toFixed(1)} in every semester without an actual result.`;
  $('projection-note').textContent=r.projected==null?'Fill every semester to see your expected final CGPA.':'';
  try{localStorage.setItem('cgpa-plan',JSON.stringify(state))}catch{}
}
$('years').onchange=e=>{state.years=Number(e.target.value);render()};
$('scale').onchange=e=>{state.scale=Number(e.target.value);render()};
$('reset').onclick=()=>{state.rows=Array.from({length:12},blank);render()};
render();
