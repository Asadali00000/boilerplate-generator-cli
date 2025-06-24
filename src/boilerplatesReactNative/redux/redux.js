const path = require('path');
const { copyBoilerplateFolder, walkSync } = require('../../utils/fileUtils');

class ReactNativeReduxBoilerplate {
    static getDependencies() {
        return [
            "react-redux",
            "@reduxjs/toolkit",
            "redux-persist",
            '@react-native-async-storage/async-storage',
        ];
    }

    async generateReduxBoilerplate(projectPath, options = {}) {
        const templateDir = __dirname;
        await copyBoilerplateFolder(templateDir, path.join(projectPath, 'redux'), ['redux.js']);

        // List all files copied (for display)
        const allFiles = walkSync(templateDir).filter(f => f !== 'redux.js');

        return {
            dependencies: ReactNativeReduxBoilerplate.getDependencies(),
            instructions: [
                'Redux Store Setup:',
                'For normal Redux store: Import and use redux/store.js',
                'For persistent Redux store: Import and use redux/persist/store.js',
            ],
            files: allFiles,
        };
    }
}

module.exports = ReactNativeReduxBoilerplate;
