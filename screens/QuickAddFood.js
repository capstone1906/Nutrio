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
import axios from 'axios';
import { ListItem } from 'react-native-elements';

export default class QuickAddFood extends React.Component {
  state = {
    selectedFoodsInfo: [],
  };

  async componentDidMount() {
    const foodsSelected = this.props.navigation.getParam('foodsSelected');
    await this.getInfoArray(foodsSelected);
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
            'x-app-id': 'fa4f9042',
            'x-app-key': '997023a117b76d83e33a7ae290a6b5ba',
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
          servingSize: '',
        });
      }
    }
    // console.log('allSelectedFoodData:', infoArray);
    this.setState({ selectedFoodsInfo: infoArray });

    return infoArray;
  };

  handleChange = (text, index) => {
    const newSelectedFoodsInfo = [...this.state.selectedFoodsInfo];
    newSelectedFoodsInfo[index].servingSize = text;

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
            value={item.servingSize}
            keyboardType="number-pad"
            placeholder="Enter Serving Size"
          />
          <Text style={{ fontSize: 20, fontStyle: 'italic' }}>
            {Math.round(Number(item.calories) * Number(item.servingSize))} Cal
          </Text>
        </View>
      }
      leftAvatar={{ source: { uri: item.image } }}
      bottomDivider={true}
    />
  );

  render() {
    const { selectedFoodsInfo } = this.state;
    const mealId = this.props.navigation.getParam('mealId');

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
      onPress={() => alert('Added to Meal')}
      title="Add  "
      color="#fff"
    />
  ),
  headerStyle: {
    backgroundColor: 'crimson',
  },
  headerTintColor: 'white',
};
