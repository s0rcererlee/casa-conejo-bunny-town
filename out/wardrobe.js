import * as THREE from 'three';
export function createWardrobe(scene,bunny){
 const looks=[['陶土红 · 波点公主裙',0xb96356,0xffebd0],['海湾蓝 · 陶瓷公主裙',0x608d9e,0xf3dfae],['奶油黄 · 春日公主裙',0xd6bd78,0xfff0d9],['玫瑰粉 · 荷叶公主裙',0xc49a9d,0xffebdf],['橄榄绿 · 庭院公主裙',0x899776,0xeaddab],['丁香紫 · 夜色公主裙',0xa49ab2,0xffe6d6]];
 const mat=c=>new THREE.MeshStandardMaterial({color:c,roughness:.9});
 function dress(index){const [,color,trim]=looks[index],g=new THREE.Group(),fabric=mat(color),lace=mat(trim);const verts=[],indices=[],rows=24,segments=72;
 // Open waist with a soft bell silhouette, sculpted scalloped hem and layered ruffles.
 for(let i=0;i<=rows;i++){const t=i/rows,y=.33-.26*t;for(let j=0;j<=segments;j++){const a=j/segments*Math.PI*2,r=.24+.13*Math.sin(t*Math.PI/2)+Math.sin(a*12)*.009*t;verts.push(r*Math.cos(a),y+Math.sin(a*10)*.006*t,(r*.85)*Math.sin(a)+.035);}}
 for(let i=0;i<rows;i++)for(let j=0;j<segments;j++){const k=i*(segments+1)+j;indices.push(k,k+1,k+segments+1,k+1,k+segments+2,k+segments+1);}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));geo.setIndex(indices);geo.computeVertexNormals();fabric.side=THREE.DoubleSide;g.add(new THREE.Mesh(geo,fabric));
 for(const [y,r] of [[.078,.388],[.145,.371],[.22,.338]]){const points=[];for(let j=0;j<=96;j++){const a=j/96*Math.PI*2;points.push(new THREE.Vector3((r+Math.sin(a*10)*.01)*Math.cos(a),y+.009*Math.sin(a*10),(r+Math.sin(a*10)*.01)*.85*Math.sin(a)+.035));}g.add(new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points,true),96,.007,6,true),lace));}
 // A translucent outer layer catches daylight over the fuller satin skirt.
 const tulle=new THREE.Mesh(geo.clone(),new THREE.MeshStandardMaterial({color:trim,transparent:true,opacity:.19,roughness:.8,side:THREE.DoubleSide,depthWrite:false}));tulle.scale.set(1.022,1,1.022);g.add(tulle);
 const pearlMat=new THREE.MeshStandardMaterial({color:0xffead7,roughness:.3});
 for(let j=0;j<24;j++){const a=j*Math.PI/12;const pearl=new THREE.Mesh(new THREE.SphereGeometry(.009,8,6),pearlMat);pearl.position.set(.376*Math.cos(a),.083+.009*Math.sin(a*10),.376*.85*Math.sin(a)+.035);g.add(pearl);}
 // A small ribbon bow at the waist, with two softly tapered hanging ends.
 for(const side of [-1,1]){const loop=new THREE.Mesh(new THREE.SphereGeometry(1,16,10),lace);loop.position.set(side*.043,.323,-.197);loop.scale.set(.046,.027,.013);loop.rotation.z=side*.35;g.add(loop);const tail=new THREE.Mesh(new THREE.ConeGeometry(.019,.078,4),lace);tail.position.set(side*.027,.277,-.211);tail.rotation.z=side*.3;g.add(tail);}
 const knot=new THREE.Mesh(new THREE.SphereGeometry(.018,12,8),pearlMat);knot.position.set(0,.324,-.216);g.add(knot);
 // Narrow fabric straps curve over the shoulders and join the waistband at the back.
 for(const side of [-1,1]){const path=new THREE.CatmullRomCurve3([new THREE.Vector3(side*.14,.33,-.173),new THREE.Vector3(side*.19,.395,-.157),new THREE.Vector3(side*.26,.422,-.045),new THREE.Vector3(side*.25,.413,.07),new THREE.Vector3(side*.18,.37,.18),new THREE.Vector3(side*.14,.33,.211)]);const strap=new THREE.Mesh(new THREE.TubeGeometry(path,32,.016,8,false),fabric);strap.name='Dress shoulder strap';g.add(strap);const button=new THREE.Mesh(new THREE.SphereGeometry(.013,10,8),lace);button.position.set(side*.14,.345,-.187);g.add(button);}
 const bibGeo=new THREE.SphereGeometry(1,24,12);const bib=new THREE.Mesh(bibGeo,fabric);bib.position.set(0,.351,-.182);bib.scale.set(.15,.051,.025);g.add(bib);
 const sash=new THREE.Mesh(new THREE.CylinderGeometry(.246,.252,.043,48,1,true),lace);sash.scale.z=.85;sash.position.set(0,.327,.035);g.add(sash);
 for(let row=0;row<3;row++)for(let j=0;j<16;j++){const a=j/16*Math.PI*2+(row%2?.12:0),r=.24+.13*Math.sin(((.33-(.275-row*.065))/.26)*Math.PI/2)+.004;const dot=new THREE.Mesh(new THREE.SphereGeometry(index%2?.009:.012,8,6),lace);dot.position.set(r*Math.cos(a),.275-row*.065,r*.85*Math.sin(a)+.035);dot.scale.set(1,1,.45);dot.rotation.y=-a+Math.PI/2;g.add(dot);if(index%3!==0&&row===1&&j%4===0){for(let k=0;k<5;k++){const q=k*Math.PI*2/5;const petal=new THREE.Mesh(new THREE.SphereGeometry(.008,6,4),lace);petal.position.copy(dot.position);petal.position.x+=Math.sin(a)*Math.cos(q)*.017;petal.position.z-=Math.cos(a)*Math.cos(q)*.017;petal.position.y+=Math.sin(q)*.017;g.add(petal);}}}
 g.traverse(o=>{if(o.isMesh)o.castShadow=true;});return g;}
 const worn=dress(0);worn.name='Xiaobai Spanish dress';bunny.model.add(worn);let current=0;
 function change(index){if(bunny.bathing)return bunny.outfit;current=(index+looks.length)%looks.length;const fresh=dress(current);for(const o of [...worn.children]){worn.remove(o);o.traverse(m=>{if(m.geometry)m.geometry.dispose();if(m.material)m.material.dispose();});}while(fresh.children.length)worn.add(fresh.children[0]);bunny.outfit=looks[current][0];return bunny.outfit;}
 const cabinet=new THREE.Group();cabinet.position.set(-26.7,0,2);cabinet.rotation.y=Math.PI;cabinet.name='Xiaobai wardrobe';scene.add(cabinet);
 const wood=mat(0xa96e50),cream=mat(0xf2dec0),dark=mat(0x795740),gold=mat(0xc6a266);
 function box(p,s,m){const o=new THREE.Mesh(new THREE.BoxGeometry(...s),m);o.position.set(...p);o.castShadow=true;o.receiveShadow=true;cabinet.add(o);return o;}
 box([0,.13,0],[2.05,.2,.9],wood);box([0,2.4,0],[2.12,.16,1],wood);box([0,1.3,-.42],[1.95,2.2,.1],dark);for(const x of [-.98,.98])box([x,1.28,0],[.12,2.2,.9],wood);
 box([0,.6,0],[1.92,.09,.85],cream);box([0,.35,.43],[1.83,.3,.07],cream);for(const x of [-.5,.5])box([x,.35,.48],[.13,.035,.06],gold);
 // Doors sit open at the sides so the colorful collection is visible.
 for(const side of [-1,1]){const door=box([side*1.17,1.52,.57],[.09,1.68,.77],cream);door.rotation.y=side*.35;}
 const rail=new THREE.Mesh(new THREE.CylinderGeometry(.024,.024,1.78,12),gold);rail.rotation.z=Math.PI/2;rail.position.set(0,2.15,.02);cabinet.add(rail);
 for(let i=0;i<6;i++){const x=-.74+i*.295;const hanger=new THREE.Mesh(new THREE.TorusGeometry(.08,.008,6,20),gold);hanger.position.set(x,2.06,.02);cabinet.add(hanger);const outfit=dress(i);outfit.scale.setScalar(.44);outfit.position.set(x,1.52,.05);cabinet.add(outfit);box([x,1.8,.05],[.16,.25,.025],mat(looks[i][1]));}
 // Small ceramic floral medallion over the cupboard.
 for(let i=0;i<5;i++){const a=i*Math.PI*2/5;const petal=new THREE.Mesh(new THREE.SphereGeometry(.065,10,8),mat(0xd68996));petal.position.set(Math.cos(a)*.075,2.43+Math.sin(a)*.075,.53);petal.scale.z=.25;cabinet.add(petal);}
 let previousHour=10,changedToday=true;change(0);
 return {cabinet,worn,looks,change,get current(){return current},update(hour,time){if(hour<previousHour-12)changedToday=false;if(!changedToday&&hour>=7&&hour<12){change(current+1);changedToday=true;}previousHour=hour;worn.visible=bunny.bathing||bunny.state!=='sleep';if(!bunny.bathing)worn.rotation.y=Math.sin(time*3)*.022;}};
}
