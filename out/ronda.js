import * as THREE from 'three';
// A stylized Ronda district: raised plateaus keep the gorge above the existing terrain.
export function rondaHeight(x,z){if(x<=-68)return 8.1;if(x<=-56&&z>=47&&z<=53)return .1+8*(-56-x)/12;return .1;}
export function rondaBlocked(x,z,r){if(x>=-56)return false;const ramp=x>=-68&&z>47+r&&z<53-r;const east=x>-76+r&&x<-62-r&&z>19+r&&z<55-r;const west=x>-99+r&&x<-84-r&&z>19+r&&z<55-r;const bridge=x>-85&&x<-75&&z>28+r&&z<32-r;return !(ramp||east||west||bridge)||(x>-68&&!(z>47+r&&z<53-r));}
export function createRonda(scene,world){
 const group=new THREE.Group();group.name='Ronda · Puente Nuevo';scene.add(group);
 const material=(c)=>new THREE.MeshStandardMaterial({color:c,roughness:.92});const stone=material(0xc6a57c),lightStone=material(0xe0c49b),rock=material(0x987b59),white=material(0xf4e6d0),roof=material(0xb76845),iron=material(0x394b46),green=material(0x58764c),pink=material(0xc96986);
 const lamps=[];
 function box(x,y,z,w,h,d,m){const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);return mesh;}
 function sphere(x,y,z,s,m){const o=new THREE.Mesh(new THREE.IcosahedronGeometry(s,1),m);o.position.set(x,y,z);group.add(o);return o;}
 function collider(x,z,w,d){world.colliders.push([x,-z,w/2,d/2]);}
 // Two layered sandstone cliffs and a narrow blue-green river below.
 for(const [cx,w] of [[-91.5,15],[-69,14]]){if(cx<-80){box(cx,3.95,37,w,8,36,rock);box(cx,7.93,37,w,.14,36,lightStone);}else{for(const [xx,zz,ww,dd] of [[-69,33,14,28],[-69,54,14,2],[-72,50,8,6]]){box(xx,3.95,zz,ww,8,dd,rock);box(xx,7.93,zz,ww,.14,dd,lightStone);}}for(let i=0;i<8;i++){const edge=cx<-80?-84.1:-75.9;const o=box(edge+(i%2?.2:-.2),.5+i*.95,37,.55,.24,35.5,i%2?stone:rock);o.rotation.z=(i%3-1)*.03;}}
 box(-80,-.15,37,43,.3,43,green);
 const river=box(-80,.16,38,5,.12,45,new THREE.MeshStandardMaterial({color:0x418d8b,roughness:.22,metalness:.2}));
 for(let i=0;i<30;i++){const side=i%2?-75.7:-84.3;const o=sphere(side,.6+(i%7)*.95,20+(i*2.37)%34,.65+(i%3)*.17,i%4?rock:green);o.scale.set(.75,1.4,1.5);}
 // Bridge's tall central arch, solid piers, smaller side arches, and parapets.
 function arch(cx,base,r,spring,top,depth){const sh=new THREE.Shape();sh.moveTo(-r,base);sh.lineTo(-r,top);sh.lineTo(r,top);sh.lineTo(r,base);sh.lineTo(r,spring);for(let i=0;i<=32;i++){const a=i*Math.PI/32;sh.lineTo(r*Math.cos(a),spring+r*Math.sin(a));}sh.lineTo(-r,base);const mesh=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth,bevelEnabled:false,curveSegments:24}),stone);mesh.position.set(cx,0,30-depth/2);group.add(mesh);mesh.castShadow=true;mesh.receiveShadow=true;
 for(let i=0;i<17;i++){const a=(i+.5)*Math.PI/17;const o=box(cx+(r+.16)*Math.cos(a),spring+(r+.16)*Math.sin(a),27.91,.36,.3,.16,lightStone);o.rotation.z=a-Math.PI/2;}}
 arch(-80,.2,2.35,3.4,7.8,4);box(-83.35,3.95,30,2,7.9,4,stone);box(-76.65,3.95,30,2,7.9,4,stone);
 arch(-86.3,6.15,1.05,6.2,7.8,4);arch(-73.7,6.15,1.05,6.2,7.8,4);
 box(-80,7.94,30,16,.12,4,lightStone);for(const z of [27.95,32.05]){const sections=z===27.95?[[-85,6],[-75,6]]:[[-80,16]];for(const [x,w] of sections){box(x,8.5,z,w,1,.22,stone);box(x,9.02,z,w,.13,.34,lightStone);}}
 for(const x of [-83.35,-76.65]){box(x,5.8,27.93,.75,1.2,.08,iron);for(let y=.7;y<7.9;y+=.58)box(x,y,27.94,1.95,.025,.06,lightStone);}
 // A continuous approach ramp joins the old town, with matching sloped rails.
 const ramp=box(-62,4,50,Math.hypot(12,8),.15,6,lightStone);ramp.rotation.z=-Math.atan2(8,12);
 for(const z of [47,53]){const rail=box(-62,4.5,z,Math.hypot(12,8),.65,.22,stone);rail.rotation.z=-Math.atan2(8,12);}
 function house(x,z,w,d,h){box(x,8+h/2,z,w,h,d,white);collider(x,z,w,d);const cap=box(x,8+h+.16,z,w+.35,.3,d+.4,roof);for(const side of [-1,1]){const rr=box(x+side*w*.25,8+h+.45,z,w*.56,.13,d+.5,roof);rr.rotation.z=-side*.23;}
 for(let ix=-1;ix<=1;ix++)for(let iy=0;iy<2;iy++){const xx=x+ix*w*.26,yy=8.8+iy*1.3;box(xx,yy,z-d/2-.02,.48,.65,.06,iron);box(xx,yy-.37,z-d/2-.13,.7,.12,.28,roof);sphere(xx,yy-.24,z-d/2-.21,.19,pink);}
 box(x,8.65,z-d/2-.06,.7,1.3,.09,roof);box(x+w*.27,8+h+.6,z+.3,.38,.9,.4,white);}
 for(const p of [[-94,24,5,5,4.5],[-88,22,4,4,3.5],[-94,38,5,5,4],[-94,48,5,5,3.4],[-70,23,5,4,4.2],[-70,38,4,5,3.6],[-71,44,5,4,4.5]])house(...p);
 // Small chapel and tiled bell tower on the western plaza.
 house(-88,49,4,5,4.3);box(-85.8,11.4,49,1.2,6.8,1.3,lightStone);box(-85.8,13.8,48.32,.6,.9,.06,iron);box(-85.8,14.9,49,1.5,.28,1.6,roof);box(-85.8,15.55,49,.12,1.1,.12,iron);box(-85.8,15.75,49,.65,.12,.12,iron);collider(-85.8,49,1.2,1.3);
 for(const x of [-98,-84.2,-75.8,-62.2])for(let z=20;z<55;z+=1){if(z>27&&z<33||x===-62.2&&z>46)continue;box(x,8.43,z,.12,.85,.12,iron);}for(const [x,z] of [[-87,34],[-73,34],[-88,42],[-73,52]]){box(x,8.4,z,1.5,.17,.5,roof);box(x-.5,8.2,z,.12,.4,.4,iron);box(x+.5,8.2,z,.12,.4,.4,iron);collider(x,z,1.5,.5);}
 for(const [x,z] of [[-87,27],[-73,27],[-88,35],[-73,53]]){box(x,9.35,z,.12,2.7,.12,iron);const bulb=sphere(x,10.8,z,.22,new THREE.MeshStandardMaterial({color:0xffd28c,emissive:0xffaa50,emissiveIntensity:0}));const l=new THREE.PointLight(0xffb668,0,12,2);l.position.set(x,10.6,z);group.add(l);lamps.push([bulb,l]);}
 world.landmarks.push({name:'龙达 · 新桥与悬崖白城',camera:[-81,4,16],look:[-80,-33,6],description:'龙达印象：新桥跨越塔霍峡谷，白墙红瓦沿崖而建。沿西侧坡道上桥，兔兔可以到桥头广场寻找胡萝卜。此处为风格化微缩景观。'});
 world.carrots.push([-88,-30],[-86,-36],[-73,-30],[-72,-52]);
 return {group,update(day){for(const [b,l] of lamps){l.intensity=(1-day)*16;b.material.emissiveIntensity=(1-day)*2;}river.material.color.setHSL(.49,.35,.32+day*.12);}};
}
