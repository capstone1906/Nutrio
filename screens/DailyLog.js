/* eslint-disable max-statements */
/* eslint-disable complexity */
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";

import DatePicker from "react-native-datepicker";
import { getMealsThunk, deleteMealItem } from "../components/store/meals";
import { getUserThunk } from "../components/store/user";

import { Button, Divider, Icon } from "react-native-elements";

import * as Progress from "react-native-progress";
import { getCheckInsThunk } from "../components/store/checkIns";

const FoodTimeHeader = props => {
  return (
    <View style={styles.FoodTimeHeader}>
      <View style={{ flex: 3 }}>
        <Text style={{ fontSize: 18, color: "white" }}>{props.time}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18, color: "white" }}>Calories</Text>
      </View>
    </View>
  );
};

const ExerciseContainer = props => {
  var calories = 0;
  if (props.todaysCheckIn) {
    calories = props.todaysCheckIn.caloriesBurned;
  }

  return (
    <View style={styles.FoodTimeContainer}>
      <FoodTimeHeader time={props.time} />
      <View style={styles.foodItem}>
        <View style={{ flex: 2, paddingRight: 80 }}>
          <Text style={styles.foodName}>Calories Burned</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.foodName}>{Number(calories).toFixed(0)}</Text>
        </View>
      </View>

      <Divider style={{ backgroundColor: "blue" }} />
    </View>
  );
};

class FoodItem extends React.Component {
  constructor() {
    super();
    this.state = {
      pressed: false,
      food: {},
      mealId: 0
    };
  }

  async componentDidMount() {
    await this.setState({
      food: this.props.food,
      mealId: this.props.mealId
    });
  }

  render() {
    var food = {};
    var calories = 0;

    if (this.state.food.mealFoodItems) {
      food = this.state.food;
      calories = food.mealFoodItems.calories;
    } else {
      return null;
    }

    return (
      <View key={food.food_name} backgroundColor="white">
        <TouchableOpacity
          onPress={
            this.props.editLog
              ? () => {
                  this.props.addToDelete(food, this.state.mealId);
                  this.setState({ pressed: !this.state.pressed });
                }
              : () => {
                  this.props.navigation.navigate("FoodSearchItem", {
                    food: food,
                    mealId: this.state.mealId
                  });
                }
          }
        >
          <View style={styles.foodItem}>
            {this.props.editLog ? (
              <View style={{ paddingRight: 10 }}>
                <Icon
                  type="material-community"
                  name={this.state.pressed ? "square" : "square-outline"}
                  color="black"
                />
              </View>
            ) : null}

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
              <Text style={styles.foodName}>{Number(calories).toFixed(0)}</Text>
            </View>
          </View>
        </TouchableOpacity>
        <Divider style={{ backgroundColor: "blue" }} />
      </View>
    );
  }
}

const FoodTimeContainer = props => {
  var foodItems = [];

  if (props.meal.foodItems) {
    foodItems = props.meal.foodItems;
  }

  return (
    <View style={styles.FoodTimeContainer}>
      <FoodTimeHeader time={props.time} />

      {foodItems.map((food, idx) => {
        return (
          <FoodItem
            food={food}
            key={food.id}
            navigation={props.navigation}
            mealId={props.meal.id}
            addToDelete={props.addToDelete}
            editLog={props.editLog}
            deleteItem={props.deleteItem}
          />
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
      editLog: false,
      showDatePicker: false,
      itemsToDelete: []
    };

    this.deleteItems = this.deleteItems.bind(this);
    this.resetCaloriesBurned = this.resetCaloriesBurned.bind(this);
    this.toggleLog = this.toggleLog.bind(this);
    this.addToDelete = this.addToDelete.bind(this);
  }

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    var itemsToDelete = [];
    if (params.itemsToDelete) {
      itemsToDelete = params.itemsToDelete;
    }

    return {
      headerTitle: "Daily log",
      headerStyle: {
        backgroundColor: "#1E90FF"
      },
      headerTintColor: "white",

      headerLeft: ({ focused }) => (
        <View style={{ paddingLeft: 5, marginLeft: 5 }}>
          <Icon
            name={
              itemsToDelete.length > 0 ? "trash-can-outline" : "pencil-outline"
            }
            type="material-community"
            color="white"
            onPress={
              itemsToDelete.length > 0
                ? () => {
                    params.deleteItems();
                  }
                : () => {
                    params.toggleLog();
                  }
            }
          />
          <Text style={{ color: "white" }}>
            {itemsToDelete.length > 0 ? "Delete items" : "Edit log"}
          </Text>
        </View>
      ),
      headerRight: (
        <View style={{ paddingRight: 5, marginRight: 5 }}>
          <Icon
            name="run-fast"
            type="material-community"
            color="white"
            onPress={() => {
              params.navigate("Checkin");
            }}
          />
          <Text style={{ color: "white" }}> Check in</Text>
        </View>
      )
    };
  };

  componentWillMount() {
    this.props.navigation.setParams({
      toggleLog: this.toggleLog,
      itemsToDelete: this.state.itemsToDelete,
      deleteItems: this.deleteItems,
      navigate: this.props.navigation.navigate
    });
  }

  toggleLog = () => {
    this.setState({ editLog: !this.state.editLog });
  };

  async addToDelete(food, mealId) {
    var newState = [...this.state.itemsToDelete];
    var exists = false;

    newState = newState.filter((item, idx) => {
      if (item.food.id === food.id && item.mealId === mealId) {
        exists = true;
      } else {
        return item;
      }
    });

    if (exists === false) {
      newState.push({ food, mealId });
    }

    await this.setState({
      itemsToDelete: newState
    });

    this.props.navigation.setParams({
      toggleLog: this.toggleLog,
      itemsToDelete: this.state.itemsToDelete,
      deleteItems: this.deleteItems,
      navigate: this.props.navigation.navigate
    });
  }

  resetCaloriesBurned() {}

  async deleteItems() {
    var items = [...this.state.itemsToDelete];
    await Promise.all(
      items.map(item => {
        return this.props.deleteMealItem(item.food.id, item.mealId);
      })
    );

    this.setState({ itemsToDelete: [] });
    this.props.navigation.setParams({
      toggleLog: this.toggleLog,
      itemsToDelete: [],
      deleteItems: this.deleteItems,
      navigate: this.props.navigation.navigate
    });
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

      breakfast.foodItems.forEach(food => {
        totalCals += food.calories;
      });
      lunch.foodItems.forEach(food => {
        totalCals += food.calories;
      });
      dinner.foodItems.forEach(food => {
        totalCals += food.calories;
      });
      snacks.foodItems.forEach(food => {
        totalCals += food.calories;
      });
    }

    var percent = Number(totalCals / calorieLimit).toFixed(1);
    var barColor;
    if (isNaN(percent)) {
      percent = 0;
    }

    if (percent < 0.9) {
      barColor = "orange";
    }
    if (percent >= 0.9) {
      barColor = "#4CEF90";
    }
    if (percent > 1.0) {
      barColor = "crimson";
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
                this.props.getMeals(date, this.props.user.id);
              }}
            />
          </View>

          <View style={styles.progress}>
            <View style={{ justifyContent: "center", flexDirection: "column" }}>
              <Text>Calories: </Text>
              <Text> {totalCals.toFixed(0)}</Text>
            </View>

            <Progress.Bar
              progress={percent}
              width={225}
              height={15}
              color={barColor}
            />

            <View style={{ justifyContent: "center", flexDirection: "column" }}>
              <Text>Limit: </Text>
              <Text> {calorieLimit.toFixed(0)}</Text>
            </View>
          </View>

          <FoodTimeContainer
            time="Breakfast"
            navigation={this.props.navigation}
            meal={breakfast}
            deleteItems={this.deleteItems}
            addToDelete={this.addToDelete}
            editLog={this.state.editLog}
          />
          <FoodTimeContainer
            time="Lunch"
            navigation={this.props.navigation}
            meal={lunch}
            deleteItems={this.deleteItems}
            addToDelete={this.addToDelete}
            editLog={this.state.editLog}
          />
          <FoodTimeContainer
            time="Dinner"
            navigation={this.props.navigation}
            meal={dinner}
            deleteItems={this.deleteItems}
            addToDelete={this.addToDelete}
            editLog={this.state.editLog}
          />
          <FoodTimeContainer
            time="Snacks"
            navigation={this.props.navigation}
            meal={snacks}
            deleteItems={this.deleteItems}
            addToDelete={this.addToDelete}
            editLog={this.state.editLog}
          />
          <ExerciseContainer
            todaysCheckIn={this.props.checkIns.todaysCheckIn}
            time="exercise"
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
    fontSize: 18
  },
  foodItem: {
    flexDirection: "row",
    paddingLeft: 10,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: "white"
  },
  date: {
    justifyContent: "space-around",
    // paddingLeft: 75,
    flexDirection: "row"
  },
  progress: {
    flexDirection: "row",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    paddingTop: 20,
    paddingBottom: 25
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5ECCD"
  },

  FoodTimeHeader: {
    flexDirection: "row",
    backgroundColor: "#1E90FF",
    height: 40,
    justifyContent: "space-between",
    color: "white",
    padding: 10,
    borderRadius: 10
  },
  FoodTimeContainer: {
    marginBottom: 30
  },
  addFoodButton: {
    width: 100,
    height: 50,
    backgroundColor: "#1E90FF",
    marginTop: 5,
    marginLeft: 5
  },

  foodAmount: {
    fontSize: 12,
    color: "grey"
  }
});

const mapState = state => {
  return {
    meals: state.meals,
    user: state.user,
    checkIns: state.checkIns
  };
};

const mapDispatch = dispatch => {
  return {
    getMeals: (date, userId) => dispatch(getMealsThunk(date, userId)),
    getUser: () => dispatch(getUserThunk()),
    getCheckIns: () => dispatch(getCheckInsThunk()),
    deleteMealItem: (foodId, mealId) => dispatch(deleteMealItem(foodId, mealId))
  };
};

export default connect(
  mapState,
  mapDispatch
)(DailyLog);
