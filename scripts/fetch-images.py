"""
Fetch product images from the web for all products missing photos.
Downloads, removes background, saves as transparent PNG.
"""
import os
import time
import random
import requests
from io import BytesIO
from PIL import Image
from rembg import remove, new_session

os.environ["ONNXRUNTIME_EXECUTION_PROVIDERS"] = '["CPUExecutionProvider"]'
SESSION = new_session("u2net", providers=["CPUExecutionProvider"])

OUT_DIR = "/Users/newuser/zoar/public/images/products"

# Product search queries → output filename
# Format: (search_query, output_filename)
PRODUCTS = [
    # ── JORDANS (33) ──
    ("Air Jordan 1 Retro High OG Chicago product shot white background", "jordan_1_chicago.png"),
    ("Air Jordan 1 Retro High OG Bred product shot", "jordan_1_bred.png"),
    ("Air Jordan 1 Retro High OG Royal Blue product shot", "jordan_1_royal.png"),
    ("Air Jordan 1 Retro High OG Shadow 2.0 product shot", "jordan_1_shadow.png"),
    ("Air Jordan 1 Retro High OG UNC product shot", "jordan_1_unc.png"),
    ("Air Jordan 1 Retro High OG Pine Green product shot", "jordan_1_pine_green.png"),
    ("Air Jordan 3 Retro White Cement product shot", "jordan_3_white_cement.png"),
    ("Air Jordan 3 Retro Black Cement product shot", "jordan_3_black_cement.png"),
    ("Air Jordan 3 Retro Fire Red product shot", "jordan_3_fire_red.png"),
    ("Air Jordan 4 Retro Bred product shot", "jordan_4_bred.png"),
    ("Air Jordan 4 Military Black product shot", "jordan_4_military_black.png"),
    ("Air Jordan 4 Retro Thunder product shot", "jordan_4_thunder.png"),
    ("Air Jordan 4 University Blue product shot", "jordan_4_university_blue.png"),
    ("Air Jordan 5 Retro Fire Red product shot", "jordan_5_fire_red.png"),
    ("Air Jordan 5 Retro Metallic Silver product shot", "jordan_5_metallic.png"),
    ("Air Jordan 5 Retro Grape product shot", "jordan_5_grape.png"),
    ("Air Jordan 8 Retro Aqua product shot", "jordan_8_aqua.png"),
    ("Air Jordan 8 Retro Playoff product shot", "jordan_8_playoff.png"),
    ("Air Jordan 9 Retro Bred product shot", "jordan_9_bred.png"),
    ("Air Jordan 9 University Blue product shot", "jordan_9_unc.png"),
    ("Air Jordan 10 Retro Shadow product shot", "jordan_10_shadow.png"),
    ("Air Jordan 10 Retro Steel product shot", "jordan_10_steel.png"),
    ("Air Jordan 11 Retro Concord product shot", "jordan_11_concord.png"),
    ("Air Jordan 11 Retro Bred product shot", "jordan_11_bred.png"),
    ("Air Jordan 11 Retro Space Jam product shot", "jordan_11_space_jam.png"),
    ("Air Jordan 11 Retro Cool Grey product shot", "jordan_11_cool_grey.png"),
    ("Air Jordan 12 Retro Flu Game product shot", "jordan_12_flu_game.png"),
    ("Air Jordan 12 Retro Playoff product shot", "jordan_12_playoff.png"),
    ("Air Jordan 12 Retro Royalty product shot", "jordan_12_royalty.png"),
    ("Travis Scott Air Jordan 1 Low Mocha product shot", "jordan_ts_1_low_mocha.png"),
    ("Travis Scott Air Jordan 1 High product shot", "jordan_ts_1_high.png"),
    ("Travis Scott Air Jordan 4 Purple product shot", "jordan_ts_4_purple.png"),
    ("Travis Scott Air Jordan 1 Low Reverse Mocha product shot", "jordan_ts_1_reverse_mocha.png"),

    # ── BAPESTA remaining (5) ──
    ("Bape BAPESTA Green Camo sneaker product shot", "bapesta_green_camo.png"),
    ("Bape BAPESTA Blue White sneaker product shot", "bapesta_blue_white.png"),
    ("Bape BAPESTA Pink Patent sneaker product shot", "bapesta_pink_patent.png"),
    ("Bape BAPESTA Grey Suede sneaker product shot", "bapesta_grey_suede.png"),
    ("Bape BAPESTA Triple Black sneaker product shot", "bapesta_triple_black.png"),

    # ── NIKE SB DUNKS (15) ──
    ("Nike SB Dunk Low Tiffany Diamond Supply product shot", "sb_tiffany.png"),
    ("Nike SB Dunk Low Pigeon NYC Staple product shot", "sb_pigeon.png"),
    ("Nike SB Dunk Low Paris product shot", "sb_paris.png"),
    ("Nike SB Dunk Low Heineken product shot", "sb_heineken.png"),
    ("Nike SB Dunk Low Freddy Krueger product shot", "sb_freddy_krueger.png"),
    ("Nike SB Dunk Low Staple Panda Pigeon product shot", "sb_panda_pigeon.png"),
    ("Nike SB Dunk Low Supreme Red Cement product shot", "sb_supreme_red.png"),
    ("Nike SB Dunk Low Travis Scott product shot", "sb_travis_scott.png"),
    ("Nike SB Dunk Low What The Dunk product shot", "sb_what_the_dunk.png"),
    ("Nike SB Dunk Low Stussy Cherry product shot", "sb_stussy_cherry.png"),
    ("Nike SB Dunk Low Purple Lobster Concepts product shot", "sb_purple_lobster.png"),
    ("Nike SB Dunk Low Green Lobster Concepts product shot", "sb_green_lobster.png"),
    ("Nike SB Dunk High De La Soul product shot", "sb_de_la_soul.png"),
    ("Nike SB Dunk Low Grateful Dead Green Bear product shot", "sb_grateful_dead.png"),
    ("Nike SB Dunk Low Raygun Tie Dye product shot", "sb_raygun.png"),

    # ── MAISON MARGIELA (8) ──
    ("Maison Margiela Replica sneaker white leather product shot", "margiela_replica_white.png"),
    ("Maison Margiela Replica paint splatter sneaker product shot", "margiela_replica_paint.png"),
    ("Maison Margiela Tabi boot black product shot", "margiela_tabi_black.png"),
    ("Maison Margiela Tabi boot white product shot", "margiela_tabi_white.png"),
    ("Maison Margiela Replica GAT German Army Trainer product shot", "margiela_gat.png"),
    ("Maison Margiela Fusion sneaker product shot", "margiela_fusion.png"),
    ("Maison Margiela Replica vintage sneaker grey product shot", "margiela_replica_grey.png"),
    ("Maison Margiela Evolution sneaker product shot", "margiela_evolution.png"),

    # ── MARNI (6) ──
    ("Marni Pablo sneaker product shot", "marni_pablo.png"),
    ("Marni Pablo Mary Jane product shot", "marni_pablo_mj.png"),
    ("Marni Dada Bumper sneaker black white product shot", "marni_dada_bw.png"),
    ("Marni Dada Bumper sneaker green brown product shot", "marni_dada_green.png"),
    ("Marni platform sneaker black chunky product shot", "marni_platform.png"),
    ("Marni Big Foot 2.0 sneaker product shot", "marni_bigfoot.png"),

    # ── REMAINING OTHER ──
    ("Gucci GG Horsebit sandal product shot", "gucci_horsebit.png"),
    ("Maison Mihara Yasuhiro dissolved sole sneaker product shot", "mihara_dissolved.png"),
]

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"
}


def search_and_download(query, filename):
    """Search DuckDuckGo for image and download first result."""
    out_path = os.path.join(OUT_DIR, filename)
    if os.path.exists(out_path):
        print(f"  SKIP (exists): {filename}")
        return True

    try:
        from duckduckgo_search import DDGS
        with DDGS() as ddgs:
            results = list(ddgs.images(query, max_results=5))

        if not results:
            print(f"  NO RESULTS: {query}")
            return False

        # Try each result until one downloads successfully
        for r in results:
            try:
                url = r["image"]
                resp = requests.get(url, headers=HEADERS, timeout=15)
                if resp.status_code == 200 and len(resp.content) > 5000:
                    img = Image.open(BytesIO(resp.content)).convert("RGB")
                    # Only use if reasonable size
                    if img.size[0] >= 200 and img.size[1] >= 200:
                        # Remove background
                        result = remove(img, session=SESSION)
                        result.save(out_path)
                        print(f"  ✓ {filename} ({result.size[0]}x{result.size[1]})")
                        return True
            except Exception:
                continue

        print(f"  FAILED (no valid image): {query}")
        return False

    except Exception as e:
        print(f"  ERROR: {e}")
        return False


if __name__ == "__main__":
    print(f"Fetching {len(PRODUCTS)} product images...\n")

    success = 0
    failed = []

    for i, (query, filename) in enumerate(PRODUCTS):
        print(f"[{i+1}/{len(PRODUCTS)}] {filename}")
        if search_and_download(query, filename):
            success += 1
        else:
            failed.append(filename)

        # Rate limit to avoid getting blocked
        time.sleep(random.uniform(10, 15))

    print(f"\n{'='*50}")
    print(f"✅ Success: {success}/{len(PRODUCTS)}")
    if failed:
        print(f"❌ Failed: {len(failed)}")
        for f in failed:
            print(f"   - {f}")
