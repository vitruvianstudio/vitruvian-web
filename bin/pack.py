import os
import json
from PIL import Image
import base64
from io import BytesIO

input_path = '../public/spritesheets'
output_path = '../src/data/packed.json'

def get_preview_image(item, base_path):
        tile_size = 64
        row = 2
        col = 0

        color1 = ''
        color2 = ''
        color3 = ''
        color4 = ''

        path = ''

        if os.path.exists(os.path.join(base_path, item['path'], 'walk.png')):
            path = os.path.join(base_path, item['path'], 'walk.png')

        elif os.path.exists(os.path.join(base_path, item['path'], 'male', 'walk.png')):
            path = os.path.join(base_path, item['path'], 'male', 'walk.png')

        elif os.path.exists(os.path.join(base_path, item['path'], 'female', 'walk.png')):
            path = os.path.join(base_path, item['path'], 'female', 'walk.png')

        elif os.path.exists(os.path.join(base_path, item['path'], 'child', 'walk.png')):
            path = os.path.join(base_path, item['path'], 'child', 'walk.png')

        elif os.path.exists(os.path.join(base_path, item['path'], 'fg', 'walk.png')):
            path = os.path.join(base_path, item['path'], 'fg', 'walk.png')

        elif os.path.exists(os.path.join(base_path, item['path'], 'male', 'fg', 'walk.png')):
            path = os.path.join(base_path, item['path'], 'male', 'fg', 'walk.png')

        elif os.path.exists(os.path.join(base_path, item['path'], 'female', 'fg', 'walk.png')):
            path = os.path.join(base_path, item['path'], 'female', 'fg', 'walk.png')

        elif os.path.exists(os.path.join(base_path, item['path'], 'child', 'fg', 'walk.png')):
            path = os.path.join(base_path, item['path'], 'child', 'fg', 'walk.png')

        elif os.path.exists(os.path.join(base_path, item['path'], 'male', 'thrust.png')):
            path = os.path.join(base_path, item['path'], 'male', 'thrust.png')

        elif os.path.exists(os.path.join(base_path, item['path'], 'fg', 'slash.png')):
            path = os.path.join(base_path, item['path'], 'fg', 'slash.png')

        elif os.path.exists(os.path.join(base_path, item['path'], 'shoot.png')):
            path = os.path.join(base_path, item['path'], 'shoot.png')

        elif os.path.exists(os.path.join(base_path, item['path'], 'fg', 'shoot.png')):
            path = os.path.join(base_path, item['path'], 'fg', 'shoot.png')

        elif os.path.exists(os.path.join(base_path, item['path'], 'backslash.png')):
            path = os.path.join(base_path, item['path'], 'backslash.png')

        elif os.path.exists(os.path.join(base_path, item['path'], 'fg', 'backslash.png')):
            path = os.path.join(base_path, item['path'], 'fg', 'backslash.png')

        elif os.path.exists(os.path.join(base_path, item['path'], 'whip.png')):
            path = os.path.join(base_path, item['path'], 'whip.png')

        elif os.path.exists(os.path.join(base_path, item['path'], 'fg', 'whip.png')):
            path = os.path.join(base_path, item['path'], 'fg', 'whip.png')

        else:
            print(item)
            print(os.path.join(base_path, item['path'], 'male', 'walk.png'))
            exit()


        if 'primary' in item['colors']:
            color1 = item['colors']['primary']
        if 'secondary' in item['colors']:
            color2 = item['colors']['secondary']
        if 'tertiary' in item['colors']:
            color3 = item['colors']['tertiary']
        if 'quaternary' in item['colors']:
            color4 = item['colors']['quaternary']

        if item['id'] in ['anatomy.tail.lizard', 'anatomy.wings.lizard']:
            row = 0

        if item['id'] in ['clothes.helmet_accessory.horns1', 'clothes.helmet_accessory.horns2', 'clothes.helmet_accessory.horns3', 'equipment.misc.whip']:
            path = path.replace('fg', 'bg')

        if item['id'] in ['equipment.bows.great', 'equipment.bows.normal', 'equipment.bows.recurve', 'equipment.tools.axe', 'equipment.tools.hammer', 'equipment.tools.pickaxe']:
            path = path.replace('fg', 'bg')
            tile_size = 128
            row = 0

        if item['id'] in [
            'equipment.misc.boomerang',
            'equipment.misc.club',
            'equipment.misc.flail',
            'equipment.spears.dragon',
            'equipment.spears.longspear',
            'equipment.spears.trident',
            'equipment.staffs.crystal',
            'equipment.staffs.crystal_on',
            'equipment.staffs.wooden',
            'equipment.staffs.wooden_on',
            'equipment.swords.scimitar'
            'equipment.misc.whip',
        ]:
            tile_size = 192

        if 'clothes.cape' in item['id']:
            row = 0

        if item['id'] == 'equipment.misc.whip':
            tile_size = 192
            row = 0

        if item['id'] in ['equipment.swords.katana', 'equipment.swords.longsword_alt', 'equipment.swords.scimitar']:
            tile_size = 128
            row = 2

        if 'horse' in item['id']:
            tile_size = 128
            row = 1

        if 'horse.body' in item['id']:
            path = path.replace('fg', 'bg')

        return extract_tile(path, tile_size, row, col, color1, color2, color3, color4)


def get_color_mask(color):
    if not color:
        return None

    if color == 'anatomy.body' or color == 'anatomy.head':
        color = 'ivory'

    color = color.capitalize()

    with open('./Ramps.json', 'r') as file:
        json_data = json.load(file)

    mask = None


    if 'Eyes' in color:
        mask = json_data['Eyes'][color.replace('Eyes_', '').capitalize()]
    else:
        if color in json_data['Skin']:
            mask = json_data['Skin'][color]
        elif color in json_data['Clothing']:
            mask = json_data['Clothing'][color]
        elif color in json_data['Metal']:
            mask = json_data['Metal'][color]

    if not mask:
        print(f'Color not found ({color})')
        return None

    color_mask = []

    for color_entry in mask:
        r = round(color_entry['r'] * 255)
        g = round(color_entry['g'] * 255)
        b = round(color_entry['b'] * 255)
        color_mask.append('#%02x%02x%02x' % (r, g, b))

    return color_mask

def colorize(original_image, color1, color2=None, color3=None, color4=None):

    color_mask = [
        get_color_mask(color1),
        get_color_mask(color2),
        get_color_mask(color3),
        get_color_mask(color4)
    ]

    width, height = original_image.size


    for x in range(width):

        for y in range(height):
            current_color = original_image.getpixel((x, y))

            if current_color[3] == 0:
                original_image.putpixel((x, y), (0, 0, 0, 0))
                continue

            hex_color = '#%02x%02x%02x' % current_color[:3]


            for i in range(4):
                original_colors = [
                    f'#ff0{i}00',
                    f'#ff0{i}01',
                    f'#ff0{i}02',
                    f'#ff0{i}03',
                    f'#ff0{i}04',
                    f'#ff0{i}05'
                ]
                index = original_colors.index(hex_color) if hex_color in original_colors else -1

                if index != -1:

                    new_colors = color_mask[i]
                    new_hex_color = new_colors[index]
                    r, g, b = tuple(int(new_hex_color[i:i + 2], 16) for i in (1, 3, 5))
                    original_image.putpixel((x, y), (r, g, b, current_color[3]))


    return original_image

def find_object_bounds(image):
    image_data = image.getdata()
    image_width, image_height = image.size
    min_x = image_width
    max_x = 0
    min_y = image_height
    max_y = 0

    for y in range(image_height):
        for x in range(image_width):
            alpha = image_data[y * image_width + x][3]
            if alpha != 0:
                min_x = min(min_x, x)
                max_x = max(max_x, x)
                min_y = min(min_y, y)
                max_y = max(max_y, y)

    return min_x, min_y, max_x, max_y

def center_object(image):
    image_width, image_height = image.size
    min_x, min_y, max_x, max_y = find_object_bounds(image)
    object_width = max_x - min_x + 1
    object_height = max_y - min_y + 1
    new_x = (image_width - object_width) // 2 - min_x
    new_y = (image_height - object_height) // 2 - min_y
    new_image = Image.new("RGBA", (image_width, image_height), (0, 0, 0, 0))
    new_image.paste(image, (new_x, new_y), image)

    return new_image

def extract_tile(spritesheet_path, tile_size, row, column, color1, color2, color3, color4):
    spritesheet = Image.open(spritesheet_path)
    left = column * tile_size
    top = row * tile_size
    right = left + tile_size
    bottom = top + tile_size
    tile = spritesheet.crop((left, top, right, bottom))
    tile = colorize(tile, color1, color2, color3, color4)
    tile = center_object(tile)
    image_io = BytesIO()
    tile.save(image_io, format='PNG')
    image_io.seek(0)
    base64_image = base64.b64encode(image_io.read()).decode('utf-8')
    data_url = f'data:image/png;base64,{base64_image}'

    return data_url

def merge_data(folder_path, result_dict, full):
    for filename in os.listdir(folder_path):
        filepath = os.path.join(folder_path, filename)

        if os.path.isdir(filepath):
            merge_data(filepath, result_dict, full)
        elif filename == "data.json":
            with open(filepath, 'r') as json_file:
                try:
                    data = json.load(json_file)
                    id_parts = data["id"].split(".")
                    current_dict = result_dict
                    for part in id_parts[:-1]:
                        current_dict = current_dict.setdefault(part, {})
                    if full is True:
                        data['preview'] = get_preview_image(data, input_path)
                        data['name'] = data['name'].replace('_', ' ').title()
                        current_dict[id_parts[-1]] = data
                    else:
                        current_dict[id_parts[-1]] = {
                            "id": data.get("id"),
                            "notes": data.get("notes"),
                            "authors": data.get("authors"),
                            "licenses": data.get("licenses"),
                            "urls": data.get("urls")
                        }
                except Exception as error:
                    print(filepath)
                    print(error)


result_dict = {}
merge_data(input_path, result_dict, full=True)

with open(output_path, 'w') as result_file:
    json.dump(result_dict, result_file, indent=2)