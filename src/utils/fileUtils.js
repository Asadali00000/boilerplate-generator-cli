const fs = require('fs');
const path = require('path');
const colors = require('./colors');

// Helper method to create file structure
const createFileStructure = (basePath, structure) => {
  Object.entries(structure).forEach(([filePath, content]) => {
    console.log(filePath, basePath);
    const fullPath = path.join(basePath, filePath);
    const dir = path.dirname(fullPath);

    // Create directory if it doesn't exist
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Check if file already exists
    if (fs.existsSync(fullPath)) {
      console.log(`${colors.yellow}⚠ File already exists: ${filePath}${colors.reset}`);
      return;
    }

    // Write file
    fs.writeFileSync(fullPath, content, 'utf8');
  });
};

module.exports = {
  createFileStructure
};
