import bpy,os
OUT=os.path.dirname(os.path.abspath(__file__))
bpy.ops.wm.open_mainfile(filepath=OUT+'/casa-conejo.blend')
stone=bpy.data.materials.get('Regional ivory');glass=bpy.data.materials.get('Regional blue glazing');metal=bpy.data.materials.get('Regional titanium')
def box(n,p,s,m):
 bpy.ops.mesh.primitive_cube_add(size=1,location=p);o=bpy.context.object;o.name='V8_Museum '+n;o.scale=s;o.data.materials.append(m)
box('foyer floor',(32,-41,.07),(4,5,.12),stone)
box('foyer roof',(32,-41,3.1),(4,5,.15),metal)
for yy in [-43.5,-38.5]:
 box('glass wall',(32,yy,1.55),(4,.10,3),glass)
 for xx in [30,32,34]:box('frame',(xx,yy,1.55),(.09,.16,3),metal)
for yy in [-43,-39]:box('entry side',(34,yy,1.55),(.13,1,3),glass)
box('entry lintel',(34,-41,2.8),(.15,3,.6),metal)
exec(open(OUT+'/fix_regions.py').read().split('bpy.context.scene.frame_set(1)')[1].join(['bpy.context.scene.frame_set(1)','']))
