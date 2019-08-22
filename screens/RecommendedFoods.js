import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  button: {
    margin: 5,
  },
});

const meals = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];
export default class RecommendedFoods extends React.Component{
  render() {
    return (
      <View>
        {/* <View style={styles.buttonContainer}>
          {meals.map((meal, idx) => (
            <MealButton
              key={idx}
              title={meal}
              handlePress={this.handlePress}
              state={this.state.activeButton}
            />
          ))}
        </View>
        <ScrollView>
          {this.props.recommendedFoods.length
            ? this.props.recommendedFoods.map(meal => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  postFood={this.postFood}
                  mealType={this.state.activeButton}
                />
              ))
            : null}
        </ScrollView> */}
      </View>
    );
  }
}

