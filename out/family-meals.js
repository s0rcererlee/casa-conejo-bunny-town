import * as THREE from 'three';

export function createFamilyMeals(scene,rabbits,{available,assign,jobs,release,note,groundHeight}){
 const [mother,,father]=rabbits;const group=new THREE.Group();group.name='Doudou family kitchen';group.position.set(-30,0,10);scene.add(group);
 const mat=c=>new THREE.MeshStandardMaterial({color:c,roughness:.8});
 function box(parent,x,y,z,w,h,d,m){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);parent.add(o);return o;}
 box(group,0,.28,0,1.3,.56,.7,mat(0xb78c63));const pan=new THREE.Mesh(new THREE.CylinderGeometry(.25,.2,.16,18),mat(0x6b7779));pan.position.set(0,.65,0);group.add(pan);
 const food=new THREE.Group();group.add(food);const dish=new THREE.Mesh(new THREE.CylinderGeometry(.3,.3,.035,20),mat(0xf2dfb8));food.add(dish);for(let i=0;i<5;i++){const f=new THREE.Mesh(new THREE.SphereGeometry(.08,10,8),mat(i%2?0x75a452:0xe16b78));f.position.set(Math.cos(i*1.3)*.16,.08,Math.sin(i*1.3)*.16);food.add(f);}food.position.set(.4,.62,0);food.visible=false;
 const spoon=box(group,0,.85,0,.04,.4,.07,mat(0xd4b68b));spoon.visible=false;
 const canvas=document.createElement('canvas');canvas.width=256;canvas.height=96;const ctx=canvas.getContext('2d');ctx.fillStyle='#fff0dd';ctx.fillRect(0,0,256,96);ctx.fillStyle='#a64d48';ctx.font='bold 27px sans-serif';ctx.textAlign='center';ctx.fillText('哼！忘记做饭啦',128,58);const angry=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(canvas),depthTest:false}));angry.scale.set(1.7,.64,1);angry.visible=false;scene.add(angry);
 let meal=null,clock=0,next=12;
 function finish(completed=false){if(!meal)return;for(const b of [mother,father]){if(jobs.get(b)?.meal)release(b);b.model.rotation.z=0;b.model.rotation.x=0;b.model.scale.set(1,1,1);}if(completed){mother.hunger=Math.max(0,mother.hunger-.6);father.hunger=Math.max(0,father.hunger-.25);mother.mealsReceived=(mother.mealsReceived||0)+1;note(meal.forgot?'豆豆补做好吃的，小白吃饱消气，蹭蹭他表示和好。':'豆豆做好草莓蔬菜拼盘，小白开心地吃起来。');}meal=null;food.visible=false;spoon.visible=false;angry.visible=false;next=clock+65+Math.random()*35;}
 function start(forgot=Math.random()<.22){if(meal||!available(mother)||!available(father))return false;
  if(!assign(father,-30,9,'给小白准备好吃的',Infinity,()=>{}))return false;jobs.get(father).meal=true;
  if(!assign(mother,-30,11.1,'等豆豆准备今天的美味',Infinity,()=>{})){release(father);return false;}jobs.get(mother).meal=true;
  meal={phase:'approach',age:0,total:0,forgot};note('小白：豆豆，今天给我做什么好吃的呀？');return true;
 }
 function update(dt,hour,manual){clock+=dt;if(!meal){if(clock>next&&hour>7&&hour<19&&!manual){next=clock+8;start();}return;}
  meal.total+=dt;if(hour>=20||hour<6||manual===mother||manual===father||!jobs.get(mother)?.meal||!jobs.get(father)?.meal||meal.total>100){finish();return;}
  if([mother,father].some(b=>jobs.get(b).path.length))return;meal.age+=dt;
  if(meal.phase==='approach'){meal.phase=meal.forgot?'forgot':'cook';meal.age=0;note(meal.forgot?'豆豆一时忘记做饭，小白鼓起脸：哼，我还饿着呢！':'豆豆开始拌草莓和嫩叶，认真给小白准备好吃的。');}
  if(meal.phase==='forgot'&&meal.age>7){meal.phase='cook';meal.age=0;note('豆豆：对不起，我这就做！小白坐在旁边等他补好。');}
  if(meal.phase==='cook'&&meal.age>7){meal.phase='eat';meal.age=0;note('豆豆端上好吃的：给最喜欢的小白，快尝尝！');}
  if(meal.phase==='eat'&&meal.age>5){finish(true);return;}
  jobs.get(mother).label=meal.phase==='forgot'?'气鼓鼓地跺脚：豆豆忘记做饭啦':meal.phase==='eat'?'吃豆豆做的草莓嫩叶拼盘':'等豆豆做好吃的';jobs.get(father).label=meal.phase==='forgot'?'发现忘记做饭，赶紧向小白道歉':meal.phase==='cook'?'认真为小白做好吃的':'陪小白吃饭';
  spoon.visible=meal.phase==='cook';spoon.rotation.z=Math.sin(clock*7)*.45;food.visible=meal.phase==='eat';angry.visible=meal.phase==='forgot';angry.position.copy(mother.root.position).add(new THREE.Vector3(0,1.4,0));
 }
 function pose(){if(!meal||meal.phase==='approach')return;if(meal.phase==='forgot'){mother.model.rotation.z=Math.sin(clock*12)*.045;mother.model.scale.set(1.05,1,1.04);mother.root.position.y=groundHeight(mother.root.position.x,mother.root.position.z)+Math.max(0,Math.sin(clock*9))*.035;}if(meal.phase==='cook')father.model.rotation.x=.12+Math.sin(clock*8)*.08;if(meal.phase==='eat'){mother.model.rotation.x=Math.sin(clock*12)*.09;food.position.copy(mother.root.position).sub(group.position).add(new THREE.Vector3(0,.35,-.25));}else food.position.set(.4,.62,0);}
 return {start,update,pose,get active(){return meal?.phase||null;}};
}
