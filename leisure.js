import * as THREE from 'three';
export function createLeisure(scene){
 const colors=[0xef8c9b,0x6cc9b5,0xf4c66e,0x668eb7],metal=new THREE.MeshStandardMaterial({color:0xffedce,metalness:.25,roughness:.45});
 const mats=colors.map(color=>new THREE.MeshStandardMaterial({color,roughness:.6}));
 function mesh(g,m,p,parent=scene){const o=new THREE.Mesh(g,m);o.position.set(...p);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
 function bar(a,b,r,m,parent){const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b),d=bv.clone().sub(av);const o=mesh(new THREE.CylinderGeometry(r,r,d.length(),8),m,av.clone().add(bv).multiplyScalar(.5).toArray(),parent);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());}
 const wheel=new THREE.Group();wheel.position.set(-26,7,84);scene.add(wheel);
 for(const z of [-.65,.65]){mesh(new THREE.TorusGeometry(5.6,.13,8,64),metal,[0,0,z],wheel);for(let i=0;i<12;i++){const a=i*Math.PI/6;bar([0,0,z],[5.6*Math.cos(a),5.6*Math.sin(a),z],.065,metal,wheel);}}
 mesh(new THREE.CylinderGeometry(.4,.4,1.8,16),mats[0],[0,0,0],wheel).rotation.x=Math.PI/2;
 const cabins=[];for(let i=0;i<12;i++){const g=new THREE.Group();wheel.add(g);mesh(new THREE.BoxGeometry(1.2,.65,1.3),mats[i%4],[0,-.4,0],g);mesh(new THREE.BoxGeometry(1.35,.14,1.45),mats[(i+1)%4],[0,1.35,0],g).name="cabinRoof";for(const x of [-.5,.5])bar([x,-.1,-.5],[x,1.3,-.5],.035,metal,g);cabins.push(g);}
 const carousel=new THREE.Group();carousel.position.set(-10,.35,83);scene.add(carousel);const mounts=[];
 for(let i=0;i<8;i++){const a=i*Math.PI/4,x=2.8*Math.cos(a),z=2.8*Math.sin(a);bar([x,0,z],[x,3.25,z],.045,metal,carousel);const g=new THREE.Group();g.position.set(x,1,z);g.rotation.y=-a;carousel.add(g);const body=mesh(new THREE.SphereGeometry(1,12,8),mats[i%4],[0,0,0],g);body.scale.set(.35,.4,.65);const head=mesh(new THREE.SphereGeometry(.29,12,8),metal,[0,.4,-.5],g);for(const x of [-.15,.15]){const ear=mesh(new THREE.SphereGeometry(1,8,6),metal,[x,.78,-.5],g);ear.scale.set(.09,.35,.1);}mounts.push(g);}
 const swings=[];for(const x of [5.5,8.5]){const g=new THREE.Group();g.position.set(x,3.8,80);scene.add(g);for(const dx of [-.45,.45])bar([dx,0,0],[dx,-2.6,0],.025,metal,g);mesh(new THREE.BoxGeometry(1.15,.12,.6),mats[0],[0,-2.6,0],g);swings.push(g);}
 // Festoon lights over the pedestrian street.
 for(let i=0;i<27;i++){const x=-36+i*2.8,y=4.3-.6*Math.sin(i/26*Math.PI);mesh(new THREE.SphereGeometry(.1,8,6),new THREE.MeshStandardMaterial({color:colors[i%4],emissive:colors[i%4],emissiveIntensity:.7}),[x,y,68]);if(i)bar([x-2.8,4.3-.6*Math.sin((i-1)/26*Math.PI),68],[x,y,68],.015,metal,scene);}
 let running=true;const button=document.createElement('button');button.id='rides';button.textContent='游乐设施 · 运转中';document.getElementById('visit-landmark').after(button);button.onclick=()=>{running=!running;button.textContent=running?'游乐设施 · 运转中':'游乐设施 · 已暂停';};
 let t=0,wt=0,ct=0,st=0;return {wheel,cabins,carousel,mounts,swings,holdWheel:false,holdCarousel:false,holdSwing:false,get running(){return running},update(dt){if(running){t+=dt;if(!this.holdWheel)wt+=dt;if(!this.holdCarousel)ct+=dt;if(!this.holdSwing)st+=dt;}wheel.rotation.z=wt*.11;cabins.forEach((g,i)=>{const a=i*Math.PI/6;g.position.set(5.6*Math.cos(a),5.6*Math.sin(a),0);g.rotation.z=-wheel.rotation.z;});carousel.rotation.y=ct*.22;mounts.forEach((g,i)=>g.position.y=1+Math.sin(t*1.7+i)*.22);swings.forEach((g,i)=>g.rotation.x=Math.sin(st*1.5+i)*.35);}};
}
