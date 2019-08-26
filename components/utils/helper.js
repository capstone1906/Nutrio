export default function totalCalc(props) {
  let calories = 0;
  let fat = 0;
  let protein = 0;
  let carbs = 0;
  props.foodItems.map(foodItem =>{
    calories += foodItem.calories;
    fat += foodItem.fat;
    protein += foodItem.protein;
    carbs += foodItem.carbohydrates
  })
  const total = {
    calories,
    fat,
    protein,
    carbs
  }
  return total
}
