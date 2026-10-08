import {readFileSync,writeFileSync,mkdirSync,copyFileSync,readdirSync} from 'node:fs';
import path from 'node:path';
const seen=new Set();
function copy(relative){
  if(seen.has(relative))return; seen.add(relative);
  const dest=path.join('out',relative.replace(/^node_modules\//,'vendor/'));mkdirSync(path.dirname(dest),{recursive:true});copyFileSync(relative,dest);
  if(relative==='index.html')writeFileSync(dest,readFileSync(relative,'utf8').replaceAll('./node_modules/','./vendor/'));
  if(!relative.endsWith('.js'))return;
  const source=readFileSync(relative,'utf8');
  for(const m of source.matchAll(/(?:^|;)\s*(?:import|export)\s+(?:[^;]*?\s+from\s*)?['"]([^'"]+)['"]/gm)){
    let dep=m[1].split('?')[0];
    if(dep==='three')dep='node_modules/three/build/three.module.js';
    else if(dep.startsWith('three/addons/'))dep=dep.replace('three/addons/','node_modules/three/examples/jsm/');
    else if(dep.startsWith('.'))dep=path.normalize(path.join(path.dirname(relative),dep));
    else throw new Error('Unresolved import '+dep);
    copy(dep);
  }
}
for(const file of ['index.html','world.js','world.json','town.glb'])copy(file);
for(const file of readdirSync('audio'))if(/\.(mp3|md)$/i.test(file))copy('audio/'+file);
copy('node_modules/three/LICENSE');
console.log('Prepared '+seen.size+' public files');
