import * as THREE from 'three';
export function bedHeight(x,z){const r=Math.hypot((x+24)/1.55,(z-2)/1.02);return r<.78?.49:r<1?.1+.39*(1-r)/.22:.1;}
export function createCozyBed(scene,town){
 town.traverse(o=>{if(/^Rabbit_nest|^Nest.*pebbles/.test(o.name))o.visible=false;});
 const bed=new THREE.Group();bed.name='Cozy shared bunny nest';scene.add(bed);const mat=c=>new THREE.MeshStandardMaterial({color:c,roughness:1});const rose=mat(0xc7a094),cream=mat(0xf3dfc5),seam=mat(0xead0b9);
 function pillow(p,s,m){const o=new THREE.Mesh(new THREE.SphereGeometry(1,48,24),m);o.position.set(...p);o.scale.set(...s);o.castShadow=true;o.receiveShadow=true;bed.add(o);return o;}
 pillow([-24,.24,2],[1.6,.24,1.06],rose);
 pillow([-24,.34,2],[1.43,.16,.91],cream);
 const points=[];for(let i=0;i<=100;i++){const a=i*Math.PI*2/100;points.push(new THREE.Vector3(-24+1.43*Math.cos(a),.37+.15*Math.max(0,Math.sin(a)),2+.89*Math.sin(a)));}
 const bolster=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points,true),128,.15,12,true),rose);bolster.castShadow=true;bed.add(bolster);
 for(const x of [-24.75,-24,-23.25])pillow([x,.46,2.13],[.41,.07,.44],cream);
 for(let i=0;i<48;i++){const a=i*Math.PI*2/48;const stitch=pillow([-24+1.56*Math.cos(a),.24,2+1.02*Math.sin(a)],[.03,.009,.009],seam);stitch.rotation.y=-a;}
 return bed;
}
