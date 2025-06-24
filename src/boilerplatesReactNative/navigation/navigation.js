const path = require('path');
const { copyBoilerplateFolder, walkSync } = require('../../utils/fileUtils');

class ReactNativeNavigationBoilerplate {
	static getDependencies() {
		return [
			'@react-navigation/native',
			'@react-navigation/stack',
			'@react-navigation/bottom-tabs',
			'@react-navigation/drawer',
			'react-native-gesture-handler',
			'react-native-safe-area-context',
			'react-native-screens',
		];
	}

	async generateNavigationBoilerplate(projectPath, options = {}) {
		const templateDir = __dirname;
		await copyBoilerplateFolder(templateDir, path.join(projectPath, 'navigation'), ['navigation.js']);

		// List all files copied (for display)
		const allFiles = walkSync(templateDir).filter(f => f !== 'navigation.js');

		return {
			dependencies: ReactNativeNavigationBoilerplate.getDependencies(),
			instructions: [
				`Navigation`,
				'Install dependencies above using npm or yarn.',
				'In App.js (project root), use: import { AppNavigator } from "./src/reactnativeboilerplate/navigation";',
				'Add your actual screens/components and update navigators accordingly.',
			],
			files: allFiles,
		};
	}
}

module.exports = ReactNativeNavigationBoilerplate;
