import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  AsyncStorage,
  ImageBackground,
} from 'react-native';
import { Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { getUserThunk } from '../components/store/user';

class ExistingUsersScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.retrieveData = this.retrieveData.bind(this);
  }

  componentDidMount() {
    this.retrieveData();
  }

  async handleSubmit() {
    await this.props.getUser(this.state.email);
    this.props.navigation.navigate('Main');
  }

  retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem('user');
      if (value !== null) {
        this.props.navigation.navigate('Main');
      }
    } catch (err) {
      console.error(err);
    }
  };

  render() {
    return (
      <ImageBackground
        style={styles.backgroundImage}
        source={require('../assets/images/balancedDiet.jpeg')}
        blurRadius={1}
      >
        <View style={styles.inputFields}>
          <Input onChangeText={text => this.setState({ email: text })} />
          <Text style={styles.formLabelText}>Email</Text>
        </View>
        <View style={styles.inputFields}>
          <Input onChangeText={text => this.setState({ password: text })} />
          <Text style={styles.formLabelText}>Password</Text>
        </View>
        <TouchableOpacity onPress={() => this.handleSubmit()}>
          <View style={styles.joinSignIn}>
            <Text style={styles.buttonText}>Sign In </Text>
          </View>
        </TouchableOpacity>
      </ImageBackground>
    );
  }
}

ExistingUsersScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  joinSignIn: {
    alignItems: 'center',
    backgroundColor: 'rgb(200,200,200)',
    borderRadius: 205,
    margin: 30,
  },
  buttonText: {
    fontSize: 25,
    color: '#2e78b7',
    margin: 20,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
});

const mapDispatch = dispatch => {
  return {
    getUser: () => dispatch(getUserThunk()),
  };
};

export default connect(
  null,
  mapDispatch
)(ExistingUsersScreen);
