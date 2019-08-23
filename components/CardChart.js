import React from 'react';
import { VictoryPie, VictoryLegend } from 'victory-native';
import { View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '90%',
  },
});

const CardChart = props => {
  let carbs;
  let protein;
  let fat;
  if (props.meal) {
    carbs = props.meal.totalCarbs;
    protein = props.meal.totalProtein;
    fat = props.meal.totalFat;
  } else {
    carbs = props.food.carbohydrates;
    protein = props.food.protein;
    fat = props.food.fat;
  }

  return (
    <View style={styles.container}>
      <VictoryPie
        height={165}
        width={165}
        padAngle={2}
        innerRadius={55}
        colorScale={['crimson', 'limegreen', 'navy']}
        data={[
          {
            x: 1,
            y: fat,
          },
          {
            x: 2,
            y: carbs,
          },
          {
            x: 3,
            y: protein,
          },
        ]}
        labelRadius={87}
        style={{
          labels: {
            fill: 'white',
            fontSize: 0,
          },
        }}
      />
      <VictoryLegend
        x={0}
        y={0}
        height={140}
        width={350}
        title="Macros"
        centerTitle
        orientation="vertical"
        gutter={10}
        style={{ title: { fontSize: 14 }, data: { fontSize: 10 } }}
        data={[
          { name: `Protein ${protein}g`, symbol: { fill: 'navy' } },
          { name: `Fat ${fat}g`, symbol: { fill: 'crimson' } },
          { name: `Carbs ${carbs}g`, symbol: { fill: 'limegreen' } },
        ]}
      />
    </View>
  );
};

export default CardChart;
