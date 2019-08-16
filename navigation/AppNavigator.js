import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
// import AuthHomeScreen from '../screens/AuthHomeScreen';
// import UserJoinScreen from '../screens/UserJoinScreen';
import AuthNavigator from './AuthNavigator';

export default createAppContainer(
  createSwitchNavigator(
    {
      // You could add another route here for authentication.
      // Read more at https://reactnavigation.org/docs/en/auth-flow.html
      Auth: AuthNavigator,
      // Auth: AuthHomeScreen,
      // UserJoinScreen: UserJoinScreen,
      Main: MainTabNavigator,
    },
    {
      initialRouteName: 'Auth',
    }
  )
);
