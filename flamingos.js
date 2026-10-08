import * as THREE from 'three';

export function createFlamingos(scene, loaded) {
  const expansion=Math.SQRT2; // Double the surface area, preserving the oval proportions.
  const group=new THREE.Group();group.name='瓷砖庭院火烈鸟水池';scene.add(group);
  const mat=c=>new THREE.MeshStandardMaterial({color:c,roughness:.8});
  const pink=mat(0xf3a3ae),coral=mat(0xe97592),pale=mat(0xffd4c8),dark=mat(0x30303a),legMat=mat(0xbb6f80);
  const V=(x,y,z)=>new THREE.Vector3(x,y,z);
  function egg(parent,m,p,s){const o=new THREE.Mesh(new THREE.SphereGeometry(1,16,12),m);o.position.set(...p);o.scale.set(...s);parent.add(o);return o;}
  function line(parent,points,r,m){const curve=new THREE.CatmullRomCurve3(points.map(p=>V(...p)));const o=new THREE.Mesh(new THREE.TubeGeometry(curve,20,r,7,false),m);parent.add(o);return o;}
  loaded.traverse(o=>{if(/^V3_Heritage_patio_(fountain|water)/.test(o.name))o.visible=false;});
  loaded.updateMatrixWorld(true);
  loaded.traverse(o=>{
    if(!o.isMesh||!/^V3_Heritage_(patio|azulejo|orange)/.test(o.name))return;
    if(/fountain|water/.test(o.name))return;
    const p=o.getWorldPosition(new THREE.Vector3());p.x=26+(p.x-26)*expansion;p.z=7+(p.z-7)*expansion;
    o.position.copy(o.parent.worldToLocal(p));
    // Blender's patio plane uses local X/Y axes; keep trees and tile sizes unchanged.
    if(/^V3_Heritage_patio$/.test(o.name)){o.scale.x*=expansion;o.scale.y*=expansion;}
  });
  const pool=new THREE.Mesh(new THREE.CylinderGeometry(1,1,.22,64),mat(0xeee0bd));pool.scale.set(2.95*expansion,1,1.85*expansion);pool.position.set(26,.23,7);group.add(pool);
  const water=new THREE.Mesh(new THREE.CircleGeometry(1,64),new THREE.MeshStandardMaterial({color:0x48acb2,roughness:.24,metalness:.15}));water.rotation.x=-Math.PI/2;water.scale.set(2.72*expansion,1.62*expansion,1);water.position.set(26,.345,7);group.add(water);
  for(let i=0;i<64;i++){const a=i*Math.PI/32;const tile=new THREE.Mesh(new THREE.BoxGeometry(.21,.035,.15),mat(i%2?0x328a9c:0xf5d597));tile.position.set(26+2.84*expansion*Math.cos(a),.36,7+1.73*expansion*Math.sin(a));tile.rotation.y=-a;group.add(tile);}
  const birds=Array.from({length:9},(_,i)=>{
    const root=new THREE.Group();root.name=`火烈鸟 ${i+1}`;group.add(root);
    const body=egg(root,i%3?pink:coral,[0,1.05,0],[.23,.3,.43]);
    const wings=[-1,1].map(side=>{const pivot=new THREE.Group();pivot.position.set(side*.16,1.17,.08);root.add(pivot);egg(pivot,coral,[side*.06,-.12,.03],[.095,.21,.32]);return pivot;});
    egg(root,coral,[0,1.13,.37],[.12,.11,.22]).rotation.x=-.3;
    const neck=new THREE.Group();neck.position.set(0,1.17,-.24);root.add(neck);
    line(neck,[[0,0,0],[0,.32,.08],[0,.65,.04],[0,.88,-.13],[0,.92,-.31]],.065,pink);
    egg(neck,pink,[0,.91,-.32],[.115,.13,.14]);
    line(neck,[[0,.89,-.4],[0,.86,-.52],[0,.74,-.57]],.065,pale);
    line(neck,[[0,.77,-.56],[0,.68,-.57],[0,.64,-.53]],.052,dark);
    for(const side of [-1,1])egg(neck,dark,[side*.106,.95,-.36],[.022,.025,.022]);
    const legs=[-1,1].map(side=>{const pivot=new THREE.Group();pivot.position.set(side*.105,.87,.04);root.add(pivot);line(pivot,[[0,0,0],[0,-.4,.06],[0,-.84,0]],.023,legMat);egg(pivot,legMat,[0,-.84,-.055],[.065,.022,.11]);return pivot;});
    const ripple=new THREE.Mesh(new THREE.RingGeometry(.26,.28,32),new THREE.MeshBasicMaterial({color:0xc2e3dd,transparent:true,opacity:.3,side:THREE.DoubleSide,depthWrite:false}));ripple.rotation.x=-Math.PI/2;ripple.position.y=.35;group.add(ripple);
    return {root,neck,legs,wings,ripple,body};
  });
  let time=0;
  function update(dt){time+=dt;birds.forEach((b,i)=>{
    const phase=time*.055+i*Math.PI*2/9,r=.65+.13*(i%3);
    const x=26+2.15*expansion*r*Math.cos(phase),z=7+1.12*expansion*r*Math.sin(phase);
    b.root.position.set(x,.32,z);b.root.scale.setScalar(.72);
    const dx=-2.15*expansion*r*.055*Math.sin(phase),dz=1.12*expansion*r*.055*Math.cos(phase);
    const cycle=(time+i*3.7)%24,feeding=cycle>9&&cycle<17;
    b.root.rotation.y=Math.atan2(-dx,-dz);
    const dip=feeding?Math.sin((cycle-9)/8*Math.PI):0;
    b.neck.rotation.x=-dip*2.15;
    b.legs.forEach((l,k)=>l.rotation.x=feeding?0:Math.sin(time*2+i+k*Math.PI)*.13);
    b.wings.forEach((w,k)=>w.rotation.z=(k?1:-1)*(cycle>20?Math.sin((cycle-20)/4*Math.PI)*.95:0));
    b.ripple.position.x=x;b.ripple.position.z=z;const s=1+((time*.3+i*.23)%1)*1.4;b.ripple.scale.setScalar(s);b.ripple.material.opacity=.3*(1-(s-1)/1.4);
  });}
  update(0);return {group,birds,update,expansion};
}
