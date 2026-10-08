import bpy,math,random,os,json
from mathutils import Vector
OUT=os.path.dirname(os.path.abspath(__file__));random.seed(82)
bpy.ops.wm.open_mainfile(filepath=os.path.join(OUT,'casa-conejo.blend'))
# Reuse this project's primitive helpers, without running the prior enrichment.
s=open(os.path.join(OUT,'enrich_town.py')).read();exec(s[s.index('def mat('):s.index('# Detailed street')])
stone=mat('Heritage sandstone',(.73,.59,.39));ivory=mat('Heritage lime plaster',(.90,.85,.71));red=mat('Heritage brick',(.54,.21,.12));gold=mat('Heritage brass',(.62,.43,.12));navy=mat('Heritage azulejo blue',(.035,.16,.34));aqua=mat('Heritage azulejo turquoise',(.06,.46,.45));glass=mat('Heritage stained glass',(.12,.29,.52))
createdBefore=set(bpy.data.objects)
def arch(x,y,z,r,depth=.3,material=stone):
 for k in range(17):
  a=math.pi*k/16;o=cube('Heritage arch',(x+r*math.cos(a),y,z+r*math.sin(a)),(.27,depth,.34),material,.015);o.rotation_euler.y=math.pi/2-a
 for sg in [-1,1]:cube('Heritage pier',(x+sg*r,y,z/2),(.3,depth,z),material,.015)
def cross(x,y,z,s=1):
 beam('Heritage cross',(x,y,z),(x,y,z+1*s),.06*s,gold);beam('Heritage cross',(x-.28*s,y,z+.7*s),(x+.28*s,y,z+.7*s),.06*s,gold)
# Parish church, south-west quarter. Fictional building combining regional references.
x,y=-9,-24
cube('Heritage church nave',(x,y,3.1),(6,8,6.2),ivory,.09)
for side in [-1,1]:
 o=cube('Heritage church roof',(x+side*1.6,y,6.85),(3.6,8.5,.22),red);o.rotation_euler.y=side*.36
 for yy in range(22):beam('Heritage roof tile',(x,y-4.2+yy*.4,7.48),(x+side*3.35,y-4.2+yy*.4,6.22),.06,red)
for yy in [-28.12,-19.88]:
 me=bpy.data.meshes.new('Pediment');me.from_pydata([(x-3,yy,6.1),(x+3,yy,6.1),(x,yy,7.5)],[],[(0,1,2)]);o=bpy.data.objects.new('V3_Heritage pediment',me);bpy.context.collection.objects.link(o);o.data.materials.append(ivory)
front=-28.2
cube('Heritage portal',(x,front,1.4),(1.7,.15,2.8),wood,.1);arch(x,front-.12,2.4,1.05,.45)
for xx in [-.44,.44]:cube('Heritage door panel',(x+xx,front-.10,1.3),(.65,.09,2.1),red,.04)
for yy in [-28.25,-19.75]:
 o=cyl('Heritage rose window',(x,yy,4.85),.91,.08,glass);o.rotation_euler.x=math.pi/2
 bpy.ops.mesh.primitive_torus_add(major_radius=.94,minor_radius=.13,major_segments=40,minor_segments=8,location=(x,yy,4.85),rotation=(math.pi/2,0,0));add(bpy.context.object,'Heritage rose surround',stone)
 for k in range(12):
  a=k*math.tau/12;beam('Heritage tracery',(x,yy-.07,4.85),(x+.83*math.cos(a),yy-.07,4.85+.83*math.sin(a)),.026,stone)
for sg in [-1,1]:
 for yy in [-26.5,-23.5,-20.5]:
  cube('Heritage buttress',(x+sg*3.15,yy,2.4),(.5,.7,4.8),stone,.03)
  cube('Heritage side stained glass',(x+sg*3.02,yy,3.7),(.06,.8,1.7),glass,.1)
cross(x,front,7.45,.9)
# Open belfry: four piers, actual visible bell, brick decorative bands.
tx,ty=-13.5,-25.5
cube('Heritage bell tower',(tx,ty,3.9),(2.4,2.4,7.8),red,.04)
for zz in [1,4.5,7.6,10]:cube('Heritage tower cornice',(tx,ty,zz),(2.65,2.65,.17),stone,.02)
for dx in [-.96,.96]:
 for dy in [-.96,.96]:cube('Heritage belfry pier',(tx+dx,ty+dy,8.9),(.4,.4,2.2),ivory,.025)
beam('Heritage bell beam',(tx-1,ty,9.4),(tx+1,ty,9.4),.10,wood)
bpy.ops.mesh.primitive_cone_add(vertices=24,radius1=.52,radius2=.22,depth=.65,location=(tx,ty,8.8));add(bpy.context.object,'Heritage bell',gold)
cube('Heritage tower cap',(tx,ty,10.08),(2.8,2.8,.28),red,.04);cross(tx,ty,10.25,1.1)
cube('Heritage church forecourt',(x,-30.3,.07),(11,4.0,.14),limestone)
for xx in [-13,-5]:cyl('Heritage cypress trunk',(xx,-30,1),.12,2,wood);ball('Heritage cypress',(xx,-30,2.1),(.52,.52,1.9),leaf)
# Arcaded market hall overlooking a small east square. Walkable arches.
cube('Heritage east square',(26,-15,.05),(12,8,.10),limestone)
for i in range(5):arch(22+i*2,-19,1.7,.86,.5)
cube('Heritage arcade cornice',(26,-19,2.9),(10.6,.8,.25),stone,.03)
cube('Heritage market upper',(26,-19.8,4),(10.6,2.1,2.1),ivory,.04)
for i in range(5):
 cube('Heritage arcade window',(22+i*2,-18.70,4.05),(.65,.05,.9),navy,.07)
 cube('Heritage balcony',(22+i*2,-18.5,3.5),(1,.5,.12),stone)
o=cube('Heritage arcade roof',(26,-19.8,5.2),(11,2.7,.22),red)
# Ceramic courtyard with orange trees, fountain and repeated geometric tile motifs.
cube('Heritage patio',(26,-7,.05),(8,6,.1),ivory)
for ix in range(12):
 for iy in range(8):
  o=cube('Heritage azulejo',(22.5+ix*.6,-9.2+iy*.6,.115),(.36,.36,.025),navy if (ix+iy)%2 else aqua);o.rotation_euler.z=math.pi/4
cyl('Heritage patio fountain',(26,-7,.35),.85,.6,stone);cyl('Heritage patio water',(26,-7,.67),.7,.03,water)
for xx,yy in [(23,-5),(29,-5),(23,-9),(29,-9)]:
 cyl('Heritage orange trunk',(xx,yy,.9),.1,1.8,wood);ball('Heritage orange canopy',(xx,yy,2.1),(.8,.8,.9),leaf)
 for k in range(5):a=k*math.tau/5;ball('Heritage orange fruit',(xx+.68*math.cos(a),yy+.68*math.sin(a),2.1),(.1,.1,.1),terracotta)
# Roadside devotional niche, votive candles and a small cross.
x,y=7,-23
cube('Heritage shrine',(x,y,1.45),(1.7,.7,2.9),ivory,.08);cube('Heritage niche',(x,y-.38,1.65),(1,.05,1.7),navy,.15);arch(x,y-.47,2.05,.65,.24)
ball('Heritage devotional head',(x,y-.5,1.95),(.14,.12,.16),stone)
bpy.ops.mesh.primitive_cone_add(vertices=16,radius1=.30,radius2=.09,depth=.75,location=(x,y-.5,1.42));add(bpy.context.object,'Heritage devotional figure',aqua)
cross(x,y,3.0,.65)
for dx in [-.45,.45]:cyl('Heritage votive candle',(x+dx,y-.55,.77),.045,.28,ivory)
# Clear only foliage that intersects the new landmark footprints.
areas=[(-9,-24,5.9,5.1),(26,-19.8,6,2.2),(26,-7,4.5,3.5),(7,-23,1.2,1)]
for o in list(createdBefore):
 if o.type=='MESH' and any(k in o.name for k in ['Olive','Wildflower','Deciduous']):
  if any(abs(o.location.x-a)<w and abs(o.location.y-b)<d for a,b,w,d in areas):bpy.data.objects.remove(o,do_unlink=True)
# Mark added objects consistently for runtime camera/season handling.
sc=bpy.context.scene
w=json.load(open(os.path.join(OUT,'world.json')))
w['colliders'] += [[-9,-24,3.6,4.3],[-13.5,-25.5,1.4,1.4],[7,-23,1,.6],[26,-7,1,1]]
# Arcade piers only; arches and courtyard remain passable at ground level.
for i in range(5):
 for sg in [-1,1]:w['colliders'].append([22+i*2+sg*.86,-19,.18,.3])
w['landmarks']=[{'name':'圣玛丽亚教堂','position':[-9,-24],'camera':[-1,-39,12],'look':[-9,-24,4],'description':'虚构堂区教堂：玫瑰窗、扶壁、铜钟与砖砌钟楼。'}, {'name':'拱廊市集','position':[26,-16],'camera':[34,-12,8],'look':[26,-19,2.5],'description':'可穿行的拱廊与小广场，参考西班牙地方市镇的公共空间。'}, {'name':'瓷砖橘树庭院','position':[26,-7],'camera':[26,-13,13],'look':[26,-7,.8],'description':'几何瓷砖、橘树与中心水池，构成安达卢西亚风格庭院。'}, {'name':'路边礼拜龛','position':[7,-23],'camera':[10,-28,3],'look':[7,-23,1.7],'description':'带十字架、简化圣像与供奉蜡烛的安静角落。'}]
json.dump(w,open(os.path.join(OUT,'world.json'),'w'),ensure_ascii=False)
sc.frame_set(1);bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT,'casa-conejo.blend'))
bpy.ops.object.select_all(action='DESELECT')
for o in sc.objects:
 if o.type=='MESH' and not o.parent and not o.name.startswith(('Carrot','Physics')):o.select_set(True)
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT,'town.glb'),use_selection=True,export_animations=False,export_cameras=False,export_lights=False)
sc.camera.location=(-1,-42,18);sc.camera.rotation_euler=(Vector((-8,-22,3))-sc.camera.location).to_track_quat('-Z','Y').to_euler();sc.camera.data.ortho_scale=32;sc.render.filepath=os.path.join(OUT,'heritage-preview.png');bpy.ops.render.render(write_still=True)
