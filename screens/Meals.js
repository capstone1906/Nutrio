import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

export default class Meals extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.touchAble}
          onPress={() => {
            this.props.navigation.navigate('RecommendedMeals');
          }}
        >
          <Image
            style={styles.img}
            source={require('../assets/images/beans.jpg')}
          />
          <View style={styles.absoluteView}>
            <Text style={styles.text}>Find meals based on your goals</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.touchAble}
          onPress={() => {
            this.props.navigation.navigate('RecommendedFoods');
          }}
        >
          <Image
            style={styles.img}
            source={require('../assets/images/beans.jpg')}
          />
          <View style={styles.absoluteView}>
            <Text style={styles.text}>Find foods based on your goals</Text>
          </View>
        </TouchableOpacity>
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
  touchAble: {
    flex: 9,
    paddingBottom: 0,
    paddingTop: 40,
  },
  text: {
    textAlign: 'center',
    marginTop: 10,
    padding: 5,
    fontSize: 16,
    color: 'black'
  },
  container: {
    flex: 40,
    alignItems: 'center',
  },
});

Meals.navigationOptions = {
  headerTitle: 'Meals',
  headerStyle: {
    backgroundColor: 'crimson',
  },
  headerTintColor: 'white',
};
