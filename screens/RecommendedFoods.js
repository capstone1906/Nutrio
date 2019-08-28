import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  ActivityIndicator,
  AlertIOS,
} from 'react-native';
import { getRecommendedFoodsThunk } from '../components/store/recommendedFoods';
import { connect } from 'react-redux';
import FoodCard from '../components/FoodCard';
import { Button, Text, ButtonGroup } from 'react-native-elements';
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

const meals = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
class RecommendedFoods extends React.Component {
  constructor() {
    super();
    this.state = {
      selectedIndex: 0,
      mealType: 'Breakfast',
      loading: false,
      todayCalories: 0,
    };
    this.handlePress = this.handlePress.bind(this);
    this.postFood = this.postFood.bind(this);
  }
  componentDidMount() {
    this.handlePress(this.state.selectedIndex);
  }

  async postFood(food, mealId) {
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
    const foodRes = await this.props.postFood(
      newFood,
      mealId,
      quantity,
      grams,
      this.props.user.id
    );
    if (foodRes.foodItem) {
      AlertIOS.alert('Success!!!!', `Added to ${this.state.mealType}`);
    }
  }
  async handlePress(evt, type) {
    this.setState({
      loading: true,
    });
    setTimeout(
      function() {
        this.setState({ loading: false });
      }.bind(this),
      350
    );
    let mealType = meals[evt];
    let food = {};
    const dailyGoals = this.props.user.dailyGoal;
    const todayMeal = this.props.meals.todaysMeals.filter(meal => {
      return meal.entreeType === mealType ? meal : null;
    })[0];
    const todayCalories = todayMeal.foodItems.reduce((accum, val) => {
      return (accum += val.calories);
    }, 0);
    const todayCarbs = todayMeal.foodItems.reduce((accum, val) => {
      return (accum += val.carbohydrates);
    }, 0);
    const todayFat = todayMeal.foodItems.reduce((accum, val) => {
      return (accum += val.fat);
    }, 0);
    const todayProtein = todayMeal.foodItems.reduce((accum, val) => {
      return (accum += val.calories);
    }, 0);
    if (type !== 'unlimited') {
      food.calories = dailyGoals.calorieLimit / 4 - todayCalories;
      food.carbs = dailyGoals.carbLimit / 4 - todayCarbs;
      food.protein = dailyGoals.proteinLimit / 4 - todayProtein;
      food.fat = dailyGoals.fatLimit / 4 - todayFat;
    } else {
      food.calories = 2000;
      food.carbs = 300;
      food.protein = 300;
      food.fat = 300;
    }

    await this.props.getRecs(food);
    this.setState({
      selectedIndex: evt,
      mealType,
      todayCalories: 0,
    });
  }
  render() {
    if (this.props.meals.todaysMeals.length && this.state.todayCalories === 0) {
      const todayMeal = this.props.meals.todaysMeals.filter(meal => {
        return meal.entreeType === this.state.mealType ? meal : null;
      })[0];
      const todayCalories = todayMeal.foodItems.reduce((accum, val) => {
        return (accum += val.calories);
      }, 0);
      this.setState({
        todayCalories: todayCalories - 1,
      });
    }
    return (
      <View>
        <View>
          <ButtonGroup
            onPress={this.handlePress}
            selectedIndex={this.state.selectedIndex}
            buttons={['Breakfast', 'Lunch', 'Dinner', 'Snacks']}
            containerStyle={{ height: 50, marginRight: 20 }}
            selectedTextStyle={{ color: 'white' }}
            buttonStyle={{ backgroundColor: '#058ED9' }}
          />
        </View>
        {this.props.user.dailyGoal.calorieLimit / 4 <
        this.state.todayCalories ? (
          <View>
            <Text h1 style={styles.warningText}>
              {`You've hit your calorie limit for ${this.state.mealType}`}
            </Text>
            <Button
              title="Click to remove calorie and macro limit"
              onPress={() => {
                this.handlePress(this.state.selectedIndex, 'unlimited');
              }}
              style={styles.warningButton}
            />
          </View>
        ) : this.props.user.dailyGoal.calorieLimit / 4 >
            this.state.todayCalories && this.state.loading ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#1E90FF" />
          </View>
        ) : (
          <FlatList
            data={this.props.recommendedFoods}
            keyExtractor={(item, index) => item.id}
            renderItem={({ item }) => (
              <FoodCard
                food={item}
                mealType={this.state.mealType}
                postFood={this.postFood}
                style={styles.flatList}
                maxToRenderPerBatch={2}
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
