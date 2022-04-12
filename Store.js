import {reducer} from './LoginReducer';
import {employeeReducer} from './EmployeeReducer';
import thunk from 'redux-thunk';
import {combineReducers, createStore, applyMiddleware} from 'redux';

const rootReducer = combineReducers({reducer, employeeReducer});

export const store = createStore(rootReducer, applyMiddleware(thunk));
