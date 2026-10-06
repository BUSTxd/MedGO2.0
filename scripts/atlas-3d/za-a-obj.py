# Saca de Z-Anatomy (CC BY-SA 4.0, la misma licencia que Open3DModel) las piezas
# que Open3DModel no trae, a un OBJ que extraer-o3d.mjs lee junto al del miembro.
#
#   blender -b --factory-startup Startup.blend --python scripts/atlas-3d/za-a-obj.py -- <salida.obj> "Platysma.r" "Occipital bone" ...
#
# Startup.blend es el de https://github.com/LluisV/Z-Anatomy. Open3DModel parte
# de Z-Anatomy: el esqueleto coincide (C1/C2 a < 1 mm, clavícula y escápula a
# ~2 mm). Sus nervios y vasos, en cambio, no (~1 cm de los de Open3DModel): uno
# que Open3DModel no trae (el accesorio) se mide contra los músculos de
# Open3DModel y, si hace falta, se corrige con DESPLAZAR en o3d.mjs.
#
# Coordenadas como el exportador OBJ de Blender (Y arriba): (x, z, -y), en metros,
# con los modificadores aplicados (el ligamento nucal es un plano con grosor).
import bpy, sys

args = sys.argv[sys.argv.index('--') + 1:]
salida, nombres = args[0], args[1:]

dg = bpy.context.evaluated_depsgraph_get()
base = 1
with open(salida, 'w', encoding='utf-8') as f:
    for nombre in nombres:
        o = bpy.data.objects.get(nombre)
        if o is None:
            raise SystemExit(f'No está en el .blend: {nombre}')
        ev = o.evaluated_get(dg)
        me = ev.to_mesh()
        me.calc_loop_triangles()
        mw = o.matrix_world
        f.write(f'o {nombre}\n')
        for v in me.vertices:
            x, y, z = mw @ v.co
            f.write(f'v {x:.6f} {z:.6f} {-y:.6f}\n')
        for t in me.loop_triangles:
            a, b, c = (i + base for i in t.vertices)
            f.write(f'f {a} {b} {c}\n')
        base += len(me.vertices)
        print(f'{nombre}: {len(me.vertices)} vértices, {len(me.loop_triangles)} triángulos')
        ev.to_mesh_clear()
