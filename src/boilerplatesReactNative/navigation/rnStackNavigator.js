const path = require('path');
const { createFile } = require('../../utils/fileUtils');

class ReactNativeStackNavigatorBoilerplate {
	static getDependencies() {
		return [
			'@react-navigation/native',
			'@react-navigation/stack',
			'react-native-gesture-handler',
			'react-native-safe-area-context',
			'react-native-screens',
		];
	}

	async generateStackNavigatorBoilerplate(projectPath, options = {}) {
		const navigationFolder = path.join(projectPath, 'navigation');
		
		// Create StackNavigator.js
		const stackNavigatorContent = `import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
// import your screens here

const Stack = createStackNavigator();

export default function StackNavigator() {
  return (
    <Stack.Navigator>
      {/* <Stack.Screen name="Home" component={HomeScreen} /> */}
      {/* <Stack.Screen name="Details" component={DetailsScreen} /> */}
    </Stack.Navigator>
  );
}
`;

		// Create index.js if it doesn't exist
		const indexContent = `// Export all navigators from here
export { default as StackNavigator } from './StackNavigator';
`;

		await createFile(path.join(navigationFolder, 'StackNavigator.js'), stackNavigatorContent);
		await createFile(path.join(navigationFolder, 'index.js'), indexContent);

		return {
			dependencies: ReactNativeStackNavigatorBoilerplate.getDependencies(),
			instructions: [
				'Stack Navigator',
				'Install dependencies above using npm or yarn.',
				'Import in your app: import { StackNavigator } from "./src/navigation";',
				'Add your actual screens/components and update navigator accordingly.',
			],
			files: ['navigation/StackNavigator.js', 'navigation/index.js'],
		};
	}
}

module.exports = ReactNativeStackNavigatorBoilerplate;
