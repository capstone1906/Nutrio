import React, { Component } from 'react';
import { View, Text, Image } from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements';

export default function MealCard(props) {
  return (
    <Card title={props.name}>
      <Text>{props.meal.name}</Text>
      <Text>Total Calories: {props.meal.totalCalories}</Text>
      {props.meal.foodItems.map(food => (
        <Text key={food.id}>
          {food.food_name}, Quantity:{' '}
          {food.mealFoodItems.quantity === 0
            ? food.mealFoodItems.grams
            : food.mealFoodItems.quantity}
        </Text>
      ))}
    </Card>
  );
}
