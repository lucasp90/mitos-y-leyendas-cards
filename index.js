// generate_image_urls.js
import fs from "fs";
import path from "path";
import fg from "fast-glob";
import { createObjectCsvWriter } from "csv-writer";

const GITHUB_USER = "lucasp90"; // <-- change this
const REPO_NAME = "mitos-y-leyendas-cards"; // <-- change this
const BRANCH = "main"; // usually main

// Base directory where your images are stored
const BASE_DIR = path.join(process.cwd(), "cards");

// Output CSV file
const OUTPUT_FILE = "image_urls.csv";

async function main() {
  console.log("Scanning image directories...");
  const files = await fg("**/*.png", { cwd: BASE_DIR });

  const csvWriter = createObjectCsvWriter({
    path: OUTPUT_FILE,
    header: [
      { id: "edition", title: "edition" },
      { id: "filename", title: "filename" },
      { id: "url", title: "picture" },
    ],
  });

  const records = files.map((filePath) => {
    const edition = filePath.split(path.sep)[0].replace(/^\d+_/, ""); // "01_espada_sagrada" -> "espada_sagrada"
    const filename = path.basename(filePath, ".png");
    const url = `https://cdn.jsdelivr.net/gh/${GITHUB_USER}/${REPO_NAME}@${BRANCH}/cards/${filePath}`;
    return { edition, filename, url };
  });

  await csvWriter.writeRecords(records);

  console.log(`✅ Done! Generated ${records.length} URLs in ${OUTPUT_FILE}`);
  console.log("Example URL:", records[0]?.url);
}

main().catch((err) => console.error(err));
