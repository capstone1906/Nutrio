import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  ActivityIndicator,
} from 'react-native';
import { Button } from 'react-native-elements';
import { connect } from 'react-redux';
import MealCard from '../components/MealCard';
import { getFavoriteMealsThunk } from '../components/store/favoriteMeals';
import { postFood } from '../components/store/meals';

const styles = StyleSheet.create({
  loader: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: '#F5ECCD',
  },
});

class FavoriteMeals extends Component {
  constructor() {
    super();
    this.postFood = this.postFood.bind(this);
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
      this.props.postFood(newFood, mealId, quantity, grams, this.props.user.id);
    });
    this.props.navigation.navigate('DailyLog');
  }

  componentDidMount() {
    this.props.getFavs(this.props.user.id);
  }

  render() {
    if (!this.props.favoriteMeals.length) {
      return (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#1E90FF" />
        </View>
      );
    } else {
      return (
        <ScrollView>
          {this.props.favoriteMeals.map(favMeal => (
            <MealCard
              key={favMeal.id}
              meal={favMeal}
              postFood={this.postFood}
              mealType={favMeal.entreeType}
            />
          ))}
        </ScrollView>
      );
    }
  }
}

FavoriteMeals.navigationOptions = {
  headerTitle: 'Favorite Meals',
  headerStyle: {
    backgroundColor: '#1E90FF',
  },
  headerTintColor: 'white',
};

const mapState = state => {
  return {
    user: state.user,
    favoriteMeals: state.favoriteMeals,
    meals: state.meals,
  };
};

const mapDispatch = dispatch => {
  return {
    getFavs: userId => dispatch(getFavoriteMealsThunk(userId)),
    postFood: (food, mealId, quantity, grams, userId) =>
      dispatch(postFood(food, mealId, quantity, grams, userId)),
  };
};

export default connect(
  mapState,
  mapDispatch
)(FavoriteMeals);
