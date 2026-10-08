import bpy,os
OUT=os.path.dirname(os.path.abspath(__file__))
bpy.ops.wm.open_mainfile(filepath=OUT+'/casa-conejo.blend')
for o in list(bpy.data.objects):
 if o.name.startswith('Distant rolling hill') and (o.location.y < -25 or o.location.x < -30):bpy.data.objects.remove(o,do_unlink=True)
bpy.context.scene.frame_set(1)
bpy.ops.wm.save_as_mainfile(filepath=OUT+'/casa-conejo.blend')
bpy.ops.object.select_all(action='DESELECT')
for o in bpy.context.scene.objects:
 if o.type=='MESH' and not o.parent and not o.name.startswith(('Carrot','Physics')):o.select_set(True)
bpy.ops.export_scene.gltf(filepath=OUT+'/town.glb',use_selection=True,export_animations=False,export_cameras=False,export_lights=False)

