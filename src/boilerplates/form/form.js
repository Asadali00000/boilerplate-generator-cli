const path = require('path');
const { copyBoilerplateFolder, walkSync } = require('../../utils/fileUtils');

class FormBoilerplate {
  static getDependencies() {
    return [];
  }

  async generateFormBoilerplate(projectPath, options) {
    const templateDir = __dirname;
    await copyBoilerplateFolder(templateDir, path.join(projectPath, 'form'), ['form.js']);
    const allFiles = walkSync(templateDir).filter(f => f !== 'form.js');
    return {
      dependencies: FormBoilerplate.getDependencies(),
      instructions: [
        'Use the *Form component in your pages',
        'Customize validation rules in formValidation.js',
        'Modify form fields based on your requirements',
        'Use FormField for consistent form styling'
      ],
      files: allFiles
    };
  }
}

module.exports = FormBoilerplate;
