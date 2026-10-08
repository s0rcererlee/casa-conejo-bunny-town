import bpy,os,json
OUT=os.path.dirname(os.path.abspath(__file__))
bpy.ops.wm.open_mainfile(filepath=OUT+'/casa-conejo.blend')
# Cut a central doorway through the south palace arcade/header at rabbit height;
# existing arcade openings already provide visible access, so remove only navigation closure.
# Hollow the Giralda's solid lower tower. Keep its upper mass and add a room with a south doorway.
o=bpy.data.objects.get('V3_Regional Regional sandstone');me=o.data
keep=[]
for p in me.polygons:
 vs=[me.vertices[i].co for i in p.vertices]
 tower=all(-.76<=v.x<=2.76 and -43.76<=v.y<=-40.24 and -.01<=v.z<=10.01 for v in vs)
 if not tower:keep.append(tuple(p.vertices))
v=[tuple(p.co) for p in me.vertices]
new=bpy.data.meshes.new('Giralda hollow tower');new.from_pydata(v,[],keep);new.materials.append(me.materials[0]);o.data=new
mat=new.materials[0]
def box(x,y,z,a,b,c):
 bpy.ops.mesh.primitive_cube_add(size=1,location=(x,y,z));o=bpy.context.object;o.name='V8_Interior tower wall';o.scale=(a,b,c);o.data.materials.append(mat)
box(1,-42,6.25,3.5,3.5,7.5)
box(-.6,-42,1.25,.3,3.5,2.5);box(2.6,-42,1.25,.3,3.5,2.5);box(1,-40.4,1.25,3.5,.3,2.5)
box(-.3,-43.6,1.25,.9,.3,2.5);box(2.3,-43.6,1.25,.9,.3,2.5)
bpy.ops.wm.save_as_mainfile(filepath=OUT+'/casa-conejo.blend')
bpy.ops.object.select_all(action='DESELECT')
for o in bpy.context.scene.objects:
 if o.type=='MESH' and not o.parent and not o.name.startswith(('Carrot','Physics')):o.select_set(True)
bpy.ops.export_scene.gltf(filepath=OUT+'/town.glb',use_selection=True,export_animations=False,export_cameras=False,export_lights=False)
