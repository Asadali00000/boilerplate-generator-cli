import React from 'react';
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
