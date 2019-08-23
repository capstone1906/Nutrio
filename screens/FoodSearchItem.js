import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import { Input, Button, Divider } from "react-native-elements";
import {ngrok} from '../secret'

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Picker
} from "react-native";
import { VictoryPie, VictoryChart, VictoryTheme } from "victory-native";
import { postFood } from "../components/store/meals";
import SelectInput from "react-native-select-input-ios";

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
      isOpen: false,
      quantity: 0,
      serving: 1
    };
    this.postFood = this.postFood.bind(this);
  }

  postFood() {
    var mealId = this.props.navigation.getParam("mealId");

    var newFood = {
      food_name: this.state.foodInfo.food_name,
      calories: this.state.foodInfo.nf_calories,
      fat: this.state.foodInfo.nf_total_fat,
      protein: this.state.foodInfo.nf_protein,
      carbohydrates: this.state.foodInfo.nf_total_carbohydrate,
      weight: this.state.foodInfo.serving_weight_grams,
      servingSize: this.state.foodInfo.serving_unit,
    };

    var quantity = 0;
    var grams = 0

    if (this.state.serving === 1) {
      grams = 0;
    }
    else {
      grams = 1
    }

    if (this.state.quantity === 0) {
      quantity = 1;
    } else {
      quantity = this.state.quantity;
    }


    this.props.postFood(newFood, mealId, quantity, grams);
    this.props.navigation.pop()
    this.props.navigation.pop()

  }

  async componentDidMount() {
    var food = this.props.navigation.getParam("food");
    var mealId = this.props.navigation.getParam("mealId");

    const res = await axios.post(
      `https://trackapi.nutritionix.com/v2/natural/nutrients`,
      {
        query: `${food.food_name}`
      },
      {
        headers: {
          "x-app-id": "5e27fd08",
          "x-app-key": "1e1ee4d0779fb25127320c91ced7c367",
          "x-remote-user-id": "0"
        }
      }
    );

    var food = res.data.foods[0];

    food.caloriesGram = food.nf_calories / food.serving_weight_grams;
    food.proteinGram = food.nf_protein / food.serving_weight_grams;


    food.carbsGram = food.nf_total_carbohydrate / food.serving_weight_grams;
    food.fatGram = food.nf_total_fat / food.serving_weight_grams;
    var quantity = 0;


    var findFood = await axios.get(
      `${ngrok}/api/food/${food.food_name}`
    );
    if (findFood.data) {
      var mealFoodItem = await axios.get(
        `${ngrok}/api/mealFoodItems/${
          findFood.data.id
        }/${mealId}`
      );
      if (mealFoodItem.data) {
        quantity = mealFoodItem.data.quantity;
      }
    }

    this.setState({
      foodInfo: food,
      showData: !this.state.showData,
      quantity
    });
  }

  // eslint-disable-next-line complexity
  render() {
    const options = [
      { value: 0, label: "gram" },
      { value: 1, label: `${this.state.foodInfo.serving_unit}` }
    ];


    return (
      <ScrollView>
        {this.state.foodInfo.nf_calories ? (
          <View style={styles.foodItemInfo}>
            <View>
              <Text style={styles.info}>{this.state.foodInfo.food_name}</Text>
              <Divider style={{ backgroundColor: "blue" }} />
            </View>

            <Image
              style={{ width: 150, height: 150 }}
              source={{ uri: `${this.state.foodInfo.photo.thumb}` }}
            />

            <View>
              <FoodTimeHeader />
              <View style={styles.FoodTimeHeader}>
                <View style={{ flex: 1 }}>
                  {this.state.serving === 1 ? (
                    <Text>{this.state.foodInfo.nf_calories}</Text>
                  ) : (
                    <Text>{Number(this.state.foodInfo.caloriesGram * (this.state.quantity === 0 ? 1 : this.state.quantity)).toFixed(3) }</Text>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  {this.state.serving === 1 ? (
                    <Text>{this.state.foodInfo.nf_total_carbohydrate}</Text>
                  ) : (
                    <Text>{Number(this.state.foodInfo.carbsGram * (this.state.quantity === 0 ? 1 : this.state.quantity)).toFixed(3) }</Text>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  {this.state.serving === 1 ? (
                    <Text>{this.state.foodInfo.nf_total_fat}</Text>
                  ) : (
                    <Text>{Number(this.state.foodInfo.fatGram * (this.state.quantity === 0 ? 1 : this.state.quantity)).toFixed(3) }</Text>
                  )}
                </View>
                <View style={{ flex: 1 }}>
                  {this.state.serving === 1 ? (
                    <Text>{this.state.foodInfo.nf_protein}</Text>
                  ) : (
                    <Text>{Number(this.state.foodInfo.proteinGram * (this.state.quantity === 0 ? 1 : this.state.quantity)).toFixed(3) }</Text>
                  )}
                </View>
              </View>
              <Divider style={{ backgroundColor: "blue" }} />
            </View>

            <View style={styles.servingSize}>
              <View style={styles.size}>
                <Text style={styles.info}>Serving size:</Text>
              </View>

              <View>
                <SelectInput
                  value={this.state.serving}
                  options={options}
                  onValueChange={(itemValue, itemIndex) => {
                    if (itemValue === 0) {
                      this.setState({
                        serving: itemValue
                      });
                    } else {
                      this.setState({ serving: itemValue });
                    }
                  }}
                />
              </View>

              <Divider style={{ backgroundColor: "blue" }} />
            </View>

            <View style={styles.servingSize}>
              <View style={styles.size}>
                <Text style={styles.info}>Number of servings:</Text>
              </View>

              <View>
                <TextInput
                  keyboardType='number-pad'
                  keyboardAppearance='dark'
                  style={{
                    height: 40,
                    borderColor: "gray",
                    borderWidth: 1,
                    width: 40
                  }}
                  onChangeText={text => this.setState({ quantity: text })}
                  value={this.state.quantity.toString()}
                  placeholder={this.state.quantity.toString()}
                />
              </View>

              <Divider style={{ backgroundColor: "blue" }} />
            </View>

            <Divider style={{ backgroundColor: "blue" }} />

            <Divider style={{ backgroundColor: "blue" }} />

            <Button title="add" onPress={() => this.postFood()} />

            <VictoryPie
              colorScale={["crimson", "limegreen", "navy"]}
              data={[
                {
                  x: `Fat: ${this.state.foodInfo.nf_total_fat}g`,
                  y: this.state.foodInfo.nf_total_fat
                },
                {
                  x: `Carbs: ${this.state.foodInfo.nf_total_carbohydrate}g`,
                  y: this.state.foodInfo.nf_total_carbohydrate
                },
                {
                  x: `Protein: ${this.state.foodInfo.nf_protein}g`,
                  y: this.state.foodInfo.nf_protein
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
      </ScrollView>
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
    width: "100%",
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
  };
};

const mapDispatch = dispatch => {
  return {
    postFood: (food, mealId, quantity, grams) =>
      dispatch(postFood(food, mealId, quantity, grams))
  };
};

export default connect(
  mapState,
  mapDispatch
)(FoodSearchItem);
