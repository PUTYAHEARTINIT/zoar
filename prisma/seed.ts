import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding ZÖAR database...");

  // Clean existing data
  await prisma.isoResponse.deleteMany();
  await prisma.isoPost.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.membershipApplication.deleteMany();
  await prisma.user.deleteMany();

  // Create admin user
  const adminPassword = await bcrypt.hash("zoar2026", 10);
  const admin = await prisma.user.create({
    data: {
      email: "admin@zoar.app",
      password: adminPassword,
      name: "ZÖAR Admin",
      handle: "ZOAR_ADMIN",
      role: "ADMIN",
      membershipTier: "ELITE_CURATOR",
      membershipStatus: "ACTIVE",
      memberNumber: "Z-00001",
      memberSince: new Date("2025-01-01"),
      referralCode: "ZOAR-GENESIS",
    },
  });

  // Create demo member
  const memberPassword = await bcrypt.hash("member2026", 10);
  const member = await prisma.user.create({
    data: {
      email: "member@zoar.app",
      password: memberPassword,
      name: "Demo Collector",
      handle: "VAULT_KEEPER",
      role: "MEMBER",
      membershipTier: "VERIFIED_COLLECTOR",
      membershipStatus: "ACTIVE",
      memberNumber: "Z-00002",
      memberSince: new Date("2025-06-01"),
      lastPurchaseAt: new Date("2026-01-15"),
      referralCode: "ZOAR-VK1292",
    },
  });

  // Additional member sellers for variety
  const sellers = await Promise.all([
    prisma.user.create({
      data: {
        email: "elite@zoar.app",
        password: adminPassword,
        name: "Elite Curator",
        handle: "ELITE_ARC",
        role: "MEMBER",
        membershipTier: "ELITE_CURATOR",
        membershipStatus: "ACTIVE",
        memberNumber: "Z-00003",
        memberSince: new Date("2025-03-01"),
        lastPurchaseAt: new Date("2026-02-01"),
        referralCode: "ZOAR-ELITE3",
      },
    }),
    prisma.user.create({
      data: {
        email: "verified@zoar.app",
        password: adminPassword,
        name: "Verified Collector",
        handle: "VRFD_CLCT",
        role: "MEMBER",
        membershipTier: "VERIFIED_COLLECTOR",
        membershipStatus: "ACTIVE",
        memberNumber: "Z-00004",
        memberSince: new Date("2025-05-01"),
        lastPurchaseAt: new Date("2026-01-20"),
        referralCode: "ZOAR-VRFD4",
      },
    }),
    prisma.user.create({
      data: {
        email: "seller@zoar.app",
        password: adminPassword,
        name: "Member Seller",
        handle: "MBR_SLR",
        role: "MEMBER",
        membershipTier: "MEMBER_SELLER",
        membershipStatus: "ACTIVE",
        memberNumber: "Z-00005",
        memberSince: new Date("2025-07-01"),
        lastPurchaseAt: new Date("2025-12-10"),
        referralCode: "ZOAR-MBR5",
      },
    }),
  ]);

  const [elite, verified, sellerUser] = sellers;

  // Helper to pick seller
  const S = {
    elite: elite.id,
    verified: verified.id,
    member: sellerUser.id,
    admin: admin.id,
  };

  // ═══════════════════════════════════════
  // PRODUCTS
  // ═══════════════════════════════════════

  const products = [
    // ── RICK OWENS (12) ──
    { name: "Rick Owens Platform High", subtitle: "White Leather", category: "Rick Owens", size: "42", price: 185000, images: ["/images/products/platform_hi_rick_white_nobg.png"], sellerId: S.elite, exclusive: true, color: "#f0f0f0" },
    { name: "Rick Owens Vintage Sneaks Low", subtitle: "Brown Suede", category: "Rick Owens", size: "43", price: 120000, images: ["/images/products/van_brown_low_rick_nobg.png"], sellerId: S.verified, color: "#8B6914" },
    { name: "Rick Owens DRKSHDW Ramones High", subtitle: "Orange Canvas", category: "Rick Owens", size: "42", price: 98000, images: ["/images/products/orange_rick_hi_nobg.png"], sellerId: S.elite, color: "#f59e42" },
    { name: "Rick Owens Ramones High", subtitle: "Snakeskin Lime", category: "Rick Owens", size: "43", price: 280000, images: ["/images/products/snakeskin_lime_rick_nobg.png"], sellerId: S.elite, exclusive: true, color: "#a3d55d" },
    { name: "Rick Owens Vintage Sneaks Low", subtitle: "Red Calf Hair", category: "Rick Owens", size: "42", price: 165000, images: ["/images/products/red_low_rick_furry_van_nobg.png"], sellerId: S.verified, exclusive: true, color: "#cc2233" },
    { name: "Rick Owens Ramones Low Studded", subtitle: "Black Denim", category: "Rick Owens", size: "41", price: 110000, images: ["/images/products/ramone_stud_rick_lo_nobg.png"], sellerId: S.member, color: "#1a1a1a" },
    { name: "Rick Owens Geobasket High", subtitle: "White Leather Gum", category: "Rick Owens", size: "43", price: 175000, images: ["/images/products/platform_white_hi_rick_gum_bottom_nobg.png"], sellerId: S.elite, color: "#f0f0f0" },
    { name: "Rick Owens Ramones Low", subtitle: "Dark Brown Calf Hair", category: "Rick Owens", size: "42", price: 140000, images: ["/images/products/brown_furry_ramone_rick_low_nobg.png"], sellerId: S.verified, exclusive: true, color: "#5c3d1e" },
    { name: "Rick Owens Ramones Low", subtitle: "Burgundy Calf Hair", category: "Rick Owens", size: "43", price: 140000, images: ["/images/products/burgandy_fur_ramone_low_rick_nobg.png"], sellerId: S.verified, color: "#722f37" },
    { name: "Rick Owens Megalace Strobe", subtitle: "Black Leather Platform", category: "Rick Owens", size: "42", price: 220000, images: ["/images/products/crazy_string_platform_rick_nobg.png"], sellerId: S.elite, exclusive: true, color: "#111" },
    { name: "Rick Owens Megalace Strobe High", subtitle: "Black Wrapped Lacing", category: "Rick Owens", size: "43", price: 240000, images: ["/images/products/crazy_string_rick_nobg.png"], sellerId: S.elite, exclusive: true, color: "#0d0d0d" },
    { name: "Rick Owens Ramones Low", subtitle: "Grey Calf Hair", category: "Rick Owens", size: "42", price: 135000, images: ["/images/products/grey_low_ramone_furry_rick_nobg.png"], sellerId: S.verified, color: "#8a8a8a" },

    // ── BALENCIAGA (9) ──
    { name: "Balenciaga 3XL", subtitle: "Grey Mesh", category: "Balenciaga", size: "43", price: 125000, images: ["/images/products/balenciaga_3xl_white.png"], sellerId: S.elite, color: "#8a8a8a" },
    { name: "Balenciaga Track", subtitle: "Yellow/Green", category: "Balenciaga", size: "42", price: 115000, images: ["/images/products/balenciaga_track_yellow.png"], sellerId: S.verified, color: "#f59e42" },
    { name: "Balenciaga Track", subtitle: "Blue/White/Red", category: "Balenciaga", size: "44", price: 110000, images: ["/images/products/balenciaga_track_blue.png"], sellerId: S.member, color: "#1a47b8" },
    { name: "Balenciaga Runner", subtitle: "Black/Pink", category: "Balenciaga", size: "42", price: 105000, images: ["/images/products/balenciaga_runner_black_pink.png"], sellerId: S.verified, color: "#d63384" },
    { name: "Balenciaga Track", subtitle: "Grey/Yellow", category: "Balenciaga", size: "43", price: 125000, images: ["/images/products/balenciaga_track_grey_yellow.png"], sellerId: S.elite, color: "#f0d050" },
    { name: "Balenciaga Runner", subtitle: "Grey/Neon", category: "Balenciaga", size: "41", price: 105000, images: ["/images/products/balenciaga_runner_grey_neon.png"], sellerId: S.member, color: "#b8ff00" },
    { name: "Balenciaga Runner", subtitle: "White/Red", category: "Balenciaga", size: "43", price: 105000, images: ["/images/products/balenciaga_runner_white_red.png"], sellerId: S.verified, color: "#cc2233" },
    { name: "Balenciaga Bulldozer Derby", subtitle: "Black Lug Sole", category: "Balenciaga", size: "42", price: 135000, images: ["/images/products/balenciaga_bulldozer_derby.png"], sellerId: S.elite, exclusive: true, color: "#111" },
    { name: "Balenciaga Bulldozer Boot", subtitle: "Black Platform Lug", category: "Balenciaga", size: "43", price: 165000, images: ["/images/products/balenciaga_bulldozer_boot.png"], sellerId: S.elite, exclusive: true, color: "#0d0d0d" },

    // ── BOTTEGA VENETA (2) ──
    { name: "Bottega Veneta Puddle Boot", subtitle: "Black Rubber Tall", category: "Bottega Veneta", size: "42", price: 125000, images: ["/images/products/bottega_puddle_boot_black.png"], sellerId: S.elite, exclusive: true, color: "#0a0a0a" },
    { name: "Bottega Veneta Puddle Ankle", subtitle: "White Rubber", category: "Bottega Veneta", size: "43", price: 110000, images: ["/images/products/bottega_puddle_ankle_white.png"], sellerId: S.verified, color: "#f0f0f0" },

    // ── JORDANS (33) ──
    { name: "Air Jordan 1 Retro High OG", subtitle: "Chicago", category: "Jordan", size: "10", price: 45000, images: ["/images/products/jordan_1_chicago.png"], sellerId: S.verified, color: "#cc2233" },
    { name: "Air Jordan 1 Retro High OG", subtitle: "Bred", category: "Jordan", size: "10.5", price: 38000, images: ["/images/products/jordan_1_bred.png"], sellerId: S.member, color: "#1a1a1a" },
    { name: "Air Jordan 1 Retro High OG", subtitle: "Royal Blue", category: "Jordan", size: "11", price: 35000, images: ["/images/products/jordan_1_royal.png"], sellerId: S.verified, color: "#1a47b8" },
    { name: "Air Jordan 1 Retro High OG", subtitle: "Shadow 2.0", category: "Jordan", size: "9.5", price: 32000, images: ["/images/products/jordan_1_shadow.png"], sellerId: S.member, color: "#555" },
    { name: "Air Jordan 1 Retro High OG", subtitle: "UNC", category: "Jordan", size: "10", price: 40000, images: ["/images/products/jordan_1_unc.png"], sellerId: S.verified, color: "#7bafd4" },
    { name: "Air Jordan 1 Retro High OG", subtitle: "Pine Green", category: "Jordan", size: "11", price: 34000, images: ["/images/products/jordan_1_pine_green.png"], sellerId: S.member, color: "#2d6a4f" },
    { name: "Air Jordan 3 Retro", subtitle: "White Cement", category: "Jordan", size: "10", price: 38000, images: ["/images/products/jordan_3_white_cement.png"], sellerId: S.elite, color: "#ccc" },
    { name: "Air Jordan 3 Retro", subtitle: "Black Cement", category: "Jordan", size: "10.5", price: 40000, images: ["/images/products/jordan_3_black_cement.png"], sellerId: S.verified, color: "#1a1a1a" },
    { name: "Air Jordan 3 Retro", subtitle: "Fire Red", category: "Jordan", size: "9", price: 32000, images: ["/images/products/jordan_3_fire_red.png"], sellerId: S.member, color: "#cc2233" },
    { name: "Air Jordan 4 Retro", subtitle: "Bred", category: "Jordan", size: "10", price: 42000, images: ["/images/products/jordan_4_bred.png"], sellerId: S.elite, color: "#1a1a1a" },
    { name: "Air Jordan 4 Retro", subtitle: "Military Black", category: "Jordan", size: "11", price: 35000, images: ["/images/products/jordan_4_military_black.png"], sellerId: S.verified, color: "#333" },
    { name: "Air Jordan 4 Retro", subtitle: "Thunder", category: "Jordan", size: "10.5", price: 38000, images: ["/images/products/jordan_4_thunder.png"], sellerId: S.member, color: "#f0d050" },
    { name: "Air Jordan 4 Retro", subtitle: "University Blue", category: "Jordan", size: "9.5", price: 40000, images: ["/images/products/jordan_4_university_blue.png"], sellerId: S.verified, color: "#7bafd4" },
    { name: "Air Jordan 5 Retro", subtitle: "Fire Red", category: "Jordan", size: "10", price: 30000, images: ["/images/products/jordan_5_fire_red.png"], sellerId: S.member, color: "#cc2233" },
    { name: "Air Jordan 5 Retro", subtitle: "Metallic", category: "Jordan", size: "11", price: 32000, images: ["/images/products/jordan_5_metallic.png"], sellerId: S.verified, color: "#c0c0c0" },
    { name: "Air Jordan 5 Retro", subtitle: "Grape", category: "Jordan", size: "10", price: 34000, images: ["/images/products/jordan_5_grape.png"], sellerId: S.elite, color: "#6a0dad" },
    { name: "Air Jordan 8 Retro", subtitle: "Aqua", category: "Jordan", size: "10.5", price: 28000, images: ["/images/products/jordan_8_aqua.png"], sellerId: S.member, color: "#00b4d8" },
    { name: "Air Jordan 8 Retro", subtitle: "Playoff", category: "Jordan", size: "10", price: 30000, images: ["/images/products/jordan_8_playoff.png"], sellerId: S.verified, color: "#1a1a1a" },
    { name: "Air Jordan 9 Retro", subtitle: "Bred", category: "Jordan", size: "11", price: 27000, images: ["/images/products/jordan_9_bred.png"], sellerId: S.member, color: "#cc2233" },
    { name: "Air Jordan 9 Retro", subtitle: "University Blue", category: "Jordan", size: "10", price: 28000, images: ["/images/products/jordan_9_unc.png"], sellerId: S.verified, color: "#7bafd4" },
    { name: "Air Jordan 10 Retro", subtitle: "Shadow", category: "Jordan", size: "10.5", price: 26000, images: ["/images/products/jordan_10_shadow.png"], sellerId: S.member, color: "#555" },
    { name: "Air Jordan 10 Retro", subtitle: "Steel", category: "Jordan", size: "10", price: 25000, images: ["/images/products/jordan_10_steel.png"], sellerId: S.verified, color: "#8a8a8a" },
    { name: "Air Jordan 11 Retro", subtitle: "Concord", category: "Jordan", size: "10", price: 45000, images: ["/images/products/jordan_11_concord.png"], sellerId: S.elite, exclusive: true, color: "#1a1a6e" },
    { name: "Air Jordan 11 Retro", subtitle: "Bred", category: "Jordan", size: "11", price: 42000, images: ["/images/products/jordan_11_bred.png"], sellerId: S.elite, exclusive: true, color: "#cc2233" },
    { name: "Air Jordan 11 Retro", subtitle: "Space Jam", category: "Jordan", size: "10.5", price: 40000, images: ["/images/products/jordan_11_space_jam.png"], sellerId: S.verified, color: "#1a1a6e" },
    { name: "Air Jordan 11 Retro", subtitle: "Cool Grey", category: "Jordan", size: "10", price: 38000, images: ["/images/products/jordan_11_cool_grey.png"], sellerId: S.member, color: "#999" },
    { name: "Air Jordan 12 Retro", subtitle: "Flu Game", category: "Jordan", size: "10", price: 38000, images: ["/images/products/jordan_12_flu_game.png"], sellerId: S.elite, exclusive: true, color: "#cc2233" },
    { name: "Air Jordan 12 Retro", subtitle: "Playoff", category: "Jordan", size: "10.5", price: 35000, images: ["/images/products/jordan_12_playoff.png"], sellerId: S.verified, color: "#1a1a1a" },
    { name: "Air Jordan 12 Retro", subtitle: "Royalty", category: "Jordan", size: "11", price: 34000, images: ["/images/products/jordan_12_royalty.png"], sellerId: S.member, color: "#cfb53b" },
    { name: "Travis Scott x Air Jordan 1 Low", subtitle: "Mocha", category: "Jordan", size: "10", price: 180000, images: ["/images/products/jordan_ts_1_low_mocha.png"], sellerId: S.elite, exclusive: true, color: "#8B6914" },
    { name: "Travis Scott x Air Jordan 1 High", subtitle: "Cactus Jack", category: "Jordan", size: "10.5", price: 220000, images: ["/images/products/jordan_ts_1_high.png"], sellerId: S.elite, exclusive: true, color: "#8B6914" },
    { name: "Travis Scott x Air Jordan 4", subtitle: "Purple Suede", category: "Jordan", size: "10", price: 140000, images: ["/images/products/jordan_ts_4_purple.png"], sellerId: S.elite, exclusive: true, color: "#6a0dad" },
    { name: "Travis Scott x Air Jordan 1 Low", subtitle: "Reverse Mocha", category: "Jordan", size: "11", price: 160000, images: ["/images/products/jordan_ts_1_reverse_mocha.png"], sellerId: S.elite, exclusive: true, color: "#8B6914" },

    // ── BAPESTA (8) ──
    { name: "Bapesta Low", subtitle: "Red/White Star", category: "Bapesta", size: "10", price: 65000, images: ["/images/products/bapesta_red_white.png"], sellerId: S.verified, color: "#cc2233" },
    { name: "Bapesta Low", subtitle: "All White Star", category: "Bapesta", size: "10.5", price: 60000, images: ["/images/products/bapesta_all_white.png"], sellerId: S.member, color: "#f0f0f0" },
    { name: "Bapesta Low", subtitle: "Black/White Patent", category: "Bapesta", size: "10", price: 70000, images: ["/images/products/bapesta_black_white.png"], sellerId: S.verified, color: "#1a1a1a" },
    { name: "Bapesta Low", subtitle: "Green Camo", category: "Bapesta", size: "9.5", price: 75000, images: ["/images/products/bapesta_green_camo.png"], sellerId: S.elite, exclusive: true, color: "#2d6a4f" },
    { name: "Bapesta Low", subtitle: "Blue/White", category: "Bapesta", size: "11", price: 62000, images: ["/images/products/bapesta_blue_white.png"], sellerId: S.member, color: "#1a47b8" },
    { name: "Bapesta Low", subtitle: "Pink Patent", category: "Bapesta", size: "10", price: 68000, images: ["/images/products/bapesta_pink_patent.png"], sellerId: S.verified, color: "#e75480" },
    { name: "Bapesta Low", subtitle: "Grey Suede", category: "Bapesta", size: "10.5", price: 55000, images: ["/images/products/bapesta_grey_suede.png"], sellerId: S.member, color: "#8a8a8a" },
    { name: "Bapesta Low", subtitle: "Triple Black", category: "Bapesta", size: "10", price: 72000, images: ["/images/products/bapesta_triple_black.png"], sellerId: S.elite, exclusive: true, color: "#0d0d0d" },

    // ── NIKE SB DUNKS (15) ──
    { name: "Nike SB Dunk Low", subtitle: "Tiffany (Diamond)", category: "Nike SB", size: "10", price: 280000, images: ["/images/products/sb_tiffany.png"], sellerId: S.elite, exclusive: true, color: "#0abab5" },
    { name: "Nike SB Dunk Low", subtitle: "Pigeon (NYC)", category: "Nike SB", size: "10.5", price: 350000, images: ["/images/products/sb_pigeon.png"], sellerId: S.elite, exclusive: true, color: "#8a8a8a" },
    { name: "Nike SB Dunk Low", subtitle: "Paris", category: "Nike SB", size: "10", price: 450000, images: ["/images/products/sb_paris.png"], sellerId: S.elite, exclusive: true, color: "#4a90d9" },
    { name: "Nike SB Dunk Low", subtitle: "Heineken", category: "Nike SB", size: "11", price: 320000, images: ["/images/products/sb_heineken.png"], sellerId: S.elite, exclusive: true, color: "#2d6a4f" },
    { name: "Nike SB Dunk Low", subtitle: "Freddy Krueger", category: "Nike SB", size: "10", price: 400000, images: ["/images/products/sb_freddy_krueger.png"], sellerId: S.elite, exclusive: true, color: "#8b2020" },
    { name: "Nike SB Dunk Low", subtitle: "Staple Panda Pigeon", category: "Nike SB", size: "10.5", price: 180000, images: ["/images/products/sb_panda_pigeon.png"], sellerId: S.verified, exclusive: true, color: "#1a1a1a" },
    { name: "Nike SB Dunk Low", subtitle: "Supreme Red Cement", category: "Nike SB", size: "10", price: 220000, images: ["/images/products/sb_supreme_red.png"], sellerId: S.elite, exclusive: true, color: "#cc2233" },
    { name: "Nike SB Dunk Low", subtitle: "Travis Scott", category: "Nike SB", size: "11", price: 160000, images: ["/images/products/sb_travis_scott.png"], sellerId: S.elite, exclusive: true, color: "#8B6914" },
    { name: "Nike SB Dunk Low", subtitle: "What The Dunk", category: "Nike SB", size: "10", price: 250000, images: ["/images/products/sb_what_the_dunk.png"], sellerId: S.elite, exclusive: true, color: "#f59e42" },
    { name: "Nike SB Dunk Low", subtitle: "Stussy Cherry", category: "Nike SB", size: "10.5", price: 140000, images: ["/images/products/sb_stussy_cherry.png"], sellerId: S.verified, color: "#8b2020" },
    { name: "Nike SB Dunk Low", subtitle: "Purple Lobster", category: "Nike SB", size: "10", price: 300000, images: ["/images/products/sb_purple_lobster.png"], sellerId: S.elite, exclusive: true, color: "#6a0dad" },
    { name: "Nike SB Dunk Low", subtitle: "Green Lobster", category: "Nike SB", size: "11", price: 280000, images: ["/images/products/sb_green_lobster.png"], sellerId: S.elite, exclusive: true, color: "#2d6a4f" },
    { name: "Nike SB Dunk High", subtitle: "De La Soul", category: "Nike SB", size: "10", price: 160000, images: ["/images/products/sb_de_la_soul.png"], sellerId: S.verified, exclusive: true, color: "#2d6a4f" },
    { name: "Nike SB Dunk Low", subtitle: "Grateful Dead Green", category: "Nike SB", size: "10.5", price: 200000, images: ["/images/products/sb_grateful_dead.png"], sellerId: S.elite, exclusive: true, color: "#2d6a4f" },
    { name: "Nike SB Dunk Low", subtitle: "Raygun Tie-Dye", category: "Nike SB", size: "10", price: 120000, images: ["/images/products/sb_raygun.png"], sellerId: S.verified, color: "#f0d050" },

    // ── MAISON MARGIELA (8) ──
    { name: "Maison Margiela Replica", subtitle: "White Leather", category: "Maison Margiela", size: "42", price: 85000, images: ["/images/products/margiela_replica_white.png"], sellerId: S.verified, color: "#f0f0f0" },
    { name: "Maison Margiela Replica", subtitle: "Paint Splatter", category: "Maison Margiela", size: "43", price: 110000, images: ["/images/products/margiela_replica_paint.png"], sellerId: S.elite, exclusive: true, color: "#4a90d9" },
    { name: "Maison Margiela Tabi Boot", subtitle: "Black Leather", category: "Maison Margiela", size: "42", price: 145000, images: ["/images/products/margiela_tabi_black.png"], sellerId: S.elite, exclusive: true, color: "#0d0d0d" },
    { name: "Maison Margiela Tabi", subtitle: "White Ballet", category: "Maison Margiela", size: "41", price: 120000, images: ["/images/products/margiela_tabi_white.png"], sellerId: S.verified, color: "#f0f0f0" },
    { name: "Maison Margiela GAT", subtitle: "White/Gum", category: "Maison Margiela", size: "43", price: 95000, images: ["/images/products/margiela_gat.png"], sellerId: S.member, color: "#f5f5f5" },
    { name: "Maison Margiela Replica", subtitle: "Black Suede", category: "Maison Margiela", size: "42", price: 80000, images: ["/images/products/margiela_replica_grey.png"], sellerId: S.member, color: "#1a1a1a" },
    { name: "Maison Margiela Fusion", subtitle: "Black/White Deconstructed", category: "Maison Margiela", size: "43", price: 135000, images: ["/images/products/margiela_fusion.png"], sellerId: S.elite, exclusive: true, color: "#333" },
    { name: "Maison Margiela Evolution", subtitle: "Triple Black", category: "Maison Margiela", size: "42", price: 125000, images: ["/images/products/margiela_evolution.png"], sellerId: S.verified, color: "#0d0d0d" },

    // ── MARNI (6) ──
    { name: "Marni Pablo", subtitle: "Black Nappa Leather", category: "Marni", size: "42", price: 75000, images: ["/images/products/marni_pablo.png"], sellerId: S.verified, color: "#0d0d0d" },
    { name: "Marni Pablo", subtitle: "White Calf Leather", category: "Marni", size: "43", price: 75000, images: ["/images/products/marni_pablo_mj.png"], sellerId: S.member, color: "#f0f0f0" },
    { name: "Marni Dada Bumper", subtitle: "Black/White", category: "Marni", size: "42", price: 95000, images: ["/images/products/marni_dada_bw.png"], sellerId: S.elite, color: "#1a1a1a" },
    { name: "Marni Dada Bumper", subtitle: "Green/Brown", category: "Marni", size: "43", price: 95000, images: ["/images/products/marni_dada_green.png"], sellerId: S.verified, color: "#2d6a4f" },
    { name: "Marni Platform Sneaker", subtitle: "Black Chunky", category: "Marni", size: "42", price: 88000, images: ["/images/products/marni_platform.png"], sellerId: S.elite, color: "#111" },
    { name: "Marni Big Foot 2.0", subtitle: "White/Orange", category: "Marni", size: "43", price: 82000, images: ["/images/products/marni_bigfoot.png"], sellerId: S.member, color: "#f59e42" },

    // ── OTHER (Gucci, Prada, Mihara, McQueen) (5) ──
    { name: "Gucci GG Monogram Slides", subtitle: "Denim Canvas", category: "Gucci", size: "42", price: 68000, images: ["/images/products/gucci_gg_slide.png"], sellerId: S.verified, color: "#4a6fa5" },
    { name: "Gucci GG Horsebit Sandal", subtitle: "Grey Canvas", category: "Gucci", size: "43", price: 75000, images: ["/images/products/gucci_horsebit.png"], sellerId: S.elite, color: "#7a7a7a" },
    { name: "Maison Mihara Yasuhiro", subtitle: "Dissolved Low B/W", category: "Mihara", size: "42", price: 48000, images: ["/images/products/mihara_dissolved.png"], sellerId: S.member, color: "#f5f5f5" },
    { name: "Prada Monolith Loafer", subtitle: "Black Patent Lug", category: "Prada", size: "42", price: 135000, images: ["/images/products/prada_chocolate_loafer.png"], sellerId: S.elite, exclusive: true, color: "#0d0d0d" },
    { name: "Alexander McQueen Tread Slick", subtitle: "Black Sock Boot", category: "Other", size: "42", price: 95000, images: ["/images/products/mcqueen_tread_slick.png"], sellerId: S.elite, color: "#0a0a0a" },

    // ── ZÖAR MERCH (10) ──
    { name: "ZÖAR Classic Tee", subtitle: "Black / Logo Print", category: "ZÖAR Merch", type: "Apparel", size: "M/L/XL", price: 8500, images: ["/images/products/merch_tee_black.png"], sellerId: S.admin, color: "#0a0a0a" },
    { name: "ZÖAR Classic Tee", subtitle: "Cream / Logo Print", category: "ZÖAR Merch", type: "Apparel", size: "M/L/XL", price: 8500, images: ["/images/products/merch_tee_cream.png"], sellerId: S.admin, color: "#F5F0E8" },
    { name: "ZÖAR Heavyweight Hoodie", subtitle: "Black / Embroidered", category: "ZÖAR Merch", type: "Apparel", size: "M/L/XL", price: 16500, images: ["/images/products/merch_hoodie_black.png"], sellerId: S.admin, color: "#0a0a0a" },
    { name: "ZÖAR Heavyweight Hoodie", subtitle: "Cream / Embroidered", category: "ZÖAR Merch", type: "Apparel", size: "M/L/XL", price: 16500, images: ["/images/products/merch_hoodie_cream.png"], sellerId: S.admin, color: "#F5F0E8" },
    { name: "ZÖAR Crewneck Sweat", subtitle: "Black / Infinity Logo", category: "ZÖAR Merch", type: "Apparel", size: "M/L/XL", price: 13500, images: ["/images/products/merch_crew_black.png"], sellerId: S.admin, color: "#0a0a0a" },
    { name: "ZÖAR Crewneck Sweat", subtitle: "Charcoal / Infinity Logo", category: "ZÖAR Merch", type: "Apparel", size: "M/L/XL", price: 13500, images: ["/images/products/merch_crew_charcoal.png"], sellerId: S.admin, color: "#333" },
    { name: "ZÖAR Members Cap", subtitle: "Black / Gold 8 Emblem", category: "ZÖAR Merch", type: "Accessories", size: "OS", price: 6500, images: ["/images/products/merch_cap_black.png"], sellerId: S.admin, color: "#0a0a0a" },
    { name: "ZÖAR Tote Bag", subtitle: "Canvas / Infinity Print", category: "ZÖAR Merch", type: "Accessories", size: "OS", price: 5500, images: ["/images/products/merch_tote.png"], sellerId: S.admin, color: "#F5F0E8" },
    { name: "ZÖAR Membership Pin", subtitle: "Gold / Infinity Emblem", category: "ZÖAR Merch", type: "Accessories", size: "OS", price: 3500, images: ["/images/products/merch_pin.png"], sellerId: S.admin, exclusive: true, color: "#cfb53b" },
    { name: "ZÖAR Socks Pack", subtitle: "Black + Cream / 3-Pack", category: "ZÖAR Merch", type: "Accessories", size: "OS", price: 4500, images: ["/images/products/merch_socks.png"], sellerId: S.admin, color: "#0a0a0a" },
  ];

  console.log(`📦 Creating ${products.length} products...`);

  for (const p of products) {
    await prisma.product.create({
      data: {
        name: p.name,
        subtitle: p.subtitle,
        category: p.category,
        type: p.type || "Footwear",
        size: p.size,
        price: p.price,
        images: p.images || [],
        sellerId: p.sellerId,
        exclusive: p.exclusive || false,
        color: p.color || null,
        condition: "New / DS",
        negotiable: true,
      },
    });
  }

  // ── ISO FEED ENTRIES ──
  console.log("📡 Creating ISO feed...");

  const isoEntries = [
    { userId: member.id, description: "Balenciaga Track Black Size 43" },
    { userId: verified.id, description: "Chrome Hearts Fleur Pendant Sterling" },
    { userId: elite.id, description: "Rick Owens Ramones High Black 42" },
    { userId: member.id, description: "Travis Scott x AJ1 High Size 10" },
    { userId: sellerUser.id, description: "Bottega Veneta Puddle Boot 43" },
    { userId: verified.id, description: "Air Jordan 11 Concord Size 10.5" },
    { userId: elite.id, description: "Bapesta Green Camo Size 10" },
    { userId: member.id, description: "Rick Owens Megalace Strobe 42" },
    { userId: sellerUser.id, description: "Air Jordan 4 Military Black 11" },
    { userId: verified.id, description: "Gucci GG Monogram Slides 42" },
    { userId: elite.id, description: "Nike SB Dunk Low Pigeon 10.5" },
    { userId: member.id, description: "Maison Margiela Tabi Boot 42" },
  ];

  for (const iso of isoEntries) {
    await prisma.isoPost.create({ data: iso });
  }

  console.log(`\n✅ Seed complete!`);
  console.log(`   👤 Users: ${await prisma.user.count()}`);
  console.log(`   📦 Products: ${await prisma.product.count()}`);
  console.log(`   📡 ISO Posts: ${await prisma.isoPost.count()}`);
  console.log(`\n   Admin login: admin@zoar.app / zoar2026`);
  console.log(`   Member login: member@zoar.app / member2026`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
