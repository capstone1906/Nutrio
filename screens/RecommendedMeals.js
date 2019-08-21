import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { Button } from 'react-native-elements';

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    margin: 5,
  },
});

const MealButton = props => {
  return (
    <Button
      style={styles.button}
      title={props.title}
      type={props.state === props.title ? 'outline' : 'solid'}
      onPress={() => props.handlePress(props.title)}
    />
  );
};

const meals = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
export default class RecommendedMeals extends React.Component {
  constructor() {
    super();
    this.state = {
      activeButton: 'Breakfast',
    };
    this.handlePress = this.handlePress.bind(this);
  }
  handlePress(evt) {
    this.setState({
      activeButton: evt,
    });
  }
  render() {
    return (
      <View>
        <View style={styles.buttonContainer}>
          {meals.map((meal, idx) => (
            <MealButton
              key={idx}
              title={meal}
              handlePress={this.handlePress}
              state={this.state.activeButton}
            />
          ))}
        </View>
        <ScrollView>

        </ScrollView>
      </View>
    );
  }
}

RecommendedMeals.navigationOptions = {
  headerTitle: 'Recommended Meals',
  headerStyle: {
    backgroundColor: 'crimson',
  },
  headerTintColor: 'white',
};
