import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  AsyncStorage,
} from 'react-native';

import { connect } from 'react-redux';
import { getUserThunk } from '../components/store/user';

class ProgressScreen extends React.Component {
  constructor() {
    super();

    this.storeData = this.storeData.bind(this);
  }

  componentDidMount() {
    this.storeData();
  }

  storeData = async () => {
    try {
      if (this.props.user.email) {
        await AsyncStorage.setItem('user', this.props.user.email);
      }
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    return <View />;
  }
}

function DevelopmentModeNotice() {
  if (__DEV__) {
    const learnMoreButton = (
      <Text onPress={handleLearnMorePress} style={styles.helpLinkText}>
        Learn more
      </Text>
    );

    return (
      <Text style={styles.developmentModeText}>
        Development mode is enabled: your app will be slower but you can use
        useful development tools. {learnMoreButton}
      </Text>
    );
  } else {
    return (
      <Text style={styles.developmentModeText}>
        You are not in development mode: your app will run at full speed.
      </Text>
    );
  }
}

function handleLearnMorePress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/workflow/development-mode/'
  );
}

function handleHelpPress() {
  WebBrowser.openBrowserAsync(
    'https://docs.expo.io/versions/latest/workflow/up-and-running/#cant-see-your-changes'
  );
}

const styles = StyleSheet.create({
  //
});

ProgressScreen.navigationOptions = {
  headerTitle: 'Progress',
  headerStyle: {
    backgroundColor: 'crimson',
  },
  headerTintColor: 'white',
};

const mapState = state => {
  return {
    user: state.user,
  };
};

const mapDispatch = dispatch => {
  return {
    getUser: () => dispatch(getUserThunk()),
  };
};

export default connect(
  mapState,
  mapDispatch
)(ProgressScreen);
