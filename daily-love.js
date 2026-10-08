import * as THREE from 'three';
export function createDailyLove(scene,rabbits,{pathfind,blocked,groundHeight,jobs}){
 const [mother,,father]=rabbits;let day=0,lastHour=null,lastDay=-1,event=null;
 function bubble(text){const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=180;const c=canvas.getContext('2d');c.fillStyle='#fff4edf2';c.beginPath();c.roundRect(8,8,1008,146,40);c.fill();c.fillStyle='#985568';c.font='bold 48px sans-serif';c.textAlign='center';c.fillText(text,512,99);const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,depthWrite:false}));sprite.scale.set(4.5,.79,1);sprite.visible=false;scene.add(sprite);return sprite;}
 const confession=bubble('今天天气这么好，我们干点啥去？'),reply=bubble('你个跟踪狂，你愿意干啥干啥去');
 const safe=b=>!b.playerControlled&&!b.ride&&!b.cycleTrip&&!jobs.has(b)&&['search','groom','rest','family','care','sniff'].includes(b.state);
 function reset(){confession.visible=reply.visible=false;if(event)for(const b of [mother,father]){b.model.rotation.x=0;b.state='search';b.timer=1;}event=null;}
 function update(dt,hour){
  if(lastHour!==null&&lastHour>20&&hour<4)day++;lastHour=hour;
  if(event){
   if(hour<7||hour>20||[mother,father].some(b=>b.playerControlled||b.ride||b.cycleTrip||jobs.has(b))){reset();return;}
   event.age+=dt;
   if(event.phase==='approach'){
    const q=event.path[0];if(q){const p=father.root.position,dx=q.x-p.x,dz=q.z-p.z,d=Math.hypot(dx,dz),step=Math.min(d,dt*1.3);if(d>.001){p.x+=dx/d*step;p.z+=dz/d*step;father.root.rotation.y=Math.atan2(-dx,-dz);}p.y=groundHeight(p.x,p.z);if(d<.1)event.path.shift();}
    else{event.phase='confess';event.age=0;}
    if(event.age>45){reset();return;}
   }else if(event.phase==='confess'&&event.age>4){event.phase='reply';event.age=0;lastDay=day;father.dailyChats=(father.dailyChats||0)+1;}
   else if(event.phase==='reply'&&event.age>3.5){reset();return;}
   for(const b of [mother,father]){b.state='dailyLove';b.path=[];b.target=null;}
   confession.visible=event.phase==='confess';reply.visible=event.phase==='reply';
   confession.position.copy(father.root.position).add(new THREE.Vector3(0,2.1,0));reply.position.copy(mother.root.position).add(new THREE.Vector3(0,2.1,0));
   return;

  }
  if(lastDay===day||hour<9||hour>19||!safe(mother)||!safe(father))return;
  if(mother.root.position.distanceTo(father.root.position)>5)return;
  const m=mother.root.position;let route=null;
  for(let i=0;i<8;i++){const a=i*Math.PI/4,p=new THREE.Vector3(m.x+Math.cos(a)*.65,m.y,m.z+Math.sin(a)*.65);if(blocked(p.x,p.z,.28))continue;const candidate=pathfind(father.root.position,p);if(candidate.length&&(!route||candidate.length<route.length))route=candidate;}
  if(route)event={phase:'approach',age:0,path:route};
 }
 function pose(){if(!event)return;const m=mother.root.position,f=father.root.position;mother.root.rotation.y=Math.atan2(m.x-f.x,m.z-f.z);if(event.phase!=='approach')father.root.rotation.y=Math.atan2(f.x-m.x,f.z-m.z);mother.model.rotation.x=0;}
 return {update,pose,handles:b=>!!event&&(b===mother||b===father),get status(){return {day,lastDay,phase:event?.phase||null};}};
}
