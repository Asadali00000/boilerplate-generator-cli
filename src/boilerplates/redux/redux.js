const path = require('path');
const { copyBoilerplateFolder, walkSync } = require('../../utils/fileUtils');

class ReduxBoilerplate {
  static getDependencies() {
    return [
      '@reduxjs/toolkit',
      'react-redux'
    ];
  }

  async generateReduxBoilerplate(projectPath, options) {
    const templateDir = __dirname;
    await copyBoilerplateFolder(templateDir, path.join(projectPath, 'store'), ['redux.js']);
    const allFiles = walkSync(templateDir).filter(f => f !== 'redux.js');
    return {
      dependencies: ReduxBoilerplate.getDependencies(),
      instructions: [
        'Import your slices in store/index.js',
        'Wrap your app with Redux Provider',
        'Add your API calls in the action creators',
        'Create your own hooks and components using the generated structure'
      ],
      files: allFiles
    };
  }
}

module.exports = ReduxBoilerplate;
