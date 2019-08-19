import React from "react";
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import axios from "axios";
import {
  Button,
  ListItem,
  ThemeProvider,
  Divider,
  Input
} from "react-native-elements";
// import FoodSearchItem from "../components/FoodSearchItem";

export default class FoodSearch extends React.Component {
  constructor() {
    super();
    this.state = {
      currentSearch: [],
      showError: false,
      searchName: ""
    };
    this.handleChange = this.handleChange.bind(this);
  }

  async handleChange(event) {
    event.preventDefault();

    this.setState({
      searchName: event.nativeEvent.text
    });


    const res = await axios.get(`https://trackapi.nutritionix.com/v2/search/instant?query=${event.nativeEvent.text}`, {
      headers: {
        'x-app-id': 'fa4f9042',
        'x-app-key': '997023a117b76d83e33a7ae290a6b5ba',
      }

     })




    if (res.data.common) {
      this.setState({
        currentSearch: res.data.common.concat(res.data.branded),
        showError: false
      });
    } else {
      this.setState({
        showError: true
      });
    }
  }

  render() {
    var foods = this.state.currentSearch;

    return (
      <View style={styles.screen}>
        <Input onChange={this.handleChange} />
        <Text>Results</Text>

        <ScrollView style={styles.results}>
          {foods.map(food => {

            return (
              <TouchableOpacity key={food.food_name}>
                <Text style={styles.foodName} onPress={() => {
                    this.props.navigation.navigate('FoodSearchItem', {food: food, mealId: this.props.navigation.getParam("mealId")})
                }}>{food.food_name}</Text>
                <Divider style={{ backgroundColor: "blue" }} />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center'
  },
  results: {
    width: "90%",
    alignContent: "center"
  },
  foodName: {
      fontSize: 20
  }
});


FoodSearch.navigationOptions = {
    headerTitle: "Today's log",
    headerStyle: {
        backgroundColor: 'crimson'
    },
    headerTintColor: 'white'
}
