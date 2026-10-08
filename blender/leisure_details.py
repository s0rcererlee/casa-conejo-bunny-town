import os,bpy,math
from math import sin,cos,pi
OUT=os.path.dirname(os.path.abspath(__file__))
exec(open(OUT+'/regions.py').read().split('# Clear peripheral')[0])
rose=material('candy pink',(.95,.42,.57));mint=material('pistachio',(.45,.8,.57));gold=material('brioche',(.84,.48,.16))
# Roof-scale food sculptures make each business recognizable from a distance.
for r,z,h,m in [(1,3.7,.6,cream),(.85,4.3,.55,rose),(.65,4.85,.5,cream),(.14,5.35,.25,red)]:ring(m,-25,-61,0,r,z,z+h,n=32)
ring(gold,-15,-61,0,.65,3.7,4.65,n=24)
for dx,m in [(-.5,rose),(.5,mint),(0,cream)]:
 ring(m,-15+dx,-61,0,.55,4.65,5.4+(dx==0)*.4,n=24)
for dx in [-.5,.5]:
 box(gold,-5+dx,-61,4.25,.75,2.6,.7)
 for y in [-61.8,-61,-60.2]:box(cream,-5+dx,y,4.62,.6,.07,.02)
for r,z,h,m in [(1,3.7,.4,gold),(1.05,4.1,.12,green),(1,4.22,.25,brick),(1.03,4.47,.12,red),(1,4.59,.4,gold)]:ring(m,15,-61,0,r,z,z+h,n=32)
# Fine dining pergola, candlelit place settings, steak grill chimney.
for x in [2,8]:box(dark,x,-66,1.6,.12,.12,3.2)
for x in [2,3,4,5,6,7,8]:box(stone,x,-66,3.2,.10,2.5,.1)
box(dark,27,-59,4.4,.7,.7,1.7);box(cream,27,-59,5.3,1,1,.15)
# Shade trees, flower-filled planters, and striped parasols.
for x,y in [(-35,-70),(-20,-71),(-10,-71),(0,-71),(10,-71),(20,-71),(34,-70),(-35,-90),(-20,-92),(-13,-95),(16,-95),(36,-94),(-37,-78),(36,-77)]:
 ring(brick,x,y,0,.7,.04,.55,n=16);box(stone,x,y,1.6,.18,.18,2.7)
 for r,z in [(1.25,2.2),(1,3),( .7,3.7)]:ring(green,x,y,0,r,z,z+.7,n=12)
for x,y in [(-32,-74),(28,-72),(-20,-94)]:
 box(dark,x,y,1.3,.08,.08,2.6)
 v=[(x,y,3.2)]+[(x+2*cos(i*pi/8),y+2*sin(i*pi/8),2.5) for i in range(16)]
 for i in range(16):mesh(rose if i%2 else cream,v,[(0,i+1,(i+1)%16+1)])
for x in range(-32,34,4):
 box(brick,x,-70.5,.25,1.1,.45,.45)
 for dx in [-.3,0,.3]:ring(rose,x+dx,-70.5,0,.16,.5,.7,n=8)
for m,(v,f) in batches.items():
 me=bpy.data.meshes.new(m.name);me.from_pydata(v,[],f);me.update();o=bpy.data.objects.new('V9_Detail '+m.name,me);bpy.context.collection.objects.link(o);me.materials.append(m)
exec(open(OUT+'/fix_regions.py').read().split('bpy.context.scene.frame_set(1)')[1].join(['bpy.context.scene.frame_set(1)','']))
