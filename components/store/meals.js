import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_MEALS = 'GET_MEALS'

/**
 * INITIAL STATE
 */
const meals = []

/**
 * ACTION CREATORS
 */
const getMeals = meals => ({type: GET_MEALS, meals})


/**
 * THUNK CREATORS
 */
export const getMealsThunk = () => async dispatch => {
  try {
    var res = await axios.get("https://9e584b3c.ngrok.io/api/meals");
    dispatch(getMeals(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const postFood = (food, mealId) => async dispatch => {
    try {
      var res2 = await axios.post(`https://9e584b3c.ngrok.io/api/mealFoodItems/${mealId}`, food);
  
      var res = await axios.get("https://9e584b3c.ngrok.io/api/meals");
      dispatch(getMeals(res.data))
    } catch (err) {
      console.error(err)
    }
  }


/**
 * REDUCER
 */
export default function(state = meals, action) {
  switch (action.type) {
    case GET_MEALS:
      return action.meals

    default:
      return state
  }
}