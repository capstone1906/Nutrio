import axios from 'axios';
import { ngrok } from '../../secret';

/**
 * ACTION TYPES
 */
const GET_MEALS = 'GET_MEALS';

/**
 * INITIAL STATE
 */
const meals = [];

/**
 * ACTION CREATORS
 */
const getMeals = meals => ({ type: GET_MEALS, meals });

/**
 * THUNK CREATORS
 */

export const deleteMealItem = (foodId, mealId) => async dispatch => {
  try {
    var res2 = await axios.delete(
      `${ngrok}/api/mealFoodItems/${foodId}/${mealId}`
    );
    var res = await axios.get(`${ngrok}/api/meals`);
    dispatch(getMeals(res.data));
  } catch (err) {
    console.error(err);
  }
};
export const getMealsThunk = () => async dispatch => {
  try {
    var res = await axios.get(`${ngrok}/api/meals`);
    dispatch(getMeals(res.data));
  } catch (err) {
    console.error(err);
  }
};

export const postFood = (food, mealId, quantity, grams) => async dispatch => {
  try {
    var res2 = await axios.post(
      `${ngrok}/api/mealFoodItems/${mealId}/${quantity}/${grams}`,
      food
    );
    var res = await axios.get(`${ngrok}/api/meals`);
    dispatch(getMeals(res.data));
  } catch (err) {
    console.error(err);
  }
};

/**
 * REDUCER
 */
export default function(state = meals, action) {
  switch (action.type) {
    case GET_MEALS:
      return action.meals;

    default:
      return state;
  }
}
