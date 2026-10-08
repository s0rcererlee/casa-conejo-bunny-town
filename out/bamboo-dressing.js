import * as THREE from 'three';

export function dressBambooGrove(group,pathX){
 let seed=671;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
 const dummy=new THREE.Object3D(),V=(x,y,z)=>new THREE.Vector3(x,y,z);
 const material=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.9,...extra});
 function instances(geometry,mat,items){const mesh=new THREE.InstancedMesh(geometry,mat,items.length);items.forEach((o,i)=>{dummy.position.set(...o.p);dummy.rotation.set(...(o.r||[0,0,0]));dummy.scale.set(...(o.s||[1,1,1]));dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);});mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();group.add(mesh);return mesh;}
 const red=material(0xb82424,{emissive:0xff6825,emissiveIntensity:.1}),gold=material(0xd7b360),wood=material(0x74553a);
 const bodies=[],caps=[],strings=[],tassels=[],posts=[],crossbars=[],ribs=[];
 for(let z=-29;z<=20;z+=2){
   const center=pathX(z),high=3.1+rand()*.7;
   for(const side of [-1,1]){
     const x=center+side*1.87,y=high-.55;
     bodies.push({p:[x,y,z],s:[.27,.35,.27]});
     for(const dy of [-.33,.33])caps.push({p:[x,y+dy,z]});
     strings.push({p:[x,high-.05,z],s:[1,.32,1]});tassels.push({p:[x,y-.48,z]});
     posts.push({p:[x+side*.18,high/2,z],s:[1,high,1]});crossbars.push({p:[x,high+.04,z],s:[.55,1,1]});
     for(let j=0;j<6;j++)ribs.push({p:[x,y,z],r:[0,j*Math.PI/6,0],s:[1,1.28,1]});
   }

 }
 instances(new THREE.SphereGeometry(1,12,8),red,bodies);
 instances(new THREE.CylinderGeometry(.14,.14,.065,10),gold,caps);
 instances(new THREE.CylinderGeometry(.01,.01,1,5),wood,strings);
 instances(new THREE.CylinderGeometry(.018,.055,.23,7),red,tassels);
 instances(new THREE.CylinderGeometry(.035,.045,1,6),wood,posts);
 instances(new THREE.BoxGeometry(1,.045,.045),wood,crossbars);
 instances(new THREE.TorusGeometry(.275,.006,4,16),gold,ribs);
 // Narrow grass blades in irregular clumps, leaving the boardwalk clear.
 const blade=new THREE.BufferGeometry();blade.setAttribute('position',new THREE.Float32BufferAttribute([-.025,0,0,.025,0,0,.02,.3,.04,0,.65,.13],3));blade.setIndex([0,1,2,0,2,3]);blade.computeVertexNormals();
 const grasses=[];for(let i=0;i<1700;i++){const x=(rand()-.5)*34,z=(rand()-.5)*42;if(Math.abs(x-pathX(z))<2)continue;for(let j=0;j<3;j++)grasses.push({p:[x+(rand()-.5)*.2,.09,z+(rand()-.5)*.2],r:[0,rand()*Math.PI*2,0],s:[1,.35+rand()*.8,1]});}
 const grass=instances(blade,material(0x658746,{side:THREE.DoubleSide}),grasses);grasses.forEach((_,i)=>grass.setColorAt(i,new THREE.Color().setHSL(.22+rand()*.06,.3,.22+rand()*.12)));grass.instanceColor.needsUpdate=true;
 // Moss is part of the stone surface: vertex colours avoid duplicate overlay meshes.
 const rockGeo=new THREE.IcosahedronGeometry(1,2),pos=rockGeo.attributes.position,colors=[];
 for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i),noise=Math.sin(x*19+z*31)*Math.cos(y*17);const moss=y+noise*.25>-.18;const color=new THREE.Color(moss?(noise>0?0x607839:0x405b31):0x777b69);colors.push(color.r,color.g,color.b);pos.setXYZ(i,x*(1+noise*.07),y*(1+noise*.06),z*(1+noise*.08));}
 rockGeo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));rockGeo.computeVertexNormals();
 const stoneSites=[],rocks=[];
 for(let i=0;i<90;i++){const x=(rand()-.5)*33,z=(rand()-.5)*40;if(Math.abs(x-pathX(z))<2.5||Math.hypot(x+8,z-6)<4||Math.hypot(x-8,z+7)<3.5)continue;const r=.3+rand()*.48;stoneSites.push({x,z,r});rocks.push({p:[x,.15,z],s:[r,.25+rand()*.3,r*.8],r:[0,rand()*6.28,0]});}
 instances(rockGeo,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1}),rocks);
 return {stoneSites,lanternCount:bodies.length,grassCount:grasses.length,update(day){red.emissiveIntensity=.06+(1-day)*1.6;}};
}
