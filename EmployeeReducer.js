import {
  REQUIST_URL,
  FETCH_URL_FAILURE,
  FETCH_EMPLOYEE_URL_SUCCESS,
} from './Actions';
const initialState = {
  isLoading: false,
  users: [],
  error: '',
};

export const employeeReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUIST_URL:
      return {...state, isLoading: true};

    case FETCH_EMPLOYEE_URL_SUCCESS:
      return {...state, isLoading: false, users: action.payload, error: ''};

    case FETCH_URL_FAILURE:
      return {...state, isLoading: false, error: action.payload, users: []};

    default:
      return state;
  }
};
