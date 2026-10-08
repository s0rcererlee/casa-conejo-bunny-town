import * as THREE from 'three';

// Translate the reference's colourful painted houses into the existing 3D village.
export function styleStorybookHouses(scene,loaded){
 const palette=[0xffd62b,0xef3154,0x2949c0,0x8bd66c,0xf79126,0x75cee7,0xf24b34,0x45b994];
 const ink=0x142839,wallMaterials=palette.map(color=>new THREE.MeshStandardMaterial({color,roughness:.83}));
 const dark=new THREE.MeshStandardMaterial({color:ink,roughness:.8});
 const trimMaterials=[0x65cddd,0xc69be3,0xffcf34,0xf1563a].map(color=>new THREE.MeshStandardMaterial({color,roughness:.72}));
 function roofTexture(index){
  const canvas=document.createElement('canvas');canvas.width=canvas.height=256;const c=canvas.getContext('2d');
  const colours=[['#ffc928','#c15335'],['#faf4d8','#182735'],['#ed4436','#2b79af'],['#ffc933','#f38326']][index];
  c.fillStyle=colours[0];c.fillRect(0,0,256,256);
  if(index===0){for(let x=-256;x<512;x+=72){c.fillStyle=colours[1];c.beginPath();c.moveTo(x,0);c.lineTo(x+35,0);c.lineTo(x+163,256);c.lineTo(x+128,256);c.closePath();c.fill();c.strokeStyle='#192a39';c.lineWidth=6;c.stroke();}}
  else for(let y=0;y<4;y++)for(let x=0;x<4;x++){c.fillStyle=colours[(x+y)%2];c.fillRect(x*64,y*64,64,64);c.strokeStyle='#192a39';c.lineWidth=5;c.strokeRect(x*64,y*64,64,64);}
  // Fine painted grain; deterministic and baked once, with no per-frame work.
  let seed=77;for(let i=0;i<3500;i++){seed=(seed*1664525+1013904223)>>>0;const x=seed%256;seed=(seed*1664525+1013904223)>>>0;const y=seed%256;c.fillStyle=i%2?'rgba(255,255,240,.065)':'rgba(22,33,44,.045)';c.fillRect(x,y,2,2);}
  const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.wrapS=texture.wrapT=THREE.RepeatWrapping;texture.anisotropy=4;
  return new THREE.MeshStandardMaterial({map:texture,roughness:.85});
 }
 const roofs=[0,1,2,3].map(roofTexture),houses=[],outlinePositions=[];let roofCount=0,trimCount=0;
 loaded.updateMatrixWorld(true);loaded.traverse(o=>{if(o.isMesh&&/^Casa/.test(o.name)){const box=new THREE.Box3().setFromObject(o);houses.push({object:o,center:box.getCenter(new THREE.Vector3()),box});}});
 houses.sort((a,b)=>a.center.z-b.center.z||a.center.x-b.center.x);houses.forEach((h,i)=>h.index=i);
 function nearest(o){const box=new THREE.Box3().setFromObject(o),p=box.getCenter(new THREE.Vector3());let best=null,d=Infinity;for(const h of houses){const v=(p.x-h.center.x)**2+(p.z-h.center.z)**2;if(v<d){d=v;best=h;}}return best;}
 function outline(o){const edges=new THREE.EdgesGeometry(o.geometry,35);edges.applyMatrix4(o.matrixWorld);const a=edges.attributes.position;for(let i=0;i<a.count;i++)outlinePositions.push(a.getX(i),a.getY(i),a.getZ(i));edges.dispose();}
 loaded.traverse(o=>{
  if(!o.isMesh||!o.visible)return;
  if(!/^(Casa|Plaster_gable|Sloping_tiled_roof|Individual_roof_tile|Arched_doorway|Arch_stone|Window_recess|Window_sill|Painted_shutter|Balcony_rail|Balcony_handrail)/.test(o.name))return;
  const h=nearest(o);if(!h)return;const index=h.index;
  if(/^(Casa|Plaster_gable)/.test(o.name)){o.material=wallMaterials[index%palette.length];outline(o);}
  else if(/^Sloping_tiled_roof/.test(o.name)){const g=o.geometry.clone(),positions=g.attributes.position,uv=new Float32Array(positions.count*2),v=new THREE.Vector3();for(let k=0;k<positions.count;k++){v.fromBufferAttribute(positions,k).applyMatrix4(o.matrixWorld);uv[k*2]=(v.x-h.center.x)/4;uv[k*2+1]=(v.z-h.center.z)/4;}g.setAttribute('uv',new THREE.BufferAttribute(uv,2));o.geometry=g;o.material=roofs[index%4];outline(o);roofCount++;}
  else if(/^Individual_roof_tile/.test(o.name)){o.visible=false;}
  else if(/^Window_recess/.test(o.name)){o.material.color.setHex(0x244b8b);outline(o);}
  else if(/^Arched_doorway/.test(o.name)){o.material=trimMaterials[(index+1)%4];outline(o);trimCount++;}
  else if(/^Painted_shutter/.test(o.name)){o.material=trimMaterials[index%4];outline(o);trimCount++;}
  else{o.material=dark;}
 });
 const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.Float32BufferAttribute(outlinePositions,3));
 const outlines=new THREE.LineSegments(geometry,new THREE.LineBasicMaterial({color:ink,transparent:true,opacity:.8}));outlines.name='Hand-drawn house outlines';scene.add(outlines);
 return {houses:houses.length,roofs:roofCount,trims:trimCount,outlines};
}
