import React from "react";
import axios from "axios";

import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from "react-native";

export default class FoodSearchItem extends React.Component {
  constructor() {
    super();

    this.state = {
      foodInfo: {},
      showData: false,
      isOpen: false
    };

    // this.getData = this.getData.bind(this)
    // this.addFood = this.addFood.bind(this)
  }

  //   handleOpen = () => {
  //     this.setState({isOpen: true})

  //     this.timeout = setTimeout(() => {
  //       this.setState({isOpen: false})
  //     }, timeoutLength)
  //   }

  //   handleClose = () => {
  //     this.setState({isOpen: false})
  //     clearTimeout(this.timeout)
  //   }

  //   addFood() {
  //     var name = this.state.foodInfo.name.split(',')

  //     var newName = ''
  //     name.forEach((str, index) => {
  //       if (index !== name.length - 1) {
  //         newName += str
  //       }
  //     })

  //     newName = newName.split(' ')
  //     newName = newName.map(word => {
  //       word = word.toLowerCase()
  //       return word.charAt(0).toUpperCase() + word.slice(1)
  //     })

  //     newName = newName.join(' ')

  //     var newFood = {
  //       name: newName,
  //       calories: Math.floor(this.state.foodInfo.nutrients[0].value),
  //       protein: Math.floor(this.state.foodInfo.nutrients[1].value),
  //       fat: Math.floor(this.state.foodInfo.nutrients[2].value),
  //       carbs: Math.floor(this.state.foodInfo.nutrients[3].value),
  //       time: window.location.href.split('/')[6],
  //       userId: this.props.user.id
  //     }

  //     var quantity = document.getElementById('quantity')
  //     var amount = quantity.options[quantity.selectedIndex].value

  //     if (!amount) {
  //       amount = 0
  //       this.props.postFood(newFood)
  //     }

  //     for (let i = 0; i < amount; i++) {
  //       this.props.postFood(newFood)
  //     }
  //   }

  // async getData() {
  //   var data = this.state.foodInfo

  //   if (this.state.foodInfo.nutrients === undefined) {
  //     const res = await axios.get(
  //       `https://api.nal.usda.gov/ndb/nutrients/?format=json&api_key=VfLLSxw4Odcu042mZ1dySCS2hLJULj5zkhtx1lLy&nutrients=205&nutrients=204&nutrients=208&nutrients=203&ndbno=${
  //         this.props.food.ndbno
  //       }`
  //     )

  //     data = res.data.report.foods[0]
  //   }

  //   this.setState({
  //     foodInfo: data,
  //     showData: !this.state.showData
  //   })
  // }

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

    // console.log('data', data)
    this.setState({
      foodInfo: data,
      showData: !this.state.showData
    });
  }

  render() {
    // var name = this.props.food.name.split(',')

    // var newName = ''
    // name.forEach((name, index) => {
    //   if (!name.includes('UPC:') && !name.includes('GTIN:')) {
    //     newName += name
    //   }
    // })

    // newName = newName.split(' ')
    // newName = newName.map(word => {
    //   word = word.toLowerCase()
    //   return word.charAt(0).toUpperCase() + word.slice(1)
    // })

    // newName = newName.join(' ')
    console.log("state", this.state);
    return (
      <View>
        <Text>Single Item Page</Text>
        <Text>{this.state.foodInfo.name}</Text>

        {this.state.foodInfo.nutrients ? (
          <View id="foodSearchItem">
            <Text id="foodSearchItemInfo">
              Calories: {Math.ceil(this.state.foodInfo.nutrients[0].value)}
            </Text>
            <Text id="foodSearchItemInfo">
              Protein: {Math.ceil(this.state.foodInfo.nutrients[1].value)}
            </Text>
            <Text id="foodSearchItemInfo">
              Fat: {Math.ceil(this.state.foodInfo.nutrients[2].value)}
            </Text>
            <Text id="foodSearchItemInfo">
              Carbs: {Math.ceil(this.state.foodInfo.nutrients[3].value)}
            </Text>
            <Text id="foodSearchItemInfo">
              Serving size: {this.state.foodInfo.measure}
            </Text>
            <Text id="foodSearchItemInfo">
              Grams: {this.state.foodInfo.weight}
            </Text>
          </View>
        ) : null}

        {/* <div style={{display: 'flex', flexDirection: 'row'}}>
              <Popup
                trigger={<Button id='addFoodButton' onClick={() => this.addFood()}content="Add food" />}
                content={`Food added to ${window.location.href.split('/')[6]}!`}
                on="click"
                open={this.state.isOpen}
                onClose={this.handleClose}
                onOpen={this.handleOpen}
                position="top right"
              />
              <select id="quantity" placeholder="Quantity">
                <option value="1"> 1</option>
                <option value="2"> 2</option>
                <option value="3"> 3</option>
                <option value="5"> 5</option>
                <option value="6"> 6</option>
                <option value="7"> 7</option>
                <option value="8"> 8</option>
                <option value="9"> 9</option>
                <option value="10"> 10</option>
              </select>
            </div> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  FoodName: {
    fontSize: 20
  }
});


FoodSearchItem.navigationOptions = {
  headerTitle: "Today's log",
  headerStyle: {
      backgroundColor: 'crimson'
  },
  headerTintColor: 'white'
}