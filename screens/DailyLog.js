import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";

import DatePicker from "react-native-datepicker";
import { getMealsThunk } from "../components/store/meals";

import { Button, Divider } from "react-native-elements";

import Swipeout from "react-native-swipeout";
import { deleteMealItem } from "../components/store/meals";
import axios from "axios";

const FoodTimeHeader = props => {
  return (
    <View style={styles.FoodTimeHeader}>
      <View style={{ flex: 3 }}>
        <Text style={{ fontSize: 18 }}>{props.time}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18 }}>Calories</Text>
      </View>
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

      {foodItems.map(food => {
        var calories = food.mealFoodItems.calories;

        var swipeoutBtns = [
          {
            text: "Delete",
            backgroundColor: "red",
            onPress() {
              props.deleteItem(food.id, props.meal.id);
              // props.getMeals()
              
            }
          }
        ];

        return (
          <Swipeout
            right={swipeoutBtns}
            key={food.food_name}
            backgroundColor="white"
          >
            <TouchableOpacity
              onPress={() => {
                props.navigation.navigate("FoodSearchItem", {
                  food: food,
                  mealId: props.meal.id
                });
              }}
            >
              <View style={styles.foodItem}>
                <View style={{ flex: 2, paddingRight: 80 }}>
                  <Text style={styles.foodName}>{food.food_name}</Text>

                  <Text style={styles.foodAmount}>Serving size: {food.mealFoodItems.quantity}</Text>


                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.foodName}>{calories}</Text>
                </View>
              </View>
            </TouchableOpacity>
            <Divider style={{ backgroundColor: "blue" }} />
          </Swipeout>
        );
      })}

      <Button
        buttonStyle={styles.addFoodButton}
        title="Add food"
        onPress={() => {
          props.navigation.navigate("FoodSearch", {
            mealId: props.meal.id
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
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }

    todaysDate = year + "-" + month + "-" + day;

    this.state = {
      date: todaysDate,
      meals: [],

      showDatePicker: false
    };

    this.setDate = this.setDate.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  async deleteItem(foodId, mealId) {
    this.props.deleteMealItem(foodId, mealId);
    await this.props.getMeals();
  }

  setDate(newDate) {
    this.setState({ chosenDate: newDate });
  }

  async componentDidMount() {
    await this.props.getMeals();
  }

  render() {
    var foods = this.props.meals;
    var breakfast = {};
    var lunch = {};
    var dinner = {};
    var snacks = {};

    if (foods !== undefined) {
      for (let i = 0; i < foods.length; i++) {
        var today = new Date(this.state.date);
        var setDay = today.getDate() + 1;
        var setMonth = today.getMonth();
        var setYear = today.getYear();

        var mealTime = new Date(foods[i].createdAt);
        var mealDay = mealTime.getDate();
        var mealMonth = mealTime.getMonth();
        var mealYear = mealTime.getYear();

        if (
          foods[i].entreeType === "Breakfast" &&
          mealDay === setDay &&
          setMonth === mealMonth &&
          setYear === mealYear
        ) {
          breakfast = foods[i];
        } else if (
          foods[i].entreeType === "Lunch" &&
          mealDay === setDay &&
          setMonth === mealMonth &&
          setYear === mealYear
        ) {
          lunch = foods[i];
        } else if (
          foods[i].entreeType === "Dinner" &&
          mealDay === setDay &&
          setMonth === mealMonth &&
          setYear === mealYear
        ) {
          dinner = foods[i];
        } else if (
          foods[i].entreeType === "Snacks" &&
          mealDay === setDay &&
          setMonth === mealMonth &&
          setYear === mealYear
        ) {
          snacks = foods[i];
        }
      }
    }

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
                position: "absolute",
                left: 0,
                top: 4,
                marginLeft: 0
              },
              dateInput: {
                marginLeft: 36
              }
            }}
            onDateChange={date => {
              this.setState({ date: date });
            }}
          />
        </View>

        <FoodTimeContainer
          time="Breakfast"
          navigation={this.props.navigation}
          meal={breakfast}
          deleteItem={this.deleteItem}
          getMeals={this.props.getMeals}
        />
        <FoodTimeContainer
          time="Lunch"
          navigation={this.props.navigation}
          meal={lunch}
          deleteItem={this.deleteItem}
          getMeals={this.props.getMeals}

        />
        <FoodTimeContainer
          time="Dinner"
          navigation={this.props.navigation}
          meal={dinner}
          deleteItem={this.deleteItem}
          getMeals={this.props.getMeals}

        />
        <FoodTimeContainer
          time="Snacks"
          navigation={this.props.navigation}
          meal={snacks}
          deleteItem={this.deleteItem}
          getMeals={this.props.getMeals}

        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  foodName: {
    fontSize: 18
  },
  foodItem: {
    flexDirection: "row",
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5
  },
  date: {
    justifyContent: "center",
    paddingLeft: 75
  },
  container: {
    flex: 1,
    padding: 20
  },

  FoodTimeHeader: {
    flexDirection: "row",
    backgroundColor: "lightgrey",
    height: 40,
    justifyContent: "space-between",

    padding: 10,
    borderRadius: 10
  },
  FoodTimeContainer: {
    marginBottom: 30
  },
  addFoodButton: {
    width: 100,
    backgroundColor: "limegreen"
  },
  foodAmount: {
    fontSize: 12,
    color: 'grey'
  }
});

DailyLog.navigationOptions = {
  headerTitle: "Daily log",
  headerStyle: {
    backgroundColor: "crimson"
  },
  headerTintColor: "white"
};

const mapState = state => {
  return {
    meals: state.meals
  };
};

const mapDispatch = dispatch => {
  return {
    getMeals: () => dispatch(getMealsThunk()),
    deleteMealItem: (foodId, mealId) => dispatch(deleteMealItem(foodId, mealId))
  };
};

export default connect(
  mapState,
  mapDispatch
)(DailyLog);
