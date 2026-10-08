import * as THREE from 'three';
export function createBunnyLook(model,variant=0){
 const material=c=>new THREE.MeshStandardMaterial({color:c,roughness:.95});const white=material(0xfffafb),pink=material(0xffcddd),blush=material(0xffdbe6),ink=material(0x783e54),tongue=material(0xf688a0);
 white.emissive.setHex(0x887d83);white.emissiveIntensity=.29;
 const outline=new THREE.MeshBasicMaterial({color:0x795166,side:THREE.BackSide});const geo=new THREE.SphereGeometry(1,24,16);
 function blob(parent,p,s,m,edge=false){const o=new THREE.Mesh(geo,m);o.position.set(...p);o.scale.set(...s);o.castShadow=true;parent.add(o);if(edge){const shell=new THREE.Mesh(geo,outline);shell.scale.setScalar(1.014);o.add(shell);}return o;}
 // One continuous pear-shaped surface joins the broad face to the little body.
 const profile=[[.018,.08,.07],[.05,.19,.14],[.14,.225,.17],[.26,.23,.18],[.35,.225,.18],[.40,.245,.20],[.46,.34,.24],[.55,.395,.265],[.67,.395,.27],[.78,.35,.24],[.87,.25,.18],[.925,.10,.075],[.935,.001,.001]];
 const rings=new THREE.CatmullRomCurve3(profile.map(p=>new THREE.Vector3(...p))).getPoints(120).map(p=>[p.x,Math.max(.001,p.y),Math.max(.001,p.z)]);

 const v=[],f=[];for(const [y,rx,rz] of rings)for(let j=0;j<48;j++){const a=j*Math.PI*2/48;const hip=variant===0&&y<.4?Math.sin(Math.PI*Math.max(0,y)/.4)**2:0;const rear=Math.max(0,Math.sin(a));v.push(rx*Math.cos(a)*(1+.22*hip),y,rz*Math.sin(a)+.085*hip*rear);}
 for(let i=0;i<rings.length-1;i++)for(let j=0;j<48;j++){const k=i*48+j,n=i*48+(j+1)%48;f.push(k,n+48,n,k,k+48,n+48);}
 const bodyGeo=new THREE.BufferGeometry();bodyGeo.setAttribute('position',new THREE.Float32BufferAttribute(v,3));bodyGeo.setIndex(f);bodyGeo.computeVertexNormals();const body=new THREE.Mesh(bodyGeo,white);body.castShadow=true;model.add(body);
 blob(model,[0,.23,variant===0?.27:.19],[.095,.095,.095],white,true);
 const canvas=document.createElement('canvas');canvas.width=canvas.height=128;const ctx=canvas.getContext('2d'),gradient=ctx.createRadialGradient(64,64,10,64,64,64);gradient.addColorStop(0,'rgba(255,174,204,.65)');gradient.addColorStop(.55,'rgba(255,193,217,.43)');gradient.addColorStop(1,'rgba(255,216,229,0)');ctx.fillStyle=gradient;ctx.fillRect(0,0,128,128);const blushMap=new THREE.CanvasTexture(canvas);blushMap.colorSpace=THREE.SRGBColorSpace;
 const ears=[],feet=[],eyes=[],arms=[];const eyeMaterial=new THREE.MeshStandardMaterial({color:0x663344,roughness:.24});const glint=new THREE.MeshBasicMaterial({color:0xfff9f7});
 for(const side of [-1,1]){
  const ear=new THREE.Group();ear.position.set(side*.29,.79,.08);ear.rotation.z=side*.10;model.add(ear);
  blob(ear,[side*.055,-.23,0],[.08,variant===0||side<0?.30:.20,.065],white,true);
  blob(ear,[side*.055,-.23,-.058],[.047,variant===0||side<0?.255:.15,.011],pink);
  // Gently bend the tip outward and toward the cheek, including its inner lining.
  for(const piece of ear.children){const shaped=piece.geometry.clone(),p=shaped.attributes.position;for(let k=0;k<p.count;k++){const y=p.getY(k),bend=(1-y)*.5;p.setX(k,p.getX(k)+side*.38*bend*bend);p.setZ(k,p.getZ(k)-.16*bend*bend);}shaped.computeVertexNormals();piece.geometry=shaped;for(const shell of piece.children)shell.geometry=shaped;}
  ears.push(ear);
  const arm=blob(model,[side*.211,.345,-.043],[.048,.072,.055],white,false);arm.rotation.z=side*1.0;arms.push(arm);
  const foot=blob(model,[side*.14,.033,-.01],[.075,.043,.088],white,false);feet.push(foot);
  const eye=blob(model,[side*.133,.665,-.257],[.025,.027,.007],eyeMaterial);eye.userData.baseX=side*.133;if(variant===0){eye.scale.x*=1.08;eyeMaterial.color.setHex(0x713d50);}eyes.push(eye);const shine=new THREE.Mesh(geo,glint);shine.position.set(-.27,.34,-.95);shine.scale.set(.19,.17,.09);eye.add(shine);if(variant===0){shine.scale.set(.23,.21,.10);const sparkle=new THREE.Mesh(geo,glint);sparkle.position.set(.30,-.29,-.98);sparkle.scale.set(.09,.08,.06);eye.add(sparkle);}
  // Conform blush to the curved face, avoiding raised cheek spheres.
  const faceZ=(x,y)=>{let k=0;while(k<rings.length-2&&rings[k+1][0]<y)k++;const a=rings[k],b=rings[k+1],t=(y-a[0])/(b[0]-a[0]),rx=a[1]+(b[1]-a[1])*t,rz=a[2]+(b[2]-a[2])*t;return -rz*Math.sqrt(Math.max(.01,1-(x/rx)**2))-.008;};const verts=[side*.225,.588,faceZ(side*.225,.588)],idx=[];for(let j=0;j<=40;j++){const a=j*Math.PI*2/40,x=side*.225+.075*Math.cos(a),y=.588+.065*Math.sin(a);const depth=.242*Math.sqrt(Math.max(.01,1-(x/.355)**2));verts.push(x,y,faceZ(x,y));if(j<40)idx.push(0,j+1,j+2);}
  const uv=[.5,.5];for(let j=0;j<=40;j++){const a=j*Math.PI*2/40;uv.push(.5+.5*Math.cos(a),.5+.5*Math.sin(a));}const cg=new THREE.BufferGeometry();cg.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));cg.setAttribute('position',new THREE.Float32BufferAttribute(verts,3));cg.setIndex(idx);cg.computeVertexNormals();const cheek=new THREE.Mesh(cg,new THREE.MeshBasicMaterial({map:blushMap,transparent:true,depthWrite:false,side:THREE.DoubleSide}));model.add(cheek);
 }
 blob(model,[0,.619,-.275],[.014,.009,.004],pink);
 // Small smiling mouth and pink tongue, inspired by the reference drawing.
 const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(-.049,.6,-.274),new THREE.Vector3(-.022,.592,-.276),new THREE.Vector3(0,.598,-.277),new THREE.Vector3(.025,.592,-.276),new THREE.Vector3(.045,.6,-.274)]);
 model.add(new THREE.Mesh(new THREE.TubeGeometry(curve,24,.0045,6,false),ink));
 const mouth=blob(model,[.004,.576,-.273],[.018,.027,.006],tongue);
 const flower=new THREE.Group();if(variant===0)flower.scale.setScalar(.92);flower.position.set(-.27,.845,-.16);model.add(flower);
 const petal=variant===1?material(0xffdfab):variant===2?material(0xd5c9f6):pink;
 for(let i=0;i<5;i++){const a=i*Math.PI*2/5;blob(flower,[.036*Math.cos(a),.036*Math.sin(a),0],[.032,.028,.009],petal);}
 blob(flower,[0,0,-.012],[.017,.017,.011],white);
 let gaze=0,lookY=0;
 return {ears,feet,eyes,arms,mouth,flower,animate(time,state,moving,target){
  const attentive=['sniff','search','dig'].includes(state),sleeping=state==='sleep';
  const desired=target?THREE.MathUtils.clamp(target.x/Math.max(.5,Math.abs(target.z)),-1,1):Math.sin(Math.floor(time/3.6)*1.7+variant)*.23;
  gaze+=(desired-gaze)*.06;lookY+=((attentive?.004:0)-lookY)*.08;
  const blink=(time+variant*1.37)%5.3,close=sleeping?1:blink<.10?Math.sin(blink/.10*Math.PI):blink>.21&&blink<.28?Math.sin((blink-.21)/.07*Math.PI):0;
  eyes.forEach(e=>{e.scale.y=.028*(1-close*.92);e.position.x=e.userData.baseX+gaze*.007;e.position.y=.667+lookY;e.position.z=-.261;});
  ears.forEach((e,j)=>{const side=j?1:-1;e.rotation.z=side*.10+Math.sin(time*(moving?8:1.9)+j)*(moving?.09:.025)+(attentive&&j===1?.08:0);e.rotation.x=sleeping?-.15:Math.sin(time*2.5+j)*.035+(attentive&&j===1?.09:0);});
  // A small curious tilt, with no constant tongue-out expression.
  model.rotation.z=sleeping?0:Math.sin(time*.75+variant)*(attentive?.03:.005);
  mouth.visible=state==='eat'||state==='play'||(!moving&&!sleeping&&time%12>(variant===0?11.3:10.5));
  mouth.scale.y=.027*(state==='eat'?1+Math.sin(time*12)*.18:1);flower.rotation.z=Math.sin(time*1.7)*.025;if(variant===0){flower.rotation.z-=.12;const softLook=attentive&&!moving&&!sleeping;model.rotation.z+=softLook?.018*Math.sin(time*.9):0;}
 }};
}
