import {dressBambooGrove} from './bamboo-dressing.js';
import * as THREE from 'three';

export function createBambooGrove(scene){
  const group=new THREE.Group();group.name='千年古树 · 熊猫竹林';group.position.set(-80,12,-12);group.rotation.y=Math.PI;scene.add(group);
  const mat=c=>new THREE.MeshStandardMaterial({color:c,roughness:.92});
  const jade=mat(0x507d42),leaf=mat(0x44763c),joint=mat(0x94ad67),wood=mat(0xa6855c),bark=mat(0x68513b),white=mat(0xf5efdf),black=mat(0x282a2b);
  const V=(x,y,z)=>new THREE.Vector3(x,y,z);
  function egg(parent,m,p,s){const o=new THREE.Mesh(new THREE.SphereGeometry(1,12,8),m);o.position.set(...p);o.scale.set(...s);parent.add(o);return o;}
  function beam(parent,a,b,r,m){const delta=b.clone().sub(a),o=new THREE.Mesh(new THREE.CylinderGeometry(r*.8,r,delta.length(),9),m);o.position.copy(a).add(b).multiplyScalar(.5);o.quaternion.setFromUnitVectors(V(0,1,0),delta.normalize());parent.add(o);return o;}
  // Raised continuation of Ronda's northern cliff, supporting the entire grove.
  const cliff=new THREE.Mesh(new THREE.BoxGeometry(37,12,45),mat(0x987b59));cliff.position.y=-6;group.add(cliff);

  const ground=new THREE.Mesh(new THREE.BoxGeometry(36,.24,44),mat(0x78875c));ground.position.y=-.04;group.add(ground);
  let seed=823;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
  const pathX=z=>Math.sin(z*.14)*3;
  const sites=[];
  for(let i=0;i<1200&&sites.length<520;i++){
    const x=(rand()-.5)*34,z=(rand()-.5)*42;
    if(Math.abs(x-pathX(z))<2.3||Math.hypot(x+8,z-6)<5||Math.hypot(x-8,z+7)<4)continue;
    const h=12+rand()*15,angle=rand()*Math.PI*2;
    sites.push({x,z,h,angle,bend:(3+rand()*4.2)*(h/22),thickness:.085+rand()*.055});
  }
  const segments=10;
  const stems=new THREE.InstancedMesh(new THREE.CylinderGeometry(.94,1,1,6),jade,sites.length*segments);
  const rings=new THREE.InstancedMesh(new THREE.CylinderGeometry(1,1,.055,6),joint,sites.length*9);
  // Narrow lanceolate bamboo leaves, folded along the midrib.
  const leafGeometry=new THREE.BufferGeometry();
  leafGeometry.setAttribute('position',new THREE.Float32BufferAttribute([0,0,0,.24,.025,.045,.52,0,0,.24,.025,-.045],3));
  leafGeometry.setIndex([0,1,2,0,2,3]);leafGeometry.computeVertexNormals();leaf.side=THREE.DoubleSide;
  const leaves=new THREE.InstancedMesh(leafGeometry,leaf,sites.length*48);
  const twigs=new THREE.InstancedMesh(new THREE.CylinderGeometry(.009,.018,1,5),jade,sites.length*6);
  const up=new THREE.Vector3(0,1,0);
  const dummy=new THREE.Object3D();
  function culm(site,t){
    // Cantilever-inspired rest shape: lean begins at the base and increases under the crown weight.
    const load=.3*t+.7*t*t,offset=site.bend*load;
    return V(site.x+Math.cos(site.angle)*offset,site.h*t-site.bend*.28*t*t*t,site.z+Math.sin(site.angle)*offset);
  }
  sites.forEach((site,i)=>{
    const {x,z,h,thickness}=site;
    for(let j=0;j<segments;j++){
      const a=culm(site,j/segments),b=culm(site,(j+1)/segments),d=b.clone().sub(a),radius=thickness*(1-.38*j/segments);
      dummy.position.copy(a).add(b).multiplyScalar(.5);dummy.quaternion.setFromUnitVectors(up,d.clone().normalize());dummy.scale.set(radius,d.length()+.012,radius);dummy.updateMatrix();stems.setMatrixAt(i*segments+j,dummy.matrix);
    }
    for(let j=0;j<9;j++){
      const t=(j+1)/10,d=culm(site,t+.001).sub(culm(site,t-.001)).normalize(),radius=thickness*(1-.38*t)*1.13;
      dummy.position.copy(culm(site,t));dummy.quaternion.setFromUnitVectors(up,d);dummy.scale.set(radius,1,radius);dummy.updateMatrix();rings.setMatrixAt(i*9+j,dummy.matrix);
    }
    for(let j=0;j<6;j++){
      const a=j*2.4+i,origin=culm(site,.58+j*.065),tip=origin.clone().add(V(Math.cos(a)*1.05,-.12-j*.025,Math.sin(a)*1.05));
      const direction=tip.clone().sub(origin);dummy.position.copy(origin).add(tip).multiplyScalar(.5);dummy.quaternion.setFromUnitVectors(up,direction.clone().normalize());dummy.scale.set(1,direction.length(),1);dummy.updateMatrix();twigs.setMatrixAt(i*6+j,dummy.matrix);
      for(let k=0;k<8;k++){
        const side=k%2?1:-1,f=.22+Math.floor(k/2)*.21;
        dummy.position.copy(origin).lerp(tip,f);dummy.rotation.set(side*.12,-a+side*.7,-.18-rand()*.22);const size=.7+rand()*.5;dummy.scale.set(size,1,size);dummy.updateMatrix();leaves.setMatrixAt(i*48+j*8+k,dummy.matrix);
      }
    }
  });
  for(const o of [stems,rings,twigs,leaves]){o.instanceMatrix.needsUpdate=true;o.computeBoundingSphere();group.add(o);}
  // The continuous bridge and woodland deck are built together by panda-trail.js.
  // Ancient trees: massive tapering trunks, exposed buttress roots and spreading boughs.
  for(const [x,z,s] of [[-8,6,1],[8,-7,.8]]){
    beam(group,V(x,.1,z),V(x+.8,27*s,z),1.75*s,bark);
    for(let j=0;j<7;j++){const a=j*Math.PI*2/7;beam(group,V(x,.9,z),V(x+Math.cos(a)*3*s,.15,z+Math.sin(a)*3*s),.35*s,bark);beam(group,V(x,17*s,z),V(x+Math.cos(a)*7*s,29*s,z+Math.sin(a)*7*s),.65*s,bark);egg(group,leaf,[x+Math.cos(a)*5.5*s,30*s,z+Math.sin(a)*5.5*s],[5*s,4*s,4.6*s]);}
    // Amber scar gives the old trunk a distinct weathered hollow.
    egg(group,black,[x,2.2*s,z-1.25*s],[.5*s,.95*s,.08]);
  }
  const dressing=dressBambooGrove(group,pathX);
  const personalities=[
    {name:'团团',size:1.22,speed:.65,eat:17,climb:.16,description:'圆滚滚的大熊猫，慢吞吞，抱着竹子吃得忘神'},
    {name:'青青',size:.96,speed:.85,eat:10,climb:.62,description:'爱爬树，爬上树会歪头发呆'},
    {name:'笋笋',size:.64,speed:1.05,eat:7,climb:.28,description:'大耳朵幼崽，摇摇晃晃地好奇张望'}
  ];
  const trees=[{x:-8,z:6,r:1.75,height:7.8},{x:8,z:-7,r:1.4,height:6.4}];
  function limb(parent,x,y,z){const shoulder=new THREE.Group();shoulder.position.set(x,y,z);parent.add(shoulder);egg(shoulder,black,[0,-.17,0],[.16,.24,.16]);const elbow=new THREE.Group();elbow.position.y=-.32;shoulder.add(elbow);egg(elbow,black,[0,-.13,-.025],[.17,.21,.18]);const paw=egg(elbow,black,[0,-.29,-.07],[.18,.1,.2]);return {shoulder,elbow,paw};}
  const pandas=personalities.map((personality,i)=>{
    const root=new THREE.Group();root.name=personality.name+' · '+personality.description;root.scale.setScalar(personality.size);group.add(root);
    const torso=new THREE.Group();root.add(torso);egg(torso,white,[0,0,0],[i===0?.54:.45,.59,.41]);egg(torso,black,[0,.3,0],[.47,.2,.4]);egg(torso,white,[0,-.25,.4],[.12,.12,.12]);
    const head=new THREE.Group();root.add(head);const eyes=[];egg(head,white,[0,0,0],[i===2?.49:.46,.42,.38]);
    for(const side of [-1,1]){egg(head,black,[side*.32,.3,0],[i===2?.17:.14,.16,.13]);const patch=egg(head,black,[side*.17,.035,-.32],[.1,.14,.065]);patch.rotation.z=side*(i===1?.5:.3);eyes.push(egg(head,white,[side*.17,.065,-.379],[.035,.039,.014]));eyes.push(egg(head,black,[side*.17,.063,-.39],[.018,.024,.01]));egg(head,white,[side*.25,-.14,-.27],[.15,.13,.12]);}
    const muzzle=egg(head,white,[0,-.12,-.35],[.19,.14,.12]);egg(head,black,[0,-.07,-.46],[.067,.043,.028]);
    const legs=[-1,1].map(s=>limb(root,s*.29,.65,.4)),arms=[-1,1].map(s=>limb(root,s*.36,.7,-.4));
    const snack=new THREE.Group();arms[0].elbow.add(snack);beam(snack,V(0,-.28,-.35),V(0,-.28,.55),.038,jade);egg(snack,leaf,[0,-.28,.4],[.3,.055,.09]);
    const p={...personality,root,torso,head,muzzle,eyes,legs,arms,snack,state:'sniff',timer:1+i*2,path:[],target:null,tree:null,height:0,clock:i*1.3,history:new Set(['sniff'])};
    root.position.set([-5.5,5.5,-4.5][i],.12,[2,-5,10][i]);return p;
  });
  // Small per-animal navigation grids avoid bamboo trunks, ancient trees and railings.
  const step=.6,nx=57,nz=71;
  function point(id){return V(-16.8+(id%nx)*step,.12,-21+Math.floor(id/nx)*step);}
  function blockedAt(x,z,r){
    if(dressing.stoneSites.some(t=>Math.hypot(x-t.x,z-t.z)<t.r+r))return true;
    if(trees.some(t=>Math.hypot(x-t.x,z-t.z)<t.r+r))return true;
    if(sites.some(t=>Math.hypot(x-t.x,z-t.z)<.12+r))return true;
    const beside=Math.abs(x-pathX(z));
    return Math.abs(beside-1.3)<r+.07&&!(z>-2&&z<3||z>9&&z<14);
  }
  pandas.forEach(p=>{p.open=new Uint8Array(nx*nz);for(let id=0;id<p.open.length;id++){const q=point(id);p.open[id]=!blockedAt(q.x,q.z,.34*p.size);}});
  function nearest(p,pos){let best=-1,d=Infinity;for(let id=0;id<p.open.length;id++)if(p.open[id]){const q=point(id),dd=(q.x-pos.x)**2+(q.z-pos.z)**2;if(dd<d){d=dd;best=id;}}return best;}
  function route(p,target){
    const start=nearest(p,p.root.position),end=nearest(p,target);if(start<0||end<0)return [];
    const prev=new Int32Array(nx*nz);prev.fill(-2);prev[start]=-1;const queue=[start];
    for(let k=0;k<queue.length&&prev[end]===-2;k++){const id=queue[k],x=id%nx,z=Math.floor(id/nx);for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const xx=x+dx,zz=z+dz,next=zz*nx+xx;if(xx<0||xx>=nx||zz<0||zz>=nz||!p.open[next]||prev[next]!==-2)continue;prev[next]=id;queue.push(next);}}
    if(prev[end]===-2)return [];const path=[];for(let id=end;id!==-1;id=prev[id])path.push(point(id));return path.reverse();
  }
  function state(p,value,timer=0){p.state=value;p.timer=timer;p.history.add(value);}
  function choose(p){
    p.tree=rand()<p.climb?trees[Math.floor(rand()*trees.length)]:null;
    for(let tries=0;tries<15;tries++){
      const target=p.tree?V(p.tree.x,.12,p.tree.z-p.tree.r-.55*p.size):V((rand()-.5)*31,.12,(rand()-.5)*38);
      const path=route(p,target);if(path.length){p.path=path;p.target=path[path.length-1].clone();state(p,'walk');return;}
      p.tree=null;
    }
    state(p,'sniff',3);
  }
  let lastTime=0;
  function update(t){const dt=Math.max(0,Math.min(t-lastTime,.1));lastTime=t;
    pandas.forEach(p=>{
      p.clock+=dt;p.timer-=dt;
      if(p.state==='walk'){
        let remaining=dt*p.speed;
        while(remaining>0&&p.path.length){const next=p.path[0],dx=next.x-p.root.position.x,dz=next.z-p.root.position.z,d=Math.hypot(dx,dz);if(d<.015){p.path.shift();continue;}const amount=Math.min(d,remaining);p.root.position.x+=dx/d*amount;p.root.position.z+=dz/d*amount;const desired=Math.atan2(-dx,-dz);p.root.rotation.y+=Math.atan2(Math.sin(desired-p.root.rotation.y),Math.cos(desired-p.root.rotation.y))*Math.min(1,dt*7);remaining-=amount;if(amount===d)p.path.shift();}
        if(!p.path.length)state(p,p.tree?'climb':'sniff',p.tree?0:2+rand()*3);
      }else if(p.state==='climb'){
        p.height=Math.min(p.tree.height*p.size,p.height+dt*.45);p.root.rotation.y=Math.PI;
        if(p.height>=p.tree.height*p.size)state(p,'perch',5+rand()*5);
      }else if(p.state==='perch'){if(p.timer<=0)state(p,'descend');}
      else if(p.state==='descend'){p.height=Math.max(0,p.height-dt*.38);if(p.height===0){p.tree=null;state(p,'eat',p.eat);}}
      else if(p.timer<=0){if(p.state==='sniff')state(p,'eat',p.eat);else choose(p);}
      const climbing=['climb','perch','descend'].includes(p.state),walking=p.state==='walk',eating=p.state==='eat';
      p.root.position.y=(Math.abs(p.root.position.x-pathX(p.root.position.z))<1.4?.43:.12)+p.height;
      p.torso.position.set(0,walking?.78:.69,0);p.torso.rotation.x=walking?-Math.PI/2:climbing?-.18:.12;p.torso.rotation.z=walking?Math.sin(p.clock*3.4)*.065:Math.sin(p.clock*1.3)*.025;
      p.head.position.set(0,walking?1.0:1.4,walking?-.64:-.1);p.head.rotation.set(eating?Math.sin(p.clock*3)*.06:walking?.13:0,Math.sin(p.clock*.8)*.12,(p.state==='sniff'||p.state==='perch')?Math.sin(p.clock*.8)*.2:Math.sin(p.clock*.65)*.07);
      const blinkPhase=(p.clock+p.size*2)%5.3;const blink=blinkPhase<.18?.15:1;p.eyes.forEach((e,i)=>e.scale.y=(i%2?.024:.039)*blink);
      p.snack.visible=eating;p.muzzle.scale.y=.14*(eating?1+Math.sin(p.clock*7)*.08:1);
      [...p.legs,...p.arms].forEach((l,k)=>{const arm=k>=2,side=k%2?1:-1;const wave=Math.sin(p.clock*(p.size<.8?5:3.4)+(k===0||k===3?0:Math.PI));
        l.shoulder.position.set(side*(arm?.36:.29),walking?.66:arm?1.0:.38,walking?(arm?-.45:.44):arm?-.12:.12);
        l.shoulder.rotation.set(walking?wave*.48:climbing?-2.35+(p.state==='perch'?0:wave*.3):arm&&eating?-1.0+Math.sin(p.clock*2)*.16:arm?.12:-1.05,0,arm&&!walking?side*.13:0);
        l.elbow.rotation.x=walking?Math.max(0,-wave)*.45:climbing?-.3:arm&&eating?-1.1:arm?-.1:.35;
      });
    });
  }
  update(0);return {group,pandas,dressing,updateLight:dressing.update,bambooCount:sites.length,bambooShape:{minHeight:Math.min(...sites.map(s=>s.h)),maxHeight:Math.max(...sites.map(s=>s.h)),maxBend:Math.max(...sites.map(s=>s.bend)),segments},update};
}
