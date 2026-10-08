import * as THREE from 'three';
export function createCoaster(scene){
 const steel=new THREE.MeshStandardMaterial({color:0xffd26a,metalness:.45,roughness:.4}),rail=new THREE.MeshStandardMaterial({color:0x318f99,metalness:.5,roughness:.3}),red=new THREE.MeshStandardMaterial({color:0xd94b52}),seat=new THREE.MeshStandardMaterial({color:0x303746});
 const points=[];for(let i=0;i<80;i++){const a=i/80*Math.PI*2;points.push(new THREE.Vector3(15+17*Math.cos(a),5.1+2.8*Math.sin(a*2)+1.2*Math.cos(a*3),112+7.5*Math.sin(a)));}
 const curve=new THREE.CatmullRomCurve3(points,true,'centripetal');
 function add(g,m,p,parent=scene){const o=new THREE.Mesh(g,m);o.position.copy(p);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
 function bar(a,b,r,m){const d=b.clone().sub(a);const o=add(new THREE.CylinderGeometry(r,r,d.length(),6),m,a.clone().add(b).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());}
 const left=[],right=[],up=new THREE.Vector3(0,1,0);
 for(let i=0;i<240;i++){const t=i/240,p=curve.getPointAt(t),tangent=curve.getTangentAt(t),side=new THREE.Vector3().crossVectors(tangent,up).normalize().multiplyScalar(.48);left.push(p.clone().add(side));right.push(p.clone().sub(side));if(i%3===0)bar(p.clone().add(side.clone().multiplyScalar(1.5)),p.clone().sub(side.clone().multiplyScalar(1.5)),.055,steel);if(i%12===0){bar(new THREE.Vector3(p.x,.1,p.z),p,.14,steel);bar(new THREE.Vector3(p.x+1.1,.1,p.z+.7),p,.09,steel);}}
 for(const pts of [left,right])add(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts,true),360,.085,8,true),rail,new THREE.Vector3());
 const cars=[];for(let i=0;i<4;i++){const g=new THREE.Group();scene.add(g);add(new THREE.BoxGeometry(1.25,.45,1.7),red,new THREE.Vector3(0,.45,0),g);for(const z of [-.4,.4]){add(new THREE.BoxGeometry(.9,.15,.6),seat,new THREE.Vector3(0,.75,z),g);add(new THREE.BoxGeometry(.9,.5,.12),seat,new THREE.Vector3(0,1,z+.25),g);}for(const x of [-.65,.65])for(const z of [-.5,.5]){const wheel=add(new THREE.CylinderGeometry(.19,.19,.12,12),seat,new THREE.Vector3(x,.12,z),g);wheel.rotation.z=Math.PI/2;}cars.push(g);}
 let progress=0;return {cars,curve,hold:false,update(dt,running){if(running&&!this.hold)progress=(progress+dt*.021)%1;cars.forEach((g,i)=>{const t=(progress-i*.018+1)%1,p=curve.getPointAt(t),d=curve.getTangentAt(t);g.position.copy(p);g.quaternion.setFromRotationMatrix(new THREE.Matrix4().lookAt(p,p.clone().add(d),up));});}};
}
