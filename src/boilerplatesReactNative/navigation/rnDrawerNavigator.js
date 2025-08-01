const path = require('path');
const { createFile } = require('../../utils/fileUtils');

class ReactNativeDrawerNavigatorBoilerplate {
	static getDependencies() {
		return [
			'@react-navigation/native',
			'@react-navigation/drawer',
			'react-native-gesture-handler',
			'react-native-safe-area-context',
			'react-native-screens',
		];
	}

	async generateDrawerNavigatorBoilerplate(projectPath, options = {}) {
		const navigationFolder = path.join(projectPath, 'navigation');
		
		// Create DrawerNavigator.js
		const drawerNavigatorContent = `import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
// import your screens or navigators here

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      {/* <Drawer.Screen name="Home" component={HomeScreen} /> */}
      {/* <Drawer.Screen name="Profile" component={ProfileScreen} /> */}
      {/* <Drawer.Screen name="Settings" component={SettingsScreen} /> */}
    </Drawer.Navigator>
  );
}
`;

		// Create index.js if it doesn't exist
		const indexContent = `// Export all navigators from here
export { default as DrawerNavigator } from './DrawerNavigator';
`;

		await createFile(path.join(navigationFolder, 'DrawerNavigator.js'), drawerNavigatorContent);
		await createFile(path.join(navigationFolder, 'index.js'), indexContent);

		return {
			dependencies: ReactNativeDrawerNavigatorBoilerplate.getDependencies(),
			instructions: [
				'Drawer Navigator',
				'Install dependencies above using npm or yarn.',
				'Import in your app: import { DrawerNavigator } from "./src/navigation";',
				'Add your actual screens/components and update navigator accordingly.',
			],
			files: ['navigation/DrawerNavigator.js', 'navigation/index.js'],
		};
	}
}

module.exports = ReactNativeDrawerNavigatorBoilerplate;
