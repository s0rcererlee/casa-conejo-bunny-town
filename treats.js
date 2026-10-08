import * as THREE from 'three';
export function addTreats(scene,foods,groundHeight){
 const mat=c=>new THREE.MeshStandardMaterial({color:c,roughness:.75});const red=mat(0xef3957),green=mat(0x528a3c),seed=mat(0xffe09b),cone=mat(0xd7a060),pink=mat(0xffadc6),cream=mat(0xfff2d9);
 function mesh(parent,g,m,x,y,z){const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.castShadow=true;parent.add(o);return o;}
 function decorate(food,type){food.group.clear();food.type=type;food.label=type==='strawberry'?'草莓':'冰淇淋';const g=food.group;
 if(type==='strawberry'){
  const body=mesh(g,new THREE.SphereGeometry(1,14,10),red,0,.25,0);body.scale.set(.22,.27,.22);
  for(let i=0;i<18;i++){const a=i*2.4,h=-.7+1.4*(i%6)/5,r=Math.sqrt(1-h*h);mesh(g,new THREE.SphereGeometry(.018,5,4),seed,.223*r*Math.cos(a),.25+.27*h,.223*r*Math.sin(a));}
  for(let i=0;i<5;i++){const a=i*Math.PI*2/5,o=mesh(g,new THREE.SphereGeometry(1,6,4),green,.09*Math.cos(a),.5,.09*Math.sin(a));o.scale.set(.13,.025,.05);o.rotation.y=-a;}
 }else{
  mesh(g,new THREE.ConeGeometry(.16,.37,12),cone,0,.2,0).rotation.z=Math.PI;
  mesh(g,new THREE.SphereGeometry(.21,14,10),pink,0,.48,0);mesh(g,new THREE.SphereGeometry(.13,12,8),cream,.03,.65,0);
 }
 return food;}
 // Shop portions replace their original carrot; garden berries are additional food.
 for(const f of foods){f.type='carrot';f.label='胡萝卜';const p=f.group.position;if(Math.abs(p.x+15)<.1&&Math.abs(p.z-61.5)<.1)decorate(f,'icecream');if(Math.abs(p.x+25)<.1&&Math.abs(p.z-61.5)<.1)decorate(f,'strawberry');}
 for(const [x,z,type] of [[-23,1,'strawberry'],[-25,3,'strawberry'],[-4,5,'strawberry'],[4,5,'icecream'],[-15.7,61.5,'icecream'],[-14.3,61.5,'icecream']]){
  const group=new THREE.Group();group.position.set(x,groundHeight(x,z)+.02,z);scene.add(group);foods.push(decorate({group,alive:true,respawn:0},type));
 }
}
