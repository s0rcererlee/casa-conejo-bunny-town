import bpy, math, random, os, json
from mathutils import Vector
random.seed(24); OUT=os.path.dirname(os.path.abspath(__file__))
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
def mat(n,c,em=0):
 m=bpy.data.materials.new(n);m.diffuse_color=(*c,1);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*c,1);p.inputs['Roughness'].default_value=.8
 if em:p.inputs['Emission Color'].default_value=(*c,1);p.inputs['Emission Strength'].default_value=em
 return m
sand=mat('Warm limestone',(.69,.53,.32));road=mat('Terracotta paving',(.57,.35,.22));grass=mat('Mediterranean meadow',(.33,.46,.16));roof=mat('Terracotta tiles',(.58,.16,.075));wood=mat('Dark walnut',(.17,.075,.034));white=mat('Ivory plaster',(.92,.84,.65));blue=mat('Indigo shutters',(.05,.20,.32));green=mat('Olive leaves',(.23,.34,.10));pink=mat('Bougainvillea',(.76,.035,.26));water=mat('Fountain turquoise',(.08,.46,.55));metal=mat('Iron',(.045,.055,.065));glow=mat('Lantern glass',(1,.55,.13),2);orange=mat('Carrot orange',(.95,.28,.025));black=mat('Rabbit eyes',(.015,.012,.02));ear=mat('Pink ears',(.95,.46,.44))
plasters=[mat('Plaster '+str(i),c) for i,c in enumerate([(.92,.67,.30),(.87,.39,.25),(.79,.82,.65),(.92,.77,.57),(.32,.64,.67),(.84,.49,.53)])]
def obj(o,n,m):o.name=n;o.data.materials.append(m);return o
def cube(n,p,s,m,b=0):
 bpy.ops.mesh.primitive_cube_add(size=1,location=p);o=bpy.context.object;o.scale=s;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);obj(o,n,m)
 if b:mod=o.modifiers.new('Rounded corners','BEVEL');mod.width=b;mod.segments=2;o.modifiers.new('Normals','WEIGHTED_NORMAL')
 return o
def sphere(n,p,s,m,sub=1):
 bpy.ops.mesh.primitive_ico_sphere_add(subdivisions=sub,radius=1,location=p);o=bpy.context.object;o.scale=s;return obj(o,n,m)
def cyl(n,p,r,d,m,r2=None,v=12):
 bpy.ops.mesh.primitive_cone_add(vertices=v,radius1=r,radius2=r if r2 is None else r2,depth=d,location=p);return obj(bpy.context.object,n,m)
def torus(n,p,r,t,m):
 bpy.ops.mesh.primitive_torus_add(major_radius=r,minor_radius=t,major_segments=32,minor_segments=8,location=p);return obj(bpy.context.object,n,m)
def beam(n,a,b,r,m):
 o=cyl(n,(Vector(a)+Vector(b))/2,r,(Vector(b)-Vector(a)).length,m,v=8);o.rotation_euler=(Vector(b)-Vector(a)).to_track_quat('Z','Y').to_euler();return o
coll=[]
ground=cube('Ground / collision',(0,0,-.25),(90,90,.5),grass)
bpy.context.view_layer.objects.active=ground;bpy.ops.rigidbody.object_add();ground.rigid_body.type='PASSIVE'
cube('Plaza',(0,0,.025),(17,16,.05),sand)
for p,s in [((0,0,.06),(5,70,.07)),((0,0,.08),(70,4,.07)),((-12,0,.05),(3,40,.06)),((12,0,.05),(3,40,.06))]:cube('Village lane',p,s,road)
# Plaza paver inlays
for x in range(-7,8,2):
 for y in range(-7,8,2):cube('Paving detail',(x,y,.065),(.52,.52,.025),white)
def house(x,y,w,d,h,i):
 cube('Casa %02d'%i,(x,y,h/2),(w,d,h),plasters[i%6],.07);coll.append([x,y,w/2+.25,d/2+.25])
 for side in [-1,1]:
  o=cube('Sloping tiled roof',(x+side*w/4,y,h+.43),(w*.57,d+.45,.16),roof);o.rotation_euler.y=side*math.radians(24)
  for k in range(int(d/.28)+1):
   a=(x,y-d/2-.2+k*.28,h+.99);b=(x+side*(w/2+.25),a[1],h-.03);beam('Individual roof tile',a,b,.047,roof)
 cube('Stone footing',(x,y,.18),(w+.12,d+.12,.36),sand)
 for gy in [y-d/2,y+d/2]:
  me=bpy.data.meshes.new('Gable wall');me.from_pydata([(x-w/2,gy,h),(x+w/2,gy,h),(x,gy,h+.93)],[],[(0,1,2)]);go=bpy.data.objects.new('Plaster gable',me);bpy.context.collection.objects.link(go);go.data.materials.append(plasters[i%6])
 front=y-d/2-.035
 cube('Arched doorway lower',(x,front,.83),(.8,.10,1.65),wood,.1)
 # arched stone surround with individual blocks
 for k in range(9):
  a=math.pi*k/8;o=cube('Arch stone',(x+.52*math.cos(a),front-.055,1.57+.52*math.sin(a)),(.22,.18,.25),white,.02);o.rotation_euler.y=math.pi/2-a
 for xx in [-w*.30,w*.30]:
  for z in ([1.55,3.45] if h>4 else [1.55]):
   cube('Window recess',(x+xx,front,z),(.65,.10,.88),wood)
   for sg in [-1,1]:cube('Painted shutter',(x+xx+sg*.37,front-.07,z),(.27,.08,.94),blue,.02)
   cube('Window sill',(x+xx,front-.15,z-.48),(.95,.35,.12),white)
   if z>2:
    cube('Balcony',(x+xx,front-.4,z-.5),(1.3,.8,.12),sand)
    for q in range(6):beam('Balcony rail',(x+xx-.6+q*.24,front-.8,z-.45),(x+xx-.6+q*.24,front-.8,z+.16),.022,metal)
    beam('Balcony handrail',(x+xx-.65,front-.8,z+.16),(x+xx+.65,front-.8,z+.16),.035,metal)
 for q in range(6):sphere('Bougainvillea bloom',(x-w/2-.10+random.uniform(-.3,.3),front,1+q*.45),(.35,.3,.36),pink)
 cyl('Terracotta pot',(x+w/2-.3,front-.55,.28),.25,.55,roof,r2=.32)
 sphere('Potted shrub',(x+w/2-.3,front-.55,.83),(.48,.43,.48),green)
for i,(x,y,w,d,h) in enumerate([(-6,11,4,4,4.7),(0,12,4,5,3.4),(6,11,4,4,5),(-7,-12,4,4,3.2),(0,-13,4.5,4,4.8),(7,-12,4,4,3.6),(-12,6,4,4,4),(-12,-5,4,4,5),(12,6,4,4,3.5),(12,-5,4,4,4.5),(-20,12,4,5,3.7),(20,13,5,4,4),(-21,-10,4,4,3),(20,-12,4,4,3.5)]):house(x,y,w,d,h,i)
# Chapel bell tower
cube('Campanario',(-7,12,6),(1.8,1.8,4.0),white,.05)
for yy in [11.08,12.92]:cube('Belfry opening',(-7,yy,6.6),(.75,.06,1.3),wood,.2)
cyl('Bell',(-7,11.0,6.6),.29,.4,glow,r2=.14)
cyl('Tower roof',(-7,12,8.25),1.5,1.0,roof,r2=0,v=4)
beam('Cross',(-7,12,8.5),(-7,12,9.35),.05,wood);beam('Cross',(-7.25,12,9.08),(-6.75,12,9.08),.05,wood)
# Fountain, benches and cafe
cyl('Fountain base',(0,1,.23),2,.45,sand,v=40);cyl('Fountain pool',(0,1,.47),1.75,.08,water,v=40);torus('Fountain rim',(0,1,.5),1.85,.15,white);cyl('Fountain pedestal',(0,1,1.0),.30,1.1,sand);cyl('Upper basin',(0,1,1.6),.87,.2,white,r2=1);sphere('Fountain finial',(0,1,2.1),(.24,.24,.42),white,2);coll.append([0,1,2.15,2.15])
for a in range(0,360,45):
 t=math.radians(a)
 for k in range(7):
  u=k/6;sphere('Water droplets',((.32+u*.95)*math.cos(t),1+(.32+u*.95)*math.sin(t),1.6+.4*math.sin(u*math.pi)-u),(.035,)*3,water)
for x,y in [(-5,3),(5,3),(-5,-5),(5,-5)]:
 cube('Bench seat',(x,y,.6),(1.8,.5,.13),wood);cube('Bench back',(x,y+.22,.95),(1.8,.10,.65),wood)
 for dx in [-.65,.65]:cube('Bench leg',(x+dx,y,.3),(.09,.45,.6),metal)
for x,y in [(-8,0),(8,0),(-5,7),(5,7)]:
 cyl('Cafe table',(x,y,.85),.65,.10,white);cyl('Table stem',(x,y,.43),.07,.8,metal)
 cyl('Striped parasol',(x,y,2.7),1.3,.55,plasters[int(abs(x))%6],r2=0);cyl('Parasol pole',(x,y,1.35),.035,2.7,wood)
 for dx in [-.9,.9]:cube('Cafe stool',(x+dx,y,.45),(.4,.4,.12),blue);cyl('Stool leg',(x+dx,y,.22),.05,.44,metal)
# Market canopy and produce
for x in [-5,5]:
 y=-8
 for dx in [-1,1]:cyl('Market post',(x+dx,y,1.2),.045,2.4,wood)
 for k in range(8):cube('Market striped canopy',(x-.95+k*.27,y,2.4),(.27,1.5,.10),white if k%2 else roof)
 cube('Produce counter',(x,y,.72),(2.1,.9,.18),wood)
 for k in range(12):sphere('Market orange',(x+random.uniform(-.8,.8),y+random.uniform(-.3,.3),.90),(.12,)*3,orange,2)
# Olive grove, cypresses, flowers, hills
for i in range(65):
 x,y=random.uniform(-36,36),random.uniform(-33,33)
 if abs(x)<16 and abs(y)<17:continue
 if 15<x<26 and -7<y<7:continue
 if -30<x<-16 and -7<y<7:continue
 cyl('Olive trunk',(x,y,.85),.15,1.7,wood)
 sphere('Olive crown',(x,y,2.3),(1.15,.95,1.15),green,2)
for x in [-9,9]:
 for y in [-17,17]:cyl('Cypress',(x,y,2.1),.65,4.2,green,r2=.09)
for i in range(130):
 x,y=random.uniform(-32,32),random.uniform(-30,30)
 if abs(x)<15 and abs(y)<17:continue
 sphere('Wildflowers',(x,y,.18),(.12,.12,.2),pink if i%2 else white)
for i in range(18):
 a=i*math.tau/18;sphere('Distant rolling hill',(55*math.cos(a),55*math.sin(a),0),(15,13,random.uniform(4,10)),green,2)
# Secret garden: open arch on the east side, enclosed shaded courtyard.
cube('Secret garden / tiled floor',(-23,0,.035),(10,10,.07),sand)
for x,y,w,d in [(-28,0,.32,10),(-23,-5,10,.32),(-23,5,10,.32),(-18,-3.35,.32,3.3),(-18,3.35,.32,3.3)]:
 cube('Garden wall',(x,y,.85),(w,d,1.7),white,.06);coll.append([x,y,w/2,d/2])
for y in [-1.7,1.7]:cube('Garden arch pillar',(-18,y,1.5),(.65,.5,3),sand,.05)
for k in range(13):
 a=k*math.pi/12;o=cube('Garden arch stone',(-18,1.7*math.cos(a),2.9+1.7*math.sin(a)),(.6,.45,.47),white,.03);o.rotation_euler.x=a
for x in [-27,-19]:
 for y in [-4,4]:
  cyl('Garden terracotta pot',(x,y,.3),.35,.6,roof,r2=.45)
  for k in range(5):sphere('Garden flowering shrub',(x+random.uniform(-.35,.35),y+random.uniform(-.35,.35),.9+random.random()*.4),(.3,.3,.4),pink)
for x in [-26,-22]:
 for y in [-3.5,-.5]:cyl('Pergola post',(x,y,1.4),.085,2.8,wood)
for i in range(9):cube('Pergola shade slat',(-26+i*.5,-2,2.8),(.15,3.6,.13),wood)
for i in range(10):sphere('Pergola flowers',(-26+random.random()*4,-3.5,2.9),(.4,.4,.26),pink)
sphere('Rabbit nest / moss',(-24,-2,.15),(1.3,.95,.17),green,2)
for i in range(10):
 a=i*math.tau/10;sphere('Nest / pebbles',(-24+1.4*math.cos(a),-2+1.05*math.sin(a),.15),(.16,.13,.1),sand)
for y in [1.7,3.2]:cube('Secret garden bed',(-24,y,.10),(5,.9,.2),wood)
carrots=[[-26,1.7],[-24,1.7],[-22,1.7],[-25,3.2],[-23,3.2]]
for ix in range(4):
 cube('Garden soil',(18+ix*1.4,1,.06),(.9,10,.12),wood)
 for iy in range(6):carrots.append([18+ix*1.4,-3+iy*1.5])
carrots += [[-3,-3],[3,-4],[-7,5],[6,5],[-3,7],[8,-3],[-9,-7],[3,-9]]
for i,(x,y) in enumerate(carrots):
 c=cyl('Carrot_%02d'%i,(x,y,.24),.02,.42,orange,r2=.14,v=8)
 for k in range(3):beam('Carrot leaves',(x,y,.44),(x+.18*math.cos(k*2.1),y+.18*math.sin(k*2.1),.77),.035,green)
# Lamps and decorative bunting
lamps=[]
for x in [-8,8]:
 for y in [-8,6]:
  cyl('Lantern pole',(x,y,1.4),.045,2.8,metal);cube('Lantern frame',(x,y,2.9),(.35,.35,.5),metal);cube('Lantern glowing glass',(x,y-.18,2.9),(.26,.03,.34),glow);lamps.append([x,y,2.9])
for i in range(19):
 x=-8+i*.9;z=4.1-.8*math.sin(i/18*math.pi)
 beam('Fiesta string',(x,5,z),(x+.9,5,4.1-.8*math.sin((i+1)/18*math.pi)),.015,wood)
 me=bpy.data.meshes.new('Pennant');me.from_pydata([(x,5,z),(x+.6,5,z),(x+.3,5,z-.55)],[],[(0,1,2)]);o=bpy.data.objects.new('Fiesta pennant',me);bpy.context.collection.objects.link(o);o.data.materials.append(plasters[i%6])
# Rabbits with editable animation
for ri,(xx,yy) in enumerate([(-3,-3),(4,-4),(19,0)]):
 bpy.ops.object.empty_add(location=(xx,yy,.1));root=bpy.context.object;root.name='Rabbit_%d'%ri
 def part(n,p,s,m):
  o=sphere(n,(0,0,0),s,m,2);o.parent=root;o.location=p;return o
 part('Rabbit body',(0,0,.3),(.25,.36,.25),white);part('Rabbit head',(0,-.28,.5),(.23,.21,.23),white);part('Rabbit tail',(0,.37,.34),(.13,)*3,white)
 for x in [-.12,.12]:
  part('Rabbit ear',(x,-.22,.9),(.075,.07,.32),white);part('Inner ear',(x,-.285,.92),(.042,.015,.23),ear);part('Eye',(x,-.459,.54),(.034,.025,.04),black)
  for y in [-.18,.23]:part('Paw',(x,y,.10),(.09,.15,.08),white)
 part('Nose',(0,-.49,.46),(.035,.018,.025),ear)
 for f in range(1,481,3):
  t=(f-1)*math.tau/240+ri*2;root.location=(xx+1.5*math.cos(t),yy+.65*math.sin(t),.10+.13*abs(math.sin(f*.32)));root.rotation_euler.z=math.atan2(-1.5*math.sin(t),-.65*math.cos(t));root.keyframe_insert(data_path='location',frame=f);root.keyframe_insert(data_path='rotation_euler',frame=f)
# A few actual rigid bodies: dropped oranges in the market.
for i in range(5):
 o=sphere('Physics / falling orange',(-4.7+i*.25,-7,2+i*.3),(.13,)*3,orange,2);bpy.context.view_layer.objects.active=o;bpy.ops.rigidbody.object_add();o.rigid_body.mass=.12;o.rigid_body.restitution=.55;o.rigid_body.collision_shape='SPHERE'
sc=bpy.context.scene;sc.frame_end=480;sc.render.fps=24
world=bpy.data.worlds.new('Mediterranean sky');world.use_nodes=True;sc.world=world;bg=world.node_tree.nodes['Background'];bg.inputs[0].default_value=(.38,.60,.85,1)
bpy.ops.object.light_add(type='SUN',location=(0,0,20));sun=bpy.context.object;sun.name='Sun / day-night';sun.rotation_euler=(.45,-.5,-.4);sun.data.angle=.12
for f,energy,ambient in [(1,3,.7),(180,1.2,.35),(280,.03,.045),(360,.03,.045),(480,3,.7)]:sun.data.energy=energy;sun.data.keyframe_insert(data_path='energy',frame=f);bg.inputs[1].default_value=ambient;bg.inputs[1].keyframe_insert(data_path='default_value',frame=f)
for x,y,z in lamps:
 bpy.ops.object.light_add(type='POINT',location=(x,y,z));bpy.context.object.data.energy=55;bpy.context.object.data.color=(1,.48,.12);bpy.context.object.data.shadow_soft_size=.6
bpy.ops.object.camera_add(location=(36,-46,36));cam=bpy.context.object;cam.rotation_euler=(Vector((0,1,1))-cam.location).to_track_quat('-Z','Y').to_euler();cam.data.type='ORTHO';cam.data.ortho_scale=53;sc.camera=cam
sc.render.engine='CYCLES';sc.cycles.samples=24;sc.cycles.use_denoising=True;sc.render.resolution_x=1600;sc.render.resolution_y=1100;sc.render.resolution_percentage=100;sc.render.image_settings.file_format='PNG';sc.frame_set(1)
for screen in bpy.data.screens:
 for a in screen.areas:
  if a.type=='VIEW_3D':a.spaces.active.region_3d.view_perspective='CAMERA'
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT,'casa-conejo.blend'))
# Export static town only: runtime rabbits and carrots are interactive objects.
bpy.ops.object.select_all(action='DESELECT')
for o in sc.objects:
 if o.type=='MESH' and not o.parent and not o.name.startswith(('Carrot','Physics')):o.select_set(True)
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT,'town.glb'),use_selection=True,export_animations=False,export_cameras=False,export_lights=False)
json.dump({'colliders':coll,'carrots':carrots,'lamps':lamps},open(os.path.join(OUT,'world.json'),'w'))
sc.render.filepath=os.path.join(OUT,'town-preview.png');bpy.ops.render.render(write_still=True)
