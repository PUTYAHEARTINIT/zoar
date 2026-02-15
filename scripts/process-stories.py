"""
Crop shoe photos from ZÖAR IG story frames and remove backgrounds.
Maps each processed image to a product in the seed.
"""
import os
os.environ["ONNXRUNTIME_EXECUTION_PROVIDERS"] = "[\"CPUExecutionProvider\"]"
from PIL import Image
from rembg import remove, new_session

# Create session with CPU only to avoid CoreML issues
SESSION = new_session("u2net", providers=["CPUExecutionProvider"])

STORIES_DIR = "/Users/newuser/zoar/public/images/products/stories"
OUT_DIR = "/Users/newuser/zoar/public/images/products"

# Story → product mapping: (story_file, output_name, description)
PRODUCT_STORIES = [
    # Bapesta
    ("story_08.png", "bapesta_red_white.png", "Bapesta Red/White"),
    ("story_09.png", "bapesta_all_white.png", "Bapesta All White"),
    ("story_13.png", "bapesta_black_white.png", "Bapesta Black/White Patent"),

    # Balenciaga
    ("story_10.png", "balenciaga_track_yellow.png", "Balenciaga Track Yellow/Green"),
    ("story_24.png", "balenciaga_track_blue.png", "Balenciaga Track Blue/White/Red"),
    ("story_28.png", "balenciaga_runner_black_pink.png", "Balenciaga Runner Black/Pink"),
    ("story_30.png", "balenciaga_track_grey_yellow.png", "Balenciaga Track Grey/Yellow"),
    ("story_31.png", "balenciaga_runner_white_red.png", "Balenciaga Runner White/Grey/Red"),
    ("story_29.png", "balenciaga_3xl_white.png", "Balenciaga 3XL White/Grey"),
    ("story_32.png", "balenciaga_runner_grey_neon.png", "Balenciaga Runner Grey/Neon"),
    ("story_19.png", "balenciaga_bulldozer_boot.png", "Balenciaga Bulldozer Boot"),
    ("story_35.png", "balenciaga_bulldozer_derby.png", "Balenciaga Bulldozer Derby"),

    # Bottega Veneta
    ("story_26.png", "bottega_puddle_boot_black.png", "Bottega Puddle Boot Black"),
    ("story_18.png", "bottega_puddle_boot_white.png", "Bottega Puddle Boot White"),

    # Gucci
    ("story_12.png", "gucci_gg_slide.png", "Gucci GG Monogram Slide"),

    # Prada
    ("story_14.png", "prada_chocolate_loafer.png", "Prada Chocolate Loafer"),

    # Alexander McQueen (bonus — can add to seed)
    ("story_21.png", "mcqueen_tread_slick.png", "Alexander McQueen Tread Slick"),

    # Additional Balenciaga angles
    ("story_36.png", "balenciaga_bulldozer_derby_2.png", "Balenciaga Bulldozer Derby angle 2"),
    ("story_20.png", "balenciaga_bulldozer_chain.png", "Balenciaga Bulldozer Boot Chain"),
    ("story_22.png", "balenciaga_bulldozer_clog.png", "Balenciaga Bulldozer Clog"),

    # Bottega Veneta additional
    ("story_16.png", "bottega_puddle_ankle_bw.png", "Bottega Puddle Ankle B/W"),
    ("story_17.png", "bottega_puddle_ankle_white.png", "Bottega Puddle Ankle White"),

    # Rick Owens additional from stories
    ("story_37.png", "rick_owens_platform_bw.png", "Rick Owens Platform B/W"),

    # Misc/Other brand shoes
    ("story_25.png", "misc_runner_silver.png", "Runner Silver/Grey"),
    ("story_33.png", "misc_sneaker_brown.png", "Sneaker Brown/White"),
    ("story_23.png", "misc_low_navy.png", "Low Navy/Black"),
    ("story_34.png", "misc_sneaker_black.png", "Sneaker Black"),
    ("story_11.png", "misc_woven_slide.png", "Woven Slide"),
]

def crop_shoe_from_story(img):
    """Crop the center photo region from a ZÖAR story frame."""
    w, h = img.size

    # The story layout has:
    # - "AVAILABLE NOW" text at top ~12-18% of height
    # - Photo frame in center ~18-68% of height
    # - "DM FOR SIZING..." text ~68-80%
    # - "ZÖAR" logo at bottom ~80-100%
    # Adjust crop to grab the photo with some margin
    left = int(w * 0.08)
    right = int(w * 0.92)
    top = int(h * 0.14)
    bottom = int(h * 0.68)

    return img.crop((left, top, right, bottom))


def process_story(story_file, output_name, desc):
    """Crop shoe from story frame and remove background."""
    story_path = os.path.join(STORIES_DIR, story_file)
    out_path = os.path.join(OUT_DIR, output_name)

    if not os.path.exists(story_path):
        print(f"  SKIP (not found): {story_file}")
        return False

    print(f"  {story_file} → {output_name} ({desc})")

    # Open and crop
    img = Image.open(story_path).convert("RGB")
    cropped = crop_shoe_from_story(img)

    # Remove background
    result = remove(cropped, session=SESSION)
    result.save(out_path)
    print(f"    ✓ saved ({result.size[0]}x{result.size[1]})")
    return True


if __name__ == "__main__":
    print(f"Processing {len(PRODUCT_STORIES)} story images...")
    print(f"Output: {OUT_DIR}\n")

    success = 0
    for story_file, output_name, desc in PRODUCT_STORIES:
        if process_story(story_file, output_name, desc):
            success += 1

    print(f"\n✅ Done! Processed {success}/{len(PRODUCT_STORIES)} images.")
