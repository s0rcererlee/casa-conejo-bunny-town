import * as THREE from 'three';
import {createFamilyMeals} from './family-meals.js';
import {createSeaCave} from './sea-cave.js';

export function createIslandLife(scene,rabbits,{pathfind,blocked,groundHeight,view,mountains}) {
 const cave=createSeaCave(scene,mountains);
 const [mother,child,father]=rabbits,root=new THREE.Group();root.name='Family island life';scene.add(root);
 const material=c=>new THREE.MeshStandardMaterial({color:c,roughness:.8});
 const wood=material(0xb5865d),cream=material(0xf2dbaf),green=material(0x709955),red=material(0xdc6471),blue=material(0x73bbc5);
 function box(parent,x,y,z,w,h,d,m){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);parent.add(o);o.castShadow=true;return o;}
 function sphere(parent,x,y,z,r,m){const o=new THREE.Mesh(new THREE.SphereGeometry(r,12,8),m);o.position.set(x,y,z);parent.add(o);return o;}
 // All existing mountain districts sit on one bounded island, with open sea beyond it.
 const ocean=new THREE.Mesh(new THREE.PlaneGeometry(3000,3000),material(0x357f9b));ocean.rotation.x=-Math.PI/2;ocean.position.set(0,-4,70);root.add(ocean);
 for(const [rx,rz,y,color] of [[343,510,-3,0xe2ce9b],[331,497,-2,0x91a575]]){const land=new THREE.Mesh(new THREE.CircleGeometry(1,160),material(color));land.rotation.x=-Math.PI/2;land.scale.set(rx,rz,1);land.position.set(0,y,70);root.add(land);cave.carveGround(land);}
 const foam=[];for(let i=0;i<100;i++){const a=i/100*Math.PI*2;const f=box(root,347*Math.cos(a),-3.8,70+514*Math.sin(a),5,.04,1,cream);f.rotation.y=-a;foam.push(f);}
 const bath=new THREE.Group();bath.position.set(-24,.1,8);root.add(bath);
 const tub=new THREE.Mesh(new THREE.CylinderGeometry(1, .8,.55,24,1,true),cream);tub.position.y=.25;bath.add(tub);
 const water=new THREE.Mesh(new THREE.CircleGeometry(.92,24),blue);water.rotation.x=-Math.PI/2;water.position.y=.36;bath.add(water);
 box(bath,1.5,.2,0,.7,.4,.6,wood);box(bath,1.5,.44,0,.55,.08,.45,cream);
 const bubbles=[];const bubbleMat=new THREE.MeshStandardMaterial({color:0xe5f8ff,transparent:true,opacity:.6,roughness:.2});for(let i=0;i<14;i++){const b=sphere(root,0,0,0,.06+(i%3)*.025,bubbleMat);b.visible=false;bubbles.push(b);}
 const brush=box(root,0,0,0,.16,.12,.35,wood);brush.visible=false;
 const dress=mother.model.getObjectByName('Xiaobai Spanish dress');
 const sponge=sphere(root,0,0,0,.13,material(0xf2d5a0));sponge.scale.set(1,.6,1);sponge.visible=false;
 const helpingPaw=sphere(root,0,0,0,.075,material(0xf4eadc));helpingPaw.visible=false;
 function holdDress(){if(!dress)return;mother.bathing=true;father.root.add(dress);dress.position.set(-.32,.22,-.28);dress.scale.set(.8,.85,.38);dress.rotation.set(.12,0,-.25);dress.visible=true;}
 function wearDress(){mother.bathing=false;if(dress){mother.model.add(dress);dress.position.set(0,0,0);dress.scale.set(1,1,1);dress.rotation.set(0,0,0);dress.visible=mother.state!=='sleep';}sponge.visible=false;helpingPaw.visible=false;}

 const heartShape=new THREE.Shape();heartShape.moveTo(0,-.5);heartShape.bezierCurveTo(-.7,0,-.5,.7,0,.3);heartShape.bezierCurveTo(.5,.7,.7,0,0,-.5);
 const heart=new THREE.Mesh(new THREE.ShapeGeometry(heartShape),new THREE.MeshBasicMaterial({color:0xed86ab,side:THREE.DoubleSide}));heart.visible=false;root.add(heart);
 const crops=[];for(let row=0;row<3;row++){box(root,-35,.18,12+row*1.1,4,.2,.8,material(0x806249));for(let j=0;j<7;j++){const plant=new THREE.Group();plant.position.set(-36.5+j*.5,.3,12+row*1.1);root.add(plant);for(let k=0;k<3;k++){const leaf=sphere(plant,Math.cos(k*2.1)*.1,.1,Math.sin(k*2.1)*.1,.13,green);leaf.scale.y=.4;}const fruit=sphere(plant,0,.14,0,.1,row===0?red:material(0xef9a46));crops.push({plant,fruit});}}
 const workshop=new THREE.Group();workshop.position.set(-38,.1,20);root.add(workshop);box(workshop,0,.3,0,3,.6,2,cream);
 const stages=[];for(const x of [-1.2,1.2])for(const z of [-.8,.8])stages.push(box(workshop,x,1.3,z,.15,2,.15,wood));stages.push(box(workshop,0,2.4,0,3.2,.2,2.4,red));stages.forEach(o=>o.visible=false);
 box(root,-40,.5,30,3,1,1,wood);box(root,-40,2.1,30,3.4,.16,2,red);for(const x of [-41.4,-38.6])box(root,x,1,30,.1,2,.1,wood);for(let i=0;i<5;i++)sphere(root,-41+i*.5,1.15,30,.16,i%2?red:green);
 box(root,54,.13,-5,19,.25,3,wood);for(let i=0;i<7;i++)for(const z of [-6.3,-3.7])box(root,46+i*2.5,-.3,z,.16,1.3,.16,wood);
 const ship=new THREE.Group();root.add(ship);box(ship,0,.7,0,6,1.2,2.7,wood);box(ship,0,1.4,0,5.6,.18,2.6,cream);box(ship,0,3,0,.15,3.4,.15,wood);box(ship,.9,3,0,1.7,2.2,.06,cream);for(let i=0;i<3;i++)box(ship,-1.6+i*1.2,1.85,0,.9,.75,1, i%2?blue:red);
 const state={coins:30,produce:0,materials:4,level:0,sold:0,cleanliness:70,day:0};
 try{const saved=JSON.parse(localStorage.getItem('bunny-island-economy-v1'));if(saved)for(const key of Object.keys(state))if(Number.isFinite(saved[key]))state[key]=Math.max(0,Math.min(100000,saved[key]));}catch{}
 state.level=Math.min(5,state.level);state.cleanliness=Math.min(100,state.cleanliness);
 const log=[];let clock=0,nextWork=7,nextBath=18,care=null,shipTime=0,tradeDone=false,lastHour=null,uiTime=0;
 const jobs=new Map();
 const meals=createFamilyMeals(scene,rabbits,{available,assign,jobs,release,note,groundHeight});
 const panel=document.createElement('details');panel.open=true;panel.innerHTML='<summary>海岛一家 · 生活与经营</summary><p data-economy></p><p data-ship></p><div class="row"><button data-bath>请爸爸洗澡梳毛</button><button data-farm>一起照料农场</button><button data-build>扩建商店</button><button data-view>看海岛全景</button><button data-port>看商船</button><button data-cave>看通海大山洞</button></div><p data-log style="font-size:11px;line-height:1.7"></p>';document.getElementById('panel').append(panel);
 function save(){const reserved=[...jobs.values()].filter(j=>j.refund).length;try{localStorage.setItem('bunny-island-economy-v1',JSON.stringify({...state,coins:state.coins+reserved*12,materials:state.materials+reserved*2}));}catch{}}
 function note(s){log.unshift(s);log.length=Math.min(log.length,4);render();}
 function render(){panel.querySelector('[data-economy]').textContent=`海岛贝币 ◉ ${state.coins} · 农产品 ${state.produce} · 木材 ${state.materials} · 商店 ${state.level} 级 · 小白清洁度 ${Math.round(state.cleanliness)}%`;panel.querySelector('[data-ship]').textContent=shipTime<35?'商船正在驶向码头':shipTime<65?'商船靠港交易中':'商船离港，下次带来木材';panel.querySelector('[data-log]').textContent=log.join(' · ');stages.forEach((o,i)=>o.visible=i<state.level);}
 function available(b){return !b.playerControlled&&!jobs.has(b)&&!b.ride&&!b.cycleTrip&&!['sleep','travel','paint','garden-plant','garden-water','garden-harvest'].includes(b.state);}
 function route(b,x,z){if(blocked(x,z,.38))return null;const p=new THREE.Vector3(x,groundHeight(x,z),z);if(b.root.position.distanceTo(p)<.4)return [];const path=pathfind(b.root.position,p);return path.length?path:null;}
 function assign(b,x,z,label,duration,done){const path=route(b,x,z);if(path===null)return false;jobs.set(b,{path,label,duration,done,age:0});b.path=[];b.target=null;b.waitingForPartner=false;return true;}
 function release(b){const j=jobs.get(b);if(j?.refund){state.coins+=12;state.materials+=2;save();}jobs.delete(b);b.state='search';b.timer=2;b.model.rotation.set(0,0,0);b.model.scale.set(1,1,1);b.vy=0;}
 function endCare(){if(!care)return;wearDress();release(mother);release(father);care=null;bubbles.forEach(b=>b.visible=false);brush.visible=false;heart.visible=false;nextBath=clock+90;}
 function startBath(){if(care||!available(mother)||!available(father)){note('等爸爸妈妈忙完或起床后，再一起洗澡。');return false;}
  const a=route(mother,-24,8),b=route(father,-25.3,8);if(a===null||b===null){note('浴室路线暂时走不通，稍后再试。');return false;}
  care={phase:'approach',age:0,total:0};assign(mother,-24,8,'请豆豆帮忙洗澡',Infinity,()=>{});assign(father,-25.3,8,'带着毛巾去照顾小白',Infinity,()=>{});note('小白：豆豆，帮我洗香香、梳梳毛好吗？');return true;
 }
 function farm(){let n=0;for(const [i,b] of rabbits.entries())if(available(b)&&assign(b,-35+i*.6,15.5,i===1?'帮忙浇水':'照料农田、收获农产品',7+i,()=>{state.produce+=i===1?1:4;note(b.name+(i===1?'浇好了小菜苗，收获 1 份农产品':'收获了 4 份农产品'));save();}))n++;if(!n)note('家人正在忙，稍后再去农场。');}
 function build(){if(state.level>=5){note('商店已建好，继续经营迎接客人。');return;}if(state.coins<12||state.materials<2){note('扩建需要 12 贝币和 2 份木材，等待商船交易补充。');return;}if(jobsHas('建造'))return;const worker=[father,mother].find(available);if(!worker||!assign(worker,-38,22,'建造商店',10,()=>{jobs.get(worker).refund=false;state.level++;note('商店完成一级扩建，售货收益提高了');save();})){note('建造工坊暂时无法开工。');return;}jobs.get(worker).refund=true;state.coins-=12;state.materials-=2;note(worker.name+'开始搭建商店，预留 12 贝币和 2 份木材');}
 function jobsHas(word){return [...jobs.values()].some(j=>j.label.includes(word));}
 function commerce(){if(!state.produce||jobsHas('摆货'))return;const b=[child,mother,father].find(available);if(b)assign(b,-40,31.5,'在商店整理摆货',5,()=>{if(state.produce){state.produce--;state.coins+=2+state.level;note(b.name+'卖出一份农产品，收到贝币');save();}});}
 function trade(){const quantity=Math.min(state.produce,12);if(quantity){state.produce-=quantity;state.coins+=quantity*4;state.sold+=quantity;}const buy=Math.min(4,Math.floor(state.coins/3));state.coins-=buy*3;state.materials+=buy;note(`商船靠港：出售 ${quantity} 份农产品，收入 ${quantity*4} 贝币；买入 ${buy} 份木材`);save();}
 panel.querySelector('[data-bath]').onclick=()=>{view([-21,5,14],[-24,.6,8]);startBath();};panel.querySelector('[data-farm]').onclick=()=>{view([-29,8,22],[-35,.3,14]);farm();};panel.querySelector('[data-build]').onclick=()=>{view([-32,7,26],[-38,1,20]);build();};
 panel.querySelector('[data-view]').onclick=()=>view([650,700,870],[0,0,70]);panel.querySelector('[data-port]').onclick=()=>view([78,17,18],[59,1,-5]);panel.querySelector('[data-cave]').onclick=()=>view([83,12,-5],[440,10,-5]);
 function update(dt,hour,manualRabbit){clock+=dt;shipTime=(shipTime+dt)%120;if(lastHour!==null&&lastHour>20&&hour<6){state.day++;save();}lastHour=hour;state.cleanliness=Math.max(0,state.cleanliness-dt*.07);
  ship.position.set(shipTime<35?440-shipTime/35*372:shipTime<65?68:68+(shipTime-65)/55*372,.1+Math.sin(clock*1.5)*.08,-5);ship.position.y=cave.surfaceY(ship.position.x)+.1+Math.sin(clock*1.5)*.08;ship.rotation.z=Math.sin(clock*.9)*.025;cave.update(clock,hour>19||hour<6);
  if(shipTime>=35&&!tradeDone){trade();tradeDone=true;}if(shipTime<35)tradeDone=false;
  foam.forEach((o,i)=>o.scale.z=1+.25*Math.sin(clock+i));ocean.material.color.set(hour>19||hour<6?0x153750:0x357f9b);
  if(care){care.total+=dt;if(hour>20||hour<6||manualRabbit===mother||manualRabbit===father||care.total>75)endCare();else{
   const ready=[mother,father].every(b=>jobs.has(b)&&!jobs.get(b).path.length);
   if(ready){care.age+=dt;if(care.phase==='approach'){care.phase='undress';care.age=0;holdDress();note('小白脱下裙子，豆豆接过来小心拿好');}
    if(care.phase==='undress'&&care.age>2){care.phase='wash';care.age=0;note('豆豆一边拿着裙子，一边用软海绵帮小白打泡泡');}
    if(care.phase==='wash'&&care.age>6){care.phase='brush';care.age=0;note('豆豆用软毛刷梳顺小白的毛毛');}
    if(care.phase==='brush'&&care.age>6){care.phase='dress';care.age=0;wearDress();state.cleanliness=100;note('洗好、梳好毛，豆豆把裙子还给小白，帮她穿好');save();}
    if(care.phase==='dress'&&care.age>2){care.phase='thanks';care.age=0;mother.fatigue=Math.max(0,mother.fatigue-.15);note('小白穿回漂亮裙子，亲亲豆豆：谢谢你呀 ♡');}
    if(care.phase==='thanks'&&care.age>3)endCare();
   }
  }}
  if(care){const p=mother.root.position;sponge.visible=helpingPaw.visible=care.phase==='wash';sponge.position.copy(p).add(new THREE.Vector3(-.26,.48+Math.sin(clock*6)*.09,-.04));helpingPaw.position.copy(sponge.position).add(new THREE.Vector3(-.08,.03,0));if(care.phase==='thanks'){const q=father.root.position,d=p.distanceTo(q);if(d>.68){const candidate=p.clone().lerp(q,Math.min(dt*.6/d,(d-.68)/d));if(!blocked(candidate.x,candidate.z,.28))p.copy(candidate);}}bubbles.forEach((o,i)=>{o.visible=care.phase==='wash';o.position.set(p.x+Math.sin(i*2)*.55,p.y+.3+(clock*.4+i*.1)%1.1,p.z+Math.cos(i*2)*.45);});brush.visible=care.phase==='brush';brush.position.copy(p).add(new THREE.Vector3(-.35,1+Math.sin(clock*5)*.12,0));heart.visible=care.phase==='thanks';heart.position.copy(p).lerp(father.root.position,.5);heart.position.y+=1.4+Math.sin(clock*3)*.08;heart.scale.setScalar(.4);jobs.get(mother).label=care.phase==='wash'?'让豆豆帮忙洗香香':care.phase==='brush'?'让豆豆梳顺毛毛':care.phase==='thanks'?'亲亲豆豆，感谢他的照顾':care.phase==='undress'?'脱下裙子交给豆豆':care.phase==='dress'?'穿回漂亮裙子':'前往香香浴室';jobs.get(father).label=care.phase==='wash'?'温柔地帮小白洗澡':care.phase==='brush'?'帮小白梳毛':'陪在小白身边';}
  crops.forEach(({fruit},i)=>fruit.scale.setScalar(.55+.45*Math.min(1,(clock+i%7)/35)));
  meals.update(dt,hour,manualRabbit);
  if(hour>7&&hour<19){if(clock>nextBath&&!manualRabbit){nextBath=clock+35;startBath();}if(clock>nextWork){nextWork=clock+25;if(!manualRabbit){if(state.produce<10)farm();else if(state.level<5&&state.materials>=2&&state.coins>=12)build();else commerce();}}}
  uiTime+=dt;if(uiTime>1){uiTime=0;render();}
 }
 function step(b,dt,manual,night){const j=jobs.get(b);if(!j)return false;if(manual||night||b.ride||b.cycleTrip){if(care&&(b===mother||b===father))endCare();else release(b);return false;}
  j.age+=dt;if(j.age>70&&j.path.length){release(b);return false;}
  b.state='play';b.timer=10;b.target=null;b.model.rotation.set(0,0,0);b.model.scale.set(1,1,1);
  const p=b.root.position,n=j.path[0];if(n){const dx=n.x-p.x,dz=n.z-p.z,d=Math.hypot(dx,dz);if(d<.15)j.path.shift();else{const amount=Math.min(d,dt*2);p.x+=dx/d*amount;p.z+=dz/d*amount;b.root.rotation.y=Math.atan2(-dx,-dz);}p.y=groundHeight(p.x,p.z)+Math.abs(Math.sin(clock*9))*.07;}else{p.y=groundHeight(p.x,p.z);if(care&&(b===mother||b===father)){b.root.rotation.y=Math.atan2(p.x-(b===mother?father:mother).root.position.x,p.z-(b===mother?father:mother).root.position.z);b.model.rotation.x=care.phase==='thanks'?-.17:Math.sin(clock*4)*.025;}else{b.model.rotation.x=.1+Math.sin(clock*5)*.08;j.duration-=dt;if(j.duration<=0){j.done();release(b);}}}b.hunger=Math.min(1,b.hunger+dt*.003);return true;
 }
 note('欢迎来到海岛：农场、工坊、兔兔商店和商船贸易已开张。');
 return {update,step,state,jobs,meals,startBath,farm,build,root,save,get shipDocked(){return shipTime>=35&&shipTime<65;}};
}
