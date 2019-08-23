import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
const { width: winWidth } = Dimensions.get('window');
import axios from 'axios';
import {
  Button,
  ListItem,
  ThemeProvider,
  Divider,
  Input,
  SearchBar,
} from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
// import Icon from 'react-native-vector-icons/FontAwesome';

export default class FoodSearch extends React.Component {
  constructor() {
    super();
    this.state = {
      currentSearch: [],
      showError: false,
      searchName: '',
      predictions: [],
      chosenImage: null,
    };
    this.handleChange = this.handleChange.bind(this);
  }

  async handleChange(event) {
    event.preventDefault();

    this.setState({
      searchName: event.nativeEvent.text,
    });

    const res = await axios.get(
      `https://trackapi.nutritionix.com/v2/search/instant?query=${
        event.nativeEvent.text
      }`,
      {
        headers: {
          'x-app-id': '5e27fd08',
          'x-app-key': '1e1ee4d0779fb25127320c91ced7c367',
        },
      }
    );

    if (res.data.common) {
      this.setState({
        currentSearch: res.data.common.concat(res.data.branded),
        showError: false,
      });
    } else {
      this.setState({
        showError: true,
      });
    }
  }

  render() {
    var foods = this.state.currentSearch;

    return (
      <View style={styles.screen}>
        <Text>Scan Your Plate</Text>
        <View style={styles.cameraToolbar}>
          <TouchableOpacity>
            <Ionicons
              onPress={() => {
                this.props.navigation.navigate('CameraInterface', {
                  mealId: this.props.navigation.getParam('mealId'),
                });
              }}
              name="ios-camera"
              color="red"
              size={90}
            />
          </TouchableOpacity>
        </View>

        <Text>Search for Food Items</Text>
        <View style={{ justifyContent: 'center' }}>
          <Input
            inputContainerStyle={{
              borderBottomWidth: 0,
              borderRadius: 10,
              backgroundColor: '#e5e4ea',
              width: '85%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            containerStyle={{
              justifyContent: 'center',
              marginTop: 13,
            }}
            leftIcon={{ type: 'font-awesome', name: 'search' }}
            leftIconContainerStyle={{ marginRight: 9 }}
            keyboardAppearance="dark"
            onChange={this.handleChange}
          />
        </View>

        {this.state.searchName !== '' && (
          <ScrollView style={styles.results}>
            {foods.map(food => {
              return (
                <TouchableOpacity key={food.food_name}>
                  <Text
                    style={styles.foodName}
                    onPress={() => {
                      this.props.navigation.navigate('FoodSearchItem', {
                        food: food,
                        mealId: this.props.navigation.getParam('mealId'),
                      });
                    }}
                  >
                    {food.food_name}
                  </Text>
                  <Divider style={{ backgroundColor: 'blue' }} />
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
  },
  cameraToolbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 100,
    width: winWidth,
  },
  results: {
    width: '90%',
    alignContent: 'center',
  },
  foodName: {
    fontSize: 20,
  },
});

FoodSearch.navigationOptions = {
  headerTitle: "Today's Log",
  headerStyle: {
    backgroundColor: 'crimson',
  },
  headerTintColor: 'white',
};
