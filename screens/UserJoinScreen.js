import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Picker,
  ImageBackground,
} from 'react-native';
import { Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { addUserThunk } from '../components/store/user';
import SelectInput from 'react-native-select-input-ios';

class UserJoinScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      age: '',
      height: '',
      weight: '',
      activityLevel: 1.2,
      bodyType: 'Ectomorph',
      goal: 'maintain',
    };
    this.bodyTypeOptions = [
      { value: 'Ectomorph', label: 'Ectomorph' },
      { value: 'Mesomorph', label: 'Mesomorph' },
      { value: 'Endomorph', label: 'Endomorph' },
    ];

    this.goalOptions = [
      { value: 'maintain', label: 'Maintain Weight' },
      { value: 'downHalf', label: 'Lose half a pound per week' },
      { value: 'downOne', label: 'Lose 1 pound per week' },
      { value: 'upOneHalf', label: 'Lose 1 and a half pounds per week' },
      { value: 'downTwo', label: 'Lose 2 pounds per week' },
      { value: 'upHalf', label: 'Gain half a pound per week' },
      { value: 'upOne', label: 'Gain 1 pound per week' },
    ];

    this.activityLevelOptions = [
      { value: 1.2, label: 'Sedentary (little or no exercise)' },
      { value: 1.375, label: 'Lightly active (light exercise 1-3 days/week)' },
      { value: 1.55, label: 'Active (moderate exercise 3-5 days/week)' },
      { value: 1.725, label: 'Very active (hard exercise 6-7 days/week)' },
    ];
  }

  async handleSubmit() {
    let userReg = this.state;
    await this.props.addUser(userReg);
    this.props.navigation.navigate('Main');
  }

  render() {
    const navigate = this.props.navigation.navigate;
    return (
      <ImageBackground
        style={styles.backgroundImage}
        source={require('../assets/images/balancedDiet.jpeg')}
        blurRadius={1}
      >
        <View style={styles.formBackground}>
          <View style={styles.form}>
            <Text style={styles.title}>Registration Form</Text>
            <View style={styles.inputFields}>
              <Input onChangeText={text => this.setState({ email: text })} />
              <Text style={styles.formLabelText}>Email</Text>
            </View>
            <View style={styles.inputFields}>
              <Input onChangeText={text => this.setState({ age: text })} />
              <Text style={styles.formLabelText}>Age</Text>
            </View>
            <View style={styles.inputFields}>
              <Input onChangeText={text => this.setState({ height: text })} />
              <Text style={styles.formLabelText}>Height (inches)</Text>
            </View>
            <View style={styles.inputFields}>
              <Input onChangeText={text => this.setState({ weight: text })} />
              <Text style={styles.formLabelText}>Weight (pounds)</Text>
            </View>
            <View style={styles.dropDownFields}>
              <Text style={styles.formLabelText}>Activity Level</Text>
              <SelectInput
                value={this.state.activityLevel}
                options={this.activityLevelOptions}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({
                    activityLevel: itemValue,
                  });
                }}
              />
            </View>
            <View style={styles.dropDownFields}>
              <Text style={styles.formLabelText}>Body Type</Text>
              <SelectInput
                value={this.state.bodyType}
                options={this.bodyTypeOptions}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({
                    bodyType: itemValue,
                  });
                }}
              />
            </View>
            <View style={styles.dropDownFields}>
              <Text style={styles.formLabelText}>Goal</Text>
              <SelectInput
                value={this.state.goal}
                options={this.goalOptions}
                onValueChange={(itemValue, itemIndex) => {
                  this.setState({
                    goal: itemValue,
                  });
                }}
              />
            </View>
          </View>
          <TouchableOpacity onPress={() => navigate('Main')}>
            <View style={styles.joinSignIn}>
              <Text style={styles.buttonText}>Submit</Text>
            </View>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={() => navigate('Main')}>
            <View style={styles.joinSignIn}>
              <Text style={styles.buttonText}>Google Auth Button</Text>
            </View>
          </TouchableOpacity> */}
        </View>
      </ImageBackground>
    );
  }
}

UserJoinScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  formLabelText: {
    fontSize: 16,
  },
  formBackground: {
    backgroundColor: 'rgba(200,200,200,.6)',
    margin: 15,
    paddingTop: 30,
    paddingBottom: 20,
    marginTop: 40,
  },
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  form: {
    marginLeft: 30,
    marginRight: 30,
  },
  joinSignIn: {
    alignItems: 'center',
    backgroundColor: 'lightblue',
    borderRadius: 205,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: 25,
    color: '#2e78b7',
    margin: 20,
  },
  title: {
    fontSize: 25,
    alignSelf: 'center',
    marginBottom: 10,
  },
  inputFields: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropDownFields: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    paddingTop: 20,
  },
});

const mapState = state => {
  return {
    user: state.user,
  };
};

const mapDispatch = dispatch => {
  return {
    addUser: user => dispatch(addUserThunk(user)),
  };
};

export default connect(
  mapState,
  mapDispatch
)(UserJoinScreen);
