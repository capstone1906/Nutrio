import React from "react";
import axios from "axios";
import {connect} from 'react-redux'
import { Input, Button, Divider } from "react-native-elements";

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from "react-native";
import { VictoryPie, VictoryChart, VictoryTheme } from "victory-native";
import {postFood} from '../components/store/meals'

const FoodTimeHeader = props => {
  return (
    <View style={styles.FoodTimeHeader}>
      <View style={{ flex: 1 }}>
        <Text>Calories</Text>
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
    </View>
  );
};

class FoodSearchItem extends React.Component {
  constructor() {
    super();

    this.state = {
      foodInfo: {},
      showData: false,
      isOpen: false
    };
    this.postFood = this.postFood.bind(this)
  }

  postFood() {
    var mealId = this.props.navigation.getParam("mealId")
    var newFood = {
      name: this.state.foodInfo.name,
      calories: this.state.foodInfo.nutrients[0].value,
      fat: this.state.foodInfo.nutrients[2].value,
      protein: this.state.foodInfo.nutrients[1].value,
      carbohydrates: this.state.foodInfo.nutrients[3].value,
      ndbno: this.state.foodInfo.ndbno      
    }

    this.props.postFood(newFood, mealId)

  }

  async componentDidMount() {
    var food = this.props.navigation.getParam("food", "hi");

    var data;
    const res = await axios.get(
      `https://api.nal.usda.gov/ndb/nutrients/?format=json&api_key=VfLLSxw4Odcu042mZ1dySCS2hLJULj5zkhtx1lLy&nutrients=205&nutrients=204&nutrients=208&nutrients=203&ndbno=${
        food.ndbno
      }`
    );
    data = res.data.report.foods[0];
    data.name = food.name;
    data.nutrients[0].value = Math.ceil(data.nutrients[0].value);
    data.nutrients[1].value = Math.ceil(data.nutrients[1].value);
    data.nutrients[2].value = Math.ceil(data.nutrients[2].value);
    data.nutrients[3].value = Math.ceil(data.nutrients[3].value);

    this.setState({
      foodInfo: data,
      showData: !this.state.showData
    });
  }

  render() {


    return (
      <View>
        {this.state.foodInfo.nutrients ? (
          <View style={styles.foodItemInfo}>
            <View>
              <Text style={styles.info}>{this.state.foodInfo.name}</Text>
              <Divider style={{ backgroundColor: "blue" }} />
            </View>

            <View>
              <FoodTimeHeader />
              <View style={styles.FoodTimeHeader}>
                <View style={{ flex: 1 }}>
                  <Text>{this.state.foodInfo.nutrients[0].value}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text>{this.state.foodInfo.nutrients[3].value}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text>{this.state.foodInfo.nutrients[2].value}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text>{this.state.foodInfo.nutrients[1].value}</Text>
                </View>
              </View>
              <Divider style={{ backgroundColor: "blue" }} />
            </View>

            <View style={styles.servingSize}>
              <View style={styles.size}>
                <Text style={styles.info}>Serving size:</Text>
              </View>

              <View>
                <Text style={styles.info} style={styles.value}>
                  {this.state.foodInfo.measure}
                </Text>
              </View>

              <Divider style={{ backgroundColor: "blue" }} />
            </View>

            <Divider style={{ backgroundColor: "blue" }} />

            <View style={styles.servingSize}>
              <View style={styles.size}>
                <Text style={styles.info}>Grams:</Text>
              </View>
              <View>
                <Text style={styles.info} style={styles.value}>
                  {this.state.foodInfo.weight}
                </Text>
              </View>
              <Divider style={{ backgroundColor: "blue" }} />
            </View>
            <Divider style={{ backgroundColor: "blue" }} />

            <Button title='add' onPress={() => this.postFood()}/>

            <VictoryPie
              colorScale={["crimson", "limegreen", "navy"]}
              data={[
                {
                  x: `Fat: ${this.state.foodInfo.nutrients[2].value}g`,
                  y: this.state.foodInfo.nutrients[2].value
                },
                {
                  x: `Carbs: ${this.state.foodInfo.nutrients[3].value}g`,
                  y: this.state.foodInfo.nutrients[3].value
                },
                {
                  x: `Protein: ${this.state.foodInfo.nutrients[1].value}g`,
                  y: this.state.foodInfo.nutrients[1].value
                }
              ]}
              labelRadius={87}
              style={{
                labels: {
                  fill: "white",
                  fontSize: 14,
                  padding: "5px",
                  margin: "5px"
                }
              }}
            />
            <Divider style={{ backgroundColor: "blue" }} />
          </View>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  FoodName: {
    fontSize: 20
  },
  foodItemInfo: {
    alignItems: "center",
    paddingTop: 15
  },
  servingSize: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: '100%',
    maxWidth: 300
  },
  info: {
    fontSize: 20
  },
  FoodTimeHeader: {
    flexDirection: "row",
    height: 40,
    width: "90%",
    justifyContent: "space-between"
  },
  size: {
    // marginRight: 250,
    // alignSelf: 'flex-start'
  }
});

FoodSearchItem.navigationOptions = {
  headerTitle: "Today's log",
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
      // getMeals: () => dispatch(getMealsThunk()),
      postFood: (food, mealId) => dispatch(postFood(food, mealId))

  }
}

export default connect(mapState, mapDispatch)(FoodSearchItem)
