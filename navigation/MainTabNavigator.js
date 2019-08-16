import React from 'react';
import { Platform } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
// import LinksScreen from '../screens/LinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import DailyLog from '../screens/DailyLog';
import FoodSearch from '../screens/FoodSearch';
import FoodSearchItem from '../screens/FoodSearchItem';
import Meals from '../screens/Meals';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen,
  },
  config
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

HomeStack.path = '';

const MealsStack = createStackNavigator(
  {
    Meals: Meals,
  },
  config
);

MealsStack.navigationOptions = {
  tabBarLabel: 'Meals',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'}
    />
  ),
};

MealsStack.path = '';

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};

SettingsStack.path = '';

const DailyLogStack = createStackNavigator(
  {
    DailyLog: DailyLog,
    FoodSearch: FoodSearch,
    FoodSearchItem: FoodSearchItem,
  },
  config
);

DailyLogStack.navigationOptions = {
  tabBarLabel: 'Daily Log',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};

DailyLogStack.path = '';

const tabNavigator = createBottomTabNavigator({
  HomeStack,
  MealsStack,
  DailyLogStack,
  SettingsStack,
});

tabNavigator.path = '';

export default tabNavigator;
