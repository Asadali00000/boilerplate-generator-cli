const path = require('path');
const { copyBoilerplateFolder, walkSync } = require('../../utils/fileUtils');

class ReactNativeServicesBoilerplate {
    static getDependencies() {
        return [
            "axios",
            "react-native-config",
            "react-native-keychain",
        ];
    }

    async generateServicesBoilerplate(projectPath, options = {}) {
        const templateDir = __dirname;
        await copyBoilerplateFolder(templateDir, path.join(projectPath, 'services'), ['services.js']);

        // List all files copied (for display)
        const allFiles = walkSync(templateDir).filter(f => f !== 'services.js');

        return {
            dependencies: ReactNativeServicesBoilerplate.getDependencies(),
            instructions: [
                `react-native-config`,
                'Create a new file .env in the root of your React Native app:',
                'In .env (project root), use: API_URL=https://myapi.com',
                `Extra step for Android \nYou'll also need to manually apply a plugin to your app, from android/app/build.gradle:`,
                `apply from: project(':react-native-config').projectDir.getPath() + "/dotenv.gradle"`,
            ],
            files: allFiles,
        };
    }
}

module.exports = ReactNativeServicesBoilerplate;
