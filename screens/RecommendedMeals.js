import React from 'react';
import { StyleSheet, View, ScrollView } from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { getRecommendedMealsThunk } from '../components/store/recommendedMeals';
import MealCard from '../components/MealCard';
import { postFood } from '../components/store/meals';

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
    };
    this.handlePress = this.handlePress.bind(this);
    this.postFood = this.postFood.bind(this);
  }
  componentDidMount() {
    this.handlePress(this.state.activeButton);
  }
  postFood(foodItems, mealId) {
    foodItems.map(food => {
      let newFood = {
        food_name: food.food_name,
        calories: food.calories,
        fat: food.fat,
        protein: food.protein,
        carbohydrates: food.carbohydrates,
        weight: food.weight,
        servingSize: food.servingSize,
      };
      let quantity = 0;
      let grams = 0;
      if (food.mealFoodItems.quantity > 0) {
        quantity = food.mealFoodItems.quantity;
      } else {
        grams = food.mealFoodItems.quantity;
      }
      this.props.postFood(newFood, mealId, quantity, grams);
    });
    this.props.navigation.pop();
    this.props.navigation.pop();
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
                <MealCard
                  key={meal.id}
                  meal={meal}
                  postFood={this.postFood}
                  mealType={this.state.activeButton}
                />
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
    postFood: (food, mealId, quantity, grams) =>
      dispatch(postFood(food, mealId, quantity, grams)),
  };
};

export default connect(
  mapState,
  mapDispatch
)(RecommendedMeals);
