import * as THREE from 'three';

export function createPlayerFarm(scene,economy,{camera,canvas,focus}){
 const key='bunny-player-farm-v1';
 let data={energy:100,seeds:6,berries:0,harvested:0,reward:false,day:1,plots:Array.from({length:6},()=>({stage:'empty',growth:0}))};
 try{const s=JSON.parse(localStorage.getItem(key));if(s&&s.plots?.length===6){for(const k of ['energy','seeds','berries','harvested','day'])if(Number.isFinite(s[k]))data[k]=Math.max(0,Math.min(10000,s[k]));data.reward=s.reward===true;data.plots=s.plots.map(p=>({stage:['empty','seed','watered','ripe'].includes(p.stage)?p.stage:'empty',growth:Math.max(0,Math.min(60,Number(p.growth)||0))}));}}catch{}
 let selected=0,tool='plant',lastHour=null,timer=0,clock=0;let access=null;
 const allowed=(type,i)=>!access||access(type,i);
 function advanceDay(){lastHour=7;data.day++;data.energy=100;data.harvested=0;data.reward=false;for(const p of data.plots){if(p.stage==='watered'){p.growth=Math.min(60,p.growth+30);p.stage=p.growth>=60?'ripe':'seed';}}save();render();}

 const root=new THREE.Group();root.name='Player strawberry allotment';scene.add(root);
 scene.updateMatrixWorld(true);scene.traverse(o=>{if(o.isMesh&&/olive|tree|trunk/i.test(o.name)){const p=o.getWorldPosition(new THREE.Vector3());if(Math.abs(p.x+31.7)<4&&Math.abs(p.z-17.6)<3.5)o.visible=false;}});
 const soil=new THREE.MeshStandardMaterial({color:0x85604a}),leaf=new THREE.MeshStandardMaterial({color:0x6a9d57}),fruit=new THREE.MeshStandardMaterial({color:0xe05f75});
 const plots=[];for(let i=0;i<6;i++){const x=-33+(i%3)*1.3,z=17+Math.floor(i/3)*1.3;const bed=new THREE.Mesh(new THREE.BoxGeometry(1.1,.18,1.1),soil.clone());bed.position.set(x,.19,z);bed.userData.plot=i;root.add(bed);const plants=new THREE.Group();plants.position.set(x,.3,z);root.add(plants);const berries=[];for(let j=0;j<4;j++){const a=j*Math.PI/2;const l=new THREE.Mesh(new THREE.SphereGeometry(.17,8,6),leaf);l.scale.set(1,.3,1);l.position.set(Math.cos(a)*.2,.08,Math.sin(a)*.2);plants.add(l);const f=new THREE.Mesh(new THREE.SphereGeometry(.11,8,6),fruit);f.position.set(Math.cos(a)*.2,.2,Math.sin(a)*.2);plants.add(f);berries.push(f);}plots.push({bed,plants,berries});}
 const panel=document.createElement('details');panel.open=true;panel.innerHTML='<summary>我的海岛农场</summary><p>你是海岛的新邻居。选工具，再点击菜地；也可用下面的地块按钮。</p><p data-stats></p><div class="row"><button data-tool="plant">播种</button><button data-tool="water">浇水</button><button data-tool="harvest">收获</button></div><div data-plots style="display:grid;grid-template-columns:repeat(3,1fr);gap:5px;margin-top:8px"></div><div class="row" style="margin-top:8px"><button data-focus>去我的农场</button><button data-buy>买种子 · 2 贝币</button><button data-sell>卖给商船</button><button data-rest>休息片刻</button></div><p data-quest></p><button data-reward>领取委托奖励</button><p data-message role="status" style="font-size:12px;line-height:1.6">第一天的礼物：6 包草莓种子。试着播种、浇水吧！</p>';document.getElementById('panel').append(panel);
 const names={empty:'空地',seed:'待浇水',watered:'生长中',ripe:'可收获'};
 function save(){try{localStorage.setItem(key,JSON.stringify(data));}catch{}economy.save();}
 function message(t){panel.querySelector('[data-message]').textContent=t;render();}
 function render(){panel.querySelector('[data-stats]').textContent=`第 ${data.day} 天 · 体力 ${Math.floor(data.energy)}/100 · 种子 ${data.seeds} · 草莓 ${data.berries} · 家庭贝币 ${economy.state.coins}`;panel.querySelector('[data-quest]').textContent=`今日委托：收获草莓 ${Math.min(3,data.harvested)}/3 · 奖励 12 贝币`;panel.querySelector('[data-reward]').disabled=data.harvested<3||data.reward;panel.querySelector('[data-reward]').textContent=data.reward?'今日奖励已领取':'领取委托奖励';for(let i=0;i<6;i++){const p=data.plots[i],v=plots[i];buttons[i].textContent=`${i+1} · ${names[p.stage]}`;buttons[i].classList.toggle('active',selected===i);v.bed.material.color.set(p.stage==='watered'?0x573e32:0x85604a);v.plants.visible=p.stage!=='empty';v.plants.scale.setScalar(p.stage==='seed'?.35:.4+.6*p.growth/60);v.berries.forEach(b=>b.visible=p.stage==='ripe');}}
 function act(i){if(!allowed('plot',i)){message('请走到这块菜地旁边再使用工具。');return;}selected=i;const p=data.plots[i];if(data.energy<5){message('体力不足，休息一下或等明天恢复。');return;}
  if(tool==='plant'){if(p.stage!=='empty'){message('这块地已经种了草莓。');return;}if(!data.seeds){message('种子用完了，可以花 2 贝币买一包。');return;}data.seeds--;p.stage='seed';p.growth=0;message('种下了草莓种子，接下来给它浇水。');}
  if(tool==='water'){if(p.stage!=='seed'){message('只有刚播种的地块需要浇水。');return;}p.stage='watered';message('浇好水了，睡觉后生长一阶段；浇水照料两天就能收获。');}
  if(tool==='harvest'){if(p.stage!=='ripe'){message('草莓还没成熟，先照料其他地块吧。');return;}p.stage='empty';p.growth=0;data.berries+=2;data.harvested+=2;message('收获了 2 份草莓！可以留下，或等商船靠港出售。');}
  data.energy-=5;save();render();
 }
 const buttons=data.plots.map((_,i)=>{const b=document.createElement('button');b.onclick=()=>act(i);panel.querySelector('[data-plots]').append(b);return b;});
 panel.querySelectorAll('[data-tool]').forEach(b=>{b.onclick=()=>{tool=b.dataset.tool;panel.querySelectorAll('[data-tool]').forEach(x=>x.classList.toggle('active',x===b));};});panel.querySelector('[data-tool]').classList.add('active');
 panel.querySelector('[data-focus]').onclick=()=>focus([-28,7,24],[-31.7,.3,17.6]);
 panel.querySelector('[data-buy]').onclick=()=>{if(!allowed('buy')){message('请走到对应地点，按互动键操作。');return;}if(economy.state.coins<2){message('贝币不够，先完成委托或出售草莓。');return;}economy.state.coins-=2;data.seeds++;save();message('买到一包草莓种子。');};
 panel.querySelector('[data-sell]').onclick=()=>{if(!allowed('sell')){message('请走到对应地点，按互动键操作。');return;}if(!economy.shipDocked){message('商船还未靠港，请留意海岛贸易港的消息。');return;}if(!data.berries){message('背包里还没有草莓。');return;}const earned=data.berries*4;economy.state.coins+=earned;data.berries=0;save();message(`草莓已交给商船，收入 ${earned} 贝币。`);};
 panel.querySelector('[data-reward]').onclick=()=>{if(!allowed('reward')){message('请走到对应地点，按互动键操作。');return;}if(data.reward||data.harvested<3)return;data.reward=true;economy.state.coins+=12;save();message('完成今日委托，收到 12 贝币！');};
 let resting=false;panel.querySelector('[data-rest]').onclick=()=>{if(!allowed('rest')){message('请走到对应地点，按互动键操作。');return;}resting=!resting;panel.querySelector('[data-rest]').textContent=resting?'结束休息':'休息片刻';message(resting?'休息时每秒恢复 2 点体力。':'休息好了，继续照料农场。');};
 render();return {data,act,plots,panel,save,message,advanceDay,setAccess(fn){access=fn;},setTool(v){if(['plant','water','harvest'].includes(v))tool=v;},update(dt,hour,season){clock+=dt;if(lastHour!==null&&lastHour>20&&hour<6)advanceDay();lastHour=hour;let changed=false;if(resting)data.energy=Math.min(100,data.energy+dt*2);timer+=dt;if(timer>1){timer=0;render();}if(changed||clock>10){clock=0;save();}}};
}
