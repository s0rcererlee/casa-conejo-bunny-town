import bpy,os
out=os.path.dirname(os.path.abspath(__file__))
bpy.ops.wm.open_mainfile(filepath=os.path.join(out,'casa-conejo.blend'))
for o in bpy.data.objects:
 if o.name.startswith('V3_Heritage arcade window'):o.location.y=-18.70
 if o.name.startswith('V3_Heritage balcony'):o.location.y=-18.5
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(out,'casa-conejo.blend'))
bpy.ops.object.select_all(action='DESELECT')
for o in bpy.context.scene.objects:
 if o.type=='MESH' and not o.parent and not o.name.startswith(('Carrot','Physics')):o.select_set(True)
bpy.ops.export_scene.gltf(filepath=os.path.join(out,'town.glb'),use_selection=True,export_animations=False,export_cameras=False,export_lights=False)
