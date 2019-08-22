import React, { Component } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements';
import MealCardChart from './MealCardChart';

const styles = StyleSheet.create({
  card: {
    flexDirection: 'column',
  },
  text: {
    textAlign: 'center',
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

export default function MealCard(props) {
  return (
    <Card title={props.name} style={styles.card}>
      <View>
        <MealCardChart meal={props.meal} />
        <Text style={styles.text}>{props.meal.name}</Text>
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
      <View>
        <Button title="Add Meal" type="solid" />
      </View>
    </Card>
  );
}
