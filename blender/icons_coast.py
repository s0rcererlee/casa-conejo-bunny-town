import bpy,math,random,os,json
from mathutils import Vector
OUT=os.path.dirname(os.path.abspath(__file__));random.seed(106)
bpy.ops.wm.open_mainfile(filepath=os.path.join(OUT,'casa-conejo.blend'))
s=open(os.path.join(OUT,'enrich_town.py')).read();exec(s[s.index('def mat('):s.index('# Detailed street')])
cream=mat('Icon limestone',(.77,.66,.46));white=mat('Icon white concrete',(.94,.94,.88));sand=mat('Icon beach sand',(.82,.70,.48));deep=mat('Icon Mediterranean sea',(.025,.29,.44));pool=mat('Icon reflecting pool',(.04,.53,.62));dark=mat('Icon deep windows',(.025,.07,.12));green=mat('Icon palm fronds',(.15,.35,.16));gold=mat('Icon golden ornament',(.86,.55,.13))
colors=[mat('Icon mosaic '+str(i),c) for i,c in enumerate([(.06,.49,.66),(.14,.68,.62),(.34,.37,.67),(.73,.34,.46),(.93,.69,.23),(.81,.83,.60),(.19,.44,.72),(.57,.69,.67)])]
def cone(n,p,r1,r2,d,m,v=16):
 bpy.ops.mesh.primitive_cone_add(vertices=v,radius1=r1,radius2=r2,depth=d,location=p);return add(bpy.context.object,'Icon '+n,m)
def torus(n,p,r,t,m,rotation=(0,0,0),scale=(1,1,1)):
 bpy.ops.mesh.primitive_torus_add(major_radius=r,minor_radius=t,major_segments=32,minor_segments=8,location=p,rotation=rotation);o=add(bpy.context.object,'Icon '+n,m);o.scale=scale;return o
def cross(x,y,z,size=1):
 beam('Icon cross',(x,y,z),(x,y,z+size),.08,white);beam('Icon cross',(x-size*.32,y,z+size*.7),(x+size*.32,y,z+size*.7),.08,white)
# Open the northern skyline and extend the ground to a new architectural promenade.
for o in list(bpy.data.objects):
 if o.name.startswith('Distant rolling hill') and (o.location.y>28 or o.location.x>34):bpy.data.objects.remove(o,do_unlink=True)
 elif any(k in o.name for k in ['Olive','Wildflower','Deciduous']) and (o.location.y>31 or o.location.x>35):bpy.data.objects.remove(o,do_unlink=True)
for o in bpy.data.objects:
 if o.name.startswith('Ground /'):o.scale.x=120/o.dimensions.x;o.scale.y=130/o.dimensions.y;o.location.x=-10
cube('Icon northern promenade',(0,30,.065),(80,4,.13),limestone)
cube('Icon seaside promenade',(42,5,.065),(4,105,.13),limestone)
cube('Icon beach',(46,0,.02),(4,140,.08),sand)
cube('Icon sea',(89,0,-.03),(82,220,.10),deep)
# Sagrada Família tribute: a forest of tapered, perforated towers with colored finials.
x,y=-19,43
cube('Icon Sagrada plinth',(x,y,.15),(15,17,.3),cream)
cube('Icon Sagrada nave',(x,y,3.5),(10,12,7),cream,.1)
for i in range(6):
 xx=x-4.5+i*1.8
 cone('Sagrada rooflet',(xx,y,7.7),1.1,0,2.1,cream,4)
for xx,yy,h,r in [(x-4.5,y-5.6,15,.77),(x-1.55,y-5.6,17,.8),(x+1.55,y-5.6,17,.8),(x+4.5,y-5.6,15,.77),(x-4.5,y+5.6,14,.75),(x-1.55,y+5.6,16,.75),(x+1.55,y+5.6,16,.75),(x+4.5,y+5.6,14,.75),(x-5.2,y-2,13,.7),(x-5.2,y+2,13,.7),(x+5.2,y-2,13,.7),(x+5.2,y+2,13,.7),(x-2.4,y-1.8,18,.66),(x+2.4,y-1.8,18,.66),(x-2.4,y+1.8,18,.66),(x+2.4,y+1.8,18,.66),(x,y+3.5,20,.9),(x,y,24,1.05)]:
 cone('Sagrada tower',(xx,yy,h/2),r*1.35,r*.45,h,cream,20)
 for j in range(8):
  zz=5+j*(h-6)/8
  for a in [0,math.pi/2,math.pi,math.pi*1.5]:
   rad=r*1.35-(r*.9)*zz/h
   o=cube('Icon Sagrada apertures',(xx+rad*math.sin(a),yy-rad*math.cos(a),zz),(.18,.06,.56),dark,.05);o.rotation_euler.z=a
 ball('Icon Sagrada finial',(xx,yy,h+.3),(.35,.35,.5),colors[int(h)%8])
 cross(xx,yy,h+.65,.6 if h<22 else 1.4)
for dx in [-3,0,3]:
 cube('Icon Sagrada portal',(x+dx,y-6.06,1.6),(1.5,.08,3.2),dark,.45)
 for sg in [-1,1]:beam('Icon Sagrada branched pier',(x+dx+sg*.85,y-6.15,.2),(x+dx+sg*.35,y-6.15,4.8),.13,cream)
# Casa Batlló tribute: glazed mosaic façade, bone-like balconies and a scaly curved roof.
x,y=0,41
cube('Icon Batllo core',(x,y,4.5),(7,4,9),cream,.13)
verts=[];faces=[]
for iz in range(21):
 for ix in range(21):
  xx=-3.5+ix*.35;zz=iz*.45;verts.append((x+xx,y-2.06-.12*math.sin(xx*1.7+zz*.6),zz))
for iz in range(20):
 for ix in range(20):q=iz*21+ix;faces.append((q,q+1,q+22,q+21))
me=bpy.data.meshes.new('Batllo mosaic');me.from_pydata(verts,[],faces);me.update();o=bpy.data.objects.new('V3_Icon Batllo mosaic facade',me);bpy.context.collection.objects.link(o)
for m in colors:o.data.materials.append(m)
for f in me.polygons:f.material_index=random.randrange(len(colors))
for zz in [2,4.2,6.4,8.2]:
 for xx in [-2.3,0,2.3]:
  ball('Icon Batllo window',(x+xx,y-2.2,zz),(.60,.07,.79),dark)
  torus('Batllo organic window',(x+xx,y-2.26,zz),.60,.075,cream,(math.pi/2,0,0),(1,1.25,1))
  if zz>2:
   ball('Icon Batllo balcony',(x+xx,y-2.58,zz-.42),(.81,.5,.17),white)
   torus('Batllo mask balcony',(x+xx,y-2.94,zz-.06),.44,.13,white,(math.pi/2,0,0),(1.5,.8,1))
   beam('Icon Batllo mask nose',(x+xx,y-3.0,zz-.4),(x+xx,y-3.0,zz+.2),.06,white)
for ix in range(16):
 for iy in range(7):
  xx=-3.7+ix*.49;yy=-1.9+iy*.6;zz=9.15+1.5*math.sin((xx+3.7)/7.4*math.pi)+.35*math.cos(yy)
  ball('Icon Dragon roof scale',(x+xx,y+yy,zz),(.31,.39,.17),colors[(ix+iy)%3])
cone('Batllo turret',(x-3.15,y,10.5),.42,.31,3.4,white);cross(x-3.15,y,12.3,1.05)
# Park Güell tribute: sinuous mosaic bench, colonnade and sculptural salamander.
x,y=20,41
cube('Icon Guell terrace',(x,y,.4),(15,10,.8),cream,.16)
for i in range(41):
 xx=x-7+i*.35;yy=y-3+1.0*math.sin(i*.22)
 o=cube('Icon Guell bench',(xx,yy,1.12),(.43,.70,.25),colors[i%8],.1)
 o=cube('Icon Guell backrest',(xx,yy+.27,1.6),(.43,.20,.95),white,.09);o.rotation_euler.z=math.atan(.22/.35*math.cos(i*.22))
 for k in range(3):ball('Icon Trencadis tile',(xx+(k-1)*.105,yy+.14,1.4+.18*(k%2)),(.075,.028,.085),colors[(i+k)%8])
for xx in [-5,-2.5,0,2.5,5]:
 cyl('Icon Guell column',(x+xx,y+3,2.1),.32,3.4,cream)
cube('Icon Guell shaded loggia',(x,y+3,3.9),(12,2,.3),white,.04)
for i in range(7):
 ball('Icon Mosaic salamander',(x+math.sin(i*.5)*.22,y-1+i*.28,.88),( .28 if i<5 else .19,.26,.18),colors[i%8])
for sg in [-1,1]:
 for yy in [-.7,.15]:beam('Icon Salamander leg',(x,y+yy,.85),(x+sg*.62,y+yy-.2,.82),.11,colors[1])
# Hemisfèric-inspired white ribs reflected in a turquoise pool, Calatrava tribute.
x,y=36,39
cube('Icon Calatrava pool',(x,y,.07),(15,17,.14),pool,.1)
ball('Icon Hemisferic glass',(x,y,1.1),(4,6,2.4),dark)
for i in range(15):
 yy=y-6+i*.85;factor=math.sqrt(max(.04,1-((yy-y)/6.3)**2))
 points=[(x+4.7*factor*math.cos(a),yy,1+4.0*factor*math.sin(a)) for a in [j*math.pi/20 for j in range(21)]]
 for a,b in zip(points,points[1:]):beam('Icon Calatrava white rib',a,b,.085,white)
beam('Icon Calatrava spine',(x,y-7,1),(x,y+7,1),.18,white)
for sg in [-1,1]:beam('Icon Calatrava horizontal rail',(x+sg*4.4,y-5,1),(x+sg*4.4,y+5,1),.12,white)
# Mediterranean coastal houses, palms, striped parasols and small fishing boats.
for i in range(5):
 xx,yy=37,-30+i*10
 cube('Icon coastal house',(xx,yy,1.7),(4,4,3.4),white,.1)
 cube('Icon coastal flat roof',(xx,yy,3.45),(4.3,4.3,.2),white,.06)
 for dy in [-1,1]:cube('Icon blue coastal shutters',(xx+2.05,yy+dy,1.9),(.08,.75,1.1),colors[0],.05)
 cube('Icon coastal door',(xx+2.05,yy,.9),(.08,.65,1.8),colors[6],.1)
for i in range(12):
 xx,yy=43.5,-45+i*8
 beam('Icon palm trunk',(xx,yy,0),(xx+.25,yy,4.3),.13,wood)
 for j in range(7):
  a=j*math.tau/7;points=[(xx+.25,yy,4.3),(xx+1.1*math.cos(a),yy+1.1*math.sin(a),4.7),(xx+2*math.cos(a),yy+2*math.sin(a),3.9)]
  beam('Icon palm leaf',points[0],points[1],.13,green);beam('Icon palm leaf',points[1],points[2],.16,green)
for i in range(8):
 yy=-27+i*7;cone('Beach parasol',(46,yy,2),1.05,0,.48,colors[i%8],16);cyl('Icon parasol pole',(46,yy,1),.035,2,wood);cube('Icon beach lounger',(46,yy+1.4,.3),(.7,1.5,.15),white,.05)
for yy in [-18,3,22]:
 ball('Icon fishing boat',(53,yy,.28),(.8,2,.35),colors[6]);cube('Icon boat interior',(53,yy,.56),(.65,2.3,.1),white)
 beam('Icon boat mast',(53,yy,.4),(53,yy,3.6),.04,wood)
 me=bpy.data.meshes.new('Sail');me.from_pydata([(53,yy,3.5),(53,yy,.7),(53,yy+1.5,.7)],[],[(0,1,2)]);o=bpy.data.objects.new('V3_Icon boat sail',me);bpy.context.collection.objects.link(o);o.data.materials.append(white)
# Landmark metadata and collisions. Sea is scenic; the walking limit stops at the beach.
w=json.load(open(os.path.join(OUT,'world.json')))
w['colliders'] += [[-19,43,5.8,6.7],[0,41,3.8,2.9],[36,39,4.9,6.3]]+[[37,-30+i*10,2.2,2.2] for i in range(5)]
w['landmarks'] += [
 {'name':'圣家堂 · 高迪致敬','position':[-19,43],'camera':[-1,20,20],'look':[-19,43,10],'description':'Antoni Gaudí｜圣家堂意象：18 座渐细塔楼、镂空纹样、彩色塔顶与十字架。缩比例风格化致敬，并非精确复原。'},
 {'name':'巴特罗之家 · 高迪致敬','position':[0,41],'camera':[9,25,10],'look':[0,41,5],'description':'Antoni Gaudí｜彩色釉面马赛克、骨骼般的阳台与龙鳞曲面屋顶。'},
 {'name':'古埃尔公园 · 高迪与朱若尔','position':[20,41],'camera':[29,25,10],'look':[20,41,1.8],'description':'Gaudí / Josep Maria Jujol｜蛇形长椅、碎瓷拼贴、柱廊与马赛克蜥蜴意象。'},
 {'name':'艺术科学城 · 卡拉特拉瓦致敬','position':[36,39],'camera':[53,23,12],'look':[36,39,2],'description':'Santiago Calatrava｜以瓦伦西亚 Hemisfèric 为灵感的眼形玻璃体、白色肋架与倒影水池。'},
 {'name':'地中海海岸 · 蓝白渔村','position':[42,0],'camera':[66,-25,20],'look':[42,3,1],'description':'蓝白房屋、棕榈步道、彩色阳伞、沙滩与帆船组成的虚构地中海海岸。海面为观景区。'}]
json.dump(w,open(os.path.join(OUT,'world.json'),'w'),ensure_ascii=False)
sc=bpy.context.scene;sc.frame_set(1);bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT,'casa-conejo.blend'))
bpy.ops.object.select_all(action='DESELECT')
for o in sc.objects:
 if o.type=='MESH' and not o.parent and not o.name.startswith(('Carrot','Physics')):o.select_set(True)
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT,'town.glb'),use_selection=True,export_animations=False,export_cameras=False,export_lights=False)
sc.camera.location=(60,7,45);sc.camera.rotation_euler=(Vector((6,39,5))-sc.camera.location).to_track_quat('-Z','Y').to_euler();sc.camera.data.ortho_scale=77;sc.render.filepath=os.path.join(OUT,'icons-preview.png');bpy.ops.render.render(write_still=True)
