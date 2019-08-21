import axios from 'axios';
import { ngrok } from '../../secret';

/**
 * ACTION TYPES
 */
const GET_EXERCISES = 'GET_EXERCISES';

/**
 * INITIAL STATE
 */
const exercises = {};

/**
 * ACTION CREATORS
 */
const getExercises = exercises => ({ type: GET_EXERCISES, exercises });

/**
 * THUNK CREATORS
 */

export const getExercisesThunk = (name) => async dispatch => {
  try {
    var res = await axios.get(`${ngrok}/api/exercises/${name}`);
    dispatch(getExercises(res.data));
  } catch (err) {
    console.error(err);
  }
}

/**
 * REDUCER
 */
export default function(state = exercises, action) {
  switch (action.type) {
    case GET_EXERCISES:
      return action.exercises;

    default:
      return state;
  }
}
