import {styleStorybookHouses} from './storybook-houses.js';
import {createDailyLove} from './daily-love.js';
import {createPandaTrail} from './panda-trail.js';
import {createBambooGrove} from './bamboo-grove.js';
import {batchArchitecture} from './static-batching.js';
import {createPerformanceBudget} from './performance.js';
import {createFlamingos} from './flamingos.js';
import './panel-toggle.js?v=52';
import {createCuddleSleep} from './cuddle-sleep.js?v=60';
import {createPlayerLife} from './player-life.js?v=58';
import {createPlayerFarm} from './player-farm.js?v=57';
import {createIslandLife} from './island-life.js?v=55';
import {createCycling} from './cycling.js?v=45';
import {createManhattan} from './manhattan.js?v=46-park';
import {createParade} from './parade.js?v=42';
import {createSwissVillage} from './swiss-village.js?v=41-final';
import {createStrawberryGarden} from './strawberry-garden.js?v=50';
import {createFairytalePark} from './fairytale-park.js?v=40';
import {createAlpineLife} from './alpine-life.js?v=41';
import {createMountains} from './mountains.js?v=44';
import {addOveralls} from './overalls.js?v=34-loose';
import {createRabbitArt} from './rabbit-art.js?v=30';
import {createWardrobe} from './wardrobe.js?v=32-princess';
import {createMurals} from './murals.js?v=28b';
import {createFamily} from './family.js?v=36-care';
import {createRonda,rondaBlocked,rondaHeight} from './ronda.js?v=22b';
import {bedHeight,createCozyBed} from './cozy-bed.js?v=21';
import {createBunnyLook} from './bunny-look.js?v=25-soft';
import {addTreats} from './treats.js?v=13';
import {createNightlife} from './nightlife.js?v=12';
import {createRabbitRides} from './rides.js?v=11-final';
import {createCoaster} from './coaster.js?v=11';
import {createLeisure} from './leisure.js?v=11-final';
import {playgrounds,openPlaygrounds} from './playgrounds.js?v=10';
import {createCoast} from './coast.js?v=6';
import {createSeasons,SEASONS} from './seasons.js?v=6-icons';
import {TownSound} from './soundscape.js?v=4-nylon';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
const $=id=>document.getElementById(id), scene=new THREE.Scene();
scene.background=new THREE.Color('#a9d8e9');scene.fog=new THREE.Fog('#a9d8e9',100,420);
const renderer=new THREE.WebGLRenderer({antialias:true,powerPreference:'low-power'});renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.03;document.body.prepend(renderer.domElement);
const camera=new THREE.PerspectiveCamera(48,innerWidth/innerHeight,.1,3000);camera.position.set(31,32,39);
const controls=new OrbitControls(camera,renderer.domElement);controls.target.set(0,0,0);controls.enableDamping=true;controls.minDistance=3;controls.maxDistance=135;controls.maxPolarAngle=Math.PI/2-.045;
const mountains=createMountains(scene);const alpine=createAlpineLife(scene,mountains);const swiss=createSwissVillage(scene,mountains);
const hemi=new THREE.HemisphereLight(0xc8e9ff,0x887344,2.2);scene.add(hemi);
const sun=new THREE.DirectionalLight(0xffe4b0,3);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-35,right:35,top:35,bottom:-35,near:1,far:120});sun.shadow.bias=-.0005;scene.add(sun);
const moon=new THREE.DirectionalLight(0x99baff,.25);moon.position.set(-20,30,-10);scene.add(moon);
const world=await fetch('./world.json', {cache:'no-store'}).then(r=>r.json());
openPlaygrounds(world);
const ronda=createRonda(scene,world);
playgrounds.push({landmark:world.landmarks.length-1,name:"龙达桥头广场",entry:[-56,-50],spots:[[-88,-30],[-87,-30],[-86,-30]],food:[[-88,-30],[-86,-36],[-73,-30],[-72,-52]]});
const fairytalePark=createFairytalePark(scene,world,playgrounds);const parade=createParade(scene,world);
const loaded=await new GLTFLoader().loadAsync('./town.glb?v=10-coaster').catch(e=>{$('loadtext').textContent='小镇加载失败，请刷新页面。';throw e;});scene.add(loaded.scene);
const manhattan=createManhattan(scene,world);
const bambooGrove=createBambooGrove(scene);
const pandaTrail=createPandaTrail(scene);
const murals=createMurals(scene,loaded.scene);
world.landmarks.push({name:'瑞士风格 · 雪山木屋与缆车',camera:[42,112,swiss.center.y+17],look:[22,140,swiss.center.y+3],description:'木屋阳台、瑞士旗、观景露台和双向山间缆车，冬日屋顶覆雪。'});
world.landmarks.push({name:'高山雪场 · 小动物滑雪',camera:[19,113,78],look:[0,135,47],description:'冬季的山林覆上白雪，小兔与小熊沿山坡滑雪。切换到冬季观看。'});
world.landmarks.push({name:'群山环抱 · 小镇全景',camera:[42,-65,21],look:[0,8,9],description:'暖色岩壁、橄榄绿山麓与雾蓝远峰环绕小镇，冬季高山覆雪。'});
world.landmarks.push({name:"彩绘街巷 · 艺术家壁画",camera:[-5,6,3.2],look:[-10,6,2],description:"太阳与海浪、彩色陶瓷拼贴、盛开的花与木吉他：画在街屋空白侧墙上的原创壁画。"});
const nightlife=createNightlife(scene);const coast=createCoast(scene,loaded.scene);const leisure=createLeisure(scene);const coaster=createCoaster(scene);
const seasons=createSeasons(scene,loaded.scene,renderer);const sound=new TownSound();
for(const id of Object.keys(SEASONS))$(id).onclick=()=>seasons.setSeason(id);$('year').onclick=()=>{seasons.auto=!seasons.auto;$('year').classList.toggle('active',seasons.auto);$('year').textContent='自动换季 · '+(seasons.auto?'开':'关');};
$('music').onclick=async()=>{$('music').disabled=true;$('music-status').textContent='正在准备木吉他音色…';try{const playing=await sound.toggle();$('music').textContent=playing?'Ⅱ 暂停音乐':'♫ 播放音乐';$('music').classList.toggle('active',playing);$('music-status').textContent=playing?'尼龙弦木吉他 · 慢速田园指弹':'音乐已暂停';}catch(e){$('music-status').textContent='声音未能启动，请再次点击播放。';console.error(e);}finally{$('music').disabled=false;}};
$('volume').oninput=e=>sound.setVolume(+e.target.value);$('ambient').onclick=()=>{sound.setAmbient(!sound.ambient);$('ambient').classList.toggle('active',sound.ambient);$('ambient').textContent='环境音 · '+(sound.ambient?'开':'关');};
const leaves=[],drops=[],cameraBoxes=[];loaded.scene.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;if(o.name.startsWith('Olive_crown'))leaves.push(o);if(o.name.startsWith('Water_droplets')){drops.push(o);o.userData.baseY=o.position.y;}}});
loaded.scene.updateMatrixWorld(true);loaded.scene.traverse(o=>{if(o.isMesh&&/^(Casa|Sloping|Plaster_gable|Campanario|Tower_roof|Garden_wall|Garden_arch|Pergola|V3_Chimney|V3_Heritage_church_nave|V3_Heritage_bell_tower|V3_Heritage_market_upper|V3_Heritage_shrine|V3_Heritage_belfry_pier|V3_Icon_Sagrada_nave|V3_Icon_Sagrada_tower|V3_Icon_Batllo_core|V3_Icon_coastal_house|V3_Icon_Hemisferic_glass)/.test(o.name))cameraBoxes.push(new THREE.Box3().setFromObject(o).expandByScalar(.2));});
// Blender Z-up exports to Y-up; original Y becomes negative Z.
const blocks=world.colliders.map(([x,y,w,d])=>({x,z:-y,w,d}));
function blocked(x,z,r=.28){return rondaBlocked(x,z,r) || x < -100 || x > 47 || z < -59 || z > 124||blocks.some(b=>Math.abs(x-b.x)<b.w+r&&Math.abs(z-b.z)<b.d+r)}
function groundHeight(x,z){if(x<-56)return rondaHeight(x,z);const bed=bedHeight(x,z);if(bed>.1)return bed;if(x>=18&&x<=22&&z>=-36&&z<=-34)return Math.min(.9,.1+.2*(Math.floor((-z-34)/.5)+1));return x>=12.5&&x<=27.5&&z>=-46&&z<=-36?.9:.1;}
function moveBody(b,dx,dz){if(!blocked(b.position.x+dx,b.position.z))b.position.x+=dx;if(!blocked(b.position.x,b.position.z+dz))b.position.z+=dz;}
const mats={white:new THREE.MeshStandardMaterial({color:0xf7eee0,roughness:.8}),pink:new THREE.MeshStandardMaterial({color:0xec9797}),black:new THREE.MeshStandardMaterial({color:0x161722,roughness:.22}),orange:new THREE.MeshStandardMaterial({color:0xf58220}),green:new THREE.MeshStandardMaterial({color:0x4c8633})};
const ballGeo=new THREE.SphereGeometry(1,16,10);
function ball(parent,p,s,m){const o=new THREE.Mesh(ballGeo,m);o.position.set(...p);o.scale.set(...s);o.castShadow=true;parent.add(o);return o}
function rabbit(x,z,i){const root=new THREE.Group();root.position.set(x,.10,z);scene.add(root);const model=new THREE.Group();root.add(model);const look=createBunnyLook(model,i),{ears,feet}=look;return {root,model,ears,feet,look,vy:0,path:[],target:null,timer:i*.8,state:'search',phase:i*2,hop:0,hunger:.65+i*.06,fatigue:.1+i*.08,visitedGarden:false,destination:null,afterArrival:null,name:['小白','奶糖','豆豆'][i],personality:i,stuck:0};}
const rabbits=[rabbit(-3,3,0),rabbit(4,4,1),rabbit(19,0,2)];
const rabbitArt=createRabbitArt(murals,rabbits,{goTo,blocked});
const cyclingClub=createCycling(scene,rabbits,{goTo,mountains,pandaTrail,groundHeight});
const flamingos=createFlamingos(scene,loaded.scene);
blocks.push({x:26,z:7,w:2.95*Math.SQRT2,d:1.85*Math.SQRT2});
const family=createFamily(rabbits,{pathfind,blocked,scene});
const cuddleSleep=createCuddleSleep(rabbits);
const overalls=addOveralls(rabbits[2]);
const wardrobe=createWardrobe(scene,rabbits[0]);blocks.push({x:-26.7,z:2,w:1.1,d:.7});
let eaten=0;
const carrots=world.carrots.map(([x,y])=>{const group=new THREE.Group();group.position.set(x,groundHeight(x,-y)+.02,-y);scene.add(group);const body=new THREE.Mesh(new THREE.ConeGeometry(.13,.44,8),mats.orange);body.rotation.z=Math.PI;body.position.y=.18;group.add(body);for(let i=0;i<3;i++){const leaf=ball(group,[.06*Math.cos(i*2.1),.53,.06*Math.sin(i*2.1)],[.045,.24,.045],mats.green);leaf.rotation.z=(i-1)*.5;}return {group,alive:true,respawn:0};});
addTreats(scene,carrots,groundHeight);
// Grid A*: targets chosen only when reachable; prevents paths through houses or fountain.
const STEP=.75,N=335,OFFSET=167;
const toCell=v=>Math.round(v/STEP)+OFFSET;const key=(x,z)=>x+z*N;
function pathfind(start,end,clearance=.38){const sx=toCell(start.x),sz=toCell(start.z),ex=toCell(end.x),ez=toCell(end.z);const open=[{x:sx,z:sz,g:0,f:0}],cost=new Map([[key(sx,sz),0]]),prev=new Map();let endNode=null,count=0;
while(open.length&&count++<30000){let best=0;for(let i=1;i<open.length;i++)if(open[i].f<open[best].f)best=i;const cur=open.splice(best,1)[0];if(cur.x===ex&&cur.z===ez){endNode=cur;break;}for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]]){const x=cur.x+dx,z=cur.z+dz;if(x<0||z<0||x>=N||z>=N||blocked((x-OFFSET)*STEP,(z-OFFSET)*STEP,clearance))continue;const k=key(x,z),g=cur.g+1;if(g>=(cost.get(k)??Infinity))continue;cost.set(k,g);prev.set(k,cur);open.push({x,z,g,f:g+Math.abs(x-ex)+Math.abs(z-ez)});}}
if(!endNode)return [];const result=[new THREE.Vector3(end.x,.1,end.z)];let c=endNode;while(c.x!==sx||c.z!==sz){result.push(new THREE.Vector3((c.x-OFFSET)*STEP,.1,(c.z-OFFSET)*STEP));c=prev.get(key(c.x,c.z));if(!c)break;}return result.reverse();}
function choose(b){if(b.playground){const local=carrots.filter(c=>c.alive&&b.playground.food.some(([x,y])=>Math.hypot(c.group.position.x-x,c.group.position.z+y)<.1));for(const c of local){const p=pathfind(b.root.position,c.group.position);if(p.length){b.target=c;b.path=p;b.state='sniff';b.timer=1;return;}}b.playground=null;} const candidates=carrots.filter(c=>c.alive).sort((a,c)=>a.group.position.distanceToSquared(b.root.position)-c.group.position.distanceToSquared(b.root.position));b.target=null;for(const c of candidates.slice(0,12)){const p=pathfind(b.root.position,c.group.position);if(p.length){b.target=c;b.path=p;b.state='sniff';b.timer=1.4;return;}}b.timer=1;b.state='search';}
function eat(b,c){if(!c?.alive)return;b.lastFood=c.label;b.lastFoodType=c.type;c.alive=false;c.group.visible=false;c.respawn=(25+Math.random()*20)*(seasons.current==='winter'?1.7:seasons.current==='spring'?.8:1);b.hunger=Math.max(0,b.hunger-(c.type==='icecream'?.22:c.type==='strawberry'?.3:.44));eaten++;$('eaten').textContent=eaten;b.state='eat';b.timer=1.2;b.path=[];b.target=null;}
const lampLights=world.lamps.map(([x,y,z])=>{const l=new THREE.PointLight(0xffad55,0,9,2);l.position.set(x,z,-y);scene.add(l);return l;});
// Sky discs and stars live outside the walkable meadow.
const sunDisc=new THREE.Mesh(new THREE.SphereGeometry(2,16,10),new THREE.MeshBasicMaterial({color:0xffecb3}));scene.add(sunDisc);
const starPositions=[];for(let i=0;i<320;i++){const a=Math.random()*Math.PI*2,h=Math.random()*Math.PI*.44;starPositions.push(85*Math.cos(a)*Math.cos(h),20+70*Math.sin(h),85*Math.sin(a)*Math.cos(h));}const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.Float32BufferAttribute(starPositions,3));const starMat=new THREE.PointsMaterial({size:.18,color:0xe0edff,transparent:true});scene.add(new THREE.Points(sg,starMat));
let mode='orbit',cycling=true,hour=10,selected=0;const gardenSpot=new THREE.Vector3(-24,.1,2);const restSpots=[gardenSpot,new THREE.Vector3(-4,.1,6),new THREE.Vector3(17,.1,-6)];const keys=new Set();
window.addEventListener('keydown',e=>{if(['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code))e.preventDefault();keys.add(e.code);});window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>keys.clear());
function setMode(m){skiView=false;if(m==='rabbit'&&rabbits[selected].ride)m='follow';const previous=mode;mode=m;for(const id of ['orbit','rabbit','follow'])$(id).classList.toggle('active',m===id);controls.enabled=m!=='follow';if(m!=='orbit'){const p=rabbits[selected].root.position;camera.position.copy(p).add(new THREE.Vector3(0,4,7));controls.target.copy(p);}if(previous==='rabbit'&&m!=='rabbit'&&!rabbits[selected].ride){rabbits[selected].state='search';rabbits[selected].timer=0;}}
const portraitButton=document.createElement('button');portraitButton.id='bunny-portrait';portraitButton.textContent='看看兔兔 · 表情近景';$('season-caption').after(portraitButton);portraitButton.onclick=()=>setMode('portrait');
$('orbit').onclick=()=>setMode('orbit');$('rabbit').onclick=()=>setMode('rabbit');$('follow').onclick=()=>setMode('follow');
$('resident').onchange=e=>{if(mode==='rabbit'){rabbits[selected].state='search';rabbits[selected].timer=0;}selected=+e.target.value;setMode(mode);};
function visitLandmark(){const place=world.landmarks?.[+$('landmark').value];if(!place)return;setMode('orbit');camera.position.set(place.camera[0],place.camera[2],-place.camera[1]);controls.target.set(place.look[0],place.look[2],-place.look[1]);$('landmark-description').textContent=place.description;controls.update();}
$('landmark').innerHTML='';for(const [i,place] of (world.landmarks||[]).entries()){const option=document.createElement('option');option.value=i;option.textContent=place.name;$('landmark').appendChild(option);}
const rondaButton=document.createElement('button');rondaButton.id='ronda-trip';rondaButton.textContent='兔兔去龙达逛逛';$('visit-landmark').after(rondaButton);rondaButton.onclick=()=>{hour=10;cycling=false;$('cycle').textContent='昼夜流转 · 停';$('cycle').classList.remove('active');bedtimePending.clear();$('landmark').value=world.landmarks.findIndex(p=>p.name.startsWith('龙达'));visitLandmark();rabbits.forEach((b,i)=>{b.playground={name:'龙达桥头广场',food:[[-88,-30],[-86,-36],[-73,-30],[-72,-52]]};goTo(b,new THREE.Vector3(-88+i*.8,8.1,30),'play');});};
$('visit-landmark').onclick=visitLandmark;$('landmark').onchange=visitLandmark;
$('home').onclick=()=>{setMode('orbit');camera.position.set(31,32,39);controls.target.set(0,0,0);};
$('cycle').onclick=()=>{cycling=!cycling;$('cycle').classList.toggle('active',cycling);$('cycle').textContent='昼夜流转 · '+(cycling?'开':'停');};$('sun').oninput=e=>{hour=+e.target.value;};
function goTo(b,point,after){if(b.ride||b.cycleTrip)return false;const path=pathfind(b.root.position,point);if(!path.length){b.state='search';b.timer=2;return false;}b.target=null;b.destination=point.clone();b.path=path;b.state='travel';b.afterArrival=after;return true;}
const sleepSpots=[new THREE.Vector3(-24.27,.1,1.95),new THREE.Vector3(-24.95,.1,2.4),new THREE.Vector3(-23.55,.1,1.95)];
function goRest(b,night){if(night){goTo(b,sleepSpots[b.personality],'sleep');return;}const spots=[...restSpots].sort((a,c)=>a.distanceToSquared(b.root.position)-c.distanceToSquared(b.root.position));for(const p of spots)if(goTo(b,p,night?'sleep':'rest'))return;}
$('garden').onclick=()=>{setMode('follow');if(goTo(rabbits[selected],gardenSpot,'rest'))$('notice').textContent='跟着'+rabbits[selected].name+'穿过拱门，去庭院休息。';else $('notice').textContent='暂时找不到通路，请先带兔子回到街道。';};
function sendToPlayground(b,place){const point=place.spots[b.personality%place.spots.length];if(!goTo(b,new THREE.Vector3(point[0],.1,-point[1]),'play'))return false;b.playground=place;b.nextTrip=performance.now()+45000;b.fatigue=Math.min(b.fatigue,.4);return true;}
const playButton=document.createElement('button');playButton.id='play-landmark';playButton.textContent='带兔子进去玩 · 找吃的';$('visit-landmark').after(playButton);const tripNote=document.createElement('p');tripNote.style.cssText='font-size:12px;line-height:1.6';playButton.after(tripNote);
playButton.onclick=()=>{const place=playgrounds.find(p=>p.landmark===+$('landmark').value);if(!place){tripNote.textContent='这处建筑还没有开放内部；可选择斗牛场、宫殿、钟塔、水道桥、公园或庭院。';return;}setMode('follow');tripNote.textContent=sendToPlayground(rabbits[selected],place)?'跟着'+rabbits[selected].name+'前往'+place.name+'，沿路走进去寻找胡萝卜。':'暂时没有通路，请回到街道再试。';};
function isNight(){return hour<seasons.config.sunrise||hour>=seasons.config.sunset;}
function decide(b){const night=isNight();if(night){goRest(b,true);return;}if((!b.nextBike||performance.now()>b.nextBike)&&Math.random()<.25){const panda=Math.random()<.6;if(cyclingClub.start(b,panda)){if(b===rabbits[0])cyclingClub.start(rabbits[2],panda);return;}}if(b.fatigue>.72){goRest(b,false);return;}if(b.hunger>.38){choose(b);return;}if((!b.nextRide||performance.now()>b.nextRide)&&Math.random()<.4){const r=rabbitRides.rides[Math.floor(Math.random()*rabbitRides.rides.length)];if(rabbitRides.start(b,r.id))return;}if(!b.nextTrip||performance.now()>b.nextTrip){const places=[...playgrounds].sort(()=>Math.random()-.5);for(const place of places)if(sendToPlayground(b,place))return;}if(!b.visitedGarden){goTo(b,gardenSpot,'rest');return;}b.state='groom';b.timer=3+Math.random()*3;}
const cameraRay=new THREE.Ray();let cameraClipped=false;
function clipCamera(target,desired){const direction=desired.clone().sub(target),distance=direction.length();direction.normalize();cameraRay.set(target,direction);let allowed=distance;for(const box of cameraBoxes){const hit=cameraRay.intersectBox(box,new THREE.Vector3());if(hit)allowed=Math.min(allowed,Math.max(.35,target.distanceTo(hit)-.2));}cameraClipped=allowed<distance-.01;return target.clone().addScaledVector(direction,allowed);}
function updateFollow(dt){const b=rabbits[selected],target=b.root.position.clone().add(new THREE.Vector3(0,.65,0));let desired;
if(mode==='portrait'){desired=target.clone().add(new THREE.Vector3(0,.2,-2.7).applyAxisAngle(new THREE.Vector3(0,1,0),b.root.rotation.y));camera.position.lerp(desired,1-Math.exp(-dt*4));desired=camera.position.clone();}else if(mode==='follow'){const back=new THREE.Vector3(Math.sin(b.root.rotation.y)*6,3.8,Math.cos(b.root.rotation.y)*6);desired=target.clone().add(back);camera.position.lerp(desired,1-Math.exp(-dt*3));desired=camera.position.clone();}else desired=camera.position.clone();camera.position.copy(clipCamera(target,desired));camera.lookAt(target);controls.target.copy(target);}
const treatsPanel=document.createElement('details');treatsPanel.open=true;treatsPanel.innerHTML='<summary>兔兔小零食</summary><button id="berry-snack">带兔兔吃草莓</button> <button id="ice-snack">带兔兔吃冰淇淋</button><p id="snack-note" style="font-size:11px;line-height:1.6">花园里有草莓，冰淇淋店有兔兔卡通甜筒。</p>';document.getElementById('panel').append(treatsPanel);
function seekTreat(type){const b=rabbits[selected];if(b.ride){$('snack-note').textContent='等兔兔玩完这一轮，再去吃零食。';return;}setMode('follow');for(const c of carrots.filter(c=>c.alive&&c.type===type).sort((a,c)=>a.group.position.distanceToSquared(b.root.position)-c.group.position.distanceToSquared(b.root.position))){const p=pathfind(b.root.position,c.group.position);if(p.length){b.playground=null;b.target=c;b.path=p;b.state='sniff';b.timer=.5;$('snack-note').textContent=b.name+'出发去吃'+c.label+'啦！';return;}}$('snack-note').textContent='零食正在补货，稍后再来。';}
$('berry-snack').onclick=()=>seekTreat('strawberry');$('ice-snack').onclick=()=>seekTreat('icecream');
let bedtimePending=new Set();
function sleepTogether(){hour=22;cycling=false;$('cycle').classList.remove('active');$('cycle').textContent='昼夜流转 · 停';bedtimePending=new Set(rabbits);setMode('orbit');camera.position.set(-24,4.3,-3.5);controls.target.set(-24,.45,2);controls.update();$('sleep-note').textContent='三只兔兔正在回同一个小窝。乘坐设施的兔兔会在下车后回来。';}
const sleepPanel=document.createElement('details');sleepPanel.open=true;sleepPanel.innerHTML='<summary>兔兔一起休息</summary><button id="sleep-together">三只一起睡觉</button> <button id="wake-together">起床啦</button><p id="sleep-note" style="font-size:11px;line-height:1.6">小白妈妈、豆豆爸爸和孩子奶糖，一家三口相伴生活。</p>';$('season-caption').after(sleepPanel);$('sleep-together').onclick=sleepTogether;$('wake-together').onclick=()=>{bedtimePending.clear();hour=9;cycling=true;$('cycle').textContent='昼夜流转 · 开';$('cycle').classList.add('active');$('sleep-note').textContent='天亮啦，兔兔慢慢醒来。';};
const cozyBed=createCozyBed(scene,loaded.scene);
const strawberryGarden=createStrawberryGarden(scene,rabbits[0],{goTo});
const wardrobePanel=document.createElement('details');wardrobePanel.open=true;wardrobePanel.innerHTML='<summary>小白的漂亮衣柜</summary><p id=outfit-note style="font-size:11px"></p><button id=change-outfit>换一套漂亮裙子</button> <button id=see-wardrobe>看看衣柜</button>';sleepPanel.after(wardrobePanel);$('change-outfit').onclick=()=>{$('outfit-note').textContent=wardrobe.change(wardrobe.current+1);selected=0;$('resident').value=0;setMode('portrait');};const paintButton=document.createElement('button');paintButton.id='paint-together';paintButton.textContent='一起去画心情涂鸦';wardrobePanel.after(paintButton);paintButton.onclick=()=>{if(rabbitArt.trip()){selected=0;setMode('follow');}};
$('see-wardrobe').onclick=()=>{setMode('orbit');camera.position.set(-25,3.3,-3.2);controls.target.set(-26,1.1,2);controls.update();};
const rabbitRides=createRabbitRides({scene,leisure,coaster,goTo,setMode,rabbits,selected:()=>selected});
const islandLife=createIslandLife(scene,rabbits,{pathfind,blocked,groundHeight,mountains,view:(position,target)=>{skiView=false;setMode('orbit');controls.maxDistance=1500;scene.fog.far=2400;scene.fog.near=900;camera.position.set(...position);controls.target.set(...target);controls.update();}});
const playerFarm=createPlayerFarm(scene,islandLife,{camera,canvas:renderer.domElement,focus:(p,t)=>{skiView=false;setMode('orbit');camera.position.set(...p);controls.target.set(...t);controls.update();}});
const playerLife=createPlayerLife(scene,playerFarm,islandLife,{camera,controls,blocked,pathfind,groundHeight,rabbits,setMode,getMode:()=>mode,getHour:()=>hour,setHour:h=>hour=h,setSeason:s=>seasons.setSeason(s)});
const dailyLove=createDailyLove(scene,rabbits,{pathfind,blocked,groundHeight,jobs:islandLife.jobs});
window.playerLife=playerLife;
window.playerFarm=playerFarm;
window.townIsland=islandLife;
const performanceBudget=createPerformanceBudget(renderer,sun,scene,camera);
$('loading').remove();let last=performance.now(),elapsed=0,frame=0;const forward=new THREE.Vector3(),right=new THREE.Vector3();
function tick(now){requestAnimationFrame(tick);const dt=performanceBudget.begin(now);if(dt===null)return;const workStart=performance.now();last=now;elapsed+=dt;frame++;flamingos.update(dt);bambooGrove.update(elapsed);
if(cycling&&!playerLife.paused)hour=(hour+dt*.08)%24;const cfg=seasons.config;const phase=(hour-cfg.sunrise)/(cfg.sunset-cfg.sunrise);const angle=phase>=0&&phase<=1?phase*Math.PI:Math.PI+(hour>=cfg.sunset?(hour-cfg.sunset):(24-cfg.sunset+hour))/(24-cfg.sunset+cfg.sunrise)*Math.PI,elevation=Math.sin(angle),day=THREE.MathUtils.smoothstep(elevation,-.15,.3);sun.position.set(45*Math.cos(angle),50*elevation,18);sun.intensity=Math.max(0,elevation)*3.0*cfg.daylight;sun.color.setHSL(.09,.45+.4*(1-day),.8);sunDisc.position.copy(sun.position).multiplyScalar(1.4);sunDisc.visible=elevation>-.05;hemi.intensity=.22+day*.95;moon.intensity=(1-day)*.45;scene.background.set(0x101a36).lerp(new THREE.Color(cfg.sky),day);scene.fog.color.copy(scene.background);starMat.opacity=1-day;lampLights.forEach(l=>l.intensity=(1-day)*28);
rabbitArt.update(dt,hour);mountains.update(seasons.current);alpine.update(seasons.current,elapsed);swiss.update(seasons.current,elapsed);manhattan.update(day,seasons.current);parade.update(elapsed);fairytalePark.update(day,elapsed);overalls.update();wardrobe.update(hour,elapsed);if(frame%8===0)$('outfit-note').textContent='今日穿搭：'+rabbits[0].outfit;seasons.update(dt,elapsed,day);coast.update(elapsed,day);pandaTrail.update(day);bambooGrove.updateLight(day);nightlife.update(dt,day);ronda.update(day);leisure.update(dt);coaster.update(dt,leisure.running);sound.update(seasons.current,hour);
if(frame%12===0){$('sun').value=hour;$('time').textContent=String(Math.floor(hour)).padStart(2,'0')+':'+String(Math.floor(hour%1*60)).padStart(2,'0');$('phase').textContent=day<.2?'· 星夜':hour<8||hour>17?'· 金色时刻':'· 晴日';$('remaining').textContent=carrots.filter(c=>c.alive).length;}
for(const c of carrots)if(!c.alive&&(c.respawn-=dt)<=0){c.alive=true;c.group.visible=true;}
playerLife.update(dt);playerFarm.update(dt,hour,seasons.current);family.record(dt);islandLife.update(dt,hour,mode==='rabbit'?rabbits[selected]:null);
dailyLove.update(dt,hour);
for(let i=0;i<rabbits.length;i++){const b=rabbits[i],p=b.root.position;if(dailyLove.handles(b))continue;if(b.playerControlled)continue;if(islandLife.step(b,dt,mode==='rabbit'&&i===selected,isNight()||bedtimePending.has(b)))continue;if(bedtimePending.has(b)&&!b.ride&&!b.cycleTrip){if(goTo(b,sleepSpots[i],'sleep'))bedtimePending.delete(b);}if(cyclingClub.update(b,dt)||rabbitRides.update(b,dt))continue;const floor=groundHeight(p.x,p.z);let moving=false,dx=0,dz=0;const manual=mode==='rabbit'&&i===selected,night=isNight();
b.hunger=Math.min(1,b.hunger+dt*(i===1?.009:.006)*(seasons.current==='winter'?1.2:1));b.timer-=dt;b.model.rotation.x=0;b.model.scale.set(1,1,1);
if(i!==0&&!manual&&!night&&b.hunger>.35&&!['eat','dig'].includes(b.state)){const snack=carrots.find(c=>c.alive&&p.distanceTo(c.group.position)<.65);if(snack)eat(b,snack);}
const familyMove=i===2&&!b.cycleTrip&&!manual&&!night&&!bedtimePending.has(b)&&!(b.state==='travel'&&b.afterArrival==='sleep')?family.step(b,dt):null;
const caring=i===0&&!b.cycleTrip&&!manual&&!night&&family.care(dt);
if(caring){dx=dz=0;}
else if(familyMove){dx=familyMove.dx;dz=familyMove.dz;moving=Math.hypot(dx,dz)>.00001;}
else if(manual){camera.getWorldDirection(forward);forward.y=0;forward.normalize();right.crossVectors(forward,new THREE.Vector3(0,1,0));const f=(keys.has('KeyW')?1:0)-(keys.has('KeyS')?1:0),r=(keys.has('KeyD')?1:0)-(keys.has('KeyA')?1:0);dx=forward.x*f+right.x*r;dz=forward.z*f+right.z*r;const len=Math.hypot(dx,dz);if(len){const speed=keys.has('ShiftLeft')?4.7:2.5;dx=dx/len*speed*dt;dz=dz/len*speed*dt;moving=true;}if(keys.has('Space')&&p.y<=floor+.005)b.vy=4.2;for(const c of carrots)if(c.alive&&p.distanceTo(c.group.position)<.65)eat(b,c);}
else{
 if(b.state==='paint'){b.model.rotation.z=Math.sin(elapsed*5)*.055;if(b.timer<=0){b.state='search';b.timer=2;}}
 else if(b.state==='play'){b.model.rotation.x=.08*Math.sin(elapsed*6);if(b.timer<=0){if(b.playground&&b.hunger>.15)choose(b);else{b.state='search';b.timer=1;}}}
 else if(b.state==='sleep'){b.fatigue=Math.max(0,b.fatigue-dt*.1);b.model.scale.set(1.07,.64+Math.sin(elapsed*2)*.025,1.1);if(!night){b.state='groom';b.timer=2;}}
 else if(b.state==='rest'){b.fatigue=Math.max(0,b.fatigue-dt*.09);b.model.scale.set(1.05,.72+Math.sin(elapsed*2)*.02,1.05);if(night)b.state='sleep';else if(b.timer<=0){b.state='search';b.timer=0;}}
 else if(b.state==='groom'){b.model.rotation.x=.1*Math.sin(elapsed*7);if(b.timer<=0){b.state='search';b.timer=0;}}
 else if(b.state==='eat'){b.model.rotation.x=(b.lastFoodType==='icecream'?.06:.13)*Math.sin(elapsed*15);if(b.timer<=0){b.state='search';b.timer=0;}}
 else if(b.state==='dig'){b.model.rotation.x=(b.target?.type==='carrot'?.22:.08)+Math.sin(elapsed*12)*.08;if(!b.target?.alive){b.state='search';b.timer=0;}else if(b.timer<=0)eat(b,b.target);}
 else if(b.state==='sniff'){b.model.rotation.x=.06*Math.sin(elapsed*9);if(b.timer<=0)b.state='run';}
 else{
  if(night&&b.state!=='travel'){goRest(b,true);}
  if(b.target&&!b.target.alive){b.state='search';b.timer=0;}
  if(b.state==='search'&&b.timer<=0)decide(b);
  if(b.state==='run'||b.state==='travel'){
   const target=b.path[0];if(target){const x=target.x-p.x,z=target.z-p.z,len=Math.hypot(x,z);if(len<.14)b.path.shift();else{const dist=Math.min(len,dt*(i===1?1.5:i===2?2.2:1.8));dx=x/len*dist;dz=z/len*dist;moving=true;}}
   if(b.state==='run'&&b.target&&p.distanceTo(b.target.group.position)<.6){b.state='dig';b.timer=b.target.type==='carrot'?1.5:.8;b.path=[];moving=false;dx=dz=0;}
   else if(b.state==='travel'&&!b.path.length){b.state=b.afterArrival;if(b.state==='sleep')b.root.rotation.y=0;b.timer=b.afterArrival==='play'?1.5:9+Math.random()*4;b.destination=null;}
   else if(b.state==='run'&&!b.path.length){b.state='search';b.timer=.2;}
  }
 }
}
const old=p.clone();moveBody(b.root,dx,dz);if(moving){b.fatigue=Math.min(1,b.fatigue+dt*.012);b.root.rotation.y=Math.atan2(-dx,-dz);if(p.y<=floor+.005&&b.hop<=0){b.vy=1.7;b.hop=.25;}if(Math.hypot(p.x-old.x,p.z-old.z)<.001){b.stuck+=dt;if(b.stuck>2&&!manual){b.state='search';b.timer=.4;b.path=[];b.stuck=0;}}else b.stuck=0;}
b.hop-=dt;b.vy-=9.81*dt;p.y+=b.vy*dt;const nextFloor=groundHeight(p.x,p.z);if(p.y<nextFloor){p.y=nextFloor;b.vy=0;}
b.feet.forEach((f,j)=>{f.rotation.x=moving?Math.sin(elapsed*14+j%2*Math.PI)*.4:b.state==='dig'&&j%2===0?Math.sin(elapsed*18)*.6:b.state==='groom'&&j%2===0?-.6+Math.sin(elapsed*8)*.2:0;});
if(p.distanceTo(gardenSpot)<3&&!b.visitedGarden){b.visitedGarden=true;if(i===selected)$('notice').textContent='发现秘密花园！这里有新鲜胡萝卜和阴凉的小窝。';}
if(mode==='rabbit'&&i===selected){camera.position.add(p.clone().sub(old));controls.target.copy(p).add(new THREE.Vector3(0,.65,0));}
}
if(rabbits.every(b=>b.state==='sleep'))$('sleep-note').textContent='小白和豆豆前爪搭着彼此，依偎着睡；奶糖蜷在旁边。';
if(frame%8===0){const active=rabbits[selected];const labels={dailyLove:active===rabbits[2]?'今天天气这么好，我们干点啥去？':'你个跟踪狂，你愿意干啥干啥去',pandaReady:'准备走进竹林',pandaWalk:'沿木栈桥步行去找熊猫',pandaWatch:'在竹林看熊猫吃竹子',cycling:'正在环镇骑自行车',cycleReady:'准备骑车',care:active.careMessage||'陪伴豆豆',kiss:'轻轻亲了小白一下 ♡',paint:'正在墙上画'+(active.artMood||'心情图案'),family:active===rabbits[2]?'陪着小白，和她一起走':'跟着爸爸妈妈探索小镇',ride:'正在玩'+(active.ride?.r.name||'游乐设施'),queue:'正在等候上车',search:'正在寻找好吃的',sniff:'竖起耳朵，闻到了'+(active.target?.label||'食物'),run:'循着气味去找'+(active.target?.label||'食物'),dig:active.target?.type==='carrot'?'正在刨土挖胡萝卜':'凑近闻闻'+(active.target?.label||'食物'),eat:active.lastFoodType==='icecream'?'正在舔兔兔冰淇淋':'正津津有味地吃'+(active.lastFood||'食物'),play:'在'+(active.playground?.name||'建筑里')+'蹦跳探索',travel:active.afterArrival==='play'?'前往'+(active.playground?.name||'地标')+'找吃的':active.afterArrival==='sleep'?'准备回窝睡觉':'沿着小路寻找阴凉',rest:'吃饱了，在阴凉处休息',sleep:'蜷在小窝里睡着了',groom:'正在洗脸、整理毛发'};
$('rabbit-name').textContent=active.name;$('behavior').textContent=mode==='rabbit'?'跟着你一起探索':active.waitingForPartner?'停下来等豆豆跟上':islandLife.jobs.get(active)?.label||labels[active.state];$('needs').textContent='饥饿 '+Math.round(active.hunger*100)+'% · 疲倦 '+Math.round(active.fatigue*100)+'%';}
leaves.forEach((o,i)=>o.rotation.z=Math.sin(elapsed*.8+i)*.015);drops.forEach((o,i)=>o.position.y=o.userData.baseY+Math.sin(elapsed*5+i)*.045);controls.update();if(mode!=='orbit'&&mode!=='player')updateFollow(dt);rabbits.forEach(b=>b.look.animate(elapsed,b.state,b.state==='run'||b.state==='travel'||b.state==='pandaWalk'||(b.state==='family'&&b.path.length>0),b.target?b.root.worldToLocal(b.target.group.position.clone()):null));if(skiView){const p=alpine.skiers[0].position;controls.target.copy(p).add(new THREE.Vector3(0,.8,0));camera.position.copy(p).add(new THREE.Vector3(5,6,8));camera.lookAt(controls.target);}cuddleSleep.update(elapsed);islandLife.meals.pose();dailyLove.pose();playerLife.cameraUpdate();performanceBudget.prepareRender();renderer.render(scene,camera);performanceBudget.stats.lastWorkMs=performance.now()-workStart;performanceBudget.stats.workMs+=performanceBudget.stats.lastWorkMs;}
requestAnimationFrame(tick);window.addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
window.townDebug={dailyLove,pandaTrail,bambooGrove,renderer,performanceBudget,flamingos,cyclingClub,manhattan,parade,swiss,fairytalePark,alpine,mountains,overalls,rabbitArt,wardrobe,murals,family,ronda,groundHeight,cozyBed,sleepTogether,sleepSpots,seekTreat,nightlife,rabbitRides,coaster,leisure,playgrounds,sendToPlayground,rabbits,carrots,blocked,pathfind,scene,coast,landmarks:world.landmarks,visitLandmark,seasons,sound,camera,cameraBoxes,clipCamera,goTo,gardenSpot,get cameraClipped(){return cameraClipped},get mode(){return mode},get selected(){return selected},get eaten(){return eaten},get hour(){return hour},setMode};
// Direct preview and a visible shortcut for the winter animal slope.
var skiView=false;
function showAnimalSkiing(){seasons.setSeason('winter');hour=11;cycling=false;$('cycle').classList.remove('active');$('cycle').textContent='昼夜流转 · 停';setMode('orbit');skiView=true;const focus=alpine.curve.getPointAt(.55);controls.target.copy(focus).add(new THREE.Vector3(0,1,0));camera.position.copy(focus).add(new THREE.Vector3(10,9,12));controls.update();$('landmark').value=world.landmarks.findIndex(p=>p.name.startsWith('高山雪场'));$('landmark-description').textContent='冬日动物雪场：小兔和小熊正沿着林间雪坡滑雪。';}
const skiPreview=document.createElement('button');skiPreview.id='show-animal-skiing';skiPreview.textContent='❄ 看小动物滑雪';$('season-caption').after(skiPreview);skiPreview.onclick=showAnimalSkiing;
if(new URLSearchParams(location.search).get('view')==='ski')showAnimalSkiing();

if(new URLSearchParams(location.search).get('view')==='fairytale'){$('landmark').value=fairytalePark.landmark;visitLandmark();}

if(new URLSearchParams(location.search).get('view')==='swiss'){seasons.setSeason('winter');$('landmark').value=world.landmarks.findIndex(p=>p.name.startsWith('瑞士风格'));visitLandmark();}

if(new URLSearchParams(location.search).get('view')==='racing'){$('home').click();}

if(new URLSearchParams(location.search).get('view')==='manhattan'){$('landmark').value=manhattan.landmark;visitLandmark();}

const bikeButton=document.createElement('button');bikeButton.textContent='一家三口环镇骑车';bikeButton.id='family-cycling';$('season-caption').after(bikeButton);bikeButton.onclick=()=>{rabbits.forEach(b=>cyclingClub.start(b));selected=0;setMode('follow');};

if(new URLSearchParams(location.search).get('view')==='villas'){$('landmark').value=manhattan.landmark;visitLandmark();}
setInterval(()=>strawberryGarden.update(.25),250);

// Start with the rabbit family living autonomously; player control is opt-in.

const flamingoButton=document.createElement('button');flamingoButton.id='watch-flamingos';flamingoButton.textContent='🦩 看庭院里的火烈鸟';bikeButton.after(flamingoButton);
flamingoButton.onclick=()=>{setMode('orbit');const p=flamingos.birds[4].root.position;controls.target.copy(p).add(new THREE.Vector3(0,.8,0));camera.position.copy(p).add(new THREE.Vector3(6,8,15));controls.update();};


window.townDebug.houseStyle=styleStorybookHouses(scene,loaded.scene);
window.townDebug.batching=batchArchitecture(scene,loaded.scene);

const bambooButton=document.createElement('button');bambooButton.id='visit-bamboo';bambooButton.textContent='🐼 千年古树与熊猫竹林';flamingoButton.after(bambooButton);
bambooButton.onclick=()=>{setMode('orbit');camera.position.set(-38,49,49);controls.target.set(-80,23,-9);controls.update();};

let pandaViewed=0;const pandaButton=document.createElement('button');pandaButton.textContent='近看熊猫 · 团团 / 青青 / 笋笋';bambooButton.after(pandaButton);pandaButton.onclick=()=>{setMode('orbit');const panda=bambooGrove.pandas[pandaViewed++%3];const p=panda.root.getWorldPosition(new THREE.Vector3());camera.position.copy(p).add(new THREE.Vector3(-2.5,1.8,-1.6));controls.target.copy(p).add(new THREE.Vector3(0,panda.size,0));controls.update();$('notice').textContent=panda.name+'：'+panda.description;};

const pandaTripButton=document.createElement('button');pandaTripButton.id='walk-to-pandas';pandaTripButton.textContent='一家三口去找熊猫玩';bambooButton.after(pandaTripButton);pandaTripButton.onclick=()=>{let started=false;rabbits.forEach(b=>{if(!islandLife.jobs.has(b)&&cyclingClub.start(b,true))started=true;});if(started){selected=0;setMode('follow');$('notice').textContent='沿木栈桥走进竹林，陪熊猫玩一会儿，再慢慢走回来。';}else $('notice').textContent='兔兔正在忙，等它们空闲后再出发。';};

const trailViewButton=document.createElement('button');trailViewButton.textContent='看看龙达竹林栈桥';trailViewButton.id='view-panda-trail';bambooButton.after(trailViewButton);trailViewButton.onclick=()=>{setMode('orbit');camera.position.set(-61,20,40);controls.target.set(-80,11,23);controls.update();};

const cycleDestinationButton=document.createElement('button');cycleDestinationButton.textContent='骑车去所选地点';cycleDestinationButton.id='cycle-to-landmark';$('visit-landmark').after(cycleDestinationButton);
cycleDestinationButton.onclick=()=>{const index=+$('landmark').value,place=playgrounds.find(p=>p.landmark===index),landmark=world.landmarks[index],coordinates=place?.entry||landmark?.position;const b=rabbits[selected];if(!coordinates){$('notice').textContent='这里尚未连接可通行道路。';return;}const point=new THREE.Vector3(coordinates[0],.1,-coordinates[1]);if(!islandLife.jobs.has(b)&&cyclingClub.startTo(b,point)){setMode('follow');$('notice').textContent=b.name+'从当前位置上车，骑向'+landmark.name;}else $('notice').textContent='兔兔正在忙，或目的地暂无可通行道路。';};
