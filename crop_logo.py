from PIL import Image
import math

# Carica l'immagine
img = Image.open('/mnt/user-data/uploads/1769725941240_Gemini_Generated_Image_19jphv19jphv19jp.png')

# Ottieni dimensioni
width, height = img.size

# Trova il centro
center_x = width // 2
center_y = height // 2

# Raggio del cerchio (circa 40% della larghezza)
radius = min(width, height) // 2 - 50

# Crea una maschera circolare
mask = Image.new('L', (width, height), 0)
for x in range(width):
    for y in range(height):
        if math.sqrt((x - center_x)**2 + (y - center_y)**2) <= radius:
            mask.putpixel((x, y), 255)

# Applica la maschera
img.putalpha(mask)

# Ritaglia il bounding box
bbox = img.getbbox()
img_cropped = img.crop(bbox)

# Ridimensiona a dimensioni ottimali
img_cropped = img_cropped.resize((512, 512), Image.LANCZOS)

# Salva
img_cropped.save('public/pepeline-logo.png')
print("✅ Logo ritagliato e salvato in public/pepeline-logo.png")
