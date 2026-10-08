from pathlib import Path
p=Path(__file__).with_name('build_town.py');s=p.read_text()
s=s.replace('# Garden rows and carrots\ncarrots=[]', '''# Secret garden: open arch on the east side, enclosed shaded courtyard.
cube('Secret garden / tiled floor',(-23,0,.035),(10,10,.07),sand)
for x,y,w,d in [(-28,0,.32,10),(-23,-5,10,.32),(-23,5,10,.32),(-18,-3.35,.32,3.3),(-18,3.35,.32,3.3)]:
 cube('Garden wall',(x,y,.85),(w,d,1.7),white,.06);coll.append([x,y,w/2,d/2])
for y in [-1.7,1.7]:cube('Garden arch pillar',(-18,y,1.5),(.65,.5,3),sand,.05)
for k in range(13):
 a=k*math.pi/12;o=cube('Garden arch stone',(-18,1.7*math.cos(a),2.9+1.7*math.sin(a)),(.6,.45,.47),white,.03);o.rotation_euler.x=a
for x in [-27,-19]:
 for y in [-4,4]:
  cyl('Garden terracotta pot',(x,y,.3),.35,.6,roof,r2=.45)
  for k in range(5):sphere('Garden flowering shrub',(x+random.uniform(-.35,.35),y+random.uniform(-.35,.35),.9+random.random()*.4),(.3,.3,.4),pink)
for x in [-26,-22]:
 for y in [-3.5,-.5]:cyl('Pergola post',(x,y,1.4),.085,2.8,wood)
for i in range(9):cube('Pergola shade slat',(-26+i*.5,-2,2.8),(.15,3.6,.13),wood)
for i in range(10):sphere('Pergola flowers',(-26+random.random()*4,-3.5,2.9),(.4,.4,.26),pink)
sphere('Rabbit nest / moss',(-24,-2,.15),(1.3,.95,.17),green,2)
for i in range(10):
 a=i*math.tau/10;sphere('Nest / pebbles',(-24+1.4*math.cos(a),-2+1.05*math.sin(a),.15),(.16,.13,.1),sand)
for y in [1.7,3.2]:cube('Secret garden bed',(-24,y,.10),(5,.9,.2),wood)
carrots=[[-26,1.7],[-24,1.7],[-22,1.7],[-25,3.2],[-23,3.2]]''')
p.write_text(s)
p=Path(__file__).with_name('index.html');s=p.read_text().replace('canvas{display:block}','canvas{display:block}header{background:#fff9ebc9;padding:14px 18px;border-radius:14px}select{width:100%;padding:8px;border:1px solid #d8c9af;border-radius:8px;background:#fffaf0;color:#3d593f}#needs{font-size:12px;line-height:1.8}#notice{color:#826138;font-size:12px;margin-top:10px}')
s=s.replace('<button id="rabbit">控制兔子</button>','<button id="rabbit">控制兔子</button><button id="follow">跟随观察</button>')
s=s.replace('<label>一天的时光','<label>认识小居民</label><select id="resident" aria-label="选择兔子"><option value="0">小白 · 好奇的探险家</option><option value="1">奶糖 · 慢悠悠的美食家</option><option value="2">豆豆 · 精力旺盛</option></select><div id="needs"></div><button id="garden" style="margin-top:10px">带我去秘密花园</button><div id="notice">拱门后面，藏着一片安静的庭院。</div><label>一天的时光')
s=s.replace('<b>小白</b>','<b id="rabbit-name">小白</b>').replace('3 只兔子正在小镇生活','3 只兔子拥有自己的作息')
p.write_text(s)
p=Path(__file__).with_name('world.js');s=p.read_text()
s=s.replace("const leaves=[],drops=[];", "const leaves=[],drops=[],cameraBoxes=[];")
s=s.replace('// Blender Z-up', "loaded.scene.updateMatrixWorld(true);loaded.scene.traverse(o=>{if(o.isMesh&&/^(Casa|Sloping|Plaster_gable|Campanario|Tower_roof|Garden_wall|Garden_arch|Pergola)/.test(o.name))cameraBoxes.push(new THREE.Box3().setFromObject(o).expandByScalar(.2));});\n// Blender Z-up")
s=s.replace("phase:i*2,hop:0", "phase:i*2,hop:0,hunger:.65+i*.06,fatigue:.1+i*.08,visitedGarden:false,destination:null,afterArrival:null,name:['小白','奶糖','豆豆'][i],personality:i,stuck:0")
s=s.replace("b.path=p;b.state='run';return;", "b.path=p;b.state='sniff';b.timer=1.4;return;")
s=s.replace("eaten++;$('eaten')", "b.hunger=Math.max(0,b.hunger-.44);eaten++;$('eaten')")
s=s.replace("let mode='orbit',cycling=true,hour=10;", "let mode='orbit',cycling=true,hour=10,selected=0;const gardenSpot=new THREE.Vector3(-24,.1,2);const restSpots=[gardenSpot,new THREE.Vector3(-4,.1,6),new THREE.Vector3(17,.1,-6)];")
a=s.index('function setMode(');b=s.index("$('loading').remove()",a)
s=s[:a]+'''function setMode(m){const previous=mode;mode=m;for(const id of ['orbit','rabbit','follow'])$(id).classList.toggle('active',m===id);controls.enabled=m!=='follow';if(m!=='orbit'){const p=rabbits[selected].root.position;camera.position.copy(p).add(new THREE.Vector3(0,4,7));controls.target.copy(p);}if(previous==='rabbit'&&m!=='rabbit'){rabbits[selected].state='search';rabbits[selected].timer=0;}}
$('orbit').onclick=()=>setMode('orbit');$('rabbit').onclick=()=>setMode('rabbit');$('follow').onclick=()=>setMode('follow');
$('resident').onchange=e=>{if(mode==='rabbit'){rabbits[selected].state='search';rabbits[selected].timer=0;}selected=+e.target.value;setMode(mode);};
$('home').onclick=()=>{setMode('orbit');camera.position.set(31,32,39);controls.target.set(0,0,0);};
$('cycle').onclick=()=>{cycling=!cycling;$('cycle').classList.toggle('active',cycling);$('cycle').textContent='昼夜流转 · '+(cycling?'开':'停');};$('sun').oninput=e=>{hour=+e.target.value;};
function goTo(b,point,after){const path=pathfind(b.root.position,point);if(!path.length){b.state='search';b.timer=2;return false;}b.target=null;b.destination=point.clone();b.path=path;b.state='travel';b.afterArrival=after;return true;}
function goRest(b,night){const spots=[...restSpots].sort((a,c)=>a.distanceToSquared(b.root.position)-c.distanceToSquared(b.root.position));for(const p of spots)if(goTo(b,p,night?'sleep':'rest'))return;}
$('garden').onclick=()=>{setMode('follow');if(goTo(rabbits[selected],gardenSpot,'rest'))$('notice').textContent='跟着'+rabbits[selected].name+'穿过拱门，去庭院休息。';else $('notice').textContent='暂时找不到通路，请先带兔子回到街道。';};
function decide(b){const night=hour>=20||hour<6;if(night){goRest(b,true);return;}if(b.fatigue>.72){goRest(b,false);return;}if(b.hunger>.38){choose(b);return;}if(!b.visitedGarden){goTo(b,gardenSpot,'rest');return;}b.state='groom';b.timer=3+Math.random()*3;}
const cameraRay=new THREE.Ray();let cameraClipped=false;
function clipCamera(target,desired){const direction=desired.clone().sub(target),distance=direction.length();direction.normalize();cameraRay.set(target,direction);let allowed=distance;for(const box of cameraBoxes){const hit=cameraRay.intersectBox(box,new THREE.Vector3());if(hit)allowed=Math.min(allowed,Math.max(.35,target.distanceTo(hit)-.2));}cameraClipped=allowed<distance-.01;return target.clone().addScaledVector(direction,allowed);}
function updateFollow(dt){const b=rabbits[selected],target=b.root.position.clone().add(new THREE.Vector3(0,.65,0));let desired;
if(mode==='follow'){const back=new THREE.Vector3(Math.sin(b.root.rotation.y)*6,3.8,Math.cos(b.root.rotation.y)*6);desired=target.clone().add(back);camera.position.lerp(desired,1-Math.exp(-dt*3));desired=camera.position.clone();}else desired=camera.position.clone();camera.position.copy(clipCamera(target,desired));camera.lookAt(target);controls.target.copy(target);}
''' +s[b:]
a=s.index('for(let i=0;i<rabbits.length;i++){',s.index('function tick'));b=s.index("leaves.forEach",a)
s=s[:a]+'''for(let i=0;i<rabbits.length;i++){const b=rabbits[i],p=b.root.position;let moving=false,dx=0,dz=0;const manual=mode==='rabbit'&&i===selected,night=hour>=20||hour<6;
b.hunger=Math.min(1,b.hunger+dt*(i===1?.009:.006));b.timer-=dt;b.model.rotation.x=0;b.model.scale.set(1,1,1);
if(manual){camera.getWorldDirection(forward);forward.y=0;forward.normalize();right.crossVectors(forward,new THREE.Vector3(0,1,0));const f=(keys.has('KeyW')?1:0)-(keys.has('KeyS')?1:0),r=(keys.has('KeyD')?1:0)-(keys.has('KeyA')?1:0);dx=forward.x*f+right.x*r;dz=forward.z*f+right.z*r;const len=Math.hypot(dx,dz);if(len){const speed=keys.has('ShiftLeft')?4.7:2.5;dx=dx/len*speed*dt;dz=dz/len*speed*dt;moving=true;}if(keys.has('Space')&&p.y<=.105)b.vy=4.2;for(const c of carrots)if(c.alive&&p.distanceTo(c.group.position)<.65)eat(b,c);}
else{
 if(b.state==='sleep'){b.fatigue=Math.max(0,b.fatigue-dt*.1);b.model.scale.set(1.07,.64+Math.sin(elapsed*2)*.025,1.1);if(!night){b.state='groom';b.timer=2;}}
 else if(b.state==='rest'){b.fatigue=Math.max(0,b.fatigue-dt*.09);b.model.scale.set(1.05,.72+Math.sin(elapsed*2)*.02,1.05);if(night)b.state='sleep';else if(b.timer<=0){b.state='search';b.timer=0;}}
 else if(b.state==='groom'){b.model.rotation.x=.1*Math.sin(elapsed*7);if(b.timer<=0){b.state='search';b.timer=0;}}
 else if(b.state==='eat'){b.model.rotation.x=.13*Math.sin(elapsed*15);if(b.timer<=0){b.state='search';b.timer=0;}}
 else if(b.state==='dig'){b.model.rotation.x=.22+Math.sin(elapsed*12)*.08;if(!b.target?.alive){b.state='search';b.timer=0;}else if(b.timer<=0)eat(b,b.target);}
 else if(b.state==='sniff'){b.model.rotation.x=.06*Math.sin(elapsed*9);if(b.timer<=0)b.state='run';}
 else{
  if(night&&b.state!=='travel'){goRest(b,true);}
  if(b.target&&!b.target.alive){b.state='search';b.timer=0;}
  if(b.state==='search'&&b.timer<=0)decide(b);
  if(b.state==='run'||b.state==='travel'){
   const target=b.path[0];if(target){const x=target.x-p.x,z=target.z-p.z,len=Math.hypot(x,z);if(len<.14)b.path.shift();else{const dist=Math.min(len,dt*(i===1?1.5:i===2?2.2:1.8));dx=x/len*dist;dz=z/len*dist;moving=true;}}
   if(b.state==='run'&&b.target&&p.distanceTo(b.target.group.position)<.6){b.state='dig';b.timer=1.5;b.path=[];moving=false;dx=dz=0;}
   else if(b.state==='travel'&&!b.path.length){b.state=b.afterArrival;b.timer=9+Math.random()*4;b.destination=null;}
   else if(b.state==='run'&&!b.path.length){b.state='search';b.timer=.2;}
  }
 }
}
const old=p.clone();moveBody(b.root,dx,dz);if(moving){b.fatigue=Math.min(1,b.fatigue+dt*.012);b.root.rotation.y=Math.atan2(-dx,-dz);if(p.y<=.105&&b.hop<=0){b.vy=1.7;b.hop=.25;}if(Math.hypot(p.x-old.x,p.z-old.z)<.001){b.stuck+=dt;if(b.stuck>2&&!manual){b.state='search';b.timer=.4;b.path=[];b.stuck=0;}}else b.stuck=0;}
b.hop-=dt;b.vy-=9.81*dt;p.y+=b.vy*dt;if(p.y<.1){p.y=.1;b.vy=0;}
b.ears.forEach((e,j)=>{e.rotation.x=b.state==='sleep'?-.9:.08+Math.sin(elapsed*12+b.phase)*.17*(moving?1:.25);e.rotation.z=(j?1:-1)*.10;});b.feet.forEach((f,j)=>{f.rotation.x=moving?Math.sin(elapsed*14+j%2*Math.PI)*.4:b.state==='dig'&&j%2===0?Math.sin(elapsed*18)*.6:b.state==='groom'&&j%2===0?-.6+Math.sin(elapsed*8)*.2:0;});
if(p.distanceTo(gardenSpot)<3&&!b.visitedGarden){b.visitedGarden=true;if(i===selected)$('notice').textContent='发现秘密花园！这里有新鲜胡萝卜和阴凉的小窝。';}
if(mode==='rabbit'&&i===selected){camera.position.add(p.clone().sub(old));controls.target.copy(p).add(new THREE.Vector3(0,.65,0));}
}
const active=rabbits[selected];const labels={search:'正在寻找下一棵胡萝卜',sniff:'竖起耳朵，闻到了胡萝卜',run:'循着气味去找胡萝卜',dig:'正在刨土挖胡萝卜',eat:'正津津有味地吃胡萝卜',travel:active.afterArrival==='sleep'?'准备回窝睡觉':'沿着小路寻找阴凉',rest:'吃饱了，在阴凉处休息',sleep:'蜷在小窝里睡着了',groom:'正在洗脸、整理毛发'};
$('rabbit-name').textContent=active.name;$('behavior').textContent=mode==='rabbit'?'跟着你一起探索':labels[active.state];$('needs').textContent='饥饿 '+Math.round(active.hunger*100)+'% · 疲倦 '+Math.round(active.fatigue*100)+'%';
''' +s[b:]
s=s.replace('controls.update();renderer.render(scene,camera);','controls.update();if(mode!==\'orbit\')updateFollow(dt);renderer.render(scene,camera);')
s=s.replace('scene,get eaten()', 'scene,camera,cameraBoxes,clipCamera,goTo,gardenSpot,get cameraClipped(){return cameraClipped},get mode(){return mode},get selected(){return selected},get eaten()')
p.write_text(s)
