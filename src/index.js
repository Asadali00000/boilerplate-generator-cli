#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const colors = require('./utils/colors');
const { createFileStructure } = require('./utils/fileUtils');

// Import boilerplate modules
const ReduxBoilerplate = require('./boilerplates/redux');
const APIBoilerplate = require('./boilerplates/api');
const AuthBoilerplate = require('./boilerplates/auth');
const FormBoilerplate = require('./boilerplates/form');

class BoilerplateGenerator {
  constructor() {
    // Initialize boilerplate instances
    this.reduxBoilerplate = new ReduxBoilerplate();
    this.apiBoilerplate = new APIBoilerplate();
    this.authBoilerplate = new AuthBoilerplate();
    this.formBoilerplate = new FormBoilerplate();

    // Map template types to their respective generators
    this.templates = {
      redux: this.reduxBoilerplate.generateReduxBoilerplate.bind(this.reduxBoilerplate),
      api: this.apiBoilerplate.generateAPIBoilerplate.bind(this.apiBoilerplate),
      auth: this.authBoilerplate.generateAuthBoilerplate.bind(this.authBoilerplate),
      form: this.formBoilerplate.generateFormBoilerplate.bind(this.formBoilerplate),
      // TODO: Add other boilerplate types as they are implemented
      // crud: this.crudBoilerplate.generateCRUDBoilerplate.bind(this.crudBoilerplate),
      // hooks: this.hooksBoilerplate.generateHooksBoilerplate.bind(this.hooksBoilerplate),
      // context: this.contextBoilerplate.generateContextBoilerplate.bind(this.contextBoilerplate),
      // middleware: this.middlewareBoilerplate.generateMiddlewareBoilerplate.bind(this.middlewareBoilerplate),
      // components: this.componentBoilerplate.generateComponentBoilerplate.bind(this.componentBoilerplate),
      // utils: this.utilsBoilerplate.generateUtilsBoilerplate.bind(this.utilsBoilerplate)
    };
  }

  // Main CLI handler
  run() {
    const args = process.argv.slice(2);

    if (args.length < 2) {
      this.showHelp();
      return;
    }

    const [targetPath, templateType, ...options] = args;

    if (!this.templates[templateType]) {
      console.log(`${colors.red}Error: Template "${templateType}" not found!${colors.reset}`);
      this.showAvailableTemplates();
      return;
    }

    try {
      this.addBoilerplateToProject(targetPath, templateType, options);
    } catch (error) {
      console.log(`${colors.red}Error: ${error.message}${colors.reset}`);
    }
  }

  // Add boilerplate to existing project
  addBoilerplateToProject(targetPath, templateType, options) {
    const fullPath = path.resolve(targetPath);
    console.log(targetPath, fullPath);

    // Check if target path exists, if not create it
    if (!fs.existsSync(fullPath)) {
      console.log(`${colors.yellow}Creating directory: ${fullPath}${colors.reset}`);
      fs.mkdirSync(fullPath, { recursive: true });
    }

    console.log(`${colors.blue}Adding ${templateType} boilerplate to: ${fullPath}${colors.reset}`);

    // Generate template-specific files
    const result = this.templates[templateType](fullPath, options);

    console.log(`${colors.green}${colors.bold}✓ ${templateType} boilerplate added successfully!${colors.reset}`);

    if (result.dependencies && result.dependencies.length > 0) {
      console.log(`${colors.cyan}${colors.bold}📦 Required dependencies:${colors.reset}`);
      result.dependencies.forEach(dep => {
        console.log(`  ${colors.cyan}npm install ${dep}${colors.reset}`);
      });
    }

    if (result.instructions) {
      console.log(`${colors.blue}${colors.bold}📋 Next steps:${colors.reset}`);
      result.instructions.forEach(instruction => {
        console.log(`  ${colors.blue}• ${instruction}${colors.reset}`);
      });
    }

    if (result.files) {
      console.log(`${colors.green}${colors.bold}📁 Files created:${colors.reset}`);
      result.files.forEach(file => {
        console.log(`  ${colors.green}✓ ${file}${colors.reset}`);
      });
    }
  }

  // Show help and available templates
  showHelp() {
    console.log(`${colors.bold}${colors.blue}Boilerplate Generator CLI${colors.reset}`);
    console.log(`Generate clean, minimal boilerplate code for your existing projects\n`);
    console.log(`${colors.bold}Usage:${colors.reset}`);
    console.log(`  boiler-generate <path> <template> [options]\n`);
    console.log(`${colors.bold}Examples:${colors.reset}`);
    console.log(`  boiler-generate ./src redux user`);
    console.log(`  boiler-generate ./components form contact`);
    console.log(`  boiler-generate ./api api products`);
    console.log(`  boiler-generate ./src auth`);
    console.log(`  boiler-generate ./utils hooks\n`);
    this.showAvailableTemplates();
  }

  showAvailableTemplates() {
    console.log(`${colors.bold}Available Templates:${colors.reset}`);
    console.log(`  ${colors.green}redux${colors.reset}      - Redux store setup with slices, actions, selectors`);
    console.log(`  ${colors.green}api${colors.reset}        - API service layer with hooks and types`);
    console.log(`  ${colors.yellow}auth${colors.reset}       - Authentication system with context(coming soon)`);
    console.log(`  ${colors.yellow}form${colors.reset}       - Form components with validation(coming soon)`);
    console.log(`  ${colors.yellow}crud${colors.reset}       - Complete CRUD operations (coming soon)`);
    console.log(`  ${colors.yellow}hooks${colors.reset}      - Collection of custom React hooks (coming soon)`);
    console.log(`  ${colors.yellow}context${colors.reset}    - React Context setup (coming soon)`);
    console.log(`  ${colors.yellow}middleware${colors.reset} - Express middleware collection (coming soon)`);
    console.log(`  ${colors.yellow}components${colors.reset} - Reusable component template (coming soon)`);
    console.log(`  ${colors.yellow}utils${colors.reset}      - Utility functions collection (coming soon)`);
  }
}

// Run the CLI
if (require.main === module) {
  const generator = new BoilerplateGenerator();
  generator.run();
}

module.exports = BoilerplateGenerator;
