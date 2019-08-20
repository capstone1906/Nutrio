import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
} from 'react-native';
import { connect } from 'react-redux';

import { Button, Divider } from 'react-native-elements';
import { getUserThunk } from '../components/store/user';
import ProgressCircle from 'react-native-progress-circle';

class Profile extends React.Component {
  constructor() {
    super();

    this.removeItem = this.removeItem.bind(this);
  }

  async componentDidMount() {
    await this.props.getUser();
  }

  removeItem = async () => {
    await AsyncStorage.removeItem('user');
    this.props.navigation.navigate('Main');
  };

  render() {
    var user = this.props.user;

    var bmr = Math.floor(
      (10 * user.weight + 6.25 * user.height * 0.39370079 - 5 * user.age + 5) *
        parseInt(user.activityLevel)
    );

    var per = 0;
    if (user.longTermGoal) {
      per = Math.floor(
        ((user.weight - user.longTermGoal.startWeight) /
          (user.longTermGoal.endingWeight - user.longTermGoal.startWeight)) *
          100
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.weight}>
          <ProgressCircle
            percent={per}
            radius={70}
            borderWidth={15}
            color="#4CEF90"
            shadowColor="#999"
            bgColor="#E76B74"
          >
            <Text style={{ fontSize: 18, color: 'white' }}>{`${per}%`}</Text>
          </ProgressCircle>

          <Text style={styles.currWeight}>
            Current weight: {user.weight} lbs
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          <TouchableOpacity>
            <View style={styles.card}>
              <Text style={styles.attrib}>Height: {user.height} in.</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View style={styles.card}>
              <Text style={styles.attrib}>Age: {user.age}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View style={styles.card}>
              <Text style={styles.attrib}>Body Type: {user.bodyType}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View style={styles.card}>
              <Text style={styles.attrib}>
                Activity Level: {user.activityLevel}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View style={styles.card}>
              <Text style={styles.attrib}>
                Starting weight:{' '}
                {user.longTermGoal ? user.longTermGoal.startWeight : 0}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View style={styles.card}>
              <Text style={styles.attrib}>
                Goal weight:{' '}
                {user.longTermGoal ? user.longTermGoal.endingWeight : 0}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View style={styles.card}>
              <Text style={styles.attrib}>
                Goal: {user.longTermGoal ? user.longTermGoal.statedGoal : 0}
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View style={styles.card}>
              <Text style={styles.attrib}>Bmr: {bmr}</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity title="Logout" onPress={() => this.removeItem()}>
            <View style={styles.logOutCard}>
              <Text style={styles.attrib}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Button />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  weight: {
    flex: 1,
    backgroundColor: '#E76B74',
    height: '30%',
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',

    marginBottom: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  cardsContainer: {
    flex: 2,
    flexWrap: 'wrap',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  card: {
    padding: 10,
    paddingTop: 30,
    margin: 5,
    width: 110,
    height: 110,
    // backgroundColor: "#82D4BB",
    backgroundColor: '#4CEF90',

    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 5, height: 5 },
    shadowColor: 'black',
    shadowOpacity: 0.7,
    borderRadius: 10,
  },
  logOutCard: {
    padding: 10,
    paddingTop: 30,
    margin: 5,
    width: 110,
    height: 110,
    backgroundColor: 'crimson',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 5, height: 5 },
    shadowColor: 'black',
    shadowOpacity: 0.7,
    borderRadius: 10,
  },
  attrib: {
    color: 'white',
  },
  currWeight: {
    color: 'white',
    paddingTop: 15,
    fontSize: 18,
  },
});

Profile.navigationOptions = {
  headerTitle: 'Profile',
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
)(Profile);
