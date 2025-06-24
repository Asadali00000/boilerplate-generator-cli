const path = require('path');
const { copyBoilerplateFolder, walkSync } = require('../../utils/fileUtils');

class AuthBoilerplate {
  static getDependencies() {
    return [
      'axios',
      'js-cookie'
    ];
  }

  async generateAuthBoilerplate(projectPath, options) {
    const templateDir = __dirname;
    await copyBoilerplateFolder(templateDir, path.join(projectPath, 'auth'), ['auth.js']);
    const allFiles = walkSync(templateDir).filter(f => f !== 'auth.js');
    return {
      dependencies: AuthBoilerplate.getDependencies(),
      instructions: [
        'Wrap your app with AuthProvider',
        'Configure your auth endpoints in authService.js',
        'Use ProtectedRoute for protected pages',
        'Use useAuth hook to access auth state and methods'
      ],
      files: allFiles
    };
  }
}

module.exports = AuthBoilerplate;
