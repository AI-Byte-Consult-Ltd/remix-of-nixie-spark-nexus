"""NICS Forge: turn a customer's GLB into a print-ready file for Bambu Lab A1 mini.

Run on the Windows PC where Blender is installed (no Blender account needed):

  blender --background --python prepare_for_print.py -- ORDER.glb --size-cm 6 --out NF-ABC234

Produces NF-ABC234.stl (always) and NF-ABC234.3mf (only if a 3MF exporter is
available in this Blender). Open the file in Bambu Studio, check the preview,
slice and print. A1 mini build volume is 180 x 180 x 180 mm.

What it does: imports the GLB, merges its meshes, removes duplicate vertices,
fixes normals, closes small holes, scales the model so its LONGEST side equals
the ordered size (4 / 6 / 8 cm), sets the origin to the bottom centre, cuts a
thin flat base so the piece stands without supports, and exports.
"""
import sys
import argparse

import bpy
import bmesh

BED_MM = 180.0
BASE_CUT_RATIO = 0.015  # cut this fraction of the height to get a flat base


def parse_args():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    p = argparse.ArgumentParser()
    p.add_argument("input")
    p.add_argument("--size-cm", type=float, required=True, choices=[4, 6, 8])
    p.add_argument("--out", required=True, help="output path without extension")
    return p.parse_args(argv)


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()


def import_and_join(path):
    bpy.ops.import_scene.gltf(filepath=path)
    meshes = [o for o in bpy.context.scene.objects if o.type == "MESH"]
    if not meshes:
        raise SystemExit("No mesh found in " + path)
    bpy.ops.object.select_all(action="DESELECT")
    for o in meshes:
        o.select_set(True)
    bpy.context.view_layer.objects.active = meshes[0]
    if len(meshes) > 1:
        bpy.ops.object.join()
    obj = bpy.context.view_layer.objects.active
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    return obj


def clean_mesh(obj):
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    bmesh.ops.remove_doubles(bm, verts=bm.verts, dist=1e-5)
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    holes = [e for e in bm.edges if e.is_boundary]
    if holes:
        bmesh.ops.holes_fill(bm, edges=holes, sides=8)
    bm.to_mesh(obj.data)
    bm.free()


def fit_size(obj, size_cm):
    target_mm = min(size_cm * 10.0, BED_MM - 10.0)
    longest = max(obj.dimensions)
    if longest <= 0:
        raise SystemExit("Model has zero size")
    factor = target_mm / longest
    obj.scale = (factor, factor, factor)
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)


def ground_and_flatten(obj):
    # Put the lowest point on Z=0 and centre on X/Y.
    zs = [v.co.z for v in obj.data.vertices]
    xs = [v.co.x for v in obj.data.vertices]
    ys = [v.co.y for v in obj.data.vertices]
    cx, cy, zmin = (min(xs) + max(xs)) / 2, (min(ys) + max(ys)) / 2, min(zs)
    for v in obj.data.vertices:
        v.co.x -= cx
        v.co.y -= cy
        v.co.z -= zmin
    height = max(v.co.z for v in obj.data.vertices)

    cut_z = height * BASE_CUT_RATIO
    bm = bmesh.new()
    bm.from_mesh(obj.data)
    geom = bm.verts[:] + bm.edges[:] + bm.faces[:]
    res = bmesh.ops.bisect_plane(
        bm, geom=geom, dist=1e-6, plane_co=(0, 0, cut_z), plane_no=(0, 0, 1), clear_inner=True
    )
    cut_edges = [e for e in res["geom_cut"] if isinstance(e, bmesh.types.BMEdge)]
    if cut_edges:
        bmesh.ops.holes_fill(bm, edges=[e for e in bm.edges if e.is_boundary], sides=0)
    for v in bm.verts:
        v.co.z -= cut_z
    bm.to_mesh(obj.data)
    bm.free()


def export(obj, out):
    bpy.ops.object.select_all(action="DESELECT")
    obj.select_set(True)
    bpy.context.view_layer.objects.active = obj
    # Blender units are treated as millimetres by slicers for STL/3MF.
    if hasattr(bpy.ops.wm, "stl_export"):
        bpy.ops.wm.stl_export(filepath=out + ".stl", export_selected_objects=True)
    else:
        bpy.ops.export_mesh.stl(filepath=out + ".stl", use_selection=True)
    print("Wrote", out + ".stl")
    exporter = getattr(getattr(bpy.ops, "export_mesh", None), "threemf", None)
    if exporter:
        exporter(filepath=out + ".3mf", use_selection=True)
        print("Wrote", out + ".3mf")
    else:
        print("No 3MF exporter in this Blender: open the STL in Bambu Studio and save as 3MF if needed.")


def main():
    a = parse_args()
    clear_scene()
    obj = import_and_join(a.input)
    clean_mesh(obj)
    fit_size(obj, a.size_cm)
    ground_and_flatten(obj)
    d = obj.dimensions
    print("Final size mm: %.1f x %.1f x %.1f" % (d.x, d.y, d.z))
    export(obj, a.out)


main()
