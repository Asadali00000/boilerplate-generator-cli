const path = require('path');
const { copyBoilerplateFolder, walkSync } = require('../../utils/fileUtils');

class EmailBoilerplate {
  static getDependencies() {
    return [
      'nodemailer'
    ];
  }

  async generateEmailBoilerplate(projectPath, options) {
    const templateDir = __dirname;
    await copyBoilerplateFolder(templateDir, path.join(projectPath, 'email'), ['emailBoilerplate.js']);
    const allFiles = walkSync(templateDir).filter(f => f !== 'emailBoilerplate.js');
    
    return {
      dependencies: EmailBoilerplate.getDependencies(),
      instructions: [
        'Email Service with Nodemailer',
        'Copy the .env variables to your project\'s .env file and configure your SMTP settings',
        'Import EmailService: const EmailService = require("./email/email");',
        'Use example routes: const { sendTestEmail } = require("./email/exampleController");',
        'Test your setup by hitting GET /test-email?email=your-email@example.com',
        'For production, consider using dedicated email services like SendGrid or Mailgun'
      ],
      files: allFiles
    };
  }
}

module.exports = EmailBoilerplate;
