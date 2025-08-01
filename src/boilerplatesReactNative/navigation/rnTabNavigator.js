const path = require('path');
const { createFile } = require('../../utils/fileUtils');

class ReactNativeTabNavigatorBoilerplate {
	static getDependencies() {
		return [
			'@react-navigation/native',
			'@react-navigation/bottom-tabs',
			'react-native-gesture-handler',
			'react-native-safe-area-context',
			'react-native-screens',
		];
	}

	async generateTabNavigatorBoilerplate(projectPath, options = {}) {
		const navigationFolder = path.join(projectPath, 'navigation');
		
		// Create TabNavigator.js
		const tabNavigatorContent = `import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import your screens here

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator>
      {/* <Tab.Screen name="Home" component={HomeScreen} /> */}
      {/* <Tab.Screen name="Profile" component={ProfileScreen} /> */}
      {/* <Tab.Screen name="Settings" component={SettingsScreen} /> */}
    </Tab.Navigator>
  );
}
`;

		// Create index.js if it doesn't exist
		const indexContent = `// Export all navigators from here
export { default as TabNavigator } from './TabNavigator';
`;

		await createFile(path.join(navigationFolder, 'TabNavigator.js'), tabNavigatorContent);
		await createFile(path.join(navigationFolder, 'index.js'), indexContent);

		return {
			dependencies: ReactNativeTabNavigatorBoilerplate.getDependencies(),
			instructions: [
				'Tab Navigator',
				'Install dependencies above using npm or yarn.',
				'Import in your app: import { TabNavigator } from "./src/navigation";',
				'Add your actual screens/components and update navigator accordingly.',
			],
			files: ['navigation/TabNavigator.js', 'navigation/index.js'],
		};
	}
}

module.exports = ReactNativeTabNavigatorBoilerplate;
