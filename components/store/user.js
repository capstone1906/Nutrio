import axios from 'axios';
import { ngrok } from '../../secret';

/**
 * ACTION TYPES
 */
const GET_USER = 'GET_USER';
const ADD_USER = 'ADD_USER';
const UPDATE_USER = 'UPDATE_USER'
/**
 * INITIAL STATE
 */
const user = {};

/**
 * ACTION CREATORS
 */
const getUser = user => ({ type: GET_USER, user });
const addUser = user => ({ type: ADD_USER, user });
// const updateUser = user => ({ type: UPDATE_USER, user });


/**
 * THUNK CREATORS
 */

export const updateUserThunk = (newUser) => async dispatch => {
  try {
    var res = await axios.put(`${ngrok}/api/user/:id`, newUser);

    dispatch(getUserThunk());
  } catch (err) {
    console.error(err);
  }
};

export const getUserThunk = () => async dispatch => {
  try {
    var res = await axios.get(`${ngrok}/api/user`);
    dispatch(getUser(res.data));
  } catch (err) {
    console.error(err);
  }
};

export const addUserThunk = newUser => async dispatch => {
  try {
    await axios.post(`${ngrok}/api/user`, newUser);
    dispatch(addUser(newUser));
  } catch (err) {
    console.error(err);
  }
};

/**
 * REDUCER
 */
export default function(state = user, action) {
  switch (action.type) {
    case GET_USER:
      return action.user;
    case ADD_USER:
      return action.user;
    default:
      return state;
  }
}
