#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const colors = require('./utils/colors');

// Import boilerplate modules
const ReduxBoilerplate = require('./boilerplates/redux');
const APIBoilerplate = require('./boilerplates/api');
const AuthBoilerplate = require('./boilerplates/auth');
const FormBoilerplate = require('./boilerplates/form');
const askToInstall = require('./utils/installPackages');
const ReactNativeNavigationBoilerplate = require('./boilerplatesReactNative/navigation');

class BoilerplateGenerator {
  constructor() {
    // Initialize boilerplate instances
    this.reduxBoilerplate = new ReduxBoilerplate();
    this.apiBoilerplate = new APIBoilerplate();
    this.authBoilerplate = new AuthBoilerplate();
    this.formBoilerplate = new FormBoilerplate();
    this.reactNativeNavigationBoilerplate = new ReactNativeNavigationBoilerplate();

    // Map template types to their respective generators
    this.templates = {
      redux: this.reduxBoilerplate.generateReduxBoilerplate.bind(this.reduxBoilerplate),
      api: this.apiBoilerplate.generateAPIBoilerplate.bind(this.apiBoilerplate),
      auth: this.authBoilerplate.generateAuthBoilerplate.bind(this.authBoilerplate),
      form: this.formBoilerplate.generateFormBoilerplate.bind(this.formBoilerplate),
      'react-native': this.generateReactNativeBoilerplate.bind(this),
      'react-native-navigation': this.reactNativeNavigationBoilerplate.generateNavigationBoilerplate.bind(this.reactNativeNavigationBoilerplate),
      // TODO: Add other boilerplate types as they are implemented
      // crud: this.crudBoilerplate.generateCRUDBoilerplate.bind(this.crudBoilerplate),
      // hooks: this.hooksBoilerplate.generateHooksBoilerplate.bind(this.hooksBoilerplate),
      // context: this.contextBoilerplate.generateContextBoilerplate.bind(this.contextBoilerplate),
      // middleware: this.middlewareBoilerplate.generateMiddlewareBoilerplate.bind(this.middlewareBoilerplate),
      // components: this.componentBoilerplate.generateComponentBoilerplate.bind(this.componentBoilerplate),
      // utils: this.utilsBoilerplate.generateUtilsBoilerplate.bind(this.utilsBoilerplate)
    };
  }

  // Generate all React Native boilerplates
  generateReactNativeBoilerplate(projectPath, options) {
    console.log(`${colors.blue}Generating React Native boilerplate...${colors.reset}`);

    const allDependencies = [];
    const allInstructions = [];
    const allFiles = [];

    // Generate Redux boilerplate
    console.log(`${colors.cyan}Adding Redux boilerplate...${colors.reset}`);
    const reduxResult = this.reduxBoilerplate.generateReduxBoilerplate(projectPath, options);
    allDependencies.push(...(reduxResult.dependencies || []));
    allInstructions.push(...(reduxResult.instructions || []));
    allFiles.push(...(reduxResult.files || []));

    // Add React Native specific dependencies
    const reactNativeDeps = [
      '@react-navigation/native',
      '@react-navigation/stack',
      '@react-navigation/bottom-tabs',
      'react-native-vector-icons',
      'react-native-gesture-handler',
      'react-native-safe-area-context',
      'react-native-screens',
      '@react-native-async-storage/async-storage'
    ];
    allDependencies.push(...reactNativeDeps);

    // Add React Native specific instructions
    const reactNativeInstructions = [
      'Install React Native dependencies: npm install ' + reactNativeDeps.join(' '),
      'Link vector icons: npx react-native link react-native-vector-icons',
      'For iOS: cd ios && pod install',
      'Configure navigation in App.js',
      'Add vector icons to android/app/build.gradle'
    ];
    allInstructions.push(...reactNativeInstructions);

    return {
      dependencies: [...new Set(allDependencies)], // Remove duplicates
      instructions: allInstructions,
      files: allFiles
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
    process.stdout.write('\n');

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
    setImmediate(async () => {
      try {
        await askToInstall(result.dependencies)
      } catch (e) {
        console.log(`  ${colors.red}• error while installing dependencies ${colors.reset}`);
      }
    })
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
    console.log(`  boiler-generate ./src react-native`);
    console.log(`  boiler-generate ./src react-native-navigation`);
    console.log(`  boiler-generate ./utils hooks\n`);
    this.showAvailableTemplates();
  }

  showAvailableTemplates() {
    console.log(`${colors.bold}Available Templates:${colors.reset}`);
    console.log(`  ${colors.green}redux${colors.reset}        - Redux store setup with slices, actions, selectors`);
    console.log(`  ${colors.green}api${colors.reset}          - API service layer with hooks and types`);
    console.log(`  ${colors.green}auth${colors.reset}         - Authentication system with context`);
    console.log(`  ${colors.green}form${colors.reset}         - Form components with validation`);
    console.log(`  ${colors.green}react-native${colors.reset} - Complete React Native setup (Redux + API + Auth + Form)`);
    console.log(`  ${colors.green}react-native-navigation${colors.reset} - React Native Navigation boilerplate (Stack, Tab, Drawer, Auth)`);
    console.log(`  ${colors.yellow}crud${colors.reset}         - Complete CRUD operations (coming soon)`);
    console.log(`  ${colors.yellow}hooks${colors.reset}        - Collection of custom React hooks (coming soon)`);
    console.log(`  ${colors.yellow}context${colors.reset}     - React Context setup (coming soon)`);
    console.log(`  ${colors.yellow}middleware${colors.reset}  - Express middleware collection (coming soon)`);
    console.log(`  ${colors.yellow}components${colors.reset}  - Reusable component template (coming soon)`);
    console.log(`  ${colors.yellow}utils${colors.reset}       - Utility functions collection (coming soon)`);
  }
}

// Run the CLI
if (require.main === module) {
  const generator = new BoilerplateGenerator();
  generator.run();
}

module.exports = BoilerplateGenerator;