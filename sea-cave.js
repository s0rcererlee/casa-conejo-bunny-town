import * as THREE from 'three';

export const CHANNEL={z:-5,entrance:118,exit:286,halfWidth:14,roof:23};
export function createSeaCave(scene,mountains){
 const group=new THREE.Group();group.name='Navigable mountain sea cave';scene.add(group);
 function carveGround(mesh){mesh.material.onBeforeCompile=shader=>{shader.vertexShader='varying vec3 channelWorld;\n'+shader.vertexShader;shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nchannelWorld=(modelMatrix*vec4(position,1.0)).xyz;');shader.fragmentShader='varying vec3 channelWorld;\n'+shader.fragmentShader;shader.fragmentShader=shader.fragmentShader.replace('#include <clipping_planes_fragment>','#include <clipping_planes_fragment>\nif(channelWorld.x>80.0&&abs(channelWorld.z+5.0)<16.0)discard;');};mesh.material.customProgramCacheKey=()=> 'channel-ground-v1';mesh.material.needsUpdate=true;}
 mountains.group.children.filter(o=>o.isMesh&&o.geometry.type==='CircleGeometry').forEach(carveGround);
 // Cut the actual mountain surfaces inside the navigable vault, keeping the ridge above.
 for(const mesh of mountains.bands){mesh.material.onBeforeCompile=shader=>{
  shader.vertexShader='varying vec3 caveWorld;\n'+shader.vertexShader;
  shader.vertexShader=shader.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\ncaveWorld=(modelMatrix*vec4(position,1.0)).xyz;');
  shader.fragmentShader='varying vec3 caveWorld;\n'+shader.fragmentShader;
  shader.fragmentShader=shader.fragmentShader.replace('#include <clipping_planes_fragment>','#include <clipping_planes_fragment>\nfloat caveZ=(caveWorld.z+5.0)/14.0;float ceiling=-4.0+27.0*sqrt(max(0.0,1.0-caveZ*caveZ));if(caveWorld.x>108.0&&caveWorld.x<296.0&&abs(caveZ)<1.0&&caveWorld.y<ceiling)discard;');
 };mesh.material.customProgramCacheKey=()=> 'sea-cave-v1';mesh.material.needsUpdate=true;}
 const ring=new THREE.Shape(),segments=48;
 for(let i=0;i<=segments;i++){const a=i*Math.PI/segments,x=20*Math.cos(a),y=-4+34*Math.sin(a);if(i===0)ring.moveTo(x,y);else ring.lineTo(x,y);}
 for(let i=segments;i>=0;i--){const a=i*Math.PI/segments;ring.lineTo(14*Math.cos(a),-4+27*Math.sin(a));}ring.closePath();
 const rock=new THREE.MeshStandardMaterial({color:0x867969,roughness:1,side:THREE.DoubleSide});
 const vault=new THREE.Mesh(new THREE.ExtrudeGeometry(ring,{depth:168,steps:12,bevelEnabled:false,curveSegments:32}),rock);vault.rotation.y=Math.PI/2;vault.position.set(118,0,-5);vault.receiveShadow=true;vault.castShadow=true;group.add(vault);
 // A continuous water lane connects the inner harbor to the outer ocean.
 const positions=[],indices=[];for(let i=0;i<=64;i++){const x=80+i*9;const y=.12-4.105*THREE.MathUtils.smoothstep(x,295,360);for(const z of [-21,11])positions.push(x,y,z);if(i<64){const k=i*2;indices.push(k,k+1,k+2,k+1,k+3,k+2);}}
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();
 const water=new THREE.Mesh(geometry,new THREE.MeshStandardMaterial({color:0x367f98,roughness:.25,metalness:.2,side:THREE.DoubleSide}));group.add(water);
 const lights=[];for(const x of [121,160,202,244,282])for(const side of [-1,1]){const lamp=new THREE.Mesh(new THREE.SphereGeometry(.35,8,6),new THREE.MeshStandardMaterial({color:0xffd690,emissive:0xffad44,emissiveIntensity:1.5}));lamp.position.set(x,5,-5+side*12.4);group.add(lamp);lights.push(lamp);}
 for(const x of [115,290])for(const side of [-1,1]){const buoy=new THREE.Mesh(new THREE.CylinderGeometry(.5,.7,1.8,10),new THREE.MeshStandardMaterial({color:side<0?0xc6584e:0x4d986c}));buoy.position.set(x,.3,-5+side*10);group.add(buoy);}
 return {group,water,carveGround,update(t,night){water.material.color.set(night?0x163f52:0x367f98);lights.forEach(o=>o.material.emissiveIntensity=night?2:1.2);},surfaceY(x){return .12-4.105*THREE.MathUtils.smoothstep(x,295,360);}};
}
