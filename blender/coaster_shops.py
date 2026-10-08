import bpy,os,math
from math import pi,sin,cos
OUT=os.path.dirname(os.path.abspath(__file__))
exec(open(OUT+'/regions.py').read().split('# Clear peripheral')[0])
greenbrand=material('coffee green',(.015,.27,.18));yellow=material('golden yellow',(1,.69,.02));redbrand=material('restaurant red',(.8,.025,.025))
def sign(label,x,y,z,m,size=.5):
 cu=bpy.data.curves.new(label,'FONT');cu.body=label;cu.align_x='CENTER';cu.size=size;cu.extrude=.008;o=bpy.data.objects.new('V10_Sign '+label,cu);bpy.context.collection.objects.link(o);o.location=(x,y,z);o.rotation_euler=(pi/2,0,0);cu.materials.append(m);bpy.context.view_layer.objects.active=o;o.select_set(True);bpy.ops.object.convert(target='MESH');o.select_set(False)
for x,name,label,m in [(-25,'星巴克咖啡店','STARBUCKS',greenbrand),(-13,'麦当劳餐厅',"McDONALD'S",redbrand)]:
 y=-99
 box(cream,x,y,.06,8,6,.1)
 for dx in [-3.8,3.8]:box(m,x+dx,y,1.65,.2,6,3.3)
 box(m,x,y+3,1.65,7.6,.2,3.3)
 for dx in [-2.5,2.5]:box(m,x+dx,y-3,1.65,2.5,.2,3.3)
 box(m,x,y-3,2.9,7.6,.2,.8);box(cream,x,y,3.4,8.2,6.5,.2)
 sign(label,x,y-3.15,2.75,cream,.48)
 box(stone,x,y+1.6,.6,5.8,.8,1.2)
 for j in range(5):
  xx=x-2+j
  if x==-25:
   ring(cream,xx,y+1.6,0,.18,1.22,1.62,n=16);ring(greenbrand,xx,y+1.6,.175,.19,1.32,1.45,n=16)
  else:
   ring(sand,xx,y+1.6,0,.3,1.22,1.4,n=16);ring(brick,xx,y+1.6,0,.31,1.4,1.52,n=16);ring(sand,xx,y+1.6,0,.3,1.52,1.72,n=16)
 if x==-25:
  ring(cream,x,y,0,.8,3.5,5.1,n=32);ring(greenbrand,x,y,.79,.82,3.9,4.65,n=32)
 else:sign('M',x,y-1,3.5,yellow,3)
 w['colliders'].extend([[x-3.8,y,.15,3],[x+3.8,y,.15,3],[x,y+3,3.8,.15],[x-2.5,y-3,1.25,.15],[x+2.5,y-3,1.25,.15],[x,y+1.6,3,.5]])
 landmark('美食街 · '+name,[x,y],[x+12,-117,12],[x,y,1.8],name+'的虚构微缩场景，非真实门店。兔子可以从正门进店寻找胡萝卜。')
box(green,0,-111,-.27,100,24,.5);box(cream,0,-104,.03,80,3,.06);box(cream,-35,-99,.03,2,14,.06)
landmark('欢乐海岸 · 云霄飞车',[15,-112],[46,-139,25],[15,-112,5],'起伏环形双轨、支撑塔、站台和循环运行的小列车。当前为观赏动画，兔子可在站外寻找胡萝卜。')
box(cream,15,-102,.06,8,3,.1)
for m,(v,f) in batches.items():
 me=bpy.data.meshes.new(m.name);me.from_pydata(v,[],f);me.update();o=bpy.data.objects.new('V10_Block '+m.name,me);bpy.context.collection.objects.link(o);me.materials.append(m)
import json
json.dump(w,open(OUT+'/world.json','w'),ensure_ascii=False)
exec(open(OUT+'/fix_regions.py').read().split('bpy.context.scene.frame_set(1)')[1].join(['bpy.context.scene.frame_set(1)','']))
