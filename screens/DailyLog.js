/* eslint-disable max-statements */
/* eslint-disable complexity */
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { connect } from 'react-redux';

import DatePicker from 'react-native-datepicker';
import { getMealsThunk, deleteMealItem } from '../components/store/meals';
import { getUserThunk } from '../components/store/user';

import { Button, Divider } from 'react-native-elements';

import Swipeout from 'react-native-swipeout';
import * as Progress from 'react-native-progress';
import { getCheckInsThunk } from '../components/store/checkIns';

const FoodTimeHeader = props => {
  return (
    <View style={styles.FoodTimeHeader}>
      <View style={{ flex: 3 }}>
        <Text style={{ fontSize: 18, color: 'white' }}>{props.time}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18, color: 'white' }}>Calories</Text>
      </View>
    </View>
  );
};

const ExerciseContainer = props => {
  var calories = 0;
  if (props.todaysCheckIn) {
    calories = props.todaysCheckIn.caloriesBurned;
  }

  var swipeoutBtns = [
    {
      text: 'Reset',
      backgroundColor: 'red',
      onPress() {
        props.resetCaloriesBurned(props.checkIns.todaysCheckIn.id);
      },
    },
  ];

  return (
    <View style={styles.FoodTimeContainer}>
      <FoodTimeHeader time={props.time} />
      <Swipeout right={swipeoutBtns} backgroundColor="white">
        <View style={styles.foodItem}>
          <View style={{ flex: 2, paddingRight: 80 }}>
            <Text style={styles.foodName}>Calories Burned</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.foodName}>{Number(calories).toFixed(0)}</Text>
          </View>
        </View>

        <Divider style={{ backgroundColor: 'blue' }} />
      </Swipeout>

      <Button
        buttonStyle={styles.addFoodButton}
        title="Add Exercise"
        onPress={() => {
          console.log(props.navigation);
          props.navigation.navigate('Exercise');
        }}
      />
    </View>
  );
};

const FoodTimeContainer = props => {
  var foodItems = [];

  if (props.meal.foodItems) {
    foodItems = props.meal.foodItems;
  }

  return (
    <View style={styles.FoodTimeContainer}>
      <FoodTimeHeader time={props.time} />

      {foodItems.map((food, idx) => {
        var calories = food.mealFoodItems.calories;

        var swipeoutBtns = [
          {
            text: 'Delete',
            backgroundColor: 'red',
            onPress() {
              props.deleteItem(food.id, props.meal.id);
            },
          },
        ];

        return (
          <Swipeout
            right={swipeoutBtns}
            key={food.food_name}
            backgroundColor="white"
          >
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate('FoodSearchItem', {
                  food: food,
                  mealId: props.meal.id,
                });
              }}
            >
              <View style={styles.foodItem}>
                <View style={{ flex: 2, paddingRight: 80 }}>
                  <Text style={styles.foodName}>{food.food_name}</Text>

                  {food.mealFoodItems.quantity > 0 ? (
                    <Text style={styles.foodAmount}>
                      Serving size: {food.mealFoodItems.quantity}
                    </Text>
                  ) : (
                    <Text style={styles.foodAmount}>
                      {food.mealFoodItems.grams} grams
                    </Text>
                  )}
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.foodName}>
                    {Number(calories).toFixed(0)}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <Divider style={{ backgroundColor: 'blue' }} />
          </Swipeout>
        );
      })}

      <Button
        buttonStyle={styles.addFoodButton}
        title="Add food"
        onPress={() => {
          props.navigation.navigate('FoodSearch', {
            mealId: props.meal.id,
          });
        }}
      />
    </View>
  );
};

class DailyLog extends React.Component {
  constructor() {
    super();

    const dateNow = new Date();
    var todaysDate;

    var year = dateNow.getFullYear().toString();
    var month = (dateNow.getMonth() + 1).toString();
    var day = dateNow.getDate().toString();

    if (month < 10) {
      month = '0' + month;
    }
    if (day < 10) {
      day = '0' + day;
    }

    todaysDate = year + '-' + month + '-' + day;

    this.state = {
      date: todaysDate,
      meals: [],

      showDatePicker: false,
    };

    this.deleteItem = this.deleteItem.bind(this);
    this.resetCaloriesBurned = this.resetCaloriesBurned.bind(this);
  }

  resetCaloriesBurned() {}

  deleteItem(foodId, mealId) {
    this.props.deleteMealItem(foodId, mealId);
    // await this.props.getMeals(this.state.date, this.props.user.id);
  }

  async componentDidMount() {
    await this.props.getCheckIns();
    await this.props.getMeals(this.state.date, this.props.user.id);
    await this.props.getUser();
  }

  render() {
    var foods = this.props.meals;
    var breakfast = {};
    var lunch = {};
    var dinner = {};
    var snacks = {};

    if (foods.todaysMeals.length > 0) {
      breakfast = foods.todaysMeals[0];
      lunch = foods.todaysMeals[1];
      dinner = foods.todaysMeals[2];
      snacks = foods.todaysMeals[3];
    }

    var calorieLimit = 0;
    var totalCals = 0;

    if (this.props.user.dailyGoal && foods.todaysMeals.length > 0) {
      calorieLimit = this.props.user.dailyGoal.calorieLimit;
      totalCals =
        breakfast.totalCalories +
        lunch.totalCalories +
        dinner.totalCalories +
        snacks.totalCalories;
    }

    var percent = Number(totalCals / calorieLimit).toFixed(1);
    var barColor;
    if (isNaN(percent)) {
      percent = 0;
    }
    if (percent < 0.25) {
      barColor = 'blue';
    }
    if (percent < 0.5) {
      barColor = 'green';
    }
    if (percent > 0.5) {
      barColor = 'orange';
    }
    if (percent >= 0.8) {
      barColor = 'red';
    }
    if (percent >= 0.9) {
      barColor = 'crimson';
    }
    if (this.props.user && this.props.meals && this.props.checkIns) {
      return (
        <ScrollView style={styles.container}>
          <View style={styles.date}>
            <DatePicker
              style={{ width: 150, paddingBottom: 10 }}
              date={this.state.date}
              mode="date"
              placeholder="select date"
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              customStyles={{
                dateIcon: {
                  position: 'absolute',
                  left: 0,
                  top: 4,
                  marginLeft: 0,
                },
                dateInput: {
                  marginLeft: 36,
                },
              }}
              onDateChange={date => {
                this.setState({ date: date });
                this.props.getMeals(date, this.props.user.id);
              }}
            />
            <Button
              onPress={() => this.props.navigation.navigate('Checkin')}
              title="Check-In"
            />
          </View>

          <View style={styles.progress}>
            <View style={{ justifyContent: 'center', flexDirection: 'column' }}>
              <Text>Calories: </Text>
              <Text> {totalCals.toFixed(0)}</Text>
            </View>

            <Progress.Bar
              progress={percent}
              width={225}
              height={15}
              color={barColor}
            />

            <View style={{ justifyContent: 'center', flexDirection: 'column' }}>
              <Text>Limit: </Text>
              <Text> {calorieLimit.toFixed(0)}</Text>
            </View>
          </View>

          <FoodTimeContainer
            time="Breakfast"
            navigation={this.props.navigation}
            meal={breakfast}
            deleteItem={this.deleteItem}
          />
          <FoodTimeContainer
            time="Lunch"
            navigation={this.props.navigation}
            meal={lunch}
            deleteItem={this.deleteItem}
          />
          <FoodTimeContainer
            time="Dinner"
            navigation={this.props.navigation}
            meal={dinner}
            deleteItem={this.deleteItem}
          />
          <FoodTimeContainer
            time="Snacks"
            navigation={this.props.navigation}
            meal={snacks}
            deleteItem={this.deleteItem}
          />
          <ExerciseContainer
            todaysCheckIn={this.props.checkIns.todaysCheckIn}
            time="exercise"
            navigation={this.props.navigation}
            resetCaloriesBurned={this.resetCaloriesBurned}
          />
        </ScrollView>
      );
    } else {
      return <ActivityIndicator size="large" color="#0000ff" />;
    }
  }
}

const styles = StyleSheet.create({
  foodName: {
    fontSize: 18,
  },
  foodItem: {
    flexDirection: 'row',
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  date: {
    justifyContent: 'space-around',
    paddingLeft: 75,
    flexDirection: 'row',
  },
  progress: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
    paddingBottom: 25,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5ECCD',
  },

  FoodTimeHeader: {
    flexDirection: 'row',
    backgroundColor: '#1E90FF',
    height: 40,
    justifyContent: 'space-between',
    color: 'white',
    padding: 10,
    borderRadius: 10,
  },
  FoodTimeContainer: {
    marginBottom: 30,
  },
  addFoodButton: {
    width: 100,
    height: 50,
    backgroundColor: '#1E90FF',
    marginTop: 5,
    marginLeft: 5,
  },

  foodAmount: {
    fontSize: 12,
    color: 'grey',
  },
});

DailyLog.navigationOptions = {
  headerTitle: 'Daily log',
  headerStyle: {
    backgroundColor: '#1E90FF',
  },
  headerTintColor: 'white',
};

const mapState = state => {
  return {
    meals: state.meals,
    user: state.user,
    checkIns: state.checkIns,
  };
};

const mapDispatch = dispatch => {
  return {
    getMeals: (date, userId) => dispatch(getMealsThunk(date, userId)),
    getUser: () => dispatch(getUserThunk()),
    getCheckIns: () => dispatch(getCheckInsThunk()),
    deleteMealItem: (foodId, mealId) =>
      dispatch(deleteMealItem(foodId, mealId)),
  };
};

export default connect(
  mapState,
  mapDispatch
)(DailyLog);
