const path = require('path');
const { copyBoilerplateFolder, walkSync } = require('../../utils/fileUtils');

class MiddleWareBoilerplate {
  static getDependencies() {
    return [
      'jsonwebtoken',

    ];
  }

  async generateMiddleWareBoilerplate(projectPath, options) {
    const templateDir = __dirname;
    await copyBoilerplateFolder(templateDir, path.join(projectPath, 'middleware'), ['middleware.js']);
    const allFiles = walkSync(templateDir).filter(f => f !== 'redux.js');
    return {
      dependencies: MiddleWareBoilerplate.getDependencies(),
      instructions: [
		'Create .env file: JWT_SECRET=your-secret-key',
		'Apply middleware: app.use("/api", authMiddleware)',
		'Access user data in routes via req.user',
		'Update publicPaths array for routes that don\'t need auth'
      ],
      files: allFiles
    };
  }
}

module.exports = MiddleWareBoilerplate;
