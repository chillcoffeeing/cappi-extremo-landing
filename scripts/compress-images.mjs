import sharp from "sharp";
import { readdir, stat, writeFile, copyFile, mkdir, rm } from "node:fs/promises";
import { join, extname } from "node:path";

const GALLERY_DIR = join(import.meta.dirname, "..", "src", "assets", "gallery");
const TEMP_DIR = join(
  process.env.TEMP || process.env.TMPDIR || "/tmp",
  "img-compress",
);
const MAX_WIDTH = 1600;
const QUALITY = 40;
const IMAGE_EXTS = /\.(jpe?g|png|webp|gif|avif|tiff?|bmp|jfif|heic|heif)$/i;

await mkdir(TEMP_DIR, { recursive: true });

async function findImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) {
      files.push(...(await findImages(full)));
    } else if (IMAGE_EXTS.test(e.name)) {
      files.push(full);
    }
  }
  return files;
}

async function processFile(filePath) {
  const before = (await stat(filePath)).size;

  // Copy to temp first (OneDrive files can't be written in-place)
  const tempIn = join(
    TEMP_DIR,
    `in_${Date.now()}_${Math.random().toString(36).slice(2)}${extname(filePath).toLowerCase()}`,
  );
  const tempOut = join(
    TEMP_DIR,
    `out_${Date.now()}_${Math.random().toString(36).slice(2)}.webp`,
  );
  await copyFile(filePath, tempIn);

  const img = sharp(tempIn);
  const meta = await img.metadata();
  const needsResize = meta.width && meta.width > MAX_WIDTH;

  let pipeline = img;
  if (needsResize) {
    pipeline = pipeline.resize({ width: MAX_WIDTH, withoutEnlargement: true });
  }
  pipeline = pipeline.webp({ quality: QUALITY });

  const buf = await pipeline.toBuffer();
  await writeFile(tempOut, buf);

  const outPath = filePath.replace(/\.\w+$/i, ".webp");
  await copyFile(tempOut, outPath);

  // El original se reemplaza por el webp (salvo que ya fuera webp)
  if (!/\.webp$/i.test(filePath)) {
    await rm(filePath, { force: true });
  }

  return {
    file: outPath.replace(GALLERY_DIR + "/", ""),
    before,
    after: buf.length,
  };
}

const files = await findImages(GALLERY_DIR);
console.log(`Found ${files.length} images to convert to WebP...`);

const results = [];
for (const f of files) {
  try {
    results.push(await processFile(f));
  } catch (err) {
    console.error(`  SKIP ${f}: ${err.message}`);
  }
}

if (results.length === 0) {
  console.log("No images found.");
} else {
  const saved = results.reduce((a, r) => a + (r.before - r.after), 0);
  console.log(
    `\nConverted ${results.length} files to WebP, saved ${(saved / 1024 / 1024).toFixed(1)} MB:\n`,
  );
  for (const r of results) {
    const pct = ((1 - r.after / r.before) * 100).toFixed(0);
    console.log(
      `  ${r.file}: ${(r.before / 1024 / 1024).toFixed(1)}MB → ${(r.after / 1024).toFixed(0)}KB (-${pct}%)`,
    );
  }
}
