import axios from 'axios';
import { ngrok } from '../../secret8';

/**
 * ACTION TYPES
 */
const GET_MEALS = 'GET_MEALS';
const REMOVE_FROM_MEAL = 'REMOVE_FROM_MEAL';

/**
 * INITIAL STATE
 */
const meals = {
  todaysMeals: [],
  allMeals: [],
};

/**
 * ACTION CREATORS
 */
const getMeals = meals => ({ type: GET_MEALS, meals });
const deleteFromMeal = (foodId, mealId, meal) => ({
  type: REMOVE_FROM_MEAL,
  foodId,
  mealId,
  meal,
});

/**
 * THUNK CREATORS
 */

export const deleteMealItem = (foodId, mealId, userId) => async dispatch => {
  try {
    const { data } = await axios.delete(
      `${ngrok}/api/mealFoodItems/${foodId}/${mealId}/${userId}`
    );
    dispatch(deleteFromMeal(foodId, mealId, data));
  } catch (err) {
    console.error(err);
  }
};

export const getMealsThunk = (dateVar, userId) => async dispatch => {
  try {
    var res = await axios.get(`${ngrok}/api/meals/${userId}`, {params: {
      date: dateVar
    }});
    
    var todaysDate = dateVar;
    if (!dateVar) {
      todaysDate = new Date();
      const dateNow = new Date();

      var year = dateNow.getFullYear().toString();
      var month = (dateNow.getMonth() + 1).toString();
      var day = dateNow.getDate().toString();

      if (month < 10) {
        month = '0' + month;
      }
      if (day < 10) {
        day = '0' + day;
      }
      todaysDate = year + '-' + month + '-' + day;
    }

    var foods = res.data;
    var breakfast = {};
    var lunch = {};
    var dinner = {};
    var snacks = {};

    if (foods !== undefined) {
      for (let i = 0; i < foods.length; i++) {
        var today = new Date(todaysDate);

        var setDay = today.getDate() + 1;
        var setMonth = today.getMonth();
        var setYear = today.getYear();

        var mealTime = new Date(foods[i].createdAt);
        var mealDay = mealTime.getDate();
        var mealMonth = mealTime.getMonth();
        var mealYear = mealTime.getYear();

        if (
          foods[i].entreeType === 'Breakfast' &&
          mealDay === setDay &&
          setMonth === mealMonth &&
          setYear === mealYear
        ) {
          breakfast = foods[i];
        } else if (
          foods[i].entreeType === 'Lunch' &&
          mealDay === setDay &&
          setMonth === mealMonth &&
          setYear === mealYear
        ) {
          lunch = foods[i];
        } else if (
          foods[i].entreeType === 'Dinner' &&
          mealDay === setDay &&
          setMonth === mealMonth &&
          setYear === mealYear
        ) {
          dinner = foods[i];
        } else if (
          foods[i].entreeType === 'Snacks' &&
          mealDay === setDay &&
          setMonth === mealMonth &&
          setYear === mealYear
        ) {
          snacks = foods[i];
        }
      }
    }

    var allMeals = {};
    allMeals.allMeals = res.data;
    allMeals.todaysMeals = [breakfast, lunch, dinner, snacks];

    dispatch(getMeals(allMeals));
  } catch (err) {
    console.error(err);
  }
};

export const postFood = (
  food,
  mealId,
  quantity,
  grams,
  userId
) => async dispatch => {
  try {
    var {data} = await axios.post(
      `${ngrok}/api/mealFoodItems/${mealId}/${quantity}/${grams}/${userId}`,
      food
    );
    dispatch(getMealsThunk('', userId));
    return data;
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
    case REMOVE_FROM_MEAL:
      const newTodaysMeals = state.todaysMeals.map(meal => {
        if (meal.id === action.mealId) {
          meal = action.meal;
          return meal;
        }
        return meal;
      });
      return { ...state, todaysMeals: newTodaysMeals };
    default:
      return state;
  }
}
