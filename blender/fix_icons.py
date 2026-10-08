import bpy,os,math,json
OUT=os.path.dirname(os.path.abspath(__file__))
bpy.ops.wm.open_mainfile(filepath=os.path.join(OUT,'casa-conejo.blend'))
verts=[];faces=[]
for iy in range(13):
 yy=-2.2+iy*4.4/12
 for ix in range(25):
  xx=-3.85+ix*7.7/24;z=9.10+1.5*math.sin((xx+3.7)/7.4*math.pi)+.35*math.cos(yy)-.13;verts.append((xx,41+yy,z))
for iy in range(12):
 for ix in range(24):k=iy*25+ix;faces.append((k,k+1,k+26,k+25))
edge=list(range(25))+[i*25+24 for i in range(1,13)]+list(range(12*25+23,12*25-1,-1))+[i*25 for i in range(11,0,-1)]
for i,k in enumerate(edge):j=edge[(i+1)%len(edge)];base=len(verts);verts.extend([(verts[k][0],verts[k][1],8.94),(verts[j][0],verts[j][1],8.94)]);faces.append((k,j,base+1,base))
me=bpy.data.meshes.new('Continuous dragon roof');me.from_pydata(verts,[],faces);me.update();o=bpy.data.objects.new('V3_Icon Dragon roof surface',me);bpy.context.collection.objects.link(o);o.data.materials.append(bpy.data.materials.get('Icon mosaic 1'))
for f in me.polygons:f.use_smooth=True
# Flat tesserae replace rounded beads, preserving each existing tile's color.
me=bpy.data.meshes.new('Flat ceramic tessera');me.from_pydata([(-1,-1,-1),(1,-1,-1),(1,1,-1),(-1,1,-1),(-1,-1,1),(1,-1,1),(1,1,1),(-1,1,1)],[],[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)]);me.materials.append(bpy.data.materials.get('Icon white concrete'))
for o in bpy.data.objects:
 if o.name.startswith('V3_Icon Trencadis tile'):
  material=o.active_material;o.data=me;o.material_slots[0].link='OBJECT';o.material_slots[0].material=material;o.rotation_euler.y=.15
# Walk-up steps to the raised park terrace.
for i in range(4):
 bpy.ops.mesh.primitive_cube_add(size=1,location=(20,34.25+i*.5,.1*(i+1)));o=bpy.context.object;o.name='V3_Icon Guell entrance step';o.scale=(4,.5,.2*(i+1));o.data.materials.append(bpy.data.materials.get('Icon limestone'))
w=json.load(open(os.path.join(OUT,'world.json')));w['landmarks'][4]['camera']=[5,9,25];w['landmarks'][4]['look']=[-19,43,12];json.dump(w,open(os.path.join(OUT,'world.json'),'w'),ensure_ascii=False)
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(OUT,'casa-conejo.blend'))
bpy.ops.object.select_all(action='DESELECT')
for o in bpy.context.scene.objects:
 if o.type=='MESH' and not o.parent and not o.name.startswith(('Carrot','Physics')):o.select_set(True)
bpy.ops.export_scene.gltf(filepath=os.path.join(OUT,'town.glb'),use_selection=True,export_animations=False,export_cameras=False,export_lights=False)
