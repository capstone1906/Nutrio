/* eslint-disable react/no-multi-comp */
/* eslint-disable max-statements */
/* eslint-disable complexity */
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from "react-native";
import { connect } from "react-redux";

import DatePicker from "react-native-datepicker";
import { getMealsThunk, deleteMealItem } from "../components/store/meals";
import { getUserThunk } from "../components/store/user";
import { addToFavoriteMealsThunk } from "../components/store/favoriteMeals";

import { Button, Divider, Icon } from "react-native-elements";

import * as Progress from "react-native-progress";
import { getCheckInsThunk } from "../components/store/checkIns";

const FoodTimeHeader = props => {
  return (
    <View style={styles.FoodTimeHeader}>
      <View style={{ flex: 3 }}>
        <Text style={{ fontSize: 18, color: "white", fontWeight: '500' }}>{props.time}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18, color: "white", fontWeight: '500' }}>Calories</Text>
      </View>
      {props.mealHeader ? (
        <View>
          <Icon
            name={!props.meal.foodItems.length ? "star-outline" : "star-face"}
            disabledStyle={{ backgroundColor: "#1E90FF" }}
            color="#FFFF86"
            type="material-community"
            onPress={() => {
              props.addToFavorite(props.user, props.meal.id);
              Alert.alert("Success!!", "Added to Favorite Meals");
            }}
            disabled={!props.meal.foodItems.length}
          />
        </View>
      ) : null}
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
      <FoodTimeHeader time={props.time} meals={props.meals} />
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

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.food.mealFoodItems.quantity !==
      this.props.food.mealFoodItems.quantity
    ) {
      this.setState({ food: this.props.food });
    }
  }

  render() {
    var food = {};
    var calories = 0;
    var foodName = ''

    if (this.state.food.mealFoodItems) {
      food = this.state.food;
      calories = food.mealFoodItems.calories;
      foodName = food.food_name.charAt(0).toUpperCase() + food.food_name.slice(1)
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
              <Text style={styles.foodName}>{foodName}</Text>

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
      <FoodTimeHeader
        time={props.time}
        meal={props.meal}
        user={props.user}
        addToFavorite={props.addToFavorite}
        mealHeader={true}
      />

      {foodItems.map((food, idx) => {
        return (
          <FoodItem
            food={food}
            key={food.food_name}
            navigation={props.navigation}
            mealId={props.meal.id}
            addToDelete={props.addToDelete}
            editLog={props.editLog}
            deleteItem={props.deleteItem}
          />
        );
      })}


    <View style={{marginLeft: 100}}> 
      <Button
        buttonStyle={styles.addFoodButton}
        title="Add food"
        onPress={() => {
          props.navigation.navigate("FoodSearch", {
            mealId: props.meal.id
          });
        }}
        icon={{
          name: "plus-circle-outline",
          type: "material-community",
          color: "white"
        }}
      />
      </View>
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
    this.dateChange = this.dateChange.bind(this)
  }

  dateChange(date) {
    this.setState({ date: date });
    this.props.getMeals(date, this.props.user.id);

    this.props.navigation.setParams({
      toggleLog: this.toggleLog,
      itemsToDelete: this.state.itemsToDelete,
      deleteItems: this.deleteItems,
      navigate: this.props.navigation.navigate,
      date: date,
      dateChange: this.dateChange
    });
  }

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    var itemsToDelete = [];
    if (params.itemsToDelete) {
      itemsToDelete = params.itemsToDelete;
    }


    return {
      headerTitle: ({ focused }) => (
        <View style={styles.date}>
        <DatePicker
          style={{ width: 150, borderColor: 'white' }}
          date={params.date}
          mode="date"
          placeholder="select date"
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          customStyles={{
            dateIcon: {
              position: "absolute",
              left: 0,
              top: 4,
              marginLeft: 0,
              color: 'white'
            },
            dateInput: {
              marginLeft: 36,
              color: 'white'
            },
            dateText: {
              color: 'white'
            }
          }}
          onDateChange={date => {
            params.dateChange(date)
          }}
        />
      </View>
      ),

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
      navigate: this.props.navigation.navigate,
      date: this.state.date,
      dateChange: this.dateChange
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
      navigate: this.props.navigation.navigate,
      date: this.state.date,
      dateChange: this.dateChange
    });
  }

  resetCaloriesBurned() {}

  async deleteItems() {
    var items = [...this.state.itemsToDelete];
    await Promise.all(
      items.map(item => {
        return this.props.deleteMealItem(
          item.food.id,
          item.mealId,
          this.props.user.id
        );
      })
    );

    this.setState({ itemsToDelete: [] });
    this.props.navigation.setParams({
      toggleLog: this.toggleLog,
      itemsToDelete: [],
      deleteItems: this.deleteItems,
      navigate: this.props.navigation.navigate,
      date: this.state.date,
      dateChange: this.dateChange
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
    var calsBurned = 0;

    if (this.props.user.dailyGoal && foods.todaysMeals.length > 0) {
      calorieLimit = this.props.user.dailyGoal.calorieLimit;

      breakfast.foodItems.forEach(food => {
        totalCals +=
          (food.mealFoodItems.quantity === 0
            ? food.calories / food.weight
            : food.calories) *
          (food.mealFoodItems.quantity === 0
            ? food.mealFoodItems.grams
            : food.mealFoodItems.quantity);
      });

      lunch.foodItems.forEach(food => {
        totalCals +=
          (food.mealFoodItems.quantity === 0
            ? food.calories / food.weight
            : food.calories) *
          (food.mealFoodItems.quantity === 0
            ? food.mealFoodItems.grams
            : food.mealFoodItems.quantity);
      });

      dinner.foodItems.forEach(food => {
        totalCals +=
          (food.mealFoodItems.quantity === 0
            ? food.calories / food.weight
            : food.calories) *
          (food.mealFoodItems.quantity === 0
            ? food.mealFoodItems.grams
            : food.mealFoodItems.quantity);
      });

      snacks.foodItems.forEach(food => {
        totalCals +=
          (food.mealFoodItems.quantity === 0
            ? food.calories / food.weight
            : food.calories) *
          (food.mealFoodItems.quantity === 0
            ? food.mealFoodItems.grams
            : food.mealFoodItems.quantity);
      });

      calsBurned = this.props.checkIns.todaysCheckIn.caloriesBurned;
    }

    var percent = Number(
      (totalCals.toFixed(0) - calsBurned) / calorieLimit
    ).toFixed(1);
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
    return (
      <ScrollView style={styles.container}>
        {!this.props.user.activityLevel ||
        !this.props.checkIns.checkIns.length ||
        !this.props.meals.allMeals.length ? (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#1E90FF" />
          </View>
        ) : (
          <View>

            <View style={styles.progress}>
              <View
                style={{
                  justifyContent: "space-evenly",
                  flexDirection: "row",
                  width: "100%",
                  paddingTop: 5
                }}
              >
                <Text style={{fontWeight: '700', fontSize: 16}}>{totalCals.toFixed(0)}</Text>
                <Text></Text>
                <Text></Text>

                <Text style={{fontWeight: '700', fontSize: 16}}>{calsBurned}</Text>
                <Text></Text>

                <Text> </Text>

                <Text style={{fontWeight: '700', fontSize: 16}}>
                  {calorieLimit.toFixed(0) - totalCals.toFixed(0) + calsBurned}
                </Text>
              </View>

              <View
                style={{
                  justifyContent: "space-evenly",
                  flexDirection: "row",
                  width: "100%",
                  paddingBottom: 5
                }}
              >
                <Text style={{fontSize: 10}}>consumed {'    '}</Text>
                <Text> </Text>
                <Text style={{fontSize: 10}}>{'       '}burned</Text>
                <Text> </Text>
                <Text style={{fontSize: 10}}> {'           '}remaining </Text>
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignContent: "center",
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    alignContent: "center",
                    padding: 5
                  }}
                >
                  <Text style={{fontSize: 16, fontWeight: '700'}}>{totalCals.toFixed(0) - calsBurned}</Text>

                  <Text style={{fontSize: 10}}> total </Text>
                </View>

                <View>
                  <Progress.Bar
                    progress={percent}
                    width={225}
                    height={15}
                    color={barColor}
                  />
                </View>

                <View
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    alignContent: "center",
                    padding: 5
                  }}
                >
                  <Text style={{fontSize: 16, fontWeight: '700'}}>{calorieLimit.toFixed(0)}</Text>
                  <Text style={{fontSize: 10}}>Limit</Text>
                </View>
              </View>
            </View>


          <View style={{padding: 20,}}>

          <View style={{width: 125, paddingBottom: 10, marginLeft: 100, marginBottom: 15 }} >
              <Button
                title="Fav Meals"
                icon={{
                  name: "star-face",
                  type: "material-community",
                  color: "#FFFF86"
                }}
                onPress={() => this.props.navigation.navigate("FavoriteMeals")}
                buttonStyle={{backgroundColor: "#1E90FF"}}
              />
            </View>


            <FoodTimeContainer
              time="Breakfast"
              navigation={this.props.navigation}
              meal={breakfast}
              deleteItems={this.deleteItems}
              addToDelete={this.addToDelete}
              editLog={this.state.editLog}
              user={this.props.user.id}
              addToFavorite={this.props.addToFavorite}
              key={1}
            />
            <FoodTimeContainer
              time="Lunch"
              navigation={this.props.navigation}
              meal={lunch}
              deleteItems={this.deleteItems}
              addToDelete={this.addToDelete}
              editLog={this.state.editLog}
              user={this.props.user.id}
              addToFavorite={this.props.addToFavorite}
              key={2}
            />
            <FoodTimeContainer
              time="Dinner"
              navigation={this.props.navigation}
              meal={dinner}
              deleteItems={this.deleteItems}
              addToDelete={this.addToDelete}
              editLog={this.state.editLog}
              user={this.props.user.id}
              addToFavorite={this.props.addToFavorite}
              key={3}
            />
            <FoodTimeContainer
              time="Snacks"
              navigation={this.props.navigation}
              meal={snacks}
              deleteItems={this.deleteItems}
              addToDelete={this.addToDelete}
              editLog={this.state.editLog}
              user={this.props.user.id}
              addToFavorite={this.props.addToFavorite}
              key={4}
            />
            <ExerciseContainer
              todaysCheckIn={this.props.checkIns.todaysCheckIn}
              time="Exercise"
              resetCaloriesBurned={this.resetCaloriesBurned}
            />
            </View>
          </View>
        )}
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
    paddingBottom: 5,
    backgroundColor: "white"
  },
  date: {
    justifyContent: "space-around",
    flexDirection: "row"
  },
  progress: {
    flex: 1,
    paddingTop: 5,
    marginBottom: 5,
    backgroundColor: "white",
    borderBottomWidth: 3,
    borderBottomColor: "#1E90FF",
    width: "100%"
  },
  container: {
    flex: 1,
    
    backgroundColor: "#F5ECCD"
  },

  FoodTimeHeader: {
    flexDirection: "row",
    backgroundColor: "#1E90FF",
    height: 40,
    justifyContent: "space-between",
    color: "white",
    padding: 10,
    borderRadius: 4
  },
  FoodTimeContainer: {
    marginBottom: 30
  },
  addFoodButton: {
    width: 115,
    height: 45,
    backgroundColor: "#1E90FF",
    marginTop: 5,
    marginLeft: 5
  },
  foodAmount: {
    fontSize: 12,
    color: "grey"
  },
  loader: {
    height: "100%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    backgroundColor: "#F5ECCD"
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
    addToFavorite: (userId, mealId) =>
      dispatch(addToFavoriteMealsThunk(userId, mealId)),
    deleteMealItem: (foodId, mealId, userId) =>
      dispatch(deleteMealItem(foodId, mealId, userId))
  };
};

export default connect(
  mapState,
  mapDispatch
)(DailyLog);
