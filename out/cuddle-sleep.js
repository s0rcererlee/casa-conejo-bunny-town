export function createCuddleSleep(rabbits){
 const pair=[rabbits[0],rabbits[2]];
 const originals=pair.map(b=>b.look.arms.map(a=>({position:a.position.clone(),rotation:a.rotation.clone(),scale:a.scale.clone()})));
 let cuddling=false;
 function reset(){pair.forEach((b,i)=>{b.look.arms.forEach((a,j)=>{a.position.copy(originals[i][j].position);a.rotation.copy(originals[i][j].rotation);a.scale.copy(originals[i][j].scale);});b.model.rotation.z=0;});cuddling=false;}
 return {update(time){
  const together=pair.every(b=>b.state==='sleep'&&!b.playerControlled&&!b.ride)&&pair[0].root.position.distanceTo(pair[1].root.position)<.9;
  if(!together){if(cuddling)reset();return;}
  cuddling=true;
  pair.forEach((b,i)=>{const inward=i===0?1:-1;b.root.rotation.y=inward*.18;b.model.rotation.z=-inward*.06;b.model.rotation.x=.10;b.model.scale.set(1.04,.69+Math.sin(time*1.6)*.012,1.03);
   const arm=b.look.arms[i===0?1:0];arm.position.set(inward*.31,.37,-.19);arm.rotation.set(-.7,0,-inward*.95);arm.scale.copy(originals[i][i===0?1:0].scale);arm.scale.y*=1.55;
   b.ears.forEach(e=>{e.rotation.x=-.22;e.rotation.z*=.65;});
  });
 }};
}
