const path = require('path');
const { copyBoilerplateFolder, walkSync } = require('../../utils/fileUtils');

class ExpressBoilerplate {
  static getDependencies() {
    return [
      'express',
      'dotenv',
      'morgan',
      'mongoose',
    ];
  }

  async generateExpressBoilerplate(projectPath, options) {
    const templateDir = path.join(__dirname);
    const targetDir = path.join(projectPath, 'express');
    await copyBoilerplateFolder(templateDir, targetDir, []);
	const allFiles = walkSync(templateDir).filter(
		f => !['express.js', 'middleware.js'].includes(f)
	  );

    return {
      dependencies: ExpressBoilerplate.getDependencies(),
      instructions: [
        'Set up your .env file as needed (see express/config/).',
        'Start the server: node express/server.js',
        'Edit routes/controllers as needed in express/routes/ and express/controllers/',
        'Install dependencies: npm install ' + ExpressBoilerplate.getDependencies().join(' '),
      ],
      files: allFiles.map(f => path.join('express', f))
    };
  }
}

module.exports = ExpressBoilerplate;
