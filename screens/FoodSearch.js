import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import axios from "axios";
import {
  Button,
  ListItem,
  ThemeProvider,
  Divider, Input
} from "react-native-elements";
import FoodSearchItem from '../components/FoodSearchItem'

export default class DailyLog extends React.Component {
  constructor() {
    super();
    this.state = {
        currentSearch: [],
        showError: false,
        searchName: ''
      }
    this.handleChange = this.handleChange.bind(this)
  }

  async handleChange(event) {
    event.preventDefault()

    this.setState({
      searchName: event.nativeEvent.text
    })

    const res = await axios.get(
      `https://api.nal.usda.gov/ndb/search/?format=json&q=${
        event.nativeEvent.text
      }&sort=n&max=50&offset=0&api_key=VfLLSxw4Odcu042mZ1dySCS2hLJULj5zkhtx1lLy`
    )


    if (res.data.list) {
      this.setState({
        currentSearch: res.data.list.item,
        showError: false
      })
    } else {
      this.setState({
        showError: true
      })
    }
  }

  render() {
    var foods = this.state.currentSearch;

    return (
      <ScrollView style={styles.screen}>
        <ScrollView style={styles.results}>
        <Input onChange={this.handleChange}/>
          <Text>Results</Text>

          {foods.map(food => {
            return (
              <React.Fragment key={food.name}>
                  <FoodSearchItem food={food}/>
                <Divider style={{ backgroundColor: "blue" }} />
              </React.Fragment>
            );
          })}
        </ScrollView>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1
  },
  results: {
    width: "100%",
    alignContent: "center"
  }
});

