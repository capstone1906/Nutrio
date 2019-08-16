import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import axios from 'axios';

import {
  Button,
  ListItem,
  ThemeProvider,
  Divider,
} from 'react-native-elements';

const FoodTimeHeader = props => {
  return (
    <View style={styles.FoodTimeHeader}>
      <View style={{ flex: 2 }}>
        <Text>{props.time}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text>Carbs</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text>Fat</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text>Protein</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text>Calories</Text>
      </View>
    </View>
  );
};

const FoodTimeContainer = props => {
  return (
    <View style={styles.FoodTimeContainer}>
      <FoodTimeHeader time={props.time} />
      <Button
        buttonStyle={styles.addFoodButton}
        title="Add food"
        onPress={() => {
          props.navigation.navigate('FoodSearch');
        }}
      />
    </View>
  );
};

export default class DailyLog extends React.Component {
  constructor() {
    super();
  }

  async componentDidMount() {
    var res = await axios.get('https://ead97e56.ngrok.io/api/food');
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text>Todays Date</Text>
        <FoodTimeContainer
          time="Breakfast"
          navigation={this.props.navigation}
        />
        <FoodTimeContainer time="Lunch" navigation={this.props.navigation} />
        <FoodTimeContainer time="Dinner" navigation={this.props.navigation} />
        <FoodTimeContainer time="Snacks" navigation={this.props.navigation} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  FoodTimeHeader: {
    // flex: 1,
    // alignSelf: "stretch",
    flexDirection: 'row',
    backgroundColor: 'lightgrey',
    height: 40,
    width: '90%',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 10,
  },
  FoodTimeContainer: {
    backgroundColor: 'crimson',
    height: 100,
    marginBottom: 30,
  },
  addFoodButton: {
    width: 100,
    backgroundColor: 'limegreen',
    // fontSize: 5,
  },
});

DailyLog.navigationOptions = {
  headerTitle: 'Daily log',
  headerStyle: {
    backgroundColor: 'crimson',
  },
  headerTintColor: 'white',
};
