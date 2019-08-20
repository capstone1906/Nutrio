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
} from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';

import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';

// import FoodSearchItem from "../components/FoodSearchItem";

const Clarifai = require('clarifai');

const clarifai = new Clarifai.App({
  apiKey: 'ec193b71319e40fa9568a580e4358a6b',
});
process.nextTick = setImmediate;

export default class FoodSearch extends React.Component {
  constructor() {
    super();
    this.state = {
      currentSearch: [],
      showError: false,
      searchName: '',
      hasCameraPermission: null,
      type: Camera.Constants.Type.back,
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
          'x-app-id': 'fa4f9042',
          'x-app-key': '997023a117b76d83e33a7ae290a6b5ba',
        },
      }
    );

    // console.log('results are1!!!!:::::', res.data);

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

  // **************   Image recognition *******************  //////////
  async componentDidMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  // After getting permission to use the camera, code for capturing the photo
  capturePhoto = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync();
      return photo.uri;
    }
  };

  // Photo resized for optimization
  resize = async photo => {
    let manipulatedImage = await ImageManipulator.manipulateAsync(
      photo,
      [{ resize: { height: 300, width: 300 } }], // Scale the photo
      { base64: true }
    );
    return manipulatedImage.base64;
  };

  // Get the predictions from Clarifai
  predict = async image => {
    let predictions = await clarifai.models.predict(Clarifai.FOOD_MODEL, image);
    return predictions;
  };

  objectDetection = async () => {
    let photo = await this.capturePhoto();
    let resized = await this.resize(photo);
    let predictions = await this.predict(resized);

    console.log(photo);
    this.setState({ chosenImage: photo });
    this.setState({ predictions: predictions.outputs[0].data.concepts });
  };

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  // Getting photos for the camera roll
  _pickImage = async () => {
    this.getPermissionAsync();
    let selectedImage = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!selectedImage.cancelled) {
      this.setState({ chosenImage: selectedImage.uri });
      let resized = await this.resize(selectedImage.uri);
      let predictions = await this.predict(resized);

      console.log(selectedImage.uri);

      this.setState({ predictions: predictions.outputs[0].data.concepts });
    }
  };

  closeWindow = () => {
    this.setState({
      chosenImage: null,
    });
  };

  render() {
    var foods = this.state.currentSearch;

    return (
      <View style={styles.screen}>
        <Text>Scan Your Plate</Text>
        <View style={styles.cameraToolbar}>
          <TouchableOpacity>
            <Ionicons
              // onPress={}
              name="ios-camera"
              color="red"
              size={90}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons
              onPress={this._pickImage}
              name="ios-photos"
              color="red"
              size={65}
            />
          </TouchableOpacity>
        </View>

        <Text>Search for Food Items</Text>
        <Input onChange={this.handleChange} />

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
  headerTitle: "Today's log",
  headerStyle: {
    backgroundColor: 'crimson',
  },
  headerTintColor: 'white',
};
