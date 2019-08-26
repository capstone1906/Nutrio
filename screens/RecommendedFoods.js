import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  List,
  ActivityIndicator,
} from 'react-native';
import { getRecommendedFoodsThunk } from '../components/store/recommendedFoods';
import { connect } from 'react-redux';
import FoodCard from '../components/FoodCard';
import { Button, Text } from 'react-native-elements';
import { postFood } from '../components/store/meals';

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    margin: 5,
  },
  warningText: {
    textAlign: 'center',
    marginTop: 10,
  },
  warningButton: {
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: 15,
  },
  loader: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: '#F5ECCD',
  },
});

const FoodButton = props => {
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
class RecommendedFoods extends React.Component {
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

  postFood(food, mealId) {
    let newFood = {
      food_name: food.food_name,
      calories: food.calories,
      fat: food.fat,
      protein: food.protein,
      carbohydrates: food.carbohydrates,
      weight: food.weight,
      servingSize: food.servingSize,
    };
    let quantity = 1;
    let grams = 0;
    this.props.postFood(newFood, mealId, quantity, grams, this.props.user.id);

    this.props.navigation.pop();
    this.props.navigation.pop();
  }
  async handlePress(evt, type) {
    let food = {};
    const dailyGoals = this.props.user.dailyGoal;
    const todayMeal = this.props.meals.todaysMeals.filter(meal => {
      return meal.entreeType === evt ? meal : null;
    })[0];
    if (type !== 'unlimited') {
      food.calories = dailyGoals.calorieLimit / 4 - todayMeal.totalCalories;
      food.carbs = dailyGoals.carbLimit / 4 - todayMeal.totalCarbs;
      food.protein = dailyGoals.proteinLimit / 4 - todayMeal.totalProtein;
      food.fat = dailyGoals.fatLimit / 4 - todayMeal.totalFat;
    } else {
      food.calories = 2000;
      food.carbs = 300;
      food.protein = 300;
      food.fat = 300;
    }

    await this.props.getRecs(food);
    this.setState({
      activeButton: evt,
    });
  }
  render() {
    return (
      <View>
        <View style={styles.buttonContainer}>
          {meals.map((meal, idx) => (
            <FoodButton
              key={idx}
              title={meal}
              handlePress={this.handlePress}
              state={this.state.activeButton}
            />
          ))}
        </View>
        {!this.props.recommendedFoods.length ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#1E90FF" />
          </View>
        ) : this.props.user.dailyGoal.calorieLimit <
          this.props.checkIns.todaysCheckIn.caloriesConsumed -
            this.props.checkIns.todaysCheckIn.caloriesBurned ? (
          <View>
            <Text h1 style={styles.warningText}>
              {`You've hit your calorie limit for ${this.state.activeButton}`}
            </Text>
            <Button
              title="Click to remove calorie and macro limit"
              onPress={() => {
                this.handlePress(this.state.activeButton, 'unlimited');
              }}
              style={styles.warningButton}
            />
          </View>
        ) : (
          <FlatList
            data={this.props.recommendedFoods}
            renderItem={({ item }) => (
              <FoodCard
                key={item.id}
                food={item}
                mealType={this.state.activeButton}
                postFood={this.postFood}
                style={styles.flatList}
              />
            )}
          />
        )}
      </View>
    );
  }
}

RecommendedFoods.navigationOptions = {
  headerTitle: 'Recommended Foods',
  headerStyle: {
    backgroundColor: '#1E90FF',
  },
  headerTintColor: 'white',
};

const mapState = state => {
  return {
    user: state.user,
    recommendedFoods: state.recommendedFoods,
    meals: state.meals,
    checkIns: state.checkIns,
  };
};
const mapDispatch = dispatch => {
  return {
    getRecs: food => dispatch(getRecommendedFoodsThunk(food)),
    postFood: (food, mealId, quantity, grams, userId) =>
      dispatch(postFood(food, mealId, quantity, grams, userId)),
  };
};

export default connect(
  mapState,
  mapDispatch
)(RecommendedFoods);
