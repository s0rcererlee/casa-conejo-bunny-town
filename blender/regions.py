import bpy,math,json,os
from math import sin,cos,pi
OUT=os.path.dirname(os.path.abspath(__file__))
bpy.ops.wm.open_mainfile(filepath=OUT+'/casa-conejo.blend')
w=json.load(open(OUT+'/world.json'))
# Aggregate primitives by material: fast generation and few draw calls.
batches={}
def material(n,c,metal=0):
 m=bpy.data.materials.new('Regional '+n);m.diffuse_color=(*c,1);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*c,1);p.inputs['Metallic'].default_value=metal;p.inputs['Roughness'].default_value=.36 if metal else .78;return m
brick=material('warm brick',(.56,.19,.105));stone=material('sandstone',(.72,.57,.38));cream=material('ivory',(.92,.84,.65));sand=material('arena sand',(.83,.61,.30));red=material('red seating',(.65,.12,.08));dark=material('shadow openings',(.10,.075,.06));blue=material('ceramic cobalt',(.055,.25,.48));water=material('reflecting pool',(.05,.48,.49));silver=material('titanium',(.63,.68,.69),.8);glass=material('blue glazing',(.13,.31,.38),.4);green=material('cypress',(.12,.27,.10))
def mesh(m,v,f):
 vs,fs=batches.setdefault(m,([],[]));n=len(vs);vs.extend(v);fs.extend([tuple(n+i for i in face) for face in f])
def box(m,x,y,z,a,b,c):
 mesh(m,[(x+i*a/2,y+j*b/2,z+k*c/2) for k in [-1,1] for j in [-1,1] for i in [-1,1]],[(0,1,3,2),(4,6,7,5),(0,4,5,1),(2,3,7,6),(0,2,6,4),(1,5,7,3)])
def ring(m,x,y,r0,r1,z0,z1,start=0,end=2*pi,n=96):
 v=[]
 for i in range(n+1):
  t=start+(end-start)*i/n
  v.extend([(x+r*cos(t),y+r*sin(t),z) for r,z in [(r0,z0),(r1,z0),(r0,z1),(r1,z1)]])
 f=[]
 for i in range(n):
  a=i*4;b=a+4;f.extend([(a,b,b+1,a+1),(a+2,a+3,b+3,b+2),(a,a+2,b+2,b),(a+1,b+1,b+3,a+3)])
 f.extend([(0,1,3,2),(n*4,n*4+2,n*4+3,n*4+1)]);mesh(m,v,f)
def arch(m,x,y,z,r,thick,depth):
 v=[]
 for i in range(17):
  t=i*pi/16;v.extend([(x+rr*cos(t),y+d,z+rr*sin(t)) for rr,d in [(r,-depth/2),(r,depth/2),(r+thick,-depth/2),(r+thick,depth/2)]])
 f=[]
 for i in range(16):
  a=i*4;b=a+4;f.extend([(a,b,b+1,a+1),(a+2,a+3,b+3,b+2),(a,a+2,b+2,b),(a+1,b+1,b+3,a+3)])
 mesh(m,v,f)
def landmark(name,pos,cam,look,desc):w['landmarks'].append(dict(name=name,position=pos,camera=cam,look=look,description=desc))
# Clear peripheral vegetation/hills only within new construction districts.
for o in list(bpy.data.objects):
 if o.type=='MESH' and o.name.startswith(('Distant rolling hill','Hill','Olive','Cypress','V3_Wild','V3_Flower')):
  x,y=o.location.x,o.location.y
  if y < -31 or x < -34:bpy.data.objects.remove(o,do_unlink=True)
# MADRID — open arena, concentric terraces and brick arcade facade.
x,y=-30,-39
ring(cream,x,y,0,12.3,.015,.06);ring(sand,x,y,0,6.8,.06,.095)
for j in range(9):ring(red if j%3==0 else cream,x,y,6.9+j*.47,7.37+j*.47,.10,.3+j*.32,start=.13,end=2*pi-.13)
ring(brick,x,y,11.25,11.7,.1,3.5,start=.13,end=2*pi-.13)
ring(cream,x,y,11.15,11.85,3.5,3.73)
for i in range(48):
 t=2*pi*i/48;xx=x+11.74*cos(t);yy=y+11.74*sin(t)
 # radial dark windows with contrasting ceramic lintels
 for z in [1.15,2.65]:
  r=.31;v=[]
  for k in range(13):
   a=k*pi/12;v.append((xx-r*cos(a)*sin(t),yy+r*cos(a)*cos(t),z+r*sin(a)))
  v.extend([(xx+r*sin(t),yy-r*cos(t),z-.65),(xx-r*sin(t),yy+r*cos(t),z-.65)])
  mesh(dark,v,[tuple(range(len(v)))] )
 box(blue,x+11.8*cos(t),y+11.8*sin(t),3.3,.22,.22,.18)
for dx in [-2,2]:
 box(brick,x+dx,y-11.65,2.5,1.25,1.5,5);box(cream,x+dx,y-11.65,5.05,1.5,1.7,.2)
 for q in [-.45,0,.45]:box(brick,x+dx+q,y-11.65,5.4,.23,1.4,.55)
arch(cream,x,y-11.85,1.8,1.2,.25,.5)
# Perimeter collision segments leave east entrance accessible.
for i in range(64):
 t=(i+.5)*2*pi/64
 if min(t,2*pi-t)<.18:continue
 w['colliders'].append([x+9.5*cos(t),y+9.5*sin(t),2.1*abs(cos(t))+.6,2.1*abs(sin(t))+.6])
landmark('马德里 · 拉斯文塔斯斗牛场', [x,y],[-9,-64,24],[x,y,1.8],'马德里｜拉斯文塔斯风格：红砖、新穆德哈尔拱门、瓷砖装饰与环形沙地看台。微缩致敬建筑。')
# CASTILE AND LEON — two tiers of open Roman arches, each pier has collision.
x,y=-45,2
for i in range(10):
 yy=y-15+i*3
 # build in local x then rotate entire aqueduct batch later is unnecessary: bridge runs x axis at y16
 xx=-57+i*3
 for z in [1.8,5.6]:box(stone,xx,17,z,.65,1.3,3.6)
 w['colliders'].append([xx,17,.4,.7])
 if i<9:
  for z in [2.6,6.4]:arch(stone,xx+1.5,17,z,1.17,.34,1.3)
for z in [4.55,8.35]:box(stone,-43.5,17,z,28,1.45,.45)
landmark('卡斯蒂利亚-莱昂 · 塞哥维亚水道桥',[-43.5,17],[-31,-17,18],[-43.5,17,4],'塞哥维亚｜两层连续石拱与高架水渠；桥洞保留通行空间。风格化古罗马水道桥。')
# ANDALUSIA — Alhambra courtyard and crenellated red fortress.
x,y=-47,-15
box(cream,x,y,.07,17,14,.12);box(water,x,y,.16,2.7,8,.12)
for dx in [-6.7,6.7]:
 box(brick,x+dx,y,1.7,2,12,3.4);box(cream,x+dx,y,3.5,2.5,12.5,.22)
 for j in range(7):
  yy=y-5+j*1.65;box(dark,x+dx-(1.02 if dx>0 else -1.02),yy,1.6,.035,.75,1.65)
for yy in [y-6,y+6]:
 for i in range(7):
  xx=x-5.4+i*1.8;box(cream,xx-.8,yy,1.1,.18,.6,2);arch(cream,xx,yy,1.65,.7,.2,.6)
 box(brick,x,yy,3.05,14,.8,1)
for dx in [-7,7]:
 for dy in [-6,6]:
  box(brick,x+dx,y+dy,2.4,2.8,2.8,4.8)
  for k in [-1,0,1]:
   box(brick,x+dx+k,y+dy-1.1,5.05,.5,.5,.6);box(brick,x+dx+k,y+dy+1.1,5.05,.5,.5,.6)
for dx in [-6.7,6.7]:w['colliders'].append([x+dx,y,1.25,6.5])
for yy in [y-6,y+6]:w['colliders'].append([x,yy,7,.5])
w['colliders'].append([x,y,1.5,4.2])
landmark('安达卢西亚 · 阿尔罕布拉宫庭院',[x,y],[-28,-34,18],[x,y,1.7],'格拉纳达｜赭红城墙、细柱拱廊与长方形倒影水庭，提炼阿尔罕布拉宫的空间意象。')
# SEVILLE — slender Giralda-style tower with paired arches and belfry.
x,y=1,-42
box(cream,x,y,.08,11,10,.15);box(stone,x,y,5,3.5,3.5,10)
for z in [2.5,5,7.5]:
 for dx in [-.65,.65]:
  box(dark,x+dx,y-1.76,z,.8,.03,1.35);arch(brick,x+dx,y-1.8,z+.67,.4,.14,.08)
 for dx in [-1.35,1.35]:box(brick,x+dx,y-1.8,5,.12,.1,8.5)
for z in [9.7,10.3,13]:box(cream,x,y,z,4.1,4.1,.25)
for dx in [-1.4,1.4]:
 for dy in [-1.4,1.4]:box(stone,x+dx,y+dy,11.6,.5,.5,2.6)
for yy in [y-1.4,y+1.4]:arch(cream,x,yy,11.9,1.1,.22,.45)
box(stone,x,y,13.9,2.1,2.1,1.6);ring(brick,x,y,0,1.35,14.65,15.15,n=24);box(silver,x,y,16,.11,.11,1.7);box(silver,x+.2,y,16.6,.65,.1,.35)
w['colliders'].append([x,y,2,2])
landmark('安达卢西亚 · 塞维利亚吉拉尔达塔',[x,y],[16,-60,19],[x,y,8],'塞维利亚｜修长砖石塔身、成对拱窗、开放钟楼和顶部风向标。宗教建筑风格化致敬。')
# BASQUE COUNTRY — faceted flowing titanium shells around glass atrium.
x,y=23,-41
box(cream,x,y,.1,19,14,.18);box(water,x,y-7.8,.09,20,2.4,.12);box(glass,x,y,3,4,6,6)
for k,(dx,dy,rx,ry,h,twist) in enumerate([(-5,0,3.5,4.2,6,-.4),(4,1,3.7,4.6,7,.6),(-1,3,3,3,9,.8),(1,-3,4,2,5,-.5)]):
 v=[];f=[];N=32;L=12
 for j in range(L+1):
  u=j/L;scale=.65+.5*sin(pi*u);rot=twist*u
  for i in range(N):
   t=2*pi*i/N;xx=rx*scale*cos(t);yy=ry*scale*sin(t)
   v.append((x+dx+xx*cos(rot)-yy*sin(rot)+u*.8,y+dy+xx*sin(rot)+yy*cos(rot),.2+h*u))
 for j in range(L):
  for i in range(N):a=j*N+i;b=j*N+(i+1)%N;f.append((a,b,b+N,a+N))
 f.append(tuple(range(L*N,(L+1)*N)));mesh(silver,v,f)
w['colliders'].append([x,y,8,6])
landmark('巴斯克 · 毕尔巴鄂古根海姆博物馆',[x,y],[43,-60,17],[x,y,3.5],'毕尔巴鄂｜弗兰克·盖里的钛金属曲面语言：扭转体块、玻璃中庭与水岸广场。风格化致敬。')
# Southern and western pedestrian links.
box(cream,-11,-30,.025,65,1.8,.035);box(cream,-35,4,.025,1.8,66,.035)
for m,(v,f) in batches.items():
 me=bpy.data.meshes.new(m.name);me.from_pydata(v,[],f);me.update();o=bpy.data.objects.new('V3_Regional '+m.name,me);bpy.context.collection.objects.link(o);me.materials.append(m)
json.dump(w,open(OUT+'/world.json','w'),ensure_ascii=False)
bpy.context.scene.frame_set(1)
bpy.ops.wm.save_as_mainfile(filepath=OUT+'/casa-conejo.blend')
bpy.ops.object.select_all(action='DESELECT')
for o in bpy.context.scene.objects:
 if o.type=='MESH' and not o.parent and not o.name.startswith(('Carrot','Physics')):o.select_set(True)
bpy.ops.export_scene.gltf(filepath=OUT+'/town.glb',use_selection=True,export_animations=False,export_cameras=False,export_lights=False)
print('REGIONS COMPLETE',len(w['landmarks']))
