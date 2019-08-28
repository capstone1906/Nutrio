import React from 'react';
import { StyleSheet, View, FlatList, ActivityIndicator } from 'react-native';
import { Button, ButtonGroup } from 'react-native-elements';
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
  loader: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: '#F5ECCD',
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
      selectedIndex: 0,
      mealType: 'Breakfast',
      loading: true,
    };
    this.handlePress = this.handlePress.bind(this);
    this.postFood = this.postFood.bind(this);
  }
  componentDidMount() {
    this.handlePress(0);
    this.setState({ loading: false });
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
  async handlePress(evt) {
    this.setState({
      mealType: meals[evt],
      loading: true,
    });
    setTimeout(
      function() {
        this.setState({ loading: false });
      }.bind(this),
      350
    );
    const dailyGoals = this.props.user.dailyGoal;
    const meal = {
      calories: dailyGoals.calorieLimit / 4,
      carbs: dailyGoals.carbLimit / 4,
      protein: dailyGoals.proteinLimit / 4,
      fat: dailyGoals.fatLimit / 4,
      type: meals[evt],
    };
    await this.props.getRecs(meal);
    this.setState({
      selectedIndex: evt,
    });
  }
  render() {
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
        {this.state.loading || !this.props.recommendedMeals.length ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#1E90FF" />
          </View>
        ) : (
          <FlatList
            data={this.props.recommendedMeals}
            keyExtractor={(item, index) => item.id}
            renderItem={({ item }) => (
              <MealCard
                meal={item}
                postFood={this.postFood}
                style={styles.flatList}
                maxToRenderPerBatch={2}
                mealType={this.state.mealType}
              />
            )}
          />
        )}
      </View>
    );
  }
}

RecommendedMeals.navigationOptions = {
  headerTitle: 'Recommended Meals',
  headerStyle: {
    backgroundColor: '#1E90FF',
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
    postFood: (food, mealId, quantity, grams, userId) =>
      dispatch(postFood(food, mealId, quantity, grams, userId)),
  };
};

export default connect(
  mapState,
  mapDispatch
)(RecommendedMeals);
