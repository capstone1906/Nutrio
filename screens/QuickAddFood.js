import React from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
  TextInput,
  Image,
  Button,
} from 'react-native';
const { width: winWidth } = Dimensions.get('window');
import { connect } from 'react-redux';
import axios from 'axios';
import { ListItem } from 'react-native-elements';
import { postFood } from '../components/store/meals';

class QuickAddFood extends React.Component {
  state = {
    selectedFoodsInfo: [],
  };

  async componentDidMount() {
    const foodsSelected = this.props.navigation.getParam('foodsSelected');
    await this.getInfoArray(foodsSelected);
    this.props.navigation.setParams({
      selectedFoodsInfo: this.state.selectedFoodsInfo,
    });
  }

  retrieveData = async item => {
    console.log('checking for ', item);
    try {
      const res = await axios.post(
        `https://trackapi.nutritionix.com/v2/natural/nutrients`,
        {
          query: `${item}`,
        },
        {
          headers: {
            'x-app-id': '571e77e8',
            'x-app-key': '2580a4dbee98751ccda81d461f7f7728',
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
          servingSize: food.serving_unit,
        };
      }
    } catch (error) {
      console.log('ERROR for ', item);
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
          quantity: '',
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
          width: '82%',
          backgroundColor: '#CED0CE',
          marginLeft: '18%',
        }}
      />
    );
  };

  keyExtractor = (item, index) => index.toString();

  renderItem = ({ item, index }) => (
    <ListItem
      title={
        <View>
          <Text style={{ fontSize: 26, fontWeight: 'bold' }}>{item.name}</Text>
        </View>
      }
      subtitle={
        <View>
          <TextInput
            style={{ fontSize: 17 }}
            onChangeText={text => this.handleChange(text, index)}
            value={item.quantity}
            keyboardType="number-pad"
            placeholder="Enter Quantity"
          />
          <Text style={{ fontSize: 20, fontStyle: 'italic' }}>
            {Math.round(Number(item.calories) * Number(item.quantity))} Cal
          </Text>
        </View>
      }
      leftAvatar={{ source: { uri: item.image } }}
      bottomDivider={true}
    />
  );

  postFood = array => {
    const mealId = this.props.navigation.getParam('mealId');

    for (let i = 0; i < array.length; i++) {
      const newFood = {
        food_name: array[i].name,
        calories: array[i].calories,
        fat: array[i].fat,
        protein: array[i].protein,
        carbohydrates: array[i].carbohydrates,
        weight: array[i].weight,
        servingSize: array[i].servingSize,
      };

      this.props.postFood(
        newFood,
        mealId,
        Math.round(Number(array[i].quantity)),
        0
      );
    }

    alert('Added to Meal');
  };

  render() {
    const { selectedFoodsInfo } = this.state;

    console.log('selectedFoodsInfo is now ', selectedFoodsInfo);

    return (
      <FlatList
        keyExtractor={this.keyExtractor}
        data={selectedFoodsInfo}
        renderItem={this.renderItem}
        ItemSeparatorComponent={this.renderSeparator}
      />
    );
  }
}

QuickAddFood.navigationOptions = {
  headerTitle: 'Enter Serving Size',
  headerRight: (
    <Button
      style={{ fontWeight: 'bold' }}
      onPress={() =>
        this.postFood(this.props.navigation.getParam('selectedFoodsInfo'))
      }
      title="Add  "
      color="#fff"
    />
  ),
  headerStyle: {
    backgroundColor: 'crimson',
  },
  headerTintColor: 'white',
};

const mapDispatch = dispatch => {
  return {
    postFood: (food, mealId, quantity, grams) =>
      dispatch(postFood(food, mealId, quantity, grams)),
  };
};

export default connect(
  null,
  mapDispatch
)(QuickAddFood);
