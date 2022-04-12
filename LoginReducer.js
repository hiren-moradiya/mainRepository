import {PASSWORD, EMAIL, FETCH_LOGIN_URL_SUCCESS} from './Actions';
const initialState = {
  email: 'bytes@gmail.com',
  password: 'password',
  token: '',
};
export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case EMAIL:
      return {...state, email: action.payload};

    case PASSWORD:
      return {...state, password: action.payload};

    case FETCH_LOGIN_URL_SUCCESS:
      return {...state, token: action.payload};

    default:
      return state;
  }
};
