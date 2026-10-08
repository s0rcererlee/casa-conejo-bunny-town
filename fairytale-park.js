import * as THREE from 'three';
export function createFairytalePark(scene,world,playgrounds){
 const group=new THREE.Group();group.name='Disney-inspired fairytale park';scene.add(group);const mat=c=>new THREE.MeshStandardMaterial({color:c,roughness:.85});const pink=mat(0xe7beca),cream=mat(0xf7e8d0),blue=mat(0x6c8da9),gold=mat(0xd7b66a),green=mat(0x7f9e76),path=mat(0xe2c9ae);const lights=[],flags=[];
 function box(x,y,z,w,h,d,m){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;group.add(o);return o;}
 function cyl(x,y,z,r,h,m,top=r){const o=new THREE.Mesh(new THREE.CylinderGeometry(top,r,h,24),m);o.position.set(x,y,z);group.add(o);o.castShadow=true;return o;}
 function block(x,z,w,d){world.colliders.push([x,-z,w/2,d/2]);}
 box(-43,-.05,90,29,.1,39,green);box(-43,.02,87,5,.04,34,path);box(-36,.021,73,19,.04,4,path);box(-43,.023,84,25,.05,5,path);
 // A walk-through central gate flanked by tall pink towers and blue spires.
 for(const side of [-1,1]){const x=-43+side*4.6;box(x,3.1,96,5.2,6.2,6,pink);block(x,96,5.2,6);box(x,6.3,96,5.6,.35,6.4,cream);for(let i=0;i<5;i++)box(x-2+i,6.8,92.9,.55,.8,.55,cream);}
 box(-43,6.2,96,4,2,6,pink);for(const side of [-1,1]){box(-43+side*2,2.5,93, .3,5,.3,cream);}
 const curve=[];for(let i=0;i<=32;i++){const a=i*Math.PI/32;curve.push(new THREE.Vector3(-43+2*Math.cos(a),3.4+2*Math.sin(a),92.95));}group.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(curve),32,.16,8,false),cream));
 function tower(x,z,r,h){cyl(x,h/2,z,r,h,pink);block(x,z,r*2,r*2);cyl(x,h,z,r+.18,.38,cream);cyl(x,h+2,z,r+.35,4,blue,0);cyl(x,h+4.25,z,.055,.6,gold);for(let k=0;k<3;k++){const y=2+k*2.4;if(y<h-.8)box(x,y,z-r-.02,.46,1.1,.08,blue);}const flag=box(x+.45,h+4.3,z,.8,.4,.035,kColor(x));flags.push(flag);}
 function kColor(x){return x<-43?pink:gold;}
 tower(-51,94,1.5,8);tower(-35,94,1.5,8);tower(-48,99,1.2,10);tower(-38,99,1.2,10);tower(-43,100,1.7,13);
 // Clock and star at the heart of the castle.
 const clock=cyl(-43,6.9,92.85,.58,.1,cream);clock.rotation.x=Math.PI/2;box(-43,7.05,92.76,.06,.4,.035,gold);box(-42.86,6.9,92.75,.3,.06,.035,gold);
 // Flower parterres, lamps, benches, and a Mickey-shaped floral bed.
 for(const x of [-52,-34])for(const z of [77,84]){cyl(x,.12,z,2,.22,cream);for(let j=0;j<18;j++){const a=j*Math.PI/9;const flower=new THREE.Mesh(new THREE.SphereGeometry(.25,8,6),j%2?pink:gold);flower.position.set(x+1.5*Math.cos(a),.35,z+1.5*Math.sin(a));group.add(flower);}}
 for(const [x,z,r] of [[-43,77,1.4],[-44.3,75.6,.8],[-41.7,75.6,.8]])cyl(x,.09,z,r,.14,blue);
 for(const x of [-48,-38])for(const z of [80,88]){cyl(x,1.3,z,.065,2.6,gold);const bulb=new THREE.Mesh(new THREE.SphereGeometry(.25,12,8),new THREE.MeshStandardMaterial({color:0xffe4ad,emissive:0xffb66a}));bulb.position.set(x,2.7,z);group.add(bulb);const light=new THREE.PointLight(0xffbc78,0,10,2);light.position.copy(bulb.position);group.add(light);lights.push(light);box(x, .6,z+1.3,2,.16,.6,cream);block(x,z+1.3,2,.6);}
 const landmark=world.landmarks.length;world.landmarks.push({name:'迪士尼风格 · 童话城堡乐园',camera:[-52,-68,16],look:[-43,-94,5],description:'粉蓝尖塔、迎宾花园、米奇造型花坛与暖灯。原创微缩童话乐园，兔兔可以穿过城堡门洞，在花园寻找胡萝卜。'});const food=[[-43,-90],[-43,-97],[-46,-85]];world.carrots.push(...food);playgrounds.push({landmark,name:'童话城堡乐园',entry:[-43,-72],spots:[[-43,-90],[-43,-97],[-46,-85]],food});
 return {group,landmark,update(day,time){lights.forEach(l=>l.intensity=(1-day)*14);flags.forEach((f,i)=>f.rotation.y=Math.sin(time*2+i)*.15);}};
}
