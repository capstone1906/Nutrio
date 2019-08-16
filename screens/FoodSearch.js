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

  formatName(oldName) {
    var name = oldName.split(',')

    var newName = ''
    name.forEach((name, index) => {
      if (!name.includes('UPC:') && !name.includes('GTIN:')) {
        newName += name
      }
    })

    newName = newName.split(' ')
    newName = newName.map(word => {
      word = word.toLowerCase()
      return word.charAt(0).toUpperCase() + word.slice(1)
    })

    return newName.join(' ')
  }

  async handleChange(event) {
    event.preventDefault();

    this.setState({
      searchName: event.nativeEvent.text
    });

    const res = await axios.get(
      `https://api.nal.usda.gov/ndb/search/?format=json&q=${
        event.nativeEvent.text
      }&sort=n&max=50&offset=0&api_key=VfLLSxw4Odcu042mZ1dySCS2hLJULj5zkhtx1lLy`
    );

    if (res.data.list) {
      this.setState({
        currentSearch: res.data.list.item,
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

            food.name = this.formatName(food.name)
            return (
              <TouchableOpacity key={food.ndbno}>
                {/* <FoodSearchItem food={food} /> */}
                <Text style={styles.foodName} onPress={() => {
                    this.props.navigation.navigate('FoodSearchItem', {food: food, mealId: this.props.navigation.getParam("mealId")})
                }}>{food.name}</Text>
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