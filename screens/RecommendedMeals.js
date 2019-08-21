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
import axios from 'axios';
import { ngrok } from '../secret';
import { connect } from 'react-redux';

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
class RecommendedMeals extends React.Component {
  constructor() {
    super();
    this.state = {
      activeButton: 'Breakfast',
      meals: [],
    };
    this.handlePress = this.handlePress.bind(this);
  }
  async handlePress(evt) {
    const dailyGoals = this.props.user.dailyGoal;
    const meal = {
      calories: dailyGoals.calorieLimit / 4,
      carbs: dailyGoals.carbLimit / 4,
      protein: dailyGoals.proteinLimit / 4,
      fat: dailyGoals.fatLimit / 4,
      type: evt,
    };
    console.log('meal', meal)
    const recMeals = await axios.get(`${ngrok}/api/meals/recommendedMeals`, {
      params: {
        meal: meal,
      },
    });

    this.setState({
      activeButton: evt,
      meals: recMeals,
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
        <ScrollView />
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

const mapState = state => {
  return {
    user: state.user,
  };
};

export default connect(mapState)(RecommendedMeals);
