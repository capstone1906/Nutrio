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
import { connect } from 'react-redux';
import { getRecommendedMealsThunk } from '../components/store/recommendedMeals';
import MealCard from '../components/MealCard';

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
    await this.props.getRecs(meal);
    this.setState({
      activeButton: evt,
    });
  }
  render() {
    console.log(this.props.recommendedMeals);
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
          {this.props.recommendedMeals.length
            ? this.props.recommendedMeals.map(meal => (
                <MealCard key={meal.id} meal={meal} />
              ))
            : null}
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

const mapState = state => {
  return {
    user: state.user,
    recommendedMeals: state.recommendedMeals,
  };
};
const mapDispatch = dispatch => {
  return {
    getRecs: meal => dispatch(getRecommendedMealsThunk(meal)),
  };
};

export default connect(
  mapState,
  mapDispatch
)(RecommendedMeals);
