import * as THREE from 'three';
export function createFamily(rabbits,{pathfind,blocked,scene}){
 const [mother,child,father]=rabbits;
 mother.familyRole='妈妈';mother.gender='female';father.familyRole='爸爸';father.gender='male';child.familyRole='孩子';child.parents=[mother,father];father.partner=mother;mother.partner=father;
 child.root.scale.setScalar(.78);
 const trail=[mother.root.position.clone()];let clock=0,nextKiss=10,kissUntil=0;
 const heartShape=new THREE.Shape();heartShape.moveTo(0,-.7);heartShape.bezierCurveTo(-1,.05,-.65,.9,0,.4);heartShape.bezierCurveTo(.65,.9,1,.05,0,-.7);const heartGeo=new THREE.ShapeGeometry(heartShape,16),hearts=[];
 function emitHearts(){for(let i=0;i<3;i++){const material=new THREE.MeshBasicMaterial({color:[0xec91aa,0xf6b3c5,0xd97598][i],transparent:true,side:THREE.DoubleSide,depthWrite:false});const mesh=new THREE.Mesh(heartGeo,material);mesh.position.copy(father.root.position).lerp(mother.root.position,.5);mesh.position.y+=.9;mesh.position.x+=(i-1)*.15;mesh.scale.setScalar(.09+i*.012);scene.add(mesh);hearts.push({mesh,age:-i*.16});}father.kisses=(father.kisses||0)+1;}

 function record(dt){clock+=dt;for(let i=hearts.length-1;i>=0;i--){const h=hearts[i];h.age+=dt;h.mesh.visible=h.age>=0;if(h.age<0)continue;h.mesh.position.y+=dt*.35;h.mesh.material.opacity=Math.max(0,1-h.age/2.5);h.mesh.rotation.y=father.root.rotation.y;if(h.age>2.5){scene.remove(h.mesh);h.mesh.material.dispose();hearts.splice(i,1);}}const p=mother.root.position,last=trail[trail.length-1];if((!mother.ride||mother.ride.phase==='approach')&&p.distanceTo(last)>.55){trail.push(p.clone());if(trail.length>400)trail.shift();}}
 function step(b,dt){const p=b.root.position,dist=Math.hypot(p.x-mother.root.position.x,p.z-mother.root.position.z);
 const calm=['rest','groom','eat','sniff','search','care'].includes(mother.state)&&!mother.ride;
 if(kissUntil>clock){if(!calm||dist>1.1){kissUntil=0;}else{b.state='kiss';b.path=[];b.model.rotation.x=-.1*Math.sin((kissUntil-clock)*Math.PI/1.4);return {dx:0,dz:0};}}
 if(b===father&&clock>=nextKiss&&calm&&dist<2.5&&Math.abs(p.y-mother.root.position.y)<.3){
 const x=mother.root.position.x-p.x,z=mother.root.position.z-p.z;b.root.rotation.y=Math.atan2(-x,-z);
 if(dist<=.68){kissUntil=clock+1.4;nextKiss=clock+18+Math.random()*16;b.state='kiss';emitHearts();return {dx:0,dz:0};}
 const amount=Math.min(dist-.65,dt*1.3),dx=x/dist*amount,dz=z/dist*amount;
 // Check the whole approach so affection never pulls a rabbit through a wall.
 let clear=true;for(let i=1;i<=8;i++)if(blocked(p.x+x*i/8,p.z+z*i/8,.28))clear=false;
 if(clear){b.state='family';return {dx,dz};}
 }
 // Finish a mouthful beside the family; catch up immediately if mum walks away.
 if(mother.state==='paint'&&dist<2.4){if(b.state!=='paint'){b.state='paint';b.timer=7;b.artWall=mother.artWall;b.artStamped=false;}if(b.timer>0)return null;}
 if(dist<3&&['eat','dig'].includes(b.state))return null;
 const gap=b===father?1.25:2.15;let target=trail[0],walked=0;for(let i=trail.length-1;i>0;i--){walked+=trail[i].distanceTo(trail[i-1]);target=trail[i-1];if(walked>=gap)break;}
 if(dist<gap+.4){b.path=[];b.target=null;b.state='family';b.root.rotation.y=Math.atan2(mother.root.position.x-p.x,mother.root.position.z-p.z)+Math.PI;return {dx:0,dz:0};}
 if(clock>=(b.familyRepath||0)){b.familyRepath=clock+1.1;let route=pathfind(p,target);if(!route.length&&!blocked(mother.root.position.x,mother.root.position.z,.38))route=pathfind(p,mother.root.position);if(route.length)b.path=route;}
 b.target=null;b.state='family';const next=b.path[0];if(!next)return {dx:0,dz:0};const x=next.x-p.x,z=next.z-p.z,len=Math.hypot(x,z);if(len<.14){b.path.shift();return {dx:0,dz:0};}const speed=dist>5?3.3:2.5,amount=Math.min(len,speed*dt);return {dx:x/len*amount,dz:z/len*amount};}
 let nextCare=8,careUntil=0;
 function care(dt){
 const distance=mother.root.position.distanceTo(father.root.position);
 const available=!mother.playerControlled&&!father.playerControlled&&!mother.ride&&!father.ride&&!['sleep','paint','kiss'].includes(mother.state)&&!(mother.state==='travel'&&mother.afterArrival==='sleep');
 if(!available){careUntil=0;return false;}
 if(mother.state==='care'){
   if(clock<careUntil){mother.model.rotation.x=.055*Math.sin(clock*3);mother.root.rotation.y=Math.atan2(mother.root.position.x-father.root.position.x,mother.root.position.z-father.root.position.z);mother.fatigue=Math.max(0,mother.fatigue-dt*.035);father.fatigue=Math.max(0,father.fatigue-dt*.07);return true;}
   mother.state='search';mother.timer=.5;
 }
 // Pause on the existing path; preserve the destination while her partner catches up.
 if(distance>6&&['run','travel','search'].includes(mother.state)){mother.waitingForPartner=true;return true;}
 mother.waitingForPartner=false;
 if(clock>=nextCare&&distance<2.4&&!['eat','dig'].includes(mother.state)){
   nextCare=clock+28+Math.random()*18;careUntil=clock+(father.fatigue>.5?6:3);
   mother.state='care';mother.path=[];mother.target=null;mother.careCount=(mother.careCount||0)+1;
   mother.careMessage=father.fatigue>.5?'陪豆豆歇一会儿':'温柔地蹭蹭豆豆，陪在他身边';
   emitHearts();father.kisses=Math.max(0,(father.kisses||1)-1);return true;
 }
 return false;
 }
 return {record,step,trail,hearts,care};
}
