import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function UserJoinScreen(props) {
  const navigate = props.navigation.navigate;
  return (
    <View>
      <Text>Login Page</Text>
      <TouchableOpacity onPress={() => navigate('Main')}>
        <View style={styles.joinSignIn}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </View>
      </TouchableOpacity>
      <Text>Google Auth Button Here</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  joinSignIn: {
    alignItems: 'center',
    backgroundColor: 'rgb(200,200,200)',
    borderRadius: 205,
    margin: 30,
  },
  buttonText: {
    fontSize: 25,
    color: '#2e78b7',
    margin: 20,
  },
});
