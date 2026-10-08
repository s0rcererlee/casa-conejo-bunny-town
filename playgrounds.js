// Coordinates use Blender's plan coordinates; runtime Z is -Y.
export const playgrounds=[
 {landmark:9,name:'斗牛场沙地',entry:[-16,-39],spots:[[-30,-39],[-33,-40],[-28,-42]],food:[[-30,-39],[-33,-40],[-28,-42]]},
 {landmark:10,name:'水道桥拱洞',entry:[-43.5,13],spots:[[-43.5,17],[-46.5,19],[-40.5,15]],food:[[-43.5,17],[-46.5,19],[-40.5,15]]},
 {landmark:11,name:'宫殿内庭',entry:[-47,-23],spots:[[-50,-18],[-44,-16],[-50,-12]],food:[[-50,-18],[-44,-16],[-50,-12]]},
 {landmark:12,name:'钟塔底层小屋',entry:[1,-46],spots:[[1,-42]],food:[[1,-42]]},
 {landmark:13,name:'博物馆玻璃门厅',entry:[36,-41],spots:[[32.5,-41],[32.5,-42]],food:[[32.5,-41],[32.5,-42]]},
 {landmark:6,name:'古埃尔公园',entry:[20,34],spots:[[20,38],[23,40]],food:[[20,38],[23,40]]},
 {landmark:2,name:'橘树庭院',entry:[26,-11],spots:[[23,-7],[28,-8]],food:[[23,-7],[28,-8]]}
];
for(const [i,x] of [-25,-15,-5,5,15,25].entries())playgrounds.push({landmark:14+i,name:['蛋糕店','冰淇淋店','面包店','星厨餐厅','汉堡店','牛排店'][i],entry:[x,-65],spots:[[x,-61.5]],food:[[x,-61.5]]});
playgrounds.push({landmark:20,name:'欢乐游乐园',entry:[0,-77],spots:[[0,-84],[29,-87],[-2,-94]],food:[[0,-84],[29,-87],[-2,-94]]});
playgrounds.push({landmark:21,name:'星巴克咖啡店',entry:[-25,-104],spots:[[-25,-99.5]],food:[[-25,-99.5]]},{landmark:22,name:'麦当劳餐厅',entry:[-13,-104],spots:[[-13,-99.5]],food:[[-13,-99.5]]},{landmark:23,name:'云霄飞车站外',entry:[15,-102],spots:[[15,-102]],food:[[15,-102]]});
export function openPlaygrounds(world){
 world.colliders.push([15,-112,18,8.5]);
 world.colliders=world.colliders.filter(([x,y,w,d])=>!(x===1&&y===-42&&w===2)&&!(x===-47&&Math.abs(y+15)===6&&w===7));
 // Palace arcade piers: retain columns, allow the rabbit between them.
 for(const y of [-21,-9])for(let i=0;i<7;i++)world.colliders.push([-47-5.4+i*1.8-.8,y,.12,.3]);
 world.colliders.push([-.6,-42,.15,1.75],[2.6,-42,.15,1.75],[1,-40.4,1.75,.15],[-.3,-43.6,.45,.15],[2.3,-43.6,.45,.15]);
 // Replace broad ring boxes with narrow annular samples, leaving a generous eastern tunnel.
 world.colliders=world.colliders.filter(([x,y])=>Math.abs(Math.hypot(x+30,y+39)-9.5)>.01);
 for(let i=0;i<96;i++){const t=(i+.5)*Math.PI*2/96;if(Math.min(t,Math.PI*2-t)<.13)continue;for(const r of [7.4,8.4,9.4,10.4,11.4])world.colliders.push([-30+r*Math.cos(t),-39+r*Math.sin(t),.48,.48]);}
 world.colliders.push([32,-43.5,2,.08],[32,-38.5,2,.08],[34,-43,.08,.5],[34,-39,.08,.5]);
 for(const p of playgrounds)world.carrots.push(...p.food);
}
