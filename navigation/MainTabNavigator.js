import React from "react";
import { Platform } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";
import { Icon } from "react-native-elements";

import TabBarIcon from "../components/TabBarIcon";
import ProgressScreen from "../screens/ProgressScreen";
// import LinksScreen from '../screens/LinksScreen';
import ProfileScreen from "../screens/profile";
import DailyLog from "../screens/DailyLog";
import FoodSearch from "../screens/FoodSearch";
import FoodSearchItem from "../screens/FoodSearchItem";
import Meals from "../screens/Meals";
import CameraInterface from "../screens/CameraInterface";
import RecommendedMeals from "../screens/RecommendedMeals";
import RecommendedFoods from "../screens/RecommendedFoods";
import Exercise from "../screens/exercise";
import SingleExercise from "../screens/singleExercise";
import QuickAddFood from "../screens/QuickAddFood";

const config = Platform.select({
  web: { headerMode: "screen" },
  default: {}
});

const Progress = createStackNavigator(
  {
    Home: ProgressScreen
  },

  config
);

Progress.navigationOptions = {
  tabBarLabel: "Progress",
  tabBarIcon: ({ focused }) => (
    <Icon name="chart-areaspline" type="material-community" color="#517fa4" />
  )
};

Progress.path = "";

const MealsStack = createStackNavigator(
  {
    Meals: Meals,
    RecommendedMeals: RecommendedMeals,
    RecommendedFoods: RecommendedFoods
  },
  config
);

MealsStack.navigationOptions = {
  tabBarLabel: "Meals",
  tabBarIcon: ({ focused }) => (
    <Icon name="hamburger" type="material-community" color="#517fa4" />

  )
};

MealsStack.path = "";

const Profile = createStackNavigator(
  {
    Profile: ProfileScreen
  },
  config
);

Profile.navigationOptions = {
  tabBarLabel: "Profile",
  tabBarIcon: ({ focused }) => (


    <Icon name="account" type="material-community" color="#517fa4" />
  )
};

Profile.path = "";

const DailyLogStack = createStackNavigator(
  {
    DailyLog: DailyLog,
    FoodSearch: FoodSearch,
    CameraInterface: CameraInterface,
    QuickAddFood: QuickAddFood,
    Exercise: Exercise,
    SingleExercise: SingleExercise,
    FoodSearchItem: FoodSearchItem
  },
  config
);

DailyLogStack.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index];
  let navigationOptions = {
    tabBarLabel: "Daily Log",
    tabBarIcon: ({ focused }) => (
      <Icon name="calendar" type="material-community" color="#517fa4" />

    )
  };

  if (routeName === "CameraInterface" || routeName === "QuickAddFood") {
    navigationOptions.tabBarVisible = false;
  }
  return navigationOptions;
};

DailyLogStack.path = "";

const tabNavigator = createBottomTabNavigator({
  Progress,
  DailyLogStack,
  MealsStack,
  Profile
});

tabNavigator.path = "";

export default tabNavigator;
