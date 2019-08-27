/* eslint-disable no-alert */
import React from 'react';
import {
  FlatList,
  Text,
  View,
  TouchableOpacity,
  StatusBar,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons } from '@expo/vector-icons';
import { Col, Row, Grid } from 'react-native-easy-grid';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import axios from 'axios';
import SelectMultiple from 'react-native-select-multiple';
import { nixID, nixKey } from '../secret8';

const { width: winWidth } = Dimensions.get('window');
const Clarifai = require('clarifai');

const clarifai = new Clarifai.App({
  apiKey: 'ec193b71319e40fa9568a580e4358a6b',
});
process.nextTick = setImmediate;

export default class CameraInterface extends React.Component {
  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    predictions: [],
    chosenImage: null,
    selectedFoods: [],
    loading: false,
  };

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

  checkIfExist = async result => {
    console.log('checking for ', result.name);
    try {
      const res = await axios.post(
        `https://trackapi.nutritionix.com/v2/natural/nutrients`,
        {
          query: `${result.name}`,
        },
        {
          headers: {
            'x-app-id': nixID,
            'x-app-key': nixKey,
            'x-remote-user-id': '0',
          },
        }
      );
      if (res.data.foods[0]) return true;
    } catch (error) {
      console.log('ERROR for ', result.name);
      return false;
    }
  };

  objectDetection = async () => {
    let photo = await this.capturePhoto();
    let resized = await this.resize(photo);
    let predictions = await this.predict(resized);

    const results = predictions.outputs[0].data.concepts;

    var filteredResults = [];
    this.setState({
      loading: true,
    });
    for (let i = 0; i < results.length; i++) {
      const ifExist = await this.checkIfExist(results[i]);
      if (ifExist === true) {
        filteredResults.push(
          `${results[i].name.charAt(0).toUpperCase() +
            results[i].name.slice(1)}`
        );
      }
    }
    this.setState({
      loading: false,
    });
    console.log('filtered:', filteredResults);

    this.setState({ chosenImage: photo });
    this.setState({ predictions: filteredResults });
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

  onSelectionsChange = selectedFoods => {
    this.setState({ selectedFoods });
  };

  render() {
    // renders the camera and translation results

    const { hasCameraPermission, predictions } = this.state;
    if (hasCameraPermission === null) {
      return <View />;
    } else if (hasCameraPermission === false) {
      return (
        <View style={styles.noCamera}>
          <StatusBar hidden={true} />
          <Text>No access to camera</Text>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          {this.state.loading ? (
            <View style={styles.loader}>
              <ActivityIndicator size="large" color="#1E90FF" />
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <StatusBar hidden={true} />
              {!this.state.chosenImage && (
                <Camera
                  ref={ref => {
                    this.camera = ref;
                  }}
                  style={{ flex: 1 }}
                  type={this.state.type}
                >
                  <View style={styles.container}>
                    {/* bottom toolbar */}
                    <Grid style={styles.bottomToolbar}>
                      <Row>
                        <Col style={styles.alignCenter}>
                          <TouchableOpacity>
                            <Ionicons
                              onPress={this._pickImage}
                              name="ios-photos"
                              color="white"
                              size={65}
                            />
                          </TouchableOpacity>
                        </Col>
                        <Col size={2} style={styles.alignCenter}>
                          <TouchableOpacity>
                            <Ionicons
                              onPress={this.objectDetection}
                              name="ios-camera"
                              color="white"
                              size={90}
                            />
                          </TouchableOpacity>
                        </Col>
                        <Col style={styles.alignCenter}>
                          <TouchableOpacity>
                            <Ionicons
                              onPress={() => {
                                this.props.navigation.navigate('FoodSearch');
                              }}
                              name="md-close"
                              color="white"
                              size={75}
                            />
                          </TouchableOpacity>
                        </Col>
                      </Row>
                    </Grid>
                  </View>
                </Camera>
              )}

              {this.state.chosenImage && (
                <View>
                  <SelectMultiple
                    labelStyle={{ fontSize: 25 }}
                    checkboxStyle={{ width: 27, height: 27, marginRight: 15 }}
                    items={predictions}
                    selectedItems={this.state.selectedFoods}
                    onSelectionsChange={this.onSelectionsChange}
                    style={{ marginBottom: 37 }}
                    keyExtractor={(item, index) => index.toString()}
                  />
                  <Grid style={styles.resultToolbar}>
                    <Row>
                      <Col>
                        <TouchableOpacity
                          style={{ backgroundColor: '#d9534e' }}
                        >
                          <Ionicons
                            style={styles.closeButton}
                            onPress={() => {
                              this.props.navigation.navigate('FoodSearch');
                            }}
                            name="md-close"
                            color="white"
                            size={35}
                          />
                        </TouchableOpacity>
                      </Col>
                      <Col>
                        <TouchableOpacity
                          style={{ backgroundColor: '#337ab7' }}
                        >
                          <Ionicons
                            style={styles.closeButton}
                            onPress={() => {
                              this.props.navigation.navigate('QuickAddFood', {
                                foodsSelected: this.state.selectedFoods,
                                mealId: this.props.navigation.getParam(
                                  'mealId'
                                ),
                              });
                            }}
                            name="md-checkmark"
                            color="white"
                            size={35}
                          />
                        </TouchableOpacity>
                      </Col>
                    </Row>
                  </Grid>
                </View>
              )}
            </View>
          )}
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  alignCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomToolbar: {
    width: winWidth,
    position: 'absolute',
    height: 100,
    bottom: 0,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  closeButton: {
    textAlign: 'center',
  },
  noCamera: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 70,
    color: 'black',
  },
  resultToolbar: {
    width: winWidth,
    position: 'absolute',
    height: 37,
    bottom: 0,
  },
  loader: {
    height: '100%',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    backgroundColor: '#F5ECCD',
  },
});

CameraInterface.navigationOptions = {
  headerTitle: 'Food Scanner',
  headerStyle: {
    backgroundColor: '#1E90FF',
  },
  headerTintColor: 'white',
};
