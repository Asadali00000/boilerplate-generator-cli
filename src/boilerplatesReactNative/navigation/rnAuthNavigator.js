const path = require('path');
const { createFile } = require('../../utils/fileUtils');

class ReactNativeAuthNavigatorBoilerplate {
	static getDependencies() {
		return [
			'@react-navigation/native',
			'@react-navigation/stack',
			'react-native-gesture-handler',
			'react-native-safe-area-context',
			'react-native-screens',
		];
	}

	async generateAuthNavigatorBoilerplate(projectPath, options = {}) {
		const navigationFolder = path.join(projectPath, 'navigation');
		
		// Create AuthNavigator.js
		const authNavigatorContent = `import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
// import your screens here

const Stack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator>
      {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
      {/* <Stack.Screen name="Register" component={RegisterScreen} /> */}
      {/* <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} /> */}
    </Stack.Navigator>
  );
}
`;

		// Create index.js if it doesn't exist
		const indexContent = `// Export all navigators from here
export { default as AuthNavigator } from './AuthNavigator';
`;

		await createFile(path.join(navigationFolder, 'AuthNavigator.js'), authNavigatorContent);
		await createFile(path.join(navigationFolder, 'index.js'), indexContent);

		return {
			dependencies: ReactNativeAuthNavigatorBoilerplate.getDependencies(),
			instructions: [
				'Auth Navigator',
				'Install dependencies above using npm or yarn.',
				'Import in your app: import { AuthNavigator } from "./src/navigation";',
				'Add your actual authentication screens and update navigator accordingly.',
			],
			files: ['navigation/AuthNavigator.js', 'navigation/index.js'],
		};
	}
}

module.exports = ReactNativeAuthNavigatorBoilerplate;
