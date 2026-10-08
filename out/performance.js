import * as THREE from 'three';

// Preserve geometry, resolution and all light that can reach the image.
export function createPerformanceBudget(renderer, sun, scene, camera) {
  let mode='balanced';try{mode=localStorage.getItem('town-quality')==='clear'?'clear':'balanced';}catch{}
  const localLights=[];scene.traverse(o=>{if(o.isPointLight)localLights.push(o);});
  const frustum=new THREE.Frustum(),projection=new THREE.Matrix4(),sphere=new THREE.Sphere(),position=new THREE.Vector3();
  let due=0,last=0,shadowAt=-Infinity;
  const stats={frames:0,shadowUpdates:0,workMs:0,lastWorkMs:0,activeLights:0};
  const panel=document.createElement('details');panel.innerHTML='<summary>画质与省电</summary><button id="town-quality"></button><p style="font-size:11px;line-height:1.6">两种模式保持相同清晰度、模型细节与灯光。优美节能以30帧运行，流畅模式最高60帧。切到后台暂停画面。</p>';
  document.getElementById('panel').append(panel);const button=panel.querySelector('button');
  function apply(){
    renderer.setPixelRatio(Math.min(devicePixelRatio,1.6));renderer.setSize(innerWidth,innerHeight);
    renderer.shadowMap.autoUpdate=false;renderer.shadowMap.needsUpdate=true;
    if(sun.shadow.mapSize.x!==2048){sun.shadow.map?.dispose();sun.shadow.map=null;sun.shadow.mapSize.set(2048,2048);}
    button.textContent=mode==='balanced'?'优美节能 · 30帧':'流畅模式 · 60帧';due=0;shadowAt=-Infinity;
  }
  button.onclick=()=>{mode=mode==='balanced'?'clear':'balanced';try{localStorage.setItem('town-quality',mode);}catch{}apply();};
  document.addEventListener('visibilitychange',()=>{last=0;due=0;shadowAt=-Infinity;});
  function begin(now){
    if(document.hidden){last=0;return null;}
    const fps=mode==='balanced'?30:60,interval=1000/fps;
    if(now<due-.5)return null;
    due=now+interval-((now-due)%interval||0);
    const dt=last?Math.min((now-last)/1000,.1):1/fps;last=now;
    if(now-shadowAt>=(mode==='balanced'?65:16)){renderer.shadowMap.needsUpdate=true;shadowAt=now;stats.shadowUpdates++;}
    stats.frames++;return dt;
  }
  function prepareRender(){
    // Cull by a lamp's entire reach, not the lamp position: an offscreen lamp
    // still illuminates the scene whenever its sphere intersects the camera.
    camera.updateMatrixWorld();projection.multiplyMatrices(camera.projectionMatrix,camera.matrixWorldInverse);frustum.setFromProjectionMatrix(projection);
    stats.activeLights=0;
    for(const light of localLights){
      light.getWorldPosition(position);sphere.set(position,light.distance||Infinity);
      light.visible=light.intensity>0&&(!light.distance||frustum.intersectsSphere(sphere));
      if(light.visible)stats.activeLights++;
    }
  }
  apply();return {begin,prepareRender,stats,get mode(){return mode;}};
}
