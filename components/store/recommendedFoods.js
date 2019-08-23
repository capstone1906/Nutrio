import axios from 'axios';
import { ngrok } from '../../secret';

const GET_RECOMMENDED_FOODS = 'GET_RECOMMENDED_FOODS';

const getRecommendedFoods = foods => ({ type: GET_RECOMMENDED_FOODS, foods });

export const getRecommendedFoodsThunk = food => {
  return async dispatch => {
    try {
      const { data } = await axios.get(`${ngrok}/api/food/recommendedFoods/food`, {
        params: {
          calories: food.calories,
          carbs: food.carbs,
          protein: food.protein,
          fat: food.fats,
        },
      });

      dispatch(getRecommendedFoods(data));
    } catch (err) {
      console.error(err);
    }
  };
};

export default function(state = [], action) {
  switch (action.type) {
    case GET_RECOMMENDED_FOODS:
      return action.foods;
    default:
      return state;
  }
}
