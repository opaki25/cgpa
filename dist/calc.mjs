export function calculate(rows, scale, weighted) {
  const weight=r=>weighted?Number(r.credits):1;
  const valid=r=>r.gpa!=='' && Number.isFinite(Number(r.gpa)) && Number(r.gpa)>=0 && Number(r.gpa)<=scale;
  if(rows.some(r=>(r.gpa!==''&&!valid(r))||(weighted&&(!(weight(r)>0)||!Number.isFinite(weight(r)))))) return {invalid:true};
  const actual=rows.filter(r=>r.type==='actual'&&valid(r));
  const total=rows.reduce((s,r)=>s+weight(r),0);
  const earned=actual.reduce((s,r)=>s+Number(r.gpa)*weight(r),0);
  const done=actual.reduce((s,r)=>s+weight(r),0);
  return {count:actual.length,current:done?earned/done:null,maximum:(earned+(total-done)*scale)/total,projected:rows.every(valid)?rows.reduce((s,r)=>s+Number(r.gpa)*weight(r),0)/total:null};
}
