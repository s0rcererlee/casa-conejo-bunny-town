import * as THREE from 'three';
// Original painted motifs on blank side walls, leaving doors and windows clear.
export function createMurals(scene,town){
 const palette=['#df704f','#edb840','#247d89','#e9d6b4','#4b6473','#cb708a'];
 function texture(kind){const c=document.createElement('canvas');c.width=c.height=768;const g=c.getContext('2d');
 const disk=(x,y,r,color)=>{g.fillStyle=color;g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.fill();};
 const line=(pts,color,w)=>{g.strokeStyle=color;g.lineWidth=w;g.lineCap='round';g.lineJoin='round';g.beginPath();pts.forEach(([x,y],i)=>i?g.lineTo(x,y):g.moveTo(x,y));g.stroke();};
 // Soft-edged painted field with visible plaster around the mural.
 g.fillStyle='#f3e6ce';g.beginPath();g.roundRect(40,40,688,688,85);g.fill();
 if(kind===0){disk(380,285,128,palette[1]);for(let i=0;i<12;i++){const a=i*Math.PI/6;line([[380+152*Math.cos(a),285+152*Math.sin(a)],[380+187*Math.cos(a),285+187*Math.sin(a)]],palette[0],12);}disk(340,275,9,palette[4]);disk(420,275,9,palette[4]);g.strokeStyle=palette[4];g.lineWidth=7;g.beginPath();g.arc(380,285,49,.2,Math.PI-.2);g.stroke();for(let i=0;i<3;i++){g.strokeStyle=palette[i===1?0:2];g.lineWidth=26;g.beginPath();g.moveTo(95,530+i*52);g.bezierCurveTo(260,440+i*52,470,640+i*52,674,530+i*52);g.stroke();}}
 if(kind===1){for(let row=0;row<7;row++)for(let col=0;col<7;col++){const x=83+col*86,y=83+row*86;g.fillStyle=palette[(row*3+col*2)%6];g.beginPath();g.moveTo(x+3,y+3);g.lineTo(x+80,y+8);g.lineTo(x+6,y+79);g.closePath();g.fill();g.fillStyle=palette[(row+col+1)%6];g.beginPath();g.moveTo(x+82,y+14);g.lineTo(x+81,y+82);g.lineTo(x+14,y+81);g.closePath();g.fill();}}
 if(kind===2){line([[375,630],[375,300]],palette[2],18);for(const [x,y,s] of [[250,440,-1],[500,520,1]]){g.fillStyle=palette[2];g.beginPath();g.ellipse(x,y,100,37,s*.5,0,Math.PI*2);g.fill();}for(let i=0;i<8;i++){const a=i*Math.PI/4;disk(375+100*Math.cos(a),275+100*Math.sin(a),64,palette[i%2?5:0]);}disk(375,275,68,palette[1]);disk(355,259,13,'#f5e7ca');}
 if(kind===3){g.save();g.translate(384,390);g.rotate(.35);g.fillStyle=palette[0];g.beginPath();g.ellipse(0,125,140,146,0,0,Math.PI*2);g.fill();g.beginPath();g.ellipse(0,-25,110,105,0,0,Math.PI*2);g.fill();g.fillStyle=palette[4];g.fillRect(-25,-240,50,240);disk(0,45,48,palette[4]);g.fillStyle=palette[1];g.fillRect(-35,-300,70,75);for(let i=-2;i<=2;i++)line([[i*7,-272],[i*7,207]],'#efdbb4',2);g.restore();for(const [x,y] of [[140,180],[590,260],[600,580]]){disk(x,y,17,palette[2]);line([[x+15,y],[x+15,y-70],[x+44,y-54]],palette[2],8);}}
 // Deterministic flecks imitate paint settling into textured plaster.
 let seed=41;for(let i=0;i<5500;i++){seed=(seed*1664525+1013904223)>>>0;const x=seed%768;seed=(seed*1664525+1013904223)>>>0;const y=seed%768;g.fillStyle=i%2?'rgba(255,249,226,.12)':'rgba(91,67,46,.045)';g.fillRect(x,y,1.5,1.5);}
 const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;}
 const mats=Array.from({length:4},(_,i)=>new THREE.MeshStandardMaterial({map:texture(i),transparent:true,roughness:1,polygonOffset:true,polygonOffsetFactor:-1}));
 const group=new THREE.Group();group.name='Painted village murals';scene.add(group);town.updateMatrixWorld(true);let n=0;
 town.traverse(o=>{if(!o.isMesh||!/^Casa_/.test(o.name))return;const b=new THREE.Box3().setFromObject(o),center=b.getCenter(new THREE.Vector3()),size=b.getSize(new THREE.Vector3());if(n++%2)return;const side=center.x<0?1:-1;const art=new THREE.Mesh(new THREE.PlaneGeometry(Math.min(size.z*.77,3.3),Math.min(size.y*.7,3.3)),mats[(n>>1)%4]);art.position.set(side>0?b.max.x+.018:b.min.x-.018,Math.max(1.6,center.y),center.z);art.rotation.y=side*Math.PI/2;group.add(art);});
 return group;
}
