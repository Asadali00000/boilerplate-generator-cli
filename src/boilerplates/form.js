const { createFileStructure } = require('../utils/fileUtils');

class FormBoilerplate {
  // Form boilerplate generator
  generateFormBoilerplate(projectPath, options) {
    const formName = options[0] || 'contact';
    const capitalizedForm = formName.charAt(0).toUpperCase() + formName.slice(1);

    const structure = {
      [`components/Forms/${capitalizedForm}Form.jsx`]: this.getFormComponent(formName, capitalizedForm),
      [`components/Forms/${capitalizedForm}Form.module.css`]: this.getFormCSS(),
      [`components/Forms/FormField.jsx`]: this.getFormField(),
      [`components/Forms/FormField.module.css`]: this.getFormFieldCSS(),
      [`components/Forms/FormButton.jsx`]: this.getFormButton(),
      [`components/Forms/FormButton.module.css`]: this.getFormButtonCSS(),
      [`hooks/useForm.js`]: this.getFormHook(),
      [`utils/formValidation.js`]: this.getFormValidation(),
      [`constants/formConstants.js`]: this.getFormConstants()
    };

    createFileStructure(projectPath, structure);

    return {
      dependencies: [],
      instructions: [
        `Use the ${capitalizedForm}Form component in your pages`,
        'Customize validation rules in formValidation.js',
        'Modify form fields based on your requirements',
        'Use FormField for consistent form styling'
      ],
      files: Object.keys(structure)
    };
  }

  // Form template methods

}

module.exports = FormBoilerplate;
