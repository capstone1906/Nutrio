import React from 'react';
import { VictoryPie } from 'victory-native';

const MealCardChart = props => {
  let carbs = props.meal.totalCarbs;
  let protein = props.meal.totalProtein;
  let fat = props.meal.totalFat;
  return (
    <VictoryPie
      colorScale={['crimson', 'limegreen', 'navy']}
      data={[
        {
          x: `Fat: ${fat}g`,
          y: fat,
        },
        {
          x: `Carbs: ${carbs}g`,
          y: carbs,
        },
        {
          x: `Protein: ${protein}g`,
          y: protein,
        },
      ]}
      labelRadius={87}
      style={{
        labels: {
          fill: 'white',
          fontSize: 14,
          padding: '5px',
          margin: '5px',
        },
      }}
    />
  );
};

export default MealCardChart;
