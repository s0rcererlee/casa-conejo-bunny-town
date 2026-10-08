import * as THREE from 'three';
export function createManhattan(scene,world){
 const group=new THREE.Group();group.name='Central Park';scene.add(group);const mat=c=>new THREE.MeshStandardMaterial({color:c,roughness:.85});const lawn=mat(0x81996f),path=mat(0xe2cfaa),stone=mat(0xbab7aa),road=mat(0x555e61),glass=mat(0x819faa),bark=mat(0x84674d),leaf=mat(0x66845e);const treeCrowns=[],windows=[];
 function box(x,y,z,w,h,d,m){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);group.add(o);return o;}
 box(-39,1,156,52,2,54,lawn);box(-39,2.03,155,3,.06,49,path);box(-39,2.04,155,47,.06,3,path);for(const x of [-61,-17])box(x,2.04,156,2,.08,48,path);
 const lake=new THREE.Mesh(new THREE.CircleGeometry(1,64),new THREE.MeshStandardMaterial({color:0x6aa3a8,roughness:.25}));lake.rotation.x=-Math.PI/2;lake.scale.set(8,12,1);lake.position.set(-49,2.08,163);group.add(lake);box(-49,2.5,163,17,.2,1.6,stone);for(const z of [162.2,163.8])box(-49,3,z,17,.07,.07,stone);
 for(let i=0;i<130;i++){const x=-62+(i*17.37%46),z=132+(i*11.29%47);if(Math.abs(x+39)<3||Math.abs(z-155)<3||Math.hypot((x+49)/10,(z-163)/14)<1)continue;box(x,3,z,.23,2,.23,bark);const c=new THREE.Mesh(new THREE.IcosahedronGeometry(1.5,1),leaf);c.position.set(x,4.6,z);group.add(c);treeCrowns.push(c);}
 for(let i=0;i<8;i++){box(-42,2.6,135+i*5,1.6,.14,.6,stone);box(-42,2.9,135.3+i*5,1.6,.65,.1,bark);}
 const landmark=world.landmarks.length;world.landmarks.push({name:'中央公园 · 湖泊与林荫道',camera:[-77,-124,36],look:[-39,-156,2],description:'童话乐园后方的中央公园：湖泊、步桥、林荫道与草坪。目前为观景区域。'});
 return {group,landmark,update(day,season){windows.forEach(w=>w.material.emissiveIntensity=(1-day)*.9);leaf.color.setHex(season==='winter'?0xc8d2c7:season==='autumn'?0xb8955e:0x66845e);}};
}
