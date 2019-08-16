import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import axios from "axios";
import {connect} from 'react-redux'

import { Button, Divider } from "react-native-elements";

import DatePicker from "react-native-datepicker";
import { getMealsThunk } from "../components/store/meals";

const FoodTimeHeader = props => {
  return (
    <View style={styles.FoodTimeHeader}>
      <View style={{ flex: 2 }}>
        <Text>{props.time}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text>Carbs</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text>Fat</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text>Protein</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text>Calories</Text>
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
        return (
          <React.Fragment key={food.name}>
            <View style={styles.foodItem} >
              <View style={{ flex: 2 }}>
                <Text>{food.name}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text>{food.carbohydrates}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text>{food.fat}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text>{food.protein}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text>{food.calories}</Text>
              </View>
            </View>
            <Divider style={{ backgroundColor: "blue" }} />
          </React.Fragment>
        );
      })}

      <Button
        buttonStyle={styles.addFoodButton}
        title="Add food"
        onPress={() => {
          props.navigation.navigate("FoodSearch", {mealId: props.meal.id});
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
  }

  setDate(newDate) {
    this.setState({ chosenDate: newDate });
    setTimeout({}, 1000);
  }

  async componentDidMount() {
    await this.props.getMeals()

  }

  render() {

    var foods = this.props.meals;
    var breakfast = {};
    var lunch = {};
    var dinner = {};
    var snacks = {};

    if (foods !== undefined) {
        console.log('here', this.state)
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

    console.log('meals', breakfast,lunch,dinner,snacks)
    return (
      <ScrollView style={styles.container}>
        <View style={styles.date}>
          <DatePicker
            style={{ width: 150 }}
            date={this.state.date}
            mode="date"
            placeholder="select date"
            // format="MM-DD-YYYY"
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
              // var newDate = new Date(date)
              this.setState({ date: date });
            }}
          />
        </View>

        <FoodTimeContainer
          time="Breakfast"
          navigation={this.props.navigation}
          meal={breakfast}
        />
        <FoodTimeContainer
          time="Lunch"
          navigation={this.props.navigation}
          meal={lunch}
        />
        <FoodTimeContainer
          time="Dinner"
          navigation={this.props.navigation}
          meal={dinner}
        />
        <FoodTimeContainer
          time="Snacks"
          navigation={this.props.navigation}
          meal={snacks}
        />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  foodItem: {
    flexDirection: "row",
    paddingLeft: 10
  },
  date: {
    justifyContent: "center",
    paddingLeft: 75
  },
  container: {
    flex: 1,
    //   justifyContent: 'center'
    padding: 20
  },

  FoodTimeHeader: {
    // flex: 1,
    // alignSelf: "stretch",
    flexDirection: "row",
    backgroundColor: "lightgrey",
    height: 40,
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 10
  },
  FoodTimeContainer: {
    // backgroundColor: "crimson",
    // height: 100,
    marginBottom: 30
  },
  addFoodButton: {
    width: 100,
    backgroundColor: "limegreen"
    // fontSize: 5,
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
    }
}

const mapDispatch = dispatch => {
    return {
        getMeals: () => dispatch(getMealsThunk()),
    }
}

export default connect(mapState, mapDispatch)(DailyLog)