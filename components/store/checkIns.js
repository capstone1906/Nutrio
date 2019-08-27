import axios from 'axios';
import { ngrok } from '../../secret8';

/**
 * ACTION TYPES
 */
const GET_CHECKINS = 'GET_CHECKINS';

/**
 * INITIAL STATE
 */
const checkIns = {};

/**
 * ACTION CREATORS
 */
const getCheckIns = checkIns => ({ type: GET_CHECKINS, checkIns });

/**
 * THUNK CREATORS
 */

export const getCheckInsThunk = () => async dispatch => {
  try {
    var res = await axios.get(`${ngrok}/api/checkIns/`);
    dispatch(getCheckIns(res.data));
  } catch (err) {
    console.error(err);
  }
};

export const updateCheckIn = (id, checkIn) => async dispatch => {
  try {
    var res2 = await axios.put(`${ngrok}/api/checkIns/${id}`, checkIn);
    var res = await axios.get(`${ngrok}/api/checkIns/`);
    dispatch(getCheckIns(res.data));
  } catch (err) {
    console.error(err);
  }
};

/**
 * REDUCER
 */
export default function(state = checkIns, action) {
  switch (action.type) {
    case GET_CHECKINS:
      return action.checkIns;
    default:
      return state;
  }
}
