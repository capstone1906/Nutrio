import axios from 'axios';

/**
 * ACTION TYPES
 */
const GET_USER = 'GET_USER';
const ADD_USER = 'ADD_USER';

/**
 * INITIAL STATE
 */
const user = {};

/**
 * ACTION CREATORS
 */
const getUser = user => ({ type: GET_USER, user });
const addUser = user => ({ type: ADD_USER, user });

/**
 * THUNK CREATORS
 */

export const getUserThunk = () => async dispatch => {
  try{
    var res = await axios.get("https://e1a2521c.ngrok.io/api/user");
    dispatch(getUser(res.data));
  } catch (err) {
    console.error(err);
  }
};

export const addUserThunk = newUser => async dispatch => {
  try {
    await axios.post('https://9e584b3c.ngrok.io/api/user', newUser);
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
