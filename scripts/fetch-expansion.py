"""
Fetch images for the product expansion (Bapesta, Jordan 6/7/13/14,
Off-White, LV, D&G, Bottega, Prada, Lanvin, Balenciaga additions).
"""
import os
import sys
import time
import random
import re
import requests
from io import BytesIO
from PIL import Image

os.environ["ONNXRUNTIME_EXECUTION_PROVIDERS"] = '["CPUExecutionProvider"]'
from rembg import remove, new_session

SESSION = new_session("u2net", providers=["CPUExecutionProvider"])

OUT_DIR = "/Users/newuser/zoar/public/images/products"

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
}

PRODUCTS = [
    # ── BAPESTA ADDITIONAL (15) ──
    ("A Bathing Ape BAPESTA purple camo STA sneaker", "bapesta_purple_camo.png"),
    ("A Bathing Ape BAPESTA red camo STA sneaker", "bapesta_red_camo.png"),
    ("A Bathing Ape BAPESTA blue camo STA sneaker", "bapesta_blue_camo.png"),
    ("A Bathing Ape BAPESTA gold metallic STA sneaker", "bapesta_gold.png"),
    ("A Bathing Ape BAPESTA silver chrome STA sneaker", "bapesta_silver.png"),
    ("A Bathing Ape BAPESTA orange patent STA sneaker", "bapesta_orange.png"),
    ("A Bathing Ape BAPESTA neon green STA sneaker", "bapesta_neon_green.png"),
    ("A Bathing Ape BAPESTA pastel pink STA sneaker", "bapesta_pastel_pink.png"),
    ("A Bathing Ape BAPESTA navy blue white STA sneaker", "bapesta_navy.png"),
    ("A Bathing Ape BAPESTA burgundy white STA sneaker", "bapesta_burgundy.png"),
    ("A Bathing Ape BAPESTA brown cream STA sneaker", "bapesta_brown.png"),
    ("A Bathing Ape BAPESTA white purple STA sneaker", "bapesta_white_purple.png"),
    ("A Bathing Ape BAPESTA yellow white STA sneaker", "bapesta_yellow.png"),
    ("A Bathing Ape BAPESTA white red camo STA sneaker", "bapesta_white_red_camo.png"),
    ("A Bathing Ape BAPESTA mid black gold STA sneaker", "bapesta_mid_black_gold.png"),

    # ── JORDAN 6 (5) ──
    ("Air Jordan 6 Retro Infrared White sneaker", "jordan_6_infrared.png"),
    ("Air Jordan 6 Retro Black Infrared sneaker", "jordan_6_black_infrared.png"),
    ("Air Jordan 6 Retro Carmine sneaker", "jordan_6_carmine.png"),
    ("Air Jordan 6 Retro UNC University Blue sneaker", "jordan_6_unc.png"),
    ("Travis Scott Air Jordan 6 British Khaki sneaker", "jordan_6_ts_khaki.png"),

    # ── JORDAN 7 (5) ──
    ("Air Jordan 7 Retro Bordeaux sneaker", "jordan_7_bordeaux.png"),
    ("Air Jordan 7 Retro Olympic sneaker", "jordan_7_olympic.png"),
    ("Air Jordan 7 Retro Citrus sneaker", "jordan_7_citrus.png"),
    ("Air Jordan 7 Retro Hare sneaker", "jordan_7_hare.png"),
    ("Air Jordan 7 Retro Raptors sneaker", "jordan_7_raptors.png"),

    # ── JORDAN 13 (5) ──
    ("Air Jordan 13 Retro Bred sneaker", "jordan_13_bred.png"),
    ("Air Jordan 13 Retro He Got Game sneaker", "jordan_13_he_got_game.png"),
    ("Air Jordan 13 Retro Flint sneaker", "jordan_13_flint.png"),
    ("Air Jordan 13 Retro Court Purple sneaker", "jordan_13_court_purple.png"),
    ("Air Jordan 13 Retro Chicago sneaker", "jordan_13_chicago.png"),

    # ── JORDAN 14 (4) ──
    ("Air Jordan 14 Retro Last Shot sneaker", "jordan_14_last_shot.png"),
    ("Air Jordan 14 Retro Black Toe sneaker", "jordan_14_black_toe.png"),
    ("Air Jordan 14 Retro Ginger sneaker", "jordan_14_ginger.png"),
    ("Air Jordan 14 Retro Ferrari Challenge Red sneaker", "jordan_14_ferrari.png"),

    # ── OFF-WHITE AIR FORCE 1 (4) ──
    ("Off-White Nike Air Force 1 Low The Ten White sneaker", "ow_af1_white.png"),
    ("Off-White Nike Air Force 1 MCA University Blue sneaker", "ow_af1_mca.png"),
    ("Off-White Nike Air Force 1 Mid graffiti black sneaker", "ow_af1_mid_graffiti.png"),
    ("Off-White Nike Air Force 1 Low black sneaker", "ow_af1_black.png"),

    # ── LOUIS VUITTON AIR FORCE 1 (4) ──
    ("Louis Vuitton Nike Air Force 1 Low white green sneaker", "lv_af1_white_green.png"),
    ("Louis Vuitton Nike Air Force 1 Low white blue sneaker", "lv_af1_white_blue.png"),
    ("Louis Vuitton Nike Air Force 1 Mid white red sneaker", "lv_af1_mid_red.png"),
    ("Louis Vuitton Nike Air Force 1 gold metallic sneaker", "lv_af1_gold.png"),

    # ── LOUIS VUITTON (6) ──
    ("Louis Vuitton LV Trainer sneaker white blue", "lv_trainer_blue.png"),
    ("Louis Vuitton LV Trainer sneaker white green denim", "lv_trainer_green.png"),
    ("Louis Vuitton LV Skate sneaker black", "lv_skate_black.png"),
    ("Louis Vuitton Archlight sneaker silver", "lv_archlight.png"),
    ("Louis Vuitton Run Away sneaker monogram", "lv_run_away.png"),
    ("Louis Vuitton Ollie sneaker damier ebene", "lv_ollie.png"),

    # ── DOLCE & GABBANA (5) ──
    ("Dolce Gabbana Daymaster sneaker white gold", "dg_daymaster_white.png"),
    ("Dolce Gabbana Portofino sneaker white leather", "dg_portofino_white.png"),
    ("Dolce Gabbana NS1 sneaker black", "dg_ns1_black.png"),
    ("Dolce Gabbana Sorrento sneaker black stretch knit", "dg_sorrento.png"),
    ("Dolce Gabbana Super King sneaker white black", "dg_super_king.png"),

    # ── BOTTEGA VENETA ADDITIONAL (5) ──
    ("Bottega Veneta Lug boot black leather chelsea", "bottega_lug_boot.png"),
    ("Bottega Veneta Tire boot black chelsea", "bottega_tire_boot.png"),
    ("Bottega Veneta Puddle boot green rubber", "bottega_puddle_green.png"),
    ("Bottega Veneta Flash mule white", "bottega_flash.png"),
    ("Bottega Veneta Orbit sneaker black", "bottega_orbit.png"),

    # ── PRADA ADDITIONAL (5) ──
    ("Prada Cloudbust Thunder sneaker black", "prada_cloudbust.png"),
    ("Prada Americas Cup sneaker white patent mesh", "prada_americas_cup.png"),
    ("Prada Monolith boot black brushed leather lug sole", "prada_monolith_boot.png"),
    ("Prada Adidas Forum Low sneaker white", "prada_forum.png"),
    ("Prada Luna Rossa sneaker silver", "prada_luna_rossa.png"),

    # ── LANVIN (10) ──
    ("Lanvin Curb sneaker white leather", "lanvin_curb_white.png"),
    ("Lanvin Curb sneaker black leather", "lanvin_curb_black.png"),
    ("Lanvin Curb sneaker pink white", "lanvin_curb_pink.png"),
    ("Lanvin Curb sneaker green grey", "lanvin_curb_green.png"),
    ("Lanvin Curb sneaker light blue", "lanvin_curb_blue.png"),
    ("Lanvin Curb sneaker beige brown", "lanvin_curb_beige.png"),
    ("Lanvin Curb sneaker red white", "lanvin_curb_red.png"),
    ("Lanvin Clay Low sneaker white grey", "lanvin_clay_white.png"),
    ("Lanvin Bumpr sneaker white blue", "lanvin_bumpr.png"),
    ("Lanvin Flash-X Bold sneaker black white", "lanvin_flash_x.png"),

    # ── BALENCIAGA ADDITIONAL (8) ──
    ("Balenciaga Track 2 sneaker white orange", "balenciaga_track2_white_orange.png"),
    ("Balenciaga Track 2 sneaker black red", "balenciaga_track2_black_red.png"),
    ("Balenciaga Track 2 sneaker grey green", "balenciaga_track2_grey_green.png"),
    ("Balenciaga Speed Trainer black sock sneaker", "balenciaga_speed_black.png"),
    ("Balenciaga Speed 2.0 white sock sneaker", "balenciaga_speed_white.png"),
    ("Balenciaga Speed Trainer red sock sneaker", "balenciaga_speed_red.png"),
    ("Balenciaga Track sneaker all black", "balenciaga_track_all_black.png"),
    ("Balenciaga Track sneaker all white", "balenciaga_track_all_white.png"),
]


def bing_image_search(query, count=8):
    """Search Bing Images and return image URLs."""
    url = "https://www.bing.com/images/search"
    params = {"q": query, "form": "HDRSC2", "first": 1}
    try:
        resp = requests.get(url, params=params, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return []
        urls = re.findall(r'murl&quot;:&quot;(https?://[^&]+?)&quot;', resp.text)
        return urls[:count]
    except Exception as e:
        print(f"    Search error: {e}", flush=True)
        return []


def download_and_process(query, filename):
    """Search Bing, download image, remove background."""
    out_path = os.path.join(OUT_DIR, filename)
    if os.path.exists(out_path):
        print(f"  SKIP (exists): {filename}", flush=True)
        return True

    urls = bing_image_search(query)
    if not urls:
        print(f"  NO RESULTS: {query}", flush=True)
        return False

    for url in urls:
        try:
            resp = requests.get(url, headers=HEADERS, timeout=15)
            if resp.status_code == 200 and len(resp.content) > 5000:
                img = Image.open(BytesIO(resp.content)).convert("RGB")
                if img.size[0] >= 200 and img.size[1] >= 200:
                    result = remove(img, session=SESSION)
                    result.save(out_path)
                    print(f"  OK {filename} ({result.size[0]}x{result.size[1]})", flush=True)
                    return True
        except Exception:
            continue

    print(f"  FAIL: {query}", flush=True)
    return False


if __name__ == "__main__":
    print(f"Fetching {len(PRODUCTS)} product images via Bing...\n", flush=True)

    success = 0
    failed = []

    for i, (query, filename) in enumerate(PRODUCTS):
        print(f"[{i+1}/{len(PRODUCTS)}] {filename}", flush=True)
        if download_and_process(query, filename):
            success += 1
        else:
            failed.append((query, filename))

        time.sleep(random.uniform(5, 10))

    print(f"\n{'='*50}", flush=True)
    print(f"Done: {success}/{len(PRODUCTS)}", flush=True)
    if failed:
        print(f"Failed: {len(failed)}", flush=True)
        for q, f in failed:
            print(f"   - {f}: {q}", flush=True)
