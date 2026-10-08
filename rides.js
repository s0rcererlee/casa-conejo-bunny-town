import * as THREE from 'three';
export function createRabbitRides({scene,leisure,coaster,goTo,setMode,rabbits,selected}){
 const V=(x,y,z)=>new THREE.Vector3(x,y,z),rides=[
 {id:'wheel',name:'摩天轮',entry:V(-26,.1,80),duration:Math.PI*2/.11,offset:V(0,-.05,0),seats:leisure.cabins,hold:v=>leisure.holdWheel=v,dock:g=>g.getWorldPosition(V(0,0,0)).y<1.5},
 {id:'carousel',name:'旋转木马',entry:V(-10,.1,77.5),duration:Math.PI*2/.22,offset:V(0,.4,0),seats:leisure.mounts,hold:v=>leisure.holdCarousel=v,dock:g=>g.getWorldPosition(V(0,0,0)).z<80.3},
 {id:'swing',name:'秋千',entry:V(5.5,.1,76.5),duration:12,offset:V(0,-2.52,0),seats:leisure.swings,hold:v=>leisure.holdSwing=v,dock:g=>Math.abs(g.rotation.x)<.06},
 {id:'coaster',name:'云霄飞车',entry:V(15,.1,102),duration:1/.021,offset:V(0,.82,-.4),seats:[coaster.cars[0]],hold:v=>coaster.hold=v,dock:g=>g.position.z<104.65},
 {id:'slide',name:'滑梯',entry:V(20,.1,83),duration:9},
 {id:'trampoline',name:'蹦床',entry:V(8,.1,93),duration:12}
 ];
 const select=document.createElement('select');select.id='ride-choice';select.setAttribute('aria-label','选择兔子游乐设施');for(const r of rides){const o=document.createElement('option');o.value=r.id;o.textContent=r.name;select.append(o);}
 const button=document.createElement('button');button.id='ride-rabbit';button.textContent='让兔子玩这个';const note=document.createElement('p');note.id='ride-notice';note.style.cssText='font-size:11px;line-height:1.6';const box=document.createElement('details');box.open=true;const summary=document.createElement('summary');summary.textContent='兔子游乐设施';box.append(summary,select,button,note);document.getElementById('landmark').closest('details').after(box);
 function start(b,id){const r=rides.find(r=>r.id===id);if(!r||b.ride)return false;if(!goTo(b,r.entry,'queue'))return false;b.ride={r,phase:'approach',time:0};b.nextRide=performance.now()+120000;b.playground=null;return true;}
 button.onclick=()=>{const b=rabbits[selected()];if(b.ride){note.textContent=b.name+'正在'+b.ride.r.name+'，本轮结束会自动回到入口。';return;}if(start(b,select.value)){setMode('follow');note.textContent=b.name+'正在步行前往'+b.ride.r.name+'，到站后排队上车。';}else note.textContent='暂时找不到通路，请先回到街道。';};
 function update(b,dt){const job=b.ride;if(!job)return false;const r=job.r;
 if(job.phase==='approach'){if(b.state!=='queue'){if(b.state!=='travel')b.ride=null;return false;}job.phase='wait';b.state='ride';}
 // Only one rabbit operates each ride at once, preventing overlapping seats.
 if(job.phase==='wait'){
  if(r.owner&&r.owner!==b)return true;
  scene.updateMatrixWorld(true);
  const seat=r.seats?.find(r.dock);
  if(r.seats&&!seat)return true;
  r.owner=b;job.seat=seat;if(seat?.getObjectByName('cabinRoof'))seat.getObjectByName('cabinRoof').visible=false;job.phase='board';job.time=0;job.from=b.root.position.clone();r.hold?.(true);
 }
 if(!leisure.running)return true;
 job.time+=dt;b.vy=0;b.model.rotation.x=0;b.model.scale.set(1,1,1);
 const seatPoint=()=>job.seat.localToWorld(r.offset.clone());
 if(job.phase==='board'){
  const end=job.seat?seatPoint():r.id==='slide'?V(20,.15,81):V(8,.2,90);b.root.position.lerpVectors(job.from,end,Math.min(1,job.time/2));
  if(job.time>=2){job.phase='ride';job.time=0;r.hold?.(false);}
 }else if(job.phase==='ride'){
  if(job.seat){scene.updateMatrixWorld(true);b.root.position.copy(seatPoint());if(r.id==='coaster')b.root.quaternion.copy(job.seat.quaternion);else b.root.rotation.set(0,r.id==='carousel'?leisure.carousel.rotation.y:0,0);}
  else if(r.id==='slide'){
   if(job.time<5)b.root.position.set(20,.15+2.25*job.time/5,81-3.8*job.time/5);
   else b.root.position.set(20,2.4-2.25*Math.min(1,(job.time-5)/2),77.2-3.4*Math.min(1,(job.time-5)/2));
  }else b.root.position.set(8,.2+Math.abs(Math.sin(job.time*3))*1.8,90);
  if(job.time>=r.duration&&(!job.seat||r.dock(job.seat))){r.hold?.(true);job.phase='exit';job.from=b.root.position.clone();job.time=0;}
 }else if(job.phase==='exit'){
  b.root.position.lerpVectors(job.from,r.entry,Math.min(1,job.time/2));b.root.rotation.x=b.root.rotation.z=0;
  if(job.time>=2){r.hold?.(false);if(job.seat?.getObjectByName('cabinRoof'))job.seat.getObjectByName('cabinRoof').visible=true;r.owner=null;b.ride=null;b.state='groom';b.timer=2;b.fatigue=Math.max(.1,b.fatigue-.25);b.nextRide=performance.now()+120000;}
 }
 if(b===rabbits[selected()])note.textContent=b.name+' · '+r.name+' · '+({wait:'排队等候',board:'正在上设施',ride:'开心游玩',exit:'返回入口'}[job.phase]||'前往入口')+(!leisure.running?'（设施已暂停）':'');
 return true;
 }
 return {rides,start,update};
}
