import * as THREE from 'three';
export function addOveralls(bunny){
 const outfit=new THREE.Group();outfit.name='Doudou blue overalls';bunny.model.add(outfit);
 const fabric=new THREE.MeshStandardMaterial({color:0x668997,roughness:1}),thread=new THREE.MeshStandardMaterial({color:0xe7d6b6,roughness:.9}),pocketMat=new THREE.MeshStandardMaterial({color:0x7798a3,roughness:1});
 function oval(p,s,m){const o=new THREE.Mesh(new THREE.SphereGeometry(1,24,16),m);o.position.set(...p);o.scale.set(...s);outfit.add(o);o.castShadow=true;return o;}
 // Rounded shorts follow the body; two cuffs leave the little white paws visible.
 oval([0,.18,.015],[.281,.15,.222],fabric);const waist=new THREE.Mesh(new THREE.CylinderGeometry(.255,.28,.15,48),fabric);waist.scale.z=.85;waist.position.set(0,.245,.012);outfit.add(waist);
 for(const side of [-1,1]){oval([side*.139,.071,-.005],[.124,.057,.193],fabric);const cuff=new THREE.Mesh(new THREE.TorusGeometry(.102,.009,8,32),thread);cuff.rotation.x=Math.PI/2;cuff.scale.y=1.65;cuff.position.set(side*.139,.048,-.006);outfit.add(cuff);}
 oval([0,.299,-.202],[.16,.083,.027],fabric);
 oval([0,.286,-.233],[.062,.039,.008],pocketMat);
 for(const side of [-1,1]){const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(side*.12,.322,-.222),new THREE.Vector3(side*.175,.379,-.174),new THREE.Vector3(side*.244,.417,-.01),new THREE.Vector3(side*.21,.372,.152),new THREE.Vector3(side*.12,.285,.218)]);const strap=new THREE.Mesh(new THREE.TubeGeometry(curve,32,.019,8,false),fabric);outfit.add(strap);oval([side*.12,.329,-.238],[.013,.013,.008],thread);}
 return {outfit,update(){outfit.visible=bunny.state!=='sleep';}};
}
