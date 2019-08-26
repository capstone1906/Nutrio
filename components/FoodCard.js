import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Button, Text } from 'react-native-elements';
import CardChart from './CardChart';
import { connect } from 'react-redux';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
  },
  text: {
    textAlign: 'center',
  },
  chartContainer: {
    alignItems: 'center',
  },
});

const foodNameHelper = name => {
  let temp = name.split('');
  temp[0] = temp[0].toUpperCase();
  return temp.join('');
};

function FoodCard(props) {
  return (
    <Card title={props.name} style={styles.card}>
      <View>
        <Text h2 style={styles.text}>
          {foodNameHelper(props.food.food_name)}
        </Text>
        <Text style={styles.text}>Total Calories: {props.food.calories}</Text>
      </View>
      <View style={styles.chartContainer}>
        <CardChart food={props.food} />
      </View>
      <View>
        <Button
          title="Add to Meal"
          type="solid"
          onPress={() => {
            const mealId = props.meals.todaysMeals.filter(meal => {
              if (meal.entreeType === props.mealType) {
                return meal.id;
              }
            })[0].id;
            props.postFood(props.food, mealId, 0, 0, props.user.id);
          }}
        />
      </View>
    </Card>
  );
}

const mapState = state => {
  return {
    meals: state.meals,
    user: state.user,
  };
};

export default connect(mapState)(FoodCard);
