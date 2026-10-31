#!/usr/bin/env node
/* blog/posts.mjs → backend/data/posts.json (tek seferlik içe aktarma kaynağı).
   Kullanım: node backend/bin/export-posts.mjs && php backend/bin/import-posts.php */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { POSTS, CATEGORIES } from "../../blog/posts.mjs";

const out = path.join(path.dirname(fileURLToPath(import.meta.url)), "../data/posts.json");
fs.writeFileSync(out, JSON.stringify({ categories: CATEGORIES, posts: POSTS }, null, 2) + "\n");
console.log(`${POSTS.length} yazı, ${CATEGORIES.length} kategori → backend/data/posts.json`);
