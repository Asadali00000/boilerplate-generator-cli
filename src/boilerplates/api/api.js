const path = require('path');
const { copyBoilerplateFolder, walkSync } = require('../../utils/fileUtils');

class APIBoilerplate {
  static getDependencies() {
    return [
      'axios'
    ];
  }

  async generateAPIBoilerplate(projectPath, options) {
    const templateDir = __dirname;
    await copyBoilerplateFolder(templateDir, path.join(projectPath, 'api'), ['api.js']);
    const allFiles = walkSync(templateDir).filter(f => f !== 'api.js');
    return {
      dependencies: APIBoilerplate.getDependencies(),
      instructions: [
        'Configure your API base URL in api/client.js',
        'Update the endpoints in api/endpoints.js',
        'Use the use*Api hook in your components or modify it'
      ],
      files: allFiles
    };
  }
}

module.exports = APIBoilerplate;
