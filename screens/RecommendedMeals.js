import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Button,
} from 'react-native';

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
});
export default class RecommendedMeals extends React.Component {
  constructor() {
    super();
    this.state = {
      activeButton: 'Breakfast',
    };
    this.handlePress = this.handlePress.bind(this);
  }
  handlePress(evt) {}
  render() {
    return (
      <View>
        <View style={styles.buttonContainer}>
          <Button
            title="Breakfast"
            onPress={evt => this.handlePress(evt)}
            isActive={this.state.activeButton === 'Breakfast'}
          />
          <Button title="Lunch" onPress={evt => this.handlePress(evt)} />
          <Button title="Dinner" onPress={evt => this.handlePress(evt)} />
          <Button title="Snacks" onPress={evt => this.handlePress(evt)} />
        </View>
        <ScrollView>
          <View />
        </ScrollView>
      </View>
    );
  }
}

RecommendedMeals.navigationOptions = {
  headerTitle: 'Recommended Meals',
  headerStyle: {
    backgroundColor: 'crimson',
  },
  headerTintColor: 'white',
};
