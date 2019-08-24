import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Image,
  Button
} from "react-native";
const { width: winWidth } = Dimensions.get("window");
import { connect } from "react-redux";
import axios from "axios";
import { Col, Row, Grid } from "react-native-easy-grid";
import { Ionicons } from "@expo/vector-icons";
import { ListItem } from "react-native-elements";
import { postFood } from "../components/store/meals";

class QuickAddFood extends React.Component {
  state = {
    selectedFoodsInfo: []
  };

  async componentDidMount() {
    const foodsSelected = this.props.navigation.getParam("foodsSelected");
    await this.getInfoArray(foodsSelected);
    this.props.navigation.setParams({
      selectedFoodsInfo: this.state.selectedFoodsInfo
    });
  }

  retrieveData = async item => {

    try {
      const res = await axios.post(
        `https://trackapi.nutritionix.com/v2/natural/nutrients`,
        {
          query: `${item}`
        },
        {
          headers: {
<<<<<<< HEAD
            'x-app-id': '88718124',
            'x-app-key': 'e8e099aa8964c27ceef58fc2ac8d7375',
=======
            'x-app-id': '5e27fd08',
            'x-app-key': '1e1ee4d0779fb25127320c91ced7c367',
>>>>>>> 840bdc56528cee82ec43083cce39a11cb44a886d
            'x-remote-user-id': '0',
          },
        }
      );
      if (res.data.foods[0]) {
        let food = res.data.foods[0];
        return {
          name: food.food_name,
          photo: food.photo.thumb,
          calories: food.nf_calories,
          fat: food.nf_total_fat,
          protein: food.nf_protein,
          carbohydrates: food.nf_total_carbohydrate,
          weight: food.serving_weight_grams,
          servingSize: food.serving_unit
        };
      }
    } catch (error) {
      console.log("ERROR for ", item);
      return false;
    }
  };

  getInfoArray = async array => {
    var infoArray = [];

    for (let i = 0; i < array.length; i++) {
      const itemInfo = await this.retrieveData(array[i].value.toLowerCase());
      if (itemInfo) {
        // check this
        infoArray.push({
          name: `${itemInfo.name.charAt(0).toUpperCase() +
            itemInfo.name.slice(1)}`,
          image: itemInfo.photo,
          calories: itemInfo.calories,
          fat: itemInfo.fat,
          protein: itemInfo.protein,
          carbohydrates: itemInfo.carbohydrates,
          weight: itemInfo.weight,
          servingSize: itemInfo.servingSize,
          quantity: ""
        });
      }
    }
    // console.log('allSelectedFoodData:', infoArray);
    this.setState({ selectedFoodsInfo: infoArray });

    return infoArray;
  };

  handleChange = (text, index) => {
    // eslint-disable-next-line react/no-access-state-in-setstate
    const newSelectedFoodsInfo = [...this.state.selectedFoodsInfo];
    newSelectedFoodsInfo[index].quantity = text;

    this.setState({ selectedFoodsInfo: newSelectedFoodsInfo });
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "82%",
          backgroundColor: "#CED0CE",
          marginLeft: "18%"
        }}
      />
    );
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, index }) => (
    <ListItem
      title={
        <View>
          <Text style={{ fontSize: 26, fontWeight: "bold" }}>{item.name}</Text>
        </View>
      }
      subtitle={
        <View>
          <TextInput
            style={{ fontSize: 18 }}
            onChangeText={text => this.handleChange(text, index)}
            value={item.quantity}
            keyboardType="number-pad"
            placeholder="Enter Quantity"
          />
          <Text style={{ fontSize: 20, fontStyle: 'italic' }}>
            {Math.round(Number(item.calories) * Number(item.quantity)) === 0
              ? ''
              : Math.round(Number(item.calories) * Number(item.quantity))}{' '}
            Cal
          </Text>
        </View>
      }
      leftAvatar={{ source: { uri: item.image } }}
      bottomDivider={true}
    />
  );

  postFood = () => {
    const mealId = this.props.navigation.getParam("mealId");
    const array = this.state.selectedFoodsInfo;

    for (let i = 0; i < array.length; i++) {
      const newFood = {
        food_name: array[i].name,
        calories: array[i].calories,
        fat: array[i].fat,
        protein: array[i].protein,
        carbohydrates: array[i].carbohydrates,
        weight: array[i].weight,
        servingSize: array[i].servingSize
      };

      this.props.postFood(
        newFood,
        mealId,
        Math.round(Number(array[i].quantity)),
        0
      );
    }

    alert("Added to Meal");
    this.props.navigation.navigate("DailyLog");
  };

  render() {
    const { selectedFoodsInfo } = this.state;

    console.log("selectedFoodsInfo is now ", selectedFoodsInfo);

    return (
      <View style={{ flex: 1 }}>
        <FlatList
          keyExtractor={this.keyExtractor}
          data={selectedFoodsInfo}
          renderItem={this.renderItem}
          ItemSeparatorComponent={this.renderSeparator}
        />
        <Grid style={styles.resultToolbar}>
          <Row>
            <Col>
              <TouchableOpacity style={{ backgroundColor: "#d9534e" }}>
                <Ionicons
                  style={styles.closeButton}
                  onPress={() => {
                    this.props.navigation.navigate("FoodSearch");
                  }}
                  name="md-close"
                  color="white"
                  size={35}
                />
              </TouchableOpacity>
            </Col>
            <Col>
              <TouchableOpacity style={{ backgroundColor: "#337ab7" }}>
                <Ionicons
                  style={styles.closeButton}
                  onPress={() => this.postFood()}
                  name="md-checkmark"
                  color="white"
                  size={35}
                />
              </TouchableOpacity>
            </Col>
          </Row>
        </Grid>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  closeButton: {
    textAlign: "center"
  },
  resultToolbar: {
    width: winWidth,
    position: "absolute",
    height: 37,
    bottom: 0
  }
});

QuickAddFood.navigationOptions = {
  headerTitle: 'Add to Meal',
  headerStyle: {
    backgroundColor: 'crimson',
  },
  headerTintColor: 'white',
};

const mapDispatch = dispatch => {
  return {
    postFood: (food, mealId, quantity, grams) =>
      dispatch(postFood(food, mealId, quantity, grams))
  };
};

export default connect(
  null,
  mapDispatch
)(QuickAddFood);
