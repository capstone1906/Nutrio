import React from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import axios from "axios";

import { Button } from "react-native-elements";

import DatePicker from "react-native-datepicker";

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
  return (
    <View style={styles.FoodTimeContainer}>
      <FoodTimeHeader time={props.time} />
      <Button
        buttonStyle={styles.addFoodButton}
        title="Add food"
        onPress={() => {
          props.navigation.navigate("FoodSearch");
        }}
      />
    </View>
  );
};

export default class DailyLog extends React.Component {
  constructor() {
    super();
    this.state = {
      date: new Date(),

      showDatePicker: false
    };

    this.setDate = this.setDate.bind(this);
  }

  setDate(newDate) {
    this.setState({ chosenDate: newDate });
  }

  async componentDidMount() {
    // console.log('here2')
    // var res2 = await axios.get('https://9e584b3c.ngrok.io/api/meals')
    // console.log('results', res2.data)
  }

  render() {
      console.log('date is', this.state.date)

    return (
      <ScrollView style={styles.container}>
        <View style={styles.date}>
        <DatePicker
          style={{ width: 150 }}
          date={this.state.date}
          mode="date"
          placeholder="select date"
          format="MM-DD-YYYY"
        //   minDate="2016-05-01"
        //   maxDate="2016-06-01"
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
            // ... You can check the source to find the other keys.
          }}
          onDateChange={date => {
            this.setState({ date: date });
          }}
        />    
        </View>


        <Text>Todays Date</Text>
        <FoodTimeContainer
          time="Breakfast"
          navigation={this.props.navigation}
        />
        <FoodTimeContainer time="Lunch" navigation={this.props.navigation} />
        <FoodTimeContainer time="Dinner" navigation={this.props.navigation} />
        <FoodTimeContainer time="Snacks" navigation={this.props.navigation} />
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
    date: {
        justifyContent: 'center',
        paddingLeft: 75,
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
    backgroundColor: "crimson",
    height: 100,
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
