import * as THREE from 'three';
export function createMountains(scene){
 const group=new THREE.Group();group.name='Mountains surrounding Casa Conejo';scene.add(group);const bands=[];const foothills=new THREE.Mesh(new THREE.CircleGeometry(350,128),new THREE.MeshStandardMaterial({color:0x96a581,roughness:1}));foothills.rotation.x=-Math.PI/2;foothills.position.set(0,-.8,30);group.add(foothills);
 for(let layer=0;layer<3;layer++){
 const positions=[],colors=[],indices=[],slices=200,rows=20;
 for(let r=0;r<=rows;r++){const t=r/rows;for(let j=0;j<=slices;j++){const a=j/slices*Math.PI*2,radial=layer*34+t*62,rx=134+radial,rz=143+radial;const ridges=.55+.22*Math.sin(a*7+layer)+.14*Math.sin(a*13-1.3)+.09*Math.cos(a*23+layer*.9);const envelope=Math.sin(Math.PI*t)**.85;const h=envelope*(35+layer*17+65*ridges)*(1+.09*Math.sin(t*22+a*9));positions.push(Math.cos(a)*rx,h-.7,30+Math.sin(a)*rz+120*Math.max(0,Math.sin(a))**4);colors.push(1,1,1);}}
 for(let r=0;r<rows;r++)for(let j=0;j<slices;j++){const k=r*(slices+1)+j;indices.push(k,k+slices+1,k+1,k+1,k+slices+1,k+slices+2);}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(positions,3));geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geo.setIndex(indices);geo.computeVertexNormals();const mesh=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({vertexColors:true,roughness:1,side:THREE.DoubleSide}));mesh.name='Mountain ridge '+layer;group.add(mesh);bands.push(mesh);
 }
 let previous='';function update(season){if(season===previous)return;previous=season;for(let layer=0;layer<bands.length;layer++){const geo=bands[layer].geometry,p=geo.attributes.position,c=geo.attributes.color;for(let i=0;i<p.count;i++){const h=p.getY(i),x=p.getX(i),z=p.getZ(i);const foothill=new THREE.Color(season==='autumn'?0x9b9167:season==='winter'?0x93978a:0x7d916f),rock=new THREE.Color(0xad9980),far=new THREE.Color(0x889cab);const color=foothill.lerp(rock,THREE.MathUtils.smoothstep(h,15,54));color.lerp(far,layer*.24);const snow=THREE.MathUtils.smoothstep(h+(Math.sin(x*.21)+Math.cos(z*.17))*2,season==='winter'?3:110,season==='winter'?16:130);color.lerp(new THREE.Color(0xe4e8df),snow);c.setXYZ(i,color.r,color.g,color.b);}c.needsUpdate=true;}}
 update('spring');return {group,bands,update};
}
