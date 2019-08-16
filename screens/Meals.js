import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

export default class Meals extends React.Component {
  render() {
    return (
      <View>
        <View>
          <Text>MEALS</Text>
        </View>
        <TouchableOpacity>
          <Image source={{ uri: 'https://robohash.org/meal.png' }} />
          <Text>Find meals based on your goals</Text>
        </TouchableOpacity>
      </View>
    );
  }
}
