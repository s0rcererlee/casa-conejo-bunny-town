import * as THREE from 'three';
export function createCycling(scene,rabbits,{goTo,mountains,pandaTrail,groundHeight}){
 const entry=new THREE.Vector3(-53,.1,65),group=new THREE.Group();group.name='Around-town cycleway';scene.add(group);const mat=c=>new THREE.MeshStandardMaterial({color:c,roughness:.9});const surface=mat(0xb7b28e),cream=mat(0xf3e5c8),dark=mat(0x3d4d50);
 let curve=new THREE.CatmullRomCurve3([[-53,65],[-106,66],[-113,5],[-90,-66],[-15,-78],[46,-67],[136,-30],[140,95],[87,224],[-60,225],[-109,171],[-106,100],[-53,65]].slice(0,-1).map(([x,z])=>new THREE.Vector3(x,.48,z)),true,'catmullrom',.2);
 mountains.group.updateMatrixWorld(true);const ray=new THREE.Raycaster();const route=[];for(let i=0;i<650;i++){const p=curve.getPointAt(i/650);ray.set(new THREE.Vector3(p.x,240,p.z),new THREE.Vector3(0,-1,0));const hit=ray.intersectObjects(mountains.bands)[0];if(hit)p.y=Math.max(.48,hit.point.y+.48);route.push(p);}curve=new THREE.CatmullRomCurve3(route,true);
 const v=[],ix=[],n=650;for(let i=0;i<=n;i++){const p=curve.getPointAt(i/n),d=curve.getTangentAt(i/n);for(const side of [-1,1])v.push(p.x-d.z*side*1.4,p.y,p.z+d.x*side*1.4);if(i<n){const k=i*2;ix.push(k,k+1,k+2,k+1,k+3,k+2);}}const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(v,3));g.setIndex(ix);g.computeVertexNormals();surface.side=THREE.DoubleSide;group.add(new THREE.Mesh(g,surface));
 function beam(parent,a,b,r,m){const d=b.clone().sub(a),o=new THREE.Mesh(new THREE.CylinderGeometry(r,r,d.length(),8),m);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());parent.add(o);return o;}
 for(let i=0;i<280;i++){const p=curve.getPointAt(i/280),d=curve.getTangentAt(i/280);beam(group,p.clone().add(new THREE.Vector3(0,.015,0)),p.clone().addScaledVector(d,.7).add(new THREE.Vector3(0,.015,0)),.035,cream);if(p.x>47||p.z>125){for(const side of [-1,1]){const post=p.clone().add(new THREE.Vector3(-d.z*side*1.4,0,d.x*side*1.4));beam(group,post,post.clone().add(new THREE.Vector3(0,.8,0)),.04,dark);}}}
 const bikes=rabbits.map((b,i)=>{const bike=new THREE.Group(),paint=mat([0xd398a8,0xdac17b,0x7b9fac][i]);scene.add(bike);const wheels=[];for(const z of [-.47,.47]){const wheel=new THREE.Mesh(new THREE.TorusGeometry(.27,.035,8,24),dark);wheel.rotation.y=Math.PI/2;wheel.position.set(0,.29,z);bike.add(wheel);wheels.push(wheel);for(let a=0;a<6;a++){const q=a*Math.PI/3;beam(bike,new THREE.Vector3(0,.29,z),new THREE.Vector3(0,.29+.25*Math.cos(q),z+.25*Math.sin(q)),.009,cream);}}
 const pts=[[0,.29,.47],[0,.65,.14],[0,.32,-.05],[0,.7,-.36],[0,.29,-.47]];for(const [a,c] of [[0,1],[1,2],[2,0],[1,3],[2,3],[3,4]])beam(bike,new THREE.Vector3(...pts[a]),new THREE.Vector3(...pts[c]),.027,paint);beam(bike,new THREE.Vector3(-.22,.84,-.38),new THREE.Vector3(.22,.84,-.38),.025,dark);const seat=new THREE.Mesh(new THREE.BoxGeometry(.25,.07,.23),dark);seat.position.set(0,.69,.12);bike.add(seat);bike.position.copy(entry).add(new THREE.Vector3(i*.7,0,1.5));return bike;});
 function startTo(b,destination,panda=false,pointToPoint=true){
   if(b.playerControlled||b.ride||b.cycleTrip)return false;
   if(!goTo(b,destination,panda?'pandaReady':'cycleReady'))return false;
   b.cycleTrip={phase:'approach',time:0,panda,pointToPoint,path:b.path.map(p=>p.clone())};b.path=[];
   if(!panda){const bike=bikes[b.personality];bike.position.copy(b.root.position);bike.rotation.y=b.root.rotation.y;b.root.position.y=groundHeight(b.root.position.x,b.root.position.z)+.74;b.state='cycling';}
   return true;
 }
 function start(b,panda=false){return startTo(b,panda?pandaTrail.entry:entry,panda,false);}
 function update(b,dt){const job=b.cycleTrip;if(!job)return false;const bike=bikes[b.personality];
 if(job.phase==='approach'){
   let distance=dt*(job.panda?1.25:2.2);job.time+=dt;
   while(distance>0&&job.path.length){const q=job.path[0],dx=q.x-b.root.position.x,dz=q.z-b.root.position.z,len=Math.hypot(dx,dz);if(len<.015){job.path.shift();continue;}const move=Math.min(distance,len);b.root.position.x+=dx/len*move;b.root.position.z+=dz/len*move;b.root.rotation.y=Math.atan2(-dx,-dz);distance-=move;if(move===len)job.path.shift();}
   const y=groundHeight(b.root.position.x,b.root.position.z);b.root.position.y=y+(job.panda?0:.74);b.state=job.panda?'pandaWalk':'cycling';b.model.rotation.x=job.panda?0:.1;
   if(!job.panda){bike.position.set(b.root.position.x,y,b.root.position.z);bike.rotation.set(0,b.root.rotation.y,0);}
   b.feet.forEach((f,i)=>f.rotation.x=Math.sin(job.time*8+i*Math.PI)*.3);
   if(job.path.length)return true;
   if(job.pointToPoint){b.root.position.y=y;b.model.rotation.x=0;b.cycleTrip=null;b.state='search';b.timer=3;b.nextBike=performance.now()+120000;return true;}
   job.phase='ride';job.time=0;
 }
 if(job.panda){
   const route=pandaTrail.route,duration=route.getLength()/1.25;
   job.time+=dt;
   if(job.phase==='ride'&&job.time>=duration){job.phase='watch';job.time=0;}
   if(job.phase==='watch'&&job.time>=18){job.phase='return';job.time=0;}
   const returning=job.phase==='return';const u=job.phase==='watch'?1:Math.min(1,job.time/duration);const t=returning?1-u:u;
   const p=route.getPointAt(t),d=route.getTangentAt(t);if(returning)d.negate();
   // Panda visits are on foot; bicycles remain at their existing parking spots.
   b.root.position.copy(p);b.root.rotation.y=Math.atan2(-d.x,-d.z);b.model.rotation.x=0;
   if(job.phase==='watch'){b.root.position.x+=(b.personality-1)*.65;b.root.rotation.y=-Math.PI/2;b.state='pandaWatch';b.feet.forEach(f=>f.rotation.x=0);}else{
     b.state='pandaWalk';b.root.position.y+=Math.abs(Math.sin(job.time*5))* .045;
     b.feet.forEach((f,i)=>f.rotation.x=Math.sin(job.time*5+i*Math.PI)*.22);
   }
   if(returning&&u===1){b.root.position.copy(pandaTrail.entry);b.model.rotation.x=0;b.cycleTrip=null;b.state='search';b.timer=1;b.nextBike=performance.now()+120000;}
   return true;
 }
 job.time+=dt;const t=Math.min(1,job.time/100),p=curve.getPointAt(t%1),d=curve.getTangentAt(t%1);bike.position.copy(p);bike.rotation.y=Math.atan2(-d.x,-d.z);b.root.position.copy(p).add(new THREE.Vector3(0,.74,0));b.root.rotation.y=bike.rotation.y;b.model.scale.set(1,1,1);b.model.rotation.x=.1;b.state='cycling';b.feet.forEach((f,i)=>f.rotation.x=Math.sin(job.time*8+i*Math.PI)*.4);
 if(t===1){b.root.position.copy(entry);bike.position.copy(entry).add(new THREE.Vector3(b.personality*.7,0,1.5));b.cycleTrip=null;b.state='search';b.timer=1;b.nextBike=performance.now()+120000;}return true;}
 return {group,bikes,entry,start,startTo,update,curve};
}
