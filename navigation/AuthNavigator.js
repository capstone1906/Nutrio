import { createStackNavigator } from 'react-navigation';

import AuthHomeScreen from '../screens/AuthHomeScreen';
import UserJoinScreen from '../screens/UserJoinScreen';
import ExistingUserScreen from '../screens/ExistingUsersScreen';

const AuthStack = createStackNavigator({
  LoginHome: {
    screen: AuthHomeScreen,
  },
  UserJoin: {
    screen: UserJoinScreen,
  },
  ExistingUser: {
    screen: ExistingUserScreen,
  },
});

export default AuthStack;
