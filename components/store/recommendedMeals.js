import axios from 'axios';
import { ngrok } from '../../secret';

const GET_RECOMMENDED_MEALS = 'GET_RECOMMENDED_MEALS';

const getRecommendedMeals = meals => ({ type: GET_RECOMMENDED_MEALS, meals });

export const getRecommendedMealsThunk = meal => {
  return async dispatch => {
    try {
      const { data } = await axios.get(`${ngrok}/api/meals/recommendedMeals`, {
        params: {
          calories: meal.calories,
          carbs: meal.carbs,
          protein: meal.protein,
          fat: meal.fat,
          type: meal.type,
        },
      });
      dispatch(getRecommendedMeals(data));
    } catch (err) {
      console.error(err);
    }
  };
};

export default function(state = [], action) {
  switch (action.type) {
    case GET_RECOMMENDED_MEALS:
      return action.meals;
    default:
      return state;
  }
}
