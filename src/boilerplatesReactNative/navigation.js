const { createFileStructure } = require('../utils/fileUtils');

class ReactNativeNavigationBoilerplate {
	generateNavigationBoilerplate(projectPath, options = {}) {
		const structure = {
			// Navigation files only, no screens!
			'navigation/AppNavigator.js': this.getAppNavigator(),
			'navigation/AuthNavigator.js': this.getAuthNavigator(),
			'navigation/TabNavigator.js': this.getTabNavigator(),
			'navigation/DrawerNavigator.js': this.getDrawerNavigator(),
			'navigation/navigationTypes.js': this.getNavigationTypes(),
			'navigation/index.js': this.getNavigationIndex(),
		};

		createFileStructure(projectPath, structure);

		return {
			dependencies: [
				'@react-navigation/native',
				'@react-navigation/stack',
				'@react-navigation/bottom-tabs',
				'@react-navigation/drawer',
				'react-native-gesture-handler',
				'react-native-safe-area-context',
				'react-native-screens',

			],
			instructions: [
				`Navigation`,
				'Install dependencies above using npm or yarn.',
				'In App.js (project root), use: import { AppNavigator } from "./src/reactnativeboilerplate/navigation";',
				'Add your actual screens/components and update navigators accordingly.',
			],
			files: Object.keys(structure),
		};
	}

	getAppNavigator() {
		return `import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import DrawerNavigator from './DrawerNavigator';

export default function AppNavigator() {
  const isAuthenticated = false; // TODO: Replace with your auth logic

  return (
    <NavigationContainer>
      {isAuthenticated ? <DrawerNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
`;
	}

	getAuthNavigator() {
		return `import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
// import your screens here

const Stack = createStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator>
      {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
      {/* <Stack.Screen name="Register" component={RegisterScreen} /> */}
    </Stack.Navigator>
  );
}
`;
	}

	getTabNavigator() {
		return `import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import your screens here

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator>
      {/* <Tab.Screen name="Home" component={HomeScreen} /> */}
      {/* <Tab.Screen name="Profile" component={ProfileScreen} /> */}
    </Tab.Navigator>
  );
}
`;
	}

	getDrawerNavigator() {
		return `import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
// import your screens or navigators here

const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator>
      {/* <Drawer.Screen name="Main" component={TabNavigator} /> */}
      {/* <Drawer.Screen name="Settings" component={SettingsScreen} /> */}
    </Drawer.Navigator>
  );
}
`;
	}

	getNavigationTypes() {
		return `// Define your navigation types here (if you use TypeScript, rename this file to navigationTypes.ts)
export const NAVIGATION_ROUTES = {
  // HOME: 'Home',
  // PROFILE: 'Profile',
  // SETTINGS: 'Settings',
  // LOGIN: 'Login',
  // REGISTER: 'Register',
};
`;
	}

	getNavigationIndex() {
		return `// Export all navigators from here
export { default as AppNavigator } from './AppNavigator';
export { default as AuthNavigator } from './AuthNavigator';
export { default as TabNavigator } from './TabNavigator';
export { default as DrawerNavigator } from './DrawerNavigator';
`;
	}
}

module.exports = ReactNativeNavigationBoilerplate;
