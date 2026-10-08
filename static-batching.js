import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

// Batch only architectural pieces. Animated / seasonal objects retain their identity.
export function batchArchitecture(scene, loaded){
  loaded.updateMatrixWorld(true);const buckets=new Map();
  const architectural=/^(Casa|Sloping|Plaster|Campanario|Tower_roof|Garden_wall|Garden_arch|Village_lane|Bridge_|Riverbank|V3_Heritage|V3_Icon|V3_Region)/;
  const changing=/water|sea|flower|canopy|fruit|flag|cloth|door|wheel|ride|carrot|glass/i;
  loaded.traverse(o=>{
    if(!o.isMesh||!o.visible||!architectural.test(o.name)||changing.test(o.name)||Array.isArray(o.material)||o.material.transparent)return;
    let visible=true;o.traverseAncestors(p=>{if(!p.visible)visible=false;});if(!visible)return;
    const pos=new THREE.Vector3().setFromMatrixPosition(o.matrixWorld);
    const key=[o.material.uuid,Math.floor(pos.x/24),Math.floor(pos.z/24),o.castShadow,o.receiveShadow,Object.keys(o.geometry.attributes).sort().join(',')].join('/');
    if(!buckets.has(key))buckets.set(key,[]);buckets.get(key).push(o);
  });
  let originals=0,batches=0;
  for(const objects of buckets.values()){
    if(objects.length<3)continue;
    const geometries=objects.map(o=>{let g=o.geometry.clone();if(g.index){const flat=g.toNonIndexed();g.dispose();g=flat;}g.applyMatrix4(o.matrixWorld);return g;});
    const merged=mergeGeometries(geometries,false);geometries.forEach(g=>g.dispose());if(!merged)continue;
    const mesh=new THREE.Mesh(merged,objects[0].material);mesh.name='Batched architecture';mesh.castShadow=objects[0].castShadow;mesh.receiveShadow=objects[0].receiveShadow;scene.add(mesh);
    objects.forEach(o=>{o.visible=false;});originals+=objects.length;batches++;
  }
  return {originals,batches};
}
