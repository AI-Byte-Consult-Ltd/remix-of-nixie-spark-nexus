# NICS Forge: preparing an order for printing

1. The order alert arrives in Telegram with the customer's 3D model attached
   (`NF-XXXXXX.glb`). Download it.
2. On the PC with Blender and Bambu Studio run:

   ```
   blender --background --python prepare_for_print.py -- NF-XXXXXX.glb --size-cm 6 --out NF-XXXXXX
   ```

   `--size-cm` is the size from the alert (4, 6 or 8).
3. Open `NF-XXXXXX.stl` (or `.3mf`) in Bambu Studio, check the preview, slice, print.

The script has not been run against a real Blender install yet. Test it on the
first model and adjust `BASE_CUT_RATIO` if the base is too thin or too thick.
