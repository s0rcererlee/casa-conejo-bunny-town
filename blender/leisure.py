import bpy,os,math,json
from math import sin,cos,pi
OUT=os.path.dirname(os.path.abspath(__file__))
# Reuse the direct-mesh builders, without generating earlier landmarks again.
exec(open(OUT+'/regions.py').read().split('# Clear peripheral')[0])
pastels=[material('rose',(.94,.46,.55)),material('mint',(.35,.75,.65)),material('butter',(.95,.72,.35)),material('wine',(.32,.08,.15)),material('tomato',(.83,.19,.10)),material('charcoal',(.17,.22,.24))]
box(green,0,-80,-.25,100, fifty:=50,.5)
box(cream,0,-68,.03,84,5,.06);box(cream,39,-61,.03,3,27,.06);box(cream,2,-54,.03,3,22,.06)
shops=[('DULCE','蛋糕店',-25,pastels[0]),('GELATO','冰淇淋店',-15,pastels[1]),('PANADERIA','面包店',-5,pastels[2]),('LUNA','星厨精致餐厅',5,pastels[3]),('BURGER','汉堡店',15,pastels[4]),('BRASA','牛排店',25,pastels[5])]
def textsign(label,x,y,z,size,m):
 cu=bpy.data.curves.new(label,'FONT');cu.body=label;cu.align_x='CENTER';cu.size=size;cu.extrude=.009;o=bpy.data.objects.new('V9_Sign '+label,cu);bpy.context.collection.objects.link(o);o.location=(x,y,z);o.rotation_euler=(pi/2,0,0);cu.materials.append(m)
 # Convert text so export includes lettering.
 bpy.context.view_layer.objects.active=o;o.select_set(True);bpy.ops.object.convert(target='MESH');o.select_set(False)
for idx,(label,name,x,m) in enumerate(shops):
 y=-61
 box(cream,x,y,.07,7.6,6.6,.12);box(m,x-3.5,y,1.7,.25,6,3.4);box(m,x+3.5,y,1.7,.25,6,3.4);box(m,x,y+3,1.7,7,.25,3.4)
 for dx in [-2.4,2.4]:box(m,x+dx,y-3,1.7,2.2,.25,3.4)
 box(m,x,y-3,3,7,.25,.8);box(cream,x,y,3.55,7.6,6.6,.25)
 box(cream,x,y-3.4,2.55,7.5,1.6,.14)
 for j in range(10):box(m if j%2==0 else cream,x-3.375+j*.75,y-4.1,2.37,.75,.12,.4)
 box(dark,x,y-3.15,3.02,6.4,.09,.65);textsign(label,x,y-3.23,2.84,.47,cream)
 # Interior counter runs along the back, leaving a wide entrance and floor space.
 box(wood if 'wood' in globals() else stone,x,y+1.6,.55,5.5,.85,1.1);box(cream,x,y+1.6,1.15,5.8,1,.13)
 for j in range(5):
  xx=x-2+j
  if idx==0:
   ring(cream,xx,y+1.6,0,.3,1.22,1.6,n=16);ring(pastels[0],xx,y+1.6,0,.32,1.6,1.68,n=16);ring(red,xx,y+1.6,0,.08,1.68,1.78,n=12)
  elif idx==1:
   ring(sand,xx,y+1.6,0,.2,1.2,1.5,n=12);ring(pastels[j%3],xx,y+1.6,0,.25,1.5,1.85,n=16)
  elif idx==2:
   box(sand,xx,y+1.6,1.35,.7,.35,.28)
   for k in [-.2,0,.2]:box(cream,xx+k,y+1.6,1.5,.05,.32,.015)
  elif idx==4:
   for zz,rr,mm in [(1.28,.3,sand),(1.4,.32,green),(1.5,.3,brick),(1.63,.3,sand)]:ring(mm,xx,y+1.6,0,rr,zz,zz+.1,n=16)
  else:box(cream,xx,y+1.6,1.25,.6,.5,.04);box(brick,xx,y+1.6,1.33,.4,.3,.1)
 # Outdoor café seating, pots, and rabbit food corner inside.
 for dx in [-2.4,2.4]:
  ring(cream,x+dx,y-5.1,0,.65,.8,.9,n=20);box(dark,x+dx,y-5.1,.4,.1,.1,.8)
  for dy in [-.85,.85]:box(m,x+dx,y-5.1+dy,.42,.55,.5,.12);box(dark,x+dx,y-5.1+dy,.2,.1,.1,.4)
 w['colliders'].extend([[x-3.5,y,.15,3],[x+3.5,y,.15,3],[x,y+3,3.5,.15],[x-2.4,y-3,1.1,.15],[x+2.4,y-3,1.1,.15],[x,y+1.6,2.9,.55]])
 for dx in [-2.4,2.4]:w['colliders'].append([x+dx,y-5.1,.7,.7])
 landmark('美食街 · '+name,[x,y],[x+10,-79,11],[x,y,1.3],('虚构星厨餐厅，采用精致餐饮氛围，并无真实米其林评级。' if idx==3 else name+'：彩色遮阳篷、食品展示柜和露天座位。')+'兔子可以从正门走入，寻找自己的胡萝卜。')
# Park paths and static equipment.
box(cream,0,-77,.025,80,3,.04);box(cream,0,-89,.025,80,2,.04)
for x in [-37,37]:box(cream,x,-80,.025,2,25,.04)
for x in [-32,-19,-4,13,29]:
 box(stone,x,-73,.4,2.4,.6,.2)
 for dx in [-.8,.8]:box(dark,x+dx,-73,.2,.12,.4,.4)
# Ferris wheel support; the animated wheel is supplied by leisure.js.
for yy in [-85,-83]:
 for xx in [-29,-23]:box(pastels[1],xx,yy,3.3,.35,.35,6.6)
box(cream,-26,-84,.12,9,5,.2)
w['colliders'].append([-26,-84,4.5,2.5])
# Merry-go-round platform and conical canopy (runtime animals rotate underneath).
ring(pastels[0],-10,-83,0,4,.05,.35,n=64)
ring(cream,-10,-83,0,.18,.3,3.8,n=16)
v=[(-10,-83,5.3)]+[(-10+4.5*cos(i*2*pi/32),-83+4.5*sin(i*2*pi/32),3.6) for i in range(32)]
for i in range(32):mesh(pastels[0] if i%2 else cream,v,[(0,i+1,(i+1)%32+1)])
w['colliders'].append([-10,-83,4.5,4.5])
# Slide with stair treads, rails and a turquoise chute.
for i in range(8):box(pastels[2],20,-81+i*.3,.15*(i+1),1.3,.3,.3*(i+1))
box(pastels[1],20,-77.9,2.4,2,1.5,.2)
mesh(pastels[1],[(19.3,-77.2,2.4),(20.7,-77.2,2.4),(20.7,-73.8,.15),(19.3,-73.8,.15)],[(0,1,2,3)])
w['colliders'].append([20,-78,1.2,4.3])
# Sandbox, stepping-stone maze, trampoline.
box(sand,29,-87,.07,7,5,.12)
for x in [25.5,32.5]:box(pastels[2],x,-87,.25,.18,5,.4)
for y in [-89.5,-84.5]:box(pastels[2],29,y,.25,7,.18,.4)
ring(pastels[0],8,-90,2.1,2.5,.15,.4,n=40);ring(dark,8,-90,0,2.1,.15,.17,n=40)
for j in range(7):ring(pastels[j%3],-4+j*1.2,-94+sin(j)*.7,0,.4,.05,.18,n=12)
for xx in [4,10]:
 for yy in [-82,-78]:box(pastels[2],xx,yy,1.9,.16,.16,3.8)
box(pastels[2],7,-80,3.8,6.5,.18,.18)
w['colliders'].append([7,-80,3.4,2.3])
landmark('欢乐海岸 · 游乐场',[0,-84],[44,-111,30],[0,-83,2.5],'摩天轮、旋转木马、秋千、滑梯、沙坑、蹦床和跳石小径。运动设施可观看；兔子可在游乐园步道、沙坑和跳石区探索觅食。')
for m,(v,f) in batches.items():
 me=bpy.data.meshes.new(m.name);me.from_pydata(v,[],f);me.update();o=bpy.data.objects.new('V9_Leisure '+m.name,me);bpy.context.collection.objects.link(o);me.materials.append(m)
json.dump(w,open(OUT+'/world.json','w'),ensure_ascii=False)
exec(open(OUT+'/fix_regions.py').read().split('bpy.context.scene.frame_set(1)')[1].join(['bpy.context.scene.frame_set(1)','']))
