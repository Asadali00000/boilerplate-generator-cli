#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const colors = require('./utils/colors');
const { copyBoilerplateFolder } = require('./utils/fileUtils');

// Import boilerplate modules
const ReduxBoilerplate = require('./boilerplates/redux/redux');
const APIBoilerplate = require('./boilerplates/api/api');
const AuthBoilerplate = require('./boilerplates/auth/auth');
const FormBoilerplate = require('./boilerplates/form/form');
const MiddleWareBoilerplate = require('./boilerplatesExpress/middleware/middleware');
const askToInstall = require('./utils/installPackages');

// React Native boilerplate modules
const ReactNativeNavigationBoilerplate = require('./boilerplatesReactNative/navigation/navigation');
const ReactNativeAssetsBoilerplate = require('./boilerplatesReactNative/assets/assets')
const ReactNativeServicesBoilerplate = require('./boilerplatesReactNative/services/services')
const ReactNativeReduxBoilerplate = require('./boilerplatesReactNative/redux/redux')


class BoilerplateGenerator {
  constructor() {
    // Initialize boilerplate instances
    this.reduxBoilerplate = new ReduxBoilerplate();
    this.apiBoilerplate = new APIBoilerplate();
    this.authBoilerplate = new AuthBoilerplate();
    this.formBoilerplate = new FormBoilerplate();
    this.middlewareBoilerplate = new MiddleWareBoilerplate();

    // React Native boilerplate modules
    this.reactNativeNavigationBoilerplate = new ReactNativeNavigationBoilerplate();
    this.reactNativeAssetsBoilerplate = new ReactNativeAssetsBoilerplate();
    this.reactNativeServicesBoilerplate = new ReactNativeServicesBoilerplate();
    this.reactNativeReduxBoilerplate = new ReactNativeReduxBoilerplate();

    // Map template types to their respective generators
    this.templates = {
			// this is for web
      redux: this.reduxBoilerplate.generateReduxBoilerplate.bind(this.reduxBoilerplate),
      api: this.apiBoilerplate.generateAPIBoilerplate.bind(this.apiBoilerplate),
      auth: this.authBoilerplate.generateAuthBoilerplate.bind(this.authBoilerplate),
      form: this.formBoilerplate.generateFormBoilerplate.bind(this.formBoilerplate),
      middleware: this.middlewareBoilerplate.generateMiddleWareBoilerplate.bind(this.middlewareBoilerplate),

  // this is for exress
   	'express': this.generateExpressBoilerplate.bind(this),
  // this is for android
      'react-native': this.generateReactNativeBoilerplate.bind(this),
      'react-native-navigation': this.reactNativeNavigationBoilerplate.generateNavigationBoilerplate.bind(this.reactNativeNavigationBoilerplate),
      'react-native-assets': this.reactNativeAssetsBoilerplate.generateAssetsBoilerplate.bind(this.reactNativeAssetsBoilerplate),
      'react-native-services': this.reactNativeServicesBoilerplate.generateServicesBoilerplate.bind(this.reactNativeServicesBoilerplate),
      'react-native-redux': this.reactNativeReduxBoilerplate.generateReduxBoilerplate.bind(this.reactNativeReduxBoilerplate),

      // TODO: Add other boilerplate types as they are implemented
      // crud: this.crudBoilerplate.generateCRUDBoilerplate.bind(this.crudBoilerplate),
      // hooks: this.hooksBoilerplate.generateHooksBoilerplate.bind(this.hooksBoilerplate),
      // context: this.contextBoilerplate.generateContextBoilerplate.bind(this.contextBoilerplate),
      // middleware: this.middlewareBoilerplate.generateMiddlewareBoilerplate.bind(this.middlewareBoilerplate),
      // components: this.componentBoilerplate.generateComponentBoilerplate.bind(this.componentBoilerplate),
      // utils: this.utilsBoilerplate.generateUtilsBoilerplate.bind(this.utilsBoilerplate)
    };
  }

  // Generate all Express boilerplates
  async generateExpressBoilerplate(projectPath, options) {
    console.log(`${colors.blue}Generating Express boilerplate...${colors.reset}`);

    // Path to the boilerplatesExpress folder
    const templateDir = path.join(__dirname, 'boilerplatesExpress');
    await copyBoilerplateFolder(templateDir, projectPath, ['middleware.js']);

    // Collect dependencies from all sub-generators using static methods
		const expressDeps = [
			'express',
			'cors',
			'dotenv',
			'nodemon'
		]
    const middlewareDeps = MiddleWareBoilerplate.getDependencies();


    // Combine and deduplicate all dependencies
    const allDeps = Array.from(new Set([
...middlewareDeps,
...expressDeps
    ]));

    // Add React Native specific instructions
    const expressInstructions = [
      'Install Express dependencies: npm install ' + allDeps.join(' '),
      'Run the server: npm run dev',
      'Access the API at http://localhost:3000'
    ];

    // List all files copied (for display)
    const fs = require('fs');
    const walkSync = (dir, filelist = [], baseDir = dir) => {
      fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
          walkSync(fullPath, filelist, baseDir);
        } else {
          filelist.push(path.relative(baseDir, fullPath));
        }
      });
      return filelist;
    };
    const allFiles = walkSync(templateDir);
    console.log(allFiles)
    return {
      dependencies: allDeps,
      instructions: expressInstructions,
      files: allFiles
    };
  }

  // Main CLI handler
  async run() {
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
      await this.addBoilerplateToProject(targetPath, templateType, options);
    } catch (error) {
      console.log(`${colors.red}Error: ${error.message}${colors.reset}`);
    }
  }
  async generateReactNativeBoilerplate(projectPath, options) {
    console.log(`${colors.blue}Generating React Native boilerplate...${colors.reset}`);

    // Path to the boilerplatesReactNative folder
    const templateDir = path.join(__dirname, 'boilerplatesReactNative');
    await copyBoilerplateFolder(templateDir, projectPath, ['assets.js','services.js','navigation.js','redux.js']);

    // Collect dependencies from all sub-generators using static methods
    const reactNativeDeps = [
      'react-native-vector-icons',
      '@react-native-async-storage/async-storage'
    ];
    const navigationDeps = ReactNativeNavigationBoilerplate.getDependencies();
    const assetsDeps = ReactNativeAssetsBoilerplate.getDependencies();
    const servicesDeps = ReactNativeServicesBoilerplate.getDependencies();
    const reduxDeps = ReactNativeReduxBoilerplate.getDependencies();

    // Combine and deduplicate all dependencies
    const allDeps = Array.from(new Set([
      ...reactNativeDeps,
      ...navigationDeps,
      ...assetsDeps,
      ...servicesDeps,
      ...reduxDeps
    ]));

    // Add React Native specific instructions
    const reactNativeInstructions = [
      'Install React Native dependencies: npm install ' + allDeps.join(' '),
      'Link vector icons: npx react-native link react-native-vector-icons',
      'For iOS: cd ios && pod install',
      'Configure navigation in App.js',
      'Add vector icons to android/app/build.gradle'
    ];

    // List all files copied (for display)
    const fs = require('fs');
    const walkSync = (dir, filelist = [], baseDir = dir) => {
      fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
          walkSync(fullPath, filelist, baseDir);
        } else {
          filelist.push(path.relative(baseDir, fullPath));
        }
      });
      return filelist;
    };
    const allFiles = walkSync(templateDir);
    console.log(allFiles)
    return {
      dependencies: allDeps,
      instructions: reactNativeInstructions,
      files: allFiles
    };
  }

  // Main CLI handler
  async run() {
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
      await this.addBoilerplateToProject(targetPath, templateType, options);
    } catch (error) {
      console.log(`${colors.red}Error: ${error.message}${colors.reset}`);
    }
  }

  // Add boilerplate to existing project
  async addBoilerplateToProject(targetPath, templateType, options) {
    const fullPath = path.resolve(targetPath);
    console.log(targetPath, fullPath);

    // Check if target path exists, if not create it
    if (!fs.existsSync(fullPath)) {
      console.log(`${colors.yellow}Creating directory: ${fullPath}${colors.reset}`);
      fs.mkdirSync(fullPath, { recursive: true });
    }

    console.log(`${colors.blue}Adding ${templateType} boilerplate to: ${fullPath}${colors.reset}`);

    // Generate template-specific files (support async)
    let result = this.templates[templateType](fullPath, options);
    if (result instanceof Promise) {
      result = await result;
    }

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
    console.log(`  npx my-boilerplate-generator <path> <template> [options]\n`);
    console.log(`${colors.bold}Examples:${colors.reset}`);
    console.log(`  npx my-boilerplate-generator ./src redux user`);
    console.log(`  npx my-boilerplate-generator ./components form contact`);
    console.log(`  npx my-boilerplate-generator ./api api products`);
    console.log(`  npx my-boilerplate-generator ./src auth`);
    console.log(`  npx my-boilerplate-generator ./src react-native`);
    console.log(`  npx my-boilerplate-generator ./src react-native-navigation`);
    console.log(`  npx my-boilerplate-generator ./utils hooks\n`);
    this.showAvailableTemplates();
  }

  showAvailableTemplates() {
    console.log(`${colors.bold}Available Templates:${colors.reset}`);
    console.log(`  ${colors.green}redux${colors.reset}        - Redux store setup with slices, actions, selectors`);
    console.log(`  ${colors.green}api${colors.reset}          - API service layer with hooks and types`);
    console.log(`  ${colors.green}auth${colors.reset}         - Authentication system with context`);
    console.log(`  ${colors.green}form${colors.reset}         - Form components with validation`);
    console.log(`  ${colors.green}react-native${colors.reset} - Complete React Native setup (Redux + API + Auth + Form)`);
    console.log(`  ${colors.green}react-native-assets${colors.reset} - React native assets folder with basic subfolder (fonts, images, icons)`);
    console.log(`  ${colors.green}react-native-navigation${colors.reset} - React Native Navigation boilerplate (Stack, Tab, Drawer, Auth)`);
    console.log(`  ${colors.green}react-native-redux${colors.reset} - React Native Redux boilerplate (Persist store with asyncstorage , Root reducer to combile all reducers , Slice  with asyncthunk , Normal store)`);
    console.log(`  ${colors.green}react-native-services${colors.reset} - React Native Services boilerplate (Axios/api.js with api call , Storage filder for multiple storage services (keychain , asyncstorage))`);
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
  (async () => {
    await generator.run();
  })();
}

module.exports = BoilerplateGenerator;
