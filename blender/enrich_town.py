import bpy, math, random, os
from mathutils import Vector
random.seed(71); OUT=os.path.dirname(os.path.abspath(__file__))
bpy.ops.wm.open_mainfile(filepath=os.path.join(OUT,'casa-conejo.blend'))
# Idempotent enrichment; the editable original architecture is retained.
for o in list(bpy.data.objects):
 if o.name.startswith('V3_'):bpy.data.objects.remove(o,do_unlink=True)
def mat(n,c):
 m=bpy.data.materials.get(n) or bpy.data.materials.new(n);m.diffuse_color=(*c,1);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*c,1);p.inputs['Roughness'].default_value=.8;return m
def add(o,n,m):o.name='V3_'+n;o.data.materials.append(m);return o
def cube(n,p,s,m,b=0):
 bpy.ops.mesh.primitive_cube_add(size=1,location=p);o=bpy.context.object;o.scale=s;bpy.ops.object.transform_apply(location=False,rotation=False,scale=True);add(o,n,m)
 if b:q=o.modifiers.new('Soft worn edge','BEVEL');q.width=b;q.segments=2;o.modifiers.new('Weighted corners','WEIGHTED_NORMAL')
 return o
def ball(n,p,s,m):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=12,ring_count=8,radius=1,location=p);o=bpy.context.object;o.scale=s;add(o,n,m)
 for f in o.data.polygons:f.use_smooth=True
 return o
def cyl(n,p,r,d,m):
 bpy.ops.mesh.primitive_cylinder_add(vertices=12,radius=r,depth=d,location=p);return add(bpy.context.object,n,m)
def beam(n,a,b,r,m):
 o=cyl(n,(Vector(a)+Vector(b))/2,r,(Vector(b)-Vector(a)).length,m);o.rotation_euler=(Vector(b)-Vector(a)).to_track_quat('Z','Y').to_euler();return o
limestone=mat('V3_Limestone',(.64,.58,.45));wood=mat('V3_Oak',(.26,.13,.065));iron=mat('V3_Aged bronze',(.12,.15,.12));blue=mat('V3_Ceramic blue',(.05,.30,.43));pink=mat('V3_Rose',(.88,.27,.42));leaf=mat('V3_Deciduous foliage',(.30,.43,.11));terracotta=mat('V3_Terra',(.57,.23,.12));water=mat('V3_River water',(.06,.27,.29))
# Detailed street furniture and architectural accents.
for house in [o for o in bpy.data.objects if o.name.startswith('Casa ')]:
 x,y,z=house.location;w,d,h=house.dimensions;front=y-d/2-.13
 beam('Drainpipe',(x+w/2-.1,front,.25),(x+w/2-.1,front,h),.035,iron)
 cube('Doorstep',(x,front-.25,.13),(1.1,.65,.18),limestone,.05)
 cube('House number tile',(x+.68,front,1.65),(.22,.035,.23),blue,.025)
 cube('Chimney',(x+.6,y+.55,h+.9),(.38,.42,1.1),terracotta,.035)
 cube('Chimney cap',(x+.6,y+.55,h+1.48),(.55,.6,.13),limestone,.025)
 for dx in [-w*.3,w*.3]:
  cube('Flower box',(x+dx,front-.25,1.00),(.85,.26,.22),terracotta,.025)
  for k in range(5):ball('Flowering window',(x+dx-.32+k*.16,front-.26,1.22),(.12,.13,.14),pink)
 for side in [-1,1]:
  for k in range(6):cube('Shutter louvre',(x+side*w*.30-.37,front-.03,1.22+k*.13),(.25,.035,.035),blue)
# Geometry batched into one cobblestone mesh, avoiding hundreds of draw calls.
verts=[];faces=[]
for x in range(-10,11):
 for y in range(-10,11):
  xx=x*.72+(y%2)*.34;yy=y*.7
  if xx*xx+(yy+1)**2<5.1:continue
  sx=.64+random.uniform(-.04,.04);sy=.61;zz=.09+random.random()*.014;idx=len(verts)
  verts += [(xx+dx*sx/2,yy+dy*sy/2,z) for z in [zz,zz+.035] for dx,dy in [(-1,-1),(1,-1),(1,1),(-1,1)]]
  faces += [tuple(idx+j for j in f) for f in [(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)]]
me=bpy.data.meshes.new('Cobbles');me.from_pydata(verts,[],faces);me.update();o=bpy.data.objects.new('V3_Cobblestone plaza',me);bpy.context.collection.objects.link(o);o.data.materials.append(limestone);q=o.modifiers.new('Worn paver edges','BEVEL');q.width=.025;q.segments=2
for x,y in [(-9,-7),(9,-7),(-9,7),(9,7),(-17,0),(16,1)]:
 cyl('Barrel',(x,y,.48),.32,.9,wood)
 for z in [.18,.78]:
  bpy.ops.mesh.primitive_torus_add(major_radius=.32,minor_radius=.027,major_segments=16,minor_segments=6,location=(x,y,z));add(bpy.context.object,'Barrel hoop',iron)
 cube('Market crate',(x+.7,y,.23),(.6,.6,.46),wood,.025)
 for i in range(5):ball('Lemons',(x+.7+random.uniform(-.2,.2),y+random.uniform(-.2,.2),.51),(.09,.075,.08),mat('V3_Lemon',(.91,.69,.08)))
# Softer, layered olive canopies; evergreen species stay green through the year.
for o in list(bpy.data.objects):
 if o.name.startswith('Olive crown'):
  for p in o.data.polygons:p.use_smooth=True
# Deciduous accent trees, deliberately outside paths and garden sightlines.
for x,y in [(-16,16),(16,17),(-17,-17),(17,-18),(-32,8),(27,8),(29,-10),(-30,-18)]:
 cyl('Deciduous trunk',(x,y,1.4),.18,2.8,wood)
 for dx,dy,z in [(-.65,0,2.8),(.65,.3,3.2),(0,-.5,3.7),(.1,.5,4.0)]:
  beam('Tree branch',(x,y,1.8),(x+dx,y+dy,z),.07,wood);ball('Deciduous canopy',(x+dx,y+dy,z),(1.12,.98,1.05),leaf)
# Narrow stream beyond the village; a low timber crossing extends the north lane.
verts=[];faces=[]
for i in range(65):
 x=-38+i*1.2;y=25+1.4*math.sin(x*.13);verts.extend([(x,y-1.1,.025),(x,y+1.1,.025)])
 if i:faces.append((2*i-2,2*i-1,2*i+1,2*i))
me=bpy.data.meshes.new('Stream surface');me.from_pydata(verts,[],faces);me.update();o=bpy.data.objects.new('V3_Stream',me);bpy.context.collection.objects.link(o);o.data.materials.append(water)
for i in range(48):
 x=-35+i*1.5;y=25+1.4*math.sin(x*.13)
 for sg in [-1,1]:ball('Riverbank stone',(x,y+sg*1.22,.08),(.45,.26,.18),limestone)
for i in range(16):cube('Bridge plank',(0,23.3+i*.23,.16),(2.3,.21,.16),wood,.018)
for x in [-1.2,1.2]:
 for y in [23.2,24.5,25.8,27]:cyl('Bridge post',(x,y,.65),.05,1.2,wood)
 beam('Bridge handrail',(x,23.2,1.2),(x,27,1.2),.045,wood)
# Procedural surface detail for the Blender render (the browser adds UV textures).
for m in bpy.data.materials:
 if any(t in m.name.lower() for t in ['plaster','limestone','terra','oak']):
  m.use_nodes=True;nt=m.node_tree;p=nt.nodes.get('Principled BSDF');noise=nt.nodes.new('ShaderNodeTexNoise');noise.inputs['Scale'].default_value=90;bump=nt.nodes.new('ShaderNodeBump');bump.inputs['Strength'].default_value=.16;bump.inputs['Distance'].default_value=.035;nt.links.new(noise.outputs['Fac'],bump.inputs['Height']);nt.links.new(bump.outputs['Normal'],p.inputs['Normal'])
sc=bpy.context.scene;sc.frame_set(1);sc.camera.location=(34,-42,30);sc.camera.rotation_euler=(Vector((0,1,1))-sc.camera.location).to_track_quat('-Z','Y').to_euler();sc.camera.data.ortho_scale=53;sc.cycles.samples=32
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT,'casa-conejo.blend'))
bpy.ops.object.select_all(action='DESELECT')
for o in sc.objects:
 if o.type=='MESH' and not o.parent and not o.name.startswith(('Carrot','Physics')):o.select_set(True)
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT,'town.glb'),use_selection=True,export_animations=False,export_cameras=False,export_lights=False)
sc.render.filepath=os.path.join(OUT,'town-preview.png');bpy.ops.render.render(write_still=True)
