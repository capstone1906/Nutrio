import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

export default class Meals extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
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
        <TouchableOpacity onPress={() => {
            this.props.navigation.navigate('RecommendedFoods');
          }}>
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
  },
  absoluteView: {
    flex: 1,
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  text: {
    textAlign: 'center',
  },
  container: {
    flex: 1,
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
