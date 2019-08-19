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

class UserJoinScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      age: '',
      height: '',
      weight: '',
      activityLevel: 'Sedentary',
      bodyType: 'Ectomorph',
      goal: 'maintain',
    };
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
        source={require('../assets/images/trail-in-the-woods.jpg')}
        blurRadius={2}
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
              <Picker
                style={{ height: 60, width: 200 }}
                selectedValue={this.state.activityLevel}
                onValueChange={itemValue =>
                  this.setState({
                    activityLevel: itemValue,
                  })
                }
              >
                <Picker.Item
                  label="Sedentary (little or no exercise)"
                  value={1.2}
                />
                <Picker.Item
                  label="Lightly active (light exercise 1-3 days/week)"
                  value={1.375}
                />
                <Picker.Item
                  label=" Active(moderate exercise 3-5 days/week)"
                  value={1.55}
                />
                <Picker.Item
                  label="Very active (hard exercise6-7 days a week)"
                  value={1.725}
                />
                {/* <Picker.Item
              label="Extremely active (very hard exercise and a physical
                 job)"
              value={1.9}
            /> */}
              </Picker>
            </View>
            <View style={styles.dropDownFields}>
              <Text style={styles.formLabelText}>Body Type</Text>
              <Picker
                style={{ height: 60, width: 200 }}
                selectedValue={this.state.bodyType}
                onValueChange={itemValue =>
                  this.setState({
                    bodyType: itemValue,
                  })
                }
              >
                <Picker.Item label="Ectomorph" value="ectomorph" />
                <Picker.Item label="Endomorph" value="endomorph" />
                <Picker.Item label="Mesomorph" value="mesomorph" />
              </Picker>
            </View>
            <View style={styles.dropDownFields}>
              <Text style={styles.formLabelText}>Goal</Text>
              <Picker
                style={{ height: 60, width: 200 }}
                selectedValue={this.state.goal}
                onValueChange={itemValue =>
                  this.setState({
                    goal: itemValue,
                  })
                }
              >
                <Picker.Item label="Maintain Weight" value="maintain" />
                <Picker.Item
                  label="Lose half pound per week"
                  value="downHalf"
                />
                <Picker.Item label="Lose 1 pound per week" value="downOne" />
                <Picker.Item
                  label="Lose 1 and a half pounds per week"
                  value="downOneHalf"
                />
                <Picker.Item label="Lose 2 pounds per week" value="downTwo" />
                <Picker.Item label="Gain half pound per week" value="upHalf" />
                <Picker.Item label="Gain 1 pound per week" value="upOne" />
              </Picker>
            </View>
          </View>
          <TouchableOpacity onPress={() => navigate('Main')}>
            <View style={styles.joinSignIn}>
              <Text style={styles.buttonText}>Submit</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigate('Main')}>
            <View style={styles.joinSignIn}>
              <Text style={styles.buttonText}>Google Auth Button</Text>
            </View>
          </TouchableOpacity>
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
    // color: 'white',
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
    backgroundColor: 'rgb(200,200,200)',
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
    alignItems: 'center',
    justifyContent: 'space-around',
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
