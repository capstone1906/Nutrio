import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Button } from 'react-native-elements';
import MealCardChart from './CardChart';
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

const quantityHelper = (name, quantity) => {
  const temp = name.split(' ');
  if (temp[0] === 'large' || temp[0] === 'small' || temp[0] === 'medium') {
    temp[0] = temp[0][0].toUpperCase() + temp[0].slice(1);
    return temp.join(' ');
  } else if (quantity > 1) {
    temp[0] = temp[0] + 's';
    return temp.join(' ');
  } else {
    return name;
  }
};

const foodNameHelper = name => {
  let temp = name.split('');
  temp[0] = temp[0].toUpperCase();
  return temp.join('');
};

function MealCard(props) {
  return (
    <Card title={props.name} style={styles.card}>
      <View>
        <Text h2 style={styles.text}>{props.meal.name}</Text>
        <Text style={styles.text}>
          Total Calories: {props.meal.totalCalories}
        </Text>
        {props.meal.foodItems.map(food => (
          <Text style={styles.text} key={food.id}>
            {foodNameHelper(food.food_name)} | Serving:
            {food.mealFoodItems.quantity === 0
              ? `${food.mealFoodItems.grams} Grams`
              : ` ${food.mealFoodItems.quantity} ${quantityHelper(
                  food.servingSize,
                  food.mealFoodItems.quantity
                )}`}
          </Text>
        ))}
      </View>
      <View style={styles.chartContainer}>
        <MealCardChart meal={props.meal} />
      </View>
      <View>
        <Button
          title="Add Meal"
          type="solid"
          onPress={() => {
            const mealId = props.meals.todaysMeals.filter(meal => {
              if (meal.entreeType === props.mealType) {
                return meal.id;
              }
            })[0].id;
            props.postFood(props.meal.foodItems, mealId, 0, 0, props.user);
          }}
        />
      </View>
    </Card>
  );
}

const mapState = state => {
  return {
    meals: state.meals,
    user: state.user
  };
};

export default connect(mapState)(MealCard);
