#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

/**
 * React Native Assets Structure Generator
 * Creates standard asset folders with README.md files explaining each
 */

const ASSETS_STRUCTURE = {
  fonts: "Custom font files (TTF, OTF) for the app",
  images: "Static images (PNG, JPG, SVG) - prefer vector where possible",
  sounds: "Audio files for notifications/sound effects (MP3, WAV)",
  videos: "Video assets (MP4, MOV) - keep optimized for mobile",
  animations: "Lottie animations (JSON) or GIFs",
  data: "Local JSON data/mock files for development",
};

function createAssetsStructure(targetPath) {
  const assetsPath = path.join(targetPath, "assets");

  if (!fs.existsSync(assetsPath)) {
    fs.mkdirSync(assetsPath, { recursive: true });
  }

  Object.entries(ASSETS_STRUCTURE).forEach(([folder, description]) => {
    const folderPath = path.join(assetsPath, folder);

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
      // Create README with folder purpose
      fs.writeFileSync(
        path.join(folderPath, "README.md"),
        `# ${folder}\n${description}\n\nPlace your ${folder} files here.`
      );
    }
  });

  console.log("✅ Assets folder structure created at:", assetsPath);
}

// Handle CLI commands
const args = process.argv.slice(2);
const targetPath = args[0] || "./src";
const command = args[1];

if (command === "react-native-assets") {
  createAssetsStructure(targetPath);
} else if (command === "react-native") {
  // This would be part of your larger boilerplate generator
  console.log("Creating full React Native boilerplate...");
  createAssetsStructure(targetPath);
  // Add other boilerplate generation here
} else {
  console.log("Usage:");
  console.log(
    "  npx my-boilerplate-generator ./src react-native       # Full boilerplate"
  );
  console.log(
    "  npx my-boilerplate-generator ./src react-native-assets # Only assets"
  );
  process.exit(1);
}
