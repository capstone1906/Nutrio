import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
} from 'react-native';

export default class Meals extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require('../assets/images/foodDishes.jpg')}
          style={styles.backgroundButtonMeals}
          imageStyle={{ borderRadius: 25 }}
        >
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('RecommendedMeals');
            }}
          >
            <Text style={styles.text}>Find Meals</Text>
          </TouchableOpacity>
        </ImageBackground>
        <ImageBackground
          source={require('../assets/images/rawFruits.jpg')}
          style={styles.backgroundButtonFood}
          imageStyle={{ borderRadius: 25 }}
        >
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('RecommendedFoods');
            }}
          >
            <Text style={styles.text}>Find Food</Text>
          </TouchableOpacity>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  img: {
    maxWidth: '85%',
    maxHeight: '55%',
    marginTop: 10,
    borderRadius: 10,
  },
  absoluteView: {
    flex: 5,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  backgroundButtonMeals: {
    flex: 9,
    paddingBottom: 0,
    margin: 40,
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
    marginBottom: 15,
  },
  backgroundButtonFood: {
    flex: 9,
    paddingBottom: 0,
    margin: 40,
    justifyContent: 'center',
    alignItems: 'center',
    width: 300,
  },
  text: {
    textAlign: 'center',
    padding: 20,
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
    textShadowColor: 'black',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  container: {
    flex: 40,
    alignItems: 'center',
    backgroundColor: '#F5ECCD',
    justifyContent: 'center',
  },
});

Meals.navigationOptions = {
  headerTitle: 'Meals',
  headerStyle: {
    backgroundColor: '#1E90FF',
  },
  headerTintColor: 'white',
};
