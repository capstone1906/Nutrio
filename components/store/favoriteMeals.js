import axios from 'axios';
import { ngrok } from '../../secret8';

const GET_FAVORITE_MEALS = 'GET_FAVORITE_MEALS';
const ADD_FAVORITE_MEAL = 'ADD_FAVORITE_MEAL';
const REMOVE_FAVORITE_MEAL = 'REMOVE_FAVORITE_MEAL'

const getFavoriteMeals = meals => ({ type: GET_FAVORITE_MEALS, meals });
const addFavoriteMeal = meal => ({ type: ADD_FAVORITE_MEAL, meal });
const removeFavoriteMeal = meal =>({type: REMOVE_FAVORITE_MEAL, meal})

export const getFavoriteMealsThunk = userId => {
  return async dispatch => {
    try {
      const { data } = await axios.get(`${ngrok}/api/favoriteMeals/${userId}`);
      dispatch(getFavoriteMeals(data));
    } catch (err) {
      console.error(err);
    }
  };
};

export const addToFavoriteMealsThunk = (userId, mealId) => {
  return async dispatch => {
    try {
      const { data } = await axios.post(
        `${ngrok}/api/favoriteMeals/${userId}/${mealId}`
      );
      dispatch(addFavoriteMeal(data));
    } catch (err) {
      console.error(err);
    }
  };
};

export const removeFromFavoriteMealsThunk = (userId, mealId) =>{
  return async dispatch =>{
    try{
      const {data} = await axios.delete(`${ngrok}/api/favoriteMeals/${userId}/${mealId}`)
      console.log('data', data)
      dispatch(removeFavoriteMeal(data))
    }catch(err){
      console.error(err)
    }
  }
}

export default function(state = [], action) {
  switch (action.type) {
    case GET_FAVORITE_MEALS:
      return action.meals;
    case ADD_FAVORITE_MEAL:
      return state.map(item => {
        if (item.id === action.meal.id) {
          return action.meal;
        } else {
          return item
        }
      });
    case REMOVE_FAVORITE_MEAL:
      return state.filter(item =>{
        return item.id !== action.meal.mealId
      })
    default:
      return state;
  }
}
