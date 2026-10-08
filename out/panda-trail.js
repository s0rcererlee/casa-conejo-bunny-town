import * as THREE from 'three';
export function createPandaTrail(scene){
 const group=new THREE.Group();group.name='龙达 · 竹隐古道';group.position.set(-60,12,143);group.rotation.y=Math.PI;scene.add(group);
 const stone=new THREE.MeshStandardMaterial({color:0x89918b,roughness:1}),wood=new THREE.MeshStandardMaterial({color:0x78503b,roughness:.9}),tile=new THREE.MeshStandardMaterial({color:0x414f50,roughness:.85}),cream=new THREE.MeshStandardMaterial({color:0xd8cbb0,roughness:.9});
 const lanterns=[];
 function lantern(parent,x,y,z){
   const red=new THREE.MeshStandardMaterial({color:0xb83429,emissive:0xff782d,emissiveIntensity:.05,roughness:.65});
   const gold=new THREE.MeshStandardMaterial({color:0xcba754,roughness:.65});
   const body=new THREE.Mesh(new THREE.SphereGeometry(1,16,12),red);body.position.set(x,y,z);body.scale.set(.3,.4,.3);parent.add(body);lanterns.push(red);
   for(const dy of [-.37,.37]){const cap=new THREE.Mesh(new THREE.CylinderGeometry(.16,.16,.075,12),gold);cap.position.set(x,y+dy,z);parent.add(cap);}
   const cord=new THREE.Mesh(new THREE.CylinderGeometry(.014,.014,.38,6),gold);cord.position.set(x,y+.6,z);parent.add(cord);
   const tassel=new THREE.Mesh(new THREE.CylinderGeometry(.025,.06,.25,8),gold);tassel.position.set(x,y-.55,z);parent.add(tassel);
   for(let j=0;j<8;j++){const a=j*Math.PI/4;const rib=new THREE.Mesh(new THREE.TorusGeometry(.305,.009,4,24),gold);rib.scale.set(1,1.3,1);rib.rotation.y=a;rib.position.set(x,y,z);parent.add(rib);}
 }
 // A light timber viaduct bends away from the historic bridge and climbs gradually.
 const approach=new THREE.CatmullRomCurve3([
   new THREE.Vector3(20,-3.9,113),new THREE.Vector3(19,-3.65,116),
   new THREE.Vector3(18.6,-2.5,119),new THREE.Vector3(21.8,-.55,122),new THREE.Vector3(22.93,.22,123),
   new THREE.Vector3(20+Math.sin(-31*.14)*3,.44,124)
 ],false,'centripetal');
 const points=[];for(let i=0;i<=80;i++)points.push(approach.getPoint(i/80));for(let z=124.25;z<=159;z+=.25)points.push(new THREE.Vector3(20+Math.sin((z-155)*.14)*3,.44,z));
 const deckPoints=points.map(p=>p.clone());for(let z=159.25;z<=175;z+=.25)deckPoints.push(new THREE.Vector3(20+Math.sin((z-155)*.14)*3,.44,z));
 const deck=new THREE.CatmullRomCurve3(deckPoints,false,'centripetal');
 function beam(a,b,width,depth,material){const d=b.clone().sub(a),o=new THREE.Mesh(new THREE.BoxGeometry(width,d.length(),depth),material);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());group.add(o);return o;}
 const count=Math.ceil(deck.getLength()/.22),slabs=new THREE.InstancedMesh(new THREE.BoxGeometry(2.65,.13,.225),wood,count+1),dummy=new THREE.Object3D();
 for(let i=0;i<=count;i++){const p=deck.getPointAt(i/count),d=deck.getTangentAt(i/count);dummy.position.copy(p).add(new THREE.Vector3(0,-.065,0));dummy.rotation.set(0,Math.atan2(-d.x,-d.z),0);dummy.rotateX(Math.atan2(d.y,Math.hypot(d.x,d.z)));dummy.updateMatrix();slabs.setMatrixAt(i,dummy.matrix);}slabs.instanceMatrix.needsUpdate=true;slabs.computeBoundingSphere();group.add(slabs);
 const span=Math.ceil(deck.getLength()/1.5);
 for(let i=0;i<span;i++){
   const p=deck.getPointAt(i/span),q=deck.getPointAt((i+1)/span),d=deck.getTangentAt(i/span),e=deck.getTangentAt((i+1)/span);d.y=e.y=0;d.normalize();e.normalize();
   // Side openings let pandas reach the woodland without passing through rails.
   if(p.z>153&&p.z<158||p.z>164&&p.z<169)continue;
   for(const side of [-1,1]){
     const a=p.clone().add(new THREE.Vector3(-d.z*side*1.3,0,d.x*side*1.3)),b=q.clone().add(new THREE.Vector3(-e.z*side*1.3,0,e.x*side*1.3));
     beam(a.clone().add(new THREE.Vector3(0,-.27,0)),b.clone().add(new THREE.Vector3(0,-.27,0)),.16,.2,wood);
     beam(a,a.clone().add(new THREE.Vector3(0,1.02,0)),.065,.065,wood);
     for(const h of [.48,.98])beam(a.clone().add(new THREE.Vector3(0,h,0)),b.clone().add(new THREE.Vector3(0,h,0)),.065,.065,wood);
     if(i%3===1){const foot=a.clone();foot.y=p.z<133?-10.8:.1;beam(foot,a,.22,.22,wood);beam(foot.clone().lerp(a,.72),b.clone().add(new THREE.Vector3(0,-.3,0)),.14,.14,wood);}
   }
 }
 function box(parent,x,y,z,w,h,d,m){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);parent.add(o);return o;}
 const gate=new THREE.Group();gate.position.set(20+Math.sin(-20*.14)*3,.44,135);const gateDirection=new THREE.Vector3(.42*Math.cos(-20*.14),0,1);gate.rotation.y=Math.atan2(gateDirection.x,gateDirection.z);group.add(gate);
 for(const x of [-2.1,2.1]){box(gate,x,.2,0,.65,.4,.65,stone);box(gate,x,2.15,0,.25,4.1,.25,wood);}
 for(const x of [-1.65,1.65])lantern(gate,x,2.7,-.05);
 box(gate,0,3.7,0,5,.24,.38,wood);box(gate,0,4.3,0,5.5,.18,1.4,tile);
 for(const side of [-1,1]){const eave=box(gate,side*2.75,4.43,0,.65,.16,1.4,tile);eave.rotation.z=side*.3;}
 // A few suspended red lanterns frame the open bridge, preserving the canyon view.
 for(const t of [.18,.48,.72]){const p=approach.getPointAt(t),d=approach.getTangentAt(t);d.y=0;d.normalize();for(const side of [-1,1]){const x=p.x-d.z*side*1.38,z=p.z+d.x*side*1.38;box(group,x,p.y+1.4,z,.07,2.8,.07,wood);box(group,x,p.y+2.75,z,.55,.07,.07,wood);lantern(group,x,p.y+2,z);}}
 group.updateMatrixWorld(true);points.forEach(p=>p.applyMatrix4(group.matrixWorld));const worldRoute=new THREE.CatmullRomCurve3(points,false,'centripetal');
 return {group,route:worldRoute,entry:points[0].clone(),deck,update(day){for(const m of lanterns)m.emissiveIntensity=.06+(1-day)*1.9;}};
}
