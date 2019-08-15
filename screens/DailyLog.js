import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import axios from "axios";
import { Button,ListItem,ThemeProvider } from "react-native-elements";

export default class DailyLog extends React.Component {
  constructor() {
    super();
    this.state = {
      foods: []
    };
  }

  async componentDidMount() {
    var res = await axios.get(
      `https://api.nal.usda.gov/ndb/search/?format=json&q=chicken&sort=n&max=10&offset=0&api_key=VfLLSxw4Odcu042mZ1dySCS2hLJULj5zkhtx1lLy`
    );

    this.setState({
      foods: res.data.list.item
    });
  }

  render() {
    var foods = this.state.foods;

    return (
      <ThemeProvider>

      <ScrollView style={styles.screen}>
        <ScrollView style={styles.results}>
          <Text>Results</Text>
          {foods.map(food => {
            return (
            <ListItem
            key={food.name}
            // leftAvatar={{ source: { uri: l.avatar_url } }}
            title={food.name}
            // subtitle={l.subtitle}
          />
            )
          })}
        </ScrollView>
      </ScrollView>
      </ThemeProvider>

    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    // alignItems: 'center'
  },
  results: {
    width: '100%',
    alignContent: 'center'
  }

});




DailyLog.navigationOptions = {
    title: "Links"
  };