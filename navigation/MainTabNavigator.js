import React from 'react';
import { Platform } from 'react-native';
import {
  createStackNavigator,
  createBottomTabNavigator,
} from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import ProgressScreen from '../screens/ProgressScreen';
// import LinksScreen from '../screens/LinksScreen';
import ProfileScreen from '../screens/profile';
import DailyLog from '../screens/DailyLog';
import FoodSearch from '../screens/FoodSearch';
import FoodSearchItem from '../screens/FoodSearchItem';
import Meals from '../screens/Meals';
import CameraInterface from '../screens/CameraInterface'
import RecommendedMeals from '../screens/RecommendedMeals';
import RecommendedFoods from '../screens/RecommendedFoods';
import Exercise from '../screens/exercise'
import SingleExercise from '../screens/singleExercise'


const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const Progress = createStackNavigator(
  {
    Home: ProgressScreen,
  },

  config
);

Progress.navigationOptions = {
  tabBarLabel: 'Progress',
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

Progress.path = '';

const MealsStack = createStackNavigator(
  {
    Meals: Meals,
    RecommendedMeals: RecommendedMeals,
    RecommendedFoods: RecommendedFoods,
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

const Profile = createStackNavigator(
  {
    Profile: ProfileScreen,
  },
  config
);

Profile.navigationOptions = {
  tabBarLabel: 'Profile',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};

Profile.path = '';

const DailyLogStack = createStackNavigator(
  {
    DailyLog: DailyLog,
    FoodSearch: FoodSearch,
    CameraInterface: CameraInterface,
    Exercise: Exercise,
    SingleExercise: SingleExercise,
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
  Progress,
  DailyLogStack,
  MealsStack,
  Profile,
});

tabNavigator.path = '';

export default tabNavigator;
