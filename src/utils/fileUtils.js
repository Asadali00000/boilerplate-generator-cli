const fs = require('fs');
const path = require('path');
const colors = require('./colors');
const fsExtra = require('fs-extra');
const inquirer = require('inquirer');

// Helper method to create file structure (legacy: for code-generated files)
const createFileStructure = (basePath, structure) => {
  Object.entries(structure).forEach(([filePath, content]) => {
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

// Copy an entire boilerplate folder to the target directory, ignoring files by name
const copyBoilerplateFolder = async (templateDir, targetDir, ignore = []) => {
  try {
    await fsExtra.copy(templateDir, targetDir, {
      overwrite: false,
      errorOnExist: false,
      filter: (src, dest) => {
        const rel = path.relative(templateDir, src);
        // Ignore files if their basename matches any ignore pattern
        for (const pattern of ignore) {
          if (path.basename(rel) === pattern) {
            return false;
          }
        }
        // Only check for files (not directories)
        if (fs.existsSync(dest) && fs.lstatSync(src).isFile()) {
          console.log(`${colors.yellow}⚠ File already exists and was not overwritten: ${path.relative(targetDir, dest)}${colors.reset}`);
          return false;
        }
        return true;
      }
    });
    console.log(`${colors.green}✓ Boilerplate  copied   to ${targetDir}${colors.reset}`);
  } catch (err) {
    if (err.message && err.message.includes('already exists')) {
      console.log(`${colors.yellow}⚠ Some files already exist in the target directory and were not overwritten.${colors.reset}`);
    } else {
      console.error(`${colors.red}Error copying boilerplate folder: ${err.message}${colors.reset}`);
    }
  }
};

// Recursively walk a directory and return all files relative to baseDir
const walkSync = (dir, filelist = [], baseDir = dir) => {
  fs.readdirSync(dir).forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walkSync(fullPath, filelist, baseDir);
    } else {
      filelist.push(path.relative(baseDir, fullPath));
    }
  });
  return filelist;
};

async function askYesNo(message, defaultValue = false) {
  const { answer } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'answer',
      message,
      default: defaultValue,
    },
  ]);
  return answer;
}

async function askInput(message) {

  const { value } = await inquirer.prompt([
    {
      type: 'input',
      name: 'value',
      message,
      validate: input => input.trim() ? true : 'Input cannot be empty.'
    }
  ]);
  return value.trim();
}

/**
 * Parses Gemini AI output in the format:
 * <relative/path/to/file.ext>\n```js\n// file content\n```\n...
 * Returns: [{ file, content }]
 */
function parseGeminiOutput(aiOutput) {
  const files = [];
  // Match: <path/to/file.ext>\n```lang\ncontent\n```
  const fileBlockRegex = /<([^>]+)>[\r\n]+```[\w-]*\n([\s\S]*?)\n```/g;
  let match;
  while ((match = fileBlockRegex.exec(aiOutput)) !== null) {
    const file = match[1].trim();
    const content = match[2].trim();
    files.push({ file, content });
  }
  return files;
}

/**
 * Extracts dependencies from a ```deps code block in the Gemini output.
 * Returns: [ 'package1', 'package2', ... ]
 */
function extractGeminiDependencies(aiOutput) {
  const match = aiOutput.match(/```deps\n([\s\S]*?)\n```/);
  if (!match) return [];
  return match[1].split('\n').map(dep => dep.trim()).filter(Boolean);
}

module.exports = {
  createFileStructure,
  copyBoilerplateFolder,
  walkSync,
  askYesNo,
  parseGeminiOutput,
  extractGeminiDependencies,
  askInput,
};
