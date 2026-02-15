"""
Fetch missing product images via Bing image search.
Downloads, removes background, saves as transparent PNG.
"""
import os
import sys
import time
import random
import requests
from io import BytesIO
from PIL import Image

os.environ["ONNXRUNTIME_EXECUTION_PROVIDERS"] = '["CPUExecutionProvider"]'
from rembg import remove, new_session

SESSION = new_session("u2net", providers=["CPUExecutionProvider"])

OUT_DIR = "/Users/newuser/zoar/public/images/products"

# (search_query, output_filename)
PRODUCTS = [
    # Jordans remaining
    ("Air Jordan 4 Military Black sneaker", "jordan_4_military_black.png"),
    ("Air Jordan 4 University Blue sneaker", "jordan_4_university_blue.png"),
    ("Air Jordan 5 Fire Red sneaker", "jordan_5_fire_red.png"),
    ("Air Jordan 5 Metallic Silver sneaker", "jordan_5_metallic.png"),
    ("Air Jordan 5 Grape sneaker", "jordan_5_grape.png"),
    ("Air Jordan 8 Aqua sneaker", "jordan_8_aqua.png"),
    ("Air Jordan 8 Playoff sneaker", "jordan_8_playoff.png"),
    ("Air Jordan 9 Bred sneaker", "jordan_9_bred.png"),
    ("Air Jordan 9 University Blue sneaker", "jordan_9_unc.png"),
    ("Air Jordan 10 Shadow sneaker", "jordan_10_shadow.png"),
    ("Air Jordan 10 Steel sneaker", "jordan_10_steel.png"),
    ("Air Jordan 11 Concord sneaker", "jordan_11_concord.png"),
    ("Air Jordan 11 Bred sneaker", "jordan_11_bred.png"),
    ("Air Jordan 11 Space Jam sneaker", "jordan_11_space_jam.png"),
    ("Air Jordan 11 Cool Grey sneaker", "jordan_11_cool_grey.png"),
    ("Air Jordan 12 Flu Game sneaker", "jordan_12_flu_game.png"),
    ("Air Jordan 12 Playoff sneaker", "jordan_12_playoff.png"),
    ("Air Jordan 12 Royalty sneaker", "jordan_12_royalty.png"),
    ("Travis Scott Jordan 1 Low Mocha sneaker", "jordan_ts_1_low_mocha.png"),
    ("Travis Scott Jordan 1 High sneaker", "jordan_ts_1_high.png"),
    ("Travis Scott Jordan 4 Purple sneaker", "jordan_ts_4_purple.png"),
    ("Travis Scott Jordan 1 Low Reverse Mocha", "jordan_ts_1_reverse_mocha.png"),

    # Bapesta remaining
    ("Bape Bapesta Green Camo sneaker", "bapesta_green_camo.png"),
    ("Bape Bapesta Blue White sneaker", "bapesta_blue_white.png"),
    ("Bape Bapesta Pink Patent sneaker", "bapesta_pink_patent.png"),
    ("Bape Bapesta Grey Suede sneaker", "bapesta_grey_suede.png"),
    ("Bape Bapesta Triple Black sneaker", "bapesta_triple_black.png"),

    # Nike SB Dunks
    ("Nike SB Dunk Low Tiffany Diamond Supply sneaker", "sb_tiffany.png"),
    ("Nike SB Dunk Low Pigeon Staple sneaker", "sb_pigeon.png"),
    ("Nike SB Dunk Low Paris sneaker", "sb_paris.png"),
    ("Nike SB Dunk Low Heineken sneaker", "sb_heineken.png"),
    ("Nike SB Dunk Low Freddy Krueger sneaker", "sb_freddy_krueger.png"),
    ("Nike SB Dunk Low Panda Pigeon Staple sneaker", "sb_panda_pigeon.png"),
    ("Nike SB Dunk Low Supreme Red Cement sneaker", "sb_supreme_red.png"),
    ("Nike SB Dunk Low Travis Scott sneaker", "sb_travis_scott.png"),
    ("Nike SB Dunk Low What The Dunk sneaker", "sb_what_the_dunk.png"),
    ("Nike SB Dunk Low Stussy Cherry sneaker", "sb_stussy_cherry.png"),
    ("Nike SB Dunk Low Purple Lobster Concepts sneaker", "sb_purple_lobster.png"),
    ("Nike SB Dunk Low Green Lobster Concepts sneaker", "sb_green_lobster.png"),
    ("Nike SB Dunk High De La Soul sneaker", "sb_de_la_soul.png"),
    ("Nike SB Dunk Low Grateful Dead Green Bear", "sb_grateful_dead.png"),
    ("Nike SB Dunk Low Raygun Tie Dye sneaker", "sb_raygun.png"),

    # Maison Margiela
    ("Maison Margiela Replica white leather sneaker", "margiela_replica_white.png"),
    ("Maison Margiela Replica paint splatter sneaker", "margiela_replica_paint.png"),
    ("Maison Margiela Tabi boot black", "margiela_tabi_black.png"),
    ("Maison Margiela Tabi boot white", "margiela_tabi_white.png"),
    ("Maison Margiela Replica GAT sneaker", "margiela_gat.png"),
    ("Maison Margiela Fusion sneaker", "margiela_fusion.png"),
    ("Maison Margiela Replica grey sneaker", "margiela_replica_grey.png"),
    ("Maison Margiela Evolution sneaker", "margiela_evolution.png"),

    # Marni
    ("Marni Pablo sneaker", "marni_pablo.png"),
    ("Marni Pablo Mary Jane sneaker", "marni_pablo_mj.png"),
    ("Marni Dada Bumper black white sneaker", "marni_dada_bw.png"),
    ("Marni Dada Bumper green sneaker", "marni_dada_green.png"),
    ("Marni platform sneaker black", "marni_platform.png"),
    ("Marni Big Foot 2.0 sneaker", "marni_bigfoot.png"),

    # Misc
    ("Gucci Horsebit sandal", "gucci_horsebit.png"),
    ("Maison Mihara Yasuhiro dissolved sole sneaker", "mihara_dissolved.png"),
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36"
}


def bing_image_search(query, count=8):
    """Search Bing Images and return image URLs."""
    url = "https://www.bing.com/images/search"
    params = {
        "q": query,
        "form": "HDRSC2",
        "first": 1,
    }
    try:
        resp = requests.get(url, params=params, headers=HEADERS, timeout=15)
        if resp.status_code != 200:
            return []

        # Extract image URLs from murl parameter in the HTML
        import re
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
            failed.append(filename)

        time.sleep(random.uniform(5, 10))

    print(f"\n{'='*50}", flush=True)
    print(f"Done: {success}/{len(PRODUCTS)}", flush=True)
    if failed:
        print(f"Failed: {len(failed)}", flush=True)
        for f in failed:
            print(f"   - {f}", flush=True)
